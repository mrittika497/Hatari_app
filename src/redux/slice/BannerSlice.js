// redux/slice/bannerSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { API } from "../../global_Url/GlobalUrl";
import axiosInstance from "../../global_Url/axiosInstance";


// Async thunk to fetch banners from API
export const fetchBanners = createAsyncThunk(
  "banners/fetchBanners",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(API.getbannerHome);
      return response.data; // Assuming API returns an array of banners
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const bannerSlice = createSlice({
  name: "banners",
  initialState: {
    bannerlist: [],       // array of banners
    loading: false,
    error: null,
  },
  reducers: {
    clearBanners: (state) => {
      state.bannerlist = [];
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBanners.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBanners.fulfilled, (state, action) => {
        state.loading = false;
        state.bannerlist = action.payload || [];
      })
      .addCase(fetchBanners.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch banners";
      });
  },
});

export const { clearBanners } = bannerSlice.actions;
export default bannerSlice.reducer;
