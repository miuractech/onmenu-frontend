import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { selectCart } from './cartSlice'
import lodash from 'lodash'
import { selectrestaurant } from '../restaurant/restaurantSlice'
import LogoComponent from '../../components/LlogoComponent'
import { menuStyle } from '../restaurant/menuTypes'
import { Link,Redirect } from 'react-router-dom'
import Loader from '../../components/loader'
import { setCurrent } from '../bottomNav/bottomSlice'
export default function Cartmaster() {
    const cart = useSelector(selectCart)
    const restaurant = useSelector(selectrestaurant)
    const dispatch = useDispatch()
    const flatdishes = cart.length > 0 ? cart.map(element => element.dish):[]
    const carts = lodash.groupBy(flatdishes,'type')
    useEffect(() => {
        dispatch(setCurrent('cart'))
    }, [])
    if(!restaurant.restaurantId){
        return <Redirect to='/' />
    }
    return (
        <div className='full-height'>
      {restaurant.restaurantId?
        <>
       {Object.keys(carts).length>0?
       <>
       <div>
           select cart
       </div>
       {Object.keys(carts).map(key=>(
           <>
        <Link style={{textDecoration:'none'}} to={`/restaurant/${restaurant.restaurantId}/${key}/cart`}>
            <div style={menuStyle} >
            {key}
            </div>
        </Link>
        </>
       ))}
       </>
        :
        <div>
            Cart empty. try adding dishes !
        </div>
    }
      {/* <BottomNav /> */}
      </>:
      <Loader />
      }
    </div>
    )
}
