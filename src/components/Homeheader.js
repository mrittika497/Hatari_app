import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  StatusBar,
  Dimensions,
  Platform,
  SafeAreaView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import ToggleComponents from './ToggleComponents';
import { setExperience, setRestaurant } from '../redux/slice/experienceSlice';

const { width } = Dimensions.get('window');

const HomeHeader = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const { experienceId, selectedRestaurant } = useSelector(
    state => state.experience
  );
  const restaurantList = useSelector(state => state.restaurants.list || []);
  const cartItems = useSelector(state => state.cart.items || []);
  const totalCount = cartItems.length;

  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedExperience, setSelectedExperience] = useState('Delivery');

  return (
    <>
      {/* StatusBar */}
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />

      {/* SafeArea */}
      <SafeAreaView style={{ backgroundColor: '#ef2435' }} />

      {/* Header */}
      <View style={styles.headerWrapper}>
        <LinearGradient
          colors={['#ef2435', '#fefefe']}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={[
            styles.headerBackground,
            Platform.OS === 'android'
              ? { paddingTop: StatusBar.currentHeight }
              : {},
          ]}
        >
          <View style={{ paddingHorizontal: 15 }}>
            {/* Header Top */}
            <View style={styles.headerTop}>
              {/* Branch Selector */}
              <TouchableOpacity
                style={styles.branchSelector}
                onPress={() => setShowDropdown(!showDropdown)}
                activeOpacity={0.8}
              >
                <Image
                  source={require('../assets/images/location.png')}
                  style={styles.locationIcon}
                />
                <View style={{ maxWidth: '70%' }}>
                  <Text style={styles.branchText} numberOfLines={1}>
                    {selectedRestaurant
                      ? selectedRestaurant.isActive
                        ? selectedRestaurant.name
                        : 'Restaurant not available'
                      : 'Select Branch'}
                  </Text>
                </View>
                <Image
                  source={require('../assets/images/downarrow.png')}
                  style={styles.downArrow}
                />
              </TouchableOpacity>

              {/* Cart */}
              <TouchableOpacity
                onPress={() => navigation.navigate('OderCartScreen')}
                style={styles.cartContainer}
                activeOpacity={0.8}
              >
                <Image
                  source={require('../assets/images/cart.png')}
                  style={styles.cartIcon}
                />
                {totalCount > 0 && (
                  <View style={styles.cartBadge}>
                    <Text style={styles.cartCount}>{totalCount}</Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>

            {/* Search */}
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() =>
                navigation.navigate('Bottom', { screen: 'MenuScreen' })
              }
              style={styles.searchInput}
            >
              <Text style={styles.placeholder}>
                Search dishes or restaurants…
              </Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </View>

      {/* Dropdown */}
      {showDropdown && (
        <View style={styles.dropdownList}>
          <ScrollView style={{ maxHeight: 220 }}>
            {restaurantList.map((restaurant, index) => (
              <TouchableOpacity
                key={restaurant._id || index}
                style={styles.dropdownItem}
                onPress={() => {
                  setShowDropdown(false);
                  dispatch(setRestaurant(restaurant));
                  dispatch(
                    setExperience({
                      id: experienceId,
                      type: selectedExperience,
                      restaurant,
                    })
                  );
                }}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.dropdownText,
                    selectedRestaurant?._id === restaurant._id && {
                      color: '#e91e3c',
                      fontWeight: 'bold',
                    },
                    restaurant.isActive === false && { color: 'red' },
                  ]}
                >
                  {restaurant.isActive
                    ? restaurant.name
                    : 'Restaurant not available'}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Veg / Non-Veg Toggle */}
      <View style={styles.toggleWrapper}>
        <ToggleComponents />
      </View>
    </>
  );
};

export default HomeHeader;

const styles = StyleSheet.create({
  headerWrapper: {
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
    overflow: 'hidden', // important for Android gradient
  },
  headerBackground: {
    width: width,
    justifyContent: 'center',
    elevation: 6, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
        height: Platform.OS === 'android' ? 120 + StatusBar.currentHeight : 120,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  branchSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '72%',
  },
  locationIcon: { width: 20, height: 20, tintColor: '#fff', marginRight: 6 },
  branchText: { color: '#fff', fontWeight: '600', fontSize: 16 },
  downArrow: { width: 14, height: 14, tintColor: '#fff', marginLeft: 6 },

  cartContainer: { position: 'relative' },
  cartIcon: { width: 24, height: 24, tintColor: '#fff' },
  cartBadge: {
    position: 'absolute',
    right: -6,
    top: -6,
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 5,
    paddingVertical: 1,
    zIndex: 10,
  },
  cartCount: { color: '#e91e3c', fontSize: 10, fontWeight: '700' },

  searchInput: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginTop: 15,
    paddingHorizontal: 15,
    height: 42,
    justifyContent: 'center',
    width: '100%',
    elevation: 4, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  placeholder: { color: '#666', fontSize: 14 },

  dropdownList: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginHorizontal: 10,
    elevation: 5, // Android shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    marginTop: 5,
    paddingVertical: 5,
    width: width - 20,
    alignSelf: 'center',
  },
  dropdownItem: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
  },
  dropdownText: { fontSize: 14, color: '#333' },

  toggleWrapper: {
    paddingHorizontal: 20,
    marginTop: 8,
    alignItems: 'flex-end',
    backgroundColor: '#f4eaeaff',
    paddingVertical: 10,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
});
