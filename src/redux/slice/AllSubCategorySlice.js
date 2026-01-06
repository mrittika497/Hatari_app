import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../global_Url/axiosInstance";
import { API } from "../../global_Url/GlobalUrl";

// 🔥 Fetch all sub categories (Chicken)
export const fetchAllSubCategories = createAsyncThunk(
  "allSubCategory/fetch",
  async ({ subCategoryId, type }, { rejectWithValue }) => {
    console.log(subCategoryId,"------------subCategoryId");
    
    try {
      const res = await axiosInstance.get(
        `${API.GetAllSubCategory}?categoryId=${subCategoryId}&type=${type}`
      );
      console.log(res,"-----------res");
      
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || "Failed to fetch sub categories"
      );
    }
  }
);

const AllSubCategorySlice = createSlice({
  name: "allSubCategory",
  initialState: {
    data: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearAllSubCategory: state => {
      state.data = [];
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchAllSubCategories.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllSubCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchAllSubCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearAllSubCategory } = AllSubCategorySlice.actions;
export default AllSubCategorySlice.reducer;
