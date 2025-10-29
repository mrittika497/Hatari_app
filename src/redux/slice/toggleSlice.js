// redux/slice/foodFilterSlice.js
import { createSlice } from '@reduxjs/toolkit';

const toggleSlice = createSlice({
  name: 'foodFilter',
  initialState: { isVeg: true },
  reducers: {
    toggleFilter: (state) => { state.isVeg = !state.isVeg; },
    setFilter: (state, action) => { state.isVeg = !!action.payload; },
  },
});

export const { toggleFilter, setFilter } = toggleSlice.actions;
export default toggleSlice.reducer;



