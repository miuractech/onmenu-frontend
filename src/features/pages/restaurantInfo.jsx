import React from 'react'
import { useSelector } from 'react-redux'
import { selectrestaurant } from '../restaurant/restaurantSlice'

export default function RestaurantInfo() {
    const restaurant = useSelector(selectrestaurant)
    return (
        <div>
            <div className="font700 text-center margin1">
                Location
            </div>
            <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3888.061123583097!2d77.60382971382904!3d12.967940590858289!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae167f8a2b1571%3A0x29bf2f22be45baf1!2sBrigade%20Rd%2C%20Shanthala%20Nagar%2C%20Ashok%20Nagar%2C%20Bengaluru%2C%20Karnataka%20560025!5e0!3m2!1sen!2sin!4v1632303826803!5m2!1sen!2sin" 
            width="100%" 
            height="450" 
            style={{border:0}} 
             loading="lazy"></iframe>
        </div>
    )
}
