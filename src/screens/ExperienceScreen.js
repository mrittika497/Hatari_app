import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  SafeAreaView,
  Platform,
  PermissionsAndroid,
  Alert,
  ActivityIndicator,
  Animated,
  ImageBackground
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Geolocation from 'react-native-geolocation-service';
import LinearGradient from 'react-native-linear-gradient';
import { useDispatch, useSelector } from 'react-redux';
import { fetchNearestRestaurants } from '../redux/slice/nearestResSlice';
import { setExperience, setRestaurant } from '../redux/slice/experienceSlice';
import LocationErrorModal from './LocationErrorModal';



const experiences = [
  { id: 1, title: 'Delivery', icon: require('../assets/images/delivery.png'), redirection: "HomeScreen" },
  { id: 2, title: 'Takeaway', icon: require('../assets/images/takeaway.png'), redirection: "HomeScreen" },
];

const ExperienceScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const { experienceId, selectedRestaurant } = useSelector((state) => state.experience);
  const { data: nearestRestaurants, loading, error } = useSelector(
    (state) => state.nearestRestaurants
  );

  const [location, setLocation] = useState(null);
  const [locationModalVisible, setLocationModalVisible] = useState(true);
  const [isSearching, setIsSearching] = useState(true);

  const continueScale = useRef(new Animated.Value(0)).current;
  const pressAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (experienceId && selectedRestaurant) {
      Animated.spring(continueScale, {
        toValue: 1,
        useNativeDriver: true,
        friction: 6,
      }).start();
    }
  }, [experienceId, selectedRestaurant]);

  useEffect(() => {
    requestLocationPermission();
  }, []);

  useEffect(() => {
    if (location) {
      dispatch(
        fetchNearestRestaurants({
          lat: location.latitude.toFixed(6),
          lng: location.longitude.toFixed(6),
        })
      );
    }
  }, [location]);

  useEffect(() => {
    if (nearestRestaurants && nearestRestaurants.length > 0) {
      dispatch(setRestaurant(nearestRestaurants[0]));
    }
  }, [nearestRestaurants]);

  const requestLocationPermission = async () => {
    setIsSearching(true);
    setLocationModalVisible(true);

    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        );

        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          getCurrentLocation();
        } else {
          setIsSearching(false);
        }
      } catch (err) {
        console.warn(err);
        setIsSearching(false);
      }
    } else {
      getCurrentLocation();
    }
  };

  const getCurrentLocation = () => {
    setIsSearching(true);

    Geolocation.getCurrentPosition(
      (pos) => {
        setLocation(pos.coords);
        setIsSearching(false);
        setLocationModalVisible(false);
      },
      () => {
        setIsSearching(false);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  };

  const handleContinue = () => {
    if (!experienceId || !selectedRestaurant) {
      Alert.alert('Selection Required', 'Please select a restaurant and an experience.');
      return;
    }

    const expObj = experiences.find((exp) => exp.id === experienceId);
    if (!expObj) return;

    navigation.navigate('Bottom', { screen: expObj.redirection });
  };

  return (
    <>
      <LocationErrorModal
        visible={locationModalVisible}
        searching={isSearching}
        onRetry={requestLocationPermission}
        onClose={() => setLocationModalVisible(false)}
      />

      <ImageBackground
        source={require('../assets/images/Cover/cover.jpg')}
        style={styles.bgImage}
        resizeMode="cover"
        blurRadius={3}
      >
        <View style={styles.overlay} />

        <SafeAreaView style={styles.container}>
          <Text style={styles.title}>Welcome to Hatari</Text>
          <Text style={styles.subtitle}>Elevate Your Experience</Text>

          <Text style={styles.sectionHeading}>Nearest Restaurants</Text>

          {loading && <ActivityIndicator size="large" color="#fff" />}
          {error && <Text style={styles.errorText}>{error}</Text>}

          {nearestRestaurants?.map((res) => (
            <TouchableOpacity
              key={res._id}
              style={[
                styles.restaurantCard,
                selectedRestaurant?._id === res._id && styles.selectedRestaurant,
              ]}
              onPress={() => dispatch(setRestaurant(res))}
            >
              <Image source={{ uri: res.image }} style={styles.restaurantImage} />
              <Text style={styles.restaurantName}>{res.name}</Text>
              <Text style={styles.restaurantDetails}>{res.address}</Text>
              <Text style={styles.restaurantDetails}>
                Distance: {(res.distance / 1000).toFixed(2)} km
              </Text>
            </TouchableOpacity>
          ))}

          <Text style={styles.sectionHeading}>Choose your experience</Text>

          <View style={styles.experienceContainer}>
            {experiences.map((item) => {
              const disabled = !selectedRestaurant;
              return (
                <TouchableOpacity
                  key={item.id}
                  disabled={disabled}
                  onPress={() =>
                    dispatch(setExperience({ id: item.id, type: item.title }))
                  }
                  style={[
                    styles.experienceCard,
                    experienceId === item.id && styles.selectedCard,
                    disabled && { opacity: 0.4 },
                  ]}
                >
                  <Image source={item.icon} style={styles.icon} resizeMode="contain" />
                  <Text style={styles.cardText}>{item.title}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {experienceId && selectedRestaurant && (
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={handleContinue}
            >
              <LinearGradient
                colors={['#ff3b30', '#ff6666']}
                style={styles.continueButton}
              >
                <Text style={styles.continueText}>Continue</Text>
              </LinearGradient>
            </TouchableOpacity>
          )}
        </SafeAreaView>
      </ImageBackground>
    </>
  );
};

export default ExperienceScreen;

const styles = StyleSheet.create({
  bgImage: { flex: 1, width: "100%", height: "100%" },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  container: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    paddingTop: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: "#ffffff",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 15,
    color: "#eaeaea",
    fontWeight: "700",
    marginBottom: 15,
    opacity: 0.85,
  },
  sectionHeading: {
    fontSize: 20,
    fontWeight: "900",
    color: "#fff",
    // marginTop: 25,
    marginVertical:"7%"
  },
  errorText: { color: "red", marginTop: 10 },
  restaurantCard: {
    width: "90%",
    padding: 18,
    borderRadius: 18,
    marginBottom: 16,
    backgroundColor: "rgba(255,255,255,0.12)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.20)",
    alignItems: "center",
  },
  selectedRestaurant: {
    borderColor: "#ff3636",
    backgroundColor: "rgba(14, 3, 3, 0.20)",
  },
  restaurantImage: {
    width: 130,
    height: 130,
    borderRadius: 16,
    marginBottom: 12,
  },
  restaurantName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#fff",
    textAlign: "center",
  },
  restaurantDetails: {
    fontSize: 13,
    color: "#f0f0f0",
    opacity: 0.8,
    textAlign: "center",
    marginTop: 3,
  },
  experienceContainer: {
    flexDirection: "row",
    justifyContent: "center",
    flexWrap: "wrap",
    marginTop: 10,
  },
  experienceCard: {
    width: 110,
    borderRadius: 16,
    paddingVertical: 22,
    margin: 8,
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.15)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.22)",
  },
  selectedCard: {
    borderColor: "#ff3b30",
    backgroundColor: "rgba(255,255,255,0.18)",
  },
  icon: {
    width: 42,
    height: 42,
    marginBottom: 10,
    tintColor: "#fff",
  },
  cardText: {
    fontSize: 15,
    color: "#fff",
    fontWeight: "600",
  },
  continueButton: {
    paddingVertical: 16,
    width: 220,
    borderRadius: 30,
    alignItems: "center",
    marginTop: 25,
  },
  continueText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
});
