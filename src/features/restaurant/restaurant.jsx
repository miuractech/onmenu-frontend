import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams,useHistory  } from 'react-router-dom'
import { selectrestaurant, setRestaurant } from './restaurantSlice'
import dayjs from "dayjs";
import { Link as ScrollLink } from 'react-scroll'
import MenuTickIcon from "../../Icons/menuTick.svg";
import Dishes from './dishes';
import { selectFilter, setFilter } from '../filter/filterSlice';
import {  setCurrent, setSelectedType } from '../bottomNav/bottomSlice';
import { AppBar, Dialog, DialogTitle,  List, ListItem, ListItemText } from '@material-ui/core';
import { ArrowDropDown } from '@material-ui/icons';
import { filterImages } from '../filter/filter';
// import { useScrollTrigger } from '@material-ui/core';
import firebase from 'firebase/app'

export function Restaurant() {
    const { restaurantId,type } = useParams()
    const restaurant = useSelector(selectrestaurant)
    const history = useHistory()
    const dispatch = useDispatch()
    const [selectedMenu, setSelectedMenu] = useState(null)
    const [selectedCategory, setSelectedCategory] = useState(null)
    const [scrollTrigger, setScrollTrigger] = useState(false)
    const [menuOpen, setMenuOpen] = useState(false)
    const [categoryOpen, setCategoryOpen] = useState(false)
    const [currentCategories, setCurrentCategories] = useState(null)
    const menus = restaurant.menus;
    const categories = restaurant.categories;
    const filter = useSelector(selectFilter)
    useEffect(() => {
        if(!restaurant.menus){
            dispatch(setRestaurant(restaurantId,history))
        }
        dispatch(setSelectedType(type))
        dispatch(setCurrent('home'))
        window.addEventListener('scroll',handleScroll)
        return (()=>{
        window.removeEventListener('scroll',handleScroll)
        })
    }, [])
    const handleScroll = () => {
        if(window.scrollY>80){
            setScrollTrigger(true)
        }
        else{
            setScrollTrigger(false)
        }
    }
    useEffect(() => {
        if(menus && menus[type] && !selectedMenu){
            const target = restaurant.menus[type]
            setSelectedMenu(target[0])
        }
    }, [menus,type])
    useEffect(() => {
        if(selectedMenu){
            const filtered = categories?.filter(d=>d.menuId===selectedMenu.menuId)
            if(filtered?.length>0){
                setCurrentCategories(filtered)
                const scategory = filtered[0]
                setSelectedCategory(scategory)
            }
            else{
                setCurrentCategories([])
                setSelectedCategory(null)
            }
        }
    }, [selectedMenu])
    console.log('selectedMenu',menus && type && menus[type]);
    return (
        <div 
        >
        
            <AppBar 
            position='fixed'
            elevation={0}
            style={{
                zIndex:150,
                backgroundColor:'white',
                top:50,
                left:0,
                width:'100%'
            }} 
            color='default'
            >
        {menus && !scrollTrigger?
            <>
            <div className='flex hide-scroll' 
            style={{
                overflowX:'scroll',
                width:'100%',
                marginTop:10,
                // maxWidth:400,
                }}>
                {filter.map(variant=>(
                    <div 
                    key={variant}
                    onClick={() =>{dispatch(setFilter(variant))}}
                    >
                      <img src={filterImages[variant]} style={{margin:'4px 8px',height:30,zIndex:10}} alt="" />
                    </div>
                ))}
            </div>
            <div 
            className='flex hide-scroll' 
            style={{
                background:'#F6F6F9',
                margin:'8px 0px',
                overflowX:'scroll',
                width:'100%',
                // maxWidth:400,
                }} >
                {selectedMenu && [...menus[type]].sort((a, b) => (parseInt(a.index) < parseInt(b.index)) ? -1 : 1 ).map(menu => (
                    <ScrollLink
                    to={menu.menuId}
                    spy={true}
                    smooth={true}
                    duration={1500}
                    offset={-120}
                    key={menu.name}
                    >
                        <div 
                        key={menu.menuId} 
                        className='flex' 
                        style={{
                            fontSize:12,
                            cursor:'pointer',
                            textAlign:'center',
                            margin:'0px 8px',
                            height:50,
                            alignItems:'center',
                            borderRadius:5,
                            justifyContent:'center',
                            width:80,
                            padding:'2px 16px',
                            background:selectedMenu.menuId===menu.menuId?'rgba(0, 127, 243, 0.2)':'inherit'
                            }} 
                        onClick={()=>setSelectedMenu(menu)} 
                        >
                            {menu.name}
                        </div>
                    </ScrollLink>

                ))}
            </div>
            <div 
            className='flex hide-scroll' 
            style={{
                padding:'8px 0px',
                overflowX:'scroll',
                height:'100%',
                width:'100%',
                }} >
            {currentCategories?.map(category=>(
                <ScrollLink
                activeClass="active" 
                className="test1"
                to={selectedMenu.menuId+category.categoryId}
                spy={true}
                smooth={true}
                duration={1000}
                offset={-120}
                key={category.categoryId}
                >

                    <div 
                    style={{
                        fontSize:12,
                        cursor:'pointer',
                        textAlign:'center',
                        margin:'0px',
                        // height:60,
                        position:'relative',
                        borderRadius:6,
                        width:70,
                    }} 
                    onClick={()=>setSelectedCategory(category)} 
                    >
                    {selectedCategory && (category.categoryId === selectedCategory.categoryId) && <div style={{position:'absolute',left:'calc(50% - 12px)',top:12}} >
                        <img src={MenuTickIcon} style={{width:25,height:25}} alt="" />
                    </div>}
                    <div>
                        <img src={category.image} style={{width:50,height:50,borderRadius:'50%'}} alt="" />
                    </div>
                    <div className='text-ellipsis' style={{fontSize:'10px'}} >
                        {category.name}
                    </div>
                </div>
                </ScrollLink>
            ))}
        </div>
            </>
            :
            <>
            {selectedMenu && selectedCategory &&
            <div
            style={{
                width:'100%',
                // height:70,
                background:'#fff',
                
            }}
            >
                <div 
                className='flex hide-scroll'
                style={{overflowX:'scroll',marginTop:10,}}
                >
                    {filter.map(variant=>(
                        <div onClick={()=>dispatch(setFilter(variant))} >
                            <img src={filterImages[variant]} style={{margin:'4px 8px',height:30,zIndex:10}} alt="" />
                        </div>
                    ))}
                </div>
                <div className="flex padding1">
                    <div>
                        <button
                        onClick={() => setMenuOpen(true)} 
                        className="flex pointer-cursor center-align black-button"
                        >
                        Menu
                        <ArrowDropDown />
                        </button>
                    </div>
                    <div>
                        <button
                        onClick={() => setCategoryOpen(true)}
                        className="flex pointer-cursor center-align black-button"
                        >
                            Category
                            <ArrowDropDown />
                        </button>
                    </div>
                </div>
            </div>}
          
            </>
        }
        </AppBar>
        <div style={{height:filter?.length>0?210:160}}/>
        {restaurant.menus && currentCategories &&
            <Dishes 
            type={type} 
            currentCategories={currentCategories}
            // selectedMenu={selectedMenu} 
            // selectedCategory={selectedCategory}
            // setSelectedMenu={setSelectedMenu}
            // setSelectedCategory={setSelectedCategory}
            
            />
        }
            <Dialog
            onClose={()=>setMenuOpen(false)} 
            open={menuOpen}
            
            >
            <DialogTitle>Select Menu</DialogTitle>
            <List 
            sx={{ pt: 0 }}
            
            >
            {selectedMenu && menus[type].map((menu) => (
                <>
                <ScrollLink
                    to={menu.menuId}
                    spy={true}
                    smooth={true}
                    duration={1500}
                    offset={-120}
                    key={menu.name}
                    >
                <ListItem 
                button 
                onClick={() =>{
                    setSelectedMenu(menu)
                    setMenuOpen(false)
                    }} 
                key={menu.menu_id}>
                <ListItemText primary={menu.name} 
                className='padding2'
                />
                </ListItem>
                </ScrollLink>
                </>
            ))}
            </List>
            </Dialog>

            <Dialog
            onClose={()=>setCategoryOpen(false)} 
            open={categoryOpen}
            
            >
            <DialogTitle>Select Category</DialogTitle>
            <List 
            sx={{ pt: 0 }}
            
            >
            {selectedCategory && currentCategories?.map((category) => (
                <>
                <ScrollLink
                    to={selectedMenu.menuId+category.name}
                    spy={true}
                    smooth={true}
                    duration={1500}
                    offset={-120}
                    key={category.name}
                    >
                <ListItem 
                button 
                onClick={() =>{
                    setSelectedCategory(category.name)
                    setCategoryOpen(false)
                    }} 
                key={category.name}>
                <ListItemText primary={category.name} 
                className='padding2'
                />
                </ListItem>
                </ScrollLink>
                </>
            ))}
            </List>
            </Dialog>
        </div>

    )
}



