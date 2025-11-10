import { createSlice } from '@reduxjs/toolkit';

const foodFilterSlice = createSlice({
  name: 'foodFilter',
  initialState: { isVeg: false }, // false = non-veg, true = veg
  reducers: {
    toggleFilter: (state) => { state.isVeg = !state.isVeg; },
    setFilter: (state, action) => { state.isVeg = !!action.payload; },
  },
});

export const { toggleFilter, setFilter } = foodFilterSlice.actions;
export default foodFilterSlice.reducer;
