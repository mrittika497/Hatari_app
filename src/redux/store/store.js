import { configureStore } from '@reduxjs/toolkit';
import HomeReducer from "../slice/HomeSlice"

const store = configureStore({
  reducer: {
    home: HomeReducer,
  },
});

export default store;
