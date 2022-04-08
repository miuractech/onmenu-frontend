import { Button, ButtonGroup, Card, Dialog, DialogActions, DialogContent, Divider } from '@material-ui/core'
import React, { useState } from 'react'
import VegIcon from '../../Icons/veg.icon'
import VeganIcon from '../../Icons/vegan.icon'
import NonVegIcon from '../../Icons/non.veg.icon'
import EggIcon from '../../Icons/egg.icon'
import './dishCard.css'
import DishPopUp from './dishPopUp'
import { useDispatch, useSelector } from 'react-redux'
import { removeFromCart, selectCart } from '../cart/cartSlice'
import { RibbonContainer,  LeftCornerLargeRibbon   } from "react-ribbons";


export const actionButtonStyle = {
    width:40,
    height:32,
    fontSize:12,
    color: 'white',
    marginTop:8,

}
// function DishCard({dish}) {
//     const cart = useSelector(selectCart)
//     const dispatch = useDispatch()
//     const [open, setOpen] = useState(false)
//     const [confirmRemove, setConfirmRemove] = useState(false)
//     var inCart = cart[dish.dishId]
//     alert('repete')
//     return (
//         <div style={{borderBottom:'1px solid grey'}} >
//             <Card 
//             elevation={0} 
//             className='poppins' 
//             style={{
//                 margin:'8px auto',
//                 textAlign:'left',
//                 borderRadius:10,
//                 height:110,
//                 padding:12
//                 }} 
//             key={dish.dishId} 
//             >
//                 <div className="flex" style={{flexGrow:1}}>
//                     {/* ---------------- dis
//                     h images -----------------------*/}
//                     <div onClick={()=>setOpen(true)} >
//                         <img src={dish.images[0]} alt={dish.dish_name} className='dish-img-small border10' />
//                     </div>

//                     {/* ------------------------ namd and description -------------------------- */}
//                     <div style={{marginLeft:16,flexGrow:1}}  >
//                         <div className='font500 dish-title' onClick={()=>setOpen(true)}  >
//                             {dish.dish_name}
//                         </div>
//                         <div className='dish-description' onClick={()=>setOpen(true)} >
//                             {dish.description}
//                         </div>

//                         {/*------------------------------------- variant prices -------------------------------- */}
//                         <div style={{display:'grid',gridTemplateColumns:'2fr 1fr',gridGap:2,flexGrow:1}} >
//                             <div  style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gridGap:2,fontSize:12}}  onClick={()=>setOpen(true)} >
//                                 {dish.food_variants && dish.food_variants.length>0 && dish.food_variants.map(({foodVariant,price},index)=>(
//                                     <div className='flex' key={foodVariant+index} >
//                                         <div>
//                                             {getVariantImage(foodVariant)} &nbsp;
//                                         </div>
//                                         <div>
//                                             {getPrice(price)}/-&ensp; 
//                                         </div>
//                                     </div>
//                                 ))}
//                             </div>

//                                     {/* ------------------------- call to action button -------------------------- */}

//                             <div>
//                                    {inCart?
//                                     <Button variant='contained' color='primary' size='small' style={{...actionButtonStyle,background:'#42ba96',}} onClick={()=>setConfirmRemove(dish.dishId)} >
//                                         In Cart
//                                     </Button>
//                                    :
//                                     <Button variant='contained' color='primary' size='small' style={{...actionButtonStyle}}  onClick={()=>setOpen(true)} >
//                                         Add
//                                     </Button>
//                                     }
//                             </div>
                                 
                            
//                         </div>
//                     </div>
//                 </div>
//             </Card>

//             {/* ------------------------- dish popup --------------------------- */}
//             <DishPopUp open={open} setOpen={setOpen} dish={dish} />
//             <Dialog 
//             open={Boolean(confirmRemove)}
//             onClose={()=>setConfirmRemove(null)}
//             >
//                 <DialogContent  >
//                     <div className="padding1">
//                         Are you sure you want to remove dish from cart?
//                     </div>
//                 </DialogContent>
//                 <DialogActions>
//                     <Button 
//                     style={{flexGrow:1}}
//                     onClick={()=>setConfirmRemove(null)}
//                     >
//                         Cancel
//                     </Button>
//                     <Button
//                     className='onmenu-button'
//                     style={{color:'white'}}
//                     onClick={()=>{
//                         dispatch(removeFromCart(dish.dishId))
//                         setConfirmRemove(false)

//                     }}
//                     >
//                         Yes
//                     </Button>
                    
//                 </DialogActions>
//             </Dialog>
//         </div>
//     )
// }

export const calcDishTotal = (selectedVariant,selectSubVariant,selectedAddons,quantity,packingCharge) => {
    var total = parseFloat(selectedVariant.price)
    // console.log('price',{selectedVariant,selectSubVariant,selectedAddons,quantity,recommended});
    total = selectSubVariant.length>0 ? selectSubVariant.reduce( function(a, b){
        return a +parseFloat(b['price']);
    }, total): total
    total = selectedAddons.length>0 ? selectedAddons.reduce( function(a, b){
        return a +parseFloat(b['price']);
    }, total): total   
    if(packingCharge>0){
        total = total + parseFloat(packingCharge)
    }   
    var total = quantity?quantity * total : total
    return total 
}

