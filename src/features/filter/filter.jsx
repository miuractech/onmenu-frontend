import { Chip, Typography } from '@material-ui/core'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { selectrestaurant } from '../restaurant/restaurantSlice'
import { selectFilter, setFilter } from './filterSlice'
import VEGICON from "../../images/filter/veg.svg";
import VEGANICON from "../../images/filter/vegan.png";
import EGGICON from "../../images/filter/egg.svg";
import CRABICON from "../../images/filter/crab.png";
import LAMBICON from "../../images/filter/lamb.png";
import SHRIMPICON from "../../images/filter/shrimp.svg";
import BEEFICON from "../../images/filter/beef.png";
import CHICKENICON from "../../images/filter/chicken.png";
import DUCKICON from "../../images/filter/duck.png";
import FISHICON from "../../images/filter/fish.png";
import LOBSTERICON from "../../images/filter/lobster.png";
import MUTTONICON from "../../images/filter/mutton.png";
import PORKICON from "../../images/filter/pork.png";
import POULTRYICON from "../../images/filter/poultry.png";
import PRAWNICON from "../../images/filter/prawn.png";
import RABBITICON from "../../images/filter/rabbit.png";
import TURKEYICON from "../../images/filter/turkey.png";
import { getVariantImage } from '../restaurant/dishCard'
// import VEGICON from "../../images/filter/veg.svg";

export default function Filter({
    // selectedFilter, 
    // setSelectedFilter
}) {
    // const restaurant = useSelector(selectrestaurant)
    const filter = useSelector(selectFilter)
    const dispatch = useDispatch()
    return (
        <div style={{maxWidth:280}} >
            {Object.keys(variants).map(vari=>(
                <div key={vari} >
                    <div style={{margin:'20px'}} >
                        <React.Fragment key={vari} >
                            <div 
                            
                            className='flex pointer-cursor center-align' 
                            >
                                {getVariantImage(vari,{height:12,width:12,marginBottom:4})}
                                &ensp;
                                <Typography gutterBottom style={{fontWeight:500}} >
                                {vari}
                                </Typography>
                            </div>
                             <div className='flex' style={{marginLeft:25,flexWrap:'wrap'}} >
                                {variants[vari].map(subVariants=>(
                                    <div 
                                    key={subVariants.name}
                                    className='margin1'
                                    style={{alignItems:'center'}} 
                                    // onClick={()=>handleFilter(subVariants)}  
                                    
                                    >
                                        <Chip
                                        // avatar={<img src={subVariants.image} style={{width:50}} />}
                                        label={subVariants.name}
                                        onClick={()=>dispatch(setFilter(subVariants.name))}
                                        style={{background:(filter.includes(subVariants.name))?'#e3eeff':'#fbfbfd',minWidth:50}}
                                        variant={(filter.includes(subVariants.name))?'filled':'default'}
                                        color={(filter.includes(subVariants.name))?'primary':'default'}
                                        />
                                    </div>
                                ))}
                            </div>
                        </React.Fragment>
                    </div>
                </div>
            ))}
        </div>
    )
}

const variants = {
    'veg':[
        {name:'veg',image:VEGICON},
    ],
    'vegan':[
        {name:'vegan',image:VEGANICON},
    ],
    'non-veg':[
        {name:'chicken',image:SHRIMPICON},
        {name:'lamb',image:LAMBICON},
        {name:'fish',image:FISHICON},
        {name:'turkey',image:TURKEYICON},
        {name:'prawn',image:PRAWNICON},
        {name:'beef',image:BEEFICON},
        {name:'duck',image:DUCKICON},
        {name:'lobster',image:LOBSTERICON},
        {name:'mutton',image:MUTTONICON},
        {name:'pork',image:PORKICON},
        {name:'poultry',image:POULTRYICON},
        {name:'rabbit',image:RABBITICON},
        {name:'crab',image:CRABICON},
    ],
    'egg':[
        {name:'egg',image:EGGICON},
    ],
}

export const filterImages = {
    veg:VEGICON,
    vegan:VEGICON,
    chicken:CHICKENICON,
    lamb:LAMBICON,
    egg:EGGICON,
    beef:BEEFICON, 
    duck:DUCKICON,
    fish:FISHICON,
    lobster:LOBSTERICON,
    mutton:MUTTONICON,
    pork:PORKICON,
    poultry:POULTRYICON,
    prawn:PRAWNICON,
    rabbit:RABBITICON,
    turkey:TURKEYICON,
    crab:CRABICON
}













  