import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../global_Url/axiosInstance";
import { API } from "../../global_Url/GlobalUrl";

// Async thunk to fetch all foods
export const fetchAllFoods = createAsyncThunk(
  "foods/fetchAll",
  async (_, { rejectWithValue }) => { // no need to pass token
    try {
      const response = await axiosInstance.get(API.getallfoods); // token added automatically
      return response.data; 
    } catch (error) {
      console.log("Fetch Foods Error:", error.response || error.message);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const AllFoodsSlice = createSlice({
  name: "allFoods",
  initialState: {
    AllFoodsData: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearFoods: (state) => {
      state.AllFoodsData = [];
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllFoods.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllFoods.fulfilled, (state, action) => {
        state.loading = false;
        state.AllFoodsData = action.payload;
      })
      .addCase(fetchAllFoods.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch foods";
      });
  },
});

export const { clearFoods } = AllFoodsSlice.actions;
export default AllFoodsSlice.reducer;
