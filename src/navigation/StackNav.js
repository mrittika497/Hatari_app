// src/navigation/StackNav.js

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Bottom from './Bottom';
import Splash from '../screens/Splash';
import LoginScreen from '../screens/auth/LoginScreen';
import OtpScreen from '../screens/auth/OtpScreen';
import ExperienceScreen from '../screens/ExperienceScreen';
import FoodDetailScreen from '../screens/FoodDetailScreen';
import CatItemScreen from '../screens/CatItemScreen';
// import DetailsScreen from '../screens/DetailsScreen'; // Add when needed

const Stack = createNativeStackNavigator();

const StackNav = () => {
  return (
    <Stack.Navigator
      initialRouteName="Splash"
      screenOptions={{
        headerStyle: {
          backgroundColor: '#ffffff', // white background for header
        },
        headerTitleStyle: {
          fontWeight: 'bold',
          fontSize: 20,
        },
        headerTintColor: '#000000', // color for back button and title
      }}
    >

      <Stack.Screen name="Splash"
        component={Splash}
        options={{ headerShown: false }}
      />

      <Stack.Screen name="LoginScreen"
        component={LoginScreen}
        options={{ headerShown: false }}
      />

      <Stack.Screen name="OtpScreen"
        component={OtpScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen name='ExperienceScreen' component={ExperienceScreen}
        options={{ headerShown: false }}
      />

      <Stack.Screen name="FoodDetailScreen" component={FoodDetailScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="CatItemScreen" component={CatItemScreen}
        options={{ headerShown: false }}
      />



      <Stack.Screen name="Bottom" component={Bottom} options={{ headerShown: false }} />


    </Stack.Navigator>
  );
};

export default StackNav;
