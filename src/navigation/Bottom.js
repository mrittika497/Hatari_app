import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import HomeScreen from '../screens/BottomScreen/HomeScreen';
import ProfileScreen from '../screens/BottomScreen/ProfileScreen';
import CartScreen from '../screens/BottomScreen/CartScreen';
import MenuScreen from '../screens/BottomScreen/MenuScreen';

const Tab = createBottomTabNavigator();

const Bottom = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarShowLabel: true,
        tabBarActiveTintColor: '#ff6347',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          position: 'absolute',
          left: 10,
          right: 10,
          bottom: 10, // 👈 makes it float a little above the screen edge
          backgroundColor: '#fff',
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          height: 60,
          paddingBottom: 8,
          elevation: 5,
          shadowColor: '#000',
          shadowOpacity: 0.1,
          shadowRadius: 5,
          shadowOffset: { width: 0, height: 2 },
          overflow: 'hidden', // 👈 ensures rounded corners actually show
        },
        headerShown: false,
        tabBarIcon: ({ focused, color }) => {
          let iconName;

          if (route.name === 'HomeScreen') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'CartScreen') {
            iconName = focused ? 'cart' : 'cart-outline';
          } else if (route.name === 'MenuScreen') {
            iconName = focused ? 'restaurant' : 'restaurant-outline';
          } else if (route.name === 'ProfileScreen') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={26} color={color} />;
        },
      })}
    >
      <Tab.Screen name="HomeScreen" component={HomeScreen} options={{ tabBarLabel: 'Home' }} />
      <Tab.Screen name="CartScreen" component={CartScreen} options={{ tabBarLabel: 'Cart' }} />
      <Tab.Screen name="MenuScreen" component={MenuScreen} options={{ tabBarLabel: 'Menu' }} />
      <Tab.Screen name="ProfileScreen" component={ProfileScreen} options={{ tabBarLabel: 'Profile' }} />
    </Tab.Navigator>
  );
};

export default Bottom;
