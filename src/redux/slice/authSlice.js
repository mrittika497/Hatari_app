// authSlice.js
import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';
import {API} from '../../global_Url/GlobalUrl';

// Send OTP API
export const sendOtp = createAsyncThunk(
  'auth/sendOtp',
  async (phone, {rejectWithValue}) => {
    console.log(phone, '-------------------hh');

    try {
      const response = await axios.post(
        API.sendOtp,
        {mobileNumber: phone}, // 👈 depends on API, adjust if needed
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Error sending OTP');
    }
  },
);

// Verify OTP API
export const verifyOtp = createAsyncThunk(
  'auth/verifyOtp',
  async ({phone, value}, {rejectWithValue}) => {
    try {
      const response = await axios.post(API.verifyOtp, {
        mobileNumber: phone,
        otp: value,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Error verifying OTP');
    }
  },
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    phone: '',
    otpSent: false,
    loading: false,
    user: null,
    error: null,
    user: null,
    token: null,
    error: null,
  },
  reducers: {
    resetAuth: state => {
      state.phone = '';
      state.otpSent = false;
      state.loading = false;
      state.user = null;
      state.error = null;
    },
  },
  extraReducers: builder => {
    builder
      // Send OTP
      .addCase(sendOtp.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendOtp.fulfilled, (state, action) => {
        state.loading = false;
        state.otpSent = true;
        state.phone = action.meta.arg;
      })
      .addCase(sendOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Verify OTP
      .addCase(verifyOtp.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyOtp.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.token = action.payload.token; // ✅ Save token in Redux
        state.user = action.payload.userDetails;
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {resetAuth} = authSlice.actions;
export default authSlice.reducer;
