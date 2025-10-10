// src/redux/slice/TableBookingSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../global_Url/axiosInstance'; // your axios instance
import { API } from '../../Api/Global_Api';

// ✅ Async thunk to create a new table booking
export const createTableBooking = createAsyncThunk(
  'tableBooking/createTableBooking',
  async (bookingData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(API.tableBooking, bookingData);
      return response.data;
    } catch (error) {
      console.log('Error creating table booking:', error?.response?.data || error.message);
      return rejectWithValue(error?.response?.data || 'Failed to create booking');
    }
  }
);

const TableBookingSlice = createSlice({
  name: 'tableBooking',
  initialState: {
    data: null,
    loading: false,
    error: null,
  },
  reducers: {
    resetTableBookingState: state => {
      state.data = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(createTableBooking.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTableBooking.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.error = null;
      })
      .addCase(createTableBooking.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetTableBookingState } = TableBookingSlice.actions;
export default TableBookingSlice.reducer;
