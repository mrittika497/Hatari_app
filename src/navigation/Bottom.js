import React from 'react';
import { View, Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

// Import your screens
import HomeScreen from '../screens/BottomScreen/HomeScreen';
import ProfileScreen from '../screens/BottomScreen/ProfileScreen';
import CartScreen from '../screens/BottomScreen/CartScreen';
import MenuScreen from '../screens/BottomScreen/MenuScreen';

const Tab = createBottomTabNavigator();

const Bottom = () => {
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }} edges={['bottom']}>
      <View style={{ flex: 1, paddingBottom: Platform.OS === 'android' ? insets.bottom : 0 }}>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarShowLabel: true,
            tabBarActiveTintColor: '#ff6347',
            tabBarInactiveTintColor: 'gray',
            tabBarStyle: {
              position: 'absolute',
              left: 0,
              right: 0,
              bottom: 0, // ✅ stays fixed at bottom
              backgroundColor: '#fff',
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              height: 60 + insets.bottom, // ✅ adds safe padding automatically
              paddingBottom: insets.bottom > 0 ? insets.bottom / 2 : 8,
              elevation: 8,
              shadowColor: '#000',
              shadowOpacity: 0.1,
              shadowRadius: 5,
              shadowOffset: { width: 0, height: 2 },
              overflow: 'hidden',
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
          <Tab.Screen
            name="HomeScreen"
            component={HomeScreen}
            options={{ tabBarLabel: 'Home' }}
          />
          <Tab.Screen
            name="CartScreen"
            component={CartScreen}
            options={{ tabBarLabel: 'Cart' }}
          />
          <Tab.Screen
            name="MenuScreen"
            component={MenuScreen}
            options={{ tabBarLabel: 'Menu' }}
          />
          <Tab.Screen
            name="ProfileScreen"
            component={ProfileScreen}
            options={{ tabBarLabel: 'Profile' }}
          />
        </Tab.Navigator>
      </View>
    </SafeAreaView>
  );
};

export default Bottom;
