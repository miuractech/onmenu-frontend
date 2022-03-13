// Direct Imports
import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import Logo from "../../images/Indranagar-Lavelle-Road-Whitefield-Kormangala-Jayanagar-7249d68216064aa9abe5643be6f00e6a.png";

// Components Imports
import { Link, useHistory } from "react-router-dom";
// import BottomNav from "../../components/bottomNav";
import firebase from "../../config/firebase";
import lodash from 'lodash';
import { selectrestaurant, setRestaurant, setRestaurantId, setType } from "./restaurantSlice";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../components/loader";
import { checkMenuAvailibility } from "./restaurant";
import LogoComponent from "../../components/LlogoComponent";
import { setCurrent } from "../bottomNav/bottomSlice";

export const menuStyle = {
  width:'100%',
  background:'#333',
  borderRadius:6,
  height:50,
  fontSize:25,
  color:'white',
  display:'flex',
  alignItems:'center',
  justifyContent:'center',
  margin:'12px auto'
}


const MenuTypes = () => {
    const { restaurantId } = useParams();
    // const history = useHistory()
    const dispatch = useDispatch()
    const restaurants = useSelector(selectrestaurant)
    useEffect(() => {
    dispatch(setRestaurant(restaurantId))
    dispatch(setCurrent('home'))
    }, [])
    let serviceCharges = null;
    if(restaurants.restaurant){
      serviceCharges = parseFloat(restaurants.restaurant.serviceCharge)>0?parseFloat(restaurants.restaurant.serviceCharge):null
    }
    // const serviceCharge = 3.5 
    if (restaurants.status === 'loading'){
      return <Loader />
    }
    console.log(restaurants);
    return (  
      <div className='full-height'>
        {restaurants.menus?
          <>
        <LogoComponent />
        {Object.keys(restaurants.menus).map(type=>(
            <Link 
            style={{textDecoration:'none'}} 
            to={`/restaurant/${restaurantId}/${type}`} 
            key={type}
            >
            <div style={menuStyle} >
              {type.toLocaleUpperCase()}
            </div>
          </Link>
        ))
        }
        {/* <Link style={{textDecoration:'none'}} to={`/restaurant/${restaurantId}/takeaway`}>
          <div style={menuStyle}>
            takeaway
          </div>
        </Link>
        <Link style={{textDecoration:'none'}} to={`/restaurant/${restaurantId}/deli`}>
          <div style={menuStyle}>
            deli
          </div>
        </Link> */}
        {serviceCharges && <marquee behavior="" direction="left">
          we charge {serviceCharges}% service fee on all our services
        </marquee>}
        {/* <BottomNav /> */}
        </>:
        <div>
           <LogoComponent />
           We're closed now! check back again soon...
        </div>
        }
      </div>
  );
};

export default MenuTypes;
