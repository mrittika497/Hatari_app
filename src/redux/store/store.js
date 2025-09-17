import {configureStore} from '@reduxjs/toolkit';
import HomeReducer from '../slice/HomeSlice';
import authReducer from '../slice/authSlice';
import nearestResReucer from '../slice/nearestResSlice';
import AllRestaurantReucer from '../slice/AllRestaurantSlice';
import bannerReucer from '../slice/BannerSlice';
import AllFoodsReucer from '../slice/AllFoodsSlice';
import cartReucer from '../slice/cartSlice';
import addressReucer from '../slice/addressSlice';
import foodCategoryReducer from '../slice/foodCategorySlice';
import foodCustomizationReducer from '../slice/CustomizeSlice';
import catItemReducer from '../slice/catItemSlice';
import menucuisineTypeReducer from '../slice/menucuisineTypeSlice'
const store = configureStore({
  reducer: {
    home: HomeReducer,
    auth: authReducer,
    nearestRestaurants: nearestResReucer,
    restaurants: AllRestaurantReucer,
    banners: bannerReucer,
    allFoods: AllFoodsReucer,
    cart: cartReucer,
    address: addressReucer,
    foodCategory: foodCategoryReducer,
    foodCustomization: foodCustomizationReducer,
    catItems: catItemReducer,
    menuItems: menucuisineTypeReducer,
  },
});

export default store;
