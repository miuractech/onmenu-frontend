import { createSlice } from '@reduxjs/toolkit';

export const bottomSlice = createSlice({
  name: 'bottom',
  initialState:{
    current:null,
    selectedMenu:null
  },

  reducers: {
    setCurrent: (state,action) => { 
      state.current = action.payload;
    },
    setSelectedType: (state,action) => { 
      state.selectedMenu = action.payload;
    },
  },
});

export const { setCurrent, setSelectedType } = bottomSlice.actions;
export const selectBottom = (state) => state.bottom.current;
export const selectcurrentMenu = (state) => state.bottom.selectedMenu;

export default bottomSlice.reducer;
