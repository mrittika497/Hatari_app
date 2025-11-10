import React, {useEffect, useRef, useState, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  SafeAreaView,
  TextInput,
  Modal,
  Animated,
  Easing,
  ActivityIndicator,
} from 'react-native';
import ShimmerPlaceHolder from 'react-native-shimmer-placeholder';
import LinearGradient from 'react-native-linear-gradient';
import {useNavigation} from '@react-navigation/native';
import {useSelector, useDispatch} from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';

import DashboardScreen from '../../components/DashboardScreen';
import CustomHeader from '../../components/CustomHeader';
import SmallbtnReuseable from '../../components/SmallbtnReuseable';
import Theme from '../../assets/theme';
import {addToCart} from '../../redux/slice/cartSlice';
import {fetchFoodPagination} from '../../redux/slice/SearchFoodPaginationSlice';

const MenuScreen = () => {
  const [quantity, setQuantity] = useState(1);
  const [selectedFood, setSelectedFood] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [bottomBoxVisible, setBottomBoxVisible] = useState(false);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [isFetchingMore, setIsFetchingMore] = useState(false);

  const slideAnim = useRef(new Animated.Value(0)).current;
  const boxAnim = useRef(new Animated.Value(150)).current;

  const dispatch = useDispatch();
  const navigation = useNavigation();

  const isVeg = useSelector(state => state.foodFilter.isVeg);
  const {
    AllFoodsData = [],
    loading,
    error,
    hasMore,
  } = useSelector(state => state.FoodPagination);
  const cartItems = useSelector(state => state.cart.items);

  const totalItemCount = cartItems.length;
  const totalPrice = selectedFood ? selectedFood.price * quantity : 0;

  // ✅ Initial fetch
  useEffect(() => {
    setPage(1);
    dispatch(fetchFoodPagination({page: 1, limit: 15}));
  }, [dispatch]);

  // ✅ Filter (search + veg toggle)
  const filteredItems = AllFoodsData.filter(item => {
    const name = item?.food?.name?.toLowerCase() || '';
    const type = item?.food?.type?.toLowerCase() || '';
    const matchSearch = name.includes(search.toLowerCase());
    const matchVeg = isVeg
      ? type === 'veg'
      : type === 'non-veg' || type === 'nonveg' || type === '';
    return matchSearch && matchVeg;
  });

  // ✅ Pagination
  const handleLoadMore = useCallback(async () => {
    if (isFetchingMore || loading || !hasMore) return;
    setIsFetchingMore(true);
    const nextPage = page + 1;
    await dispatch(fetchFoodPagination({page: nextPage, limit: 15}));
    setPage(nextPage);
    setIsFetchingMore(false);
  }, [dispatch, page, hasMore, loading, isFetchingMore]);

  // ✅ Modal logic
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

  // ✅ Add to cart
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

  // ✅ Shimmer loader
  const renderShimmerItem = () => (
    <View style={styles.card}>
      <ShimmerPlaceHolder
        LinearGradient={LinearGradient}
        style={styles.shimmerImage}
      />
      <View style={{flex: 1, marginLeft: 12}}>
        <ShimmerPlaceHolder
          LinearGradient={LinearGradient}
          style={styles.shimmerLine}
        />
        <ShimmerPlaceHolder
          LinearGradient={LinearGradient}
          style={[styles.shimmerLine, {width: '40%'}]}
        />
        <ShimmerPlaceHolder
          LinearGradient={LinearGradient}
          style={[styles.shimmerLine, {width: '30%'}]}
        />
      </View>
    </View>
  );

  // ✅ Food item card
  const renderItem = ({item}) => {
    const type = item?.food?.type?.toLowerCase() || '';
    return (
      <View style={styles.card}>
        <Image source={{uri: item?.food?.image}} style={styles.image} />
        <View style={styles.details}>
          <View style={styles.nameRow}>
            <View
              style={[
                styles.typeIndicator,
                {borderColor: type === 'veg' ? 'green' : 'red'},
              ]}>
              <View
                style={[
                  styles.typeDot,
                  {backgroundColor: type === 'veg' ? 'green' : 'red'},
                ]}
              />
            </View>
            <Text style={styles.name}>{item.food?.name}</Text>
          </View>
          <Text style={styles.desc}>{item?.food?.description}</Text>

       <View style={{ marginTop: 4, flexDirection: 'row', gap: 8 }}>
  {item.food?.priceInfo?.hasVariation ? (
    <>
      <Text style={[styles.priceText, { color: '#E53935' }]}>
        Half ₹{item.food?.priceInfo?.halfPrice || 'N/A'}
      </Text>
      <Text style={[styles.priceText, { color: '#2E7D32' }]}>
        Full ₹{item.food?.priceInfo?.fullPrice || 'N/A'}
      </Text>
    </>
  ) : (
    <Text style={[styles.priceText, { color: '#000' }]}>
      ₹{item.food?.priceInfo?.staticPrice || 'N/A'}
    </Text>
  )}
</View>

          <View style={styles.ratingWrapper}>
            <Ionicons name="star" size={14} color="green" />
            <Text style={styles.ratingText}>{item.food?.rating || 0}</Text>
          </View>
        </View>
        <SmallbtnReuseable onPress={() => openModal(item.food)} />
      </View>
    );
  };

  // ✅ Pagination footer loader
  const renderFooter = () =>
    isFetchingMore ? (
      <View style={{paddingVertical: 20}}>
        <ActivityIndicator size="small" color="#FF4D4D" />
      </View>
    ) : null;

  return (
    <DashboardScreen scrollable={false}>
      <CustomHeader title="Menu" />
      <SafeAreaView style={styles.container}>
        {/* 🔍 Search */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#666" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search for dishes..."
            value={search}
            onChangeText={setSearch}
            placeholderTextColor="#888"
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch('')}>
              <Ionicons name="close-circle" size={20} color="gray" />
            </TouchableOpacity>
          )}
        </View>

        {/* 🍴 Food List */}
        {loading && page === 1 ? (
          <FlatList
            data={[1, 2, 3, 4, 5]}
            keyExtractor={(_, index) => `shimmer-${index}`}
            renderItem={renderShimmerItem}
            showsVerticalScrollIndicator={false}
          />
        ) : error ? (
          <Text style={styles.error}>{error}</Text>
        ) : (
          <FlatList
            data={filteredItems}
            keyExtractor={(item, index) => `food-${item.food?._id || index}`}
            renderItem={renderItem}
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.3}
            ListFooterComponent={renderFooter}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{paddingBottom: 180}}
            ListEmptyComponent={
              <Text style={styles.noResults}>No items found.</Text>
            }
          />
        )}
      </SafeAreaView>
    </DashboardScreen>
  );
};

