import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  PermissionsAndroid,
  ActivityIndicator,
  Dimensions,
  Alert,
  StatusBar,
  ToastAndroid,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import Geolocation from "react-native-geolocation-service";
import CustomSearchInput from "../components/CustomSearchInput";
import SaveAddressModal from "../components/SaveAddressModal";
import Theme from "../assets/theme";
import { GOOGLE_API_KEY } from "../global_Url/googlemapkey";
import DashboardScreen from "../components/DashboardScreen";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width, height } = Dimensions.get("window");
const guidelineBaseWidth = 390;
const scale = (size) => (width / guidelineBaseWidth) * size;

const MapScreen = ({ navigation }) => {
  const mapRef = useRef(null);

  const [loading, setLoading] = useState(true);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [mapRegion, setMapRegion] = useState(null);
  const [location, setLocation] = useState(null);
  const [saveModalVisible, setSaveModalVisible] = useState(false);
  const [selectedType, setSelectedType] = useState("Home");
  const [addressDetails, setAddressDetails] = useState({
    pin: "",
    area: "",
    city: "",
    state: "",
  });

  // ✅ Hide bottom tab on focus
  useFocusEffect(
    React.useCallback(() => {
      navigation.getParent()?.setOptions({ tabBarStyle: { display: "none" } });
      return () => navigation.getParent()?.setOptions({ tabBarStyle: undefined });
    }, [navigation])
  );

  // ✅ On mount: load saved address or fetch GPS
  useEffect(() => {
    checkSavedAddress();
  }, []);

  // ✅ Load saved address if exists
  const checkSavedAddress = async () => {
    try {
      const saved = await AsyncStorage.getItem("savedAddress");
      if (saved) {
        const address = JSON.parse(saved);
        console.log("📦 Loaded saved address:", address);

        const lat = parseFloat(address.lat);
        const lng = parseFloat(address.lng);

        setLocation({
          latitude: lat,
          longitude: lng,
          description: address.address || address.area || "Saved Address",
        });
        setAddressDetails({
          pin: address.pin || "",
          area: address.area || "",
          city: address.city || "",
          state: address.state || "",
        });

        const region = {
          latitude: lat,
          longitude: lng,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        };
        setMapRegion(region);
        mapRef.current?.animateToRegion(region, 1000);
        setLoading(false);

        ToastAndroid.show("Loaded saved address", ToastAndroid.SHORT);
      } else {
        requestLocationPermission();
      }
    } catch (e) {
      console.log("❌ Error loading saved address:", e);
      requestLocationPermission();
    }
  };

  // ✅ Ask for location permission
  const requestLocationPermission = async () => {
    if (Platform.OS === "android") {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: "Location Permission",
            message: "App needs access to your location",
            buttonNeutral: "Ask Me Later",
            buttonNegative: "Cancel",
            buttonPositive: "OK",
          }
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          fetchCurrentLocation();
        } else {
          setLoading(false);
          Alert.alert("Permission Denied", "Location permission is required.");
        }
      } catch (err) {
        console.warn(err);
      }
    } else {
      fetchCurrentLocation();
    }
  };

  // ✅ Fetch current location (live GPS)
  const fetchCurrentLocation = async () => {
    setLoading(true);
    Geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        const region = {
          latitude,
          longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        };

        setCurrentLocation({ latitude, longitude });
        setLocation({ latitude, longitude });
        setMapRegion(region);
        mapRef.current?.animateToRegion(region, 1000);
        await setAddressFromCoords(latitude, longitude);
        setLoading(false);
        ToastAndroid.show("Current location updated", ToastAndroid.SHORT);
      },
      (error) => {
        console.log("❌ GPS Error:", error);
        setLoading(false);
        Alert.alert("Error", "Unable to fetch current location");
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 5000 }
    );
  };

  // ✅ Reverse geocode coordinates to readable address
  const setAddressFromCoords = async (lat, lng) => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GOOGLE_API_KEY}`
      );
      const data = await response.json();

      if (data.status === "OK" && data.results.length > 0) {
        const result = data.results[0];
        const address = result.formatted_address;
        const components = result.address_components;

        let pin = "",
          area = "",
          city = "",
          state = "";

        components.forEach((comp) => {
          if (comp.types.includes("postal_code")) pin = comp.long_name;
          if (comp.types.includes("sublocality") || comp.types.includes("sublocality_level_1"))
            area = comp.long_name;
          if (comp.types.includes("locality")) city = comp.long_name;
          if (comp.types.includes("administrative_area_level_1")) state = comp.long_name;
        });

        setLocation((prev) => ({ ...prev, description: address }));
        setAddressDetails({ pin, area, city, state });
      }
    } catch (err) {
      console.log("❌ Reverse geocode error", err);
    }
  };

  // ✅ “Use Current” button handler (refetches GPS)
  const goToCurrentLocation = async () => {
    await fetchCurrentLocation();
  };

  return (
    <DashboardScreen>
      <StatusBar hidden />
      <SafeAreaView style={styles.safeArea}>
        {loading ? (
          <View style={styles.loader}>
            <ActivityIndicator size="large" color={Theme.colors.red} />
            <Text style={styles.loadingText}>Fetching your location...</Text>
          </View>
        ) : (
          <View style={styles.mainContainer}>
            <View style={styles.topRow}>
              <Text style={styles.addressText}>
                {location?.description || "Fetching address..."}
              </Text>
              <TouchableOpacity onPress={goToCurrentLocation}>
                <Text style={styles.changeText}>Use Current</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.mapContainer}>
              <MapView
                ref={mapRef}
                style={styles.map}
                region={mapRegion}
                showsUserLocation
                showsMyLocationButton
              >
                {location && (
                  <Marker
                    coordinate={{
                      latitude: location.latitude,
                      longitude: location.longitude,
                    }}
                  />
                )}
              </MapView>

              <CustomSearchInput
                onPlaceSelect={async (place) => {
                  const loc = {
                    latitude: place.latitude,
                    longitude: place.longitude,
                    description: place.description,
                  };
                  setLocation(loc);
                  setMapRegion({
                    ...loc,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                  });
                  mapRef.current?.animateToRegion(
                    { ...loc, latitudeDelta: 0.01, longitudeDelta: 0.01 },
                    1000
                  );
                  await setAddressFromCoords(place.latitude, place.longitude);
                }}
              />

              <View style={styles.addressSection}>
                <Text style={styles.sectionTitle}>🏠 {selectedType}</Text>
                <Text style={styles.subAddress}>
                  {location?.description || "No address selected"}
                </Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.floatingNextBtn}
              onPress={() => setSaveModalVisible(true)}
            >
              <Text style={styles.nextBtnText}>Next</Text>
            </TouchableOpacity>
          </View>
        )}

        <SaveAddressModal
          visible={saveModalVisible}
          onRequestClose={() => setSaveModalVisible(false)}
          location={location}
          addressDetails={addressDetails}
          latitude={location?.latitude}
          longitude={location?.longitude}
        />
      </SafeAreaView>
    </DashboardScreen>
  );
};

export default MapScreen;

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#fff" },
  loader: { flex: 1, justifyContent: "center", alignItems: "center" },
  loadingText: { marginTop: scale(8), fontSize: scale(13), color: "#555" },
  mainContainer: { height: "97%", justifyContent: "space-between" },

  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: scale(10),
    borderBottomWidth: 0.5,
    borderColor: "#ccc",
    backgroundColor: "#fff",
    paddingTop: Platform.OS === "android" ? scale(45) : 0,
  },
  addressText: {
    flex: 1,
    fontSize: scale(13),
    fontWeight: "500",
    color: "#222",
    marginRight: scale(5),
  },
  changeText: {
    color: Theme.colors.red,
    fontWeight: "700",
    fontSize: scale(13),
  },
  mapContainer: { flex: 1, alignItems: "center", justifyContent: "center" },
  map: {
    width: width * 0.96,
    height: height * 0.6,
    borderRadius: scale(10),
    marginVertical: scale(10),
  },
  addressSection: {
    paddingHorizontal: scale(15),
    marginBottom: scale(10),
  },
  sectionTitle: {
    fontSize: scale(15),
    fontWeight: "700",
    marginBottom: scale(4),
  },
  subAddress: {
    fontSize: scale(12),
    color: "#c71616ff",
    lineHeight: scale(16),
  },
  floatingNextBtn: {
    position: "absolute",
    bottom: Platform.OS === "ios" ? scale(40) : scale(30),
    right: scale(20),
    backgroundColor: Theme.colors.red,
    borderRadius: scale(25),
    paddingVertical: scale(12),
    paddingHorizontal: scale(30),
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 4,
  },
  nextBtnText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: scale(14),
  },
});
