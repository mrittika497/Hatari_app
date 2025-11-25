import React, { useEffect, useState, useRef } from "react";
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
import { fetchSubCategories } from "../redux/slice/subCategoriSlice";
import { useNavigation } from "@react-navigation/native";

const HomeCatModal = ({
  visible,
  onClose,
  title = "What Are You Craving?",
  cuisineType,
  onSelect,
}) => {
  const dispatch = useDispatch();

  const [selectedCategory, setSelectedCategory] = useState(null);
const navigation = useNavigation()
  const categoriesState = useSelector((state) => state.categories);
  const categoriesData = categoriesState?.categories?.foods;

  // Fetch categories when modal opens
  useEffect(() => {
    if (visible && cuisineType) {
      dispatch(fetchAllCategories(cuisineType));
    }
  }, [visible, cuisineType]);

  // Category clicked
const handleCategoryClick = (item) => {
  setSelectedCategory(item);

  navigation.navigate("CuisineTypeSubCat", { id: item?._id, cuisineType});

  onClose?.();
};


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
              {categoriesData?.map((item, index) => (
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

                  <Text style={styles.name} numberOfLines={1}>
                    {item?.name}
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
