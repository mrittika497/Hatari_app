// Api/Global_Api.js
export const BASE_URL = 'https://hatari.backend.sensegeofence.com/api/';

export const API = {
  sendOtp: `${BASE_URL}auth/sendOtp`,
  verifyOtp: `${BASE_URL}auth/verifyOtp`,
  nearestRasturance: `${BASE_URL}restaurant/getAllRestaurants`,
  allRestaurant: `${BASE_URL}restaurant/list`,
  getbannerHome : `${BASE_URL}banner/getAll`,
  getallfoods : `${BASE_URL}food/foods`

};