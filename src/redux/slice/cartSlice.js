import {createSlice} from '@reduxjs/toolkit';

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [], // [{ id, name, priceInfo, quantity, restaurant, type }]
  },
  
  
  reducers: {
    addToCart: (state, action) => {
      const newItem = action.payload;

      // ✅ Check if item already exists in cart
      const existingItem = state.items.find(i => i.id === newItem.id);

      if (existingItem) {
        // ✅ Increase quantity if same item
        existingItem.quantity += newItem.quantity || 1;
      } else {
        // ✅ Add new item to cart
        state.items.push({
          id: newItem.id,
          name: newItem.name,
          priceInfo: newItem.priceInfo,
          image: newItem.image, // 👈 include image
          quantity: newItem.quantity || 1,
          restaurant: newItem.restaurant,
          type: newItem.type,
          note: newItem.note || '', // 👈 also store note
        });
      }
    },

    removeFromCart: (state, action) => {
      const id = action.payload;
      state.items = state.items.filter(i => i.id !== id);
    },

    updateQuantity: (state, action) => {
      const {id, quantity} = action.payload;
      const item = state.items.find(i => i.id === id);
      if (item) {
        item.quantity = Math.max(1, quantity); // prevent zero/negative
      }
    },
        updateNote: (state, action) => {
      const { id, note } = action.payload;
      const item = state.items.find((i) => i.id === id);
      if (item) item.note = note;
    },

    clearCart: state => {
      state.items = [];
    },
  },
});

export const {addToCart, removeFromCart, updateQuantity, clearCart,updateNote} =
  cartSlice.actions;
export default cartSlice.reducer;
