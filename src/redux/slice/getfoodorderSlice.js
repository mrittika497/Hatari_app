import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../global_Url/axiosInstance';
import { API } from '../../global_Url/GlobalUrl';

// Async thunk to fetch food orders from API
export const fetchFoodOrders = createAsyncThunk(
  'foodOrder/fetchFoodOrders',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(API.getfoodOrder);
      return response.data; // Axios already parses JSON
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  orders: [],
  loading: false,
  error: null,
};

const getFoodOrderSlice = createSlice({
  name: 'foodOrder',
  initialState,
  reducers: {
    addOrder: (state, action) => {
      state.orders.push(action.payload);
    },
    removeOrder: (state, action) => {
      state.orders = state.orders.filter(order => order.id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFoodOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFoodOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchFoodOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { addOrder, removeOrder } = getFoodOrderSlice.actions;

export default getFoodOrderSlice.reducer;
