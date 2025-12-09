// 🌟 HomeScreen.js — Clean, Fast & Beautiful
import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  Animated,
  Dimensions,
  Modal,
  TouchableWithoutFeedback,
  Easing,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import ShimmerPlaceholder from 'react-native-shimmer-placeholder';
import {useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {useBottomTabBarHeight} from '@react-navigation/bottom-tabs';

import {fetchRestaurants} from '../../redux/slice/AllRestaurantSlice';
import {fetchBanners} from '../../redux/slice/BannerSlice';
import {fetchAllFoodCat} from '../../redux/slice/foodCategorySlice';
import {fetchCategoryFoods} from '../../redux/slice/catItemSlice';

import DashboardScreen from '../../components/DashboardScreen';
import SectionDivider from '../../components/SectionDivider';
import HomeHeader from '../../components/Homeheader';
import HomeCatModal from '../../components/HomeCatModal';
import {addToCart} from '../../redux/slice/cartSlice';

const {width} = Dimensions.get('window');

const HomeScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const tabBarHeight = useBottomTabBarHeight();

  const isVeg = useSelector(state => state.foodFilter.isVeg);
  const {bannerlist} = useSelector(state => state.banners);

  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisibleTop, setModalVisibleTop] = useState(false);
  const [subCategoryData, setSubCategoryData] = useState([]);
  // console.log(subCategoryData, '-----------------subCategoryData');
  const cartItems = useSelector(s => s.cart.items || []);
  console.log(cartItems,"----------------------vcartItemss");
  
  const [loading, setLoading] = useState(true);
  const [selectedExperience, setSelectedExperience] = useState('Delivery');
  const [selectedOption, setSelectedOption] = useState('half');
  const [quantity, setQuantity] = useState(1);
  const [foods, setFoods] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const scrollX = useRef(new Animated.Value(0)).current;
  const bannerScrollRef = useRef();

  // animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;
  const boxAnim = useRef(new Animated.Value(150)).current;
  const [bottomBoxVisible, setBottomBoxVisible] = useState(false);
  const [selectedFood, setSelectedFood] = useState(null);
  const [totalPrice, setTotalPrice] = useState(0);
  // 🚀 Auto Scroll Banners
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

  // 🚀 Fetch Initial Data
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
          fetchCategoryFoods({
            page,
            limit: 10,
            isTrending: true,
            type: isVeg ? 'veg' : 'non-veg',
          }),
        ).unwrap();

        if (res?.data?.length > 0) {
          setFoods(res.data);
          setHasMore(res.data.length >= 10);
        } else {
          setHasMore(false);
        }
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [dispatch, isVeg, page]);

  // 🚀 Load More Trending Items
  const loadMoreFoods = async () => {
    if (!hasMore) return;

    const nextPage = page + 1;

    const res = await dispatch(
      fetchCategoryFoods({
        page: nextPage,
        limit: 10,
        isTrending: true,
        type: isVeg ? 'veg' : 'non-veg',
      }),
    ).unwrap();

    if (res?.data?.length > 0) {
      setFoods(prev => [...prev, ...res.data]);
      setPage(nextPage);
      setHasMore(res.data.length >= 10);
    } else {
      setHasMore(false);
    }
  };
  const computeUnitPrice = (food, option = 'half') => {
    const info = food?.priceInfo || {};
    if (info.hasVariation) {
      return option === 'half'
        ? Number(info.halfPrice || 0)
        : Number(info.fullPrice || 0);
    }
    return Number(info.staticPrice || 0);
  };

  const updateTotal = (qty = 1, option = selectedOption) => {
    if (!selectedFood) return;
    const unit = computeUnitPrice(selectedFood, option);
    setTotalPrice(unit * qty);
  };
  useEffect(() => {
    updateTotal(quantity, selectedOption);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quantity, selectedOption, selectedFood]);
  // 🚀 Veg / Non-Veg Filtering
  const filteredFoods = foods.filter(item => {
    const type = item?.type?.toLowerCase() || '';
    return isVeg ? type === 'veg' : type !== 'veg';
  });
  // const filteredFoods  = foods;
  // console.log(filteredFoods,'-----------------filteredFoods');

  // 🚀 Categories
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
      img: require('../../assets/images/takeaway.png'),
    },
  ];

  const openModal = cuisineType => {
    setSubCategoryData(cuisineType);
    setModalVisible(true);
  };

  const openModal2 = food => {
    setSelectedFood(food);
    setSelectedOption(food?.priceInfo?.hasVariation ? 'half' : 'full'); // default sensible option
    setQuantity(1);

    // set initial price correctly
    const initialUnit = computeUnitPrice(
      food,
      food?.priceInfo?.hasVariation ? 'half' : 'full',
    );
    setTotalPrice(initialUnit);

    setModalVisibleTop(true);

    Animated.timing(slideAnim, {
      toValue: 1,
      duration: 300,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  };

  const closeModal = () => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 180,
      useNativeDriver: true,
    }).start(() => {
      setModalVisibleTop(false);
      // reset selected food after close
      setSelectedFood(null);
    });
  };

  // const handleConfirmAdd = () => {
  //   if (!selectedFood) return;

  //   dispatch(addToCart({...selectedFood, quantity, selectedOption,totalPrice,}));

  //   closeModal();
  //   setBottomBoxVisible(true);

  //   Animated.timing(boxAnim, {
  //     toValue: 0,
  //     duration: 400,
  //     useNativeDriver: true,
  //   }).start();
  // };