function DishCard({dish,filter,menuPublish,categoryPublish}) {
    const [open, setOpen] = useState(false)
    const dispatch = useDispatch()
    const restaurant = useSelector(state=>state.restaurant)
    console.log(restaurant);
    const [confirmRemove, setConfirmRemove] = useState(false)
    
    const publishStatus = (dish.published === true) && menuPublish && categoryPublish
    return (
        <div style={{margin:'14px 0px'}} >
            
            <Card 
            style={{padding:8,minHeight:121,borderRadius:12}} 
            elevation={0} 
            onClick={()=>{
                if(publishStatus){
                    setOpen(true)
                }
            }}
            >
            <RibbonContainer >
                    {dish.specialty_tags && publishStatus && 
                    <LeftCornerLargeRibbon backgroundColor={'#E7D27C'} >
                        <div style={{fontSize:10,position:'relative'}}  >
                            {dish.specialty_tags}
                        </div>
                        </LeftCornerLargeRibbon>
                    } 
                <div className="flex" style={{flexGrow:1,width:'100%'}}>
                    <div 
                    >
                    
                    {dish.images?.length>0 ?
                        <img src={dish.images[0]} style={{filter:publishStatus?'unset':'grayscale(100%)'}} alt={dish.dish_name} className='dish-img-small border10' />:
                        <img src={'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=='} alt={dish.dish_name} className='dish-img-small border10' />
                    }
                    </div>
                    <div style={{marginLeft:16,flexGrow:1,color:publishStatus?'inherit':'grey'}}  >
                         <div className='font500 dish-title text-left'   >
                             {dish.dish_name}
                         </div>
                         <div className='dish-description text-left'  >
                             {dish.description}
                         </div>
                         {/*------------------------------------- variant prices -------------------------------- */}
                         {!publishStatus ? 
                         <div style={{display:'grid',gridTemplateColumns:'2fr 1fr',gridGap:2,flexGrow:1}} >
                             <div />
                            <div style={{fontSize:10,color:'#888'}} >
                                <br/>
                                <br/>
                                unavailable
                            </div>
                         </div>
                         :                         
                         <div style={{display:'grid',gridTemplateColumns:'2fr 1fr',gridGap:2,flexGrow:1}} >
                             <div  style={{display:'grid',gridTemplateColumns:'1fr 1fr ',gridGap:2,fontSize:12}}   >
                                 {dish.food_variants && dish.food_variants.length>0  && dish.food_variants.map(({food_preference,price},index)=>(
                                     <React.Fragment key={food_preference}>
                                     {filter.length>0?
                                     <>
                                     {filter.includes(food_preference) &&
                                    <div className='flex' key={food_preference+index} >
                                        <div>
                                            {getVariantImage(food_preference,{height:14,width:14,marginBottom:-2})} &ensp;
                                        </div>
                                        <div>
                                            {getPrice(price)}&ensp; 
                                        </div>
                                    </div>}
                                    </>:
                                    <div className='flex' key={food_preference+index} >
                                    <div>
                                        {getVariantImage(food_preference,{height:14,width:14,marginBottom:-2})} &ensp;
                                    </div>
                                    <div>
                                        {getPrice(price)}&ensp; 
                                    </div>
                                </div>
                                     }
                                </React.Fragment>
                                ))}
                            </div>

                                    {/* ------------------------- call to action button -------------------------- */}
                                    
                                    <div >
                                        <Button 
                                        color='primary'
                                        size='small'
                                        style={{...actionButtonStyle,background:'linear-gradient(95.95deg, #021E80 1.17%, rgba(2, 31, 130, 0.78) 99.06%)',}}  
                                        >
                                            Add
                                        </Button>
                                        {(dish.quantity || dish.options.length>0 || dish.addons.length>0 ) &&<div style={{fontSize:10,color:'#888'}} >
                                            customize
                                        </div>}
                                    </div>
                                  
                                 
                            
                        </div>}
                    </div>
                </div>
            </RibbonContainer>
            </Card>
            <Divider />
            <DishPopUp open={open} setOpen={setOpen} dish={dish} filter={filter} />
            <Dialog 
            open={confirmRemove}
            onClose={()=>setConfirmRemove(false)}
            >
                <DialogContent  >
                    <div className="padding1">
                        Are you sure you want to remove dish from cart?
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button 
                    style={{flexGrow:1}}
                    onClick={()=>setConfirmRemove(false)}
                    >
                        Cancel
                    </Button>
                    <Button
                    className='onmenu-button'
                    style={{color:'white'}}
                    onClick={()=>{
                        dispatch(removeFromCart(dish.dish_id))
                        setConfirmRemove(false)

                    }}
                    >
                        Yes
                    </Button>
                    
                </DialogActions>
            </Dialog>
        </div>
    )
}



export default DishCard



export const getVariantImage = (variant,style) => {
        const variantImage = {
            'egg':<EggIcon style={style}  />,
            'chicken':<NonVegIcon style={style}  />,
            'lamb':<NonVegIcon style={style}  />,
            'fish':<NonVegIcon style={style}  />,
            'turkey':<NonVegIcon style={style}  />,
            'prawn':<NonVegIcon style={style}  />,
            'beef':<NonVegIcon style={style}  />,
            'duck':<NonVegIcon style={style}  />,
            'lobster':<NonVegIcon style={style}  />,
            'mutton':<NonVegIcon style={style}  />,
            'pork':<NonVegIcon style={style}  />,
            'poultry':<NonVegIcon style={style}  />,
            'rabbit':<NonVegIcon style={style}  />,
            'non-veg':<NonVegIcon style={style}  />,
            'crab':<NonVegIcon style={style}  />,
            'veg':<VegIcon style={style}  />,
            'vegan':<VeganIcon style={style} />,
        }
        return variantImage[variant]
}


export const getPrice = (price) => {
    return price = (price === '0')?null:`${price}`
}



