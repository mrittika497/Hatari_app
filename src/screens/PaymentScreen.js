import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import DashboardScreen from "../components/DashboardScreen";
import CustomHeader from "../components/CustomHeader";
import Ionicons from "react-native-vector-icons/Ionicons";

const PaymentScreen = ({ navigation }) => {
  const [selectedMethod, setSelectedMethod] = useState("COD"); // default Cash on Delivery

  // Dummy bill details
  const billDetails = {
    total: 1200,
    gst: 40,
    packing: 20,
    grandTotal: 1260,
  };

  return (
    <DashboardScreen>
      <CustomHeader title="Payment" />
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Bill Details */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Your Bill Details</Text>
          <View style={styles.billRow}>
            <Text style={styles.billLabel}>Total</Text>
            <Text style={styles.billValue}>₹{billDetails.total}</Text>
          </View>
          <View style={styles.billRow}>
            <Text style={styles.billLabel}>GST</Text>
            <Text style={styles.billValue}>₹{billDetails.gst}</Text>
          </View>
          <View style={styles.billRow}>
            <Text style={styles.billLabel}>Packing Fee</Text>
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
          <Text style={styles.cardTitle}>Select Payment Method</Text>

          <TouchableOpacity
            style={[
              styles.paymentOption,
              selectedMethod === "COD" && styles.paymentOptionActive,
            ]}
            onPress={() => setSelectedMethod("COD")}
          >
            <Ionicons
              name="cash-outline"
              size={22}
              color={selectedMethod === "COD" ? "#fff" : "#e53935"}
            />
            <Text
              style={[
                styles.paymentText,
                selectedMethod === "COD" && styles.paymentTextActive,
              ]}
            >
              Cash on Delivery
            </Text>
            {selectedMethod === "COD" && (
              <Ionicons name="checkmark-circle" size={22} color="#fff" />
            )}
          </TouchableOpacity>
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
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
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
  paymentOption: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderWidth: 1,
    borderColor: "#e53935",
    borderRadius: 12,
    marginTop: 8,
    justifyContent: "space-between",
    backgroundColor: "#fff",
  },
  paymentOptionActive: {
    backgroundColor: "#e53935",
  },
  paymentText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: "#e53935",
  },
  paymentTextActive: {
    color: "#fff",
    fontWeight: "600",
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
