import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { API } from "../../global_Url/GlobalUrl";

// Fetch nearest restaurants
export const fetchNearestRestaurants = createAsyncThunk(
  "restaurants/fetchNearest",
  async ({ token, lat, lng }, { rejectWithValue }) => {
    try {
      const response = await axios.get(API.nearestRasturance, {
        params: { lat, lng },
        headers: { Authorization: `Bearer ${token}` },
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
