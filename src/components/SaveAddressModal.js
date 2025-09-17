// SaveAddressModal.js
import React, { useState, useEffect } from "react";
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

const SaveAddressModal = ({ visible, onRequestClose, location, addressDetails }) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const [selectedTag, setSelectedTag] = useState("Home");
  const [name, setName] = useState();
  const [contact, setContact] = useState();
  const [flat, setFlat] = useState();
  const [landmark, setLandmark] = useState();
  const [address, setAddress] = useState(location?.description || "");
  const [pin, setPin] = useState(addressDetails?.pin || "");
  const [area, setArea] = useState(addressDetails?.area || "");
  const [city, setCity] = useState(addressDetails?.city || "");
  const [state, setState] = useState(addressDetails?.state || "");

  // Update fields if location/addressDetails changes
  useEffect(() => {
    setAddress(location?.description || "");
    setPin(addressDetails?.pin || "");
    setArea(addressDetails?.area || "");
    setCity(addressDetails?.city || "");
    setState(addressDetails?.state || "");
  }, [location, addressDetails]);

  // Validation & Save
  const validateAndSave = () => {
    if (!name || !contact || !flat || !address || !pin || !city || !state) {
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
      area,
      city,
      state,
      type: selectedTag,
    };

    dispatch(saveAddress(finalData));
    console.log("✅ Saved Address Data:", finalData);

    Alert.alert("Address Saved", "Your address has been saved successfully.");
    onRequestClose();
    navigation.navigate("OrderSummaryScreen");
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onRequestClose}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          {/* Header Row */}
          <View style={styles.headerRow}>
            <Text style={styles.topAddress} numberOfLines={2}>
              {location?.description || "No address selected"}
            </Text>
            <TouchableOpacity onPress={onRequestClose}>
              <Ionicons name="close" size={24} color="#333" />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
            <Text style={styles.header}>Enter complete address</Text>

            {/* Name & Contact */}
            <TextInput style={styles.input} placeholder="Receiver's name *" value={name} onChangeText={setName} placeholderTextColor="#999" />
            <TextInput style={styles.input} placeholder="Receiver's contact number *" keyboardType="phone-pad" value={contact} onChangeText={setContact} placeholderTextColor="#999" maxLength={10} />
            <Text style={styles.helperText}>May help delivery partner to contact</Text>

            {/* Flat/Building & Landmark */}
            <TextInput style={styles.input} placeholder="Flat/House no/Building/Floor *" value={flat} onChangeText={setFlat} placeholderTextColor="#999" />
            <TextInput style={styles.input} placeholder="Landmark (optional)" value={landmark} onChangeText={setLandmark} placeholderTextColor="#999" />

            {/* Address Fields */}
            <TextInput style={styles.input} placeholder="Address/Area/Locality *" value={address} onChangeText={setAddress} placeholderTextColor="#999" />
            <TextInput style={styles.input} placeholder="Area/Locality" value={area} onChangeText={setArea} placeholderTextColor="#999" />
            <TextInput style={styles.input} placeholder="City *" value={city} onChangeText={setCity} placeholderTextColor="#999" />
            <TextInput style={styles.input} placeholder="State *" value={state} onChangeText={setState} placeholderTextColor="#999" />
            <TextInput style={styles.input} placeholder="Pin *" keyboardType="numeric" value={pin} onChangeText={setPin} placeholderTextColor="#999" maxLength={6} />

            {/* Save As Tags */}
            <View style={styles.saveAsContainer}>
              <Text style={styles.saveAsText}>Save as</Text>
              <View style={styles.saveAsRow}>
                {["Home", "Work", "Other"].map((tag) => (
                  <TouchableOpacity
                    key={tag}
                    style={[styles.tag, selectedTag === tag && styles.activeTag]}
                    onPress={() => setSelectedTag(tag)}
                  >
                    <Text style={[styles.tagText, selectedTag === tag && styles.activeTagText]}>{tag}</Text>
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
  modalContainer: { flex: 1, justifyContent: "flex-end", backgroundColor: "rgba(0,0,0,0.4)" },
  modalContent: { backgroundColor: "#fff", padding: 16, borderTopLeftRadius: 20, borderTopRightRadius: 20, maxHeight: height * 0.9, width: "100%", shadowColor: "#000", shadowOpacity: 0.1, shadowOffset: { width: 0, height: -3 }, shadowRadius: 6, elevation: 5 },
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  topAddress: { flex: 1, fontSize: 14, fontWeight: "500", color: "#333", paddingRight: 10 },
  header: { fontSize: 15, fontWeight: "bold", marginBottom: 12, color: "#222" },
  input: { borderWidth: 1, borderColor: "#ddd", borderRadius: 10, padding: Platform.OS === "ios" ? 14 : 12, marginVertical: 6, fontSize: 14, backgroundColor: "#fafafa", color: Theme.colors.black },
  helperText: { fontSize: 12, color: "#666", marginTop: 6, marginBottom: 6 },
  saveAsContainer: { marginTop: 18 },
  saveAsText: { fontSize: 14, marginBottom: 10, fontWeight: "500", color: "#333" },
  saveAsRow: { flexDirection: "row", flexWrap: "wrap" },
  tag: { borderWidth: 1, borderColor: "#ccc", borderRadius: 20, paddingHorizontal: 18, paddingVertical: 8, marginRight: 10, marginBottom: 8 },
  tagText: { fontSize: 14, color: "#555" },
  activeTag: { backgroundColor: Theme.colors.red, borderColor: Theme.colors.red },
  activeTagText: { color: "#fff", fontWeight: "bold" },
  saveBtn: { backgroundColor: Theme.colors.red, paddingVertical: 16, borderRadius: 30, alignItems: "center", marginTop: 22 },
  saveBtnText: { fontSize: 16, fontWeight: "bold", color: "#fff" },
});
