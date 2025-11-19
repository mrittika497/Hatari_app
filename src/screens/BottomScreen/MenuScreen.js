// FULLY FIXED CatItemScreen.js

import React, {useEffect, useState, useRef} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  Dimensions,
  TouchableOpacity,
  Modal,
  Animated,
  Easing,
  ActivityIndicator,
  RefreshControl,
  TextInput,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import ShimmerPlaceHolder from 'react-native-shimmer-placeholder';
import LinearGradient from 'react-native-linear-gradient';
import DashboardScreen from '../../components/DashboardScreen';
import CustomHeader from '../../components/CustomHeader';

import {
  fetchFoodPagination,
  clearFoods,
} from '../../redux/slice/SearchFoodPaginationSlice';

import {addToCart} from '../../redux/slice/cartSlice';
import Theme from '../../assets/theme';

const {width} = Dimensions.get('window');

const CatItemScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const isVeg = useSelector(state => state.foodFilter.isVeg); // true / false / null
  const {AllFoodsData, loading, page, hasMore} = useSelector(
    state => state.FoodPagination,
  );
  const cartItems = useSelector(state => state.cart.items);

  const [selectedFood, setSelectedFood] = useState(null);
  const [selectedOption, setSelectedOption] = useState('half');
  const [totalPrice, setTotalPrice] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [modalVisible, setModalVisible] = useState(false);

  const [bottomBoxVisible, setBottomBoxVisible] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  // animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;
  const boxAnim = useRef(new Animated.Value(150)).current;

  // API filter
  const type = isVeg === null ? '' : isVeg ? 'veg' : 'non-veg';

  const loadFirstPage = () => {
    dispatch(clearFoods());
    dispatch(
      fetchFoodPagination({
        page: 1,
        limit: 12,
        type,
        search: searchText,
      }),
    );
  };

  useEffect(() => {
    loadFirstPage();

    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();
  }, [type, searchText]);

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      dispatch(
        fetchFoodPagination({
          page: page + 1,
          limit: 12,
          type,
          search: searchText,
        }),
      );
    }
  };

  // ---------------------------
  // FIXED PRICE CALCULATION
  // ---------------------------
  const updateTotal = qty => {
    if (!selectedFood) return;

    const info = selectedFood.priceInfo;

    if (info.hasVariation) {
      if (selectedOption === 'half') {
        setTotalPrice(info.halfPrice * qty);
      } else {
        setTotalPrice(info.fullPrice * qty);
      }
    } else {
      setTotalPrice(info.staticPrice * qty);
    }
  };

  // ---------------------------
  // FILTER: VEG & SEARCH
  // ---------------------------
  const filteredFoods = AllFoodsData.filter(item => {
    const food = item.food;
    if (!food) return false;

    let typeStr = String(food.type || '').toLowerCase();
    if (typeStr === 'nonveg') typeStr = 'non-veg';
    if (typeStr === 'vegetarian') typeStr = 'veg';

    if (isVeg === true && typeStr !== 'veg') return false;
    if (isVeg === false && typeStr !== 'non-veg') return false;

    if (
      searchText &&
      !food.name.toLowerCase().includes(searchText.toLowerCase())
    ) {
      return false;
    }

    return true;
  });

  const openModal = food => {
    setSelectedFood(food);
    setSelectedOption('half');
    setQuantity(1);

    // set initial price correctly
    if (food.priceInfo.hasVariation) {
      setTotalPrice(food.priceInfo.halfPrice);
    } else {
      setTotalPrice(food.priceInfo.staticPrice);
    }

    setModalVisible(true);

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
      duration: 200,
      useNativeDriver: true,
    }).start(() => setModalVisible(false));
  };

  const handleConfirmAdd = () => {
    dispatch(addToCart({...selectedFood, quantity, selectedOption}));

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

  const renderItem = ({item}) => {
    const food = item.food;

    return (
      <View style={styles.card}>
        <Image source={{uri: food.image}} style={styles.image} />

        <View style={styles.details}>
          <Text style={styles.cuisine}>{food.cuisineType}</Text>

          <View style={styles.row}>
            <View
              style={[
                styles.typeBox,
                {borderColor: food.type === 'veg' ? 'green' : 'red'},
              ]}>
              <View
                style={[
                  styles.typeDot,
                  {backgroundColor: food.type === 'veg' ? 'green' : 'red'},
                ]}
              />
            </View>

            <Text style={styles.name}>{food.name}</Text>
          </View>

          {food.priceInfo.hasVariation ? (
            <>
              <Text style={styles.priceText}>
                Half: ₹{food.priceInfo.halfPrice}
              </Text>
              <Text style={styles.priceText}>
                Full: ₹{food.priceInfo.fullPrice}
              </Text>
            </>
          ) : (
            <Text style={styles.priceText}>
              Price: ₹{food.priceInfo.staticPrice}
            </Text>
          )}

          <Text style={styles.rating}>★ {food.rating || '4.2'}</Text>
        </View>

        <TouchableOpacity style={styles.addBtn} onPress={() => openModal(food)}>
          <Text style={styles.addText}>Add</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <DashboardScreen scrollable={false}>
      <CustomHeader title="All Menu" />

      {/* Search Box */}
      <View style={styles.searchBox}>
        <TextInput
          placeholder="Search food..."
          placeholderTextColor="black"
          value={searchText}
          onChangeText={setSearchText}
          style={styles.searchInput}
        />
      </View>

      {/* FOOD LIST */}
      <Animated.View style={{flex: 1, opacity: fadeAnim}}>
        <FlatList
          data={filteredFoods}
          keyExtractor={(item, index) => String(index)}
          renderItem={renderItem}
          contentContainerStyle={{paddingBottom: 140}}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            loading && hasMore ? (
              <ActivityIndicator
                size="large"
                color="#FF4D4D"
                style={{marginBottom: 10}}
              />
            ) : null
          }
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={loadFirstPage} />
          }
        />
      </Animated.View>

      {/* ========================= MODAL ======================== */}
      <Modal transparent visible={modalVisible} animationType="none">
        <TouchableOpacity
          activeOpacity={1}
          onPress={closeModal}
          style={styles.modalOverlay}>
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

                    <Text style={styles.modalFoodName}>
                      {selectedFood?.cuisineType}
                    </Text>

                    {/* Variation Selection */}
                    {selectedFood?.priceInfo?.hasVariation ? (
                      <View style={{flexDirection: 'row', marginTop: 5}}>
                        {/* Half Button */}
                        <TouchableOpacity
                          style={[
                            styles.optionBtn,
                            selectedOption === 'half' && styles.selectedOption,
                          ]}
                          onPress={() => {
                            setSelectedOption('half');
                            setTotalPrice(
                              selectedFood.priceInfo.fullPrice * quantity,
                            );
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
                            selectedOption === 'full' && styles.selectedOption,
                          ]}
                          onPress={() => {
                            setSelectedOption('full');
                            setTotalPrice(
                              selectedFood.priceInfo.fullPrice * quantity,
                            );
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
                      <Text style={{color: '#000'}}>
                        Price: ₹{selectedFood.priceInfo.staticPrice}
                      </Text>
                    )}
                  </View>
                </View>
                <Text style={styles.modalFoodName}>
                  {selectedFood?.description}
                </Text>

                {/* Quantity Box */}
                <View style={styles.quantityBox}>
                  <TouchableOpacity
                    style={styles.qtyBtn}
                    onPress={() => {
                      if (quantity > 1) {
                        const newQty = quantity - 1;
                        setQuantity(newQty);
                        updateTotal(newQty);
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
                      updateTotal(newQty);
                    }}>
                    <Text style={styles.qtyText}>+</Text>
                  </TouchableOpacity>
                </View>

                {/* Footer */}
                <View style={styles.modalFooter}>
                  <Text style={styles.totalText}>Total: ₹{totalPrice}</Text>

                  <TouchableOpacity
                    style={styles.confirmBtn}
                    onPress={handleConfirmAdd}>
                    <Text style={styles.confirmBtnText}>Confirm Add</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </Animated.View>
        </TouchableOpacity>
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

            <TouchableOpacity style={styles.bottomBtn} onPress={handleGoToCart}>
              <Text style={styles.bottomBtnText}>Go to Cart</Text>
            </TouchableOpacity>
          </LinearGradient>
        </Animated.View>
      )}
    </DashboardScreen>
  );
};

