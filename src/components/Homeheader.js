import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import ToggleComponents from './ToggleComponents';
import { setExperience, setRestaurant } from '../redux/slice/experienceSlice';

const HomeHeader = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const { experienceId, selectedRestaurant } = useSelector(
    state => state.experience,
  );
  const restaurantList = useSelector(state => state.restaurants.list || []);
  const cartItems = useSelector(state => state.cart.items || []);
  // const totalCount =  cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0);
const totalCount = cartItems.length;
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedExperience, setSelectedExperience] = useState('Delivery');

  return (
    <>
      {/* 🔹 Gradient Header */}
      <LinearGradient
        colors={['#ef2435', '#fefefc']}
        style={styles.headerBackground}>
        <View style={styles.headerTop}>
          {/* 🔸 Branch Selector */}
          <TouchableOpacity
            style={styles.branchSelector}
            onPress={() => setShowDropdown(!showDropdown)}>
            <Image
              source={require('../assets/images/location.png')}
              style={styles.locationIcon}
            />
            <Text style={styles.branchText} numberOfLines={1}>
              {selectedRestaurant?.name || 'Select Branch'}
            </Text>
            <Image
              source={require('../assets/images/downarrow.png')}
              style={styles.downArrow}
            />
          </TouchableOpacity>

          {/* 🔸 Cart Icon */}
          <TouchableOpacity
            onPress={() => navigation.navigate('OderCartScreen')}
            style={styles.cartContainer}>
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

        {/* 🔸 Search Input */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => navigation.navigate('Bottom', { screen: 'MenuScreen' })}
          style={styles.searchInput}>
          <Text style={styles.placeholder}>
            Search for dishes, restaurants...
          </Text>
        </TouchableOpacity>
      </LinearGradient>

      {/* 🔹 Dropdown List */}
      {showDropdown && (
        <View style={styles.dropdownList}>
          <ScrollView style={{ maxHeight: 200 }}>
            {restaurantList.length > 0 ? (
              restaurantList.map((restaurant, index) => (
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
                      }),
                    );
                  }}>
                  <Text
                    style={[
                      styles.dropdownText,
                      selectedRestaurant?._id === restaurant._id && {
                        color: '#ef2435',
                        fontWeight: 'bold',
                      },
                    ]}>
                    {restaurant.name}
                  </Text>
                </TouchableOpacity>
              ))
            ) : (
              <Text style={styles.noDataText}>No restaurants available</Text>
            )}
          </ScrollView>
        </View>
      )}

      {/* 🔹 Veg / Non-Veg Toggle */}
      <View style={styles.toggleWrapper}>
        <ToggleComponents />
      </View>
    </>
  );
};

export default HomeHeader;

const styles = StyleSheet.create({
  headerBackground: {
    paddingVertical: 25,
    paddingHorizontal: 15,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    elevation: 8,
    marginTop:13
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  branchSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '75%',
  },
  locationIcon: {
    width: 20,
    height: 20,
    tintColor: '#fff',
    marginRight: 6,
  },
  branchText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  downArrow: {
    width: 14,
    height: 14,
    tintColor: '#fff',
    marginLeft: 6,
  },
  cartContainer: {
    position: 'relative',
  },
  cartIcon: {
    width: 24,
    height: 24,
    tintColor: '#fff',
  },
  cartBadge: {
    position: 'absolute',
    right: -6,
    top: -6,
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 5,
    paddingVertical: 1,
  },
  cartCount: {
    color: '#ef2435',
    fontSize: 10,
    fontWeight: '700',
  },
  searchInput: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginTop: 15,
    paddingHorizontal: 15,
    height: 40,
    justifyContent: 'center',
  },
  placeholder: {
    color: '#000',
    fontSize: 14,
  },
  dropdownList: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginHorizontal: 20,
    elevation: 3,
    marginTop: 5,
    paddingVertical: 5,
  },
  dropdownItem: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
  },
  dropdownText: {
    fontSize: 14,
    color: '#333',
  },
  noDataText: {
    textAlign: 'center',
    color: '#999',
    paddingVertical: 10,
  },
  toggleWrapper: {
    alignItems: 'flex-end',
    paddingHorizontal: 20,
    marginTop: 5,
  },
});
