import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setCurrent } from '../bottomNav/bottomSlice';
import { selectrestaurant, setRestaurant } from '../restaurant/restaurantSlice'
import { useParams } from "react-router-dom";
const itsonmenuOfficialName="Onmenu"

export default function Terms() {
    const { restaurantId } = useParams();
    // const history = useHistory()
    const dispatch = useDispatch()
    const restaurant = useSelector(selectrestaurant)
    useEffect(() => {
    dispatch(setRestaurant(restaurantId))
    dispatch(setCurrent('home'))
    }, [])
    console.log(restaurant);
    return (
        <div
        style={{textAlign: 'justify'}}
        >
            <br />
            <div>
                <b>
                    Terms of Use
                </b>
            </div>
            <br />
            <b>
                Welcome to the digital menu of  {restaurant?.restaurant?.corporateName}!
            </b>
            <br />
            The document is a legally binding contract between the user and the service provider regarding the use of this digital menu interface.
            The Users are advised to read the Terms carefully before using the service. Any use of the services means that the user agrees to be bound by these terms. 
            <br />
            <br />
            <b>
                The Parties
            </b>
            <br />
            <br />
            In this document, 
            “you” or “your” refers to the user of this digital menu interface accessing via laptop, mobile phone or any similar device.
            <br />
            <br />
            “we”, “us” or “our” refers to {restaurant?.restaurant?.corporateName}, registered under the Corporate name of {restaurant?.restaurant?.corporateName} 
            <br />
            <br />
            “Service provider” refers to {itsonmenuOfficialName}
            <br />
            <br />
            <u>
                Scope of the interface
            </u>
            <br />
            <br />

            This digital menu allows You to view, browse, search, filter, make notes for order, place order, make reservations, provide feedback on the products and services offered and contact  Us. It also enables you to make digital payments for the products or services availed from us.
            <br />
            <br />
            <u>
                The terms of use
            </u>
            <br />
            <br />
            These Terms of use apply to all users and persons who access the Services, in any manner or through any means of access.Using this platform in any means including accessing, browsing indicates your unconditional consent to all the terms and conditions mentioned herein. We  thereby notify you to PLEASE READ THIS DOCUMENT CAREFULLY BEFORE PROCEEDING
            <br />
            <br />
            <u>
                User Account: 
            </u>
            <br />
            <br />
            You will have to provide us with your name and mobile number  and other necessary information to avail the service. The use of this information by Us is explained in detail in the Privacy policy.
            <br />
            <br />
            <u>
            Ownership of Content and Information:
            </u>
            <br />
            <br />
            The contents and the information displayed on the interface and accessible by You is owned by Us and the technology enabling this service is provided {itsonmenuOfficialName}.
            The contents of the digital menu is in accordance with the law of India as and where applicable.
            <br />
            <br />
            <u>
            Accuracy of Information:
            </u>
            <br />
            <br />
            The products and services offered by  Us at any given point of time as displayed in the digital menu is subject to availability of the same.
            The timings of the menu availability is subject to change without any prior intimation.
            Any menu displayed outside its publishing hours is for reference purpose only and is subject to change.
            Any description and representation of the products or services is for reference purpose only and may not depict the actual offering.
            The prices and the bill amount shown in the digital menu are an approximate estimate only and not the final bill amount. The amount to be paid is subject to various factors like governmental tax, service charges, cess and other items manually ordered or availed from Us.
            The rewards and loyalty programmes are subject to terms and conditions specified therein and shall be claimed upon the sole discretion of our management.
            <br />
            <br />
            <u>
            Cancellation and Refund:
            </u>
            <br />
            <br />
            The cancellation of any product/service after placing an order or reservation or any similar action shall be fulfilled solely at Our discretion.
            In the event of any full payment or earnest money or advance paid for the service, then on cancellation of the service, the refund claims shall be exercised solely at Our discretion.
            Our management reserves the right to demand payment or  withhold whole or part of the payment made, towards the cancelled product or service. 
            <br />
            <br />
            <u>
            Amendments: 
            </u>
            <br />
            <br />
            These terms are subject to further addition, deletion or alteration without prior intimation.
            The scope of the services offered by us may differ without any prior intimation.
            <br />
            <br />
            <u>
            Restrictions to use:
            </u>
            <br />
            <br />
            You shall use this service only to communicate with Us regarding browsing , availing Our services, contacting Us and other associated purposes which are personal and non-commercial in nature,  within the ambit of law.
            You shall not use the information or contents provided in this webpage for any other use without prior consent from us.
            You shall not use the webpage for or introduce any illegal or irrelevant content, failing which shall subject you to be punishable under Indian law
            <br />
            <br />
            <u>
            Payment:
            </u>
            <br />
            <br />
            Digital payment is enabled by third party- Razorpay. For any concerns relating to terms of use, please check their website.
            <br />
            <br />
            <u>
            Copyright to feedback:
            </u>
            <br />
            <br />
            We reserve the right to use, modify, alter, publish the feedback provided by You in this interface for advertising, analytics and business development plan.
            <br />
            <br />
            <u>
            Governing Law & Jurisdiction:
            </u>
            <br />
            <br />
            The Terms of Use shall be construed in accordance with the applicable laws of India.
            Any disputes arising out of or in connection with these Terms shall be subject to arbitration, the proceeding of which is to be held at Our principal place of business.

        </div>
    )
}
