import { Card, Divider } from '@material-ui/core';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import OnmenuButton from '../../components/button';
import { firestore } from '../../config/firebase';
import { selectAuth } from '../auth/authSlice';
import { calcDishTotal } from '../restaurant/dishCard';
import { selectrestaurant, setRestaurant } from '../restaurant/restaurantSlice';
import { useParams, Link } from "react-router-dom";
import { selectcurrentMenu, setCurrent } from '../bottomNav/bottomSlice';

export default function OrderList() {
    const user = useSelector(selectAuth)
    const restaurant= useSelector(selectrestaurant)
    const { restaurantId } = useParams();
    const [orders, setOrders] = useState([]);
    const [lastLimit, setLastLimit] = useState(null);
    const currentType = useSelector(selectcurrentMenu)
    const dispatch = useDispatch()
    
    useEffect(() => {
        if(!restaurant.restaurantId){
            dispatch(setRestaurant(restaurantId))
            dispatch(setCurrent('home'))
        }
    }, []);
    useEffect(() => {
        // console.log(user.user.uid , restaurantId);
        if(user.user.uid && restaurantId)
        firestore.collection('orders').where('restaurantId','==',restaurantId).where('userId','==',user.user.uid).orderBy('orderTime','desc').limit(10).get()
        .then(snap=>{
        let o = []
        if(!snap.empty){
            var lastVisible = snap.docs[snap.docs.length-1];
            snap.forEach(doc=>{
                var data = doc.data()
                data.id = doc.id
                o.push(data)
            })
            setOrders(o)
            setLastLimit(lastVisible)
        }
    }).catch(err=>{
        console.log(err);
    })
    }, [restaurantId]);
    return (
        <div>
            {orders.length>0 ? orders.map(order=>{
                // var cartTotal = order.items.length>0 ? order.items.reduce( function(a, b){
                //     return a +calcDishTotal(b.selectedVariant,b.selectSubVariant,b.selectedAddon,b.quantity,b.dish.packingCharge);
                // }, 0): null
                return (
                    <Link to={`/restaurant/${restaurantId}/orders/${order.id}`} >
                        <Card key={order.id} style={{margin:'20px auto',padding:15}} >
                            <div className='full-height'  >
                            <div  >
                                <div  style={{margin:'auto',display: 'grid',gridTemplateColumns:'3fr 1fr 2fr'}} >
                                <div className='text-left font600'>
                                    #{order.id}
                                </div>
                                <div/>
                                    <div className='text-right font600'>
                                    {order.orderStatus}
                                    </div> 
                                    <div className='text-left font300' style={{fontSize:'11px'}} >
                                        {order.orderTime.toDate().toLocaleString()}
                                    </div>
                                    <div/>
                                    <div className='text-right font600'>
                                    </div> 
                                    <div >
                                        <br />
                                    </div>
                                    <div />
                                    <div />
                                {order.items.map(({dish,selectedVariant,selectSubVariant,selectedAddon,quantity})=>(
                                    <>
                                    <div className='text-left'>
                                        {dish.dish_name} {quantity&& `x ${quantity}`}
                                    </div>
                                    <div />
                                    <div className='text-right'>
                                    {/* {calcDishTotal(selectedVariant,selectSubVariant,selectedAddon,quantity,dish.packingCharge)} */}
                                    </div> 
                                    </>
                                ))}
                                {/* <div>
                                    <Divider />
                                </div>
                                <div>
                                    <Divider />
                                </div>
                                <div>
                                    <Divider />
                                </div> */}
                                <div className='text-right'>
                                    Amount:
                                </div>
                                <div/>
                                    <div className='text-right'>
                                    {order.totalAmount}
                                    </div> 
                                <div/>
                                </div>
                            </div>
                        {/* <TextField
                            label="Enter Your Email"
                            type="email"
                            onChange={(e) => {
                            setPrefill({ ...prefill, email: e.target.value });
                            setError("");
                            }}
                        /> */}
                        <br />
                        </div>
                        </Card>
                    </Link>
            )})
            :
            <div>
                Place your first order <Link to={`/restaurant/${restaurantId}/${currentType?currentType:''}`} style={{fontWeight:700,textDecoration: 'underline'}} > here</Link>
            </div>
        }
        </div>
    )
}
