import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  experienceId: null,
  experienceType: '', // store type name like "Delivery"
  selectedRestaurant: null,
  
};

const experienceSlice = createSlice({
  name: 'experience',
  initialState,
  reducers: {
    setExperience: (state, action) => {
      // action.payload should be an object { id, type }
      state.experienceId = action.payload.id;
      state.experienceType = action.payload.type;
       state.selectedRestaurant = action.payload.restaurant || state.selectedRestaurant;
    },
    setRestaurant: (state, action) => {
      state.selectedRestaurant = action.payload;
    },
    clearExperience: (state) => {
      state.experienceId = null; 
      state.experienceType = '';
      state.selectedRestaurant = null;
    },
  },
});

export const { setExperience, setRestaurant, clearExperience } = experienceSlice.actions;
export default experienceSlice.reducer;
