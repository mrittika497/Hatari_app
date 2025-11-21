// import axios from 'axios';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import {BASE_URL} from './GlobalUrl';

// const axiosInstance = axios.create({
//   baseURL: BASE_URL,
// });

// // Automatically attach token to every request
// axiosInstance.interceptors.request.use(
//   async config => {
//     const token = await AsyncStorage.getItem('userToken');
//     console.log('Token from AsyncStorage:', token);
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   error => Promise.reject(error),
// );

// export default axiosInstance;



import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from './GlobalUrl';

const axiosInstance = axios.create({
  baseURL: BASE_URL,
});

// Optional: in-memory token cache
let cachedToken = null;

// Automatically attach token to every request
axiosInstance.interceptors.request.use(
  async (config) => {
    if (!cachedToken) {
      cachedToken = await AsyncStorage.getItem('userToken');
    }
    if (cachedToken) {
      config.headers.Authorization = `Bearer ${cachedToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Optional: clear cached token when logging out
export const clearTokenCache = () => {
  cachedToken = null;
};

export default axiosInstance;
