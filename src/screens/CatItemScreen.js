// FULL FIXED + SHIMMER + COLORS — COPY PASTE COMPLETELY

import React, { useEffect, useState, useRef } from "react";
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
} from "react-native";

import { useNavigation, useRoute } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";

import ShimmerPlaceHolder from "react-native-shimmer-placeholder";
import LinearGradient from "react-native-linear-gradient";

import DashboardScreen from "../components/DashboardScreen";
import CustomHeader from "../components/CustomHeader";

import {
  fetchCategoryFoods,
  clearCategoryFoods,
} from "../redux/slice/catItemSlice";

import { addToCart } from "../redux/slice/cartSlice";
import Theme from "../assets/theme";

const { width } = Dimensions.get("window");

const CatItemScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const route = useRoute();

  const isVeg = useSelector((state) => state.foodFilter.isVeg);

  const {
    categoryId,
    categoryName,
    restaurantId,
    categoryIngredients,
    cuisineType: selectedCuisineType,
  } = route.params;

  const { data: categoryFoods, loading, error, page, hasMore } = useSelector(
    (state) => state.catItems
  );

  const cartItems = useSelector((state) => state.cart.items);

  const [selectedFood, setSelectedFood] = useState(null);
  const [selectedOption, setSelectedOption] = useState("half");
  const [quantity, setQuantity] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0);

  const [modalVisible, setModalVisible] = useState(false);
  const [bottomBoxVisible, setBottomBoxVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const slideAnim = useRef(new Animated.Value(0)).current;
  const boxAnim = useRef(new Animated.Value(150)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Initial fetch
  useEffect(() => {
    dispatch(
      fetchCategoryFoods({
        categoryId,
        categoryIngredients,
        restaurantId,
        cuisineType: selectedCuisineType,
        page: 1,
      })
    );

    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      dispatch(
        fetchCategoryFoods({
          categoryId,
          categoryIngredients,
          restaurantId,
          cuisineType: selectedCuisineType,
          page: page + 1,
        })
      );
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);

    await dispatch(clearCategoryFoods());
    await dispatch(
      fetchCategoryFoods({
        categoryId,
        categoryIngredients,
        restaurantId,
        cuisineType: selectedCuisineType,
        page: 1,
      })
    );

    setRefreshing(false);
  };

  // FIXED FILTER LOGIC 🟢
  const filteredFoods = (categoryFoods || []).filter((item) => {
    const food = item.food;

    // Cuisine filter FIXED
    if (
      selectedCuisineType &&
      food?.cuisineType?.toLowerCase() !== selectedCuisineType.toLowerCase()
    ) {
      return false;
    }

    // Veg / Non-Veg filter FIXED
    const type = Array.isArray(food.type)
      ? food.type[0]?.toLowerCase()
      : String(food.type || "").toLowerCase();

    if (isVeg === true) {
      return type.includes("veg") && !type.includes("non");
    }

    if (isVeg === false) {
      return type.includes("non");
    }

    return true;
  });

  const openModal = (food) => {
    setSelectedFood(food);
    setQuantity(1);

    // INITIAL TOTAL PRICE FIXED 🟢
    if (food.priceInfo && food.priceInfo.hasVariation) {
      setSelectedOption("half");
      setTotalPrice(food.priceInfo.halfPrice);
    } else if (food.priceInfo) {
      setSelectedOption("static");
      setTotalPrice(food.priceInfo.staticPrice);
    } else {
      setSelectedOption("static");
      setTotalPrice(0);
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

  const updateTotal = (qty) => {
    if (!selectedFood || !selectedFood.priceInfo) {
      setTotalPrice(0);
      return;
    }

    if (selectedFood.priceInfo.hasVariation) {
      if (selectedOption === "half") {
        setTotalPrice((selectedFood.priceInfo.halfPrice || 0) * qty);
      } else {
        setTotalPrice((selectedFood.priceInfo.fullPrice || 0) * qty);
      }
    } else {
      setTotalPrice((selectedFood.priceInfo.staticPrice || 0) * qty);
    }
  };

  const handleConfirmAdd = () => {
    dispatch(
      addToCart({
        ...selectedFood,
        option: selectedOption,
        quantity,
        totalPrice,
      })
    );

    closeModal();

    setBottomBoxVisible(true);

    Animated.timing(boxAnim, {
      toValue: 0,
      duration: 400,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  };

  const totalItemCount = cartItems.length;

  const handleGoToCart = () => {
    Animated.timing(boxAnim, {
      toValue: 150,
      duration: 300,
      useNativeDriver: true,
    }).start(() => setBottomBoxVisible(false));

    navigation.navigate("OderCartScreen");
  };

  const renderSkeleton = (index) => (
    <View style={styles.card} key={"shimmer-" + index}>
      <ShimmerPlaceHolder
        LinearGradient={LinearGradient}
        style={styles.shimmerImage}
      />
      <View style={{ flex: 1, marginLeft: 12 }}>
        <ShimmerPlaceHolder
          LinearGradient={LinearGradient}
          style={styles.shimmerLineLarge}
        />
        <ShimmerPlaceHolder
          LinearGradient={LinearGradient}
          style={styles.shimmerLineSmall}
        />
        <ShimmerPlaceHolder
          LinearGradient={LinearGradient}
          style={styles.shimmerLineTiny}
        />
      </View>
    </View>
  );

  const renderItem = ({ item }) => {
    const food = item.food;

    const type = Array.isArray(food.type)
      ? food.type[0]
      : String(food.type || "");

    const priceDisplay = food.priceInfo
      ? food.priceInfo.hasVariation
        ? `Half ₹${food.priceInfo.halfPrice} • Full ₹${food.priceInfo.fullPrice}`
        : `₹${food.priceInfo.staticPrice}`
      : "Price N/A";

    return (
  



     <View style={styles.card}>
        {/* IMAGE --------------------------------------------------- */}
        <Image source={{uri: food.image}} style={styles.image} />

        {/* DETAILS ------------------------------------------------- */}
        <View style={styles.details}>
   
            <Text style={styles.cuisine}>{food.cuisineType}</Text>
      

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
               <Text style={styles.priceText}>price:{priceDisplay}</Text>

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

  return (
    <DashboardScreen scrollable={false}>
      <CustomHeader title={categoryName} />

      <View style={styles.container}>
        {loading && (!categoryFoods || categoryFoods.length === 0) ? (
          // show 4 shimmer rows
          <>
            {Array.from({ length: 4 }).map((_, i) => renderSkeleton(i))}
          </>
        ) : error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : filteredFoods && filteredFoods.length > 0 ? (
          <FlatList
            data={filteredFoods}
            renderItem={renderItem}
            keyExtractor={(item) => item.food._id}
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.5}
            contentContainerStyle={{ paddingBottom: 120 }}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            ListFooterComponent={
              loading && hasMore ? (
                <ActivityIndicator
                  size="large"
                  color="#FF4D4D"
                  style={{ margin: 10 }}
                />
              ) : null
            }
          />
        ) : (
          <Text style={styles.noData}>No items found</Text>
        )}
      </View>

      {/* MODAL */}
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

      {/* Bottom Success Box */}
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
  );
};

export default CatItemScreen;

// -------------------- STYLES -------------------------

const styles = StyleSheet.create({
  container: {flex: 1, marginTop: 20},
  noData: {
    textAlign: "center",
    color: "#666",
    marginTop: 40,
    fontSize: 16,
  },
  errorText: {
    textAlign: "center",
    color: "#cc3333",
    marginTop: 20,
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
  image: {width: 80, height: 80, borderRadius: 10},
  details: {flex: 1, marginLeft: 10},
  cuisine: {fontSize: 12, color: 'black'},

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
  price: {
    fontSize: Theme.fontSizes.small,
    color: '#000',
    marginVertical: 4,
    fontWeight: '500',
  },
  image: { width: 80, height: 80, borderRadius: 10, backgroundColor: "#f2f2f2" },

  // shimmer sizes
  shimmerImage: { width: 80, height: 80, borderRadius: 10 },
  shimmerLineLarge: { width: width * 0.5, height: 14, borderRadius: 6, marginBottom: 8 },
  shimmerLineSmall: { width: width * 0.3, height: 12, borderRadius: 6, marginBottom: 6 },
  shimmerLineTiny: { width: width * 0.15, height: 12, borderRadius: 6 },

  details: { flex: 1, marginLeft: 12 },

  name: {fontSize: 15, fontWeight: '600', color: 'black',marginLeft:5},


  priceText: {color: '#000', marginTop: 4, fontSize: 13},



  addBtn: {
    backgroundColor: "#FF4D4D",
    paddingVertical: 6,
    paddingHorizontal: 15,
    borderRadius: 20,
    alignSelf: "center",
  },

  addText: { color: "#fff", fontWeight: "600" },

  // MODAL
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.4)",
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

  modalFoodName: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 10,
    color: "#111111",
  },

  modalPriceStatic: {
    fontSize: 16,
    color: "#222222",
    fontWeight: "700",
    marginBottom: 10,
  },

  optionBtn: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderColor: "#aaa",
    borderWidth: 1,
    borderRadius: 8,
    marginRight: 10,
  },

  selectedOption: {
    backgroundColor: "#FF4D4D",
    borderColor: "#FF4D4D",
  },

  optionText: { color: "#000" },
  optionTextSelected: { color: "#fff", fontWeight: "700" },

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
    backgroundColor: "#eee",
    justifyContent: "center",
    alignItems: "center",
  },

  qtyText: { fontSize: 20, fontWeight: "bold", color: "#FF4D4D" },

  qtyValue: {
    fontSize: 17,
    fontWeight: "700",
    marginHorizontal: 20,
    color: "#111",
  },

  modalFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  totalText: { fontSize: 17, fontWeight: "700", color: "#111" },

  confirmBtn: {
    backgroundColor: "#FF4D4D",
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 25,
  },

  confirmBtnText: { color: "#fff", fontSize: 15, fontWeight: "700" },

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
