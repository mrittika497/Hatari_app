// src/screens/MenuScreen.js

import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  SafeAreaView,
  TextInput,
  ScrollView,
  Dimensions,
  Modal,
  Animated,
  Easing,
} from 'react-native';
import ShimmerPlaceHolder from 'react-native-shimmer-placeholder';
import LinearGradient from 'react-native-linear-gradient';
import {useNavigation} from '@react-navigation/native';
import {useSelector, useDispatch} from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { fetchMenuFoods } from '../../redux/slice/menucuisineTypeSlice';
import DashboardScreen from '../../components/DashboardScreen';
import CustomHeader from '../../components/CustomHeader';
import SmallbtnReuseable from '../../components/SmallbtnReuseable';
import Theme from '../../assets/theme';
import { addToCart } from '../../redux/slice/cartSlice';
const categories = ['Indian', 'Chinese', 'Italian', 'Mexican', 'Top Picks'];
const {width} = Dimensions.get('window');

// src/screens/MenuScreen.js



const MenuScreen = () => {
  const [quantity, setQuantity] = useState(1);
  const [selectedFood, setSelectedFood] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [bottomBoxVisible, setBottomBoxVisible] = useState(false);

  const slideAnim = useRef(new Animated.Value(0)).current;
   const boxAnim = useRef(new Animated.Value(150)).current; // animation for bottom view
 const isVeg = useSelector(state => state.foodFilter.isVeg);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const {selectedRestaurant} = useSelector(state => state.experience);
  const cartItems = useSelector(state => state.cart.items);

  const totalItemCount = cartItems.length;
  const totalPrice = selectedFood ? selectedFood.price * quantity : 0;

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

  // ---------------- Fetch Menu Items ----------------
  const [activeCategory, setActiveCategory] = useState('Indian');
  const [search, setSearch] = useState('');

  const {data: menuFoods, loading, error} = useSelector(state => state.menuItems);

  useEffect(() => {
    if (activeCategory === 'Top Picks') {
      dispatch(fetchMenuFoods({isTopPick: true}));
    } else {
      dispatch(
        fetchMenuFoods({
          cuisineType: activeCategory,
          restaurantId: selectedRestaurant?._id,
        }),
      );
    }
  }, [dispatch, activeCategory]);

const filteredItems = menuFoods.filter(item => {
  const food = item?.food;
  const cuisine = food?.cuisineType?.[0]?.toLowerCase() || '';
  const name = food?.name?.toLowerCase() || '';
  const typeArray = food?.type;
  const type = Array.isArray(typeArray)
    ? String(typeArray[0] || '').toLowerCase()
    : String(typeArray || '').toLowerCase();

  // ✅ Match active category + search
  const matchCategory = cuisine === activeCategory.toLowerCase();
  const matchSearch = name.includes(search.toLowerCase());

  // ✅ Veg / Non-Veg filter logic
  const matchVegFilter =
    isVeg === true
      ? type.includes('veg') && !type.includes('non') // only veg
      : isVeg === false
      ? type.includes('non') // only non-veg
      : true; // show all if no filter set

  return matchCategory && matchSearch && matchVegFilter;
});


  // ---------------- Render Functions ----------------
  const renderShimmerItem = () => (
    <View style={styles.card}>
      <ShimmerPlaceHolder LinearGradient={LinearGradient} style={styles.shimmerImage} />
      <View style={{flex: 1, marginLeft: 12}}>
        <ShimmerPlaceHolder LinearGradient={LinearGradient} style={styles.shimmerLine} />
        <ShimmerPlaceHolder LinearGradient={LinearGradient} style={[styles.shimmerLine, {width: '40%'}]} />
        <ShimmerPlaceHolder LinearGradient={LinearGradient} style={[styles.shimmerLine, {width: '30%'}]} />
      </View>
    </View>
  );

  const renderItem = ({item}) => (
    <View style={styles.card}>
      <Image source={{uri: item.food?.image}} style={styles.image} />
      <View style={styles.details}>
        <View style={styles.nameRow}>
          <View
            style={[
              styles.typeIndicator,
              {borderColor: item.food?.type?.includes('veg') ? 'green' : 'red'},
            ]}>
            <View
              style={[
                styles.typeDot,
                {backgroundColor: item.food?.type?.includes('veg') ? 'green' : 'red'},
              ]}
            />
          </View>
          <Text style={styles.name}>{item.food?.name}</Text>
        </View>
        <Text style={styles.price}>₹{item.food?.price}</Text>
        <View style={styles.ratingWrapper}>
          <Ionicons name="star" size={14} color="green" />
          <Text style={styles.ratingText}>{item.food?.rating || 0}</Text>
        </View>
      </View>
      <SmallbtnReuseable onPress={() => openModal(item?.food)} />
    </View>
  );


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





  // ---------------- UI ----------------
  return (
    <DashboardScreen scrollable={false}>
      <CustomHeader title="Menu" />
      <SafeAreaView style={styles.container}>
        {/* Categories */}
        <ScrollView
          style={styles.tabContainer}
          horizontal
          showsHorizontalScrollIndicator={false}>
          {categories.map(cat => (
            <TouchableOpacity
              key={cat}
              style={[styles.tab, activeCategory === cat && styles.activeTab]}
              onPress={() => setActiveCategory(cat)}>
              <Text
                style={[
                  styles.tabText,
                  activeCategory === cat && styles.activeTabText,
                ]}>
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Search */}
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

        {/* Section Title */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Best Selling {activeCategory}</Text>
        </View>

        {/* Food List */}
        <View style={{height: 600}}>
          {loading ? (
            <FlatList
              data={[1, 2, 3, 4, 5]}
              keyExtractor={(item, index) => index.toString()}
              renderItem={renderShimmerItem}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{paddingBottom: 100}}
            />
          ) : error ? (
            <Text style={styles.error}>{error}</Text>
          ) : (
            <FlatList
              data={filteredItems}
              keyExtractor={(item, index) => index.toString()}
              renderItem={renderItem}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{paddingBottom: 200}}
              ListEmptyComponent={
                <Text style={styles.noResults}>
                  No items found for {activeCategory}
                </Text>
              }
            />
          )}
        </View>
      </SafeAreaView>

      {/* Quantity Modal */}
      <Modal transparent visible={modalVisible} animationType="none">
        <View style={styles.modalOverlay}>
          <TouchableOpacity       style={styles.modalOverlay}     activeOpacity={1} onPress={closeModal} />
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
                  <Image source={{uri: selectedFood.image}} style={styles.modalImage} />
                  <View style={{flex: 1, marginLeft: 10}}>
                    <Text style={styles.modalFoodName}>{selectedFood.name}</Text>
                    <Text style={styles.modalFoodPrice}>₹{selectedFood.price}</Text>
                  </View>
                </View>

                <View style={styles.quantityBox}>
                  <TouchableOpacity
                    style={styles.qtyBtn}
                    onPress={() => setQuantity(quantity > 1 ? quantity - 1 : 1)}>
                    <Text style={styles.qtyText}>-</Text>
                  </TouchableOpacity>
                  <Text style={styles.qtyValue}>{quantity}</Text>
                  <TouchableOpacity style={styles.qtyBtn} onPress={() => setQuantity(quantity + 1)}>
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
        </View>
      </Modal>

      {/* ✅ Bottom Confirmation Box */}
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
              // opacity: boxAnim, // fade in
            },
          ]}>
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

