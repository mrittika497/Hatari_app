import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  TextInput,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import LinearGradient from "react-native-linear-gradient";
import ShimmerPlaceholder from "react-native-shimmer-placeholder";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { fetchFoodPagination } from "../../redux/slice/SearchFoodPaginationSlice";
import { fetchSearchResults, setSearchQuery } from "../../redux/slice/searchSlice";

const { width } = Dimensions.get("window");

const MenuScreen = () => {
  const dispatch = useDispatch();
  const shimmerRef = useRef(null);

  const [isVeg, setIsVeg] = useState(true);

  const { AllFoodsData, page, hasMore, loading: paginationLoading } = useSelector(
    (state) => state.FoodPagination
  );
  console.log(AllFoodsData,"-------------------AllFoodsData");
  
  const { results, query, loading: searchLoading } = useSelector((state) => state.search);
  console.log(query, "=================search results");
 const resultnames = results.map(item => item.food?.name || item.name);
 console.log(resultnames, "=================search result names");

  // ✅ Initial data load
  useEffect(() => {
    dispatch(fetchFoodPagination({ page: 1, limit: 10, isVeg,name:query }));
  }, [dispatch,]);

  // ✅ Infinite scroll
  const handleLoadMore = () => {
    if (!paginationLoading && hasMore && !query.trim()) {
      dispatch(fetchFoodPagination({ page: page + 1, limit: 10, isVeg }));
    }
  };

  // ✅ Debounced search
  useEffect(() => {
    const delay = setTimeout(() => {
      if (query.trim().length > 0) {
        dispatch(fetchSearchResults(query));
      }
    }, 500);
    return () => clearTimeout(delay);
  }, [query, dispatch]);

  // ✅ Choose data to show
  const dataToRender =
    query.trim().length > 0
      ? results
      : AllFoodsData.filter((item) => {
          const type = item?.food?.type?.toLowerCase() || "";
          return isVeg
            ? type === "veg"
            : type === "non-veg" || type === "nonveg" || type === "";
        });

  // ✅ Shimmer Loader
  const renderShimmerItem = () => (
    <View style={styles.card}>
      <ShimmerPlaceholder ref={shimmerRef} style={styles.image} LinearGradient={LinearGradient} />
      <View style={{ padding: 8 }}>
        <ShimmerPlaceholder style={styles.textShimmer} LinearGradient={LinearGradient} />
        <ShimmerPlaceholder style={styles.textShimmerSmall} LinearGradient={LinearGradient} />
      </View>
    </View>
  );

  // ✅ Render Each Item
  const renderItem = ({ item }) => {
    const food = item.food || item;
    return (
      <TouchableOpacity style={styles.card}>
        <Image
          source={{ uri: food?.image || "https://via.placeholder.com/150" }}
          style={styles.image}
        />
        <View style={styles.info}>
          <Text style={styles.foodName}>{food?.name}</Text>
          <Text style={styles.desc} numberOfLines={2}>
            {food?.description || "Delicious food item"}
          </Text>
          <View style={styles.bottomRow}>
            <Text style={styles.price}>₹{food?.priceInfo?.staticPrice || "—"}</Text>
            <View style={styles.ratingBox}>
              <Ionicons name="star" size={14} color="white" />
              <Text style={styles.ratingText}>{food?.rating || "4.3"}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderFooter = () =>
    !paginationLoading || query.trim().length > 0 ? null : (
      <ActivityIndicator style={{ marginVertical: 16 }} size="small" color="#FF6B00" />
    );

  return (
    <View style={styles.container}>
      {/* 🔍 Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#888" style={{ marginHorizontal: 8 }} />
        <TextInput
          placeholder="Search food..."
          placeholderTextColor="#999"
          value={query}
          onChangeText={(text) => dispatch(setSearchQuery(text))}
          style={styles.searchInput}
        />
        {query.length > 0 && (
          <TouchableOpacity onPress={() => dispatch(setSearchQuery(""))}>
            <Ionicons name="close" size={20} color="#666" style={{ marginHorizontal: 8 }} />
          </TouchableOpacity>
        )}
      </View>

   

      {/* 🍴 Food List */}
      {searchLoading && query.trim().length > 0 ? (
        <FlatList
          data={[1, 2, 3, 4, 5]}
          keyExtractor={(item) => `shimmer-${item}`}
          renderItem={renderShimmerItem}
        />
      ) : (
        <FlatList
          data={dataToRender}
          keyExtractor={(item, index) => `food-${item?.food?._id || item?._id || index}`}
          renderItem={renderItem}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.3}
          ListFooterComponent={renderFooter}
          contentContainerStyle={{ paddingBottom: 150 }}
          ListEmptyComponent={
            <Text style={styles.noResults}>
              {query.trim().length > 0
                ? "😔 No results found for your search."
                : "🍽 No food items available right now."}
            </Text>
          }
        />
      )}
    </View>
  );
};

export default MenuScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    margin: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    backgroundColor: "#f7f7f7",
  },
  searchInput: { flex: 1, fontSize: 15, paddingVertical: 8, color: "#333" },
  toggleContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
    marginBottom: 10,
  },
  toggleButton: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 14,
    backgroundColor: "#fff",
    elevation: 1,
  },
  activeToggle: { backgroundColor: "#FF6B00", borderColor: "#FF6B00" },
  toggleText: { fontSize: 14, color: "#333", marginLeft: 6 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    margin: 10,
    overflow: "hidden",
    elevation: 3,
  },
  image: { width: "100%", height: width * 0.4 },
  info: { padding: 10 },
  foodName: { fontSize: 16, fontWeight: "600", color: "#222" },
  desc: { fontSize: 13, color: "#666", marginVertical: 4 },
  bottomRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  price: { fontSize: 15, fontWeight: "600", color: "#333" },
  ratingBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#4CAF50",
    borderRadius: 12,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  ratingText: { fontSize: 12, color: "white", marginLeft: 3 },
  textShimmer: { height: 15, width: "80%", borderRadius: 8, marginVertical: 4 },
  textShimmerSmall: { height: 12, width: "50%", borderRadius: 8, marginVertical: 4 },
  noResults: { textAlign: "center", marginTop: 80, fontSize: 15, color: "#999" },
});
