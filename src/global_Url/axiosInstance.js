import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {BASE_URL} from './GlobalUrl';

const axiosInstance = axios.create({
  baseURL: BASE_URL,
});

// Automatically attach token to every request
axiosInstance.interceptors.request.use(
  async config => {
    const token = await AsyncStorage.getItem('userToken');
    console.log('Token from AsyncStorage:', token);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error),
);

export default axiosInstance;
