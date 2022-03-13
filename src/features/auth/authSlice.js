import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { authFirebase } from './authAPI';

export const authWithFirebase = createAsyncThunk(
  'auth/authFirebase',
  async (cred) => {
    const response = await authFirebase(cred);
    return response.data;
  }
);

export const authSlice = createSlice({
  name: 'auth',
  initialState:{
    user:null,
    userName:sessionStorage.getItem('userName') || null,
    location:null,
    status: 'loading',
    feedBack:null
  },

  reducers: {
    setUser: (state,action) => {
     
      state.user = action.payload;
      state.status = 'idle';
    },
    setUserName: (state,action) => {
      sessionStorage.setItem('userName',action.payload)
      state.userName = action.payload;
    },
    setLocation:(state,action) =>{
     
      state.location = action.payload
    },
    setFeedback:(state,action) =>{
      
      state.feedBack = action.payload
    },
  },


});

export const { setUser, logout, login, setLocation,setUserName, setFeedback } = authSlice.actions;

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`
export const selectAuth = (state) => state.auth;

// We can also write thunks by hand, which may contain both sync and async logic.
// Here's an example of conditionally dispatching actions based on current state.
// export const incrementIfOdd = (amount) => (dispatch, getState) => {
//   const currentValue = selectCount(getState());
//   if (currentValue % 2 === 1) {
//     dispatch(incrementByAmount(amount));
//   }
// };

export default authSlice.reducer;
