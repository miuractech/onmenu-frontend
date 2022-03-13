import { BorderAllOutlined, HomeOutlined, SearchOutlined } from '@material-ui/icons'
import { useHistory, useParams } from 'react-router'
import BottomNavigation from 'reactjs-bottom-navigation'
import 'reactjs-bottom-navigation/dist/index.css'
import FeedbackIcon from "../images/bottomnav/feedback.svg";

export default function BottomNavigationComponent() {
    const history = useHistory()
    const params = useParams()
    const location = window.location.href.split('/').at(-1)
  // items

  const bottomNavItems = [
    {
      title: 'Feedback',

      icon: <img className='bottom-nav-icon' src={FeedbackIcon} />,

      activeIcon: <HomeOutlined style={{ fontSize: '18px', color: '#fff' }} />,

      onClick : ()=>history.push(`/restaurant/${params.restaurantId}/feedback`)
    },

    {
      title: 'Search',

      icon: <SearchOutlined style={{ fontSize: '18px' }} />,

      activeIcon: <SearchOutlined style={{ fontSize: '18px', color: '#fff' }} />,

      onClick : ()=>history.push(`/restaurant/${params.restaurantId}/search`)
    },

    {
      title: 'Menu',

      icon: <BorderAllOutlined style={{ fontSize: '18px' }} />,

      activeIcon: <BorderAllOutlined style={{ fontSize: '18px', color: '#fff' }} />,

      onClick : ()=>history.push(`/restaurant/${params.restaurantId}/`)
    },
    {
        title: 'Cart',
  
        icon: <BorderAllOutlined style={{ fontSize: '18px' }} />,
  
        activeIcon: <BorderAllOutlined style={{ fontSize: '18px', color: '#fff' }} />,

        onClick : ()=>history.push(`/restaurant/${params.restaurantId}/cart`)
    },
    {
        title: 'Payment',
  
        icon: <BorderAllOutlined style={{ fontSize: '18px' }} />,
  
        activeIcon: <BorderAllOutlined style={{ fontSize: '18px', color: '#fff' }} />,

        onClick : ()=>history.push(`/restaurant/${params.restaurantId}/payment`)
    },
  ]

  return (
    <div className='pointer-cursor' >
      <BottomNavigation

        items={bottomNavItems}
        defaultSelected={2}
      />
    </div>
  )
}