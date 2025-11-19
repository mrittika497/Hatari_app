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
} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import ShimmerPlaceHolder from 'react-native-shimmer-placeholder';
import LinearGradient from 'react-native-linear-gradient';
import DashboardScreen from '../components/DashboardScreen';
import CustomHeader from '../components/CustomHeader';
import {fetchCategoryFoodsBySubcat} from '../redux/slice/TopPickerSlice';
import {addToCart} from '../redux/slice/cartSlice';
import Theme from '../assets/theme';

const {width} = Dimensions.get('window');

const TopPicksScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const route = useRoute();

  const isVeg = useSelector(state => state.foodFilter.isVeg);
  const {
    categoryId,
    categoryName,
    restaurantId,
    categoryIngredients,
    cuisineType,
  } = route.params;

  const {
    data: categoryFoods,
    loading,
    page,
    hasMore,
  } = useSelector(state => state.catItemsbySubcat);

  const cartItems = useSelector(state => state.cart.items);
  console.log(cartItems,"----------------------cartItems");
  

  const [selectedFood, setSelectedFood] = useState(null);
  const [quantity, setQuantity] = useState(1);
    const [totalPrice, setTotalPrice] = useState(0);
    console.log(totalPrice,"--------------totalPrice");
    
  
    const [selectedOption, setSelectedOption] = useState('half');

  const [modalVisible, setModalVisible] = useState(false);
  const [bottomBoxVisible, setBottomBoxVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const slideAnim = useRef(new Animated.Value(0)).current;
  const boxAnim = useRef(new Animated.Value(150)).current;

  // Fetch foods on mount
  useEffect(() => {
    dispatch(
      fetchCategoryFoodsBySubcat({
        subCategoryId: categoryId,
        categoryIngredients,
        restaurantId,
        cuisineType,
        page: 1,
      }),
    );
  }, [dispatch, categoryId, cuisineType, restaurantId]);

  // Pagination
  const handleLoadMore = () => {
    if (!loading && hasMore) {
      dispatch(
        fetchCategoryFoodsBySubcat({
          subCategoryId: categoryId,
          categoryIngredients,
          restaurantId,
          cuisineType,
          page: page + 1,
        }),
      );
    }
  };

  // Pull-to-refresh
  const onRefresh = async () => {
    setRefreshing(true);
    await dispatch(
      fetchCategoryFoodsBySubcat({
        subCategoryId: categoryId,
        categoryIngredients,
        restaurantId,
        cuisineType,
        page: 1,
      }),
    );
    setRefreshing(false);
  };

  // Filter based on Veg/Non-Veg
  const filteredFoods = categoryFoods.filter(food => {
    const type = String(food.type || '').toLowerCase();
    if (isVeg === true) return type.includes('veg') && !type.includes('non');
    if (isVeg === false) return type.includes('non');
    return true;
  });

  const updateTotal = (qty = quantity, option = selectedOption) => {
  if (!selectedFood || !selectedFood.priceInfo) return;

  const priceInfo = selectedFood.priceInfo;

  if (priceInfo.hasVariation) {
    if (option === "half") {
      setTotalPrice(priceInfo.halfPrice * qty);
    } else if (option === "full") {
      setTotalPrice(priceInfo.fullPrice * qty);
    }
  } else {
    setTotalPrice(priceInfo.staticPrice * qty);
  }
};

  // Modal animations
const openModal = (food) => {
  setSelectedFood(food);
  setQuantity(1);
  setSelectedOption('half'); // default selected option

  // SET INITIAL PRICE HERE
  if (food.priceInfo.hasVariation) {
    setTotalPrice(food.priceInfo.halfPrice); // default = half
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

  // const totalItemCount = cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0);
  // const totalItemCount = cartItems.length;
  // const totalPrice = selectedFood?.priceInfo?.staticPrice
  //   ? selectedFood.priceInfo.staticPrice * quantity
  //   : 0;

  // Render Shimmer Loader
  const renderSkeleton = () => (
    <View style={styles.card}>
      <ShimmerPlaceHolder
        LinearGradient={LinearGradient}
        style={styles.image}
      />
      <View style={{flex: 1, marginLeft: 10}}>
        <ShimmerPlaceHolder
          LinearGradient={LinearGradient}
          style={{
            width: width * 0.4,
            height: 14,
            marginBottom: 6,
            borderRadius: 4,
          }}
        />
        <ShimmerPlaceHolder
          LinearGradient={LinearGradient}
          style={{
            width: width * 0.25,
            height: 14,
            marginBottom: 6,
            borderRadius: 4,
          }}
        />
        <ShimmerPlaceHolder
          LinearGradient={LinearGradient}
          style={{width: width * 0.2, height: 14, borderRadius: 4}}
        />
      </View>
    </View>
  );

  const renderItem = ({item}) => {
    // Accept both API formats safely
    const food = item.food ? item.food : item;
    console.log(food, '------------------food');

    if (!food) return null;

    // 1️⃣ SAFE TYPE CHECK
    const typeArray = food?.type;
    const type = Array.isArray(typeArray)
      ? String(typeArray[0] || '').toLowerCase()
      : String(typeArray || '').toLowerCase();

    // 2️⃣ SAFE PRICE CHECK
    const priceInfo = food?.priceInfo || {};

    return (
      <View style={styles.card}>
        {/* IMAGE --------------------------------------------------- */}
        <Image source={{uri: food.image}} style={styles.image} />

        {/* DETAILS ------------------------------------------------- */}
        <View style={styles.details}>
          {/* Cuisine ------------------------------------------------ */}
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Image
              source={require('../assets/images/dineBlack.png')}
              style={{width: 12, height: 12, tintColor: '#555'}}
            />
            <Text style={styles.cuisine}>{food.cuisineType}</Text>
          </View>

          {/* Name + Veg/NonVeg -------------------------------------- */}
          <View
            style={{flexDirection: 'row', alignItems: 'center', marginTop: 4}}>
            <View
              style={[
                styles.typeIndicator,
                {
                  borderColor:
                    type.includes('veg') && !type.includes('non')
                      ? 'green'
                      : 'red',
                },
              ]}>
              <View
                style={[
                  styles.typeDot,
                  {
                    backgroundColor:
                      type.includes('veg') && !type.includes('non')
                        ? 'green'
                        : 'red',
                  },
                ]}
              />
            </View>

            <Text style={styles.name} numberOfLines={1}>
              {food.name}
            </Text>
          </View>

          {/* PRICE --------------------------------------------------- */}
          {priceInfo?.hasVariation ? (
            <View>
              <Text style={{color: '#000', fontSize: 14}}>
                Half: ₹{priceInfo?.halfPrice}
              </Text>
              <Text style={{color: '#000', fontSize: 14}}>
                Full: ₹{priceInfo?.fullPrice}
              </Text>
            </View>
          ) : (
            <Text style={{color: '#000', fontSize: 14}}>
              Price: ₹{priceInfo?.staticPrice}
            </Text>
          )}

          {/* Rating */}
          <View style={styles.ratingWrapper}>
            <Text style={styles.ratingText}>★ {food.rating || '4'}</Text>
          </View>
        </View>

        {/* Add Button ---------------------------------------------- */}
        <TouchableOpacity style={styles.addBtn} onPress={() => openModal(food)}>
          <Text style={styles.addText}>Add</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const handleConfirmAdd = () => {
    dispatch(addToCart({...selectedFood, quantity}));
    closeModal();

    setBottomBoxVisible(true);
    Animated.timing(boxAnim, {
      toValue: 0,
      duration: 400,
      easing: Easing.out(Easing.ease),
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

  return (
    <DashboardScreen scrollable={false}>
      <CustomHeader title={categoryName} />
      <View style={styles.container}>
        {loading && page === 1 ? (
          Array.from({length: 6}).map((_, index) => (
            <View key={index}>{renderSkeleton()}</View>
          ))
        ) : filteredFoods.length === 0 ? (
          <Text style={styles.noData}>No items available</Text>
        ) : (
          <FlatList
            showsVerticalScrollIndicator={false}
            data={filteredFoods}
            keyExtractor={item => item.id}
            renderItem={renderItem}
            contentContainerStyle={{paddingBottom: 120}}
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.3}
            ListFooterComponent={
              loading ? (
                page === 1 ? (
                  // Show multiple skeletons for first page
                  Array.from({length: 6}).map((_, index) => (
                    <View key={index}>{renderSkeleton()}</View>
                  ))
                ) : (
                  // Show ActivityIndicator for pagination
                  <ActivityIndicator
                    size="large"
                    color="#FF4D4D"
                    style={{margin: 10}}
                  />
                )
              ) : null
            }
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            ListEmptyComponent={
              !loading ? (
                <Text style={styles.noData}>No items available</Text>
              ) : null
            }
          />
        )}
      </View>

      {/* Quantity Modal */}
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
                  <View style={styles.modalFoodRow}>
                    <Image
                      source={{uri: selectedFood.image}}
                      style={styles.modalImage}
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
                                selectedFood.priceInfo.halfPrice * quantity,
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

      {/* Bottom success box */}
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
            start={{x: 0, y: 0}}
            end={{x: 1, y: 1}}
            style={styles.gradientBackground}>
            <View style={styles.bottomBoxContent}>
              <Text style={styles.bottomText}>
                ✅ Item added successfully ({totalPrice} item
                {totalPrice > 1 ? 's' : ''} in cart)
              </Text>
              <TouchableOpacity
                style={styles.bottomButton}
                onPress={handleGoToCart}>
                <Text style={styles.bottomButtonText}>Go to Cart</Text>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </Animated.View>
      )}
    </DashboardScreen>
  );
};

export default TopPicksScreen;

const styles = StyleSheet.create({
  container: {flex: 1, marginTop: 20},
  noData: {textAlign: 'center', marginTop: 20, color: 'gray'},
  card: {
    flexDirection: 'row',
    backgroundColor: '#f9f9f9',
    borderRadius: 15,
    padding: 10,
    marginBottom: 15,
    alignItems: 'center',
    elevation: 3,
  },
  image: {width: 80, height: 80, borderRadius: 10},
  details: {flex: 1, marginLeft: 10},
  cuisine: {
    marginLeft: 10,
    color: 'black',
    fontSize: Theme.fontSizes.small,
    fontWeight: '500',
  },

  typeIndicator: {
    width: 14,
    height: 14,
    borderWidth: 1,
    borderRadius: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  typeDot: {width: 7, height: 7, borderRadius: 50},
  ratingWrapper: {
    backgroundColor: 'green',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  name: {
    fontSize: Theme.fontSizes.small,
    fontWeight: '600',
    marginLeft: 5,
    color: '#000',
  },
  ratingText: {color: '#fff', fontSize: 10, fontWeight: '600'},
  price: {
    fontSize: Theme.fontSizes.small,
    color: '#000',
    marginVertical: 4,
    fontWeight: '500',
  },
  addBtn: {
    backgroundColor: '#FF4D4D',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  addText: {color: '#fff', fontWeight: '600', fontSize: 13},

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  modalHandle: {
    width: 50,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#ccc',
    alignSelf: 'center',
    marginBottom: 10,
  },
  modalFoodRow: {flexDirection: 'row', alignItems: 'center', marginBottom: 15},
  modalImage: {width: 70, height: 70, borderRadius: 10},
  modalFoodName: {fontSize: 16, fontWeight: 'bold', color: '#000'},
  modalFoodPrice: {fontSize: 14, color: '#777', marginTop: 4},
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
    width: 30,
    height: 30,
    backgroundColor: '#fff',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
  },
  qtyText: {fontSize: 18, fontWeight: 'bold', color: '#FF4D4D'},
  qtyValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginHorizontal: 15,
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  totalText: {fontSize: 16, fontWeight: 'bold', color: '#000'},
  confirmBtn: {
    backgroundColor: '#FF4D4D',
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 25,
  },
  confirmBtnText: {color: '#fff', fontSize: 15, fontWeight: 'bold'},
  bottomBox: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  gradientBackground: {
    borderRadius: 20,
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  bottomBoxContent: {flexDirection: 'column', alignItems: 'center'},
  bottomText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#f8f3f3ff',
    marginBottom: 10,
  },
  bottomButton: {
    backgroundColor: '#FF4D4D',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  bottomButtonText: {color: '#fff', fontWeight: 'bold', fontSize: 15},
});
