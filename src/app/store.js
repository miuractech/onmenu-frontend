import { configureStore } from '@reduxjs/toolkit';
import authSlice from '../features/auth/authSlice';
import cartSlice from '../features/cart/cartSlice';
import counterReducer from '../features/counter/counterSlice';
import filterSlice from '../features/filter/filterSlice';
import restaurantSlice from '../features/restaurant/restaurantSlice';
import bottomSlice from "../features/bottomNav/bottomSlice";

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    auth:authSlice,
    restaurant:restaurantSlice,
    filter:filterSlice,
    cart:cartSlice,
    bottom:bottomSlice,
  },
});
