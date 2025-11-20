// TopPicksScreen.js — Full screen, defensive, error-free
import React, { useEffect, useRef, useState, useCallback } from "react";
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
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import ShimmerPlaceHolder from "react-native-shimmer-placeholder";
import LinearGradient from "react-native-linear-gradient";

import DashboardScreen from "../components/DashboardScreen";
import CustomHeader from "../components/CustomHeader";

import { fetchCategoryFoodsBySubcat } from "../redux/slice/TopPickerSlice";
import { addToCart } from "../redux/slice/cartSlice";
import Theme from "../assets/theme";

const { width } = Dimensions.get("window");

const TopPicksScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const route = useRoute();

  // defensive selectors (avoid undefined)
  const isVeg = useSelector((state) => state.foodFilter?.isVeg ?? null);
  const cartItems = useSelector((state) => state.cart?.items ?? []);

  const {
    categoryId,
    categoryName,
    restaurantId,
    categoryIngredients,
    cuisineType,
  } = route.params ?? {};

  const {
    data: categoryFoods = [],
    loading = false,
    page = 1,
    hasMore = false,
  } = useSelector((state) => state.catItemsbySubcat ?? {});

  // UI state
  const [selectedFood, setSelectedFood] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [modalVisible, setModalVisible] = useState(false);
  const [bottomBoxVisible, setBottomBoxVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedOption, setSelectedOption] = useState("half"); // 'half'|'full'|'static'
  const [totalPrice, setTotalPrice] = useState(0);

  // animations
  const slideAnim = useRef(new Animated.Value(0)).current;
  const boxAnim = useRef(new Animated.Value(150)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // safe helper to normalize food object (supports mixed API)
  const normalizeFood = (item) => {
    if (!item) return null;
    if (item.food && typeof item.food === "object") return item.food;
    return item;
  };

  // initial fetch
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

    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, categoryId, cuisineType, restaurantId]);

  // pagination
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

  // pull to refresh
  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await dispatch(
        fetchCategoryFoodsBySubcat({
          subCategoryId: categoryId,
          categoryIngredients,
          restaurantId,
          cuisineType,
          page: 1,
        })
      );
    } catch (e) {
      // ignore
    } finally {
      setRefreshing(false);
    }
  };

  // client-side veg filter (defensive)
  const filteredFoods = (categoryFoods || []).filter((item) => {
    const food = normalizeFood(item);
    if (!food) return false;

    const rawType = Array.isArray(food.type) ? food.type[0] : String(food.type || "");
    const type = rawType.toLowerCase();

    if (isVeg === true) {
      return type.includes("veg") && !type.includes("non");
    }
    if (isVeg === false) {
      return type.includes("non");
    }
    return true;
  });

  // helpers for pricing
  const getUnitPrice = (food, option = "half") => {
    if (!food?.priceInfo) return 0;
    const info = food.priceInfo;
    if (info.hasVariation) {
      return option === "half" ? Number(info.halfPrice || 0) : Number(info.fullPrice || 0);
    }
    return Number(info.staticPrice || 0);
  };

  const updateTotal = (qty = quantity, option = selectedOption) => {
    if (!selectedFood) return;
    const unit = getUnitPrice(selectedFood, option);
    setTotalPrice(unit * (qty || 1));
  };

  // open modal: set defaults and animate
  const openModal = (foodItem) => {
    const food = normalizeFood(foodItem);
    if (!food) return;

    setSelectedFood(food);
    setQuantity(1);

    // default option & price
    if (food.priceInfo?.hasVariation) {
      setSelectedOption("half");
      setTotalPrice(Number(food.priceInfo.halfPrice || 0));
    } else {
      setSelectedOption("static");
      setTotalPrice(Number(food.priceInfo.staticPrice || 0));
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
    }).start(() => {
      setModalVisible(false);
      setSelectedFood(null);
      setQuantity(1);
      setSelectedOption("half");
      setTotalPrice(0);
    });
  };

  // keep total in sync with quantity/option changes
  useEffect(() => {
    updateTotal(quantity, selectedOption);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quantity, selectedOption, selectedFood]);

  // add to cart
  const handleConfirmAdd = () => {
    if (!selectedFood) return;
    dispatch(addToCart({ ...selectedFood, quantity, option: selectedOption, totalPrice }));
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

    // NOTE: adjust route name if your app uses a different name
    navigation.navigate("OderCartScreen");
  };

  // skeleton/shimmer renderer
  const renderSkeleton = (i) => (
    <View style={styles.card} key={`skeleton-${i}`}>
      <ShimmerPlaceHolder LinearGradient={LinearGradient} style={styles.image} />
      <View style={{ flex: 1, marginLeft: 10 }}>
        <ShimmerPlaceHolder LinearGradient={LinearGradient} style={{ width: width * 0.4, height: 14, marginBottom: 6, borderRadius: 4 }} />
        <ShimmerPlaceHolder LinearGradient={LinearGradient} style={{ width: width * 0.25, height: 14, marginBottom: 6, borderRadius: 4 }} />
        <ShimmerPlaceHolder LinearGradient={LinearGradient} style={{ width: width * 0.2, height: 14, borderRadius: 4 }} />
      </View>
    </View>
  );

  // item renderer
  const renderItem = ({ item, index }) => {
    const food = normalizeFood(item);
    if (!food) return null;

    const rawType = Array.isArray(food.type) ? food.type[0] : String(food.type || "");
    const type = rawType.toLowerCase();

    const priceInfo = food.priceInfo || {};
    const priceDisplay = priceInfo.hasVariation
      ? `Half ₹${priceInfo.halfPrice} • Full ₹${priceInfo.fullPrice}`
      : `₹${priceInfo.staticPrice ?? "N/A"}`;

    const imageUri = food.image || food.imageUrl || food.img || "";

    const keyId = String(food._id || item._id || item.id || index);

    return (
      <View style={styles.card} key={keyId}>
        <Image source={{ uri: imageUri }} style={styles.image} />

        <View style={styles.details}>
          <Text style={styles.cuisine}>{food.cuisineType || ""}</Text>

          <View style={styles.row}>
            <View
              style={[
                styles.typeIndicator,
                { borderColor: type.includes("veg") && !type.includes("non") ? "green" : "red" },
              ]}
            >
              <View
                style={[
                  styles.typeDot,
                  { backgroundColor: type.includes("veg") && !type.includes("non") ? "green" : "red" },
                ]}
              />
            </View>

            <Text style={styles.name} numberOfLines={1}>
              {food.name}
            </Text>
          </View>

          <Text style={styles.priceText}>Price: {priceDisplay}</Text>

          <View style={styles.ratingWrapper}>
            <Text style={styles.ratingText}>★ {food.rating ?? "4"}</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.addBtn} onPress={() => openModal(food)}>
          <Text style={styles.addText}>Add</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const keyExtractor = (item, idx) => String(item?.food?._id ?? item?._id ?? item?.id ?? idx);

  return (
    <DashboardScreen scrollable={false}>
      <CustomHeader title={categoryName ?? "Top Picks"} />

      <View style={styles.container}>
        {loading && page === 1 ? (
          Array.from({ length: 6 }).map((_, i) => renderSkeleton(i))
        ) : filteredFoods.length === 0 ? (
          <Text style={styles.noData}>No items available</Text>
        ) : (
          <FlatList
            showsVerticalScrollIndicator={false}
            data={filteredFoods}
            keyExtractor={keyExtractor}
            renderItem={renderItem}
            contentContainerStyle={{ paddingBottom: 120 }}
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.3}
            ListFooterComponent={
              loading ? (
                page === 1 ? null : <ActivityIndicator size="large" color="#FF4D4D" style={{ margin: 10 }} />
              ) : null
            }
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            ListEmptyComponent={!loading ? <Text style={styles.noData}>No items available</Text> : null}
          />
        )}
      </View>

      {/* Quantity Modal */}
      <Modal transparent visible={modalVisible} animationType="none">
        <TouchableWithoutFeedback onPress={closeModal}>
          <View style={styles.modalOverlay}>
            {/* Prevent overlay closing when tapping content by wrapping content in another TouchableWithoutFeedback */}
            <TouchableWithoutFeedback onPress={() => {}}>
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
                      <Image source={{ uri: selectedFood.image || selectedFood.imageUrl || "" }} style={styles.modalImage} />
                      <View style={{ flex: 1, marginLeft: 10 }}>
                        <Text style={styles.modalFoodName}>{selectedFood.name}</Text>
                        <Text style={styles.modalCuisine}>{selectedFood?.cuisineType}</Text>

                        {selectedFood?.priceInfo?.hasVariation ? (
                          <View style={{ flexDirection: "row", marginTop: 8 }}>
                            <TouchableOpacity
                              style={[styles.optionBtn, selectedOption === "half" && styles.selectedOption]}
                              onPress={() => {
                                setSelectedOption("half");
                                updateTotal(quantity, "half");
                              }}
                            >
                              <Text style={[styles.optionText, selectedOption === "half" && styles.optionTextSelected]}>
                                Half – ₹{selectedFood.priceInfo.halfPrice}
                              </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                              style={[styles.optionBtn, selectedOption === "full" && styles.selectedOption]}
                              onPress={() => {
                                setSelectedOption("full");
                                updateTotal(quantity, "full");
                              }}
                            >
                              <Text style={[styles.optionText, selectedOption === "full" && styles.optionTextSelected]}>
                                Full – ₹{selectedFood.priceInfo.fullPrice}
                              </Text>
                            </TouchableOpacity>
                          </View>
                        ) : (
                          <Text style={styles.modalPriceStatic}>Price:₹{selectedFood.priceInfo?.staticPrice}</Text>
                        )}
                      </View>
                    </View>

                    {selectedFood?.description ? <Text style={styles.modalDescription}>{selectedFood.description}</Text> : null}

                    <View style={styles.quantityBox}>
                      <TouchableOpacity
                        style={styles.qtyBtn}
                        onPress={() => {
                          if (quantity > 1) {
                            const newQty = quantity - 1;
                            setQuantity(newQty);
                            updateTotal(newQty);
                          }
                        }}
                      >
                        <Text style={styles.qtyText}>-</Text>
                      </TouchableOpacity>

                      <Text style={styles.qtyValue}>{quantity}</Text>

                      <TouchableOpacity
                        style={styles.qtyBtn}
                        onPress={() => {
                          const newQty = quantity + 1;
                          setQuantity(newQty);
                          updateTotal(newQty);
                        }}
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
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
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
          <LinearGradient colors={["#ff4d4d", "#ff6f61", "#ff8a65"]} style={styles.bottomGradient}>
            <Text style={styles.bottomMsg}>✓ Item added successfully ({cartItems.length} in cart)</Text>

            <TouchableOpacity style={styles.bottomBtn} onPress={handleGoToCart}>
              <Text style={styles.bottomBtnText}>Go to Cart</Text>
            </TouchableOpacity>
          </LinearGradient>
        </Animated.View>
      )}
    </DashboardScreen>
  );
};

