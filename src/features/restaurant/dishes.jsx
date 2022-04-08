import React, { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import Loader from '../../components/loader';
import DishCard from './dishCard';
import { selectDishes, selectrestaurant, setDishes } from './restaurantSlice';
// import firebase, { firestore } from ".././../config/firebase";
import * as Scroll from 'react-scroll';
import { Link as ScrollLink, Button, Element, Events, animateScroll as scroll, scrollSpy, scroller } from 'react-scroll'
import { selectFilter } from '../filter/filterSlice';
import handleViewport from 'react-in-viewport';

export default function Dishes({type,setSelectedMenu,setSelectedCategory,selectedMenu,selectedCategory,currentCategories}) {
    const restaurant = useSelector(selectrestaurant)
    const dishes = useSelector(selectDishes)
    const filter = useSelector(selectFilter)
    const dispatch =  useDispatch()
    const { restaurantId } = useParams()
    const history = useHistory()
    const categories = restaurant.categories;
    useEffect(() => {
        if((type && !dishes) || (dishes && !dishes[type])) {
            dispatch(setDishes({restaurantId,type,restaurant,history}))
        }
    }, [type])
    var filteredDish = [];
    if(dishes && dishes[type]){
        filteredDish =  filter?.length>0?dishes[type].filter(dish=>{
            for (var variant of dish.food_variants){
                if (filter.includes(variant.food_preference)){
                    return dish
                }
            }
        }):dishes[type]
    }
    // console.log('filteredDish',filteredDish);
    console.log(dishes,restaurant);
    if(restaurant.dishStatus === 'loading')(<Loader />)
    return (
        <div>
            {restaurant.restaurantId && 
            dishes &&
            dishes[type] &&
            restaurant?.menus[type] && 
            // eslint-disable-next-line array-callback-return
            restaurant.menus[type].map((menu)=>{
                if(filteredDish
                    .filter(dish=>dish.menu_id === menu.menuId).length>0)
                return(
                <div key={menu.menuId} >
                        <div>
                        <Element name={menu.menuId} className="element">
                                      {/* {menu.name} */}
                                      <div/>
                                    </Element>
                        {/* <Block 
                        onEnterViewport={() =>{
                            if(selectedMenu.menuId === menu.menuId){
                                setSelectedMenu(menu)
                            }
                        }}  /> */}
                    <div>
                        {categories?.length>0 && 
                         categories.map((category)=>{
                             return(
                            <div key={category.categoryId} >
                                    {Array.from(filteredDish)
                                    .filter(dish=>dish.menu_id === menu.menuId)
                                    .filter(dish=>dish.category_id === category.categoryId).length>0 && 
                                        <Element name={menu.menuId+category.categoryId} className="element">
                                                <div className='text-left' style={{fontSize:15,fontWeight: 'bold',margin:'0px auto 0px 16px'}}>
                                                    {category.name}
                                                </div>
                                            </Element>
                                            }
                                    {/* <Block 
                                onEnterViewport={() =>{
                                    // setSelectedMenu(menu)
                                    if(category.name!==selectedCategory){
                                        setSelectedCategory(category.name)
                                    }
                                }}  /> */}
                                {/* {dishes && 
                                <>
                                    {dishes[type]?
                                    <> */}
                                    {Array.from(filteredDish)
                                    .filter(dish=>dish.menu_id === menu.menuId)
                                    .filter(dish=>dish.category_id === category.categoryId)
                                    // .sort((a, b) => (parseInt(a.index) < parseInt(b.index)) ? 1:(parseInt(a.index) < parseInt(b.index))? -1:0 )
                                    .map(dish=>{
                                        return(
                                        <div key={dish.dishId}>
                                            <DishCard dish={dish} filter={filter} menuPublish={menu.published===true} categoryPublish={category.published===true} />
                                        </div>
                                        )
                                    })}
                                    
                                    {/* </>
                                    :
                                    <Loader />
                                    }
                                </>
                                } */}
                            </div>
                        )})}
                    </div>
                    <div>
                </div>
                </div>
                </div>
            )})}
        </div>
    )
}


const Block = ({onEnterViewport}) => {
    const ref = useRef()
    useEffect(() => {
        window.addEventListener('scroll', pop);
        return () => window.removeEventListener('scroll', pop);
      },[]);
    const pop = () =>{
        const top = ref.current.getBoundingClientRect().top;
        if(top>80){
            onEnterViewport()
        }
    }
    return (
        <div ref={ref} />
            
    );
  };
