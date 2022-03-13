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
import SearchIcon from "../images/bottomnav/search";
import CartIcon from "../images/bottomnav/cart";
import OnmenuIcon from "../images/bottomnav/onmenu";
import WalletIcon from "../images/bottomnav/wallet";
import FeedbackIcon from "../images/bottomnav/feedback";
import { useEffect, useState } from "react";
import { selectrestaurant } from "../features/restaurant/restaurantSlice";
import { useSelector } from "react-redux";
import { SvgIcon } from "@material-ui/core";
// import "./bottomnav.css";
import BottomBg from "../images/bottombg.svg";
export default function BottomNavigationComponent() {
  const [current, setCurrent] = useState(2);
  const history = useHistory();
  const { restaurantId } = useSelector(selectrestaurant)

  const iconStyle = {
    width:40
  }
  const activeStyle = {
    color: "#055C9D",
    fontSize: "30px",
    marginTop:-4
  }

  const bottomNavItems = [
    {
      title: "Feedback",

      icon: <ThumbsUpDownOutlined style={iconStyle} /> ,

      activeIcon:<ThumbsUpDownOutlined style={{...iconStyle,...activeStyle}} />,

      onClick: () =>
        history.push(`/restaurant/${restaurantId}/feedback`),
    },
    {
      title: "Search",

      icon: <SearchOutlined style={iconStyle} />,

      activeIcon: (
        <SearchOutlined style={{...iconStyle,...activeStyle}} />
      ),

      onClick: () => history.push(`/restaurant/${restaurantId}/search`),
    },

    {
      title: "Menu",

      icon: <PowerSettingsNewOutlined style={{...iconStyle,height:40,marginTop:-15}} />,

      activeIcon: (
        <PowerSettingsNewOutlined style={{...iconStyle,height:40,marginTop:-15,...activeStyle}} />
      ),

      onClick: (index) => {setCurrent(index);history.push(`/restaurant/${restaurantId}/`)},
    },
    {
      title: "Cart",

      icon: <ShoppingCart style={iconStyle} />,

      activeIcon: (
        <ShoppingCart style={{...iconStyle,...activeStyle}} />
      ),

      onClick: (index) => {setCurrent(index);history.push(`/restaurant/${restaurantId}/cart`)},
    },
    {
      title: "Payment",

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
        {bottomNavItems.map(({title,icon,activeIcon,onClick},index)=>(
          <div style={{color:(current===index)?'#055C9D':'#222'}} onClick={()=>{onClick(index)}} >
            <div  >
              {(current===index)?activeIcon:icon}
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
