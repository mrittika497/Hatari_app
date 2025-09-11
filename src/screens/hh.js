import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  Dimensions,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Modal,
} from "react-native";
import ShimmerPlaceHolder from "react-native-shimmer-placeholder";
import LinearGradient from "react-native-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import Ionicons from "react-native-vector-icons/Ionicons";

import DashboardScreen from "../../components/DashboardScreen";
import CustomHeader from "../../components/CustomHeader";
import Theme from "../../assets/theme";

const { width } = Dimensions.get("window");

const CartScreen = () => {
  const navigation = useNavigation();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal state
  const [selectedItem, setSelectedItem] = useState(null);
  const [noteText, setNoteText] = useState("");

  useEffect(() => {
    setTimeout(() => {
      setCartItems([
        {
          id: "1",
          name: "Bhetki Fish Fry",
          price: 320,
          quantity: 2,
          image: require("../../assets/images/remove/Chicken.png"),
          type: "nonveg",
          note: "",
        },
        {
          id: "2",
          name: "Chicken Dum Biriyani",
          price: 580,
          quantity: 1,
          image: require("../../assets/images/remove/Chicken.png"),
          type: "nonveg",
          note: "",
        },
        {
          id: "3",
          name: "Ice cream with Brownie",
          price: 180,
          quantity: 1,
          image: require("../../assets/images/remove/Chicken.png"),
          type: "veg",
          note: "",
        },
      ]);
      setLoading(false);
    }, 1500);
  }, []);

  const incrementQty = (id) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const decrementQty = (id) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );
  };

  const deleteItem = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const updateNote = (id, text) => {
    setCartItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, note: text } : item))
    );
  };

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const gst = Math.round(totalPrice * 0.05); // 5% GST
  const packingFee = 20;
  const grandTotal = totalPrice + gst + packingFee;

  const formatCurrency = (amount) => `₹${amount.toLocaleString("en-IN")}`;

  const openModal = (item) => {
    setSelectedItem(item);
    setNoteText(item.note || "");
  };

  const closeModal = () => {
    setSelectedItem(null);
    setNoteText("");
  };

  const handleSaveNote = () => {
    if (selectedItem) {
      updateNote(selectedItem.id, noteText);
    }
    closeModal();
  };



  const renderItem = ({ item }) => (
    <View style={styles.itemCard}>
      <Image source={item.image} style={styles.itemImage} />

      <View style={styles.detailsContainer}>
        <View style={styles.itemHeader}>
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
          <Text style={styles.itemName}>{item.name}</Text>
        </View>
        <Text style={styles.itemPrice}>{formatCurrency(item.price)}</Text>
 
        {/* ✅ Customize + Delete row */}
        <View style={styles.actionRow}>
          <TouchableOpacity
            style={styles.customizeBtn}
            onPress={() => openModal(item)}
          >
            <Icon name="pencil" size={18} color={Theme.colors.red} />
            <Text style={styles.customizeText}>Customize</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.deleteBtn}
            onPress={() => deleteItem(item.id)}
          >
            <Ionicons name="trash-outline" size={20} color="red" />
            <Text style={styles.deleteText}>Remove</Text>
          </TouchableOpacity>
        </View>


               {item.note ? (
          <Text style={styles.itemNoteDisplay}>📝 {item.note}</Text>
        ) : null}
      </View>

      {/* ✅ Quantity Section */}
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
  );

  const renderSkeleton = () => (
    <View style={styles.itemCard}>
      <ShimmerPlaceHolder
        LinearGradient={LinearGradient}
        style={{ width: 70, height: 70, borderRadius: 8 }}
      />
      <View style={{ flex: 1, marginLeft: 12 }}>
        <ShimmerPlaceHolder
          LinearGradient={LinearGradient}
          style={{
            width: width * 0.5,
            height: 14,
            borderRadius: 4,
            marginBottom: 6,
          }}
        />
        <ShimmerPlaceHolder
          LinearGradient={LinearGradient}
          style={{ width: width * 0.3, height: 14, borderRadius: 4 }}
        />
      </View>
    </View>
  );

  return (
    <DashboardScreen scrollable={false}>
      <CustomHeader title="My Cart" />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
           <TouchableOpacity
          style={styles.addMore}
          onPress={() => navigation.navigate("HomeScreen")}
        >
          <Text style={{ color: Theme.colors.red, fontWeight: "600" }}>
            + Add more Items
          </Text>
        </TouchableOpacity>
        <View style={styles.container}>
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <View key={i}>{renderSkeleton()}</View>
            ))
          ) : cartItems.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>Your cart is empty</Text>
              <TouchableOpacity
                style={styles.browseBtn}
                onPress={() => navigation.navigate("HomeScreen")}
              >
                <Text style={styles.browseText}>Browse Menu</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              <FlatList
                data={cartItems}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                contentContainerStyle={{ paddingBottom: 120 }}
              />

              {/* ✅ Fixed Bottom Checkout Section */}
              <View style={styles.bottomBar}>
                <View style={styles.billBox}>
                  <Text style={styles.billLabel}>Grand Total</Text>
                  <Text style={styles.billValue}>
                    {formatCurrency(grandTotal)}
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.checkoutBtn}
                  onPress={() =>
                    navigation.navigate("Checkout", { cartItems, grandTotal })
                  }
                >
                  <Text style={styles.checkoutText}>Proceed to Checkout</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
      </KeyboardAvoidingView>

      {/* ✅ Modal for Note + Remove */}
      <Modal
        visible={!!selectedItem}
        animationType="slide"
        transparent
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>
              Edit Item: {selectedItem?.name}
            </Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Enter special note..."
              placeholderTextColor="#999"
              value={noteText}
              onChangeText={setNoteText}
              multiline
            />

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalBtn, { backgroundColor: "#ccc" }]}
                onPress={closeModal}
              >
                <Text style={styles.modalBtnText}>Cancel</Text>
              </TouchableOpacity>

              {/* <TouchableOpacity
                style={[styles.modalBtn, { backgroundColor: "red" }]}
                onPress={handleRemoveItem}
              >
                <Text style={styles.modalBtnText}>Remove</Text>
              </TouchableOpacity> */}

              <TouchableOpacity
                style={[styles.modalBtn, { backgroundColor: Theme.colors.red }]}
                onPress={handleSaveNote}
              >
                <Text style={styles.modalBtnText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </DashboardScreen>
  );
};

