import React from 'react';
import { View, Platform, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

// Import Screens
import HomeScreen from '../screens/BottomScreen/HomeScreen';
import ProfileScreen from '../screens/BottomScreen/ProfileScreen';
import CartScreen from '../screens/BottomScreen/CartScreen';
import MenuScreen from '../screens/BottomScreen/MenuScreen';

const Tab = createBottomTabNavigator();

const Bottom = () => {
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }} edges={['bottom']}>
      <View style={{ flex: 1 }}>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            headerShown: false,
            tabBarShowLabel: true,
            tabBarActiveTintColor: '#ff6347',
            tabBarInactiveTintColor: 'gray',
            tabBarLabelStyle: {
              fontSize: 12,
              fontWeight: '600',
              marginBottom: Platform.OS === 'ios' ? 4 : 6,
            },
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

              return (
                <Ionicons
                  name={iconName}
                  size={26}
                  color={color}
                  style={{ marginBottom: Platform.OS === 'ios' ? -2 : 0 }}
                />
              );
            },
            tabBarStyle: [
              styles.tabBar,
              {
                height:
                  Platform.OS === 'ios'
                    ? 70 + insets.bottom * 0.5
                    : 68 + insets.bottom * 0.3,
                paddingBottom: insets.bottom > 0 ? insets.bottom / 2 : 8,
              },
            ],
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

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    left: 10,
    right: 10,
    bottom: 0,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    borderRadius: 22,
    backgroundColor: '#fff',
    elevation: 10, // for Android shadow
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    overflow: 'hidden',
  },
});
