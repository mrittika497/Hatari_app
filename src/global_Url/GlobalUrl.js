// Api/Global_Api.js
export const BASE_URL = 'https://hatari.backend.sensegeofence.com/api/';

export const API = {
  sendOtp: `${BASE_URL}auth/sendOtp`,
  verifyOtp: `${BASE_URL}auth/verifyOtp`,
  nearestRasturance: `${BASE_URL}restaurant/getAllRestaurants`,
  // add more APIs here
};