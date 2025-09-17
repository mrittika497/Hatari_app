import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../global_Url/axiosInstance";
import { API } from "../../global_Url/GlobalUrl";

// Async thunk to fetch foods of a specific category for a specific restaurant
export const fetchCategoryFoods = createAsyncThunk(
  "catItems/fetch",
  async ({ categoryId, categoryIngredients, restaurantId }, { rejectWithValue }) => {
    try {
      // Build query string dynamically
      let url = `${API.getCatItemfoods}?`;
      const params = [];

      if (categoryId) params.push(`categoryId=${categoryId}`);
      if (categoryIngredients) params.push(`ingredients=${categoryIngredients}`);
      if (restaurantId) params.push(`restaurantId=${restaurantId}`);

      url += params.join("&");

      const response = await axiosInstance.get(url);
      return response.data; // expect API returns { data: [...] }
    } catch (error) {
      console.log("Fetch Category Foods Error:", error.response || error.message);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const catItemSlice = createSlice({
  name: "catItems",
  initialState: {
    data: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearCategoryFoods: (state) => {
      state.data = [];
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategoryFoods.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategoryFoods.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload?.data || []; // safe fallback
      })
      .addCase(fetchCategoryFoods.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch category items";
      });
  },
});

export const { clearCategoryFoods } = catItemSlice.actions;
export default catItemSlice.reducer;
