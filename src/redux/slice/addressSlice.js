import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  savedAddress: null,
};

const addressSlice = createSlice({
  name: "address",
  initialState,
  reducers: {
    saveAddress: (state, action) => {
      state.savedAddress = action.payload;
    },
    clearAddress: (state) => {
      state.savedAddress = null;
    },
  },
});

export const { saveAddress, clearAddress } = addressSlice.actions;
export default addressSlice.reducer;
