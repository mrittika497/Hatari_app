import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../global_Url/axiosInstance";
import { API } from "../../global_Url/GlobalUrl";

// Async thunk to fetch foods of a specific category
export const fetchCategoryFoods = createAsyncThunk(
  "catItems/fetch",
  async ({ categoryId, categoryIngredients }, { rejectWithValue }) => {
    try {
      // 👇 Build query string dynamically
      let url = `${API.getCatItemfoods}?`;
      if (categoryId) url += `categoryId=${categoryId}`;
      if (categoryIngredients)
        url += `${categoryId ? "&" : ""}ingredients=${categoryIngredients}`;

      const response = await axiosInstance.get(url);
      return response.data;
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
