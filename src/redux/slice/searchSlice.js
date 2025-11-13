import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../global_Url/axiosInstance';
import { API } from '../../global_Url/GlobalUrl';

// 🔹 Async thunk to fetch search results from backend
export const fetchSearchResults = createAsyncThunk(
  'search/fetchSearchResults',
  async (query, { rejectWithValue }) => {
    try {
      if (!query || query.trim() === '') {
        return []; // don't fetch if query is empty
      }

      const response = await axiosInstance.post(API.searchFood, {
        search: query, // ✅ sending query in body
      });

      console.log('🔍 Search API Responsedfhgvgvhgchf:', response);

      // some APIs wrap the array in a data key, so we handle both cases
      const results = response.data?.data || response.data || [];

      return results;
    } catch (error) {
      console.log('❌ Search API Error:', error.response?.data || error.message);
      return rejectWithValue(error.response?.data?.message || 'Something went wrong');
    }
  }
);

const searchSlice = createSlice({
  name: 'search',
  initialState: {
    query: '',
    results: [],
    loading: false,
    error: null,
  },
  reducers: {
    setSearchQuery: (state, action) => {
      state.query = action.payload;
    },
    clearSearch: (state) => {
      state.query = '';
      state.results = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSearchResults.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSearchResults.fulfilled, (state, action) => {
        state.loading = false;
        state.results = action.payload;
      })
      .addCase(fetchSearchResults.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch search results';
      });
  },
});

export const { setSearchQuery, clearSearch } = searchSlice.actions;
export default searchSlice.reducer;
