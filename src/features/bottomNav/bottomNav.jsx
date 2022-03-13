import {
    BorderAllOutlined,
    HomeOutlined,
    MenuOutlined,
    PaymentOutlined,
    PowerSettingsNewOutlined,
    SearchOutlined,
    ShoppingCart,
    ThumbsUpDownOutlined,
  } from "@material-ui/icons";
  import { useHistory, useParams } from "react-router";
  import SearchIcon from "../../images/bottomnav/search";
  import CartIcon from "../../images/bottomnav/cart";
  import OnmenuIcon from "../../images/bottomnav/onmenu";
  import WalletIcon from "../../images/bottomnav/wallet";
  import FeedbackIcon from "../../images/bottomnav/feedback";
  import { useEffect, useState } from "react";
  import { selectrestaurant } from "../restaurant/restaurantSlice";
  import { useSelector } from "react-redux";
  import { Badge, SvgIcon } from "@material-ui/core";
  import "./bottomnav.css";
  import BottomBg from "../../images/bottombg.svg";
import { selectCart } from "../cart/cartSlice";
import { selectBottom, selectcurrentMenu } from "./bottomSlice";
  export default function BottomNavigationComponent() {
    const [current, setCurrent] = useState(2);
    const history = useHistory();
    const { restaurantId } = useSelector(selectrestaurant)
    const cart = useSelector(selectCart)
    const bottom = useSelector(selectBottom)
    const currentType = useSelector(selectcurrentMenu)
    const iconStyle = {
      height:24,
    }
    const activeStyle = {
      color: "#3f51b4",
    //   fontSize: "30px",
    //   marginTop:-8
    }
  
    const bottomNavItems = [
      {
        title: "Feedback",
        active:'feedback',
  
        icon: <ThumbsUpDownOutlined style={iconStyle} /> ,
  
        activeIcon:<ThumbsUpDownOutlined style={{...iconStyle,...activeStyle}} />,
  
        onClick: () =>
          history.push(`/restaurant/${restaurantId}/feedback`),
      },
      {
        title: "Search",
        active:'search',
  
        icon: <SearchOutlined style={iconStyle} />,
  
        activeIcon: (
          <SearchOutlined style={{...iconStyle,...activeStyle}} />
        ),
  
        onClick: () => history.push(`/restaurant/${restaurantId}/search`),
      },
  
      {
        title: "Menu",
        active:'home',
  
        icon: <PowerSettingsNewOutlined style={{...iconStyle}} />,
  
        activeIcon: (
          <PowerSettingsNewOutlined style={{...iconStyle,...activeStyle}} />
        ),
  
        onClick: (index) => {
          setCurrent(index);
          if(currentType){
            history.push(`/restaurant/${restaurantId}/${currentType}`)
          }else{
            history.push(`/restaurant/${restaurantId}`)
          }
        },
      },
      {
        title: "Cart",
        active:'cart',
  
        icon: <Badge badgeContent={cart.filter(b =>b.dish.type===currentType).length} >
        <ShoppingCart style={{...iconStyle,marginTop:6}} />
      </Badge>,
  
        activeIcon: (<Badge badgeContent={cart.filter(b =>b.dish.type===currentType).length} color="primary">
            <ShoppingCart style={{...iconStyle,...activeStyle,marginTop:6}} />
        </Badge>
        ),
  
        onClick: (index) => {
          setCurrent(index);
          if(currentType){
            history.push(`/restaurant/${restaurantId}/${currentType}/cart`)
          }else{
            history.push(`/restaurant/${restaurantId}/cart`)
          }
          
        },
      },
      {
        title: "Payment",
        active:'payment',
  
        icon: <PaymentOutlined style={iconStyle} />,
  
        activeIcon: (
          <PaymentOutlined style={{...iconStyle,...activeStyle}} />
        ),
  
        onClick: (index) => {setCurrent(index);history.push(`/restaurant/${restaurantId}/payment`)},
      },
    ];
  
    return (
      <div className="pointer-cursor" style={{position:'fixed',bottom:0,width:'calc(100% - 24px)',maxWidth:400,backgroundColor:'white'}}>
        <div className="flex padding2 round-corners" style={{height:60,boxShadow:'0px -4px 8px rgba(104, 104, 115, 0.2)',justifyContent:'space-between' }}>
          {bottomNavItems.map(({title,active,icon,activeIcon,onClick},index)=>(
            <div style={{color:(active===bottom)?'#3f51b4':'#222'}} onClick={()=>{onClick(index)}} >
              <div  >
                {(active===bottom)?activeIcon:icon}
              </div>
              <div style={{fontSize:12}} >
                {title}
              </div>
            </div>
          ))}
  
        </div>
      </div>
    );
  }
  