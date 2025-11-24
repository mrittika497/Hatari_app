// 🌟 HomeScreen.js — Ultra Beautiful + Auto-Scrolling Banners
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
  StatusBar,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import ShimmerPlaceholder from 'react-native-shimmer-placeholder';
import {useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {useBottomTabBarHeight} from '@react-navigation/bottom-tabs';
import {fetchRestaurants} from '../../redux/slice/AllRestaurantSlice';
import {fetchBanners} from '../../redux/slice/BannerSlice';
import {fetchAllFoodCat} from '../../redux/slice/foodCategorySlice';
import {fetchSubCategories} from '../../redux/slice/subCategoriSlice';
import DashboardScreen from '../../components/DashboardScreen';
import SectionDivider from '../../components/SectionDivider';
import HomeHeader from '../../components/Homeheader';
import HomeCatModal from '../../components/HomeCatModal';

const {width} = Dimensions.get('window');

const HomeScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const tabBarHeight = useBottomTabBarHeight();
  const {selectedRestaurant, experienceType} = useSelector(
    state => state.experience,
  );
  console.log(experienceType, '----------------------experienceTypej');

  const isVeg = useSelector(state => state.foodFilter.isVeg);
  const {bannerlist} = useSelector(state => state.banners);
  const {data} = useSelector(state => state.subCategories);
  const [modalVisible, setModalVisible] = useState(false);
  const [subCategoryData, setSubCategoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedExperience, setSelectedExperience] = useState(experienceType);
  const [foods, setFoods] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const scrollX = useRef(new Animated.Value(0)).current;
  const bannerScrollRef = useRef();

  // ✅ Auto-scroll banners every 3 seconds
  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (bannerlist?.length > 0) {
        index = (index + 1) % bannerlist.length;
        bannerScrollRef.current?.scrollTo({
          x: index * width,
          animated: true,
        });
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [bannerlist]);

  // ✅ Fetch data
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        await Promise.all([
          dispatch(fetchRestaurants()),
          dispatch(fetchBanners()),
          dispatch(fetchAllFoodCat()),
        ]);
        const res = await dispatch(
          fetchSubCategories({page: 1, limit: 10}),
        ).unwrap();
        if (res?.subcategories?.length > 0) setFoods(res.subcategories);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [dispatch]);

  // ✅ Load more (Explore More)
  const loadMoreFoods = async () => {
    if (!hasMore) return;
    const nextPage = page + 1;
    const res = await dispatch(
      fetchSubCategories({page: nextPage, limit: 10}),
    ).unwrap();
    if (res?.subcategories?.length > 0) {
      setFoods(prev => [...prev, ...res.subcategories]);
      setPage(nextPage);
      setHasMore(res.subcategories.length >= 10);
    } else {
      setHasMore(false);
    }
  };

  const filteredFoods = foods.filter(item => {
    const type = item?.type?.toLowerCase() || '';
    return isVeg
      ? type === 'veg'
      : type === 'non-veg' || type === 'nonveg' || type === '';
  });
  console.log(filteredFoods, '-------------------------filteredFoods');

  const categorieddata = [
        {
      id: 1,
      name: 'Chinese',
      image: require('../../assets/images/category/chinese.jpeg'),
      cuisineType: 'chinese',
    },
        {
      id: 2,
      name: 'Indian',
      image: require('../../assets/images/category/indian.jpeg'),
      cuisineType: 'indian',
    },
    {
      id: 3,
      name: 'Tandoori',
      image: require('../../assets/images/category/tandoori.jpeg'),
      cuisineType: 'tandoori',
    },


  ];

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

    const subCategories = {
    chinese: [
      { name: "Noodles" },
      { name: "Fried Rice" },
      { name: "Manchurian" },
      { name: "Spring Rolls" },
    ],

    indian: [
      { name: "North Indian" },
      { name: "South Indian" },
      { name: "Biryani" },
      { name: "Thali" },
    ],

    tandoori: [
      { name: "Tandoori Chicken" },
      { name: "Paneer Tikka" },
      { name: "Malai Tikka" },
      { name: "Seekh Kabab" },
    ],
  };

    const openModal = (item) => {
    const data = subCategories[item.cuisineType];
    setSubCategoryData(data);
    setModalVisible(true);
  };

  const onSelectSubCategory = (sub) => {
    alert("Selected: " + sub.name);
    setModalVisible(false);
  };

  const renderHeader = () => (
    <>
      {/* 🌐 Experience Buttons */}
      <View style={styles.expContainer}>
        {experiences.map(exp => (
          <TouchableOpacity
            key={exp.id}
            activeOpacity={0.8}
            onPress={() => setSelectedExperience(exp.title)}>
            <LinearGradient
              colors={
                selectedExperience === exp.title
                  ? ['#FF512F', '#DD2476']
                  : ['#ffffff', '#f3f3f3']
              }
              style={[
                styles.expButton,
                selectedExperience === exp.title && styles.expButtonActive,
              ]}>
              <Image
                source={exp.img}
                style={[
                  styles.expIcon,
                  selectedExperience === exp.title && {tintColor: '#fff'},
                ]}
              />
              <Text
                style={[
                  styles.expText,
                  selectedExperience === exp.title && {color: '#fff'},
                ]}>
                {exp.title}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        ))}
      </View>
      {/* <View style={styles.expContainer}>
  {experiences.map(exp => (
    <TouchableOpacity
      key={exp.id}
      activeOpacity={0.8}
      >

      <LinearGradient
        colors={
          experienceType === exp.title
            ? ["#FF512F", "#DD2476"]
            : ["#ffffff", "#f3f3f3"]
        }
        style={[
          styles.expButton,
          experienceType === exp.title && styles.expButtonActive,
        ]}>
        
        <Image
          source={exp.img}
          style={[
            styles.expIcon,
            experienceType === exp.title && { tintColor: "#fff" },
          ]}
        />

        <Text
          style={[
            styles.expText,
            experienceType === exp.title && { color: "#fff" },
          ]}>
          {exp.title}
        </Text>

      </LinearGradient>
    </TouchableOpacity>
  ))}
</View> */}

      {/* 🖼 Banners with auto-scroll */}
      {/* 🖼 Banners with auto-scroll */}
      <Animated.ScrollView
        style={{marginVertical: 10}}
        contentContainerStyle={{paddingHorizontal: 0}} // 👈 ADD THIS
        ref={bannerScrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={Animated.event(
          [{nativeEvent: {contentOffset: {x: scrollX}}}],
          {useNativeDriver: false},
        )}
        scrollEventThrottle={16}>
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
                  resizeMode="stretch"
                />
              </LinearGradient>
            ))}
      </Animated.ScrollView>

      {/* 🟢 Dots indicator */}
      <View style={styles.dotsContainer}>
        {bannerlist?.map((_, i) => {
          const opacity = scrollX.interpolate({
            inputRange: [(i - 1) * width, i * width, (i + 1) * width],
            outputRange: [0.3, 1, 0.3],
            extrapolate: 'clamp',
          });

          return <Animated.View key={i} style={[styles.dot, {opacity}]} />;
        })}
      </View>

      {/* 🍽 Categories */}
      <SectionDivider title="What would you like to have today?" />
    <View style={styles.categoryWrapper}>
  {categorieddata.map((item, index) => (
    <TouchableOpacity
      key={index}
      style={styles.categoryCard}
        onPress={() => openModal(item)}
      // onPress={() =>
      //   navigation.navigate("CatItemScreen", {
      //     categoryId: item.id,
      //     categoryName: item.name,
      //     cuisineType: item?.cuisineType,
      //   })
      // }
    >
      <LinearGradient
        colors={["#fd4b57ff", "#fefdfdff"]}
        style={styles.categoryCircle}
      >
        <Image source={item.image} style={styles.categoryImage} />
      </LinearGradient>

      <Text style={styles.categoryName}>{item.name}</Text>
    </TouchableOpacity>
  ))}
