import React from 'react'
import { useSelector } from 'react-redux'
import { selectrestaurant } from '../features/restaurant/restaurantSlice'

export default function LogoComponent() {
    const restaurant = useSelector(selectrestaurant)

    return (
        <div style={{height:200}} >
            <img src={restaurant.restaurant.logo} style={{display: 'block', margin:'auto',maxWidth:200}} alt="" />
        </div>
    )
}
