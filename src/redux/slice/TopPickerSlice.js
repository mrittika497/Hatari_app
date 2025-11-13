import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import axiosInstance from '../../global_Url/axiosInstance';
import {API} from '../../global_Url/GlobalUrl';

export const fetchCategoryFoodsBySubcat = createAsyncThunk(
  'catItems/fetch',
  async (
    { subCategoryId, categoryIngredients, restaurantId, cuisineType, page = 1, limit = 100,},
    {rejectWithValue},
  ) => {
    try {
      const params = new URLSearchParams();

      if (subCategoryId) params.append('subCategoryId', subCategoryId);
      if (categoryIngredients) params.append('ingredients', categoryIngredients);
      if (restaurantId) params.append('restaurantId', restaurantId);
      if (cuisineType) params.append('cuisineType', cuisineType); // 👈 use correct key
         

      params.append('page', page);
      params.append('limit', limit);

      const url = `${API.Categoryitem}?${params.toString()}`;
      console.log('🔍 Final URL:', url);

      const response = await axiosInstance.get(url);
      console.log('📦 BySub-------------------Category Foods Response:', response.data);

      // extract actual data array safely
      const items = response.data?.data || [];
     console.log('🍽️ Fetched Items:', items);
     

      return {page, data: items};
    } catch (error) {
      console.log('❌ Fetch Category Foods Error:', error.response || error.message);
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

const TopPickerSlice = createSlice({
  name: 'catItemsbySubcat',
  initialState: {
    data: [],
    loading: false,
    error: null,
    page: 1,
    hasMore: true,
  },
  reducers: {
    clearCategoryFoods: state => {
      state.data = [];
      state.page = 1;
      state.hasMore = true;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchCategoryFoodsBySubcat.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategoryFoodsBySubcat.fulfilled, (state, action) => {
        state.loading = false;
        const {page, data} = action.payload;
        if (page === 1) {
          state.data = data;
        } else {
          state.data = [...state.data, ...data];
        }
        state.hasMore = data.length > 0;
        state.page = page;
      })
      .addCase(fetchCategoryFoodsBySubcat.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch category items';
      });
  },
});

export const {clearCategoryFoods} = TopPickerSlice.actions;
export default TopPickerSlice.reducer;


