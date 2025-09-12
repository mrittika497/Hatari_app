// redux/slice/cartSlice.js
import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [], // {id, name, price, quantity, image}
  },
  reducers: {
    addToCart: (state, action) => {
      const item = action.payload;
      const existingIndex = state.items.findIndex(
        (i) => i._id === item._id
      );

      if (existingIndex >= 0) {
        state.items[existingIndex].quantity += item.quantity; // update qty
      } else {
        state.items.push(item);
      }
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter((i) => i._id !== action.payload);
    },
    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const item = state.items.find((i) => i._id === id);
      if (item) {
        item.quantity = quantity;
      }
    },
    
    clearCart: (state) => {
      state.items = [];
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } =
  cartSlice.actions;

export default cartSlice.reducer;
