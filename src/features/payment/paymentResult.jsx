import { Typography } from '@material-ui/core'
import React from 'react'
import Lottie from 'react-lottie';
import SUCCESS from "../../images/success.json";
import FAIL from "../../images/fail.json";
import PENDING from "../../images/pending.json";
import OnmenuButton from '../../components/button';
import { useHistory } from "react-router-dom";
import { useSelector } from 'react-redux';
import { selectrestaurant } from '../restaurant/restaurantSlice';
export default function PaymentResult({orderSucess,paymentData,setOrderSucess,takeawayMode}) {
    const history = useHistory()
    const { restaurantId } = useSelector(selectrestaurant)
    return (
        <div className='flex' style={{alignItems:'center',justifyContent:'center',height:'calc(100vh - 150px)'}} >
            <div>
                        {/* <Typography >
                                          payment status:
                                        </Typography> */}
                        <Typography variant='h5' color='primary' >
                            {orderSucess && orderSucess.paymentStatus}
                        </Typography>
                        {(orderSucess && orderSucess.status === 'success') ?
                            <>
                                <div style={{ margin: '12px auto' }} >
                                    {(orderSucess.paymentStatus.toLowerCase() === 'pending') ?
                                        <Lottie options={{ animationData: PENDING, loop: false }} height={100} width={100} />
                                        :
                                        <Lottie options={{ animationData: SUCCESS, loop: false }} height={100} width={100} />
                                    }
                                </div>
                                   {takeawayMode && 
                                        <Typography variant='h5' >
                                            order placed
                                        </Typography>
                                   }
                                <Typography variant='h5' style={{ fontWeight: 700, display: 'flex', justifyContent: 'center', alignItems: 'center' }} >
                                    {/* {orderSucess.by} */}
                                    <span style={{ fontWeight: 'normal', fontSize: 14 }} > &nbsp;
                                            {orderSucess.time && <> -&ensp;{orderSucess.time} </>}
                                    </span>
                                </Typography>

                                <Typography variant='h5' color='primary' >

                                 order id:   {orderSucess.id}
                                </Typography>
                                <Typography color='textSecondary' variant='body2' >
                                    {paymentData.description}
                                </Typography>
                                <br />
                            </>
                            :
                            <>
                                <div style={{ margin: '30px auto' }} >

                                    <Lottie options={{ animationData: FAIL, loop: false }} height={100} width={100} />
                                </div>
                                <div style={{ margin: '20px auto' }} >
                                    <Typography variant='h5' color='error' >
                                        Payment Failed
                                  </Typography>
                                    <Typography variant='h5' style={{ fontWeight: 700 }} >
                                        {orderSucess && orderSucess.by}
                                    </Typography>
                                </div>
                            </>
                        }
                        <div style={{ margin: '10px auto' }} >
                            {takeawayMode?
                            <OnmenuButton variant='contained' color='primary' onClick={() => {
                                setOrderSucess(null)
                                history.push(`/restaurant/${restaurantId}/restaurantInfo`)
                            }} >
                                {orderSucess && orderSucess.status === 'success' ? 'Done' : 'try again'}
                            </OnmenuButton>
                            :
                            <OnmenuButton variant='contained' color='primary' onClick={() => {
                                setOrderSucess(null)
                            }} >
                                {orderSucess && orderSucess.status === 'success' ? 'Done' : 'try again'}
                            </OnmenuButton>
                            }
                        </div>
                        {(orderSucess && orderSucess.status === 'success') &&
                            <div style={{ marginTop: 40 }}>

                                <Typography variant='subtitle2' color='textSecondary'  >
                                    A confirmation email has been sent to you.
                        </Typography>
                            </div>
                        }
                    </div>
        </div>
    )
}