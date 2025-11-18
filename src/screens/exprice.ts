// src/screens/ExperienceScreen.js
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
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Geolocation from 'react-native-geolocation-service';
import LinearGradient from 'react-native-linear-gradient';
import { useDispatch, useSelector } from 'react-redux';
import { fetchNearestRestaurants } from '../redux/slice/nearestResSlice';
import { setExperience, setRestaurant } from '../redux/slice/experienceSlice';
import DashboardScreen from '../components/DashboardScreen';

// Dummy experiences
const experiences = [
  { id: 1, title: 'Delivery', icon: require('../assets/images/delivery.png'), redirection: "HomeScreen" },
  // { id: 2, title: 'Dine in', icon: require('../assets/images/dinein.png'), redirection: "DinneScreen" },
  { id: 2, title: 'Takeaway', icon: require('../assets/images/takeaway.png'), redirection: "HomeScreen" },
];

const ExperienceScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { experienceId, selectedRestaurant } = useSelector((state) => state.experience);
  const [location, setLocation] = useState(null);
  const { data: nearestRestaurants, loading, error } = useSelector(
    (state) => state.nearestRestaurants
  );

  // Animation refs
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const pressAnim = useRef(new Animated.Value(1)).current;

  // Animate when restaurant and experience are selected
  useEffect(() => {
    if (experienceId && selectedRestaurant) {
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        friction: 5,
        tension: 100,
      }).start(() => {
        // subtle continuous pulse
        Animated.loop(
          Animated.sequence([
            Animated.timing(scaleAnim, {
              toValue: 1.05,
              duration: 800,
              useNativeDriver: true,
            }),
            Animated.timing(scaleAnim, {
              toValue: 1,
              duration: 800,
              useNativeDriver: true,
            }),
          ])
        ).start();
      });
    }
  }, [experienceId, selectedRestaurant]);

  // Location permission
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
          }
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          getCurrentLocation();
        } else {
          Alert.alert('Permission Denied', 'Location permission is required');
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
        Alert.alert('Error', 'Unable to fetch location');
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  };

  const handleContinue = () => {
    if (experienceId && selectedRestaurant) {
      const selectedExp = experiences.find(exp => exp.id === experienceId);
      if (!selectedExp) return;

      if (selectedExp.redirection === 'HomeScreen') {
        navigation.navigate('Bottom', { screen: 'HomeScreen' });
      } else {
        navigation.navigate(selectedExp.redirection);
      }
    } else {
      Alert.alert('Selection Required', 'Please select a restaurant and an experience.');
    }
  };

  const handlePressIn = () => {
    Animated.spring(pressAnim, {
      toValue: 0.95,
      useNativeDriver: true,
      friction: 3,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(pressAnim, {
      toValue: 1,
      useNativeDriver: true,
      friction: 3,
    }).start();
  };

  return (
    <DashboardScreen
      contentStyle={{ alignItems: "center", justifyContent: "center" }}
    >
      <LinearGradient
     colors={["#ff3d3d", "#ff5c5c", "#fff"]}
        style={styles.gradientContainer}
      >
        <SafeAreaView style={{ flex: 1, width: '100%', alignItems: 'center' }}>
          <Text style={styles.title}>
            Welcome to Hatari</Text>
        
          <Text style={styles.subtitle}>Elevate Your Experience</Text>

          <Text style={styles.sectionHeading}>Nearest Restaurants</Text>
          {loading && <ActivityIndicator size="large" color="#e53935" />}
          {error && <Text style={{ color: 'red' }}>{error}</Text>}

          {nearestRestaurants?.map((res) => (
            <TouchableOpacity
              key={res._id}
              style={[
                styles.restaurantCard,
                selectedRestaurant?._id === res._id && styles.selectedRestaurant,
              ]}
              onPress={() => {
                dispatch(setRestaurant(res));
                dispatch(setExperience({ id: null, type: null }));
              }}
            >
              <Image source={{ uri: res.image }} style={styles.restaurantImage} />
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={styles.restaurantName}>{res.name}</Text>
                <Text style={styles.restaurantDetails}>{res.address}</Text>
                <Text style={styles.restaurantDetails}>
                  Distance: {(res.distance / 1000).toFixed(2)} km 
                </Text>
              </View>
            </TouchableOpacity>
          ))}

          <Text style={styles.sectionHeading}>Choose your experience</Text>
          <View style={styles.experienceContainer}>
            {experiences.map((item) => {
              const disabled = !selectedRestaurant;
              return (
                <TouchableOpacity
                  key={item.id}
                  style={[
                    styles.experienceCard,
                    experienceId === item.id && styles.selectedCard,
                    disabled && { opacity: 0.5 },
                  ]}
                  onPress={() => {
                    if (disabled) return;
                    dispatch(setExperience({ id: item.id, type: item.title }));
                  }}
                  disabled={disabled}
                >
                  <Image source={item.icon} style={styles.icon} resizeMode="contain" />
                  <Text style={styles.cardText}>{item.title}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Animated Continue Button */}
          {experienceId && selectedRestaurant && (
            // <Animated.View
            //   style={{
            //     transform: [
            //       { scale: Animated.multiply(scaleAnim, pressAnim) },
            //     ],
            //   }}
            // >
              <TouchableOpacity
                onPress={handleContinue}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={['#ff3b30', '#ff6666']}
                  style={styles.continueButton}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <Text style={styles.continueText}>Continue</Text>
                </LinearGradient>
              </TouchableOpacity>
            // </Animated.View>
          )}
        </SafeAreaView>
      </LinearGradient>
    </DashboardScreen>
  );
};

export default ExperienceScreen;

const styles = StyleSheet.create({
  gradientContainer: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    paddingVertical: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  brand: { color: '#e53935', fontWeight: '700' },
  subtitle: {
    fontSize: 14,
    color: '#080808ff',
    marginBottom: 15,
    fontWeight: '500',
    textAlign: 'center',
  },
  sectionHeading: { 
    fontSize: 16,
    color: '#000',
    fontWeight: '500',
    marginBottom: 12,
    marginTop: 20,
    textAlign: 'center',
  },
  experienceContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
    flexWrap: 'wrap',
  },
  experienceCard: {
    width: 100,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 12,
    paddingVertical: 20,
    margin: 5,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  selectedCard: { borderColor: '#e53935', borderWidth: 2 },
  icon: { width: 40, height: 40, marginBottom: 8 },
  cardText: { fontSize: 14, color: '#000', textAlign: 'center' },

  restaurantCard: {
    flexDirection: 'column',
    alignItems: 'center',
    width: '90%',
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 12,
    padding: 10,
    backgroundColor: '#fff',
  },
  selectedRestaurant: { borderColor: '#e53935', borderWidth: 2 },
  restaurantImage: { width: 120, height: 120, borderRadius: 12, marginBottom: 8 },
  restaurantName: { fontSize: 16, fontWeight: '600', color: '#000', textAlign: 'center' },
  restaurantDetails: { fontSize: 12, color: '#555', textAlign: 'center' },

  continueButton: {
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
    width: 180,
    alignSelf: 'center',
  },
  continueText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});
