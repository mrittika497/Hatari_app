import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../global_Url/axiosInstance';
import { API } from '../../global_Url/GlobalUrl';

// ✅ Async thunk
export const fetchCategories = createAsyncThunk(
  'categories/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`${API.GetMainCat}`);
      console.log('📦 Categories Response:', response.data);

      // Correct key is data
      return response.data.data || [];
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// ✅ Redux slice
const initialState = {
  categoridata: [],
  loading: false,
  error: null,
};

const CategoriSlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    resetCategories: state => {
      state.categoridata = [];
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchCategories.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categoridata = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetCategories } = CategoriSlice.actions;
export default CategoriSlice.reducer;