export default MenuScreen;

const styles = StyleSheet.create({
  container: {marginTop: 20, flex: 1},
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f1f1',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginBottom: 10,
  },
  searchInput: {
    marginLeft: 8,
    fontSize: Theme.fontSizes.small,
    color: '#333',
    flex: 1,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 10,
    marginVertical: 6,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: {width: 0, height: 3},
    shadowRadius: 4,
    elevation: 3,
    alignItems: 'center',
  },
  image: {width: 80, height: 80, borderRadius: 10},
  details: {flex: 1, marginLeft: 12, justifyContent: 'center'},
  nameRow: {flexDirection: 'row', alignItems: 'center', marginBottom: 2},
  name: {
    fontSize: Theme.fontSizes.small,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 6,
  },
  price: {
    fontSize: Theme.fontSizes.small,
    color: '#000',
    fontWeight: 'bold',
    marginTop: 4,
  },
  ratingWrapper: {flexDirection: 'row', alignItems: 'center', marginTop: 4},
  ratingText: {fontSize: 12, color: 'green', fontWeight: '600', marginLeft: 4},
  typeIndicator: {
    width: 16,
    height: 16,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  typeDot: {width: 8, height: 8, borderRadius: 4},
  shimmerImage: {width: 80, height: 80, borderRadius: 10},
  shimmerLine: {width: '60%', height: 15, marginBottom: 6, borderRadius: 5},
  noResults: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: Theme.fontSizes.small,
    color: '#666',
  },
  error: {textAlign: 'center', color: 'red', marginTop: 20},
  desc: {color: '#666', fontSize: 13, marginVertical: 4},
  priceText: {fontSize: 14, fontWeight: '600', color: '#222'},
});
