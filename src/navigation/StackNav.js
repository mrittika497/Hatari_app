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



const Stack = createNativeStackNavigator();

const StackNav = () => {
  // const [loading, setLoading] = useState(true);
  // const [userLoggedIn, setUserLoggedIn] = useState(false);

  // useEffect(() => {
  //   const checkLogin = async () => {
  //     try {
  //       const token = await AsyncStorage.getItem('userToken');

  //       if (token) {
  //         setUserLoggedIn(true);
  //       }
  //     } catch (err) {
  //       console.log('Error reading AsyncStorage:', err);
  //     }
  //     setLoading(false);
  //   };
  //   checkLogin();
  // }, []);

  // if (loading) {
  //   // Optional: splash loader while checking AsyncStorage
  //   return null;
  // }

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {backgroundColor: '#ffffff'},
        headerTitleStyle: {fontWeight: 'bold', fontSize: 20},
        headerTintColor: '#000000',
      }}>
    
      
    
    
          <Stack.Screen
            name="Splash"
            component={Splash}
            options={{headerShown: false}}
          />
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
          {/* <Stack.Screen
            name="MapAddress"
            component={MapAddress}
            options={{headerShown: false}}
          /> */}
          {/* <Stack.Screen
            name="PaymentScreen"
            component={PaymentScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="ComfromScreen"
            component={ComfromScreen}
            options={{headerShown: false}}
          /> */}
          {/* <Stack.Screen
            name="OrderSummary"z
            component={OrderSummary}
            options={{headerShown: false}}
          /> */}
          <Stack.Screen
            name="DineSection"
            component={DineSection}
            options={{headerShown: false}}
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