export default TopPicksScreen;

const styles = StyleSheet.create({
  container: { flex: 1, marginTop: 20 },
  noData: { textAlign: "center", marginTop: 20, color: "gray" },

  // card
  card: {
    flexDirection: "row",
    backgroundColor: "#f9f9f9",
    borderRadius: 15,
    padding: 10,
    marginBottom: 15,
    alignItems: "center",
    elevation: 3,
  },
  image: { width: 80, height: 80, borderRadius: 10, backgroundColor: "#f2f2f2" },
  details: { flex: 1, marginLeft: 10 },
  cuisine: { marginLeft: 0, color: "black", fontSize: Theme.fontSizes?.small ?? 12, fontWeight: "500" },

  typeIndicator: { width: 14, height: 14, borderWidth: 1, borderRadius: 3, justifyContent: "center", alignItems: "center" },
  typeDot: { width: 7, height: 7, borderRadius: 50 },

  row: { flexDirection: "row", alignItems: "center", marginTop: 4 },
  name: { fontSize: Theme.fontSizes?.small ?? 14, fontWeight: "600", marginLeft: 6, color: "#000" },

  ratingWrapper: { backgroundColor: "green", paddingHorizontal: 8, paddingVertical: 3, borderRadius: 12, alignSelf: "flex-start", marginTop: 4 },
  ratingText: { color: "#fff", fontSize: 10, fontWeight: "600" },

  priceText: { color: "#000", marginTop: 4, fontSize: 13 },

  addBtn: { backgroundColor: "#FF4D4D", paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 },
  addText: { color: "#fff", fontWeight: "600", fontSize: 13 },

  // modal
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.4)", justifyContent: "flex-end" },
  modalContent: { backgroundColor: "#fff", padding: 20, borderTopLeftRadius: 20, borderTopRightRadius: 20 },
  modalHandle: { width: 50, height: 5, borderRadius: 3, backgroundColor: "#ccc", alignSelf: "center", marginBottom: 10 },

  modalFoodRow: { flexDirection: "row", alignItems: "center", marginBottom: 15 },
  modalImage: { width: 70, height: 70, borderRadius: 10, backgroundColor: "#f2f2f2" },
  modalFoodName: { fontSize: 16, fontWeight: "bold", color: "#000" },
  modalPriceStatic: { fontSize: 16, color: "#222222", fontWeight: "700", marginBottom: 10 },
  modalDescription: { marginTop: 10, color: "#444" },

  optionBtn: { paddingVertical: 8, paddingHorizontal: 15, borderColor: "#aaa", borderWidth: 1, borderRadius: 8, marginRight: 10 },
  selectedOption: { backgroundColor: "#FF4D4D", borderColor: "#FF4D4D" },
  optionText: { color: "#000" },
  optionTextSelected: { color: "#fff", fontWeight: "700" },
  modalCuisine: { fontSize: 14, color: "#555" },
  quantityBox: { flexDirection: "row", alignItems: "center", justifyContent: "center", backgroundColor: "#F1F1F1", borderRadius: 25, paddingHorizontal: 10, paddingVertical: 6, marginVertical: 10 },
  qtyBtn: { width: 30, height: 30, backgroundColor: "#fff", borderRadius: 15, justifyContent: "center", alignItems: "center", elevation: 2 },
  qtyText: { fontSize: 18, fontWeight: "bold", color: "#FF4D4D" },
  qtyValue: { fontSize: 16, fontWeight: "bold", color: "#000", marginHorizontal: 15 },

  modalFooter: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 10 },
  totalText: { fontSize: 16, fontWeight: "bold", color: "#000" },
  confirmBtn: { backgroundColor: "#FF4D4D", borderRadius: 25, paddingVertical: 12, paddingHorizontal: 25 },
  confirmBtnText: { color: "#fff", fontSize: 15, fontWeight: "bold" },

  // shimmer sizes
  shimmerImage: { width: 80, height: 80, borderRadius: 10 },

  // bottom box
  bottomBox: { position: "absolute", bottom: 60, width: "100%", paddingHorizontal: 16 },
  bottomGradient: { padding: 15, borderRadius: 20 },
  bottomMsg: { color: "#fff", textAlign: "center", marginBottom: 10 },
  bottomBtn: { backgroundColor: "#fff", paddingVertical: 8, paddingHorizontal: 30, borderRadius: 20, alignSelf: "center" },
  bottomBtnText: { fontWeight: "700", color: "red" },
});
