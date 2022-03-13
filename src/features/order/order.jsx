import { Button, Chip, CircularProgress, Snackbar } from '@material-ui/core';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useHistory } from "react-router-dom";
import OnmenuButton from '../../components/button';
import SimpleSnackbar from '../../components/snackbar';
import { firestore } from '../../config/firebase';
import { selectAuth } from '../auth/authSlice';
import { setCurrent } from '../bottomNav/bottomSlice';
import {  removeTakeAway, selectCart } from '../cart/cartSlice';
import { loadScript, paymentResult } from '../payment/payment';
import { calcDishTotal, getVariantImage } from '../restaurant/dishCard';
import { selectrestaurant, setRestaurant } from '../restaurant/restaurantSlice';
import firebase from 'firebase/app' 
import { Directions, Phone, WhatsApp } from '@material-ui/icons';
const errorMsg = 'Something changed while you\'re placing order! the restaurant may stopped taking order or prices changed. please try again '
const amountRegex =/^\d+(\.\d{1,2})?$/;
export default function Index() {
    const { restaurantId, orderId } = useParams();
    const history = useHistory()
    const dispatch = useDispatch()
    const cart = useSelector(selectCart)
    const restaurant = useSelector(selectrestaurant)
    const [order, setOrder] = useState(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    // const [prefill, setPrefill] = useState({
    //     name: "",
    //     email: "",
    //     contact: "",
    //     amount:'',
    //   });

    useEffect(() => {
    dispatch(setRestaurant(restaurantId))
    dispatch(setCurrent('cart'))
    if(orderId && restaurant.restaurantId){
        firestore.collection('orders').doc(orderId)
        .onSnapshot(doc=>{
            if(doc.exists){
                setOrder(doc.data())
            }else{
                history.push(`/restaurant/${restaurantId}`)
            }
        })
    }
    }, [])
    useEffect(() => {
        if(orderId && restaurant.restaurant && restaurant.restaurant.restaurantId){
            firestore.collection('orders').doc(orderId)
            .onSnapshot(doc=>{
                if(doc.exists){
                    setOrder(doc.data())
                }else{
                    history.push(`/restaurant/${restaurantId}`)
                }
            })
        }
    }, [restaurantId]);
    
    const loadRazorpay = async () => {
        const prefill = {
            name: order.userName,
            email: '',
            contact: order.phoneNumber,
            amount:order.totalAmount,
          }
        if (!error && amountRegex.test(parseFloat(order.totalAmount))) {
            var options = {
              key: restaurant.restaurant.razorpayId,
              handler: async (response) => {
                
                var result = {
                  ...paymentResult,
                  status: 'success',
                  paymentStatus: 'Success',
                  timeStamp:firebase.firestore.FieldValue.serverTimestamp(),
                  ...prefill,
                  restaurantId:restaurantId,
                //   order:order.orderId,
                }
              
                await firestore.collection('payment').add(result)
                await firestore.collection('orders').doc(orderId).update({
                    paymentStatus:'completed',
                    paymentId:response.razorpay_payment_id,
                    orderStatus:'paid',
                    lastUpdated:firebase.firestore.FieldValue.serverTimestamp(),
                })
              
                
              },
              prefill: prefill,
              description: `payment to order ${order.orderId}`,
              name: restaurant.restaurant.name,
              "payment-capture": true,
              amount: parseFloat(order.totalAmount) * 100,
            };
            await loadScript(`https://checkout.razorpay.com/v1/checkout.js`);
            const paymentObject = window.Razorpay(options);
            paymentObject.on("payment.failed", async (response) => {
            //   var result = {
            //     ...paymentResult,
            //     ...prefill,
            //     status: 'failed',
            //     paymentStatus: 'failure',
            //     timeStamp:firebase.firestore.FieldValue.serverTimestamp(),
            //     restaurantId:restaurantId
            //   }
            //   await firestore.collection('payment').add(result)
              await firestore.collection('orders').doc(orderId).update({
                paymentStatus:'failed',
                // paymentId:response.razorpay_payment_id,
                orderStatus:'payment-failed',
                lastUpdated:firebase.firestore.FieldValue.serverTimestamp(),
            })
            });
            paymentObject.open();
        }
      };
    const handleError = (msg) => {
        if(msg){
            alert(msg)
        }
        removeTakeAway()
        setError(errorMsg)
    }
    const placeOrder =async () => {
        setLoading(true)
        await checkAndUpdate()
        loadRazorpay()
        setLoading(false)
    }
    const checkAndUpdate = async() => {
        for (var item of order.items){
            try {
                const fetchedDishref = await firestore.collection('dishes').doc(restaurantId).collection('take-away').doc(item.dish.dish_id).get()
                if(fetchedDishref.exists){
                    var fetchedDish =  fetchedDishref.data()
                    if (!fetchedDish.published){
                        handleError('The restaurant stopped taking order of one or more dishes you selected!')
                    }else{
                        // console.log(item,fetchedDish)
                        var variant = fetchedDish.food_variants.filter(variant=>variant.food_preference === item.selectedVariant.food_preference)[0]
                        if(parseFloat(variant.price)!== parseFloat(item.selectedVariant.price)){
                            handleError('the Price of one of the dish changed while you try to order!')
                        }
                        if(item.selectSubVariant.length>0){
                            if(fetchedDish.options.length>0){
                                var newSub = item.selectSubVariant.filter(sub=>{
                                    var { name, index,price } = sub
                                    // console.log(name,index,price);
                                    for(var option of fetchedDish.options){
                                        for (var inner in option.innerOptions){
                                            // console.log(parseInt(inner),name,option.innerOptions[inner].name,parseInt(index))
                                            if(parseInt(index) === parseInt(inner) && option.innerOptions[inner].name === name){
                                                    // console.log(inner,name,option.innerOptions[inner].name,parseFloat(option.innerOptions[inner].price),parseFloat(price))
                                                    if(parseFloat(option.innerOptions[inner].price)===parseFloat(price)){
                                                        return true
                                                    }
                                                    else{
                                                        return false
                                                    }
                                                        
                                                }
                                        }
                                    }
                                })
                                if(newSub.length<item.selectSubVariant.length){
                                   
                                    handleError('the Price of one of the dish options changed while you try to order!')
                                }
                            }
                            else{
                                handleError('the Price of one of the dish options changed while you try to order!')
                            }
                        }
    
                        if(item.selectedAddon.length > 0){
                            if(fetchedDish.addons.length>0){
                                var addonCount = item.selectedAddon.filter(({name,price})=>{
                                    for(var addon of fetchedDish.addons){
                                        if(addon.name === name){
                                            if(parseFloat(addon.price)===parseFloat(price)){
                                                return true
                                            }else{
                                                return false
                                            }
                                        }
                                    }
                                })
                                if(addonCount.length<item.selectedAddon.length){
                                    handleError('addons were modified while you try to order.')
                                }
                            }
                            else{
                                handleError('addons were modified while you try to order.')
                            }
                        }
                    }
                    if(item.dish.packingCharge !== fetchedDish.packingCharge){
                        handleError('Packing charge changed while you try to order.')
                    }
                    


                }
                else{
                    handleError('dish dont exist') 
                }
            } catch (err) {
                console.log(err);
                handleError()
            }
            
        }
    }
    // console.log(order);
    // console.log(order?.items);
    var cartTotal = order?.items>0 ? order.items.reduce( function(a, b){
        console.log('b',b);
        return a +calcDishTotal(b.selectedVariant,b.selectSubVariant,b.selectedAddon,b.quantity,b.dish.packingCharge);
    }, 0): 0
    console.log(restaurant);
    if(order && restaurant.status === 'idle'){
        return (
            <div>
                <div
                style={{fontWeight:700,textAlign: 'left'}}
                >
                    Order Details
                </div>
                
                <div className="flex center-align">
                    <div>
                        <Chip label={order.orderStatus} color={getOrderStatusStyle(order.orderStatus)} size="small"  />
                    </div>
                    <div
                    style={{fontWeight:300,fontSize:12}}
                    >
                        &ensp; - &ensp;
                        {order.orderTime.toDate().toLocaleString()}
                    </div>
                </div>
               
                {["paid",
                "accepted",
                "cooked",
                "delivered",
                "completed",].includes(order.orderStatus) && 
                <>
                <div
                style={{fontSize:12}}
                >
                    {order.orderStatus === "paid"&& "order placed sucessfully! waiting for restaurant confirmation" }
                    {order.orderStatus === "accepted"&& "The restaurant has accepted your order and will start preparing your food!" }
                    {order.orderStatus === "declined"&& "Oops! The restaurant has declined your order and will refund your order. please contact restaurant for furthur details." }
                    {order.orderStatus === "cooked"&& "The restaurant cooked your food and made it ready for your collection" }
                </div>
                 <div >
                    <div
                    style={{fontWeight:700}}
                    >
                        Contact Restaurant
                    </div>
                </div>
                <br />
                    <div className="flex" style={{justifyContent: 'space-around'}} >
                        <div>
                            <a href={`tel:${restaurant?.restaurant.mobile}`}>
                                <Button     
                                color="primary"
                                variant='outlined'
                                >
                                    <Phone />
                                </Button>
                            </a>
                        </div>
                        <div>
                            <a href={`https://api.whatsapp.com/send?phone=${restaurant?.restaurant.whatsapp}&text=Hello%2C%20${restaurant.restaurant.name}!,I'm ${order.userName} contacting you ragarding Order Id -${orderId}`}>
                                <Button     
                                color="primary"
                                variant='outlined'
                                >
                                    <WhatsApp />
                                </Button>
                            </a>
                        </div>
                        <div>
                        <a href={`http://www.google.com/maps/place/${restaurant?.restaurant.latitude},${restaurant?.restaurant.longitude}`}>
                            <Button 
                            color="primary"
                            variant='outlined'
                            >
                                <Directions />
                            </Button>
                        </a>
                        </div>
                    </div>
                </>
                }
                <br />
                <br />
                <div style={{display: 'grid', gridTemplateColumns:'3fr 1fr',textAlign: 'left',fontWeight:700}} >
                        <div>
                            Item Details
                        </div>
                        <div>
                            {/* Price */}
                        </div>
                    </div>

                {order.items.map(({dish,quantity,selectSubVariant,selectedAddon,selectedVariant})=>(
                    <div style={{display: 'grid', gridTemplateColumns:'2fr 1fr 1fr',textAlign: 'left',fontSize:14}} >
                        <div>
                           {getVariantImage(selectedVariant.food_preference)} {dish.dish_name}
                        </div>
                        <div>
                           {quantity?`x ${quantity}`:null}
                        </div>
                        <div>
                            {calcDishTotal(selectedVariant,selectSubVariant,selectedAddon,quantity,dish.packingCharge)}
                        </div>
                        <div
                        style={{fontWeight:300,fontSize:11}}
                        >
                            {selectSubVariant.length>0 && selectSubVariant.map(sub=>(
                                <div>
                                    &ensp;&ensp;&ensp;{sub.name}
                                </div>
                            ))}
                        </div>
                        <div/>
                        <div/>
                        <div
                        style={{fontWeight:300,fontSize:11}}
                        >
                            {selectedAddon.length>0 && selectedAddon.map(sub=>(
                                <div>
                                    &ensp;&ensp;&ensp;{sub.name}
                                </div>
                            ))}
                        </div>
                        <div/>
                        <div/>
                        <br />
                    </div>
                ))}
                {['created','pending','payment-failed'].includes(order.orderStatus) &&<div>
                    <OnmenuButton
                    onClick={placeOrder}
                    >
                    Pay {order.totalAmount}
                    </OnmenuButton>
                </div>}
                <SimpleSnackbar message={error} severity={'error'} reset={()=>{
                    setError(null)
                    // setTimeout(() => {
                    // }, 5000);
                }} />
            </div>
        )
    }
    else{
        return <CircularProgress  />
    }
}


const getOrderStatusStyle = status => {
    switch (status) {
        case 'pending':
            return 'warning'
        case 'paid':
            return 'primary'
        case 'accepted':
            return 'primary'
        case 'declined':
            return 'secondary'
        case 'cooked':
            return 'primary'
        case 'delivered':
            return 'primary'
        case 'completed':
            return 'primary'
        case 'payment-failed':
            return 'secondary'
        default:
            return 'primary'
    }
}