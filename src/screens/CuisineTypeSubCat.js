import React, { useEffect, useState, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  TouchableOpacity,
  Dimensions,
  Animated,
  TouchableWithoutFeedback,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { fetchSubCategories } from "../redux/slice/subCategoriSlice";
import { fetchAllCategories } from "../redux/slice/GetAllCategorySlice";
import { useRoute } from "@react-navigation/native";
import DashboardScreen from "../components/DashboardScreen";
import CustomHeader from "../components/CustomHeader";
import LinearGradient from "react-native-linear-gradient";
import Ionicons from "react-native-vector-icons/Ionicons";

const { width, height } = Dimensions.get("window");

const CuisineTypeSubCat = ({ navigation }) => {
  const route = useRoute();
  const { id, cuisineType } = route.params || {};

  const dispatch = useDispatch();

  // ✅ Redux selectors
  const isVeg = useSelector(state => state.foodFilter.isVeg);
  const subcategories = useSelector(state => state.subCategories);
  const categoriesState = useSelector(state => state.categoriesAllcat);

  // ✅ Local state
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(id);

  const slideAnim = useRef(new Animated.Value(width)).current;

  // ✅ Data
  const subcateData = subcategories?.data || [];
  const categoriesData =
    categoriesState?.categories?.categories || [];

  // ✅ Veg / Non-Veg filter
  const filteredCategories = categoriesData.filter(item => {
    if (!item?.type) return !isVeg;

    const types = Array.isArray(item.type)
      ? item.type.map(t => t.toLowerCase())
      : [String(item.type).toLowerCase()];

    return isVeg ? types.includes("veg") : !types.includes("veg");
  });

  console.log(filteredCategories,"---------------------filteredCategories");
  

  // ✅ Fetch subcategories & categories
  useEffect(() => {
    if (selectedCategory) {
      dispatch(
        fetchSubCategories({
          page: 1,
          limit: 100,
          categoryId: selectedCategory,
        })
      );
    }

    if (cuisineType?._id) {
      dispatch(
        fetchAllCategories({
          mainCategory: cuisineType._id,
          type: isVeg ? "veg" : "non-veg",
        })
      );
    }
  }, [selectedCategory, cuisineType, isVeg]);

  // ✅ Animate side menu
  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: menuOpen ? width - 220 : width,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [menuOpen]);

  // ✅ Subcategory card
  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() =>
          navigation.navigate("TopPicksScreen", {
            categoryId: item?._id,
            categoryName: item?.name,
            cuisineType,
          })
        }
      >
        <LinearGradient
          colors={["#ff6b6b", "#fbededff"]}
          style={styles.touchCard}
        >
          <Image source={{ uri: item.image }} style={styles.image} />
          <Text style={styles.name} numberOfLines={1}>
            {item.name}
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );

  const handleCategorySelect = catId => {
    setSelectedCategory(catId);
    setMenuOpen(false);
  };

  return (
    <View style={{ flex: 1 }}>
      <CustomHeader title="Sub-categories" />

      <DashboardScreen scrollEnabled={false}>
        <FlatList
          data={subcateData}
          keyExtractor={item => item._id}
          renderItem={renderItem}
          numColumns={3}
          contentContainerStyle={styles.grid}
          showsVerticalScrollIndicator={false}
        />
      </DashboardScreen>

      {/* Overlay */}
      {menuOpen && (
        <TouchableWithoutFeedback onPress={() => setMenuOpen(false)}>
          <View style={styles.overlay} />
        </TouchableWithoutFeedback>
      )}

      {/* Floating Menu Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => setMenuOpen(true)}
        activeOpacity={0.8}
      >
        <Ionicons name="menu" size={28} color="#fff" />
      </TouchableOpacity>

      {/* Side Menu */}
      <Animated.View style={[styles.sideBox, { left: slideAnim }]}>
        <View style={styles.sideHeader}>
          <Text style={styles.sideTitle}>Categories</Text>
          <TouchableOpacity onPress={() => setMenuOpen(false)}>
            <Ionicons name="close" size={28} color="#333" />
          </TouchableOpacity>
        </View>

        <FlatList
          data={filteredCategories}
          keyExtractor={item => item._id}
          contentContainerStyle={{ paddingBottom: 50 }}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.sideItem,
                item._id === selectedCategory && styles.activeSideItem,
              ]}
              onPress={() => handleCategorySelect(item._id)}
            >
              {item.image && (
                <Image source={{ uri: item.image }} style={styles.sideIcon} />
              )}
              <Text
                style={[
                  styles.sideItemText,
                  item._id === selectedCategory && {
                    color: "#ff6b6b",
                    fontWeight: "700",
                  },
                ]}
              >
                {item.name}
              </Text>
            </TouchableOpacity>
          )}
        />
      </Animated.View>
    </View>
  );
};

export default CuisineTypeSubCat;


const styles = StyleSheet.create({
  grid: {
    paddingHorizontal: 15,
    paddingTop: 20,
  },
  card: {
    flex: 1 / 3,
    alignItems: "center",
    marginBottom: 20,
  },
  touchCard: {
    alignItems: "center",
    borderRadius: 15,
    paddingVertical: 10,
    width: width / 3 - 25,
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginBottom: 8,
    borderWidth: 2,
    borderColor: "#fff",
    resizeMode: "cover",
  },
  name: {
    fontSize: 14,
    fontWeight: "600",
    color: "#fff",
    textAlign: "center",
    textShadowColor: "rgba(0,0,0,0.3)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  fab: {
    position: "absolute",
    bottom: 30,
    right: 20,
    zIndex: 20,
    backgroundColor: "#ff6b6b",
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 10,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 5,
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width: width,
    height: height,
    backgroundColor: "rgba(0,0,0,0.3)",
    zIndex: 10,
  },
  sideBox: {
    position: "absolute",
    top: 0,
    width: 220,
    height: height,
    backgroundColor: "#fff",
    borderTopLeftRadius: 15,
    borderBottomLeftRadius: 15,
    padding: 15,
    elevation: 10,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: -2, height: 2 },
    shadowRadius: 6,
    zIndex: 15,
  },
  sideHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  sideTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#333",
  },
  sideItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: "#eee",
  },
  activeSideItem: {
    backgroundColor: "#fff0f0",
    borderRadius: 8,
  },
  sideItemText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#555",
  },
  sideIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 10,
  },
});
