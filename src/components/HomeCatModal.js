// HomeCatModal.js
import React, { useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
  Image,
  ActivityIndicator,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllCategories } from "../redux/slice/GetAllCategorySlice";
import { useNavigation } from "@react-navigation/native";

const HomeCatModal = ({
  visible,
  onClose,
  title = "What Are You Craving?",
  cuisineType,
}) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const isVeg = useSelector((state) => state.foodFilter.isVeg);
  const categoriesState = useSelector((state) => state.categoriesAllcat);
  console.log("---------------------categoriesState",categoriesState);
  const categories = useSelector((state) => state.categoriesAllcat);
  console.log(categories,"---------------------categories");
  
  const categoriesData = categoriesState?.categories?.foods || [];

useEffect(() => {
  if (visible && cuisineType) {
    dispatch(fetchAllCategories({ mainCategory: cuisineType, type: 'Nob-veg' }) );
  }
}, [visible, cuisineType]);


  const handleCategoryClick = (item) => {
    navigation.navigate("CuisineTypeSubCat", { id: item?._id, cuisineType });
    onClose?.();
  };

  const capitalizeFirstWord = (text) => {
    if (!text) return "";
    const str = String(text);
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const filteredFoods = categoriesData.filter((item) => {
    const type = item?.type?.toLowerCase() || "";
    return isVeg ? type === "veg" : type !== "veg";
  });

  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.backdrop} onPress={onClose} />

        <View style={styles.container}>
          {/* HEADER */}
          <LinearGradient
            colors={["#ff3b3b", "#ffc9c9"]}
            style={styles.header}
          >
            <Text style={styles.headerTitle}>{capitalizeFirstWord(title)}</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
          </LinearGradient>

          {/* CATEGORY GRID */}
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 25 }}
          >
            <View style={styles.grid}>
              {categoriesState.loading
                ? Array.from({ length: 6 }).map((_, i) => (
                    <View key={i} style={styles.loadingCard} />
                  ))
                : filteredFoods.map((item, index) => (
                    <TouchableOpacity
                      key={index}
                      style={styles.card}
                      activeOpacity={0.8}
                      onPress={() => handleCategoryClick(item)}
                    >
                      <LinearGradient
                        colors={["#ffecec", "#fff0f0"]}
                        style={styles.categoryCircle}
                      >
                        <Image
                          source={{ uri: item.image }}
                          style={styles.foodImage}
                        />
                      </LinearGradient>

                      <Text style={styles.name} numberOfLines={1}>
                        {item?.name
                          ?.replace(/\s*\(veg\)/gi, "")
                          ?.replace(/\s*\(nonveg\)/gi, "")
                          ?.replace(/\s*\(non-veg\)/gi, "")
                          ?.replace(/\bveg\b/gi, "")
                          ?.replace(/\bnonveg\b/gi, "")
                          ?.replace(/\bnon-veg\b/gi, "")
                          ?.replace(/[()]/g, "")
                          ?.trim()}
                      </Text>
                    </TouchableOpacity>
                  ))}
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default HomeCatModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "flex-end",
  },
  backdrop: { flex: 1 },
  container: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    maxHeight: "83%",
    elevation: 15,
  },
  header: {
    paddingVertical: 18,
    paddingHorizontal: 22,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    elevation: 5,
  },
  headerTitle: { fontSize: 20, fontWeight: "700", color: "#fff" },
  closeText: { fontSize: 24, color: "#fff", fontWeight: "700" },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    paddingTop: 12,
  },
  loadingCard: {
    width: "30%",
    height: 120,
    borderRadius: 48,
    backgroundColor: "#f0f0f0",
    marginBottom: 25,
    marginHorizontal: 5,
    elevation: 3,
  },
  card: {
    width: "30%",
    alignItems: "center",
    marginBottom: 25,
    borderRadius: 45,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  categoryCircle: {
    width: 95,
    height: 95,
    borderRadius: 48,
    justifyContent: "center",
    alignItems: "center",
    elevation: 6,
  },
  foodImage: {
    width: 75,
    height: 75,
    borderRadius: 37,
    borderWidth: 2,
    borderColor: "#fff",
  },
  name: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginTop: 8,
    textAlign: "center",
  },
});
