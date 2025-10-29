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
import menucuisineTypeReducer from '../slice/menucuisineTypeSlice';
import experienceReducer from '../slice/experienceSlice';
import SearchFoodPaginationReducer from '../slice/SearchFoodPaginationSlice';
import deliverySettingsReducer from "../slice/deliverySettingsSlice";
 import TableBookingRducer from "../slice/TableBookingSlice";
 import postBillingReducer from '../slice/postBillingSlice';
 import couponReducer from '../slice/couponSlice';
 import getFoodOrderReducer from '../slice/getfoodorderSlice';
 import toggleReducer from '../slice/toggleSlice';
 import foodReducer from '../slice/foodSlice'
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
    experience: experienceReducer,
    FoodPagination: SearchFoodPaginationReducer,
    deliverySettings: deliverySettingsReducer,
    tableBooking:TableBookingRducer,
    coupons:couponReducer,
    billing:postBillingReducer,
    foodOrder:getFoodOrderReducer,
    foodFilter:toggleReducer,
     foods: foodReducer,
  },
});

export default store;
