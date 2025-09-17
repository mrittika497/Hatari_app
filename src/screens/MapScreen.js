// src/screens/MapScreen.js
import React, { useState, useEffect, useRef } from 'react';
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
  ScrollView,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import CustomSearchInput from '../components/CustomSearchInput';
import Theme from '../assets/theme';
import SaveAddressModal from '../components/SaveAddressModal';
import { GOOGLE_API_KEY } from '../global_Url/googlemapkey';


const { width, height } = Dimensions.get('window');

const MapScreen = () => {
  const mapRef = useRef(null);

  const [saveModalVisible, setSaveModalVisible] = useState(false);
  const [selectedType, setSelectedType] = useState('Home');
  const [currentLocation, setCurrentLocation] = useState(null);
  const [mapRegion, setMapRegion] = useState(null);
  const [loadingLocation, setLoadingLocation] = useState(true);
  const [location, setLocation] = useState(null);
  console.log(location,"----------------locationmap");
  

  useEffect(() => {
    requestLocationPermission();
  }, []);

  // Request Location Permission
  const requestLocationPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Permission',
            message: 'This app needs access to your location',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          getCurrentLocation();
        } else {
          setLoadingLocation(false);
          Alert.alert('Permission Denied', 'Location permission is required.');
        }
      } catch (err) {
        console.warn(err);
      }
    } else {
      getCurrentLocation();
    }
  };

  // Get Current Location
  const getCurrentLocation = () => {
    setLoadingLocation(true);
    Geolocation.getCurrentPosition(
      async position => {
        const { latitude, longitude } = position.coords;

        setCurrentLocation({ latitude, longitude });
        setMapRegion({
          latitude,
          longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        });

        // Animate map to current location
        if (mapRef.current) {
          mapRef.current.animateToRegion(
            {
              latitude,
              longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            },
            1000,
          );
        }

        // Fetch full address from Google API
        const address = await fetchAddressFromCoords(latitude, longitude);
        const loc = {
          latitude,
          longitude,
          description: address || `Lat: ${latitude.toFixed(6)}, Lng: ${longitude.toFixed(6)}`,
        };
        setLocation(loc);
        setCurrentLocation({ latitude, longitude });
        setLoadingLocation(false);
      },
      error => {
        console.log(error);
        setLoadingLocation(false);
        Alert.alert('Error', 'Unable to fetch location');
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
    );
  };

  // Animate Map to Current Location
  const goToCurrentLocation = async () => {
    if (currentLocation && mapRef.current) {
      const address = await fetchAddressFromCoords(
        currentLocation.latitude,
        currentLocation.longitude,
      );
      setLocation({
        latitude: currentLocation.latitude,
        longitude: currentLocation.longitude,
        description: address,
      });

      mapRef.current.animateToRegion(
        {
          latitude: currentLocation.latitude,
          longitude: currentLocation.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        },
        1000,
      );
    }
  };

  // Fetch Address from Google Maps API
  const fetchAddressFromCoords = async (lat, lng) => {
    try {
      const response = await fetch(
        // https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${process.env.GOOGLEAPIKEY}
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GOOGLE_API_KEY}`,
      );
      const data = await response.json();
      if (data.status === 'OK') {
        return data.results[0]?.formatted_address;
      } else {
        console.log('Geocoding error:', data.status);
        return `Lat: ${lat.toFixed(6)}, Lng: ${lng.toFixed(6)}`;
      }
    } catch (error) {
      console.log('Error fetching address:', error);
      return `Lat: ${lat.toFixed(6)}, Lng: ${lng.toFixed(6)}`;
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {loadingLocation ? (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color={Theme.colors.red} />
          <Text>Fetching your location...</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View style={styles.container}>
            {/* Top Bar */}
            <View style={styles.topRow}>
              <Text style={styles.addressText}>{location?.description}</Text>
              <TouchableOpacity onPress={goToCurrentLocation}>
                <Text style={styles.changeText}>Use Current</Text>
              </TouchableOpacity>
            </View>

            {/* Map */}
            <MapView
              ref={mapRef}
              style={styles.map}
              region={mapRegion}
              showsUserLocation={true}
              showsMyLocationButton={true}>
              {location && (
                <Marker
                  coordinate={{
                    latitude: location.latitude,
                    longitude: location.longitude,
                  }}
                />
              )}
            </MapView>

            {/* Search */}
            <CustomSearchInput
              onPlaceSelect={place => {
                const loc = {
                  latitude: place.latitude,
                  longitude: place.longitude,
                  description: place.description,
                };
                setLocation(loc);
                setCurrentLocation({ latitude: place.latitude, longitude: place.longitude });
                setMapRegion({
                  latitude: place.latitude,
                  longitude: place.longitude,
                  latitudeDelta: 0.01,
                  longitudeDelta: 0.01,
                });
                if (mapRef.current) {
                  mapRef.current.animateToRegion(
                    {
                      latitude: place.latitude,
                      longitude: place.longitude,
                      latitudeDelta: 0.01,
                      longitudeDelta: 0.01,
                    },
                    1000,
                  );
                }
              }}
            />

            {/* Address Section */}
            <View style={styles.addressSection}>
              <Text style={styles.sectionTitle}>🏠 {selectedType}</Text>
              <Text style={styles.subAddress}>
           show my address
              </Text>
            </View>

            {/* Bottom Buttons */}
            <View style={styles.bottomRow}>
              <TouchableOpacity style={styles.changeBtn} onPress={goToCurrentLocation}>
                <Text style={styles.changeBtnText}>Use Current</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.nextBtn}
                onPress={() => setSaveModalVisible(true)}>
                <Text style={styles.nextBtnText}>Next</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      )}

      {/* Save Address Modal */}
      <SaveAddressModal
        visible={saveModalVisible}
        onRequestClose={() => setSaveModalVisible(false)}
        location={location}
      />
    </SafeAreaView>
  );
};

export default MapScreen;

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },
  container: { backgroundColor: '#fff', flex: 1 },
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    borderBottomWidth: 0.5,
    borderColor: '#ccc',
  },
  addressText: { flex: 1, fontSize: 14, fontWeight: '500', color: '#222' },
  changeText: { color: Theme.colors.red, fontWeight: '600' },
  map: { width: width, height: height * 0.6 },
  addressSection: { padding: 15, marginTop: 10 },
  sectionTitle: { fontSize: 16, fontWeight: '600', marginBottom: 5 },
  subAddress: { fontSize: 13, color: '#c71616ff', marginBottom: 10 },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    borderTopWidth: 0.5,
    borderColor: '#ddd',
  },
  changeBtn: { paddingVertical: 12, paddingHorizontal: 20 },
  changeBtnText: { fontSize: 15, fontWeight: '600', color: Theme.colors.red },
  nextBtn: {
    backgroundColor: Theme.colors.red,
    borderWidth: 1,
    borderColor: Theme.colors.red,
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 30,
  },
  nextBtnText: { color: Theme.colors.white, fontWeight: '600', fontSize: 15 },
});
