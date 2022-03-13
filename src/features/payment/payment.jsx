import { Button, Divider, IconButton, TextField } from "@material-ui/core";
import firebase from "firebase";
import React from "react";
import { Redirect, useHistory, useParams } from 'react-router-dom'
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import BottomNav from "../../components/bottomNav";
import OnmenuButton from "../../components/button";
import { selectAuth } from "../auth/authSlice";
import { selectCart } from "../cart/cartSlice";
import { calcDishTotal, getPrice } from "../restaurant/dishCard";
import PaymentResult from "./paymentResult";
import { selectrestaurant, setRestaurant } from "../restaurant/restaurantSlice";
import { setCurrent } from "../bottomNav/bottomSlice";
import { ArrowBack, ArrowLeft, ArrowLeftSharp, ArrowLeftTwoTone } from "@material-ui/icons";
import { firestore } from "../../config/firebase";

// import useFetchUser from "../../hooks/useFetchUser";

export var paymentResult = {
  by: 'Razorpay', 
}

const Payment = ({takeawayMode}) => {
  const [orderSuccess, setOrderSuccess] = useState(null);
  const { restaurantId } = useParams();
  const restaurant = useSelector(selectrestaurant)
  const dispatch = useDispatch()
  const history = useHistory()
  const [prefill, setPrefill] = useState({
    name: "",
    email: "",
    contact: "",
    amount:'',
  });
  const [error, setError] = useState("");
  const cart = useSelector(selectCart);
  const emailRegex =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const amountRegex =/^\d+(\.\d{1,2})?$/;

  const auth = useSelector(selectAuth);
  const user = auth.user
  var cartTotal = cart.length>0 ? cart.reduce( function(a, b){
    if(b.dish.type === 'take-away'){
        return a +calcDishTotal(b.selectedVariant,b.selectSubVariant,b.selectedAddon,b.quantity,b.recommended);
    }else{
        return a 
    }
}, 0): null
React.useEffect(() => {
  if(!restaurant.menu){
    dispatch(setRestaurant(restaurantId))
  }
  dispatch(setCurrent('payment'))
}, [])
  React.useEffect(() => {
    async function userAsync() {
      setPrefill({
        ...prefill,
        contact: user.phoneNumber?user.phoneNumber.slice(3,13):'',
        name: auth.userName,
      });
    }
    if (user) {
      userAsync();
    }
  }, [user]);
  const loadRazorpay = async () => {
    if (prefill.amount === "" && !takeawayMode) {
      setError("cannot have empty amount");
      return;
    }
    // if (!emailRegex.test(prefill.email)) {
    //   setError("must be an email");
    //   return;
    // }
    if (!amountRegex.test(prefill.amount) && !takeawayMode) {
      setError("not valid amount");
      return;
    }
    var options = {
      key: restaurant.restaurant.razorpayId,
      handler: function (response) {
        // success function
        setOrderSuccess({ 
            status: 'success', 
            id: response.razorpay_payment_id, 
            by: 'Razorpay', 
            paymentStatus: 'Success',
            amount:prefill.amount
        })
        var result = {
          ...paymentResult,
          status: 'success',
          paymentStatus: 'Success',
          timeStamp:firebase.firestore.FieldValue.serverTimestamp(),
          ...prefill,
          restaurantId:restaurantId
        }
      
        firestore.collection('payment').add(result)
      
        setPrefill({
          amount:'',
        })
      },
      prefill: prefill,
      description: "payment to restaurant",
      name: restaurant.restaurant.name,
      "payment-capture": true,
      amount: takeawayMode?cartTotal*100:parseFloat(prefill.amount) * 100,
    };
    await loadScript(`https://checkout.razorpay.com/v1/checkout.js`);
    const paymentObject = window.Razorpay(options);
    paymentObject.on("payment.failed", function (response) {
      var result = {
        ...paymentResult,
        ...prefill,
        ...response,
        ...response.metadata,
        status: 'failed',
        paymentStatus: 'failure',
        timeStamp:firebase.firestore.FieldValue.serverTimestamp(),
        restaurantId:restaurantId
      }
      firestore.collection('payment').add(result)
      //failure function
      setOrderSuccess({ status: "failed", by: "razorpay" });
    });
    paymentObject.open();
  };
  if(takeawayMode && (!cartTotal || cartTotal<1)){
    return <Redirect to={`/restaurant/${restaurant.restaurantId}/`} />
  }
  return (
    <>
    {orderSuccess?
    <PaymentResult orderSucess={orderSuccess} takeawayMode={takeawayMode} paymentData={prefill} setOrderSucess={setOrderSuccess} />
    :
        <div className='full-height'  >
          <div className='text-left flex' style={{alignItems: 'center'}} onClick={()=>history.goBack()}>
          <IconButton >
            <ArrowBack />
          </IconButton>
          <div>
            Back
          </div>
        </div>
        <div  >
            {takeawayMode && cart.length>0?
            <div  style={{margin:'auto',display: 'grid',gridTemplateColumns:'3fr 1fr 2fr'}} >
              <div className='text-left font600'>
                Item
              </div>
              <div/>
                <div className='text-right font600'>
                Price
                  </div> 
              {cart.filter(item=>item.dish.type === 'take-away').map(({dish,selectedVariant,selectSubVariant,selectedAddon,quantity})=>(
                <>
                  <div className='text-left'>
                    {dish.dish_name} {quantity&& `x ${quantity}`}
                  </div>
                  <div />
                  <div className='text-right'>
                  {calcDishTotal(selectedVariant,selectSubVariant,selectedAddon,quantity,dish.packingCharge)}
                  </div> 
                </>
              ))}
              <div>
                <Divider />
              </div>
              <div>
                <Divider />
              </div>
              <div>
                <Divider />
              </div>
              <div className='text-right'>
                Amount:
              </div>
              <div/>
                <div className='text-right'>
                {cartTotal}
                  </div> 
              {/* <div className='text-right'>
                Tax: 
              </div>
              <div/>
                <div className='text-right'>
                  {parseInt(cartTotal*0.12)}
                </div>
              <div/> */}
              {/* <div/> */}
              <br />
                <div className='text-right font600'>
                Total  : 
              </div>
              <div/>
                <div className='text-right font600'>
                  {parseInt(cartTotal)+parseInt(cartTotal*0.12)}
                </div>
            </div>
            :
            <input type="number"  
            placeholder='Enter amount'
            value={prefill.amount} 
            onChange={(e) => {
                setPrefill({ ...prefill, amount: e.target.value });
                setError("");
              }}
             className="onmenu-input " 
             style={{width:200,fontSize:18}}
             />}
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
      <div>

        <OnmenuButton onClick={loadRazorpay}>pay now</OnmenuButton>
      </div>
      <div>
        {error.length > 0 && <span style={{ color: "red" }}>{error}</span>}
      </div>
    </div>}
    {/* <BottomNav /> */}
    </>
  );
};

export const loadScript = (src) => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => {
      resolve(true);
    };
    script.onerror = () => {
      resolve(false);
    };
    document.body.appendChild(script);
  });
};

export default Payment;
