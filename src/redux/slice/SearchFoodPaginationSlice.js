import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../global_Url/axiosInstance";
import { API } from "../../global_Url/GlobalUrl";

// ✅ Async thunk
export const fetchFoodPagination = createAsyncThunk(
  "foods/fetchFoodPagination",
  async ({ page = 1, limit = 10 }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        `${API.getfoodpagination}?page=${page}&limit=${limit}`
      );

      return {
        foods: response.data.data || [], // ✅ Always return array
        page: response.data.page || page,
        hasMore:
          response.data.page * response.data.limit < response.data.total,
      };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

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

        // ✅ Append safely
        if (state.page === 1) {
          state.AllFoodsData = action.payload.foods;
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

export const { clearFoods } = SearchFoodPaginationSlice.actions;
export default SearchFoodPaginationSlice.reducer;
