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
} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import ShimmerPlaceHolder from 'react-native-shimmer-placeholder';
import LinearGradient from 'react-native-linear-gradient';
import DashboardScreen from '../components/DashboardScreen';
import CustomHeader from '../components/CustomHeader';
import {fetchCategoryFoods} from '../redux/slice/catItemSlice';
import {addToCart} from '../redux/slice/cartSlice';
import Theme from '../assets/theme';

const {width} = Dimensions.get('window');

const CatItemScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const route = useRoute();
 const isVeg = useSelector(state => state.foodFilter.isVeg);
  const {categoryId, categoryName, restaurantId, categoryIngredients,categoryType} =
    route.params;

  const {data: categoryFoods, loading, error} = useSelector(
    state => state.catItems,
  );


  // 🥦 Filter logic based on Veg/Non-Veg toggle
const filteredFoods = categoryFoods.filter(item => {
  const food = item.food;
  const typeArray = food?.type;
  const type = Array.isArray(typeArray)
    ? String(typeArray[0] || '').toLowerCase()
    : String(typeArray || '').toLowerCase();

  if (isVeg === true) {
    // show only Veg
    return type.includes('veg') && !type.includes('non');
  } else if (isVeg === false) {
    // show only Non-Veg
    return type.includes('non');
  } else {
    // show all if filter not set
    return true;
  }
});

   useEffect(() => {
    console.log('Category foods data:', categoryType);
  }, [categoryType]);
  const cartItems = useSelector(state => state.cart.items);
  console.log(cartItems,"-------------------data");
  const [selectedFood, setSelectedFood] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [modalVisible, setModalVisible] = useState(false);
  const [bottomBoxVisible, setBottomBoxVisible] = useState(false);

  const slideAnim = useRef(new Animated.Value(0)).current;
  const boxAnim = useRef(new Animated.Value(150)).current; // animation for bottom view

  useEffect(() => {
    dispatch(
      fetchCategoryFoods({
        categoryId,
        categoryIngredients,
        restaurantId,
      }),
    );
  }, [dispatch, categoryId, categoryIngredients]);

  // Modal Animation Handlers
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

  const totalPrice = selectedFood ? selectedFood.price * quantity : 0;

  // Count distinct items only
  const totalItemCount = cartItems.length;

  const renderSkeleton = () => (
    <View style={styles.card}>
      <ShimmerPlaceHolder LinearGradient={LinearGradient} style={styles.image} />
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
  const food = item.food;
  console.log(food,"------------------food");
  

  // Safely extract type (handles string or array)
  const typeArray = food?.type;
  console.log(typeArray,"--------------------typeArray");
  
  const type = Array.isArray(typeArray)
    ? String(typeArray[0] || '').toLowerCase()
    : String(typeArray || '').toLowerCase();

  return (
    <View style={styles.card}>
      <Image source={{uri: food.image}} style={styles.image} />

      <View style={styles.details}>
        {/* Cuisine */}
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Image
            source={require('../assets/images/dineBlack.png')}
            style={{width: 12, height: 12, tintColor: '#555'}}
          />
          <Text style={styles.cuisine}>
            {food.cuisineType?.[0] || 'Indian'}
          </Text>
        </View>

        {/* Name + Type */}
        <View
          style={{flexDirection: 'row', alignItems: 'center', marginTop: 4}}>
          <View
            style={[
              styles.typeIndicator,
              {borderColor: type.includes('veg') && !type.includes('non') ? 'green' : 'red'},
            ]}>
            <View
              style={[
                styles.typeDot,
                {backgroundColor: type.includes('veg') && !type.includes('non') ? 'green' : 'red'},
              ]}
            />
          </View>

          <Text style={styles.name} numberOfLines={1}>
            {food.name}
          </Text>
        </View>

        {/* Price */}
        <Text style={styles.price}>₹{food.price}</Text>

        {/* Rating */}
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


  // Confirm Add logic
  const handleConfirmAdd = () => {
    dispatch(addToCart({...selectedFood, quantity}));
    closeModal();

    // Show bottom box with animation
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
      <CustomHeader title="Category Item" />
      <View style={styles.container}>
        <Text style={styles.header}>{categoryName} Items</Text>

        {loading ? (
          Array.from({length: 5}).map((_, i) => (
            <View key={i}>{renderSkeleton()}</View>
          ))
        ) : error ? (
          <Text style={styles.error}>{error}</Text>
        ) : categoryFoods.length > 0 ? (
          <FlatList
            showsVerticalScrollIndicator={false}
            data={filteredFoods}
            keyExtractor={item => item.food._id}
            renderItem={renderItem}
            contentContainerStyle={{paddingBottom: 120}}
          />
        ) : (
          <Text style={styles.noData}>No items found in {categoryName}</Text>
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
                <View style={styles.modalFoodRow}>
                  <Image
                    source={{uri: selectedFood.image}}
                    style={styles.modalImage}
                  />
                  <View style={{flex: 1, marginLeft: 10}}>
                    <Text style={styles.modalFoodName}>{selectedFood.name}</Text>
                    <Text style={styles.modalFoodPrice}>
                      ₹{selectedFood.price}
                    </Text>
                  </View>
                </View>

                <View style={styles.quantityBox}>
                  <TouchableOpacity
                    style={styles.qtyBtn}
                    onPress={() =>
                      setQuantity(quantity > 1 ? quantity - 1 : 1)
                    }>
                    <Text style={styles.qtyText}>-</Text>
                  </TouchableOpacity>
                  <Text style={styles.qtyValue}>{quantity}</Text>
                  <TouchableOpacity
                    style={styles.qtyBtn}
                    onPress={() => setQuantity(quantity + 1)}>
                    <Text style={styles.qtyText}>+</Text>
                  </TouchableOpacity>
                </View>

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

      {/* Bottom Confirmation Box */}
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
        </Animated.View>
      )}
    </DashboardScreen>
  );
};

export default CatItemScreen;

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#fff', marginTop: 20},
  header: {
    fontSize: Theme.fontSizes.smedium,
    fontWeight: '600',
    marginVertical: 10,
    color: '#000',
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
  price: {
    fontSize: Theme.fontSizes.small,
    color: '#000',
    marginVertical: 4,
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
  ratingText: {color: '#fff', fontSize: 10, fontWeight: '600'},
  addBtn: {
    backgroundColor: '#FF4D4D',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  addText: {color: '#fff', fontWeight: '600', fontSize: 13},

  // Modal
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
  modalFoodRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
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
  qtyValue: {fontSize: 16, fontWeight: 'bold', color: '#000', marginHorizontal: 15},
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

  // Bottom Confirmation Box
  bottomBox: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    elevation: 10,
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  bottomBoxContent: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  bottomText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#000',
    marginBottom: 10,
  },
  bottomButton: {
    backgroundColor: '#FF4D4D',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  bottomButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
});
