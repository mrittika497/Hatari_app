// src/redux/slice/foodSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const BASE_URL = 'https://hatari.backend.sensegeofence.com/api/';

export const fetchPaginatedFoods = createAsyncThunk(
  'foods/fetchPaginatedFoods',
  async ({ page = 1, limit = 10, token }, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${BASE_URL}food/pagination?page=${page}&limit=${limit}`,
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
      );

      console.log('✅ API response:', JSON.stringify(response.data, null, 2));

      // Handle various backend response shapes
      const data =
        response.data?.data ||
        response.data?.foods ||
        response.data?.foods?.docs ||
        [];

      return {
        data,
        hasMore: data.length >= limit,
        page,
      };
    } catch (error) {
      console.log('❌ Error fetching food:', error.response?.data || error.message);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const foodSlice = createSlice({
  name: 'foods',
  initialState: {
    items: [],
    page: 1,
    loading: false,
    hasMore: true,
    error: null,
  },
  reducers: {
    resetFoods: (state) => {
      state.items = [];
      state.page = 1;
      state.hasMore = true;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPaginatedFoods.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPaginatedFoods.fulfilled, (state, action) => {
        const { data, hasMore, page } = action.payload;
        state.loading = false;
        state.page = page + 1;
        state.items = page === 1 ? data : [...state.items, ...data];
        state.hasMore = hasMore;
      })
      .addCase(fetchPaginatedFoods.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Error fetching data';
      });
  },
});

export const { resetFoods } = foodSlice.actions;
export default foodSlice.reducer;
