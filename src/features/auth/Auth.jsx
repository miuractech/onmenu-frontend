import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  // decrement,
  // increment,
  // incrementByAmount,
  // incrementAsync,
  setUser,
  selectAuth,
  setLocation,
  setUserName,
} from './authSlice';
import OnmenuButton from '../../components/button';
import Logo from "../../images/Indranagar-Lavelle-Road-Whitefield-Kormangala-Jayanagar-7249d68216064aa9abe5643be6f00e6a.png";
// import './loginForm.css'
import firebase from '../../config/firebase';
import LogoComponent from '../../components/LlogoComponent';
import { selectrestaurant, setRestaurant } from '../restaurant/restaurantSlice';

const firebaseAuth = firebase.auth()
export function Auth() {
  const user = useSelector(selectAuth);
  const dispatch = useDispatch();
  const [mobileNumber, setMobileNumber] = useState('')
  const [name, setName] = useState('')
  const [final, setfinal] = useState(null);
  const [otp, setotp] = useState('');
  const [loading, setLoading] = useState(false)
  // window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('sign-in-button', {
  //   'size': 'invisible',
  //   'callback': (response) => {
  //     // reCAPTCHA solved, allow signInWithPhoneNumber.
  //     onSignInSubmit();
  //   }
  // });
  // Sent OTP
  // console.log(localStorage)
  const login = () => {
    setLoading(true)
    if (mobileNumber === "" || mobileNumber.length < 10 || name.length===0){setLoading(false); return};
    dispatch(setUserName(name))
    let verify = new firebase.auth.RecaptchaVerifier('recaptcha-container',{
        'size': 'invisible',
        }); 

    firebaseAuth.signInWithPhoneNumber(`+91${mobileNumber}`, verify).then((result) => {
            
            setfinal(result);
            setLoading(false)
        })
            .catch((err) => {
                alert(err);
                window.location.reload()
            });
        }

      // Validate OTP
      const ValidateOtp = () => {
        setLoading(true)
          if (otp === null || final === null)
             {setLoading(true)
              return;}
          final.confirm(otp).then((result) => {
            setLoading(false)
          }).catch((err) => {
            setLoading(false)
              alert("Wrong code try again");
          })
      }

  return (
      <div style={{height:window.innerHeight-80,paddingTop:150}} >
      <div >
           {/* <LogoComponent /> */}
           <div>
               Hi there,
               Welcome!
               <br />
               <br />
           </div>
          {final?
          <>
            <div>
                OTP sent to +91-{mobileNumber}
            </div>
                <div>
                    <input className='onmenu-input' type="password" placeholder='enter OTP' value={otp} onChange={e=>setotp(e.target.value)} />
                </div>
                <div 
                className="text-left" 
                style={{width:'80%',margin:'auto',color:'grey'}} 
                onClick={()=>{
                    setfinal(null)
                }}
                >
                    change number
                </div>
                <br />
                <div>
                    <OnmenuButton onClick={ValidateOtp} loading={loading}>
                        Enter
                    </OnmenuButton>
                </div>
          </>
          :
            <>
          <div>
              <input className='onmenu-input' type="text" placeholder='Full Name' value={name} onChange={e=>setName(e.target.value)} />
          </div>
          <div>
              <input className='onmenu-input' type="text" placeholder='Mobile Number' value={mobileNumber} onChange={e=>setMobileNumber(e.target.value)} />
          </div>
          <div>
              <OnmenuButton onClick={login} loading={loading} >
                  Get OTP
              </OnmenuButton>
      <div id="recaptcha-container"/>
          </div>
          </>}
      </div>
  </div>
  );
}
