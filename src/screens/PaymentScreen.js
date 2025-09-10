import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from "react-native";
import DashboardScreen from "../components/DashboardScreen";
import CustomHeader from "../components/CustomHeader";
import Ionicons from 'react-native-vector-icons/Ionicons';

const PaymentScreen = ({ navigation }) => {
  const customer = {
    name: "Customer Name",
    phone: "+91 98745 63210",
    address: "abc street, 2669 Valley View Ln",
  };

  const items = [
    { id: 1, name: "Paneer Butter Masala", qty: 2, price: 250 },
    { id: 2, name: "Garlic Naan", qty: 4, price: 40 },
    { id: 3, name: "Gulab Jamun", qty: 3, price: 50 },
  ];

  const billDetails = {
    total: items.reduce((sum, item) => sum + item.price * item.qty, 0),
    gst: 40,
    packing: 20,
    grandTotal: 0, // will calculate next
  };

  billDetails.grandTotal = billDetails.total + billDetails.gst + billDetails.packing;

  return (
    <DashboardScreen> 
      <CustomHeader title="Payment"/>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Customer Details */}
        <View style={styles.card}>
          <View style={styles.row}>
            <Ionicons name="person-circle" size={20} color="#e53935" />
            <Text style={styles.cardText}>{customer.name}</Text>
          </View>
          <View style={styles.row}>
            <Ionicons name="call" size={20} color="#e53935" />
            <Text style={styles.cardText}>{customer.phone}</Text>
          </View>
          <View style={styles.row}>
            <Ionicons name="location" size={20} color="#e53935" />
            <Text style={styles.cardText}>{customer.address}</Text>
          </View>
        </View>

        {/* Items in Order */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Items in your order</Text>
          {items.map((item) => (
            <View key={item.id} style={styles.itemRow}>
              <Text style={styles.itemName}>
                {item.name} x {item.qty}
              </Text>
              <Text style={styles.itemPrice}>₹{item.price * item.qty}</Text>
            </View>
          ))}
        </View>

        {/* Bill Details */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Your bill details</Text>
          <View style={styles.billRow}>
            <Text style={styles.billLabel}>Total</Text>
            <Text style={styles.billValue}>₹{billDetails.total}</Text>
          </View>
          <View style={styles.billRow}>
            <Text style={styles.billLabel}>GST</Text>
            <Text style={styles.billValue}>₹{billDetails.gst}</Text>
          </View>
          <View style={styles.billRow}>
            <Text style={styles.billLabel}>Packing fee</Text>
            <Text style={styles.billValue}>₹{billDetails.packing}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.billRow}>
            <Text style={styles.grandLabel}>Grand Total</Text>
            <Text style={styles.grandValue}>₹{billDetails.grandTotal}</Text>
          </View>
        </View>

        {/* Payment Method */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Payment Method</Text>
          <View style={styles.row}>
            <Text style={styles.cardText}>Pay on delivery</Text>
          </View>
        </View>
      </ScrollView>

      {/* Place Order Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.placeOrderBtn}
          onPress={() => navigation.navigate("ComfromScreen")}
        >
          <Text style={styles.placeOrderText}>Place Order</Text>
        </TouchableOpacity>
      </View>
    </DashboardScreen>
  );
};

export default PaymentScreen;

const styles = StyleSheet.create({
  scrollContainer: {
    marginTop: 20,
    paddingBottom: 100,
  },
  card: {
    backgroundColor: "#f9f9f9",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  cardText: {
    fontSize: 16,
    color: "#333",
    marginLeft: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
    color: "#222",
  },
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  itemName: {
    fontSize: 15,
    color: "#555",
  },
  itemPrice: {
    fontSize: 15,
    fontWeight: "600",
    color: "#222",
  },
  billRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  billLabel: {
    fontSize: 15,
    color: "#555",
  },
  billValue: {
    fontSize: 15,
    color: "#555",
  },
  divider: {
    borderTopWidth: 1,
    borderColor: "#ddd",
    marginVertical: 10,
  },
  grandLabel: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111",
  },
  grandValue: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111",
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderColor: "#ddd",
  },
  placeOrderBtn: {
    backgroundColor: "#e53935",
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: "center",
  },
  placeOrderText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});
