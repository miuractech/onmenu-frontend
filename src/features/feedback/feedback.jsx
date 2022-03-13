import React, { useEffect, useState } from 'react'
import BottomNav from '../../components/bottomNav'
import OnmenuButton from '../../components/button';
import Feedback1 from "../../images/feedback/1.svg";
import Feedback2 from "../../images/feedback/2.svg";
import Feedback3 from "../../images/feedback/3.svg";
import Feedback4 from "../../images/feedback/4.svg";
import firebase from "../../config/firebase";
import { useDispatch, useSelector } from 'react-redux';
import { selectAuth, setFeedback } from '../auth/authSlice';
import { useHistory, useParams } from 'react-router-dom';
import SimpleSnackbar from '../../components/snackbar';
import { selectCart } from '../cart/cartSlice';
import { Rating } from '@material-ui/lab';
import { setCurrent } from '../bottomNav/bottomSlice';
import { TextField } from '@material-ui/core';
import { selectrestaurant } from '../restaurant/restaurantSlice';
export default function Feedback() {
    const auth = useSelector(selectAuth);
    const restaurant = useSelector(selectrestaurant);
    const dispatch = useDispatch();
    const [dishFeedback, SetdishFeedback] = useState({})
    const [selected, setSelected] = useState(null)
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState({message:null,severity:null})
    const [textFeedback, setTextFeedback] = useState('')
    const cart = useSelector(selectCart)
    useEffect(() => {
        dispatch(setCurrent('feedback'))
    }, [])
    const reset = () => {
        setSuccess({message:null,severity:null})
    }
    const feedbackSubmit = () => {
        setLoading(true)
        if(!auth.feedBack && selected){
            firebase.firestore()
            .collection('feedback')
            .add({
                name:auth.userName,
                uid:auth.user.uid,
                name:auth.user.name | '',
                phone:auth.user.phoneNumber,
                feedback:selected,
                dishFeedback,
                timeStamp:firebase.firestore.FieldValue.serverTimestamp(),
                textFeedback,
                restaurantId:restaurant.restaurantId,
            })
            .then(()=>{
                dispatch(setFeedback(selected))
                setSuccess({message:'feedback sent successfully',severity:'success'})
                setLoading(false)
            })
            .catch(err=>{
                setSuccess({message:'something went wrong',severity:'error'})
                setLoading(false)
            })
        }
        else if(!selected){
            setSuccess({message:'Select option before feedback',severity:'warning'})
            setLoading(false)
        }
    }
    return (
        <div className='' >
            <div className='padding2' >
                <div className="font500" style={{textAlign:'left',fontSize:26,color:'#3C3C43'}} >
                How was your experience with us!
                </div>
                <br />
                <div style={{textAlign:'left',color:'#808084'}} >
                Please rate the restaurant 
                </div>
            </div>
            {cart.map(({dish})=>(
                <div className="margin2" style={{display:'grid',gridTemplateColumns:'2fr 1fr',gridGap:4}} >
                    <div className="text-left" >
                        {dish.dish_name}
                    </div>
                    <div className="text-left" >
                        <Rating 
                        disabled={auth.feedBack}
                        onChange={(event, newValue) => {
                            var temp = {...dishFeedback}
                            temp[dish.dish_name] = newValue
                            SetdishFeedback(temp);
                        }} />
                    </div>
                </div>
            ))}
                <div style={{marginTop:50}} >
                    <div className='flex' style={{justifyContent:'center',alignItems:'center'}} >
                        {[Feedback1,Feedback2,Feedback3,Feedback4].map((image,index)=>(
                            <div style={{margin:8,cursor:'pointer'}} onClick={()=>{
                                if(!auth.feedBack){
                                    setSelected(index)
                                }
                            }} >
                                <img src={image} style={{width:selected === index?100:75}} alt="" />
                            </div>
                        ))}
                    </div>
                </div>
                <br />
                <div>
                    <TextField 
                    type="text" 
                    variant='outlined'
                    InputProps={{
                        disableUnderline:true,
                    }} 
                    fullWidth
                    name="name"
                    placeholder={'Please write your feedback'} 
                    multiline 
                    rows={2}
                    rowsMax={5}
                    value={textFeedback}
                    onChange={e=>setTextFeedback(e.target.value)}
                    />
                </div>
                <OnmenuButton onClick={feedbackSubmit} loading={loading} disabled={auth.feedBack} style={{background:auth.feedBack?'#fde396':''}} >
                    {auth.feedBack?'Feedback sent':'Submit'}
                </OnmenuButton>
            {/* <BottomNav /> */}
            {success.message &&
                <SimpleSnackbar message={success.message} severity={success.severity} reset={reset} />}
        </div>
    )
}
