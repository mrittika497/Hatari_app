// ✅ Full Working HomeScreen.js (Veg/Non-Veg Toggle + Swiggy Style)
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
  Dimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import ShimmerPlaceholder from 'react-native-shimmer-placeholder';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';

import DashboardScreen from '../../components/DashboardScreen';
import SectionDivider from '../../components/SectionDivider';
import HomeHeader from '../../components/Homeheader';

import { fetchRestaurants } from '../../redux/slice/AllRestaurantSlice';
import { fetchBanners } from '../../redux/slice/BannerSlice';
import { fetchAllFoodCat } from '../../redux/slice/foodCategorySlice';
import { fetchSubCategories } from '../../redux/slice/subCategoriSlice';
import { setFilter } from '../../redux/slice/toggleSlice';


const { width } = Dimensions.get('window');

const HomeScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const tabBarHeight = useBottomTabBarHeight();

  // Redux States
  const isVeg = useSelector(state => state.foodFilter.isVeg);
  const { bannerlist } = useSelector(state => state.banners);
  const { data } = useSelector(state => state.subCategories);
  const subcategories = data?.subcategories || [];

  // Local States
  const [loading, setLoading] = useState(true);
  const [selectedExperience, setSelectedExperience] = useState('Delivery');
  const categoryScrollRef = useRef(null);
  const scrollPosition = useRef(0);
  const scrollDirection = useRef(1);

  // Fetch Data
  useEffect(() => {
    const loadData = async () => {
      await Promise.all([
        dispatch(fetchRestaurants()),
        dispatch(fetchBanners()),
        dispatch(fetchAllFoodCat()),
        dispatch(fetchSubCategories()),
      ]);
      setTimeout(() => setLoading(false), 1200);
    };
    loadData();
  }, [dispatch]);

  // Auto-scroll animation for categories
  useEffect(() => {
    let interval;
    if (!loading && categoryScrollRef.current) {
      interval = setInterval(() => {
        scrollPosition.current += 2 * scrollDirection.current;
        categoryScrollRef.current.scrollTo({ x: scrollPosition.current, animated: true });
        if (scrollPosition.current > 250) scrollDirection.current = -1;
        else if (scrollPosition.current < 0) scrollDirection.current = 1;
      }, 100);
    }
    return () => clearInterval(interval);
  }, [loading]);

  // Category Dummy Data
  const categorieddata = [
    { id: 1, name: 'Tandoori', image: 'https://cdn-icons-png.flaticon.com/512/3075/3075977.png' },
    { id: 2, name: 'Indian', image: 'https://cdn-icons-png.flaticon.com/512/706/706164.png' },
    { id: 3, name: 'Chinese', image: 'https://cdn-icons-png.flaticon.com/512/2921/2921822.png' },
  ];


  

  const filteredFoods = subcategories.filter(item => {
    const name = item?.name?.toLowerCase() || '';
    const type = item?.type?.toLowerCase() || '';
    // const matchSearch = name.includes(search.toLowerCase());
    const matchVeg = isVeg ? type === 'veg' : type === 'non-veg' || type === 'nonveg' || type === '';
    return  matchVeg;
  });



  // ✅ Search filter
  // const searchedFoods = filteredFoods.filter(item =>
  //   item?.name?.toLowerCase().includes(search.toLowerCase()),
  // );
   

  // Experience Tabs
  const experiences = [
    { id: 1, title: 'Delivery', img: require('../../assets/images/deliveryH.png') },
    { id: 2, title: 'Takeaway', img: require('../../assets/images/takeawayH.png') },
  ];

  // Header UI
  const renderHeader = () => (
    <>
      {/* Experience Selector */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.experienceRow}>
        {experiences.map(exp => (
          <TouchableOpacity
            key={exp.id}
            style={[styles.expButton, selectedExperience === exp.title && styles.expActive]}
            onPress={() => setSelectedExperience(exp.title)}>
            <Image source={exp.img} style={styles.expIcon} />
            <Text
              style={[
                styles.expText,
                selectedExperience === exp.title && { color: '#fff' },
              ]}>
              {exp.title}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>


      {/* Banners */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {loading
          ? [1, 2, 3].map(i => <ShimmerPlaceholder key={i} style={styles.bannerShimmer} />)
          : bannerlist?.map((banner, index) => (
              <LinearGradient key={index} colors={['#fff', '#fff0f0']} style={styles.bannerCard}>
                <Image
                  source={{ uri: banner?.fullImageUrl }}
                  style={styles.bannerImage}
                  resizeMode="cover"
                />
              </LinearGradient>
            ))}
      </ScrollView>

      {/* Categories */}
      <SectionDivider title="What would you like to have today?" />
      {loading ? (
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {[1, 2, 3, 4].map(i => <ShimmerPlaceholder key={i} style={styles.categoryShimmer} />)}
        </ScrollView>
      ) : (
        <Animated.ScrollView horizontal ref={categoryScrollRef} showsHorizontalScrollIndicator={false}>
          {categorieddata.map((item, index) => (
            <TouchableOpacity
              key={item.id || index}
              style={styles.categoryCard}
              onPress={() =>
                navigation.navigate('CatItemScreen', {
                  categoryId: item.id,
                  categoryName: item.name,
                })
              }>
              <LinearGradient colors={['#fff', '#fef5f5']} style={styles.categoryCircle}>
                <Image source={{ uri: item.image }} style={styles.categoryImage} />
              </LinearGradient>
              <Text style={styles.categoryName}>{item.name}</Text>
            </TouchableOpacity>
          ))}
        </Animated.ScrollView>
      )}

      <SectionDivider title={isVeg === 'veg' ? 'Top Veg Picks' : isVeg === 'non-veg' ? 'Top Non-Veg Picks' : 'Top Picks For You'} />
    </>
  );

  // Food Item Card
  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.foodCard}
      activeOpacity={0.8}
      onPress={() =>
        navigation.navigate('CatItemScreen', {
          categoryId: item?._id,
          categoryName: item?.name,
        })
      }>
      <Image source={{ uri: item?.image }} style={styles.foodImage} />
      <Text style={styles.foodTitle} numberOfLines={1}>
        {item?.name}
      </Text>
      <Text
        style={[
          styles.foodType,
          (item?.type || '').toLowerCase() === 'veg'
            ? { color: 'green' }
            : { color: 'red' },
        ]}>
        {item?.type || 'Mix'}
      </Text>
    </TouchableOpacity>
  );

  return (
    <DashboardScreen scrollable={false}>
      <HomeHeader />
      <FlatList
        data={filteredFoods.slice(0, 20)}
        keyExtractor={(item, index) => item?._id || index.toString()}
        numColumns={2}
        ListHeaderComponent={renderHeader}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: tabBarHeight + 190 }}
        ListFooterComponent={
          <TouchableOpacity
            style={styles.exploreBtn}
            onPress={() => navigation.navigate('SearchScreen')}>
            <LinearGradient colors={['#ff5f6d', '#ffc371']} style={styles.exploreGradient}>
              <Text style={styles.exploreText}>Explore More</Text>
            </LinearGradient>
          </TouchableOpacity>
        }
      />
    </DashboardScreen>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  experienceRow: { alignSelf: 'center', marginBottom: 18, padding: 6 },
  expButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 25,
    paddingVertical: 6,
    paddingHorizontal: 15,
    marginRight: 12,
    elevation: 3,
  },
  expActive: { backgroundColor: '#ff5f6d' },
  expIcon: { width: 22, height: 22 },
  expText: { marginLeft: 8, fontWeight: '600', color: '#333' },

  filterRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 15,
  },
  filterBtn: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 20,
    marginHorizontal: 8,
    backgroundColor: '#fff',
  },
  filterText: { fontWeight: '600', color: '#333', fontSize: 13 },

  bannerCard: {
    width: width * 0.8,
    height: 150,
    borderRadius: 16,
    marginHorizontal: 10,
    overflow: 'hidden',
    elevation: 5,
  },
  bannerImage: { width: '100%', height: '100%' },
  bannerShimmer: { width: width * 0.8, height: 150, borderRadius: 16, marginHorizontal: 10 },

  categoryCard: { alignItems: 'center', marginHorizontal: 20 },
  categoryCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
  },
  categoryImage: { width: 55, height: 55, resizeMode: 'contain' },
  categoryName: { marginTop: 8, fontWeight: '600', fontSize: 13, color: '#333' },
  categoryShimmer: { width: 90, height: 90, borderRadius: 45, marginHorizontal: 10 },

  foodCard: {
    flex: 1,
    margin: 10,
    backgroundColor: '#fff',
    borderRadius: 14,
    elevation: 5,
    alignItems: 'center',
    padding: 10,
  },
  foodImage: { width: '100%', height: 120, borderRadius: 14 },
  foodTitle: { marginTop: 8, fontWeight: '600', color: '#333', fontSize: 13 },
  foodType: { fontSize: 12, fontWeight: '500', marginTop: 3 },

  exploreBtn: { alignItems: 'center', marginTop: 20 },
  exploreGradient: {
    borderRadius: 25,
    paddingHorizontal: 40,
    paddingVertical: 12,
  },
  exploreText: { color: '#fff', fontSize: 16, fontWeight: '700', textTransform: 'uppercase' },
});
