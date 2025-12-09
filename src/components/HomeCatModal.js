import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
  Image,
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
  const categoriesState = useSelector((state) => state.categories);
  const categoriesData = categoriesState?.categories?.foods || [];

  useEffect(() => {
    if (visible && cuisineType) {
      dispatch(fetchAllCategories(cuisineType));
    }
  }, [visible, cuisineType]);

  const handleCategoryClick = (item) => {
    navigation.navigate("CuisineTypeSubCat", { id: item?._id, cuisineType });
    onClose?.();
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
          <LinearGradient colors={["#ff3b3b", "#ffc9c9"]} style={styles.header}>
            <Text style={styles.headerTitle}>{title}</Text>

            <TouchableOpacity onPress={onClose}>
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
          </LinearGradient>

          {/* CATEGORY GRID */}
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.grid}>
              {filteredFoods.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.card}
                  onPress={() => handleCategoryClick(item)}
                >
                  <LinearGradient
                    colors={["#ffecec", "#ffffff"]}
                    style={styles.categoryCircle}
                  >
                    <Image
                      source={{ uri: item.image }}
                      style={styles.foodImage}
                    />
                  </LinearGradient>

                  {/* CLEAN CATEGORY NAME */}
               <Text style={styles.name} numberOfLines={1}>
  {item?.name
    ?.replace(/\s*\(veg\)/gi, "")        // remove (veg)
    ?.replace(/\s*\(nonveg\)/gi, "")     // remove (nonveg)
    ?.replace(/\s*\(non-veg\)/gi, "")    // remove (non-veg)
    ?.replace(/\bveg\b/gi, "")           // remove word veg
    ?.replace(/\bnonveg\b/gi, "")        // remove nonveg
    ?.replace(/\bnon-veg\b/gi, "")       // remove non-veg
    ?.replace(/[()]/g, "")               // remove any leftover brackets
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
  backdrop: {
    flex: 1,
  },
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
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#fff",
  },
  closeText: {
    fontSize: 24,
    color: "#fff",
    fontWeight: "700",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    paddingTop: 12,
  },
  card: {
    width: "30%",
    alignItems: "center",
    marginBottom: 25,
  },
  categoryCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    elevation: 5,
  },
  foodImage: {
    width: 75,
    height: 75,
    borderRadius: 40,
  },
  name: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginTop: 8,
    textAlign: "center",
  },
});
