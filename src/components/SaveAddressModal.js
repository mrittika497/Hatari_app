// SaveAddressModal.js
import React, { useState } from "react";
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  Dimensions,
  Platform,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import Theme from "../assets/theme";
import { useNavigation } from "@react-navigation/native";
import { useDispatch } from "react-redux";
import { saveAddress } from "../redux/slice/addressSlice";

const { width, height } = Dimensions.get("window");

const SaveAddressModal = ({ visible, onRequestClose, location}) => {
    const navigation = useNavigation();
  const [selectedTag, setSelectedTag] = useState("Home");
const [name, setName] = useState(__DEV__ ? "Test User" : "");
const [contact, setContact] = useState(__DEV__ ? "9876543210" : "");
const [flat, setFlat] = useState(__DEV__ ? "123, Sky Tower" : "");
const [landmark, setLandmark] = useState(__DEV__ ? "Near City Mall" : "");
const [address, setAddress] = useState(
  __DEV__ ? "MG Road, Bangalore" : location?.description || ""
);
const [pin, setPin] = useState(__DEV__ ? "560001" : "");
const dispatch = useDispatch()
  // 🔹 Validation before saving
  const validateAndSave = () => {
    if (!name || !contact || !flat || !address || !pin) {
      Alert.alert("Missing Fields", "Please fill all required fields (*)");
      return;
    }

    const finalData = {
      name,
      contact,
      flat,
      landmark,
      address,
      pin,
      type: selectedTag,
    };

     dispatch(saveAddress(finalData));
    console.log("✅ Saved Address Data:", finalData);
navigation.navigate("OrderSummaryScreen")
    Alert.alert("Address Saved", "Your address has been saved successfully.");
    onRequestClose(); // close modal
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onRequestClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          {/* Header Row with Address + Close */}
          <View style={styles.headerRow}>
            <Text style={styles.topAddress} numberOfLines={2}>
              {location?.description || "No address selected"}
            </Text>
            <TouchableOpacity onPress={onRequestClose}>
              <Ionicons name="close" size={24} color="#333" />
            </TouchableOpacity>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 40 }}
          >
            <Text style={styles.header}>Enter complete address</Text>

            {/* Fields */}
            <TextInput
              style={styles.input}
              placeholder="Receiver's name *"
              value={name}
              onChangeText={setName}
              placeholderTextColor="#999"
            />
            <TextInput
              style={styles.input}
              placeholder="Receiver's contact number *"
              keyboardType="phone-pad"
              value={contact}
              onChangeText={setContact}
              placeholderTextColor="#999"
              maxLength={10}
            />

            <Text style={styles.helperText}>
              May help delivery partner to contact
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Flat/House no/Building/Floor *"
              value={flat}
              onChangeText={setFlat}
              placeholderTextColor="#999"
            />
            <TextInput
              style={styles.input}
              placeholder="Landmark (optional)"
              value={landmark}
              onChangeText={setLandmark}
              placeholderTextColor="#999"
            />
            <TextInput
              style={styles.input}
              placeholder="Address/area/locality *"
              value={address}
              onChangeText={setAddress}
              placeholderTextColor="#999"
            />
            <TextInput
              style={styles.input}
              placeholder="Pin *"
              keyboardType="numeric"
              value={pin}
              onChangeText={setPin}
              placeholderTextColor="#999"
              maxLength={6}
            />

            {/* Save As Tags */}
            <View style={styles.saveAsContainer}>
              <Text style={styles.saveAsText}>Save as</Text>
              <View style={styles.saveAsRow}>
                {["Home", "Work", "Other"].map((tag) => (
                  <TouchableOpacity
                    key={tag}
                    style={[
                      styles.tag,
                      selectedTag === tag && styles.activeTag,
                    ]}
                    onPress={() => setSelectedTag(tag)}
                  >
                    <Text
                      style={[
                        styles.tagText,
                        selectedTag === tag && styles.activeTagText,
                      ]}
                    >
                      {tag}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Save Button */}
            <TouchableOpacity style={styles.saveBtn} onPress={validateAndSave}>
              <Text style={styles.saveBtnText}>Save Address</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default SaveAddressModal;

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 16,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: height * 0.9,
    width: "100%",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: -3 },
    shadowRadius: 6,
    elevation: 5,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  topAddress: {
    flex: 1,
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
    paddingRight: 10,
  },
  header: {
    fontSize: 15,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#222",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: Platform.OS === "ios" ? 14 : 12,
    marginVertical: 6,
    fontSize: 14,
    backgroundColor: "#fafafa",
    color:Theme.colors.black
  },
  helperText: {
    fontSize: 12,
    color: "#666",
    marginTop: 6,
    marginBottom: 6,
  },
  saveAsContainer: {
    marginTop: 18,
  },
  saveAsText: {
    fontSize: 14,
    marginBottom: 10,
    fontWeight: "500",
    color: "#333",
  },
  saveAsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  tag: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 20,
    paddingHorizontal: 18,
    paddingVertical: 8,
    marginRight: 10,
    marginBottom: 8,
  },
  tagText: {
    fontSize: 14,
    color: "#555",
  },
  activeTag: {
    backgroundColor: Theme.colors.red,
    borderColor: Theme.colors.red,
  },
  activeTagText: {
    color: "#fff",
    fontWeight: "bold",
  },
  saveBtn: {
    backgroundColor: Theme.colors.red,
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: "center",
    marginTop: 22,
  },
  saveBtnText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
});
