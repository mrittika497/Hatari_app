// Api/Global_Api.js
export const BASE_URL = 'https://hatari.backend.sensegeofence.com/api/';

export const API = {
  sendOtp: `${BASE_URL}auth/sendOtp`,
  verifyOtp: `${BASE_URL}auth/verifyOtp`,
  nearestRasturance: `${BASE_URL}restaurant/getAllRestaurants`,
  allRestaurant: `${BASE_URL}restaurant/list`,
  getbannerHome : `${BASE_URL}banner/getAll`,
  getallfoods : `${BASE_URL}food/foods`,
  AllFoodCat :`${BASE_URL}catfood/allFoodCatActive`,
  customizeFood:`${BASE_URL}cart/add`,
  getCatItemfoods : `${BASE_URL}food/foods`,
  getmenutemfoods : `${BASE_URL}food/foods`,
  getfoodpagination :`${BASE_URL}food/foods`,
  addAddressPost:`${BASE_URL}users/addAddress`,
  deliverySettings :`${BASE_URL}setting/deliverySettings`,
  tableBooking :`${BASE_URL}booking`,
  coupon :`${BASE_URL}coupon`,
  billing:`${BASE_URL}billing/create`,

};