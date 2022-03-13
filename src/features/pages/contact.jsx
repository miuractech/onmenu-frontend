import { Button } from '@material-ui/core'
import { Directions, Phone, WhatsApp } from '@material-ui/icons'
import React from 'react'
import { useSelector } from 'react-redux'
import { selectrestaurant } from '../restaurant/restaurantSlice'

export default function Contact() {
    const restaurant = useSelector(selectrestaurant)
    return (
        <div>
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
                            <a href={`https://api.whatsapp.com/send?phone=${restaurant?.restaurant.whatsapp}`}>
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
        </div>
    )
}
