import { Card, CardMedia,  Drawer, IconButton } from '@material-ui/core'
import React, { useEffect, useRef } from 'react'
import { useState } from 'react';
import {  calcDishTotal, getPrice, getVariantImage } from './dishCard';
// import GlutenFree from "../../images/pd/glutenfree.jpg";
import NoPeanut from "../../images/pd/nopeanut.jpg";    

import CAFFINEICON from "../../images/pd/caffeine.png";
import EGGSICON from "../../images/pd/Contain_Eggs.png";
import NUTSICON from "../../images/pd/contains_nuts.png";
import DAIRYFREEICON from "../../images/pd/Dairy_Free.png";
import DAIRYICON from "../../images/pd/Dairy.png";
import EGGLESSICON from "../../images/pd/Eggless.png";
import GLUTENFREEICON from "../../images/pd/Gluten_Free.png";
import HEALTHYICON from "../../images/pd/Healthy.png";
import KETOICON from "../../images/pd/Keto.png";
import LOWFATICON from "../../images/pd/Low_fat.png";
import MUSHROOMICON from "../../images/pd/Mushrooms.png";
import NUTFREEICON from "../../images/pd/NUT_FREE.png";
import ORGANICICON from "../../images/pd/organic.png";
import SOYABEANICON from "../../images/pd/Soyabean.png";
import SPICYICON from "../../images/pd/Spicy.png";
import VEGANICON from "../../images/pd/Vegan.png";
import VERYSPICYICON from "../../images/pd/very_spicy.png";

import OnmenuButton from "../../components/button";
import { Add, ArrowRightAlt, Close, Remove } from '@material-ui/icons';
import { addToCart, removeFromCart, selectCart } from '../cart/cartSlice';
import { useDispatch, useSelector } from 'react-redux';
import { firestore } from '../../config/firebase';
import { selectrestaurant } from './restaurantSlice';


