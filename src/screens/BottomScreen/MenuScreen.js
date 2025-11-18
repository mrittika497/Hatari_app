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
import Theme from '../../assets/theme';
import {
  fetchFoodPagination,
  clearFoods,
} from '../../redux/slice/SearchFoodPaginationSlice';
import {addToCart} from '../../redux/slice/cartSlice';

const {width} = Dimensions.get('window');

const CatItemScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const isVeg = useSelector(state => state.foodFilter.isVeg); // true/false/null
  const {AllFoodsData, loading, page, hasMore, error} = useSelector(
    state => state.FoodPagination,
  );
  const cartItems = useSelector(state => state.cart.items);
  const [totalPrice, setTotalPrice] = useState(0);
  console.log(totalPrice,"--------------totalPrice");
  
  const [selectedFood, setSelectedFood] = useState(null);
  const [selectedOption, setSelectedOption] = useState('half');
  const [quantity, setQuantity] = useState(1);
  const [modalVisible, setModalVisible] = useState(false);
  const [bottomBoxVisible, setBottomBoxVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [searchText, setSearchText] = useState('');

  const slideAnim = useRef(new Animated.Value(0)).current;
  const boxAnim = useRef(new Animated.Value(150)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // API type
  const type = isVeg === null ? '' : isVeg ? 'veg' : 'non-veg';

  const loadFirstPage = () => {
    dispatch(clearFoods());
    dispatch(
      fetchFoodPagination({
        page: 1,
        limit: 10,
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
          limit: 10,
          type,
          search: searchText,
        }),
      );
    }
  };

  const updateTotal = qty => {
    if (selectedFood.priceInfo.hasVariation) {
      if (selectedOption === 'half') {
        setTotalPrice(selectedFood.priceInfo.halfPrice * qty);
      } else if (selectedOption === 'full') {
        setTotalPrice(selectedFood.priceInfo.fullPrice * qty);
      }
    } else {
      setTotalPrice(selectedFood.priceInfo.staticPrice * qty);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadFirstPage();
    setRefreshing(false);
  };

  // Veg/Non-Veg + Search filter
  const filteredFoods = AllFoodsData?.filter(item => {
    if (!item.type) return true;

    let typeStr = Array.isArray(item.type)
      ? item.type[0]?.toLowerCase()
      : String(item.type).toLowerCase();
    if (typeStr === 'nonveg') typeStr = 'non-veg';
    if (typeStr === 'vegetarian') typeStr = 'veg';

    if (isVeg === true && typeStr !== 'veg') return false;
    if (isVeg === false && typeStr !== 'non-veg') return false;

    // Search filter
    if (
      searchText &&
      !item.name?.toLowerCase().includes(searchText.toLowerCase())
    )
      return false;

    return true;
  });
  console.log(filteredFoods, '---------------------------filteredFoods');

  const openModal = food => {
    setSelectedFood(food);
    setQuantity(1);
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

  const totalItemCount = cartItems.length;
  // const totalPrice = selectedFood?.priceInfo?.staticPrice ? selectedFood.priceInfo.staticPrice * quantity : 0;

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
    const food = item?.food;

    const typeStr = String(food?.type || '').toLowerCase();

    return (
      <View style={styles.card}>
        <Image source={{uri: food.image}} style={styles.image} />

        <View style={styles.details}>
          <Text style={styles.cuisine}>{food?.cuisineType}</Text>

          <View
            style={{flexDirection: 'row', alignItems: 'center', marginTop: 4}}>
            <View
              style={[
                styles.typeIndicator,
                {borderColor: typeStr === 'veg' ? 'green' : 'red'},
              ]}>
              <View
                style={[
                  styles.typeDot,
                  {backgroundColor: typeStr === 'veg' ? 'green' : 'red'},
                ]}
              />
            </View>

            <Text style={styles.name} numberOfLines={1}>
              {food?.name}
            </Text>
          </View>

          {food.priceInfo?.hasVariation ? (
            <View>
              <Text style={{color: '#000', fontSize: 14}}>
                Half: ₹{food.priceInfo.halfPrice}
              </Text>
              <Text style={{color: '#000', fontSize: 14}}>
                Full: ₹{food.priceInfo.fullPrice}
              </Text>
            </View>
          ) : (
            <Text style={{color: '#000', fontSize: 14}}>
              Price: ₹{food.priceInfo?.staticPrice ?? 'N/A'}
            </Text>
          )}

          <View style={styles.ratingWrapper}>
            <Text style={styles.ratingText}>★ {food.rating || '4.2'}</Text>
          </View>
        </View>

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
      <CustomHeader title={'All Menu'} />

      {/* Search Box */}
      <View style={styles.searchBox}>
        <TextInput
          placeholder="Search food..."
          value={searchText}
          onChangeText={setSearchText}
          style={styles.searchInput}
          placeholderTextColor={'black'}
        />
      </View>

      <View style={styles.container}>
        {loading && AllFoodsData.length === 0 ? (
          Array.from({length: 5}).map((_, i) => (
            <View key={i}>{renderSkeleton()}</View>
          ))
        ) : error ? (
          <Text style={styles.error}>{error}</Text>
        ) : filteredFoods.length > 0 ? (
          <Animated.View style={{opacity: fadeAnim, flex: 1}}>
            <FlatList
              showsVerticalScrollIndicator={false}
              data={filteredFoods}
              keyExtractor={item => item.id}
              renderItem={renderItem}
              contentContainerStyle={{paddingBottom: 120}}
              onEndReached={handleLoadMore}
              onEndReachedThreshold={0.5}
              ListFooterComponent={
                loading && hasMore ? (
                  <ActivityIndicator
                    size="large"
                    color="#FF4D4D"
                    style={{margin: 10}}
                  />
                ) : null
              }
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
            />
          </Animated.View>
        ) : (
          <Text style={styles.noData}>No items found</Text>
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
                ✅ Item added successfully ({totalItemCount} item
                {totalItemCount > 1 ? 's' : ''} in cart)
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

export default CatItemScreen;

// Styles
const styles = StyleSheet.create({
  container: {flex: 1, marginTop: 10},
  searchBox: {marginVertical: 15},
  searchInput: {
    backgroundColor: '#f9ccccff',
    borderRadius: 25,
    paddingHorizontal: 15,
    height: 40,
    color: 'black',
  },
  error: {textAlign: 'center', marginTop: 20, color: 'red'},
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
  optionBtn: {
    paddingVertical: 6,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginRight: 10,
  },
  selectedOption: {
    backgroundColor: '#e82b2bff',
    borderColor: '#ff6600',
  },
  optionText: {
    color: '#000',
    fontSize: 14,
  },
  optionTextSelected: {
    color: '#fff',
    fontWeight: 'bold',
  },
  image: {width: 80, height: 80, borderRadius: 10},
  details: {flex: 1, marginLeft: 10},
  cuisine: {
    marginLeft: 10,
    color: 'black',
    fontSize: Theme.fontSizes.small,
    fontWeight: '500',
  },
  name: {
    fontSize: Theme.fontSizes.small,
    fontWeight: '600',
    marginLeft: 5,
    color: '#000',
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
  ratingText: {color: '#fff', fontSize: 10, fontWeight: '600'},
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
    bottom: 60,
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
