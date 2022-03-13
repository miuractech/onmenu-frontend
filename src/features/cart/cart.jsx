import { Card, CircularProgress, IconButton } from '@material-ui/core'
import { Close } from '@material-ui/icons'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams, Redirect, Link, useHistory } from 'react-router-dom'
import BottomNav from '../../components/bottomNav'
import OnmenuButton from '../../components/button'
import { firestore } from '../../config/firebase'
import { selectAuth } from '../auth/authSlice'
import { setCurrent } from '../bottomNav/bottomSlice'
import { calcDishTotal, getPrice, getVariantImage } from '../restaurant/dishCard'
import { selectrestaurant } from '../restaurant/restaurantSlice'
import { removeFromCart, selectCart } from './cartSlice'
import firebase from 'firebase'

export default function Cart() {
    const cart = useSelector(selectCart)
    const restaurant = useSelector(selectrestaurant)
    const dispatch = useDispatch()
    const history = useHistory()
    const { type } = useParams()
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        dispatch(setCurrent('cart'))
    }, [])
    var cartTotal = cart.length>0 ? cart.reduce( function(a, b){
        if(b.dish.type === type){
            return a +calcDishTotal(b.selectedVariant,b.selectSubVariant,b.selectedAddon,b.quantity,b.dish.packingCharge);
        }else{
            return a 
        }
    }, 0): null
    const { restaurantId } = useSelector(selectrestaurant)
    const { userName,user } = useSelector(selectAuth)
    const { phoneNumber } = user
    console.log(restaurantId,userName,user,phoneNumber);
    if(!restaurant.restaurantId){
        return <Redirect to='/' />
    }
    return (
        <div >

            {cart.length>0 ?
            <div>
                {cart.filter(item=>item.dish.type === type).map(({dish,selectedVariant,selectSubVariant,selectedAddon,quantity,recommended})=>(
                    <div style={{position:'relative'}} >
                        <div style={{position:'absolute',right:-5,top:-5}} 
                        onClick={()=>dispatch(removeFromCart(dish.dish_id))} >
                            <IconButton size='small' style={{backgroundColor:'#333333aa',color:'#fff'}} >
                                <Close  />
                            </IconButton>
                        </div>
                        <CartCard 
                        dish={dish} 
                        selectedVariant={selectedVariant} 
                        selectSubVariant={selectSubVariant} 
                        selectedAddon={selectedAddon} 
                        quantity={quantity}
                        recommended={recommended}
                        // foodQuantity={cart[dishId].foodQuantity} 
                        />
                    </div>
                ))}
                <div className="font500 text-right" style={{fontSize:18}}  >
               Approximate Total: {cartTotal}
                </div>
            </div>    
            :
            <div>
                Cart empty. try adding dishes !
            </div>
        }
        {(type==='take-away')?
        // <Link to={`/restaurant/${restaurant.restaurantId}/payment/take-away`}>
            <OnmenuButton style={{width:250,fontWeight:300}} 
            onClick={()=>{
                setLoading(true);
                const target = {
                    restaurantId,
                    userName,
                    phoneNumber,
                    orderTime:firebase.firestore.FieldValue.serverTimestamp(),
                    lastUpdated:firebase.firestore.FieldValue.serverTimestamp(),
                    items:cart,
                    totalAmount:cartTotal,
                    paymentStatus:'pending',
                    paymentId:null,
                    orderStatus:'created',
                    userId:user.uid,
                }
                firestore.collection('orders').add(target)
                .then(doc=>{
                    history.push(`/restaurant/${restaurant.restaurantId}/orders/${doc.id}`)
                    setLoading(false)
                })
            }}
            >
            {loading?<CircularProgress /> :'Order Now'}
        </OnmenuButton>
        // </Link>
        :
        <OnmenuButton  
        style={{width:250,fontWeight:300}} 
        
        >
            Order Manually to Waiter
            
        </OnmenuButton>
    }
        {/* <BottomNav /> */}
        </div>
    )
}


