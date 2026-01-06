import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../global_Url/axiosInstance";
import { API } from "../../global_Url/GlobalUrl";

// Async thunk to fetch foods of a specific cuisine and restaurant
export const fetchMenuFoods = createAsyncThunk(
  "menuItems/fetch",
  async ({ cuisineType, restaurantId } = {}, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();

      if (cuisineType) {
        // 🔑 Ensure lowercase since many APIs are case-sensitive
        params.append("cuisineType", cuisineType.toLowerCase());
      }

      if (restaurantId) {
        params.append("restaurantId", restaurantId); // Append restaurantId
      }

      const finalUrl = `${API.getmenutemfoods}?${params.toString()}`;
      console.log("Fetching Menu Foods from:", finalUrl);

      const response = await axiosInstance.get(finalUrl);

      console.log("API Response--------------------:", response.data);

      // Support both array and { data: [] } shaped response
      return Array.isArray(response.data)
        ? response.data
        : response.data?.data || [];
    } catch (error) {
      console.log("Fetch Menu Foods Error:", error.response || error.message);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const menucuisineTypeSlice = createSlice({
  name: "menuItems",
  initialState: {
    data: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearMenuFoods: (state) => {
      state.data = [];
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMenuFoods.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMenuFoods.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload || [];
      })
      .addCase(fetchMenuFoods.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch menu items";
      });
  },
});

export const { clearMenuFoods } = menucuisineTypeSlice.actions;
export default menucuisineTypeSlice.reducer;
