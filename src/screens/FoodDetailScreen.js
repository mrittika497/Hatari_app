import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import ShimmerPlaceholder from "react-native-shimmer-placeholder";
import LinearGradient from "react-native-linear-gradient";
import DashboardScreen from "../components/DashboardScreen";
import CustomHeader from "../components/CustomHeader";


const FoodDetailScreen = ({navigation}) => {
  // const navigation = useNavigation();

  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    // Simulate API loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (

    <DashboardScreen>
      <CustomHeader title="Item Details" />
      {/* Food Image with Shimmer */}
      <ShimmerPlaceholder
        LinearGradient={LinearGradient}
        visible={!loading}
        style={styles.image}
      >
        <Image
          source={require("../assets/images/remove/Chicken.png")}
          style={styles.image}
        />
      </ShimmerPlaceholder>

      {/* Content */}
      <View style={styles.content}>
        <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 5 }}>
          <Image source={require("../assets/images/dineBlack.png")} style={{ height: 12, width: 12 }} />
          <Text style={styles.category}>Indian</Text>
        </View>

        <Text style={styles.title}>Bhetki Fish Fry</Text>

        {/* Tag and Rating */}
        <View style={styles.row}>
          <View style={styles.nonVegTag}>
            <Text style={styles.nonVegText}>Non Veg</Text>
          </View>
          <View style={styles.ratingBox}>
            <Text style={styles.ratingText}>2.6K</Text>
          </View>
          <View style={[styles.ratingBox, { backgroundColor: "#4CAF50" }]}>
            <Text style={styles.ratingText}>4.6</Text>
          </View>
        </View>

        {/* Description */}
        <Text style={styles.sectionTitle}>Description</Text>
        <Text style={styles.description}>
          It is a long established fact that a reader will be distracted by the
          readable content of a page when looking at its layout. The point of
          using Lorem Ipsum is that it has a more-or-less normal distribution.
        </Text>

        {/* Price */}
        <Text style={styles.price}>₹160 pcs.</Text>

        {/* Quantity and Add Button */}
        <View style={styles.bottomRow}>
          <View style={styles.quantityBox}>
            <TouchableOpacity
              style={styles.qtyBtn}
              onPress={() => setQuantity(quantity > 1 ? quantity - 1 : 1)}
            >
              <Text style={styles.qtyText}>-</Text>
            </TouchableOpacity>
            <Text style={styles.qtyValue}>{quantity}</Text>
            <TouchableOpacity
              style={styles.qtyBtn}
              onPress={() => setQuantity(quantity + 1)}
            >
              <Text style={styles.qtyText}>+</Text>
            </TouchableOpacity>
          </View>
           <TouchableOpacity style={styles.addBtn}
              onPress={() => navigation.navigate("Bottom", { screen: "CartScreen" })}
            >
            <Text style={styles.addBtnText}>Add</Text>
          </TouchableOpacity> 
          {/* <SmallbtnReuseable/> */}
          {/* <ReusableBtn onPress={navigation.navigate("HomeScreen")}/> */}
        </View>
      </View>

    </DashboardScreen>
  );
};

export default FoodDetailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  image: {
    width: "100%",
    height: 300,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    marginTop: 10
  },
  content: {
    marginVertical: 20
  },
  category: {
    fontSize: 14,
    color: "#333",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
    marginVertical: 8,
    marginBottom: 20
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  nonVegTag: {
    backgroundColor: "#FF4D4D",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    marginRight: 8,
  },
  nonVegText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  ratingBox: {
    backgroundColor: "#E0E0E0",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 5,
    marginRight: 6,
  },
  ratingText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 10,
    color: "#000",
  },
  description: {
    fontSize: 14,
    color: "#555",
    marginBottom: 20,
  },
  price: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 30,
  },
  bottomRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  quantityBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F1F1F1",
    borderRadius: 25,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginRight: 15,
  },
  qtyBtn: {
    width: 30,
    height: 30,
    backgroundColor: "#fff",
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    elevation: 2,
  },
  qtyText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FF4D4D",
  },
  qtyValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
    marginHorizontal: 10,
  },
  addBtn: {
    flex: 1,
    backgroundColor: "#FF4D4D",
    borderRadius: 25,
    paddingVertical: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  addBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