const handleConfirmAdd = () => {
  if (!selectedFood) return;

  const priceInfo = selectedFood.priceInfo || {};

  // Compute final unit price
  const unitPrice = priceInfo.hasVariation
    ? selectedOption === "half"
      ? Number(priceInfo.halfPrice)
      : Number(priceInfo.fullPrice)
    : Number(priceInfo.staticPrice);
console.log(unitPrice,"-------------unitPrice");

  dispatch(
    addToCart({
      ...selectedFood,
      quantity,
      selectedOption,        // <<< VERY IMPORTANT
      hasVariation: priceInfo.hasVariation || false,
      halfPrice: Number(priceInfo.halfPrice || 0),
      fullPrice: Number(priceInfo.fullPrice || 0),
      staticPrice: Number(priceInfo.staticPrice || 0),
      unitPrice,             // <<< PRICE PER UNIT
      totalPrice: unitPrice * quantity,  // <<< FINAL PRICE
    }),
  );

  closeModal();
  setBottomBoxVisible(true);

  Animated.timing(boxAnim, {
    toValue: 0,
    duration: 400,
    useNativeDriver: true,
  }).start();
};


  const handleGoToCart = () => {
    Animated.timing(boxAnim, {
      toValue: 150,
      duration: 300,
      useNativeDriver: true,
    }).start(() => setBottomBoxVisible(false));

    navigation.navigate('OderCartScreen');
  };

  const renderHeader = () => (
    <>
      {/* Experience Selector */}
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
                  : ['#fff', '#f3f3f3']
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

      {/* Banners */}
      <Animated.ScrollView
        ref={bannerScrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        style={{marginVertical: 10}}
        onScroll={Animated.event(
          [{nativeEvent: {contentOffset: {x: scrollX}}}],
          {useNativeDriver: false},
        )}>
        {loading
          ? [1, 2, 3].map(i => (
              <ShimmerPlaceholder key={i} style={styles.bannerShimmer} />
            ))
          : bannerlist?.map((banner, i) => (
              <View key={i} style={styles.bannerCard}>
                <Image
                  source={{uri: banner?.fullImageUrl}}
                  style={styles.bannerImage}
                  resizeMode="stretch"
                />
              </View>
            ))}
      </Animated.ScrollView>

      {/* Dots */}
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

      {/* Categories */}
      <SectionDivider title="What would you like to have today?" />
      <View style={styles.categoryWrapper}>
        {categorieddata.map(item => (
          <TouchableOpacity
            key={item.id}
            style={styles.categoryCard}
            onPress={() => openModal(item.cuisineType)}>
            <LinearGradient
              colors={['#fd4b57ff', '#fefdfdff']}
              style={styles.categoryCircle}>
              <Image source={item.image} style={styles.categoryImage} />
            </LinearGradient>
            <Text style={styles.categoryName}>{item.name}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <HomeCatModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        title={subCategoryData}
        cuisineType={subCategoryData}
      />

      <SectionDivider title={isVeg ? 'Top Veg Picks' : 'Top Non-Veg Picks'} />
    </>
  );

  const renderItem = ({item}) => {
    console.log(item);
    const dataItem = item?.food || [];
    console.log(dataItem, '-----------------dataItem');

    return (
      <View style={styles.card}>
        <Image source={{uri: dataItem.image}} style={styles.image} />

        <View style={styles.details}>
          <Text style={styles.cuisine}>{dataItem.cuisineType || ''}</Text>

          <View style={styles.row}>
            <View
              style={[
                styles.typeBox,
                {
                  borderColor:
                    String(dataItem.type || '').toLowerCase() === 'veg'
                      ? 'green'
                      : 'red',
                },
              ]}>
              <View
                style={[
                  styles.typeDot,
                  {
                    backgroundColor:
                      String(dataItem.type || '').toLowerCase() === 'veg'
                        ? 'green'
                        : 'red',
                  },
                ]}
              />
            </View>

            <Text style={styles.name} numberOfLines={1}>
              {dataItem?.name}
            </Text>
          </View>

          {dataItem.priceInfo?.hasVariation ? (
            <>
              <Text style={styles.priceText}>
                Half: ₹{dataItem.priceInfo.halfPrice}
              </Text>
              <Text style={styles.priceText}>
                Full: ₹{dataItem.priceInfo.fullPrice}
              </Text>
            </>
          ) : (
            <Text style={styles.priceText}>
              Price: ₹{dataItem.priceInfo?.staticPrice}
            </Text>
          )}
        </View>

        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => openModal2(dataItem)}>
          <Text style={styles.addText}>Add</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <>
      <HomeHeader />
      <DashboardScreen scrollable={false}>
        <FlatList
          data={filteredFoods}
          keyExtractor={(item, index) => item?._id || index.toString()}
          renderItem={renderItem}
          ListHeaderComponent={renderHeader}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: tabBarHeight + 50,
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

        {/* ========================= MODAL ======================== */}
        <Modal transparent visible={modalVisibleTop} animationType="none">
          <TouchableWithoutFeedback onPress={closeModal}>
            <View style={styles.modalOverlay}>
              {/* prevent tap propagation to overlay by wrapping content in TouchableWithoutFeedback */}
              <TouchableWithoutFeedback
                /* empty to capture taps inside */ onPress={() => {}}>
                <Animated.View
                  style={[
                    styles.modalContent,
                    {
                      transform: [
                        {
                          translateY: slideAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: [300, 0],
                          }),
                        },
                      ],
                    },
                  ]}>
                  <View style={styles.modalHandle} />

                  {selectedFood && (
                    <>
                      {/* Food Header */}
                      <View style={styles.modalHeader}>
                        <Image
                          source={{uri: selectedFood.image}}
                          style={styles.modalImg}
                        />
                        <View style={{flex: 1, marginLeft: 10}}>
                          <Text style={styles.modalFoodName}>
                            {selectedFood.name}
                          </Text>
                          <Text style={styles.modalCuisine}>
                            {selectedFood?.cuisineType}
                          </Text>

                          {/* Variation Selection */}
                          {selectedFood?.priceInfo?.hasVariation ? (
                            <View style={{flexDirection: 'row', marginTop: 8}}>
                              {/* Half Button */}
                              <TouchableOpacity
                                style={[
                                  styles.optionBtn,
                                  selectedOption === 'half' &&
                                    styles.selectedOption,
                                ]}
                                onPress={() => {
                                  setSelectedOption('half');
                                  // update total will run via effect
                                }}>
                                <Text
                                  style={[
                                    styles.optionText,
                                    selectedOption === 'half' &&
                                      styles.optionTextSelected,
                                  ]}>
                                  Half – ₹{selectedFood.priceInfo.halfPrice}
                                </Text>
                              </TouchableOpacity>

                              {/* Full Button */}
                              <TouchableOpacity
                                style={[
                                  styles.optionBtn,
                                  selectedOption === 'full' &&
                                    styles.selectedOption,
                                ]}
                                onPress={() => {
                                  setSelectedOption('full');
                                  // update total will run via effect
                                }}>
                                <Text
                                  style={[
                                    styles.optionText,
                                    selectedOption === 'full' &&
                                      styles.optionTextSelected,
                                  ]}>
                                  Full – ₹{selectedFood.priceInfo.fullPrice}
                                </Text>
                              </TouchableOpacity>
                            </View>
                          ) : (
                            <Text style={styles.staticPrice}>
                              Price: ₹{selectedFood.priceInfo.staticPrice}
                            </Text>
                          )}
                        </View>
                      </View>

                      {selectedFood?.description ? (
                        <Text style={styles.modalDescription}>
                          {selectedFood.description}
                        </Text>
                      ) : null}

                      {/* Quantity Box */}
                      <View style={styles.quantityBox}>
                        <TouchableOpacity
                          style={styles.qtyBtn}
                          onPress={() => {
                            if (quantity > 1) {
                              const newQty = quantity - 1;
                              setQuantity(newQty);
                            }
                          }}>
                          <Text style={styles.qtyText}>-</Text>
                        </TouchableOpacity>

                        <Text style={styles.qtyValue}>{quantity}</Text>

                        <TouchableOpacity
                          style={styles.qtyBtn}
                          onPress={() => {
                            const newQty = quantity + 1;
                            setQuantity(newQty);
                          }}>
                          <Text style={styles.qtyText}>+</Text>
                        </TouchableOpacity>
                      </View>

                      {/* Footer */}
                      <View style={styles.modalFooter}>
                        <Text style={styles.totalPrice}>
                          Total: ₹{totalPrice}
                        </Text>

                        <TouchableOpacity
                          style={styles.confirmBtn}
                          onPress={handleConfirmAdd}>
                          <Text style={styles.confirmBtnText}>Confirm Add</Text>
                        </TouchableOpacity>
                      </View>
                    </>
                  )}
                </Animated.View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>

        {/* ========================= ADDED TO CART BOX ========================= */}
        {bottomBoxVisible && (
          <Animated.View
            style={[
              styles.bottomBox,
              {
                transform: [
                  {
                    translateY: boxAnim.interpolate({
                      inputRange: [0, 150],
                      outputRange: [0, 150],
                    }),
                  },
                ],
              },
            ]}>
            <LinearGradient
              colors={['#ff4d4d', '#ff6f61', '#ff8a65']}
              style={styles.bottomGradient}>
              <Text style={styles.bottomMsg}>
                ✓ Item added successfully ({cartItems.length} in cart)
              </Text>

              <TouchableOpacity
                style={styles.bottomBtn}
                onPress={handleGoToCart}>
                <Text style={styles.bottomBtnText}>Go to Cart</Text>
              </TouchableOpacity>
            </LinearGradient>
          </Animated.View>
        )}
      </DashboardScreen>
    </>
  );
};

export default HomeScreen;

/* ------------------------------ STYLES ------------------------------ */
const styles = StyleSheet.create({
  expContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 15,
    marginBottom: 10,
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
  card: {
    flexDirection: 'row',
    backgroundColor: '#f9f9f9',
    borderRadius: 15,
    padding: 10,
    marginBottom: 15,
    alignItems: 'center',
    elevation: 3,
  },

  image: {width: 80, height: 80, borderRadius: 10, backgroundColor: '#eee'},
  details: {flex: 1, marginLeft: 10},
  cuisine: {fontSize: 12, color: 'black'},
  name: {fontSize: 15, fontWeight: '600', color: 'black', width: '90%'},

  row: {flexDirection: 'row', alignItems: 'center', marginTop: 4},
  totalText: {fontSize: 16, fontWeight: 'bold', color: '#eb2626ff'},
  totalPrice: {fontSize: 16, fontWeight: 'bold', color: '#0e0d0dff'},
  expIcon: {width: 24, height: 24, marginRight: 8},
  expText: {fontWeight: '700', fontSize: 15},
  selectedOption: {
    backgroundColor: '#FF4D4D',
    borderColor: '#FF4D4D',
  },
  optionTextSelected: {color: '#fff', fontWeight: '700'},
  qtyText: {fontSize: 18, fontWeight: 'bold', color: '#FF4D4D'},
  typeBox: {
    width: 14,
    height: 14,
    borderWidth: 1,
    marginRight: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  typeDot: {width: 7, height: 7, borderRadius: 7},

  priceText: {color: '#000', marginTop: 4, fontSize: 13},
  rating: {
    marginTop: 4,
    backgroundColor: 'green',
    color: '#fff',
    paddingHorizontal: 8,
    borderRadius: 10,
    fontSize: 10,
    alignSelf: 'flex-start',
  },

  addBtn: {
    backgroundColor: '#FF4D4D',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    alignSelf: 'center',
    marginLeft: 8,
  },
  addText: {color: '#fff', fontWeight: '600'},
  bannerCard: {
    width: width,
    height: 180,
    alignItems: 'center',
  },
  bannerImage: {
    width: '95%',
    height: '100%',
    borderRadius: 10,
  },
  bannerShimmer: {
    width: width,
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

  categoryWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 10,
  },
  categoryCard: {
    alignItems: 'center',
    marginRight: 20,
  },
  categoryCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#eee',
  },
  categoryImage: {
    width: 55,
    height: 55,
    borderRadius: 30,
  },
  categoryName: {
    fontSize: 14,
    color: '#333',
    fontWeight: '700',
    marginTop: 8,
  },

  exploreBtn: {
    alignItems: 'center',
    marginVertical: 25,
  },
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
  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  modalFoodName: {fontSize: 16, fontWeight: 'bold', color: '#000'},
  modalFoodPrice: {fontSize: 14, color: '#777', marginTop: 4},
  modalHandle: {
    width: 50,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#ccc',
    alignSelf: 'center',
    marginBottom: 10,
  },
  modalBox: {
    backgroundColor: '#fff',
    padding: 20,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
  },
  modalHeader: {flexDirection: 'row'},
  modalImg: {width: 70, height: 70, borderRadius: 10, backgroundColor: '#eee'},
  modalName: {fontSize: 17, fontWeight: '700'},
  modalCuisine: {fontSize: 14, color: '#555'},
  modalDescription: {marginTop: 10, color: '#444'},

  optionRow: {flexDirection: 'row', marginTop: 5},
  optionBtn: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderRadius: 8,
    marginRight: 10,
  },
  optionSelected: {
    backgroundColor: '#e82b2b',
    borderColor: '#ff6600',
  },
  optionText: {color: '#000'},
  optionTextSel: {color: '#fff', fontWeight: 'bold'},

  // staticPrice: { marginTop: 5, color: "#000", fontSize: 14 },
  staticPrice: {
    fontSize: 16,
    color: '#222222',
    fontWeight: '700',
    marginBottom: 10,
  },
  quantityBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F1F1F1',
    borderRadius: 25,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginVertical: 10,
  },

  qtyBtn: {
    width: 35,
    height: 35,
    borderRadius: 20,
    backgroundColor: '#eee',
    justifyContent: 'center',
    alignItems: 'center',
  },
  qtySign: {fontSize: 18, color: '#FF4D4D', fontWeight: 'bold'},
  qtyTextValue: {marginHorizontal: 15, fontSize: 16, fontWeight: 'bold'},

  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalText: {fontSize: 16, fontWeight: '700'},
  confirmBtn: {
    backgroundColor: '#FF4D4D',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
  },
  confirmBtnText: {color: '#fff', fontSize: 15, fontWeight: '700'},
  bottomBox: {
    position: 'absolute',
    bottom: 60,
    width: '100%',
    paddingHorizontal: 16,
  },
  bottomGradient: {padding: 15, borderRadius: 20},
  bottomMsg: {color: '#fff', textAlign: 'center', marginBottom: 10},
  bottomBtn: {
    backgroundColor: '#fff',
    paddingVertical: 8,
    paddingHorizontal: 30,
    borderRadius: 20,
    alignSelf: 'center',
  },
  bottomBtnText: {fontWeight: '700', color: 'red'},
});
