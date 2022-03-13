import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import Logo from "../images/Indranagar-Lavelle-Road-Whitefield-Kormangala-Jayanagar-7249d68216064aa9abe5643be6f00e6a.png";
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ClockIcon from "../Icons/sidebar/clock.svg";
import ContactIcon from "../Icons/sidebar/contact.svg";
import LocationIcon from "../Icons/sidebar/map-pin.svg";
import LogOutIcon from "../Icons/sidebar/log-out.svg";
import PaymentIcon from "../Icons/sidebar/credit-card.svg";
import SheildIcon from "../Icons/sidebar/shield.svg";
import UnlockIcon from "../Icons/sidebar/unlock.svg";
import OrderIcon from "../Icons/sidebar/order.svg";
import RestautantMenuIcon from "../Icons/sidebar/restaurant.svg";
import MapIcon from "../Icons/sidebar/map-pin.svg";
import { IconButton, Toolbar, AppBar, Badge, Slide } from '@material-ui/core';
import { Close, Menu, Menu as MenuIcon } from '@material-ui/icons';
import FilterIcon from "../Icons/filter.icon";
import { menu, removeUserAll } from '../App';
import firebase from '../config/firebase'
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';
import Filter from '../features/filter/filter';
import { useDispatch, useSelector } from 'react-redux';
import { selectrestaurant } from '../features/restaurant/restaurantSlice';
import {useHistory} from 'react-router-dom'
import { selectFilter, resetFilter } from '../features/filter/filterSlice';

const useStyles = makeStyles(theme =>({
  list: {
    width: 250,
  },
  fullList: {
    width: 'auto',
  },
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
  sideLogo:{
    // backgroundColor:'#4285F4',
    padding:16
  }
}));

export default function Topbar() {
  const classes = useStyles();
  const [state, setState] = useState(false)
  const [filterOpen, setFilterOpen] = useState(false)
  const filter = useSelector(selectFilter)
  const {restaurantId} = useSelector(selectrestaurant)
  const restaurant = useSelector(selectrestaurant)
  const history = useHistory()
  var sidebarInfo = [
    // {action:()=>history.push(`/restaurant/${restaurantId}/restaurantInfo`),name:'Location',link:'',icon:LocationIcon},
    // {action:()=>console.log('action'),name:'Timing',link:'',icon:ClockIcon},
    {action:()=>history.push(`/restaurant/${restaurantId}`),name:'Menus',link:'',icon:RestautantMenuIcon},
    {action:()=>history.push(`/restaurant/${restaurantId}/orders`),name:'Takeaway Orders',link:'',icon:OrderIcon},
    {action:()=>history.push(`/restaurant/${restaurantId}/payment`),name:'Payment',link:'',icon:PaymentIcon },
    {action:()=>history.push(`/restaurant/${restaurantId}/terms`),name:'Terms & Condition',link:'',icon:SheildIcon },
    {action:()=>history.push(`/restaurant/${restaurantId}/privacy`),name:'Privacy Policy',link:'',icon:UnlockIcon},
    {action:()=>history.push(`/restaurant/${restaurantId}/contact`),name:'Contact',link:'',icon:ContactIcon },
    {action:()=>{removeUserAll()},name:'Logout',link:'',icon:LogOutIcon },
  ]
 
  const list = () => (
    <div
      className={classes.list}
      role="presentation"
      onClick={()=>{setState(false)}}
      // onKeyDown={toggleDrawer(anchor, false)}
    >
      {restaurant?.restaurant?.logo && <div className={classes.sideLogo} >
        <img src={restaurant.restaurant.logo} style={{maxWidth:200,textAlign:'center'}} alt="restaurant-logo" />
      </div>}
      <List>
        {sidebarInfo.map(({link,icon,name,action}) => (
          <ListItem button key={name} style={{margin:'5px auto'}} onClick={action} >
            <ListItemIcon><img src={icon} style={{width:20,height:20}} alt='' /></ListItemIcon>
            <ListItemText primary={name} />
          </ListItem>
        ))}
      </List>
    </div>
  );

  return (
    <div>
      <AppBar 
      elevation={1} 
      position="fixed" 
      style={{backgroundColor:'white'}} 
      color='default' 
      >
        <Toolbar>
          <Button edge="start" className={classes.menuButton} color="inherit" aria-label="menu" onClick={()=>{setState(true)}}>
            <MenuIcon />
          </Button>
            <div style={{flexGrow:1}} >
              {/* <img src={Logo} style={{height:40}} alt="restaurant-logo" /> */}
            </div>
          <Button onClick={()=>setFilterOpen(true)} color="inherit">
            <Badge badgeContent={filter.length} color="primary">
              <FilterIcon  />
            </Badge>
          </Button>
        </Toolbar>
      </AppBar>
      <Toolbar />
          <Drawer anchor={'left'} open={state} onClose={()=>{setState(false)}}>
            {list('left')}
          </Drawer>

          <ResponsiveDialog open={filterOpen} setOpen={setFilterOpen} />
    </div>
  );
}


const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function ResponsiveDialog({open,setOpen}) {
  const dispatch = useDispatch()

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
        aria-labelledby="responsive-dialog-title"
      >
        <IconButton style={{position:'absolute',right:10,top:5,background:'#eee'}} onClick={handleClose} size='small'  >
        <Close  />
        </IconButton>
        <DialogTitle id="responsive-dialog-title">{"Food Preference Filter"}</DialogTitle>
        <DialogContent>
          <Filter
          // selectedFilter={selectedFilter} 
          // setSelectedFilter={setSelectedFilter}
          />
        </DialogContent>
        <DialogActions>
          <Button
          variant='contained'
          color='primary'
          size='small'
          onClick={()=>{dispatch(resetFilter())}}
          
          >
            Reset
          </Button>
          <Button
          variant='contained'
          color='primary'
          size='small'
          onClick={handleClose}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}