export default CatItemScreen;

// ======================= STYLES =======================

const styles = StyleSheet.create({
  searchBox: {margin: 15},
  searchInput: {
    backgroundColor: '#f2dcdc',
    height: 40,
    paddingHorizontal: 15,
    borderRadius: 35,
    color: '#000',
  },

  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 12,
    elevation: 3,
    marginBottom: 14,
  },

  image: {width: 80, height: 80, borderRadius: 10},
  details: {flex: 1, marginLeft: 10},
  cuisine: {fontSize: 12, color: 'black'},
  name: {fontSize: 15, fontWeight: '600', color: 'black'},

  row: {flexDirection: 'row', alignItems: 'center', marginTop: 4},
  totalText: {fontSize: 16, fontWeight: 'bold', color: '#000'},
  qtyValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginHorizontal: 15,
  },
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
  },
  addText: {color: '#fff', fontWeight: '600'},

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
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
  modalImg: {width: 70, height: 70, borderRadius: 10},
  modalName: {fontSize: 17, fontWeight: '700'},
  modalCuisine: {fontSize: 14, color: '#555'},

  optionRow: {flexDirection: 'row', marginTop: 5},
  optionBtn: {
    paddingVertical: 6,
    paddingHorizontal: 10,
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

  staticPrice: {marginTop: 5, color: '#000', fontSize: 14},
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
  // qtyBtn: {
  //   width: 32,
  //   height: 32,
  //   borderRadius: 16,
  //   backgroundColor: '#fff',
  //   elevation: 3,
  //   alignItems: 'center',
  //   justifyContent: 'center',
  // },
  qtySign: {fontSize: 18, color: '#FF4D4D', fontWeight: 'bold'},
  qtyTextValue: {marginHorizontal: 15, fontSize: 16, fontWeight: 'bold'},

  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  total: {fontSize: 16, fontWeight: '700'},
  confirmBtn: {
    backgroundColor: '#FF4D4D',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
  },
  confirmTxt: {color: '#fff', fontSize: 15, fontWeight: '700'},

  bottomBox: {
    position: 'absolute',
    bottom: 60,
    width: '100%',
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
  bottomBtnText: {fontWeight: '700',color:"red"},
});