export default function DishPopUp({open,setOpen,filter,dish}) {
    const [selectedVariant, setSelectedVariant] = useState({food_preference:null,})
    const [selectSubVariant, setSelectSubVariant] = useState([])
    const [selectedAddon, setSelectedAddon] = useState([])
    const [quantity, setQuantity] = useState(1)
    const [recommended, setRecommended] = useState([])
    const [selectedRecommended, setSelectedRecommended] = useState(false)
    const dispatch = useDispatch()
    
    const addToCartFunc = () => {
        var data = {
            dish,
            selectedVariant,
            selectSubVariant,
            selectedAddon,
            quantity,
            // recommended:selectedRecommended,
        }
        dispatch(addToCart(data))
        setOpen(false)
    }
    useEffect(() => {
        if(dish?.recommendation?.length>0 && open){
            const recommendedQuery = dish.recommendation.map(r=>r.dish_id)
            firestore
           .collection('dishes')
           .doc(dish.restaurant_id)
           .collection(dish.type)
           .where('dish_id','in',recommendedQuery)
           .get()
           .then(snapshot=>{
               if(!snapshot.empty){
                   var d=[]
                   snapshot.forEach(doc=>{
                       d.push(doc.data()) 
                   })
                   setRecommended(d)
               }
           })
        }
        if(open && dish && dish.food_variants.length>0 && !selectedVariant.food_preference){
            if(filter.length>0){
                setSelectedVariant(dish.food_variants.filter(f=>filter.includes(f.food_preference))[0])
            }else{
                setSelectedVariant(dish.food_variants[0])
            }
            
        }
        else{
            // setSelectedVariant({food_preference:null,})
            setSelectedRecommended([])
            setSelectSubVariant([])
            setSelectedAddon([])
        }
        
    }, [open])
    // useEffect(() => {
    //     if(open && selectedVariant.food_preference){
    //         setSelectSubVariant([])
    //         setSelectedAddon([])
    //     }
    // }, [selectedVariant])
    const handleOptions = ({optionIndex,maxallow,index,name,price,preference}) => {
        const filteredOptions = selectSubVariant.filter(select=> select.optionIndex === optionIndex)
        const filterName = filteredOptions.filter(select=> select.index === index)
        if(filterName.length>0){
            const target = selectSubVariant.filter(select=>{
                if (select.index !== index || select.optionIndex !== optionIndex ){
                    return select
                }
            })
            setSelectSubVariant(target)
        } else if(filteredOptions.length<maxallow ){
            setSelectSubVariant([...selectSubVariant,{optionIndex,maxallow,index,name,price,preference}])
        }
    }
    const handleAddon = (val) => {
        if(selectedAddon.filter(select=> select.name === val.name).length>0){
            setSelectedAddon(t=>{
                return t.filter(sub=>sub.name !== val.name)
            }
        )}
        else {
            setSelectedAddon([...selectedAddon,val])
        }
    }

    // const handleRecommended = (val) => {
    //     if(selectedRecommended.filter(select=> select.name === val.name).length>0){
    //         setSelectedRecommended(t=>{
    //             return t.filter(sub=>sub.name !== val.name)
    //         }
    //     )}
    //     else {
    //         setSelectedRecommended([...selectedRecommended,val])
    //     }
    // }
    // console.log(dish);

    var total_calc = calcDishTotal(selectedVariant,selectSubVariant,selectedAddon,quantity)
    const total = total_calc?total_calc:0
    return(
        <>
        <Drawer 
        anchor='bottom' 
        // swipeAreaWidth={0}
        open={open} 
        onClose={()=>setOpen(false)} 
        style={{borderRadius:'10px 10px 0px 10px',maxWidth:400}} 
        classes={{ paper: 'round-corners' }}
        >
            <div>
                <div style={{position:'fixed',right:0}} > 
                    <IconButton style={{backgroundColor:'#222222aa',zIndex:5}} size='small' onClick={()=>setOpen(false)} >
                        <Close style={{color:'white'}} />
                    </IconButton>
                </div>
                <div className='dish-display-paper'  >
                    <div style={{margin:'auto'}} >
                        <img src={dish.images[0]} alt="dish" style={{width:'100%',maxWidth:444,height:300}} />
                    </div>
                    <div>
                        <div className="font700" style={{fontSize:22,padding:'12px 16px 4px 24px'}} >
                            {dish.dish_name}
                        </div>
                        {dish.description && <div className="font400" style={{margin:'4px 24px'}} >
                            {dish.description}
                        </div>}
                        <div className="font700 margin1 flex hide-scroll" style={{fontSize:16,overflow:'scroll'}} >
                            {dish.pictorial_description && Array.isArray(dish.pictorial_description) && dish.pictorial_description.map(des=>(
                                <React.Fragment key={des}>
                                    {getPictorialDescription(des,15)}
                                </React.Fragment>
                            ))}
                        </div>
                        
                        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',padding:'10px 40px',gridGap:10}} >
                            {dish.food_variants?.length>0 && (dish.food_variants).map(({food_preference,price}) => (
                                <React.Fragment key={food_preference}>
                                    {filter.length>0?
                                     <>
                                     {filter.includes(food_preference) &&
                                    <>
                                     <div  
                                    className='flex'
                                    style={{alignContent: 'center'}}
                                    onClick={()=>setSelectedVariant({food_preference,price})}
                                    >
                                        <div>
                                            <input 
                                            type="radio" 
                                            style={{scale:2}}
                                            name={food_preference} 
                                            checked={ food_preference === selectedVariant.food_preference} 
                                            /> &nbsp;
                                        </div>
                                        <div>
                                        {getVariantImage(food_preference,{height:16,width:16,marginBottom:-2})} &nbsp;
                                        </div>
                                        <div>

                                        {food_preference}
                                        </div>
                                    </div>
                                    <div style={{textAlign:'right'}}>
                                        {getPrice(price)}
                                    </div>
                                    </>
                                    }
                                    </>:
                                    <>
                                     <div  
                                    className='flex'
                                    style={{alignContent: 'center'}}
                                    onClick={()=>setSelectedVariant({food_preference,price})}
                                    >
                                        <div>
                                            <input 
                                            type="radio" 
                                            style={{scale:2}}
                                            name={food_preference} 
                                            checked={ food_preference === selectedVariant.food_preference} 
                                            /> &nbsp;
                                        </div>
                                        <div>
                                        {getVariantImage(food_preference,{height:16,width:16,marginBottom:-2})} &nbsp;
                                        </div>
                                        <div>

                                        {food_preference}
                                        </div>
                                    </div>
                                    <div style={{textAlign:'right'}}>
                                        {getPrice(price)}
                                    </div>
                                    </>
                                     }
                                   
                                </React.Fragment>
                            ))}
                        </div>
                        {dish.options?.length>0 &&
                        dish.options.map((option,optionIndex)=>(
                        <React.Fragment key={option.title} >
                            <div 
                            style={{display:'grid',gridTemplateColumns:'3fr 1fr ',padding:'10px 40px',gridGap:10}} 
                            >
                                <div className="font700 " style={{fontSize:15}} >
                                {option.title} (maximum allowed : {option.maxallow})
                                </div>
                                <div/>
                                {option.innerOptions.map(({name,price,preference},index) => (
                                    <React.Fragment key={name+index} >
                                        <div
                                        className='flex' 
                                        style={{alignItems:'center'}} 
                                        onClick={()=>handleOptions({optionIndex,maxallow:option.maxallow,index,name,price,preference})}  
                                        >
                                            <input 
                                            type="checkbox" 
                                            name={preference}
                                            checked={selectSubVariant.filter(vari=>{
                                                if(vari.index === index && vari.optionIndex === optionIndex ){
                                                    return vari
                                                }
                                            }).length> 0}                                             
                                            />
                                            &ensp;
                                            {getVariantImage(preference,{height:18,width:18})}&ensp;
                                            {name}
                                        </div>
                                        <div style={{textAlign:'right'}}>
                                            {getPrice(price)}
                                        </div>
                                    </React.Fragment>
                                ))}
                            </div>
                        </React.Fragment>
                        ))
                        }
                        <div style={{display:'grid',gridTemplateColumns:'3fr 1fr',padding:'30px',gridGap:10}} >
                        {dish.addons?.length>0 && 
                        <React.Fragment>
                            <div className="font700 " style={{fontSize:15}} >
                                Addons
                                </div>
                                <div />
                            {dish.addons.map(({name,price,preference,id}) => (
                                <React.Fragment key={id}>
                                    <div 
                                    onClick={()=>handleAddon({name,price})}
                                    >

                                        <input 
                                        type="checkbox" 
                                        name={name} 
                                        checked={selectedAddon.filter(add=>add.name === name).length>0} 
                                        /> &nbsp;
                                        {getVariantImage(preference,{height:18,width:18})}&ensp;
                                        {name}
                                    </div>
                                    <div style={{textAlign:'right'}}>
                                        {price}/-
                                    </div>
                                </React.Fragment>
                            ))}
                        </React.Fragment>
                        }
                        </div>
                        {recommended.length>0 && 
                        <div style={{padding:'12px 16px 4px 24px'}}>
                        <div className="font700 " style={{fontSize:15}} >
                            Recommended
                        </div>
                            <div
                            className=
                            "flex hide-scroll "
                            style={{width:'100%', overflowX:'scroll'}}
                            >
                                {recommended.map(dish=>(
                                    <div
                                    key={dish.dish_id}
                                    className="margin1"
                                    >
                                    <DishPopUp 
                                    dish={dish} 
                                    open={dish.dish_id===selectedRecommended}
                                    setOpen={setSelectedRecommended}
                                    filter={[]}
                                    />
                                        <Card
                                        style={{
                                            width:150
                                        }}
                                        onClick={()=>setSelectedRecommended(dish.dish_id)}
                                        >
                                        <CardMedia
                                            component="img"
                                            height="140"
                                            image={dish.images[0]}
                                            alt="green iguana"
                                        />
                                        <div
                                        className='text-ellipsis margin1 font600'
                                        >
                                            {dish.dish_name}
                                        </div>
                                        </Card>
                                    </div>
                                ))}
                            </div>
                        </div>
                    }
                    <div style={{height:100}} ></div>
                    </div>
                </div>
            </div>
                   {open && <div
                    className="padding1"
                    style={{
                        width:'100%',
                        position:'fixed',
                        bottom:-10,
                        background:'#fff',zIndex:10000,
                        display:'grid',
                        gridTemplateColumns:'1fr 1fr',
                        boxShadow: '0px -2px 8px rgba(172, 172, 172, 0.25)'
                    }} >
                    {dish.quantity ? 
                        <div style={{margin:'12px 24px'}} >
                            <IconButton disabled={quantity<1} onClick={()=>setQuantity(q=>q-1)} style={{border:'1px solid grey'}} size={'small'} >
                                <Remove />
                            </IconButton>
                            &ensp;
                            <span style={{margin:'0px 8px'}} >
                                {quantity}
                            </span>
                            &ensp;
                            <IconButton onClick={()=>setQuantity(q=>q+1)} style={{border:'1px solid grey'}} size={'small'} >
                                <Add />
                            </IconButton>
                        </div>
                        :
                        <div className='text-center' style={{marginTop:20}}>
                            Total : {total}
                        </div>
                        }
                        <div>
                            <OnmenuButton 
                            className='flex center-align'
                            style={{justifyContent: 'center',width:150}}
                            disabled={!selectedVariant.food_preference}
                                onClick={addToCartFunc} 
                                >
                                Add&nbsp;
                                {dish.quantity && <>({total})</>}
                                &nbsp;<ArrowRightAlt />
                            </OnmenuButton>
                        </div>
                    </div>}
        </Drawer>
                    </>
    )
}

const getPictorialDescription = (description) => {
    return <img src={pdInfo(description)} className='margin1 ' style={{height:50}} />
}


const pdInfo = (picdes) =>{
    const result = [
        {name:'Very spicy',src:VERYSPICYICON},
        {name:'Spicy',src:SPICYICON},
        {name:'Gluten free',src:GLUTENFREEICON},
        {name:'Nut free',src:NUTFREEICON},
        {name:'Dairy',src:DAIRYICON},
        {name:'Contains nuts',src:NUTSICON},
        {name:'Dairy free',src:DAIRYFREEICON},
        {name:'Organic',src:ORGANICICON},
        {name:'Vegan',src:VEGANICON},
        {name:'Low-fat',src:LOWFATICON},
        {name:'Healthy',src:HEALTHYICON},
        {name:'Contains eggs',src:EGGSICON},
        {name:'Eggless',src:EGGLESSICON},
        {name:'Keto',src:KETOICON},
        {name:'Contains mushrooms',src:MUSHROOMICON},
        {name:'Contains soybean',src:SOYABEANICON},
        {name:'Contains caffeine',src:CAFFINEICON},
    ].filter(pd=>pd.name === picdes)
    const source = (result.length>0)?result[0]['src']:''
    return source
} 