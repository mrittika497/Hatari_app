import {configureStore} from '@reduxjs/toolkit';
import HomeReducer from '../slice/HomeSlice';
import authReducer from '../slice/authSlice';
import nearestResReucer from '../slice/nearestResSlice'
const store = configureStore({
  reducer: {
    home: HomeReducer,
    auth: authReducer,
    nearestRestaurants:nearestResReucer
  },
});

export default store;