</View>

      <HomeCatModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        title="Choose Sub Category"
        data={subCategoryData}
        onSelect={onSelectSubCategory}
      />
      <SectionDivider
        title={
          isVeg === 'Veg'
            ? 'Top Veg Picks'
            : isVeg === 'Non-Veg'
            ? 'Top Non-Veg Picks'
            : 'Top Picks For You'
        }
      />
    </>
  );

  const renderItem = ({item}) => (
    <TouchableOpacity
      style={styles.foodCard}
      activeOpacity={0.9}
      onPress={() =>
        navigation.navigate('TopPicksScreen', {
          categoryId: item?._id,
          categoryName: item?.name,
          cuisineType: item?.cuisineType,
        })
      }>
      <Image source={{uri: item?.image}} style={styles.foodImage} />
      <View style={styles.foodInfo}>
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
      </View>
    </TouchableOpacity>
  );

  return (
    <>
      <HomeHeader />
 
      <DashboardScreen scrollable={false}>

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
              <TouchableOpacity
                style={styles.exploreBtn}
                onPress={loadMoreFoods}>
                <LinearGradient
                  colors={['#FF512F', '#DD2476']}
                  style={styles.exploreGradient}>
                  <Text style={styles.exploreText}>Explore More</Text>
                </LinearGradient>
              </TouchableOpacity>
            )
          }
        />
      </DashboardScreen>
    </>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  expContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 15,
   marginBottom:10,
  
  },
  expButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 40,
    elevation: 6,
  },
  expButtonActive: {
    shadowColor: '#FF512F',
    shadowOpacity: 0.4,
    shadowRadius: 8,
  },
  expIcon: {width: 24, height: 24, marginRight: 8, tintColor: '#333'},
  expText: {fontWeight: '700', fontSize: 15, color: '#333'},

  bannerCard: {
    width: width,
    height: 180,
    overflow: 'hidden',
    margin: 0, // 👈 MUST ADD
    padding: 0, // 👈 MUST ADD
  },

  bannerImage: {
    width: '95%',
    height: '100%',
  },
  bannerShimmer: {
    width: width, // 👈 FULL WIDTH
    height: 180,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 10,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF512F',
    marginHorizontal: 5,
  },
