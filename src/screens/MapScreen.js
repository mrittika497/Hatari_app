// MapScreen.js
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
  ScrollView,
  Alert,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import Geolocation from "react-native-geolocation-service";
import CustomSearchInput from "../components/CustomSearchInput";
import SaveAddressModal from "../components/SaveAddressModal";
import Theme from "../assets/theme";
import { GOOGLE_API_KEY } from "../global_Url/googlemapkey";
import DashboardScreen from "../components/DashboardScreen";

const { width, height } = Dimensions.get("window");

const MapScreen = () => {
  const mapRef = useRef(null);

  const [loading, setLoading] = useState(true);
  const [currentLocation, setCurrentLocation] = useState(null); // Real device location
  const [mapRegion, setMapRegion] = useState(null);
  const [location, setLocation] = useState(null); // Selected location (search or current)
  const [saveModalVisible, setSaveModalVisible] = useState(false);
  const [selectedType, setSelectedType] = useState("Home");
  const [addressDetails, setAddressDetails] = useState({
    pin: "",
    area: "",
    city: "",
    state: "",
  });

  useEffect(() => {
    requestLocationPermission();
  }, []);

  const requestLocationPermission = async () => {
    if (Platform.OS === "android") {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: "Location Permission",
            message: "This app needs access to your location",
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

  // Fetch real device location
  const fetchCurrentLocation = () => {
    setLoading(true);
    Geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setCurrentLocation({ latitude, longitude }); // Only set real device location here
        setLocation({ latitude, longitude }); // Default selected location = current location

        setMapRegion({
          latitude,
          longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        });

        mapRef.current?.animateToRegion(
          { latitude, longitude, latitudeDelta: 0.01, longitudeDelta: 0.01 },
          1000
        );

        await setAddressFromCoords(latitude, longitude);
        setLoading(false);
      },
      (error) => {
        console.log(error);
        setLoading(false);
        Alert.alert("Error", "Unable to fetch location");
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  };

  // Reverse geocode
  const setAddressFromCoords = async (lat, lng) => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GOOGLE_API_KEY}`
      );
      const data = await response.json();
      if (data.status === "OK") {
        const result = data.results[0];
        const address = result.formatted_address;

        const components = result.address_components;
        let pin = "",
          area = "",
          city = "",
          state = "";

        components.forEach((comp) => {
          if (comp.types.includes("postal_code")) pin = comp.long_name;
          if (comp.types.includes("sublocality") || comp.types.includes("sublocality_level_1")) area = comp.long_name;
          if (comp.types.includes("locality")) city = comp.long_name;
          if (comp.types.includes("administrative_area_level_1")) state = comp.long_name;
        });

        setLocation((prev) => ({ ...prev, description: address }));
        setAddressDetails({ pin, area, city, state });
      }
    } catch (err) {
      console.log("Reverse geocode error", err);
    }
  };

  // Go to device current location
  const goToCurrentLocation = async () => {
    if (!currentLocation) return;

    setLocation({ ...currentLocation }); // Update selected location to device
    mapRef.current?.animateToRegion(
      { ...currentLocation, latitudeDelta: 0.01, longitudeDelta: 0.01 },
      1000
    );
    await setAddressFromCoords(currentLocation.latitude, currentLocation.longitude);
  };

  return (
    <DashboardScreen> 
    <SafeAreaView style={styles.safeArea}>
      {loading ? (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color={Theme.colors.red} />
          <Text style={styles.loadingText}>Fetching your location...</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View style={styles.container}>
            <View style={styles.topRow}>
              <Text style={styles.addressText}>
                {location?.description || "Fetching..."}
              </Text>
              <TouchableOpacity onPress={goToCurrentLocation}>
                <Text style={styles.changeText}>Use Current</Text>
              </TouchableOpacity>
            </View>

            <MapView
              ref={mapRef}
              style={styles.map}
              region={mapRegion}
              showsUserLocation
              showsMyLocationButton
            >
              {location && <Marker coordinate={{ latitude: location.latitude, longitude: location.longitude }} />}
            </MapView>

       
     <CustomSearchInput
              onPlaceSelect={async (place) => {
                const loc = { latitude: place.latitude, longitude: place.longitude, description: place.description };
                setLocation(loc); // Only update selected location
                setMapRegion({ ...loc, latitudeDelta: 0.01, longitudeDelta: 0.01 });
                mapRef.current?.animateToRegion({ ...loc, latitudeDelta: 0.01, longitudeDelta: 0.01 }, 1000);

                await setAddressFromCoords(place.latitude, place.longitude);
                // DO NOT update currentLocation
              }}
            />
            <View style={styles.addressSection}>
              <Text style={styles.sectionTitle}>🏠 {selectedType}</Text>
              <Text style={styles.subAddress}>{location?.description || "No address selected"}</Text>
            </View>

            <View style={styles.bottomRow}>
              <TouchableOpacity style={styles.nextBtn} onPress={() => setSaveModalVisible(true)}>
                <Text style={styles.nextBtnText}>Next</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      )}

      <SaveAddressModal
        visible={saveModalVisible}
        onRequestClose={() => setSaveModalVisible(false)}
        location={location}
        addressDetails={addressDetails}
      />
    </SafeAreaView>
    </DashboardScreen>
  );
};

export default MapScreen;

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#fff" },
  container: { flex: 1, backgroundColor: "#fff" },
  loader: { flex: 1, justifyContent: "center", alignItems: "center" },
  loadingText: { marginTop: 10, fontSize: 14, color: "#555" },
  topRow: { flexDirection: "row", justifyContent: "space-between", padding: 10, borderBottomWidth: 0.5, borderColor: "#ccc" },
  addressText: { flex: 1, fontSize: 14, fontWeight: "500", color: "#222" },
  changeText: { color: Theme.colors.red, fontWeight: "600" },
  map: { width: width, height: height * 0.6, marginVertical: 10 },
  addressSection: { paddingHorizontal: 15, marginTop: 10 },
  sectionTitle: { fontSize: 16, fontWeight: "600", marginBottom: 5 },
  subAddress: { fontSize: 13, color: "#c71616ff", marginBottom: 10 },
  bottomRow: { flexDirection: "row", justifyContent: "flex-end", padding: 15 },
  nextBtn: { backgroundColor: Theme.colors.red, borderRadius: 25, paddingVertical: 12, paddingHorizontal: 30 },
  nextBtnText: { color: "#fff", fontWeight: "600", fontSize: 15 },
});
