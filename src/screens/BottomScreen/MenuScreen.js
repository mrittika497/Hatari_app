// src/screens/MenuScreen.js

import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  SafeAreaView,
  TextInput,
} from "react-native";
import ShimmerPlaceHolder from "react-native-shimmer-placeholder";
import LinearGradient from "react-native-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";

import DashboardScreen from "../../components/DashboardScreen";
import CustomHeader from "../../components/CustomHeader";
import Theme from "../../assets/theme";
import SmallbtnReuseable from "../../components/SmallbtnReuseable";

const categories = ["Chinese", "Indian", "Tandoor", "Top Picks"];

const dummyData = [
  {
    id: "1",
    name: "Mixed Hakka Noodles",
    price: 340,
    rating: 4.3,
    reviews: "2.1k",
    type: "veg",
    image:
      "https://www.indianhealthyrecipes.com/wp-content/uploads/2021/07/hakka-noodles.jpg",
  },
  {
    id: "2",
    name: "Mixed Fried Rice",
    price: 370,
    rating: 4.4,
    reviews: "2.3k",
    type: "veg",
    image: "https://static.toiimg.com/thumb/75511788.cms?width=1200&height=900",
  },
  {
    id: "3",
    name: "Chicken Manchurian",
    price: 220,
    rating: 4.1,
    reviews: "2.4k",
    type: "non-veg",
    image: "https://static.toiimg.com/photo/53098316.cms",
  },
  {
    id: "4",
    name: "Chilli Prawn",
    price: 510,
    rating: 4.0,
    reviews: "2.3k",
    type: "non-veg",
    image: "https://static.toiimg.com/photo/84862375.cms",
  },
];

const MenuScreen = () => {
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("Chinese");
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const navigation = useNavigation();

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setItems(dummyData);
      setLoading(false);
    }, 2000);
  }, []);

  // Filter items by search
  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  const renderShimmerItem = () => (
    <View style={styles.card}>
      <ShimmerPlaceHolder
        LinearGradient={LinearGradient}
        style={styles.shimmerImage}
      />
      <View style={{ flex: 1, marginLeft: 10 }}>
        <ShimmerPlaceHolder
          LinearGradient={LinearGradient}
          style={styles.shimmerLine}
        />
        <ShimmerPlaceHolder
          LinearGradient={LinearGradient}
          style={[styles.shimmerLine, { width: "40%" }]}
        />
        <ShimmerPlaceHolder
          LinearGradient={LinearGradient}
          style={[styles.shimmerLine, { width: "30%" }]}
        />
      </View>
    </View>
  );

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      {/* Food Image */}
      <View>
        <Image source={{ uri: item.image }} style={styles.image} />

  
      </View>

      {/* Details */}
      <View style={styles.details}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          {/* Veg / Non-Veg Icon */}
          <View
            style={[
              styles.typeIndicator,
              { borderColor: item.type === "veg" ? "green" : "red" },
            ]}
          >
            <View
              style={[
                styles.typeDot,
                { backgroundColor: item.type === "veg" ? "green" : "red" },
              ]}
            />
          </View>
          <Text style={styles.name}>{item.name}</Text>
        </View>

        <Text style={styles.price}>₹{item.price}</Text>

        {/* Rating */}
        <View style={styles.ratingWrapper}>
          <Ionicons name="star" size={14} color="green" />
          <Text style={styles.ratingText}>
            {item.rating} ({item.reviews})
          </Text>
        </View>
      </View>

      {/* Right Side Button */}
      <SmallbtnReuseable
        title="Add"
        style={styles.addButton}
        onPress={() => navigation.navigate("FoodDetailScreen", { item })}
      />
    </View>
  );

  return (
    <DashboardScreen>
      <CustomHeader title="Menu" />
      <SafeAreaView style={styles.container}>
        {/* Categories */}
        <View style={styles.tabContainer}>
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[styles.tab, activeCategory === cat && styles.activeTab]}
              onPress={() => setActiveCategory(cat)}
            >
              <Text
                style={[
                  styles.tabText,
                  activeCategory === cat && styles.activeTabText,
                ]}
              >
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Search Section */}
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
            <TouchableOpacity onPress={() => setSearch("")}>
              <Ionicons name="close-circle" size={20} color="gray" />
            </TouchableOpacity>
          )}
        </View>

        {/* Section Title */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Best Selling {activeCategory}</Text>
        </View>

        {/* Food List */}
        {loading ? (
          <FlatList
            data={[1, 2, 3, 4]}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderShimmerItem}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <FlatList
            data={filteredItems}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <Text style={styles.noResults}>No items found</Text>
            }
          />
        )}
      </SafeAreaView>
    </DashboardScreen>
  );
};

export default MenuScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 30,
  },
  tabContainer: {
    flexDirection: "row",
    marginBottom: 30,
    marginHorizontal: 10,
  },
  tab: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#ddd",
    marginRight: 10,
  },
  activeTab: {
    backgroundColor: "#f44336",
    borderColor: "#f44336",
  },
  tabText: {
    fontSize: 14,
    color: "#555",
  },
  activeTabText: {
    color: "#fff",
    fontWeight: "bold",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f1f1f1",
    borderRadius: 10,
    marginHorizontal: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginBottom: 10,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
    color: "#333",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 10,
    marginHorizontal: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 10,
    marginHorizontal: 10,
    marginVertical: 6,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 4,
    elevation: 2,
      alignItems: "center", 
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 10,
  },
  heartIcon: {
    position: "absolute",
    top: 5,
    right: 5,
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 4,
    elevation: 2,
  },
  details: {
    flex: 1,
    marginLeft: 10,
    justifyContent: "center",
  },
  name: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#333",
    marginLeft: 6,
  },
  price: {
    fontSize: 14,
    color: "#000",
    fontWeight: "bold",
    marginTop: 4,
  },
  ratingWrapper: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  ratingText: {
    fontSize: 12,
    color: "green",
    fontWeight: "600",
    marginLeft: 4,
  },
  typeIndicator: {
    width: 16,
    height: 16,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  typeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },

  shimmerImage: {
    width: 70,
    height: 70,
    borderRadius: 10,
  },
  shimmerLine: {
    width: "60%",
    height: 15,
    marginBottom: 6,
    borderRadius: 5,
  },
  noResults: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 14,
    color: "#666",
  },
});
