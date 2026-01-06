// src/redux/slice/GetAllCategorySlice.js

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../global_Url/axiosInstance";
import { API } from "../../global_Url/GlobalUrl";



export const fetchAllCategories = createAsyncThunk(
  "categories/fetchAll",
  async ({ mainCategory, type }, { rejectWithValue }) => {
    console.log(mainCategory,"---------------------mainCategorybaken");
    
    try {
      const res = await axiosInstance.get(
        `${API.GetAllCategory}?mainCategory=${mainCategory}&type=${type}`
      );
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Something went wrong");
    }
  }
);



// ------------------------------
// 🔥 Slice
// ------------------------------
const GetAllCategorySlice = createSlice({
  name: "categoriesAllcat",
  initialState: {
    categories: [],
    loading: false,
    error: null,
  },

  extraReducers: builder => {
    builder
      .addCase(fetchAllCategories.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
      })
      .addCase(fetchAllCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// ------------------------------
// 🔥 Export the reducer
// ------------------------------
export default GetAllCategorySlice.reducer;