categoryScroll: {
  paddingHorizontal: 20,
 
},
categoryWrapper: {
  flexDirection: "row",
  justifyContent: "center",
  alignItems: "center",
  // gap: 20,
  marginVertical: 10,
},
categoryCard: {
  alignItems: "center",
  marginRight: 20,
},
  categoryScroll: {paddingHorizontal: 15, paddingVertical: 10},
  categoryCard: {alignItems: 'center', marginRight: 20},
 categoryCircle: {
  width: 90,
  height: 90,
  borderRadius: 45,
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: "#fff",
  borderWidth: 1,
  borderColor: "#eee",
},

categoryImage: {
  width: 55,
  height: 55,
  borderRadius: 30,
},
  categoryName: {fontSize: 14, color: '#333', fontWeight: '700', marginTop: 8},

  foodCard: {
    flex: 1,
    margin: 10,
    backgroundColor: '#fff',
    borderRadius: 18,
    elevation: 7,
    shadowColor: '#FF512F',
    shadowOpacity: 0.15,
    shadowRadius: 10,
    shadowOffset: {width: 0, height: 3},
  },
  foodImage: {
    width: '100%',
    height: 140,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
  },
  foodInfo: {padding: 12, alignItems: 'center'},
  foodTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#222',
    textAlign: 'center',
  },
  foodType: {fontSize: 12, fontWeight: '600', marginTop: 5},

  exploreBtn: {alignItems: 'center', marginVertical: 25},
  exploreGradient: {
    borderRadius: 30,
    paddingHorizontal: 50,
    paddingVertical: 14,
    elevation: 8,
    shadowColor: '#FF512F',
  },
  exploreText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
});
