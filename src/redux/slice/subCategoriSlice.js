import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../global_Url/axiosInstance';
import { API } from '../../global_Url/GlobalUrl';

// ✅ Async thunk to fetch subcategories with pagination
export const fetchSubCategories = createAsyncThunk(
  'subCategories/fetchSubCategories',
  async ({ page = 1, limit = 10,categoryId }, { rejectWithValue }) => {
    console.log('categoryId================api',categoryId);
    
    try {
      const response = await axiosInstance.get(
        `${API.getAllSubCategory}?page=${page}&limit=${limit}&categoryId=${categoryId}`
      );

      console.log('📦 SubCategory Response:', response.data);

      const newData = response?.data?.subcategories || [];
      const totalPages = Math.ceil((response?.data?.total || 0) / limit);

      return {
        subcategories: newData,
        page,
        totalPages,
      };
    } catch (error) {
      console.error('❌ SubCategory Fetch Error:', error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const subCategoriSlice = createSlice({
  name: 'subCategories',
  initialState: {
    data: [],
    page: 1,
    totalPages: 1,
    loading: false,
    error: null,
  },
  reducers: {
    // ✅ Optional: Clear old data (e.g., when logging out)
    resetSubCategories: state => {
      state.data = [];
      state.page = 1;
      state.totalPages = 1;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchSubCategories.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSubCategories.fulfilled, (state, action) => {
        state.loading = false;
        const { subcategories, page, totalPages } = action.payload;

        // ✅ Append on next pages
        if (page > 1) {
          state.data = [...state.data, ...subcategories];
        } else {
          state.data = subcategories;
        }

        state.page = page;
        state.totalPages = totalPages;
      })
      .addCase(fetchSubCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetSubCategories } = subCategoriSlice.actions;
export default subCategoriSlice.reducer;
