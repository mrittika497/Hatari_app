// CatItemScreen.js — Fully fixed & production-ready
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
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import ShimmerPlaceHolder from "react-native-shimmer-placeholder";
import LinearGradient from "react-native-linear-gradient";
import DashboardScreen from "../../components/DashboardScreen";
import CustomHeader from "../../components/CustomHeader";

import {
  fetchFoodPagination,
  clearFoods,
} from "../../redux/slice/SearchFoodPaginationSlice";

import { addToCart } from "../../redux/slice/cartSlice";

const { width } = Dimensions.get("window");

const CatItemScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  // Redux state
  const isVeg = useSelector((s) => s.foodFilter.isVeg); // true / false / null
  const { AllFoodsData = [], loading, page = 1, hasMore } = useSelector(
    (s) => s.FoodPagination
  );
  const cartItems = useSelector((s) => s.cart.items || []);

  // UI state
  const [selectedFood, setSelectedFood] = useState(null);
  const [selectedOption, setSelectedOption] = useState("half"); // 'half' | 'full'
  const [totalPrice, setTotalPrice] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [modalVisible, setModalVisible] = useState(false);

  const [bottomBoxVisible, setBottomBoxVisible] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  // animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;
  const boxAnim = useRef(new Animated.Value(150)).current;

  // API filter param
  const type = isVeg === null ? "" : isVeg ? "veg" : "non-veg";

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
      })
    );
  }, [dispatch, type, searchText]);

  // Debounce API calls when searchText or type changes
  useEffect(() => {
    const timer = setTimeout(() => {
      loadFirstPage();
    }, 400); // 400ms debounce

    return () => clearTimeout(timer);
  }, [loadFirstPage]);

  // initial fade-in
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
        })
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
        })
      ).unwrap();
    } catch (err) {
      // ignore
    } finally {
      setRefreshing(false);
    }
  };

  // -------------------------
  // Utility: compute item price
  // -------------------------
  const computeUnitPrice = (food, option = "half") => {
    const info = food?.priceInfo || {};
    if (info.hasVariation) {
      return option === "half" ? Number(info.halfPrice || 0) : Number(info.fullPrice || 0);
    }
    return Number(info.staticPrice || 0);
  };

  const updateTotal = (qty = 1, option = selectedOption) => {
    if (!selectedFood) return;
    const unit = computeUnitPrice(selectedFood, option);
    setTotalPrice(unit * qty);
  };

  // -------------------------
  // Filtered view for immediate UI responsiveness
  // (This is a light local filter so the user sees instant results while server results update)
  // -------------------------
  const filteredFoods = AllFoodsData.filter((item) => {
    const food = item.food;
    if (!food) return false;

    // normalize types
    let typeStr = String(food.type || "").toLowerCase();
    if (typeStr === "nonveg") typeStr = "non-veg";
    if (typeStr === "vegetarian") typeStr = "veg";

    if (isVeg === true && typeStr !== "veg") return false;
    if (isVeg === false && typeStr !== "non-veg") return false;

    if (searchText) {
      return food.name.toLowerCase().includes(searchText.toLowerCase());
    }
    return true;
  });

  // -------------------------
  // Modal open / close
  // -------------------------
  const openModal = (food) => {
    setSelectedFood(food);
    setSelectedOption(food?.priceInfo?.hasVariation ? "half" : "full"); // default sensible option
    setQuantity(1);

    // set initial price correctly
    const initialUnit = computeUnitPrice(food, food?.priceInfo?.hasVariation ? "half" : "full");
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
      // reset selected food after close
      setSelectedFood(null);
    });
  };

  // -------------------------
  // Add to cart
  // -------------------------
  const handleConfirmAdd = () => {
    if (!selectedFood) return;

    dispatch(addToCart({ ...selectedFood, quantity, selectedOption }));

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

    navigation.navigate("OderCartScreen");
  };

  // -------------------------
  // Render item
  // -------------------------
  const renderItem = ({ item, index }) => {
    const food = item.food;
    if (!food) return null;

    const keyId = food._id || item._id || String(index);

    return (
      <View style={styles.card} key={keyId}>
        <Image source={{ uri: food.image }} style={styles.image} />

        <View style={styles.details}>
          <Text style={styles.cuisine}>{food.cuisineType || ""}</Text>

          <View style={styles.row}>
            <View
              style={[
                styles.typeBox,
                { borderColor: (String(food.type || "").toLowerCase() === "veg" ? "green" : "red") },
              ]}
            >
              <View
                style={[
                  styles.typeDot,
                  { backgroundColor: (String(food.type || "").toLowerCase() === "veg" ? "green" : "red") },
                ]}
              />
            </View>

            <Text style={styles.name}>{food.name}</Text>
          </View>

          {food.priceInfo?.hasVariation ? (
            <>
              <Text style={styles.priceText}>Half: ₹{food.priceInfo.halfPrice}</Text>
              <Text style={styles.priceText}>Full: ₹{food.priceInfo.fullPrice}</Text>
            </>
          ) : (
            <Text style={styles.priceText}>Price: ₹{food.priceInfo?.staticPrice}</Text>
          )}

          <Text style={styles.rating}>★ {food.rating ?? "4.2"}</Text>
        </View>

        <TouchableOpacity style={styles.addBtn} onPress={() => openModal(food)}>
          <Text style={styles.addText}>Add</Text>
        </TouchableOpacity>
      </View>
    );
  };

  // -------------------------
  // stable key extractor
  // -------------------------
  const keyExtractor = (item, idx) => {
    const id = item?.food?._id ?? item?._id ?? String(idx);
    return String(id);
  };

  // -------------------------
  // Effects to keep modal totals in sync with changes
  // -------------------------
  useEffect(() => {
    updateTotal(quantity, selectedOption);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quantity, selectedOption, selectedFood]);

  return (
    <DashboardScreen scrollable={false}>
      <CustomHeader title="All Menu" />

      {/* Search Box */}
      <View style={styles.searchBox}>
        <TextInput
          placeholder="Search food..."
          placeholderTextColor="black"
          value={searchText}
          onChangeText={(t) => setSearchText(t)}
          style={styles.searchInput}
          returnKeyType="search"
          onSubmitEditing={() => {
            // immediate trigger if user submits keyboard
            loadFirstPage();
            Keyboard.dismiss();
          }}
        />
      </View>

      {/* FOOD LIST */}
      <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
        <FlatList
          data={filteredFoods}
          showsHorizontalScrollIndicator={false}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 140, paddingHorizontal: 12 }}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            loading && hasMore ? (
              <ActivityIndicator size="large" color="#FF4D4D" style={{ marginBottom: 10 }} />
            ) : null
          }
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          ListEmptyComponent={
            !loading ? (
              <View style={{ padding: 30, alignItems: "center" }}>
                <Text style={{ color: "#555" }}>No items found.</Text>
              </View>
            ) : (
              // show shimmer placeholders while loading first page
              <View style={{ padding: 12 }}>
                {[1, 2, 3].map((i) => (
                  <ShimmerPlaceHolder key={i} style={styles.shimmerRow} />
                ))}
              </View>
            )
          }
        />
      </Animated.View>

      {/* ========================= MODAL ======================== */}
      <Modal transparent visible={modalVisible} animationType="none">
        <TouchableWithoutFeedback onPress={closeModal}>
          <View style={styles.modalOverlay}>
            {/* prevent tap propagation to overlay by wrapping content in TouchableWithoutFeedback */}
            <TouchableWithoutFeedback /* empty to capture taps inside */ onPress={() => {}}>
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
                    {/* Food Header */}
                    <View style={styles.modalHeader}>
                      <Image source={{ uri: selectedFood.image }} style={styles.modalImg} />
                      <View style={{ flex: 1, marginLeft: 10 }}>
                        <Text style={styles.modalFoodName}>{selectedFood.name}</Text>
                        <Text style={styles.modalCuisine}>{selectedFood?.cuisineType}</Text>

                        {/* Variation Selection */}
                        {selectedFood?.priceInfo?.hasVariation ? (
                          <View style={{ flexDirection: "row", marginTop: 8 }}>
                            {/* Half Button */}
                            <TouchableOpacity
                              style={[
                                styles.optionBtn,
                                selectedOption === "half" && styles.selectedOption,
                              ]}
                              onPress={() => {
                                setSelectedOption("half");
                                // update total will run via effect
                              }}
                            >
                              <Text style={[styles.optionText, selectedOption === "half" && styles.optionTextSelected]}>
                                Half – ₹{selectedFood.priceInfo.halfPrice}
                              </Text>
                            </TouchableOpacity>

                            {/* Full Button */}
                            <TouchableOpacity
                              style={[
                                styles.optionBtn,
                                selectedOption === "full" && styles.selectedOption,
                              ]}
                              onPress={() => {
                                setSelectedOption("full");
                                // update total will run via effect
                              }}
                            >
                              <Text style={[styles.optionText, selectedOption === "full" && styles.optionTextSelected]}>
                                Full – ₹{selectedFood.priceInfo.fullPrice}
                              </Text>
                            </TouchableOpacity>
                          </View>
                        ) : (
                          <Text style={styles.staticPrice}>Price: ₹{selectedFood.priceInfo.staticPrice}</Text>
                        )}
                      </View>
                    </View>

                    {selectedFood?.description ? (
                      <Text style={styles.modalDescription}>{selectedFood.description}</Text>
                    ) : null}

                    {/* Quantity Box */}
                    <View style={styles.quantityBox}>
                      <TouchableOpacity
                        style={styles.qtyBtn}
                        onPress={() => {
                          if (quantity > 1) {
                            const newQty = quantity - 1;
                            setQuantity(newQty);
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
                        }}
                      >
                        <Text style={styles.qtyText}>+</Text>
                      </TouchableOpacity>
                    </View>

                    {/* Footer */}
                    <View style={styles.modalFooter}>
                      <Text style={styles.totalPrice}>Total: ₹{totalPrice}</Text>

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

export default CatItemScreen;

// ======================= STYLES =======================
const styles = StyleSheet.create({
  searchBox: { margin: 15 },
  searchInput: {
    backgroundColor: "hsla(0, 0%, 100%, 1.00)",
    height: 40,
    paddingHorizontal: 15,
    borderRadius: 35,
    color: "#000",
  },

  card: {
    flexDirection: "row",
    backgroundColor: "#f9f9f9",
    borderRadius: 15,
    padding: 10,
    marginBottom: 15,
    alignItems: "center",
    elevation: 3,
  },

  image: { width: 80, height: 80, borderRadius: 10, backgroundColor: "#eee" },
  details: { flex: 1, marginLeft: 10 },
  cuisine: { fontSize: 12, color: "black" },
  name: { fontSize: 15, fontWeight: "600", color: "black" },

  row: { flexDirection: "row", alignItems: "center", marginTop: 4 },
  totalText: { fontSize: 16, fontWeight: "bold", color: "#eb2626ff" },
  totalPrice:{fontSize: 16, fontWeight: "bold", color: "#0e0d0dff"},
  qtyValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
    marginHorizontal: 15,
  },
  selectedOption: {
    backgroundColor: "#FF4D4D",
    borderColor: "#FF4D4D",
  },
  optionTextSelected: { color: "#fff", fontWeight: "700" },
  qtyText: { fontSize: 18, fontWeight: "bold", color: "#FF4D4D" },
  typeBox: {
    width: 14,
    height: 14,
    borderWidth: 1,
    marginRight: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  typeDot: { width: 7, height: 7, borderRadius: 7 },

  priceText: { color: "#000", marginTop: 4, fontSize: 13 },
  rating: {
    marginTop: 4,
    backgroundColor: "green",
    color: "#fff",
    paddingHorizontal: 8,
    borderRadius: 10,
    fontSize: 10,
    alignSelf: "flex-start",
  },

  addBtn: {
    backgroundColor: "#FF4D4D",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    alignSelf: "center",
    marginLeft: 8,
  },
  addText: { color: "#fff", fontWeight: "600" },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  modalFoodName: { fontSize: 16, fontWeight: "bold", color: "#000" },
  modalFoodPrice: { fontSize: 14, color: "#777", marginTop: 4 },
  modalHandle: {
    width: 50,
    height: 5,
    borderRadius: 3,
    backgroundColor: "#ccc",
    alignSelf: "center",
    marginBottom: 10,
  },
  modalBox: {
    backgroundColor: "#fff",
    padding: 20,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
  },
  modalHeader: { flexDirection: "row" },
  modalImg: { width: 70, height: 70, borderRadius: 10, backgroundColor: "#eee" },
  modalName: { fontSize: 17, fontWeight: "700" },
  modalCuisine: { fontSize: 14, color: "#555" },
  modalDescription: { marginTop: 10, color: "#444" },

  optionRow: { flexDirection: "row", marginTop: 5 },
  optionBtn: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderRadius: 8,
    marginRight: 10,
  },
  optionSelected: {
    backgroundColor: "#e82b2b",
    borderColor: "#ff6600",
  },
  optionText: { color: "#000" },
  optionTextSel: { color: "#fff", fontWeight: "bold" },

  // staticPrice: { marginTop: 5, color: "#000", fontSize: 14 },
  staticPrice: { fontSize: 16, color: "#222222", fontWeight: "700", marginBottom: 10 },
  quantityBox: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F1F1F1",
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
  qtySign: { fontSize: 18, color: "#FF4D4D", fontWeight: "bold" },
  qtyTextValue: { marginHorizontal: 15, fontSize: 16, fontWeight: "bold" },

  modalFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
   
  },
  totalText: { fontSize: 16, fontWeight: "700" },
  confirmBtn: {
    backgroundColor: "#FF4D4D",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
  },
  confirmBtnText: { color: "#fff", fontSize: 15, fontWeight: "700" },

  shimmerRow: { height: 90, borderRadius: 10, marginVertical: 8 },

  bottomBox: {
    position: "absolute",
    bottom: 60,
    width: "100%",
    paddingHorizontal: 16,
  },
  bottomGradient: { padding: 15, borderRadius: 20 },
  bottomMsg: { color: "#fff", textAlign: "center", marginBottom: 10 },
  bottomBtn: {
    backgroundColor: "#fff",
    paddingVertical: 8,
    paddingHorizontal: 30,
    borderRadius: 20,
    alignSelf: "center",
  },
  bottomBtnText: { fontWeight: "700", color: "red" },
});
