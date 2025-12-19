import React, {useState} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  StatusBar,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import ToggleComponents from './ToggleComponents';
import {setExperience, setRestaurant} from '../redux/slice/experienceSlice';

const HomeHeader = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const {experienceId, selectedRestaurant} = useSelector(
    state => state.experience,
  );
  const restaurantList = useSelector(state => state.restaurants.list || []);
  console.log(restaurantList, '-----------------restaurantList-------------');

  const cartItems = useSelector(state => state.cart.items || []);
  const totalCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  console.log(totalCount, '----------------------totalCount');

  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedExperience, setSelectedExperience] = useState('Delivery');

  return (
    <>
      {/* 🔥 FIXED STATUSBAR */}
      <StatusBar
        backgroundColor="#ef2435"
        barStyle="light-content"
        translucent={false}
      />

      {/* 🔥 Modern Gradient Header */}
      <LinearGradient
        colors={['#ef2435', '#fefefc']}
        style={styles.headerBackground}>
        <View style={styles.headerTop}>
          {/* 🔥 Branch Selector */}
          <TouchableOpacity
            style={styles.branchSelector}
            onPress={() => setShowDropdown(!showDropdown)}>
            <Image
              source={require('../assets/images/location.png')}
              style={styles.locationIcon}
            />

            <View style={{maxWidth: '70%'}}>
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

          {/* 🔥 Cart Button */}
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

        {/* 🔍 Search Bar */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => navigation.navigate('Bottom', {screen: 'MenuScreen'})}
          style={styles.searchInput}>
          <Text style={styles.placeholder}>Search dishes or restaurants…</Text>
        </TouchableOpacity>
      </LinearGradient>

      {/* 🔽 Dropdown */}
      {showDropdown && (
        <View style={styles.dropdownList}>
          <ScrollView style={{maxHeight: 220}}>
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
                    }),
                  );
                }}>
                <Text
                  style={[
                    styles.dropdownText,
                    selectedRestaurant?._id === restaurant._id && {
                      color: '#e91e3c',
                      fontWeight: 'bold',
                    },
                    restaurant.isActive === false && {
                      color: 'red',
                    },
                  ]}>
                  {restaurant.isActive
                    ? restaurant.name
                    : 'Restaurant not available'}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {/* 🟢 Veg / Non-Veg Toggle */}
      <View style={styles.toggleWrapper}>
        <ToggleComponents />
      </View>
    </>
  );
};

export default HomeHeader;

const styles = StyleSheet.create({
  headerBackground: {
    paddingVertical: 30,
    paddingHorizontal: 15,
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
    elevation: 8,
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

  locationIcon: {width: 20, height: 20, tintColor: '#fff', marginRight: 6},
  branchText: {color: '#fff', fontWeight: '600', fontSize: 16},
  downArrow: {width: 14, height: 14, tintColor: '#fff', marginLeft: 6},

  cartContainer: {position: 'relative'},
  cartIcon: {width: 24, height: 24, tintColor: '#fff'},

  cartBadge: {
    position: 'absolute',
    right: -6,
    top: -6,
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 5,
    paddingVertical: 1,
  },
  cartCount: {color: '#e91e3c', fontSize: 10, fontWeight: '700'},

  searchInput: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginTop: 15,
    paddingHorizontal: 15,
    height: 42,
    justifyContent: 'center',
    elevation: 4,
  },
  placeholder: {color: '#666', fontSize: 14},

  dropdownList: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginHorizontal: 20,
    elevation: 5,
    marginTop: -8,
    paddingVertical: 5,
  },

  dropdownItem: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
  },

  dropdownText: {fontSize: 14, color: '#333'},

  toggleWrapper: {
    paddingHorizontal: 20,
    marginTop: 8,
    alignItems: 'flex-end',
  },
});
