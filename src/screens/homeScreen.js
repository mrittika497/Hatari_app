// ✅ HomeScreen.js
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  ScrollView,
  Animated,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import ShimmerPlaceholder from 'react-native-shimmer-placeholder';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';

import DashboardScreen from '../../components/DashboardScreen';
import SectionDivider from '../../components/SectionDivider';
import ToggleComponents from '../../components/ToggleComponents';
import { setExperience, setRestaurant } from '../../redux/slice/experienceSlice';
import { fetchRestaurants } from '../../redux/slice/AllRestaurantSlice';
import { fetchBanners } from '../../redux/slice/BannerSlice';
import { fetchAllFoodCat } from '../../redux/slice/foodCategorySlice';
import { fetchFoodPagination } from '../../redux/slice/SearchFoodPaginationSlice';
import Theme from '../../assets/theme';

const HomeScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const tabBarHeight = useBottomTabBarHeight();

  // Redux states
  const cartItems = useSelector(state => state.cart.items || []);
  const totalCount = cartItems.length;
  const isVeg = useSelector(state => state.foodFilter.isVeg);
  const { experienceId, selectedRestaurant, experienceType } = useSelector(
    state => state.experience,
  );
  const { categories } = useSelector(state => state.foodCategory);
  console.log(categories,"-------------------categories");

  // ✅ Veg / Non-Veg Filter for Categories
