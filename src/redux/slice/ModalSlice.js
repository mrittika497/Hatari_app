import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  modalVisible: false,
  selectedCuisine: null,
  cuisineName: '',
};

const modalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    openCuisineModal: (state, action) => {
      state.modalVisible = true;
      state.selectedCuisine = action.payload; 
       state.cuisineName = action.payload.name;
    },
    closeCuisineModal: (state) => {
      state.modalVisible = false;
      state.selectedCuisine = null;
    },
  },
});

export const { openCuisineModal, closeCuisineModal } = modalSlice.actions;
export default modalSlice.reducer;
