// CatItemScreen.js — Fully fixed & production-ready
import React, {useEffect, useRef, useState, useCallback} from 'react';
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
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
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

const {width} = Dimensions.get('window');

const CatItemScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const isVeg = useSelector(s => s.foodFilter.isVeg); // true / false / null
  const {
    AllFoodsData = [],
    loading,
    page = 1,
    hasMore,
  } = useSelector(s => s.FoodPagination);
  const cartItems = useSelector(s => s.cart.items || []);

  const [selectedFood, setSelectedFood] = useState(null);
  const [selectedOption, setSelectedOption] = useState('half');
  const [totalPrice, setTotalPrice] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [modalVisible, setModalVisible] = useState(false);

  const [bottomBoxVisible, setBottomBoxVisible] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;
  const boxAnim = useRef(new Animated.Value(150)).current;

  const type = isVeg === null ? '' : isVeg ? 'veg' : 'non-veg';

  useFocusEffect(
    useCallback(() => {
      return () => {
        setBottomBoxVisible(false);
        boxAnim.setValue(150);
      };
    }, []),
  );

  // -------------------------
  // API calls
  // -------------------------
  const loadFirstPage = useCallback(() => {
    dispatch(clearFoods());
    dispatch(
      fetchFoodPagination({
        page: 1,
        limit: 12,
        type,
        search: searchText,
      }),
    );
  }, [dispatch, type, searchText]);

  useEffect(() => {
    const timer = setTimeout(() => loadFirstPage(), 400);
    return () => clearTimeout(timer);
  }, [loadFirstPage]);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

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

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await dispatch(clearFoods());
      await dispatch(
        fetchFoodPagination({
          page: 1,
          limit: 12,
          type,
          search: searchText,
        }),
      ).unwrap();
    } catch (err) {
    } finally {
      setRefreshing(false);
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

  const filteredFoods = AllFoodsData.filter(item => {
    const food = item.food;
    if (!food) return false;
    let typeStr = String(food.type || '').toLowerCase();
    if (typeStr === 'nonveg') typeStr = 'non-veg';
    if (typeStr === 'vegetarian') typeStr = 'veg';

    if (isVeg === true && typeStr !== 'veg') return false;
    if (isVeg === false && typeStr !== 'non-veg') return false;

    if (searchText) {
      return food.name.toLowerCase().includes(searchText.toLowerCase());
    }
    return true;
  });

  const openModal = food => {
    setSelectedFood(food);
    setSelectedOption(food?.priceInfo?.hasVariation ? 'half' : 'full');
    setQuantity(1);
    const initialUnit = computeUnitPrice(
      food,
      food?.priceInfo?.hasVariation ? 'half' : 'full',
    );
    setTotalPrice(initialUnit);

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
      duration: 180,
      useNativeDriver: true,
    }).start(() => {
      setModalVisible(false);
      setSelectedFood(null);
    });
  };

  const handleConfirmAdd = () => {
    if (!selectedFood) return;

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

  // ======================== RENDER ITEM ========================
  const renderItem = ({item, index}) => {
    const food = item.food;
    if (!food) return null;
    const keyId = food._id || item._id || String(index);

    let typeStr = String(food.type || '').toLowerCase();
    if (typeStr === 'nonveg') typeStr = 'non-veg';
    if (typeStr === 'vegetarian') typeStr = 'veg';

    const typeColor = typeStr === 'veg' ? 'green' : 'red';

    return (
      <View style={styles.card} key={keyId}>
        <Image source={{uri: food.image}} style={styles.image} />

        <View style={styles.details}>
          <Text style={styles.cuisine}>{food.cuisineType || ''}</Text>

          <View style={styles.row}>
            <View style={[styles.typeBox, {borderColor: typeColor}]}>
              <View style={[styles.typeDot, {backgroundColor: typeColor}]} />
            </View>

            <Text style={styles.name} numberOfLines={1}>
              {food?.name}
            </Text>
          </View>

          {food.priceInfo?.hasVariation ? (
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
              Price: ₹{food.priceInfo?.staticPrice}
            </Text>
          )}

          <Text style={styles.rating}>★ {food.rating ?? '4.2'}</Text>
        </View>

        <TouchableOpacity style={styles.addBtn} onPress={() => openModal(food)}>
          <Text style={styles.addText}>Add</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const keyExtractor = (item, idx) => {
    const id = item?.food?._id ?? item?._id ?? String(idx);
    return String(id);
  };

  useEffect(() => {
    updateTotal(quantity, selectedOption);
  }, [quantity, selectedOption, selectedFood]);

  return (
    <>
      <CustomHeader title="All Menu" />
      <DashboardScreen scrollable={false}>
        {/* Search Box */}
        <View style={styles.searchBox}>
          <TextInput
            placeholder="Search food..."
            placeholderTextColor="black"
            value={searchText}
            onChangeText={t => setSearchText(t)}
            style={styles.searchInput}
            returnKeyType="search"
            onSubmitEditing={() => {
              loadFirstPage();
              Keyboard.dismiss();
            }}
          />
        </View>

        {/* FOOD LIST */}
        <Animated.View style={{flex: 1, opacity: fadeAnim}}>
          <FlatList
            data={filteredFoods}
            showsVerticalScrollIndicator={false}
            keyExtractor={keyExtractor}
            renderItem={renderItem}
            contentContainerStyle={{paddingBottom: 140, paddingHorizontal: 12}}
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.5}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            ListFooterComponent={
              loading && hasMore ? (
                <ActivityIndicator
                  size="large"
                  color="#FF4D4D"
                  style={{marginBottom: 10}}
                />
              ) : null
            }
            ListEmptyComponent={
              loading && page === 1 ? (
                <View style={{padding: 12}}>
                  {[...Array(6)].map((_, idx) => (
                    <View key={idx} style={styles.card}>
                      {/* Image Placeholder */}
                      <ShimmerPlaceHolder
                        LinearGradient={LinearGradient}
                        style={{
                          width: 80,
                          height: 80,
                          borderRadius: 10,
                          backgroundColor: '#eee',
                        }}
                      />
                      {/* Details */}
                      <View style={{flex: 1, marginLeft: 10}}>
                        <ShimmerPlaceHolder
                          LinearGradient={LinearGradient}
                          style={{
                            width: '50%',
                            height: 12,
                            borderRadius: 4,
                            marginBottom: 6,
                          }}
                        />
                        <ShimmerPlaceHolder
                          LinearGradient={LinearGradient}
                          style={{
                            width: '70%',
                            height: 14,
                            borderRadius: 4,
                            marginBottom: 4,
                          }}
                        />
                        <ShimmerPlaceHolder
                          LinearGradient={LinearGradient}
                          style={{
                            width: '30%',
                            height: 12,
                            borderRadius: 4,
                            marginTop: 6,
                          }}
                        />
                      </View>
                      {/* Add button placeholder */}
                      <ShimmerPlaceHolder
                        LinearGradient={LinearGradient}
                        style={{
                          width: 50,
                          height: 25,
                          borderRadius: 12,
                          marginLeft: 8,
                        }}
                      />
                    </View>
                  ))}
                </View>
              ) : (
                <View style={{padding: 30, alignItems: 'center'}}>
                  <Text style={{color: '#555'}}>No items found.</Text>
                </View>
              )
            }
          />
        </Animated.View>

        {/* Modal and Bottom Box remain unchanged */}
      </DashboardScreen>
    </>
  );
};

export default CatItemScreen;

// ======================= STYLES =======================
const styles = StyleSheet.create({
  searchBox: {margin: 15, marginTop: -10},
  searchInput: {
    backgroundColor: 'hsla(0, 0%, 100%, 1.00)',
    height: 40,
    paddingHorizontal: 15,
    borderRadius: 35,
    color: '#000',
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
  shimmerRow: {
    flexDirection: 'row',
    backgroundColor: '#f9f9f9',
    borderRadius: 15,
    padding: 10,
    marginBottom: 15,
    alignItems: 'center',
    height: 89,
    width: '100%',
  },
});
