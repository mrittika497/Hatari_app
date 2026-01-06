// src/redux/slices/foodCustomizationSlice.js

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../global_Url/axiosInstance";
import { API } from "../../global_Url/GlobalUrl";

// 🔹 API call for posting customized food
export const postCustomizedFood = createAsyncThunk(
  "foodCustomization/postCustomizedFood",
  async (payload, { rejectWithValue }) => {
    console.log(payload,"--------------payload");
    
    try {
      const response = await axiosInstance.post(
        API.customizeFood,payload,
       
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response?.data,"---------------------resData");
      
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Something went wrong" }
      );
    }
  }
);

const foodCustomizationSlice = createSlice({
  name: "foodCustomization",
  initialState: {
    data: null,
    loading: false,
    error: null,
  },
  reducers: {
    resetCustomization: (state) => {
      state.data = null;
      state.error = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(postCustomizedFood.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(postCustomizedFood.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(postCustomizedFood.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetCustomization } = foodCustomizationSlice.actions;
export default foodCustomizationSlice.reducer;
