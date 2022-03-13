import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { setDishwithFirebase, setRestaurantFirebase } from './restaurantAPI';


export const setRestaurant = createAsyncThunk(
  'restaurant/restaurantFirebase',
  async (restaurantId) => {
    const response = await setRestaurantFirebase(restaurantId);
    return response;
  }
);

export const setDishes = createAsyncThunk(
  'restaurant/dishWithFirebase',
  async ({restaurantId,type,restaurant,history}) => {
    const response = await setDishwithFirebase({restaurantId,type,restaurant,history});
    return response;
  }
);

export const restaurantSlice = createSlice({
  name: 'restaurant',
  initialState:{
    restaurantId: sessionStorage.getItem('restaurantId') || null ,
    restaurant:null,
    menus:null,
    menuType:null,
    dishes:null,
    status: 'loading',
    dishStatus:'loading',
    currentMenu:null,
    selectedType:null

  },

  reducers: {
    setType:(state,action) =>{
      state.menuType = action.payload
    },
    setRestaurantId:(state,action) => {
      state.restaurantId = action.payload
    },
    setSelectedType:(state,action) => {
      state.selectedType = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(setRestaurant.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(setRestaurant.fulfilled, (state, action) => {
        state.restaurant = action.payload.restaurant;
        state.menus = action.payload.menus;
        state.menuType = action.payload.type;
        state.categories = action.payload.categories;
        state.restaurantId = action.payload.restaurantId
        state.status = 'idle';
      })
      .addCase(setDishes.pending, (state) => {  
        state.dishStatus = 'loading';
      })
      .addCase(setDishes.fulfilled, (state, action) => {
        state.dishStatus = 'idle';
        state.dishes = action.payload
      });
  },

});

export const { setType, setRestaurantId, setSelectedType } = restaurantSlice.actions;

export const selectrestaurant = (state) => state.restaurant;
export const selectDishes = (state) => state.restaurant.dishes;

export default restaurantSlice.reducer;