export default CartScreen;

const styles = StyleSheet.create({
    addMore: {
    alignSelf: "flex-end",
    marginVertical: 10,
    marginBottom: 20,
  },
  container: { flex: 1, backgroundColor: "#fff" },

  // Empty Cart
  emptyContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  emptyText: { fontSize: 18, color: "#555", marginTop: 8 },
  browseBtn: {
    backgroundColor: Theme.colors.red,
    marginTop: 15,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
  },
  browseText: { color: "#fff", fontWeight: "600" },

  // Item Card
  itemCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginHorizontal: 12,
    marginVertical: 8,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  itemImage: { width: 70, height: 70, borderRadius: 8 },
  detailsContainer: { flex: 1, marginLeft: 12 },
  itemHeader: { flexDirection: "row", alignItems: "center", marginBottom: 6 },
  typeIndicator: {
    width: 16,
    height: 16,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 6,
    borderRadius: 2,
  },
  typeDot: { width: 8, height: 8, borderRadius: 4 },
  itemName: { fontSize: 16, fontWeight: "600", color: "#333", flexShrink: 1 },
  itemPrice: { fontSize: 14, color: "#777" },
  itemNoteDisplay: {
    marginTop: 6,
    fontSize: 13,
    color: "#444",
    backgroundColor: "#f1f1f1",
    padding: 6,
    borderRadius: 6,
  width:200
  },

  // Action Row
  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  customizeBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF3F3",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    marginRight: 10,
  },
  customizeText: {
    fontSize: 13,
    color: Theme.colors.red,
    fontWeight: "600",
    marginLeft: 5,
  },
  deleteBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF3F3",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  deleteText: {
    fontSize: 13,
    color: "red",
    fontWeight: "600",
    marginLeft: 5,
  },

  // Quantity Section
  quantityBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F1F1F1",
    borderRadius: 25,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginLeft: 8,
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
  qtyText: { fontSize: 18, fontWeight: "bold", color: Theme.colors.red },
  qtyValue: { fontSize: 16, fontWeight: "bold", marginHorizontal: 10 },

  // Bottom Checkout
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderColor: "#eee",
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    elevation: 8,
  },
  billBox: { flex: 1 },
  billLabel: { fontSize: 14, color: "#555" },
  billValue: { fontSize: 18, fontWeight: "700", color: "#000" },
  checkoutBtn: {
    backgroundColor: Theme.colors.red,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 30,
    marginLeft: 12,
  },
  checkoutText: { color: "#fff", fontWeight: "600", fontSize: 15 },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "85%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    elevation: 5,
  },
  modalTitle: { fontSize: 18, fontWeight: "700", marginBottom: 12 },
  modalInput: {
    backgroundColor: "#f8f8f8",
    borderRadius: 8,
    padding: 10,
    minHeight: 60,
    textAlignVertical: "top",
    fontSize: 14,
    color: "#000",
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 15,
  },
  modalBtn: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 6,
    marginLeft: 10,
  },
  modalBtnText: { color: "#fff", fontWeight: "600" },
});