const CartCard = ({dish,selectedVariant,selectSubVariant,selectedAddon,quantity}) => {
    const total = calcDishTotal(selectedVariant,selectSubVariant,selectedAddon,quantity,dish.packingCharge)
    return (
        <div >
            <Card
            elevation={1} 
            className='poppins' 
            style={{
                margin:'16px auto',
                textAlign:'left',
                borderRadius:10,
                // height:110,
                padding:12
                }} 
            key={dish.dishId} 
            >
                <div className="flex" style={{flexGrow:1}}>
                    {/* ---------------- dis
                    h images -----------------------*/}
                    <div >
                        <img src={dish.images[0]} alt={dish.dishName} className='dish-img-small border10' />
                        <div>
                            Quantity : {quantity}
                        </div>
                    </div>

                    {/* ------------------------ namd and description -------------------------- */}
                    <div style={{marginLeft:16,flexGrow:1}} >
                        <div className='font600 dish-title' style={{fontSize:18}}  >
                        {/* {getVariantImage(selectedVariant.food_preference,{height:16,width:16})} &ensp; */}
                            {dish.dish_name}
                        </div>
                        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gridGap:2,justifyContent:'space-between',flexGrow:1,marginTop:5,marginLeft:16}} >
                            <div className='flex font300' style={{fontSize:14}} >
                                <div>
                                    {getVariantImage(selectedVariant.food_preference)} &ensp;
                                </div>
                                <div>
                                    {selectedVariant.food_preference}
                                </div>
                            </div>
                            <div style={{fontSize:14}}>
                                {getPrice(selectedVariant.price)}
                            </div>
                        </div>
                        {/*------------------------------------- variant prices -------------------------------- */}
                        <div style={{flexGrow:1}} >
                            <div>
                                {selectSubVariant.length>0 && selectSubVariant.map(({name,price,preference},index)=>(
                                    <>
                                        <div style={{display:'grid',fontSize:14,gridTemplateColumns:'1fr 1fr',gridGap:2,marginLeft:16}} key={name+index} >
                                            <div className='flex font300'  >
                                                <div>
                                                    {getVariantImage(preference)} &ensp;
                                                </div>
                                                <div >
                                                {name}
                                                </div>
                                            </div>
                                            <div>
                                                {getPrice(price)}&ensp; 
                                            </div>
                                        </div>
                                    {/* <div>
                                        {selectedVariant && dish.variants.filter(varinat=>varinat.detailedFoodVariant === selectedVariant)[0].variant.filter(v=>selectSubVariant.includes(v.variant)).map(({variant,price},index) => (
                                        <React.Fragment key={variant+index} >
                                            <div className='flex' key={foodVariant+index} >
                                            <div>
                                            {variant}
                                                &nbsp;
                                            </div>
                                            <div>
                                                {price}
                                                &nbsp;
                                                &nbsp;
                                                &nbsp;
                                            </div>
                                        </div>
                                        </React.Fragment>
                                    ))}
                                    </div> */}
                                    </>
                                ))}
                            </div>
                            {selectedAddon && 
                            
                            selectedAddon.map(({name,price})=>(
                            <div style={{marginLeft:16,flexGrow:1}} >
                              
                                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gridGap:2,justifyContent:'space-between',flexGrow:1,marginTop:5}} >
                                    <div className='flex font300' style={{fontSize:14}} >

                                        <div>
                                            {name}
                                        </div>
                                    </div>
                                    <div style={{fontSize:14}}>
                                        {getPrice(price)}
                                    </div>
                                </div>
                                </div>
                            )) 
                                }
                            {dish.packingCharge>0 && <div style={{marginLeft:16,flexGrow:1}} >
                                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gridGap:2,justifyContent:'space-between',flexGrow:1,marginTop:5}} >
                                    <div className='flex font300' style={{fontSize:14}} >

                                        <div>
                                            Packing Charge
                                        </div>
                                    </div>
                                    <div style={{fontSize:14}}>
                                        {getPrice(dish.packingCharge)}
                                    </div>
                                </div>
                                </div>
                                }
                            <div className="text-right" style={{fontSize:16,margin:'24px auto 0px auto'}} >
                               Sub total : <span className="font600" > {getPrice(total)} </span>
                            </div>
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    )
}
