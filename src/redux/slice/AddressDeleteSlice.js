// redux/slice/deleteAddressSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../global_Url/axiosInstance';
import { API } from '../../global_Url/GlobalUrl';

// 🗑 Async thunk to delete an address by ID
export const deleteUserAddress = createAsyncThunk(
  'address/deleteUserAddress',
  async (addressId, { rejectWithValue }) => {
    console.log(addressId,"----------------addressId");
    
    try {
      const response = await axiosInstance.delete(`${API.AddressDelete}/${addressId}`);
      console.log('Address deleted:', response.data);
      return addressId; // return deleted address ID
    } catch (error) {
      console.log('❌ Delete Error:', error.response?.data || error.message);
      return rejectWithValue(error.response?.data || 'Failed to delete address');
    }
  }
);

// 🧱 Slice
const deleteAddressSlice = createSlice({
  name: 'deleteAddress',
  initialState: {
    deletedId: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearDeleted(state) {
      state.deletedId = null;
      state.error = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(deleteUserAddress.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteUserAddress.fulfilled, (state, action) => {
        state.loading = false;
        state.deletedId = action.payload;
      })
      .addCase(deleteUserAddress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearDeleted } = deleteAddressSlice.actions;
export default deleteAddressSlice.reducer;
