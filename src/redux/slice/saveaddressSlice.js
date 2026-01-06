// saveAddressSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../global_Url/axiosInstance';
import { API } from '../../global_Url/GlobalUrl';

// 🧩 Fetch all user addresses
export const fetchUserAddresses = createAsyncThunk(
  'address/fetchUserAddresses',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(API.saveaddress);
      console.log('📦 API Response:', response.data);
      return response.data; // { success, message, addresses: [] }
    } catch (error) {
      console.log('❌ Fetch Error:', error.response?.data || error.message);
      return rejectWithValue(error.response?.data || 'Failed to fetch addresses');
    }
  }
);

// 🧱 Slice definition
const saveAddressSlice = createSlice({
  name: 'address',
  initialState: {
    addresses: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearAddresses: state => {
      state.addresses = [];
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchUserAddresses.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserAddresses.fulfilled, (state, action) => {
        state.loading = false;
        state.addresses = action.payload?.addresses || ["hhhh"];
      })
      .addCase(fetchUserAddresses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearAddresses } = saveAddressSlice.actions;
export default saveAddressSlice.reducer;
