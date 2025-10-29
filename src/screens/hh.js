import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  FlatList,
  Animated,
  ActivityIndicator,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import ShimmerPlaceholder from 'react-native-shimmer-placeholder';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';

import SectionDivider from '../../components/SectionDivider';
import DashboardScreen from '../../components/DashboardScreen';
import { setExperience, setRestaurant } from '../../redux/slice/experienceSlice';
import Theme from '../../assets/theme';
import { fetchRestaurants } from '../../redux/slice/AllRestaurantSlice';
import { fetchBanners } from '../../redux/slice/BannerSlice';
import { fetchAllFoodCat } from '../../redux/slice/foodCategorySlice';
import { fetchFoodPagination } from '../../redux/slice/SearchFoodPaginationSlice';
import ToggleComponents from '../../components/ToggleComponents';

const HomeScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const tabBarHeight = useBottomTabBarHeight();

  // ✅ Redux states
  const cartItems = useSelector(state => state.cart.items || []);
  const totalCount = cartItems.length;
  const isVeg = useSelector(state => state.foodFilter.isVeg);
  const { experienceId, selectedRestaurant, experienceType } = useSelector(
    state => state.experience,
  );
  const [visibleCount, setVisibleCount] = useState(9)
  const restaurantsArray = useSelector(state => state.restaurants.list) || [];
  const bannerlist = useSelector(state => state.banners.bannerlist) || [];
  const { AllFoodsData = [], page = 1, hasMore = false } = useSelector(
    state => state.FoodPagination,
  );
  const { categories } = useSelector(state => state.foodCategory);
  const homeCategories = categories?.foods || [];

  // ✅ Local states
  const [loading, setLoading] = useState(true);
  const [selectedOutlet, setSelectedOutlet] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedExperience, setSelectedExperience] = useState(experienceType);

  const scrollX = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  // ✅ Auto-scroll for category list
  const startAutoScroll = useCallback(() => {
    if (!homeCategories?.length) return;

    const interval = setInterval(() => {
      setCurrentIndex(prevIndex => {
        const nextIndex =
          prevIndex + 1 < homeCategories.length ? prevIndex + 1 : 0;
        flatListRef.current?.scrollToOffset({
          offset: nextIndex * 120, // match categoryCard width + margin
          animated: true,
        });
        return nextIndex;
      });
    }, 2500);

    return () => clearInterval(interval);
  }, [homeCategories]);

  // ✅ Experience buttons data
  const experiences = [
    {
      id: 1,
      title: 'Delivery',
      img: require('../../assets/images/deliveryH.png'),
      redirection: 'HomeScreen',
      allowOrder: true,
    },
    {
      id: 2,
      title: 'Dine In',
      img: require('../../assets/images/dineH.png'),
      redirection: 'DineSection',
      allowOrder: false,
    },
    {
      id: 3,
      title: 'Takeaway',
      img: require('../../assets/images/takeawayH.png'),
      redirection: 'HomeScreen',
      allowOrder: true,
    },
  ];

  // ✅ Fetch data
  useEffect(() => {
    dispatch(fetchRestaurants());
    dispatch(fetchBanners());
    dispatch(fetchFoodPagination({ page: 1, limit: 10 }));
    dispatch(fetchAllFoodCat());

    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, [dispatch]);

  // ✅ Handle Pagination
  const handleLoadMore = () => {
    if (hasMore) {
      dispatch(fetchFoodPagination({ page: page + 1, limit: 100 }));
    }
  };

  return (
    <DashboardScreen scrollable={false}>
      {/* Header */}
      <View style={styles.headerContainer}>
        {/* Left - Location */}
        <TouchableOpacity
          style={styles.locationContainer}
          onPress={() => setShowDropdown(!showDropdown)}>
          <Image
            source={require('../../assets/images/location.png')}
            style={styles.locationIcon}
          />
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={styles.locationText}>
              {selectedOutlet || selectedRestaurant?.name || 'Select Branch'}
            </Text>
            <Image
              source={require('../../assets/images/downarrow.png')}
              style={styles.dropdownIcon}
            />
          </View>
        </TouchableOpacity>

        {/* Right - Logo */}
        <View style={styles.logoContainer}>
          <Image
            source={require('../../assets/images/project_logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>
      </View>

      {/* Dropdown */}
      {showDropdown && (
        <View style={styles.dropdownList}>
          <ScrollView style={{ maxHeight: 200 }}>
            {restaurantsArray.map((restaurant, index) => (
              <TouchableOpacity
                key={restaurant._id || index}
                style={styles.dropdownItem}
                onPress={() => {
                  setSelectedOutlet(restaurant.name);
                  setShowDropdown(false);
                  dispatch(setRestaurant(restaurant));
                  dispatch(
                    setExperience({
                      id: experienceId,
                      type: experienceType,
                      restaurant: restaurant,
                    }),
                  );
                }}>
                <Text style={styles.dropdownText}>{restaurant.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.container}
        contentContainerStyle={{ paddingBottom: tabBarHeight + 100 }}>
        {/* Search */}
        <View style={styles.searchContainer}>
          <TouchableOpacity style={styles.searchBox}>
            <Image
              source={require('../../assets/images/search.png')}
              style={styles.searchIcon}
            />
            <Text style={styles.searchPlaceholder}>
              Search your favorite food
            </Text>
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

        {/* Veg/Non-Veg Toggle */}
        <ToggleComponents />

        {/* Experience Tabs */}
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

        {/* Banner Section */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {loading ? (
            [1, 2, 3].map(i => (
              <ShimmerPlaceholder key={i} style={styles.bannerShimmer} />
            ))
          ) : bannerlist?.length > 0 ? (
            bannerlist.map((banner, index) => (
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
            ))
          ) : (
            <Text style={{ margin: 10 }}>No banners available</Text>
          )}
        </ScrollView>

        {/* Category Section */}
        <SectionDivider title="Choose What You Like" />
        {loading ? (
          <View style={styles.categoryShimmerRow}>
            {[1, 2, 3, 4].map(i => (
              <View key={i} style={styles.categoryShimmer} />
            ))}
          </View>
        ) : (
          <FlatList
            ref={flatListRef}
            horizontal
            showsHorizontalScrollIndicator={false}
            data={homeCategories}
            keyExtractor={item => item._id}
            renderItem={({ item }) => (
              <TouchableOpacity
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
                <Image
                  source={{ uri: item?.image }}
                  style={styles.categoryImage}
                />
                <Text style={styles.categoryName}>{item?.name}</Text>
              </TouchableOpacity>
            )}
            onContentSizeChange={() => startAutoScroll()}
          />
        )}

      {/* ✅ Top Picks Section with Explore More Pagination */}
<SectionDivider title="Top Picks" containerStyle={{ marginVertical: 10 }} />

{loading ? (
  <View style={styles.topPickGrid}>
    {[1, 2, 3, 4, 5, 6].map(i => (
      <ShimmerPlaceholder
        key={i}
        style={{
          width: '30%',
          height: 110,
          borderRadius: 70,
          marginBottom: 20,
        }}
      />
    ))}
  </View>
) : (
  <>
    <FlatList
      data={AllFoodsData.slice(0, visibleCount)}
      keyExtractor={(item, index) => item?.food?._id || index.toString()}
      numColumns={3}
      contentContainerStyle={{
        paddingHorizontal: 5,
        paddingBottom: 10,
      }}
      columnWrapperStyle={{ justifyContent: 'space-between' }}
      renderItem={({ item }) => (
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
          <Text
            style={styles.topPickTitle}
            numberOfLines={1}
            ellipsizeMode="tail">
            {item?.food?.name}
          </Text>
        </TouchableOpacity>
      )}
      ListFooterComponent={() =>
        visibleCount < AllFoodsData.length ? (
          <TouchableOpacity
            style={styles.exploreBtn}
            onPress={() => {
              // show more items locally first
              const newCount = visibleCount + 9;
              if (newCount <= AllFoodsData.length) {
                setVisibleCount(newCount);
              } else if (hasMore) {
                // fetch more from API
                dispatch(fetchFoodPagination({ page: page + 1, limit: 9 }));
              }
            }}>
          <View style={styles.exploreContainer}>
  <View style={styles.line} />
  <Text style={styles.exploreText}>Explore More</Text>
  <View style={styles.line} />
</View>

          </TouchableOpacity>
        ) : (
          <Text
            style={{
              textAlign: 'center',
              color: '#666',
              marginVertical: 10,
            }}>
            You’ve reached the end!
          </Text>
        )
      }
    />
  </>
)}

      </ScrollView>
    </DashboardScreen>
  );
};

// ✅ Styles
const styles = StyleSheet.create({
  container: { backgroundColor: '#fff' },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    maxWidth: '70%',
  },
  locationIcon: {
    width: 20,
    height: 20,
    marginRight: 6,
    tintColor: '#FF6B00',
  },
  locationText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  dropdownIcon: {
    width: 14,
    height: 14,
    marginLeft: 5,
    tintColor: '#555',
  },
  logoContainer: { alignItems: 'flex-end' },
  logo: { width: 90, height: 35, borderRadius: 8 },
  dropdownList: {
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 10,
    backgroundColor: '#fff',
    elevation: 4,
    marginBottom: 10,
  },
  dropdownItem: {
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  dropdownText: { fontSize: 14, color: '#333' },
  searchContainer: { flexDirection: 'row', marginTop: 10 },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f4f4f4',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 46,
  },
  searchIcon: { width: 20, height: 20, tintColor: '#888', marginRight: 8 },
  searchPlaceholder: { color: '#666', fontSize: 14 },
  cartBtn: {
    marginLeft: 10,
    width: 50,
    height: 46,
    borderRadius: 12,
    backgroundColor: '#f4f4f4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartIcon: { width: 22, height: 22 },
  cartBadge: {
    position: 'absolute',
    top: 4,
    right: 6,
    backgroundColor: '#e63946',
    borderRadius: 10,
    minWidth: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  cartCount: { color: '#fff', fontSize: 10, fontWeight: '700' },
  experienceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 15,
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
    elevation: 2,
  },
  activeExperience: {
    backgroundColor: '#e63946',
    borderColor: '#e63946',
    elevation: 5,
  },
  experienceImg: { width: 22, height: 22, resizeMode: 'contain' },
  experienceText: {
    marginLeft: 6,
    fontSize: 13,
    fontWeight: '500',
    color: Theme.colors.black,
  },
  bannerShimmer: {
    width: 300,
    height: 130,
    borderRadius: 12,
    marginRight: 10,
  },
  bannerCard: {
    width: 300,
    height: 130,
    borderRadius: 12,
    marginRight: 10,
    overflow: 'hidden',
  },
  bannerImage: { width: '100%', height: '100%' },
  categoryShimmerRow: { flexDirection: 'row', paddingVertical: 10 },
  categoryShimmer: {
    width: 80,
    height: 80,
    borderRadius: 50,
    marginRight: 15,
  },
  categoryCard: {
    width: 110,
    alignItems: 'center',
    marginRight: 10,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 10,
    elevation: 3,
    marginVertical:10
  },
  categoryImage: { width: 70, height: 70, borderRadius: 35 },
  categoryName: {
    marginTop: 8,
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
  topPickGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 5,
  },
  topPickCard: {
    alignItems: 'center',
    width: '30%',
    marginBottom: 20,
  },
  topPickCircle: {
    backgroundColor: '#fff',
    borderRadius: 70,
    width: 100,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: '#f2f2f2',
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
    marginVertical: 15,
  },
  line: {
    height: 1,
    flex: 1,
    backgroundColor: '#ddd',
    marginHorizontal: 10,
  },
  exploreText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#e63946',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
});

export default HomeScreen;