export const weekDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
export function checkMenuAvailibility(fetchedMenus) {
    // console.log(fetchedMenus);
    const now = new firebase.firestore.Timestamp.now().toDate()
    const date = now.getDate()
    const month = now.getMonth()
    const year = now.getFullYear()
    const currentDayOfWeek = now.getDay();
    // console.log(fetchedMenus);
    const filteredMenus = fetchedMenus.filter((menu) => {
        if(menu.timing[weekDays[currentDayOfWeek]].length>0){
            // console.log(menu,menu.timing[weekDays[currentDayOfWeek]]);
            var { from, to } = menu.timing[weekDays[currentDayOfWeek]][0]
            if(typeof(from) === 'number'){
              from = new Date(from)
              from.setFullYear(year,month,date)
            //   console.log('from',from);
            }else if(from instanceof Object){
              from = from.toDate()
              from.setFullYear(year,month,date)
            //   console.log('from',from);
            }
            if(typeof(to) === 'number'){
              to = new Date(to)
              to.setFullYear(year,month,date)
            //   console.log('to',to);
            }else if(to instanceof Object){
                to = to.toDate()
                to.setFullYear(year,month,date)
                // console.log('to',to);
            }
            // console.log('now',now);
            // console.log('from check',now.getTime()>from.getTime());
            // console.log('to check',now.getTime()<to.getTime());

            if(now.getTime()>from.getTime() && now.getTime()<to.getTime()){
                return true
            }
        }
        else {
            return false
        }
    })
    // alert(new Date(`${todayString} ${fetchedMenus[0].timing[weekDays[currentDayOfWeek]][0].from}`))
    // const filteredMenus = fetchedMenus.filter((menu) => {
    //     // console.log(menu.timing,weekDays[currentDayOfWeek])
    //   const firstCheck = menu.timing[weekDays[currentDayOfWeek]].length>0
    // //   console.log('first',firstCheck,menu.timing[weekDays[currentDayOfWeek]]);
    // let secondCheck;
    // if(firstCheck){
    //     secondCheck =
    //     firebase.firestore.Timestamp.now().toDate() > new Date(`${todayString} ${menu.timing[weekDays[currentDayOfWeek]][0].from}`) &&
    //     firebase.firestore.Timestamp.now().toDate() <= new Date(`${todayString} ${menu.timing[weekDays[currentDayOfWeek]][0].to}`);
    // }
    // //   console.log('secondCheck',secondCheck);
    //   const final = firstCheck && secondCheck;  
    //   return final;
    // });
    // // console.log(filteredMenus)
    if (filteredMenus?.length>0){
        return filteredMenus
    }
    return null
}
