import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../global_Url/axiosInstance';
import { API } from '../../global_Url/GlobalUrl';

// ✅ Async thunk to fetch delivery settings
export const fetchDeliverySettings = createAsyncThunk(
  'deliverySettings/fetchDeliverySettings',
  async (_, { rejectWithValue }) => {
    try {
      console.log('📡 Fetching from:', API.deliverySettings);
      const response = await axiosInstance.get(API.deliverySettings);

      console.log('✅ Delivery Settings Response:', response.data);

      if (response.data?.success && response.data?.data) {
        return response.data.data;
      } else {
        return rejectWithValue('Invalid API response format');
      }
    } catch (error) {
      console.log('❌ Delivery Settings Error:', error.response?.data || error.message);
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch delivery settings'
      );
    }
  }
);

// ✅ Initial state
const initialState = {
  data: null,
  loading: false,
  error: null,
};

// ✅ Slice
const deliverySettingsSlice = createSlice({
  name: 'deliverySettings',
  initialState,
  reducers: {
    clearDeliverySettings: state => {
      state.data = null;
      state.error = null;
      state.loading = false;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchDeliverySettings.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDeliverySettings.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchDeliverySettings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearDeliverySettings } = deliverySettingsSlice.actions;

export default deliverySettingsSlice.reducer;
