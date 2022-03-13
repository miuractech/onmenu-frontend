import { Divider } from '@material-ui/core';
import React from 'react'
import { useSelector } from 'react-redux'
import { selectrestaurant } from '../restaurant/restaurantSlice'
import { Link } from 'react-router-dom'
import { ArrowRightAlt } from '@material-ui/icons';
export default function Menus() {
    const restaurant = useSelector(selectrestaurant)
    return (
        <div>
            dfgv
            <div className="text-left margin1 ">
                {Object.keys(restaurant.menus).map(type=>(
                    <div>
                        <Link to={`/restaurant/${restaurant.restaurantId}/${type}`} >
                        <div className="font600 margin1 flex" style={{alignContent: 'center'}}  >
                            {type} &ensp; <ArrowRightAlt />
                        </div>
                        </Link> 
                        <div>
                            {restaurant.menus[type].map(menu=>(
                                <div>
                                    <div className='margin1'>
                                        {menu.name}
                                    </div>
                                        <Divider />
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
