import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  SafeAreaView,
  Platform,
  PermissionsAndroid,
  Alert,
  ActivityIndicator
} from "react-native";
import { useNavigation } from "@react-navigation/native";

import Geolocation from "react-native-geolocation-service";
import { useDispatch, useSelector } from "react-redux";
import { fetchNearestRestaurants } from "../redux/slice/nearestResSlice";

// Dummy experiences (static)
const experiences = [
  { id: 1, title: "Delivery", icon: require("../assets/images/delivery.png") },
  { id: 2, title: "Dine in", icon: require("../assets/images/dinein.png") },
  { id: 3, title: "Takeaway", icon: require("../assets/images/takeaway.png") },
];

const ExperienceScreen = ({ route }) => {
  const [selectedExperience, setSelectedExperience] = useState(null);
  const [location, setLocation] = useState(null);

  const navigation = useNavigation();
  const dispatch = useDispatch();

  const { data: nearestRestaurants, loading, error } = useSelector(
    (state) => state.nearestRestaurants
  );

  const token = route?.params?.token;
  const user = route?.params?.user;

  // Request location on mount
  useEffect(() => {
    requestLocationPermission();
  }, []);

  // Fetch nearest restaurants whenever location & token are available
  useEffect(() => {
    if (token && location) {
      dispatch(
        fetchNearestRestaurants({
          token,
          lat: location.latitude.toFixed(6),
          lng: location.longitude.toFixed(6)
        })
      );
    }
  }, [token, location]);

  // Location Permission
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
            buttonPositive: "OK"
          }
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          getCurrentLocation();
        } else {
          Alert.alert("Permission Denied", "Location permission is required");
        }
      } catch (err) {
        console.warn(err);
      }
    } else {
      getCurrentLocation();
    }
  };

  const getCurrentLocation = () => {
    Geolocation.getCurrentPosition(
      (pos) => setLocation(pos.coords),
      (error) => {
        console.log(error);
        Alert.alert("Error", "Unable to fetch location");
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  };

  const handleContinue = () => {
    if (selectedExperience) {
      navigation.navigate("Bottom", {
        experienceId: selectedExperience,
        token,
        user,
        location,
        nearestRestaurants
      });
    } else {
      Alert.alert("Selection Required", "Please select an experience.");
    }
  };

  return (

      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Text style={styles.title}>
            Welcome to <Text style={styles.brand}>Hatari</Text>
          </Text>
          <Text style={styles.subtitle}>Elevate Your Dining Experience</Text>

          {/* Show Location */}
          {location && (
            <Text style={styles.locationText}>
              Lat: {location.latitude.toFixed(6)}, Lng: {location.longitude.toFixed(6)}
            </Text>
          )}

          {/* Experience Selection */}
          <Text style={styles.sectionHeading}>Choose your experience</Text>
          <View style={styles.experienceContainer}>
            {experiences.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={[styles.experienceCard, selectedExperience === item.id && styles.selectedCard]}
                onPress={() => setSelectedExperience(item.id)}
              >
                <Image source={item.icon} style={styles.icon} resizeMode="contain" />
                <Text style={styles.cardText}>{item.title}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Nearest Restaurants */}
          <Text style={styles.sectionHeading}>Nearest Restaurants</Text>
          {loading && <ActivityIndicator size="large" color="#e53935" />}
          {error && <Text style={{ color: "red" }}>{error}</Text>}

          {nearestRestaurants?.map((res) => (
            <View key={res._id} style={styles.restaurantCard}>
              <Image source={{ uri: res.image }} style={styles.restaurantImage} />
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={styles.restaurantName}>{res.name}</Text>
                <Text style={styles.restaurantDetails}>{res.address}</Text>
                <Text style={styles.restaurantDetails}>
                  Distance: {(res.distance / 1000).toFixed(2)} km | Rating: {res.rating}
                </Text>
                <Text style={styles.restaurantDetails}>Category: {res.category.join(", ")}</Text>
                <Text style={styles.restaurantDetails}>Type: {res.type.join(", ")}</Text>
              </View>
            </View>
          ))}

          {/* Continue Button */}
          <TouchableOpacity
            style={[styles.continueButton, !selectedExperience && styles.disabledButton]}
            onPress={handleContinue}
            disabled={!selectedExperience}
          >
            <Text style={styles.continueText}>Continue</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
  
  );
};

export default ExperienceScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  scrollContainer: { padding: 20 },
  title: { fontSize: 28, fontWeight: "600", color: "#333", marginBottom: 8 },
  brand: { color: "#e53935", fontWeight: "700" },
  subtitle: { fontSize: 14, color: "#e53935", marginBottom: 15, fontWeight: "500" },
  locationText: { fontSize: 12, color: "#555", marginBottom: 15 },
  sectionHeading: { fontSize: 16, color: "#000", fontWeight: "500", marginBottom: 12, marginTop: 20 },
  experienceContainer: { flexDirection: "row", justifyContent: "space-between", marginBottom: 20 },
  experienceCard: { flex: 1, borderWidth: 1, borderColor: "#ccc", borderRadius: 12, paddingVertical: 20, marginHorizontal: 5, alignItems: "center", backgroundColor: "#fff" },
  selectedCard: { borderColor: "#e53935" },
  icon: { width: 30, height: 30, marginBottom: 8 },
  cardText: { fontSize: 14, color: "#000" },
  restaurantCard: { flexDirection: "row", marginBottom: 15, borderWidth: 1, borderColor: "#ccc", borderRadius: 12, padding: 10, backgroundColor: "#fff" },
  restaurantImage: { width: 80, height: 80, borderRadius: 8 },
  restaurantName: { fontSize: 16, fontWeight: "600", color: "#000" },
  restaurantDetails: { fontSize: 12, color: "#555" },
  continueButton: { backgroundColor: "#e53935", paddingVertical: 15, borderRadius: 12, alignItems: "center", marginTop: 20 },
  disabledButton: { backgroundColor: "#ccc" },
  continueText: { color: "#fff", fontSize: 16, fontWeight: "600" }
});