export default MenuScreen;

// ---------------- STYLES ----------------
const styles = StyleSheet.create({
  container: {marginTop: 20},
  tabContainer: {flexDirection: 'row', marginBottom: 10},
  tab: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    marginRight: 10,
    height: 30,
    width: 80,
    justifyContent: 'center',
    marginVertical: 10,
  },
  activeTab: {backgroundColor: '#f44336', borderColor: '#f44336'},
  tabText: {fontSize: Theme.fontSizes.small, color: '#555', textAlign: 'center'},
  activeTabText: {color: '#fff', fontWeight: 'bold'},
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f1f1',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginBottom: 20,
  },
  searchInput: {marginLeft: 8, fontSize: Theme.fontSizes.small, color: '#333'},
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
    marginHorizontal: 10,
  },
  sectionTitle: {
    fontSize: Theme.fontSizes.smedium,
    fontWeight: 'bold',
    color: '#333',
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
  restaurantName: {fontSize: Theme.fontSizes.sx, color: '#777', marginTop: 2},
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
  shimmerLine: {
    width: '60%',
    height: 15,
    marginBottom: 6,
    borderRadius: 5,
  },
  noResults: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: Theme.fontSizes.small,
    color: '#666',
  },
  error: {textAlign: 'center', color: 'red', marginTop: 20},
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 30,
  },
  modalHandle: {
    width: 50,
    height: 5,
    backgroundColor: '#ccc',
    borderRadius: 3,
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

  // ✅ Bottom Confirmation Box
  bottomBox: {
    position: 'absolute',
    bottom: "20%",
    width: '100%',
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    // elevation: 10,
    // paddingVertical: 20,
    // paddingHorizontal: 20,
  },
    gradientBackground: {
    borderRadius: 20,
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  bottomBoxContent: {alignItems: 'center'},
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
