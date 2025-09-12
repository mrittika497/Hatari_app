// src/screens/OrderSummaryScreen.js
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useSelector } from "react-redux";
import DashboardScreen from "../components/DashboardScreen";
import CustomHeader from "../components/CustomHeader";
import Theme from "../assets/theme";

const OrderSummaryScreen = ({ navigation }) => {
  // Get cart items from Redux
  const { items: cartItems } = useSelector((state) => state.cart);

  // Address (you can make this dynamic later)
  const address = {
    name: "Mrittika Sarkar",
    tag: "Home",
    details: "EC191, Block EC, Salt Lake, Kolkata - 700064",
    phone: "7864807035",
  };

  // Bill Calculation
  const itemTotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const deliveryFee = cartItems.length > 0 ? 40 : 0;
  const gst = Math.round(itemTotal * 0.05);
    const packingFee = cartItems.length > 0 ? 20 : 0;
  const discount = cartItems.length > 0 ? 50 : 0; // Example static discount
  const grandTotal = itemTotal + deliveryFee + gst - discount;

  return (
    <DashboardScreen>

        {/* Header */}
        <CustomHeader title="Order Summary" />

        <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
          {/* Address */}
          <View style={styles.addressCard}>
            <View style={{ flex: 1 }}>
              <Text style={styles.addrName}>
                {address.name}{" "}
                <Text style={styles.addrTag}>{address.tag}</Text>
              </Text>
              <Text style={styles.addrDetails}>{address.details}</Text>
              <Text style={styles.addrPhone}>{address.phone}</Text>
            </View>
            <TouchableOpacity style={styles.changeBtn}>
              <Text style={styles.changeText}>Change</Text>
            </TouchableOpacity>
          </View>

          {/* Offers */}
          <TouchableOpacity style={styles.offerCard}>
            <Ionicons name="pricetag" size={20} color="#e67e22" />
            <Text style={styles.offerText}>Apply Coupon</Text>
            <Ionicons name="chevron-forward" size={20} color="#999" />
          </TouchableOpacity>

          {/* Cart Items */}
          <View style={styles.sectionBox}>
            <Text style={styles.sectionTitle}>Your Items</Text>
            {cartItems.length === 0 ? (
              <Text style={{ color: "#777", marginTop: 8 }}>
                Your cart is empty
              </Text>
            ) : (
              cartItems.map((item) => (
                <View key={item._id} style={styles.itemRow}>
                  <Image
                    source={{ uri: item.image }}
                    style={styles.itemImage}
                  />
                  <View style={{ flex: 1, marginLeft: 10 }}>
                    <Text style={styles.itemName} numberOfLines={2}>
                      {item.name}
                    </Text>
                    <Text style={styles.itemPrice}>
                      ₹{item.price} x {item.quantity}
                    </Text>
                    {item.note ? (
                      <Text style={styles.itemNote}>📝 {item.note}</Text>
                    ) : null}
                  </View>
                  <Text style={styles.itemQty}>
                    ₹{item.price * item.quantity}
                  </Text>
                </View>
              ))
            )}
          </View>

          {/* Bill Details */}
          <View style={styles.sectionBox}>
            <Text style={styles.sectionTitle}>Bill Details</Text>

            <View style={styles.billRow}>
              <Text style={styles.billLabel}>Item Total</Text>
              <Text style={styles.billValue}>₹{itemTotal}</Text>
            </View>

            <View style={styles.billRow}>
              <Text style={styles.billLabel}>Delivery Fee</Text>
              <Text style={styles.billValue}>₹{deliveryFee}</Text>
            </View>
             <View style={styles.billRow}>
                              <Text style={styles.billLabel}>Packing Fee</Text>
                              <Text style={styles.billValue}>
                             {packingFee}
                              </Text>
                            </View>

            <View style={styles.billRow}>
              <Text style={styles.billLabel}>GST (5%)</Text>
              <Text style={styles.billValue}>₹{gst}</Text>
            </View>

            {discount > 0 && (
              <View style={styles.billRow}>
                <Text style={styles.billLabel}>Discount</Text>
                <Text style={[styles.billValue, { color: "green" }]}>
                  -₹{discount}
                </Text>
              </View>
            )}

            <View style={styles.divider} />

            <View style={styles.billRow}>
              <Text style={styles.totalLabel}>Grand Total</Text>
              <Text style={styles.totalValue}>₹{grandTotal}</Text>
            </View>
          </View>
        </ScrollView>

        {/* Bottom Bar */}
        {cartItems.length > 0 && (
          <View style={styles.bottomBar}>
            <View>
              <Text style={styles.bottomLabel}>To Pay</Text>
              <Text style={styles.bottomTotal}>₹{grandTotal}</Text>
            </View>
            <TouchableOpacity
              style={styles.continueBtn}
              onPress={() =>
                navigation.navigate("Checkout", { cartItems, grandTotal })
              }
            >
              <Text style={styles.continueText}>Proceed to Pay</Text>
            </TouchableOpacity>
          </View>
        )}
     
    </DashboardScreen>
  );
};

export default OrderSummaryScreen;

/* ================== Styles ================== */
const styles = StyleSheet.create({
  addressCard: {
    flexDirection: "row",
    padding: 14,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 10,
    margin: 12,
    elevation: 2,
  },
  addrName: { fontSize: 15, fontWeight: "600", color: "#000" },
  addrTag: {
    fontSize: 11,
    color: "#555",
    backgroundColor: "#eee",
    paddingHorizontal: 6,
    borderRadius: 4,
  },
  addrDetails: { fontSize: 13, color: "#444", marginTop: 4 },
  addrPhone: { fontSize: 13, marginTop: 2, color: "#444" },
  changeBtn: {
    alignSelf: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor:  Theme.colors.red,
    borderRadius: 6,
  },
  changeText: { color: Theme.colors.red, fontSize: 12, fontWeight: "600" },

  offerCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    marginHorizontal: 12,
    backgroundColor: "#fff9f2",
    borderRadius: 10,
    marginBottom: 12,
  },
  offerText: { flex: 1, marginLeft: 10, fontSize: 14, fontWeight: "500" },

  sectionBox: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 10,
    marginHorizontal: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#eee",
  },
  sectionTitle: { fontSize: 15, fontWeight: "700", marginBottom: 8 },
  itemRow: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  itemImage: { width: 60, height: 60, borderRadius: 8 },
  itemName: { fontSize: 14, fontWeight: "600", color: "#000" },
  itemPrice: { fontSize: 13, color: "#000", fontWeight: "500", marginTop: 2 },
  itemQty: { fontSize: 13, fontWeight: "600", marginLeft: 10 },
  itemNote: { fontSize: 12, color: "#555", marginTop: 3 },

  billRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  billLabel: { fontSize: 13, color: "#555" },
  billValue: { fontSize: 13, color: "#000", fontWeight: "500" },
  divider: { height: 1, backgroundColor: "#eee", marginVertical: 8 },
  totalLabel: { fontSize: 14, fontWeight: "700" },
  totalValue: { fontSize: 15, fontWeight: "700", color: Theme.colors.red },

  bottomBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderColor: "#eee",
    padding: 15,
    backgroundColor: "#fff",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  bottomLabel: { fontSize: 12, color: "#555" },
  bottomTotal: { fontSize: 18, fontWeight: "700", color: Theme.colors.red },
  continueBtn: {
    backgroundColor:  Theme.colors.red,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  continueText: { color: "#fff", fontWeight: "700", fontSize: 14 },
});
