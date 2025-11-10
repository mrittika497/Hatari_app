import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../global_Url/axiosInstance';
import { API } from '../../global_Url/GlobalUrl';




// ✅ Async Thunk to fetch subcategories
export const fetchSubCategories = createAsyncThunk(
  'subCategories/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(API.getAllSubCategory);
      console.log(response,"-------------------------response");
      return response.data; // return data to reducer
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// ✅ Slice
const subCategorySlice = createSlice({
  name: 'subCategories',
  initialState: {
    loading: false,
    data: [],
    error: null,
  },
  reducers: {
    clearSubCategories: state => {
      state.data = [];
      state.error = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchSubCategories.pending, state => {
        state.loading = true;
      })
      .addCase(fetchSubCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchSubCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearSubCategories } = subCategorySlice.actions;
export default subCategorySlice.reducer;


