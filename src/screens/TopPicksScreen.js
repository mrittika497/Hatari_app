import React, { useEffect, useState, useRef } from 'react';
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
import { useNavigation, useRoute } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import ShimmerPlaceHolder from 'react-native-shimmer-placeholder';
import LinearGradient from 'react-native-linear-gradient';
import DashboardScreen from '../components/DashboardScreen';
import CustomHeader from '../components/CustomHeader';
import { fetchCategoryFoodsBySubcat } from '../redux/slice/TopPickerSlice';
import { addToCart } from '../redux/slice/cartSlice';
import Theme from '../assets/theme';

const { width } = Dimensions.get('window');

const TopPicksScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const route = useRoute();

  const isVeg = useSelector(state => state.foodFilter.isVeg);
  const { categoryId, categoryName, restaurantId, categoryIngredients, cuisineType } = route.params;

  const { data: categoryFoods, loading, page, hasMore } = useSelector(
    state => state.catItemsbySubcat
  );

  const cartItems = useSelector(state => state.cart.items);

  const [selectedFood, setSelectedFood] = useState(null);
  const [quantity, setQuantity] = useState(1);
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
      })
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
        })
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
      })
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

  // Modal animations
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

  // const totalItemCount = cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0);
const totalItemCount = cartItems.length;
  const totalPrice = selectedFood?.priceInfo?.staticPrice
    ? selectedFood.priceInfo.staticPrice * quantity
    : 0;

  // Render Shimmer Loader
  const renderSkeleton = () => (
    <View style={styles.card}>
      <ShimmerPlaceHolder LinearGradient={LinearGradient} style={styles.image} />
      <View style={{ flex: 1, marginLeft: 10 }}>
        <ShimmerPlaceHolder
          LinearGradient={LinearGradient}
          style={{ width: width * 0.4, height: 14, marginBottom: 6, borderRadius: 4 }}
        />
        <ShimmerPlaceHolder
          LinearGradient={LinearGradient}
          style={{ width: width * 0.25, height: 14, marginBottom: 6, borderRadius: 4 }}
        />
        <ShimmerPlaceHolder
          LinearGradient={LinearGradient}
          style={{ width: width * 0.2, height: 14, borderRadius: 4 }}
        />
      </View>
    </View>
  );

  const renderItem = ({ item }) => {
    const food = item;
    return (
      <View style={styles.card}>
        <Image source={{ uri: food.image }} style={styles.image} />
        <View style={styles.details}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Image
              source={require('../assets/images/dineBlack.png')}
              style={{ width: 12, height: 12, tintColor: '#555' }}
            />
            <Text style={styles.cuisine}>{food.cuisineType}</Text>
          </View>
          <Text style={styles.cuisine}>{food.name}</Text>
          <Text style={styles.price}>₹{food.priceInfo?.staticPrice}</Text>
        </View>
        <TouchableOpacity style={styles.addBtn} onPress={() => openModal(food)}>
          <Text style={styles.addText}>Add</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const handleConfirmAdd = () => {
    dispatch(addToCart({ ...selectedFood, quantity }));
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
          Array.from({ length: 6 }).map((_, index) => <View key={index}>{renderSkeleton()}</View>)
        ) : filteredFoods.length === 0 ? (
          <Text style={styles.noData}>No items available</Text>
        ) : (
        <FlatList
  showsVerticalScrollIndicator={false}
  data={filteredFoods}
  keyExtractor={item => item.id}
  renderItem={renderItem}
  contentContainerStyle={{ paddingBottom: 120 }}
  onEndReached={handleLoadMore}
  onEndReachedThreshold={0.3}
  ListFooterComponent={
    loading ? (
      page === 1 ? (
        // Show multiple skeletons for first page
        Array.from({ length: 6 }).map((_, index) => <View key={index}>{renderSkeleton()}</View>)
      ) : (
        // Show ActivityIndicator for pagination
        <ActivityIndicator size="large" color="#FF4D4D" style={{ margin: 10 }} />
      )
    ) : null
  }
  refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
  ListEmptyComponent={!loading ? <Text style={styles.noData}>No items available</Text> : null}
/>

        )}
      </View>

      {/* Quantity Modal */}
      <Modal transparent visible={modalVisible} animationType="none">
        <TouchableOpacity activeOpacity={1} onPress={closeModal} style={styles.modalOverlay}>
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
            ]}
          >
            <View style={styles.modalHandle} />
            {selectedFood && (
              <>
                <View style={styles.modalFoodRow}>
                  <Image source={{ uri: selectedFood.image }} style={styles.modalImage} />
                  <View style={{ flex: 1, marginLeft: 10 }}>
                    <Text style={styles.modalFoodName}>{selectedFood.name}</Text>
                    <Text style={styles.modalFoodPrice}>₹{selectedFood.priceInfo?.staticPrice}</Text>
                  </View>
                </View>

                <View style={styles.quantityBox}>
                  <TouchableOpacity
                    style={styles.qtyBtn}
                    onPress={() => setQuantity(quantity > 1 ? quantity - 1 : 1)}
                  >
                    <Text style={styles.qtyText}>-</Text>
                  </TouchableOpacity>
                  <Text style={styles.qtyValue}>{quantity}</Text>
                  <TouchableOpacity
                    style={styles.qtyBtn}
                    onPress={() => setQuantity(quantity + 1)}
                  >
                    <Text style={styles.qtyText}>+</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.modalFooter}>
                  <Text style={styles.totalText}>Total: ₹{totalPrice}</Text>
                  <TouchableOpacity style={styles.confirmBtn} onPress={handleConfirmAdd}>
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
          ]}
        >
          <LinearGradient
            colors={['#ff4d4d', '#ff6f61', '#ff8a65']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradientBackground}
          >
            <View style={styles.bottomBoxContent}>
              <Text style={styles.bottomText}>
                ✅ Item added successfully ({totalItemCount} item
                {totalItemCount > 1 ? 's' : ''} in cart)
              </Text>
              <TouchableOpacity style={styles.bottomButton} onPress={handleGoToCart}>
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
  container: { flex: 1, marginTop: 20 },
  noData: { textAlign: 'center', marginTop: 20, color: 'gray' },
  card: {
    flexDirection: 'row',
    backgroundColor: '#f9f9f9',
    borderRadius: 15,
    padding: 10,
    marginBottom: 15,
    alignItems: 'center',
    elevation: 3,
  },
  image: { width: 80, height: 80, borderRadius: 10 },
  details: { flex: 1, marginLeft: 10 },
  cuisine: { marginLeft: 10, color: 'black', fontSize: Theme.fontSizes.small, fontWeight: '500' },
  price: { fontSize: Theme.fontSizes.small, color: '#000', marginVertical: 4, fontWeight: '500' },
  addBtn: { backgroundColor: '#FF4D4D', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 },
  addText: { color: '#fff', fontWeight: '600', fontSize: 13 },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#fff', padding: 20, borderTopLeftRadius: 20, borderTopRightRadius: 20 },
  modalHandle: { width: 50, height: 5, borderRadius: 3, backgroundColor: '#ccc', alignSelf: 'center', marginBottom: 10 },
  modalFoodRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  modalImage: { width: 70, height: 70, borderRadius: 10 },
  modalFoodName: { fontSize: 16, fontWeight: 'bold', color: '#000' },
  modalFoodPrice: { fontSize: 14, color: '#777', marginTop: 4 },
  quantityBox: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#F1F1F1', borderRadius: 25, paddingHorizontal: 10, paddingVertical: 6, marginVertical: 10 },
  qtyBtn: { width: 30, height: 30, backgroundColor: '#fff', borderRadius: 15, justifyContent: 'center', alignItems: 'center', elevation: 2 },
  qtyText: { fontSize: 18, fontWeight: 'bold', color: '#FF4D4D' },
  qtyValue: { fontSize: 16, fontWeight: 'bold', color: '#000', marginHorizontal: 15 },
  modalFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 },
  totalText: { fontSize: 16, fontWeight: 'bold', color: '#000' },
  confirmBtn: { backgroundColor: '#FF4D4D', borderRadius: 25, paddingVertical: 12, paddingHorizontal: 25 },
  confirmBtnText: { color: '#fff', fontSize: 15, fontWeight: 'bold' },
  bottomBox: { position: 'absolute', bottom: 0, width: '100%', backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20 },
  gradientBackground: { borderRadius: 20, paddingVertical: 15, paddingHorizontal: 20 },
  bottomBoxContent: { flexDirection: 'column', alignItems: 'center' },
  bottomText: { fontSize: 15, fontWeight: '600', color: '#f8f3f3ff', marginBottom: 10 },
  bottomButton: { backgroundColor: '#FF4D4D', paddingVertical: 10, paddingHorizontal: 30, borderRadius: 25 },
  bottomButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
});
