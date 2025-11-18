import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import axiosInstance from '../../global_Url/axiosInstance';
import { API } from '../../global_Url/GlobalUrl';

// Async thunk to fetch coupons from an API
export const fetchCoupons = createAsyncThunk(
  'coupons/fetchCoupons',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(API.coupon); // Replace with your API
      console.log(response,"----------------------response");
      
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const couponSlice = createSlice({
  name: 'coupons',
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  reducers: {
    addCoupon: (state, action) => {
      state.list.push(action.payload);
    },
    removeCoupon: (state, action) => {
      state.list = state.list.filter(coupon => coupon._id !== action.payload);
    },
    updateCoupon: (state, action) => {
      const index = state.list.findIndex(coupon => coupon._id === action.payload._id);
      if (index !== -1) state.list[index] = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCoupons.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCoupons.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchCoupons.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Something went wrong';
      });
  },
});

export const { addCoupon, removeCoupon, updateCoupon } = couponSlice.actions;
export default couponSlice.reducer;
