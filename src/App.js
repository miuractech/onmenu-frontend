import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { Auth } from './features/auth/Auth';
import { selectrestaurant, setRestaurantId } from './features/restaurant/restaurantSlice';
import Loader from './components/loader';
import { useDispatch, useSelector } from 'react-redux';
import { selectAuth, setLocation, setUser } from './features/auth/authSlice';
import firebase, { firestore } from './config/firebase';
import { Redirect, Route, Switch,Link } from 'react-router-dom';
import { BrowserRouter } from 'react-router-dom';
import { Restaurant } from './features/restaurant/restaurant'
import { saveUserToFireStore } from './features/auth/authFunctions';
import MenuTypes from './features/restaurant/menuTypes';
import Topbar from './components/topBar';
import BottomNavigationComponent from './features/bottomNav/bottomNav';
import Cart from './features/cart/cart';
import Payment from './features/payment/payment';
import Feedback from './features/feedback/feedback';
import Search from './features/search/search';
import Cartmaster from './features/cart/cartmaster';
import RestaurantInfo from './features/pages/restaurantInfo';
import Menus from './features/pages/menus';
import Terms from './features/pages/terms';
import Privacy from './features/pages/privacy';
import Index from './features/order';
import OrderList from './features/order/orderList';
import Order from './features/order/order';
import Contact from './features/pages/contact';
export const removeUserAll = () => {
  firebase.auth().signOut()
  sessionStorage.removeItem('userName')
  sessionStorage.removeItem('lastCurrent')
  localStorage.removeItem("cart-items");
  localStorage.removeItem("filter");
  sessionStorage.removeItem("filter");
}  
function App() {
  // const [initialLoad, setInitialLoad] = useState(true)
  const restaurant = useSelector(selectrestaurant)
  const auth = useSelector(selectAuth);
  const dispatch = useDispatch()


 
  useEffect(() => {
    // const urlSearchParams = new URLSearchParams(window.location.search);
    // const params = Object.fromEntries(urlSearchParams.entries());
    // if(params.restaurantId && initialLoad  && !restaurant.restaurantId){
    //   dispatch(setRestaurantId(params.restaurantId))
    //   setInitialLoad(false)
    //   // window.location ='/restaurant/'+params.restaurantId
    // }
    firebase.auth().onAuthStateChanged(function(user) {
      // if(user){
        
      // }
      dispatch(setUser(user))
     });
     const getUserGeoLocation = () => {
       navigator.geolocation.getCurrentPosition(
         (success) => {
           var location = {
             longitude: success.coords.longitude,
             latitude: success.coords.latitude,
           }
           dispatch(setLocation(location))
         },
       );
     }
     getUserGeoLocation()
     
    }, [])
    // firebase.auth().signOut()
    // localStorage.removeItem('userName')
  useEffect(() => {
    if(auth.location && auth.user && auth.userName && restaurant?.restaurant?.latitude){
      console.log(auth);
      const difference = Math.abs(new Date(auth.user.metadata.lastSignInTime) - new Date(firebase.firestore.Timestamp.now().toDate()))/(36e5)
        if(difference>4 || difference<0){
        removeUserAll()
        }else{
          const resId = sessionStorage.getItem('restaurantId') 
        if(resId !== restaurant.restaurant.restaurantId){
          removeUserAll()
          }
        }
      const location = calcCrow(
        parseFloat(auth.location.latitude),
        parseFloat(auth.location.longitude),
        parseFloat(restaurant.restaurant.latitude),
        parseFloat(restaurant.restaurant.longitude)
        )
      if(!sessionStorage.getItem('lastCurrent')){
        sessionStorage.setItem('lastCurrent',true)
        sessionStorage.setItem('restaurantId',restaurant.restaurant.restaurantId)
        firestore.collection('currentUser').add({
          restaurantId:restaurant.restaurantId,
          userName:auth.userName,
          mobile:auth.user.phoneNumber,
          time:firebase.firestore.FieldValue.serverTimestamp(),
          location:location<0.25?'Restaurant':'Away',
          userId:auth.user.uid
        })
        // .then(doc=>{
        //   alert(doc.id)
        // })
      }
    }
  }, [auth.location,auth.user,auth.userName,restaurant.restaurant?.restaurantId])
  return (  
    <div className="App">
      {auth.status === 'loading'?
          <Loader />
          :
          <>
            {auth.user?
            <>
            {/* <Topbar /> */}
              <BrowserRouter>
                <Topbar />
                <Switch >
                <Route 
                  exact
                  path='/restaurant/:restaurantId/orders/' 
                  name="order"
                  component={OrderList}
                  />
                  <Route 
                  exact
                  path='/restaurant/:restaurantId/orders/:orderId' 
                  name="order"
                  component={Order}
                  />
                <Route 
                  exact
                  path='/restaurant/:restaurantId/contact' 
                  name="restaurant info"
                  >
                    <Contact />
                  </Route>
                  <Route 
                  exact
                  path='/restaurant/:restaurantId/terms' 
                  name="restaurant info"
                  >
                    <Terms />
                  </Route>
                  <Route 
                  exact
                  path='/restaurant/:restaurantId/privacy' 
                  name="restaurant info"
                  >
                    <Privacy />
                  </Route>
                  <Route 
                  exact
                  path='/restaurant/:restaurantId/menus' 
                  name="restaurant info"
                  >
                    <Menus />
                  </Route>
                  <Route 
                  exact
                  path='/restaurant/:restaurantId/restaurantInfo' 
                  name="restaurant info"
                  >
                    <RestaurantInfo />
                  </Route>
                  <Route 
                  exact
                  path='/restaurant/:restaurantId/payment/take-away' 
                  name="payment takeaway"
                  >
                    <Payment takeawayMode={true} />
                  </Route>
                  <Route 
                  exact
                  path='/restaurant/:restaurantId/payment' 
                  name="payment"
                  >
                    <Payment takeawayMode={false} />
                  </Route>
                  <Route 
                  exact
                  path='/restaurant/:restaurantId/feedback' 
                  name="menuType"
                  component={Feedback}
                  />
                  <Route 
                  exact
                  path='/restaurant/:restaurantId/cart' 
                  name="menuType"
                  component={Cartmaster}
                  />
                  <Route 
                  exact
                  path='/restaurant/:restaurantId/:type/cart' 
                  name="menuType"
                  component={Cart}
                  />
                  <Route 
                exact
                path='/restaurant/:restaurantId/search' 
                name="menuType"
                component={Search}
                />
                  <Route 
                  exact
                  path='/restaurant/:restaurantId/:type' 
                  name="restaurant"
                  component={Restaurant}
                  >
                  </Route>
                  
                  
                  <Route 
                  exact
                  path='/restaurant/:restaurantId' 
                  name="menuType"
                  component={MenuTypes}
                  />
                  <Route
                  exact
                  path='/restaurant/'
                  >
                    <Link to='/restaurant/Kormangala-Bangalore-2a5adbe8f8154d4d99e476cef527ec5c'>
                      test restaurant
                    </Link>
                  </Route>
                    
                  <Route 
                  path='/' 
                  name="home"
                  >
                    onmenu website
                  </Route>
                </Switch>
                  {/* <BottomNav /> */}
                  <div style={{height:150}} ></div>
                  <BottomNavigationComponent />
              </BrowserRouter>
              
            </>
            :
            <Auth />
          }
          </>
        }
    </div>
  );
}

export default App;


function calcCrow(lat1, lon1, lat2, lon2) 
    {
      var R = 6371; // km
      var dLat = toRad(lat2-lat1);
      var dLon = toRad(lon2-lon1);
      var lat1 = toRad(lat1);
      var lat2 = toRad(lat2);

      var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 
      var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
      var d = R * c;
      return d;
    }

  // Converts numeric degrees to radians
  function toRad(Value) 
  {
      return Value * Math.PI / 180;
  }