// src/redux/slices/foodCategorySlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../global_Url/axiosInstance";
import { API } from "../../global_Url/GlobalUrl";

// ✅ Thunk for fetching all food categories
export const fetchAllFoodCat = createAsyncThunk(
  "foodCategory/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(API.AllFoodCat);
      console.log(response?.data,"-----------------response");
      
           return response?.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  }
);

const foodCategorySlice = createSlice({
  name: "foodCategory",
  initialState: {
    categories: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Pending
      .addCase(fetchAllFoodCat.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      // Fulfilled
      .addCase(fetchAllFoodCat.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload; // ✅ now categories will be pure array/object
      })
      // Rejected
      .addCase(fetchAllFoodCat.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default foodCategorySlice.reducer;
