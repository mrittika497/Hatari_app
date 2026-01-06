import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { API } from "../../global_Url/GlobalUrl";
import axiosInstance from "../../global_Url/axiosInstance";

// Fetch nearest restaurants
export const fetchNearestRestaurants = createAsyncThunk(
  "restaurants/fetchNearest",
  async ({  lat, lng }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(API.nearestRasturance, {
        params: { lat, lng }
       
      });

      // Optional: sort by distance if API does not
      const sorted = response.data.sort((a, b) => a.distance - b.distance);
      return sorted;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const nearestResSlice = createSlice({
  name: "nearestRestaurants",
  initialState: { data: [], loading: false, error: null },
  reducers: {
    clearRestaurants: (state) => {
      state.data = [];
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNearestRestaurants.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNearestRestaurants.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchNearestRestaurants.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch restaurants";
      });
  },
});

export const { clearRestaurants } = nearestResSlice.actions;
export default nearestResSlice.reducer;
