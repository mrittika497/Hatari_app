import React, {useState, useEffect, useRef} from 'react';
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
import {useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {useBottomTabBarHeight} from '@react-navigation/bottom-tabs';

import DashboardScreen from '../../components/DashboardScreen';
import SectionDivider from '../../components/SectionDivider';
import HomeHeader from '../../components/Homeheader';

import {fetchRestaurants} from '../../redux/slice/AllRestaurantSlice';
import {fetchBanners} from '../../redux/slice/BannerSlice';
import {fetchAllFoodCat} from '../../redux/slice/foodCategorySlice';
import {fetchSubCategories} from '../../redux/slice/subCategoriSlice';

const {width} = Dimensions.get('window');

const HomeScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const tabBarHeight = useBottomTabBarHeight();

  // Redux states
  const isVeg = useSelector(state => state.foodFilter.isVeg);
  const {bannerlist} = useSelector(state => state.banners);
  const {data} = useSelector(state => state.subCategories);

  const subcategories = data?.subcategories || [];

  // Local states
  const [loading, setLoading] = useState(true);

  const [selectedExperience, setSelectedExperience] = useState('Delivery');
  const [visibleCount, setVisibleCount] = useState(8);
  console.log(visibleCount,"-----------------visibleCount");
  
  const categoryScrollRef = useRef(null);
  const scrollPosition = useRef(0);
  const scrollDirection = useRef(1);
  const [foods, setFoods] = useState([]);
  console.log(foods,"-------------------foods");
  
  const [page, setPage] = useState(1);
  console.log(page,"------------------page");
  
  const [hasMore, setHasMore] = useState(true);
  console.log(hasMore);
  
  // ✅ Fetch initial data
useEffect(() => {
  const loadData = async () => {
    try {
      setLoading(true);

      // ✅ Fetch all essential data in parallel
      await Promise.all([
        dispatch(fetchRestaurants()),
        dispatch(fetchBanners()),
        dispatch(fetchAllFoodCat()),
      ]);

      // ✅ Fetch first page of subcategories
      const res = await dispatch(fetchSubCategories({ page: 1, limit: 10 })).unwrap();

      if (res?.subcategories?.length > 0) {
        setFoods(res.subcategories);
        setPage(1);
      }

    } catch (error) {
      console.error('❌ Initial Data Load Error:', error);
    } finally {
      setLoading(false);
    }
  };

  loadData();
}, [dispatch]);


const loadMoreFoods = async () => {
  if (!hasMore) return;
  const nextPage = page + 1;
  try {
    const res = await dispatch(fetchSubCategories({ page: nextPage, limit: 10 })).unwrap();

    if (res?.subcategories?.length > 0) {
      setFoods(prev => [...prev, ...res.subcategories]);
      setPage(nextPage);

      // ✅ Correct logic for checking remaining data
      if (res.subcategories.length < 10) {
        setHasMore(false); // no more data
      } else {
        setHasMore(true); // keep showing "Explore More"
      }
    } else {
      setHasMore(false); // no data returned
    }
  } catch (err) {
    console.error('Pagination error:', err);
  }
};


// ✅ Explore More click
const handleExploreMore = async () => {
  await loadMoreFoods();
};

  // ✅ Initial load sync
  useEffect(() => {
    if (subcategories?.length > 0) {
      setFoods(subcategories);
    }
  }, [subcategories]);

  // ✅ Auto-scroll categories animation
  useEffect(() => {
    let interval;
    if (!loading && categoryScrollRef.current) {
      interval = setInterval(() => {
        scrollPosition.current += 2 * scrollDirection.current;
        categoryScrollRef.current.scrollTo({
          x: scrollPosition.current,
          animated: true,
        });
        if (scrollPosition.current > 250) scrollDirection.current = -1;
        else if (scrollPosition.current < 0) scrollDirection.current = 1;
      }, 100);
    }
    return () => clearInterval(interval);
  }, [loading]);

  // ✅ Categories
  const categorieddata = [
    {
      id: 1,
      name: 'Tandoori',
      image: require('../../assets/images/category/tandoori.jpeg'),
      type: 'tandoori',
    },
    {
      id: 2,
      name: 'Indian',
      image: require('../../assets/images/category/indian.jpeg'),
      type: 'indian',
    },
    {
      id: 3,
      name: 'Chinese',
      image: require('../../assets/images/category/chinese.jpeg'),
      type: 'chinese',
    },
  ];

  // // ✅ Filter logic for Veg / Non-Veg
  const filteredFoods = foods.filter(item => {
    const type = item?.type?.toLowerCase() || '';
    return isVeg ? type === 'veg' : type === 'non-veg' || type === 'nonveg' || type === '';
  });


  // ✅ Filter logic
// const filteredFoods = foods.filter(item => {
//   const type = item?.type?.toLowerCase() || '';
//   return isVeg === 'veg'
//     ? type === 'veg'
//     : isVeg === 'non-veg'
//     ? type === 'non-veg' || type === 'nonveg'
//     : true;
// });
  console.log(filteredFoods,"------------filteredFoods");
  

  // ✅ Experience Tabs
  const experiences = [
    {
      id: 1,
      title: 'Delivery',
      img: require('../../assets/images/deliveryH.png'),
    },
    {
      id: 2,
      title: 'Takeaway',
      img: require('../../assets/images/takeawayH.png'),
    },
  ];

  // ✅ Header
  const renderHeader = () => (
    <>
      {/* Experience Selector */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.experienceRow}>
        {experiences.map(exp => (
          <TouchableOpacity
            key={exp.id}
            style={[
              styles.expButton,
              selectedExperience === exp.title && styles.expActive,
            ]}
            onPress={() => setSelectedExperience(exp.title)}>
            <Image source={exp.img} style={styles.expIcon} />
            <Text
              style={[
                styles.expText,
                selectedExperience === exp.title && {color: '#fff'},
              ]}>
              {exp.title}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Banners */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {loading
          ? [1, 2, 3].map(i => (
              <ShimmerPlaceholder key={i} style={styles.bannerShimmer} />
            ))
          : bannerlist?.map((banner, index) => (
              <LinearGradient
                key={index}
                colors={['#fff', '#fff0f0']}
                style={styles.bannerCard}>
                <Image
                  source={{uri: banner?.fullImageUrl}}
                  style={styles.bannerImage}
                  resizeMode="cover"
                />
              </LinearGradient>
            ))}
      </ScrollView>

{/* 🍽 Categories Section */}
<SectionDivider title="What would you like to have today?" />

{loading ? (
  <ScrollView
    horizontal
    showsHorizontalScrollIndicator={false}
    contentContainerStyle={{ paddingHorizontal: 10 }}>
    {[1, 2, 3].map(i => (
      <ShimmerPlaceholder
        key={i}
        style={styles.categoryShimmer}
        shimmerStyle={{ borderRadius: 50 }}
      />
    ))}
  </ScrollView>
) : (
  <ScrollView
    horizontal
    ref={categoryScrollRef}
    showsHorizontalScrollIndicator={false}
    contentContainerStyle={{ paddingHorizontal: 15 }}>
    {categorieddata && categorieddata.length > 0 ? (
      categorieddata.map((item, index) => (
        <TouchableOpacity
          key={item.id || item._id || index}
          style={styles.categoryCard}
          onPress={() =>
            navigation.navigate('CatItemScreen', {
              categoryId: item.id || item._id,
              categoryName: item.name,
              categoryType: item.type,
            })
          }>
          <LinearGradient
            colors={['#ffffff', '#fff4f4']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.categoryCircle}>
        <Image source={item.image} style={styles.categoryImage} />
          </LinearGradient>
          <Text style={styles.categoryName} numberOfLines={1}>
            {item.name}
          </Text>
        </TouchableOpacity>
      ))
    ) : (
      <Text style={styles.noCategoryText}>No categories available</Text>
    )}
  </ScrollView>
)}


      <SectionDivider
        title={
          isVeg === 'veg'
            ? 'Top Veg Picks'
            : isVeg === 'non-veg'
            ? 'Top Non-Veg Picks'
            : 'Top Picks For You'
        }
      />
    </>
  );

  // ✅ Food Item Card
  const renderItem = ({item}) => (
    <TouchableOpacity
      style={styles.foodCard}
      activeOpacity={0.8}
      onPress={() =>
        navigation.navigate('CatItemScreen', {
          categoryId: item?._id,
          categoryName: item?.name,
        })
      }>
      <Image source={{uri: item?.image}} style={styles.foodImage} />
      <Text style={styles.foodTitle} numberOfLines={1}>
        {item?.name}
      </Text>
      <Text
        style={[
          styles.foodType,
          (item?.type || '').toLowerCase() === 'veg'
            ? {color: 'green'}
            : {color: 'red'},
        ]}>
        {item?.type || 'Mix'}
      </Text>
    </TouchableOpacity>
  );

  return (
    <DashboardScreen scrollable={false}>
      <HomeHeader />
    <FlatList
  data={filteredFoods}
  keyExtractor={(item, index) => item?._id || index.toString()}
  numColumns={2}
  ListHeaderComponent={renderHeader}
  renderItem={renderItem}
  showsVerticalScrollIndicator={false}
  contentContainerStyle={{
    paddingBottom: tabBarHeight + 200,
    paddingHorizontal: 10,
  }}
  ListFooterComponent={
    hasMore && (
      <TouchableOpacity style={styles.exploreBtn} onPress={handleExploreMore}>
        <LinearGradient colors={['#ff5f6d', '#ffc371']} style={styles.exploreGradient}>
          <Text style={styles.exploreText}>Explore More</Text>
        </LinearGradient>
      </TouchableOpacity>
    )
  }
  ListFooterComponentStyle={{
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 40,
  }}
/>

    </DashboardScreen>
  );
};

export default HomeScreen;

// --------------------- STYLES ---------------------
const styles = StyleSheet.create({
  experienceRow: {alignSelf: 'center', marginBottom: 18, padding: 6},
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
  expActive: {backgroundColor: '#ff5f6d'},
  expIcon: {width: 22, height: 22},
  expText: {marginLeft: 8, fontWeight: '600', color: '#333'},

  bannerCard: {
    width: width * 0.8,
    height: 150,
    borderRadius: 16,
    marginHorizontal: 10,
    overflow: 'hidden',
    elevation: 5,
  },
  bannerImage: {width: '100%', height: '100%'},
  bannerShimmer: {
    width: width * 0.8,
    height: 150,
    borderRadius: 16,
    marginHorizontal: 10,
  },

categoryCard: {
  alignItems: 'center',
  marginRight: 18,
  width: 80,
},

categoryCircle: {
  width: 70,
  height: 70,
  borderRadius: 35,
  justifyContent: 'center',
  alignItems: 'center',
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.15,
  shadowRadius: 2,
  elevation: 3,
},

categoryImage: {
  width: 60,
  height: 60,
  borderRadius: 30,
},

categoryName: {
  fontSize: 12,
  color: '#333',
  textAlign: 'center',
  marginTop: 5,
  width: 70,
  fontWeight: '500',
},

categoryShimmer: {
  width: 70,
  height: 70,
  borderRadius: 35,
  marginRight: 18,
  backgroundColor: '#eee',
},

noCategoryText: {
  fontSize: 14,
  color: '#999',
  alignSelf: 'center',
  marginVertical: 10,
},


  foodCard: {
    flex: 1,
    margin: 10,
    backgroundColor: '#fff',
    borderRadius: 14,
    elevation: 5,
    alignItems: 'center',
    padding: 10,
  },
  foodImage: {width: '100%', height: 120, borderRadius: 14},
  foodTitle: {marginTop: 8, fontWeight: '600', color: '#333', fontSize: 13},
  foodType: {fontSize: 12, fontWeight: '500', marginTop: 3},

  exploreBtn: {alignItems: 'center', marginTop: 20},
  exploreGradient: {
    borderRadius: 25,
    paddingHorizontal: 40,
    paddingVertical: 12,
  },
  exploreText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
});
