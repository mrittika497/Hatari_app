// src/redux/slices/homeSlice.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunk to fetch home data
export const fetchHomeData = createAsyncThunk(
  'home/fetchHomeData',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('https://example.com/api/home'); // your API here
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const HomeSlice = createSlice({
  name: 'home',
  initialState: {
    data: [],
    loading: false,
    error: null,
  },
  reducers: {
    resetHome: (state) => {
      state.data = [];
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchHomeData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHomeData.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchHomeData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Something went wrong';
      });
  },
});

export const { resetHome } = HomeSlice.actions;

export default HomeSlice.reducer;
