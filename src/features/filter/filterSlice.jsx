import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  filter: JSON.parse(sessionStorage.getItem('onmenu-filter')) || new Array(),
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
        var newFilter = state.filter.filter(sub=>sub !== val)
        state.filter = newFilter
        sessionStorage.setItem('onmenu-filter', JSON.stringify(newFilter))
      }
      else {
          var newFilter = [...state.filter,val]
          state.filter = newFilter
          sessionStorage.setItem('onmenu-filter', JSON.stringify(newFilter))
      }
    },
    resetFilter:(state) => {
      state.filter = new Array()
    }
  },

});


export const { setFilter,resetFilter } = filterSlice.actions;


export const selectFilter = (state) => state.filter.filter;


export default filterSlice.reducer;