const filteredCategories = categories?.foods?.filter(item => {
  const foodType = Array.isArray(item?.type)
    ? item.type.map(t => t.toLowerCase())
    : [String(item?.type || '').toLowerCase()];

  if (isVeg === true) return foodType.includes('veg');
  if (isVeg === false)
    return foodType.includes('non-veg') || foodType.includes('nonveg');
  return true;
}) || [];

  
  const { list: restaurantsArray } = useSelector(state => state.restaurants);
  const { bannerlist } = useSelector(state => state.banners);
  const { AllFoodsData = [] } = useSelector(state => state.FoodPagination);

  // Local states
  const [loading, setLoading] = useState(true);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedExperience, setSelectedExperience] = useState(
    experienceType || 'Delivery',
  );

  const flatListRef = useRef(null);
  const categoryScrollRef = useRef(null);
  const scrollX = useRef(new Animated.Value(0)).current;
  const scrollPosition = useRef(0);
  const scrollDirection = useRef(1);

  // Fetch data on mount
  useEffect(() => {
    const loadData = async () => {
      await Promise.all([
        dispatch(fetchRestaurants()),
        dispatch(fetchBanners()),
        dispatch(fetchAllFoodCat()),
        dispatch(fetchFoodPagination({ page: 1, limit: 70, type:isVeg})),
      ]);
    };
    loadData();
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, [dispatch]);

  // ✅ Auto-scroll effect for Categories
  useEffect(() => {
    let interval;
    if (!loading && filteredCategories?.length > 0 && categoryScrollRef.current) {
      interval = setInterval(() => {
        scrollPosition.current += 3 * scrollDirection.current;
        categoryScrollRef.current.scrollTo({
          x: scrollPosition.current,
          animated: true,
        });

        if (scrollPosition.current > (filteredCategories.length * 120) - 300) {
          scrollDirection.current = -1;
        } else if (scrollPosition.current <= 0) {
          scrollDirection.current = 1;
        }
      }, 100);
    }
    return () => clearInterval(interval);
  }, [loading, filteredCategories]);

  // ✅ Veg / Non-Veg Filter
  const filteredFoods = AllFoodsData.filter(item => {
    const foodType = Array.isArray(item?.food?.type)
      ? item.food.type.map(t => t.toLowerCase())
      : [String(item?.food?.type || '').toLowerCase()];

    if (isVeg === true) return foodType.includes('veg');
    if (isVeg === false)
      return foodType.includes('non-veg') || foodType.includes('nonveg');
    return true;
  });

  // Experiences list
  const experiences = [
    {
      id: 1,
      title: 'Delivery',
      img: require('../../assets/images/deliveryH.png'),
      redirection: 'HomeScreen',
    },
    {
      id: 2,
      title: 'Dine In',
      img: require('../../assets/images/dineH.png'),
      redirection: 'DineSection',
    },
    {
      id: 3,
      title: 'Takeaway',
      img: require('../../assets/images/takeawayH.png'),
      redirection: 'HomeScreen',
    },
  ];

  // Header UI
  const renderHeader = () => (
    <>
      <View style={styles.headerContainer}>
        <TouchableOpacity
          style={styles.locationContainer}
          onPress={() => setShowDropdown(!showDropdown)}>
          <Image
            source={require('../../assets/images/location.png')}
            style={styles.locationIcon}
          />
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={styles.locationText}>
              {selectedRestaurant?.name || 'Select Branch'}
            </Text>
            <Image
              source={require('../../assets/images/downarrow.png')}
              style={styles.dropdownIcon}
            />
          </View>
        </TouchableOpacity>

        <Image
          source={require('../../assets/images/project_logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      {showDropdown && (
        <View style={styles.dropdownList}>
          <ScrollView style={{ maxHeight: 200 }}>
            {restaurantsArray?.map((restaurant, index) => (
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
                <Text style={styles.dropdownText}>{restaurant.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Search + Cart */}
      <View style={styles.searchContainer}>
        <TouchableOpacity style={styles.searchBox} onPress={() => navigation.navigate("SearchScreen")}>
          <Image
            source={require('../../assets/images/search.png')}
            style={styles.searchIcon}
          />
          <Text style={styles.searchPlaceholder}>Search your favorite food</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.cartBtn}
          onPress={() => navigation.navigate('OderCartScreen')}>
          <Image
            source={require('../../assets/images/cart.png')}
            style={styles.cartIcon}
          />
          {totalCount > 0 && (
            <View style={styles.cartBadge}>
              <Text style={styles.cartCount}>{totalCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Veg / Non-Veg toggle */}
      <ToggleComponents />

      {/* Experiences */}
      <View style={styles.experienceContainer}>
        {experiences.map(item => (
          <TouchableOpacity
            key={item.id}
            style={[
              styles.experienceCard,
              selectedExperience === item.title && styles.activeExperience,
            ]}
            onPress={() => { 
              setSelectedExperience(item.title);
              navigation.navigate(item.redirection);
              dispatch(setExperience({ id: item.id, type: item.title }));
            }}>
            <Image source={item.img} style={styles.experienceImg} /> 
            <Text
              style={[
                styles.experienceText,
                selectedExperience === item.title && { color: '#fff' },
              ]}>
              {item.title}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Banners */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {loading
          ? [1, 2, 3].map(i => (
              <ShimmerPlaceholder key={i} style={styles.bannerShimmer} />
            ))
          : bannerlist?.map((banner, index) => (
              <LinearGradient
                key={index}
                colors={['#fce3ec', '#f8f8f8']}
                style={styles.bannerCard}>
                <Image
                  source={{ uri: banner?.fullImageUrl }}
                  style={styles.bannerImage}
                  resizeMode="cover"
                />
              </LinearGradient>
            ))}
      </ScrollView>

      {/* Categories Section with Auto-Scroll */}
      <SectionDivider title="Choose What You Like" />
      {loading ? (
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {[1, 2, 3, 4].map(i => (
            <ShimmerPlaceholder key={i} style={styles.categoryShimmer} />
          ))}
        </ScrollView>
      ) : (
        <Animated.ScrollView
          horizontal
          ref={categoryScrollRef}
          showsHorizontalScrollIndicator={false}
          scrollEventThrottle={16}>
          {filteredCategories?.map((item, index) => (
            <TouchableOpacity
              key={item._id  || index}
              style={styles.categoryCard}
              onPress={() =>
                navigation.navigate('CatItemScreen', {
                  categoryId: item._id,
                  categoryName: item.name,
                  categoryType: item.type,
                  categoryIngredients: item?.ingredients,
                  restaurantId: selectedRestaurant?._id,
                })
              }>
              <Image source={{ uri: item?.image }} style={styles.categoryImage} />
              <Text style={styles.categoryName}>{item?.name}</Text>
            </TouchableOpacity>
          ))}
        </Animated.ScrollView>
      )}

      <SectionDivider title="Top Picks" containerStyle={{ marginVertical: 10 }} />
    </>
  );

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.topPickCard}
      activeOpacity={0.8}
      onPress={() =>
        navigation.navigate('CatItemScreen', {
          categoryId: item?.food?._id,
          categoryName: item?.food?.name,
          categoryType: item?.food?.type,
          categoryIngredients: item?.food?.ingredients,
          restaurantId: selectedRestaurant?._id,
        })
      }>
      <View style={styles.topPickCircle}>
        <Image
          source={{ uri: item?.food?.image }}
          style={styles.topPickImage}
          resizeMode="cover"
        />
      </View>
      <Text style={styles.topPickTitle} numberOfLines={1}>
        {item?.food?.name}
      </Text>
    </TouchableOpacity>
  );

  return (
    <DashboardScreen scrollable={false}>
      <FlatList
        ref={flatListRef}
        data={filteredFoods.slice(0, 20)}
        keyExtractor={(item, index) => item?.food?._id || index.toString()}
        showsVerticalScrollIndicator={false}
        numColumns={3}
        ListHeaderComponent={renderHeader}
        renderItem={renderItem}
        contentContainerStyle={{
          paddingBottom: tabBarHeight + 100,
          backgroundColor: '#fff',
          // paddingHorizontal: 8,
        }}
        ListFooterComponent={
          <TouchableOpacity
            style={styles.exploreBtn}
            onPress={() => navigation.navigate('SearchScreen')}>
            <View style={styles.exploreContainer}>
              <View style={styles.line} />
              <Text style={styles.exploreText}>Explore More</Text>
              <View style={styles.line} />
            </View>
          </TouchableOpacity>
        }
      />
    </DashboardScreen>
  );
};

// ✅ Styles
const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
    elevation: 3,
  },
  locationContainer: { flexDirection: 'row', alignItems: 'center' },
  locationIcon: { width: 20, height: 20, tintColor: '#e63946', marginRight: 6 },
  locationText: { fontSize: 16, fontWeight: '600', color: '#333' },
  dropdownIcon: { width: 14, height: 14, marginLeft: 4, tintColor: '#555' },
  logo: { width: 90, height: 35 },
  dropdownList: {
    backgroundColor: '#fff',
    elevation: 5,
    borderRadius: 10,
    margin: 10,
    borderWidth: 1,
    borderColor: '#eee',
  },
  dropdownItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f1f1',
  },
  dropdownText: { fontSize: 14, color: '#333' },
  searchContainer: { flexDirection: 'row', margin: 20 },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 46,
   
  },
  searchIcon: { width: 20, height: 20, tintColor: '#888', marginRight: 8 },
  searchPlaceholder: { color: '#777', fontSize: 14 },
  cartBtn: {
    marginLeft: 10,
    width: 50,
    height: 46,
    borderRadius: 12,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartIcon: { width: 22, height: 22 },
  cartBadge: {
    position: 'absolute',
    top: 4,
    right: 6,
    backgroundColor: '#e63946',
    borderRadius: 8,
    paddingHorizontal: 5,
    minWidth: 16,
    alignItems: 'center',
  },
  cartCount: { color: '#fff', fontSize: 10, fontWeight: '700' },
  experienceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    // marginHorizontal: 12,
    marginVertical: 10,
  },
  experienceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 30,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#fff',
    // color:Theme.colors.black
  },
  activeExperience: { backgroundColor: '#e63946', borderColor: '#e63946', },
  experienceImg: { width: 22, height: 22 },
  experienceText: { marginLeft: 6, fontSize: 13, fontWeight: '500',color:Theme.colors.black },
  bannerShimmer: { width: 300, height: 130, borderRadius: 12, margin: 10 },
  bannerCard: { width: 300, height: 130, borderRadius: 12, margin: 10, overflow: 'hidden' },
  bannerImage: { width: '100%', height: '100%' },
  categoryCard: {
    width: 110,
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginRight: 12,
    elevation: 2,
    marginVertical:10
  },
  categoryImage: { width: 70, height: 70, borderRadius: 35 },
  categoryName: { marginTop: 8, fontSize: 13, fontWeight: '600', color: '#333' },
  categoryShimmer: { width: 100, height: 100, borderRadius: 10, margin: 10 },
  topPickCard: { alignItems: 'center', width: '32%', marginBottom: 20 ,gap:10},
  topPickCircle: {
    backgroundColor: '#fff',
    borderRadius: 70,
    width: 100,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
  },
  topPickImage: { width: 80, height: 80, borderRadius: 40 },
  topPickTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    marginTop: 8,
    width: '90%',
  },
  exploreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
    paddingVertical: 8,
    backgroundColor: '#fff5f5',
    borderRadius: 30,
    elevation: 3,
    marginHorizontal: 60,
  },
  line: { height: 1, flex: 1, backgroundColor: '#e63946', marginHorizontal: 10, opacity: 0.4 },
  exploreText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#e63946',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
});

export default HomeScreen;
