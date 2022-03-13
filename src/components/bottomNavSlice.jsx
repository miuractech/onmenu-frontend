import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  current: [],
  status: 'loading',
};


export const filterSlice = createSlice({
  name: 'filter',
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    setFilter: (state,action) => {
      const val = action.payload
      if(state.filter.includes(val)){
        state.filter = state.filter.filter(sub=>sub !== val)
      }
      else {
          state.filter = [...state.filter,val] 
      }
    },
  },

});


export const { setFilter } = filterSlice.actions;


export const selectFilter = (state) => state.filter.filter;


export default filterSlice.reducer;
