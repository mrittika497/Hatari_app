// import { createSlice } from "@reduxjs/toolkit";

// const buildCartKey = (foodId, option, addons = []) => {
//   const addonIds = addons.map(a => a.id).sort().join(",");
//   return `${foodId}|${option}|${addonIds}`;
// };

// const cartSlice = createSlice({
//   name: "cart",
//   initialState: {
//     items: [],
//   },

//   reducers: {
//     hydrateCart: (state, action) => {
//       state.items = action.payload || [];
//     },

//     addToCart: (state, action) => {
//       const item = action.payload;

//       const addonTotal =
//         item.selectedAddOns?.reduce((s, a) => s + Number(a.price), 0) || 0;

//       const unitPrice =
//         item.priceInfo?.staticPrice
//           ? Number(item.priceInfo.staticPrice)
//           : item.selectedOption === "half"
//           ? Number(item.priceInfo.halfPrice)
//           : Number(item.priceInfo.fullPrice);

//       const cartKey = buildCartKey(
//         item._id,
//         item.selectedOption,
//         item.selectedAddOns
//       );

//       const existing = state.items.find(i => i.cartKey === cartKey);

//       if (existing) {
//         existing.quantity += item.quantity || 1;
//         existing.totalPrice =
//           (unitPrice + addonTotal) * existing.quantity;
//       } else {
//         state.items.push({
//           cartKey,
//           foodId: item._id,
//           name: item.name,
//           image: item.image,
//           quantity: item.quantity || 1,
//           selectedOption: item.selectedOption,
//           selectedAddOns: item.selectedAddOns || [],
//           unitPrice,
//           addonTotal,
//           totalPrice: (unitPrice + addonTotal) * (item.quantity || 1),
//           note: "",
//           restaurant: item.restaurant,
//           type: item.type,
//         });
//       }
//     },

//     updateQuantity: (state, action) => {
//       const { cartKey, quantity } = action.payload;
//       const item = state.items.find(i => i.cartKey === cartKey);
//       if (item) {
//         item.quantity = Math.max(1, quantity);
//         item.totalPrice =
//           (item.unitPrice + item.addonTotal) * item.quantity;
//       }
//     },

//     updateNote: (state, action) => {
//       const { cartKey, note } = action.payload;
//       const item = state.items.find(i => i.cartKey === cartKey);
//       if (item) item.note = note;
//     },

//     removeFromCart: (state, action) => {
//       state.items = state.items.filter(
//         i => i.cartKey !== action.payload
//       );
//     },

//     clearCart: state => {
//       state.items = [];
//     },
//   },
// });

// export const {
//   addToCart,
//   updateQuantity,
//   updateNote,
//   removeFromCart,
//   clearCart,
//   hydrateCart,
// } = cartSlice.actions;

// export default cartSlice.reducer;




import { createSlice } from "@reduxjs/toolkit";

/* 🔐 Stable Unique Cart Key */
const buildCartKey = (foodId, option = "full", addons = []) => {
  const addonIds = addons
    .map(a => a._id || a.id)
    .filter(Boolean)
    .sort()
    .join("_");

  return `${foodId}_${option}_${addonIds}`;
};

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [],
  },

  reducers: {
    /* 🔄 Hydrate Cart */
    hydrateCart: (state, action) => {
      state.items = action.payload || [];
    },

    /* ➕ Add To Cart */
addToCart: (state, action) => {
  const item = action.payload;
  const selectedAddOns = item.selectedAddOns || [];

  const addonTotal = selectedAddOns.reduce(
    (sum, a) => sum + Number(a.price || 0),
    0
  );

  const unitPrice =
    item.priceInfo?.staticPrice
      ? Number(item.priceInfo.staticPrice)
      : item.selectedOption === "half"
      ? Number(item.priceInfo?.halfPrice || 0)
      : Number(item.priceInfo?.fullPrice || 0);

  const cartKey = buildCartKey(
    item._id,
    item.selectedOption,
    selectedAddOns
  );

  const existing = state.items.find(
    i => i.cartKey === cartKey
  );

  if (existing) {
    // ✅ ADD selected quantity
    existing.quantity += item.quantity || 1;
  } else {
    state.items.push({
      cartKey,
      foodId: item._id,
      name: item.name,
      image: item.image,
      quantity: item.quantity || 1,   // ✅ USE PASSED QUANTITY
      selectedOption: item.selectedOption || "full",
      selectedAddOns,
      unitPrice,
      addonTotal,
      totalPrice: 0,
      note: "",
      restaurant: item.restaurant,
      type: item.type,
    });
  }

  // ✅ Recalculate total safely
  const target = state.items.find(i => i.cartKey === cartKey);
  if (target) {
    target.totalPrice =
      (target.unitPrice + target.addonTotal) *
      target.quantity;
  }
},


    /* 🔼🔽 Update Quantity */
    updateQuantity: (state, action) => {
      const { cartKey, type } = action.payload;

      const item = state.items.find(
        i => i.cartKey === cartKey
      );

      if (!item) return;

      if (type === "increment") {
        item.quantity += 1;
      }

      if (type === "decrement" && item.quantity > 1) {
        item.quantity -= 1;
      }

      item.totalPrice =
        (item.unitPrice + item.addonTotal) *
        item.quantity;
    },

    /* 📝 Update Note */
    updateNote: (state, action) => {
      const { cartKey, note } = action.payload;

      const item = state.items.find(
        i => i.cartKey === cartKey
      );

      if (item) item.note = note;
    },

    /* ❌ Remove Item */
    removeFromCart: (state, action) => {
      state.items = state.items.filter(
        i => i.cartKey !== action.payload
      );
    },

    /* 🗑 Clear Cart */
    clearCart: state => {
      state.items = [];
    },
  },
});

export const {
  hydrateCart,
  addToCart,
  updateQuantity,
  updateNote,
  removeFromCart,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;

