import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  ToastAndroid,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import Theme from "../assets/theme";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { addAddress } from "../redux/slice/addressSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  responsiveWidth as rw,
  responsiveHeight as rh,
  responsiveFontSize as rf,
} from "react-native-responsive-dimensions";

const { height, width } = Dimensions.get("window");

const SaveAddressModal = ({
  visible,
  onRequestClose,
  location,
  addressDetails,
  latitude,
  longitude,
}) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const { data: deliveryData } = useSelector((state) => state.deliverySettings);
  const { loading } = useSelector((state) => state.address);
  const { experienceType } = useSelector((state) => state.experience);

  const minDistance = deliveryData?.minimum_distance || 10;
  const restaurantLat = 22.5726;
  const restaurantLng = 88.3639;

  const [selectedTag, setSelectedTag] = useState("Home");
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [flat, setFlat] = useState("");
  const [landmark, setLandmark] = useState("");
  const [address, setAddress] = useState(location?.description || "");
  const [pin, setPin] = useState(addressDetails?.pin || "");
  const [area, setArea] = useState(addressDetails?.area || "");
  const [city, setCity] = useState(addressDetails?.city || "");
  const [state, setState] = useState(addressDetails?.state || "");

  useEffect(() => {
    setAddress(location?.description || "");
    setPin(addressDetails?.pin || "");
    setArea(addressDetails?.area || "");
    setCity(addressDetails?.city || "");
    setState(addressDetails?.state || "");
  }, [location, addressDetails]);

  // ✅ Calculate Distance in KM
  const getDistanceKm = (lat1, lon1, lat2, lon2) => {
    if (!lat1 || !lon1 || !lat2 || !lon2) return 0;
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  // ✅ Save address to AsyncStorage
  const saveAddressToStorage = async (addressData) => {
    try {
      await AsyncStorage.setItem("savedAddress", JSON.stringify(addressData));
      console.log("✅ Address stored in AsyncStorage:", addressData);
    } catch (e) {
      console.log("❌ Failed to save address in storage:", e);
    }
  };

  // ✅ Validate & Submit Address
  const validateAndSave = async () => {
    if (!name || !contact || !flat || !address || !pin || !city || !state) {
      ToastAndroid.show("Please fill all required fields!", ToastAndroid.SHORT);
      return;
    }

    const distance = getDistanceKm(
      latitude,
      longitude,
      restaurantLat,
      restaurantLng
    );

    if (distance > minDistance) {
      ToastAndroid.show(
        `Your location is ${distance.toFixed(
          2
        )} km away. Delivery only within ${minDistance} km.`,
        ToastAndroid.LONG
      );
      return;
    }

    const finalData = {
      name,
      mobileNumber: contact,
      apartment: flat,
      landmark,
      address,
      pin,
      area,
      city,
      state,
      type: experienceType,
      lat: latitude,
      lng: longitude,
      addressType: selectedTag,
    };

    console.log("📦 Sending Address Data:", finalData);

    try {
      const res = await dispatch(addAddress(finalData)).unwrap();
      console.log("✅ Address Saved Response:", res);

      if (res?.success && res?.newAddress) {
        await saveAddressToStorage(res.newAddress);
        ToastAndroid.show("Address saved successfully!", ToastAndroid.SHORT);
        onRequestClose();
        navigation.navigate("OrderSummaryScreen");
      } else {
        ToastAndroid.show(
          res?.message || "Failed to save address!",
          ToastAndroid.LONG
        );
      }
    } catch (err) {
      console.log("❌ Address Save Error:", err);
      ToastAndroid.show(
        err?.message || "Failed to save address!",
        ToastAndroid.LONG
      );
    }
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
          <View style={styles.headerRow}>
            <Text style={styles.topAddress} numberOfLines={2}>
              {location?.description || "No address selected"}
            </Text>
            <TouchableOpacity onPress={onRequestClose}>
              <Ionicons name="close" size={rf(3)} color="#333" />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={styles.header}>Enter complete address</Text>

            {/* Input Fields */}
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
              maxLength={10}
              placeholderTextColor="#999"
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
              placeholder="Address/Area/Locality *"
              value={address}
              onChangeText={setAddress}
              placeholderTextColor="#999"
            />
            <TextInput
              style={styles.input}
              placeholder="City *"
              value={city}
              onChangeText={setCity}
              placeholderTextColor="#999"
            />
            <TextInput
              style={styles.input}
              placeholder="State *"
              value={state}
              onChangeText={setState}
              placeholderTextColor="#999"
            />
            <TextInput
              style={styles.input}
              placeholder="Pin *"
              keyboardType="numeric"
              value={pin}
              onChangeText={setPin}
              maxLength={6}
              placeholderTextColor="#999"
            />

            {/* Address Tag */}
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
            <TouchableOpacity
              style={styles.saveBtn}
              onPress={validateAndSave}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.saveBtnText}>Save Address</Text>
              )}
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
    padding: rw(4),
    borderTopLeftRadius: rw(6),
    borderTopRightRadius: rw(6),
    maxHeight: rh(90),
    width: "100%",
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: rh(1),
  },
  topAddress: {
    flex: 1,
    fontSize: rf(2),
    fontWeight: "500",
    color: "#333",
    paddingRight: rw(2),
  },
  header: {
    fontSize: rf(2.2),
    fontWeight: "bold",
    marginBottom: rh(1),
    color: "#222",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: rw(3),
    paddingVertical: rh(1.4),
    paddingHorizontal: rw(3),
    marginVertical: rh(0.7),
    fontSize: rf(2),
    backgroundColor: "#fafafa",
    color: Theme.colors.black,
  },
  helperText: {
    fontSize: rf(1.6),
    color: "#666",
    marginBottom: rh(1),
  },
  saveAsContainer: { marginTop: rh(2) },
  saveAsText: {
    fontSize: rf(2),
    fontWeight: "500",
    color: "#333",
    marginBottom: rh(1),
  },
  saveAsRow: { flexDirection: "row", flexWrap: "wrap" },
  tag: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: rw(5),
    paddingHorizontal: rw(5),
    paddingVertical: rh(1),
    marginRight: rw(2),
    marginBottom: rh(1),
  },
  tagText: { fontSize: rf(1.9), color: "#555" },
  activeTag: { backgroundColor: Theme.colors.red, borderColor: Theme.colors.red },
  activeTagText: { color: "#fff", fontWeight: "bold" },
  saveBtn: {
    backgroundColor: Theme.colors.red,
    paddingVertical: rh(2),
    borderRadius: rw(6),
    alignItems: "center",
    marginTop: rh(3),
  },
  saveBtnText: { fontSize: rf(2.2), fontWeight: "bold", color: "#fff" },
});
