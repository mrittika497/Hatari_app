// src/redux/slice/SearchFoodPaginationSlice.js

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../global_Url/axiosInstance";
import { API } from "../../global_Url/GlobalUrl";

// ----------------------------------------------
// Thunk : Fetch Foods with Pagination + Filters
// ----------------------------------------------

export const fetchFoodPagination = createAsyncThunk(
  "foods/fetchFoodPagination",
  async (
    { page = 1, limit = 10, type = "", search = "" },
    { rejectWithValue }
  ) => {
    try {
      const response = await axiosInstance.get(
        `${API.getfoodpagination}?page=${page}&limit=${limit}&type=${type}&search=${search}`
      );

      console.log("FILTER TYPE:", type);

      return {
        foods: response?.data?.data || [],
        page, // 🚀 FIX 1 — use the page you requested (NOT backend page)
        hasMore:
          response.data.page * response.data.limit < response.data.total,
      };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// ----------------------------------------------
// Slice
// ----------------------------------------------

const SearchFoodPaginationSlice = createSlice({
  name: "FoodPagination",
  initialState: {
    AllFoodsData: [],
    page: 1,
    hasMore: true,
    loading: false,
    error: null,
  },

  reducers: {
    clearFoods: (state) => {
      // 🚀 FIX 2 — Reset everything on new search/filter
      state.AllFoodsData = [];
      state.page = 1;
      state.hasMore = true;
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchFoodPagination.pending, (state) => {
        state.loading = true;
      })

      .addCase(fetchFoodPagination.fulfilled, (state, action) => {
        state.loading = false;
        state.page = action.payload.page;
        state.hasMore = action.payload.hasMore;

        // 🚀 FIX 3 — Replace list when page === 1
        if (action.payload.page === 1) {
          state.AllFoodsData = action.payload.foods; // fresh data
        } else {
          state.AllFoodsData = [
            ...state.AllFoodsData,
            ...action.payload.foods,
          ];
        }
      })

      .addCase(fetchFoodPagination.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch foods";
      });
  },
});

// ----------------------------------------------
// Exports
// ----------------------------------------------

export const { clearFoods } = SearchFoodPaginationSlice.actions;
export default SearchFoodPaginationSlice.reducer;
