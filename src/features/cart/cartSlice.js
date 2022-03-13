import { createSlice } from '@reduxjs/toolkit';
// import { authFirebase } from './authAPI';


// export const authWithFirebase = createAsyncThunk(
//   'auth/authFirebase',
//   async (cred) => {
//     const response = await authFirebase(cred);
//     return response.data;
//   }
// );

export const cartSlice = createSlice({
  name: 'cart',
  initialState:{
    cart:[],
  },

  reducers: {
    addToCart: (state,action) => { 
      state.cart = [...state.cart,action.payload ];
    },
    removeFromCart:(state,action) => {
      state.cart = state.cart.filter(dish=>dish.dish.dish_id !== action.payload);
    },
    removeTakeAway:(state) => {
      state.cart = state.cart.filter(dish=>dish.dish.type !== 'take-away');
    },
  },


});

export const { addToCart, removeFromCart,removeTakeAway } = cartSlice.actions;

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`
export const selectCart = (state) => state.cart.cart;

// We can also write thunks by hand, which may contain both sync and async logic.
// Here's an example of conditionally dispatching actions based on current state.
// export const incrementIfOdd = (amount) => (dispatch, getState) => {
//   const currentValue = selectCount(getState());
//   if (currentValue % 2 === 1) {
//     dispatch(incrementByAmount(amount));
//   }
// };

export default cartSlice.reducer;
