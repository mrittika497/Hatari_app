import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../global_Url/axiosInstance';
import { API } from '../../global_Url/GlobalUrl';

// 1️⃣ Async thunk to post billing data
export const postBilling = createAsyncThunk(
  'billing/postBilling',
  async (billingData, { rejectWithValue }) => {
    console.log(billingData,"------------billingData");
    
    try {
      const response = await axiosInstance.post(API.billing, billingData);
      console.log(response?.data,"----------------------response");
      
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Something went wrong');
    }
  }
);

const postBillingSlice = createSlice({
  name: 'billing',
  initialState: {
    loading: false,
    billingdata: null,
    error: null,
  },
  reducers: {
    clearBillingState: (state) => {
      state.loading = false;
      state.billingdata = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(postBilling.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(postBilling.fulfilled, (state, action) => {
        state.loading = false;
        state.billingdata = action.payload;
      })
      .addCase(postBilling.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearBillingState } = postBillingSlice.actions;
export default postBillingSlice.reducer;
