import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  Dimensions,
} from "react-native";
import DashboardScreen from "../../components/DashboardScreen";
import CustomHeader from "../../components/CustomHeader";
import ShimmerPlaceHolder from "react-native-shimmer-placeholder";
import LinearGradient from "react-native-linear-gradient";
import ReusableBtn from "../../components/ReuseableBtn";
import Theme from "../../assets/theme";
import { useNavigation } from "@react-navigation/native";

const { width } = Dimensions.get("window");

const OrdersScreen = () => {
  const navigation = useNavigation();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setCartItems([
        {
          id: "1",
          name: "Bhetki Fish Fry",
          price: 320,
          quantity: 2,
          image: require("../../assets/images/remove/Chicken.png"),
          type: "nonveg",
        },
        {
          id: "2",
          name: "Chicken Dum Biriyani",
          price: 580,
          quantity: 2,
          image: require("../../assets/images/remove/Chicken.png"),
          type: "nonveg",
        },
        {
          id: "3",
          name: "Ice cream with brownie",
          price: 180,
          quantity: 1,
          image: require("../../assets/images/remove/Chicken.png"),
          type: "veg",
        },
      ]);
      setLoading(false);
    }, 2000);
  }, []);

  const incrementQty = (id) => {
    const updated = cartItems.map((item) =>
      item.id === id ? { ...item, quantity: item.quantity + 1 } : item
    );
    setCartItems(updated);
  };

  const decrementQty = (id) => {
    const updated = cartItems.map((item) =>
      item.id === id && item.quantity > 1
        ? { ...item, quantity: item.quantity - 1 }
        : item
    );
    setCartItems(updated);
  };

  const deleteItem = (id) => {
    const updated = cartItems.filter((item) => item.id !== id);
    setCartItems(updated);
  };

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const gst = 40;
  const packingFee = 20;
  const grandTotal = totalPrice + gst + packingFee;

  const formatCurrency = (amount) => `₹${amount.toLocaleString("en-IN")}`;

  const renderItem = ({ item }) => (
    <View style={styles.itemCard}>
      {/* Item Image */}
      <Image source={item.image} style={styles.itemImage} />

      {/* Item Details */}
      <View style={styles.detailsContainer}>
        <View style={styles.itemTopRow}>
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
          <Text style={styles.itemName} numberOfLines={1}>
            {item.name}
          </Text>
        </View>
        <Text style={styles.itemPrice}>{formatCurrency(item.price)}</Text>
      </View>

      {/* Quantity Controls + Delete Button */}
      <View style={styles.rightContainer}>
        <TouchableOpacity
          style={styles.deleteBtn}
          onPress={() => deleteItem(item.id)}
        >
          <Image
            source={require("../../assets/images/trash.png")}
            style={{ width: 18, height: 18 }}
          />
        </TouchableOpacity>

        <View style={styles.quantityBox}>
          <TouchableOpacity
            style={styles.qtyBtn}
            onPress={() => decrementQty(item.id)}
          >
            <Text style={styles.qtyText}>-</Text>
          </TouchableOpacity>
          <Text style={styles.qtyValue}>{item.quantity}</Text>
          <TouchableOpacity
            style={styles.qtyBtn}
            onPress={() => incrementQty(item.id)}
          >
            <Text style={styles.qtyText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const renderSkeleton = () => (
    <View style={styles.itemCard}>
      <ShimmerPlaceHolder
        LinearGradient={LinearGradient}
        style={{ width: 70, height: 70, borderRadius: 8 }}
      />
      <View style={{ flex: 1, marginLeft: 10 }}>
        <ShimmerPlaceHolder
          LinearGradient={LinearGradient}
          style={{
            width: width * 0.4,
            height: 14,
            borderRadius: 4,
            marginBottom: 6,
          }}
        />
        <ShimmerPlaceHolder
          LinearGradient={LinearGradient}
          style={{ width: width * 0.2, height: 14, borderRadius: 4 }}
        />
      </View>
      <ShimmerPlaceHolder
        LinearGradient={LinearGradient}
        style={{ width: 80, height: 30, borderRadius: 20 }}
      />
    </View>
  );

  return (
    <DashboardScreen scrollable={false}>
      <CustomHeader title="My Orders" />
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.addMore}
          onPress={() => navigation.navigate("HomeScreen")}
        >
          <Text style={{ color: Theme.colors.red, fontWeight: "600" }}>
            + Add more Items
          </Text>
        </TouchableOpacity>

        {loading ? (
          <>
            {Array.from({ length: 3 }).map((_, index) => (
              <View key={index}>{renderSkeleton()}</View>
            ))}
          </>
        ) : cartItems.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Your cart is empty</Text>
          </View>
        ) : (
          <FlatList
            data={cartItems}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            contentContainerStyle={{ paddingBottom: 10 }}
          />
        )}

        {!loading && cartItems.length > 0 && (
          <>
            <View style={styles.billSection}>
              <View style={styles.billRow}>
                <Text style={styles.billText}>Total</Text>
                <Text style={styles.billAmount}>
                  {formatCurrency(totalPrice)}
                </Text>
              </View>
              <View style={styles.billRow}>
                <Text style={styles.billText}>GST</Text>
                <Text style={styles.billAmount}>{formatCurrency(gst)}</Text>
              </View>
              <View style={styles.billRow}>
                <Text style={styles.billText}>Packing fee</Text>
                <Text style={styles.billAmount}>
                  {formatCurrency(packingFee)}
                </Text>
              </View>
              <View style={styles.dashedLine} />
              <View style={styles.billRow}>
                <Text style={[styles.billText, { fontWeight: "700" }]}>
                  Grand Total
                </Text>
                <Text style={[styles.billAmount, { fontWeight: "700" }]}>
                  {formatCurrency(grandTotal)}
                </Text>
              </View>
            </View>
            <ReusableBtn title="Pay" />
          </>
        )}
      </View>
    </DashboardScreen>
  );
};

export default OrdersScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    marginTop: 10,
    // paddingHorizontal: 16,
    flex: 1,
  },
  addMore: {
    alignSelf: "flex-end",
    marginVertical: 10,
    marginBottom: 20,
  },
  itemCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    marginVertical: 8,
    backgroundColor: "#fff",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  itemImage: {
    width: 70,
    height: 70,
    borderRadius: 8,
  },
  detailsContainer: {
    flex: 1,
    marginLeft: 12,
    justifyContent: "center",
  },
  itemTopRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  typeIndicator: {
    width: 16,
    height: 16,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 6,
    borderRadius: 2,
  },
  typeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  itemName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    flexShrink: 1,
  },
  itemPrice: {
    fontSize: 14,
    color: "#777",
  },
  rightContainer: {
    alignItems: "center",
    justifyContent: "space-between",
  },
  deleteBtn: {
    marginBottom: 10,
  },
  quantityBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F1F1F1",
    borderRadius: 25,
    paddingHorizontal: 10,
    paddingVertical: 5,
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
  billSection: {
    backgroundColor: "#f8f8f8",
    borderRadius: 12,
    padding: 16,
    marginTop: 10,
  },
  billRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  billText: {
    fontSize: 16,
    color: "#333",
  },
  billAmount: {
    fontSize: 16,
    color: "#333",
  },
  dashedLine: {
    borderStyle: "dashed",
    borderWidth: 1,
    borderRadius: 1,
    borderColor: "#ccc",
    marginVertical: 10,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 50,
  },
  emptyText: {
    fontSize: 18,
    color: "#666",
    fontWeight: "500",
  },
});
