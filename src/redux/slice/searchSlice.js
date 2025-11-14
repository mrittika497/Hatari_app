// src/redux/slice/searchSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../global_Url/axiosInstance";
import { API } from "../../global_Url/GlobalUrl";

export const fetchSearchResults = createAsyncThunk(
  "search/fetchSearchResults",
  async (query, { rejectWithValue }) => {
    try {
      if (!query || query.trim() === "") return [];

      const response = await axiosInstance.post(API.searchFood, {
        name: query.trim(),
      });
      console.log(response,"----------------response");
      

      return response.data?.data || [];
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Search failed"
      );
    }
  }
);

const searchSlice = createSlice({
  name: "search",
  initialState: {
    query: "",
    results: [],
    loading: false,
    error: null,
  },
  reducers: {
    setSearchQuery: (state, action) => {
      state.query = action.payload;
    },
    clearSearch: (state) => {
      state.query = "";
      state.results = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSearchResults.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSearchResults.fulfilled, (state, action) => {
        state.loading = false;
        state.results = Array.isArray(action.payload)
          ? action.payload
          : [];
      })
      .addCase(fetchSearchResults.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setSearchQuery, clearSearch } = searchSlice.actions;
export default searchSlice.reducer;
