import {createSlice} from '@reduxjs/toolkit';

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [], // [{ id, name, priceInfo, quantity, restaurant, type }]
  },

  reducers: {
addToCart: (state, action) => {
  const newItem = action.payload;
  const selectedAddOns = newItem.selectedAddOns || []; 
  // const addOnTotal = selectedAddOns.reduce((sum, a) => sum + (a.price || 0), 0);
const existingItem = state.items.find(
  i =>
    i.id === newItem.id &&
    i.selectedOption === newItem.selectedOption &&
    JSON.stringify(i.selectedAddOns || []) === JSON.stringify(newItem.selectedAddOns || [])
);



  if (existingItem) {
    // Increase quantity
    existingItem.quantity += newItem.quantity || 1;

    // Recalculate price
    existingItem.totalPrice = existingItem.unitPrice * existingItem.quantity;

  } else {
    // Compute priceInfo cleanly
    const priceInfo = {
      halfPrice: newItem.priceInfo?.halfPrice || null,
      fullPrice: newItem.priceInfo?.fullPrice || null,
      staticPrice: newItem.priceInfo?.staticPrice || null,
    };

    // Determine final unit price
    const unitPrice = priceInfo.staticPrice
      ? Number(priceInfo.staticPrice)
      : newItem.selectedOption === "half"
      ? Number(priceInfo.halfPrice)
      : Number(priceInfo.fullPrice);

    state.items.push({
      id: newItem._id,
      name: newItem.name,
      image: newItem.image,
      quantity: newItem.quantity || 1,
      selectedOption: newItem.selectedOption || "full",
      hasVariation: newItem.hasVariation || false,
      note: newItem.note || "",
      priceInfo,
      unitPrice,
      totalPrice: unitPrice * (newItem.quantity || 1),
      restaurant: newItem.restaurant,
      type: newItem.type,
         selectedAddOns: selectedAddOns, 
      // selectedOption: newItem.selectedOption,
    });
  } 
},
// addToCart: (state, action) => {
//   const newItem = action.payload;

//   const selectedAddOns = newItem.addOns || [];   // ⭐ Add-ons

//   // Add-on total
//   const addOnTotal = selectedAddOns.reduce((sum, a) => sum + (a.price || 0), 0);

//   // Base price logic
//   const priceInfo = {
//     halfPrice: newItem.priceInfo?.halfPrice || null,
//     fullPrice: newItem.priceInfo?.fullPrice || null,
//     staticPrice: newItem.priceInfo?.staticPrice || null,
//   };

//   const baseUnitPrice = priceInfo.staticPrice
//     ? Number(priceInfo.staticPrice)
//     : newItem.selectedOption === "half"
//     ? Number(priceInfo.halfPrice)
//     : Number(priceInfo.fullPrice);

//   const finalUnitPrice = baseUnitPrice + addOnTotal; // ⭐ Add-ons added here

//   // ❗ Unique key: same item + same option + same addons
//   const existingItem = state.items.find(
//     i =>
//       i.id === newItem.id &&
//       i.selectedOption === newItem.selectedOption &&
//       JSON.stringify(i.addOns) === JSON.stringify(selectedAddOns)
//   );

//   if (existingItem) {
//     existingItem.quantity += newItem.quantity || 1;
//     existingItem.totalPrice = existingItem.quantity * finalUnitPrice;
//   } else {
//     state.items.push({
//       id: newItem.id,
//       name: newItem.name,
//       image: newItem.image,
//       quantity: newItem.quantity || 1,
//       selectedOption: newItem.selectedOption || "full",
//       addOns: selectedAddOns,             // ⭐ stored in cart
//       priceInfo,
//       unitPrice: finalUnitPrice,
//       totalPrice: finalUnitPrice * (newItem.quantity || 1),
//       restaurant: newItem.restaurant,
//       type: newItem.type,
//     });
//   }
// },
 
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
      const {id, note} = action.payload;
      const item = state.items.find(i => i.id === id);
      if (item) item.note = note;
    },

    clearCart: state => {
      state.items = [];
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  updateNote,
} = cartSlice.actions;
export default cartSlice.reducer;
