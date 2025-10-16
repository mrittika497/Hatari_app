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
  ToastAndroid,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import Theme from "../assets/theme";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { saveAddress } from "../redux/slice/addressSlice";
import {
  responsiveWidth as rw,
  responsiveHeight as rh,
  responsiveFontSize as rf,
} from "react-native-responsive-dimensions";
import AsyncStorage from "@react-native-async-storage/async-storage";

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

  const { data } = useSelector((state) => state.deliverySettings);
  console.log(data,"--------------------------------datamapaddres---12337777");
    const savedAddress = useSelector(state => state.address.savedAddress);
    console.log(savedAddress,"--------------------------postaddress");
    
  const storeDeliverySettingId = async (id) => {
    try {
      await AsyncStorage.setItem('deliverySettingId', id);
      console.log('✅ 123 Setting ID saved:', id);
    } catch (error) {
      console.log('❌ Error saving deliverySettingId:', error);
    }
  };
    useEffect(() => {
    if (data?._id) {
      storeDeliverySettingId(data._id);
    }
  }, [data]);
  const { experienceType } = useSelector((state) => state.experience);

  const minDistance = data?.minimum_distance || 10;

  const restaurantLat = 22.5726;
  const restaurantLng = 88.3639;

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

  useEffect(() => {
    setAddress(location?.description || "");
    setPin(addressDetails?.pin || "");
    setArea(addressDetails?.area || "");
    setCity(addressDetails?.city || "");
    setState(addressDetails?.state || "");
  }, [location, addressDetails]);

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

  const validateAndSave = () => {
    if (!name || !contact || !flat || !address || !pin || !city || !state) {
      Alert.alert("Missing Fields", "Please fill all required fields (*)");
      return;
    }

    const distance = getDistanceKm(latitude, longitude, restaurantLat, restaurantLng);

    if (distance > minDistance) {
   ToastAndroid.show(
  `Your location is ${distance.toFixed(2)} km away. Delivery available only within ${minDistance} km.`,
  ToastAndroid.LONG
);
      return;
    }

    const finalData = {
      name,
      mobilenum: contact,
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
    };
console.log('finalData-----------------', finalData)
    dispatch(saveAddress(finalData));
    onRequestClose();
    navigation.navigate("OrderSummaryScreen");
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onRequestClose}>
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

            <TextInput style={styles.input} placeholder="Receiver's name *"
             value={name} onChangeText={setName}   placeholderTextColor={Theme.colors.red} />
            <TextInput
              style={styles.input}
              placeholder="Receiver's contact number *"
              keyboardType="phone-pad"
              value={contact}
              onChangeText={setContact}
              maxLength={10}
                placeholderTextColor={Theme.colors.red}
            />

            <Text style={styles.helperText}>May help delivery partner to contact</Text>

            <TextInput
              style={styles.input}
              placeholder="Flat/House no/Building/Floor *"
              value={flat}
              onChangeText={setFlat}
              placeholderTextColor={Theme.colors.red}
            />
            <TextInput
              style={styles.input}
              placeholder="Landmark (optional)"
              value={landmark}
              onChangeText={setLandmark}
                placeholderTextColor={Theme.colors.red}
            />
            <TextInput
              style={styles.input}
              placeholder="Address/Area/Locality *"
              value={address}
              onChangeText={setAddress}
                placeholderTextColor={Theme.colors.red}
            />
            <TextInput style={styles.input} placeholder="City *" 
            value={city} onChangeText={setCity}   placeholderTextColor={Theme.colors.red}/>
            <TextInput style={styles.input} 
            placeholder="State *" value={state} onChangeText={setState}  placeholderTextColor={Theme.colors.red}/>
            <TextInput
              style={styles.input}
              placeholder="Pin *"
              keyboardType="numeric"
              value={pin}
              onChangeText={setPin}
              maxLength={6}
                placeholderTextColor={Theme.colors.red}
            />

            <View style={styles.saveAsContainer}>
              <Text style={styles.saveAsText}>Save as</Text>
              <View style={styles.saveAsRow}>
                {["Home", "Work", "Other"].map((tag) => (
                  <TouchableOpacity
                    key={tag}
                    style={[styles.tag, selectedTag === tag && styles.activeTag]}
                    onPress={() => setSelectedTag(tag)}
                  >
                    <Text
                      style={[styles.tagText, selectedTag === tag && styles.activeTagText]}
                    >
                      {tag}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

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
