import React, {useEffect, useState} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Bottom from './Bottom';
import Splash from '../screens/Splash';
import LoginScreen from '../screens/auth/LoginScreen';
import OtpScreen from '../screens/auth/OtpScreen';
import ExperienceScreen from '../screens/ExperienceScreen';
import DineSection from '../screens/DineSection';
import FoodDetailScreen from '../screens/FoodDetailScreen';
import CatItemScreen from '../screens/CatItemScreen';
import OrderSummaryScreen from '../screens/OrderSummaryScreen';

const Stack = createNativeStackNavigator();

const StackNav = () => {
  const [loading, setLoading] = useState(true);
  const [userToken, setUserToken] = useState(null);

  useEffect(() => {
    const checkLogin = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        setUserToken(token); // token exists => user already logged in
      } catch (err) {
        console.log('Error reading AsyncStorage:', err);
      } finally {
        setLoading(false);
      }
    };
    checkLogin();
  }, []);

  if (loading) {
    return null; // or a loading spinner
  }

  return (
    <Stack.Navigator
      initialRouteName={userToken ? 'ExperienceScreen' : 'Splash'}
      screenOptions={{
        headerStyle: {backgroundColor: '#ffffff'},
        headerTitleStyle: {fontWeight: 'bold', fontSize: 20},
        headerTintColor: '#000000',
      }}>
      {!userToken && (
        <>
          <Stack.Screen
            name="LoginScreen"
            component={LoginScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="OtpScreen"
            component={OtpScreen}
            options={{headerShown: false}}
          />
        </>
      )}
      <Stack.Screen
        name="Splash"
        component={Splash}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="ExperienceScreen"
        component={ExperienceScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="FoodDetailScreen"
        component={FoodDetailScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="CatItemScreen"
        component={CatItemScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="DineSection"
        component={DineSection}
        options={{headerShown: false}}
      />
      <Stack.Screen
      name='OrderSummaryScreen'
      component={OrderSummaryScreen}
      options={{headerShown:false}}
      />
      <Stack.Screen
        name="Bottom"
        component={Bottom}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
};

export default StackNav;
