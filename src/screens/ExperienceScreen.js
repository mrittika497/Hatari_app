// src/screens/ExperienceScreen.js
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Platform,
  PermissionsAndroid,
  Alert,
  ActivityIndicator,
  Animated,
  Easing,
  ScrollView,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import Geolocation from 'react-native-geolocation-service';
import { useDispatch, useSelector } from 'react-redux';
import { fetchNearestRestaurants } from '../redux/slice/nearestResSlice';
import { setExperience, setRestaurant } from '../redux/slice/experienceSlice';

const { width } = Dimensions.get('window');
const guidelineBaseWidth = 375;
const scale = size => (width / guidelineBaseWidth) * size;
const moderateScale = (size, factor = 0.5) =>
  size + (scale(size) - size) * factor;

const experiences = [
  {
    id: 1,
    title: 'Delivery',
    icon: require('../assets/images/delivery.png'),
    redirection: 'HomeScreen',
  },
  {
    id: 2,
    title: 'Takeaway',
    icon: require('../assets/images/takeaway.png'),
    redirection: 'HomeScreen',
  },
];

const ExperienceScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { experienceId, selectedRestaurant } = useSelector(
    state => state.experience,
  );
  const { data: nearestRestaurants, loading, error } = useSelector(
    state => state.nearestRestaurants,
  );
  const [location, setLocation] = useState(null);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const buttonAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        easing: Easing.out(Easing.exp),
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  useEffect(() => {
    requestLocationPermission();
  }, []);

  useEffect(() => {
    if (location) {
      dispatch(
        fetchNearestRestaurants({
          lat: location.latitude.toFixed(6),
          lng: location.longitude.toFixed(6),
        }),
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
            buttonPositive: 'OK',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) getCurrentLocation();
        else Alert.alert('Permission Denied', 'Location permission is required');
      } catch (err) {
        console.warn(err);
      }
    } else getCurrentLocation();
  };

  const getCurrentLocation = () => {
    Geolocation.getCurrentPosition(
      pos => setLocation(pos.coords),
      error => Alert.alert('Error', 'Unable to fetch location'),
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
    );
  };

  const handleRestaurantSelect = res => {
    if (selectedRestaurant?._id === res._id) {
      dispatch(setRestaurant(null));
    } else {
      dispatch(setRestaurant(res));
      dispatch(setExperience({ id: null, type: null }));
    }
  };

  const handleExperienceSelect = item => {
    if (!selectedRestaurant) return;
    Animated.sequence([
      Animated.timing(buttonAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(buttonAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
    dispatch(setExperience({ id: item.id, type: item.title }));
  };

  const handleContinue = () => {
    if (experienceId && selectedRestaurant) {
      const selectedExp = experiences.find(exp => exp.id === experienceId);
      if (selectedExp.redirection === 'HomeScreen')
        navigation.navigate('Bottom', { screen: 'HomeScreen' });
      else navigation.navigate(selectedExp.redirection);
    } else {
      Alert.alert(
        'Selection Required',
        'Please select a restaurant and an experience.',
      );
    }
  };

  return (
    <LinearGradient
    // colors={["#ff3d3d", "#ff5c5c", "#fff"]}
       colors={["#fff", "#eedadaff", "#ff3d3d"]}

      style={styles.gradientContainer}>
      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}
        contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>
          Welcome to <Text style={styles.brand}>Hatari</Text>
        </Text>
        <Text style={styles.subtitle}>Elevate Your Experience</Text>

        <Text style={styles.sectionHeading}>Nearest Restaurants</Text>
        {loading && <ActivityIndicator size="large" color="#e53935" />}
        {error && <Text style={{ color: 'red' }}>{error}</Text>}

        {nearestRestaurants?.map(res => (
          <TouchableOpacity
            key={res._id}
            style={[
              styles.restaurantCard,
              selectedRestaurant?._id === res._id && styles.selectedRestaurant,
            ]}
            onPress={() => handleRestaurantSelect(res)}
            activeOpacity={0.9}>
            <Image source={{ uri: res.image }} style={styles.restaurantImage} />
            <View style={{ flex: 1, marginTop: moderateScale(6) }}>
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
          {experiences.map(item => {
            const disabled = !selectedRestaurant;
            return (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.experienceCard,
                  experienceId === item.id && styles.selectedCard,
                  disabled && { opacity: 0.5 },
                ]}
                onPress={() => handleExperienceSelect(item)}
                disabled={disabled}
                activeOpacity={0.8}>
                <Image
                  source={item.icon}
                  style={styles.icon}
                  resizeMode="contain"
                />
                <Text style={styles.cardText}>{item.title}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <Animated.View
          style={{
            transform: [
              {
                scale: buttonAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [1, 1.1],
                }),
              },
            ],
          }}>
          <TouchableOpacity
            style={[
              styles.continueButton,
              (!experienceId || !selectedRestaurant) && styles.disabledButton,
            ]}
            onPress={handleContinue}
            disabled={!experienceId || !selectedRestaurant}>
            <Text style={styles.continueText}>Continue</Text>
          </TouchableOpacity>
        </Animated.View>
      </Animated.ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradientContainer: { flex: 1 },
  scrollContainer: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent:"center"
  },
  title: {
    fontSize: moderateScale(22),
    fontWeight: '600',
    color: '#333',
    marginTop: moderateScale(30),
  },
  brand: { color: '#e53935', fontWeight: '700' },
  subtitle: {
    fontSize: moderateScale(13),
    color: '#e53935',
    marginBottom: moderateScale(10),
    fontWeight: '500',
  },
  sectionHeading: {
    fontSize: moderateScale(14),
    color: '#000',
    fontWeight: '500',
    marginBottom: moderateScale(12),
    marginTop: moderateScale(20),
  },
  restaurantCard: {
    width: '90%',
    alignItems: 'center',
    marginBottom: moderateScale(15),
    borderRadius: moderateScale(14),
    padding: moderateScale(10),
    backgroundColor: '#fff',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  selectedRestaurant: {
    borderColor: '#e53935',
    borderWidth: 2,
    shadowColor: '#e53935',
    shadowOpacity: 0.2,
  },
  restaurantImage: {
    width: '50%',
    height: moderateScale(100),
    borderRadius: moderateScale(12),
  },
  restaurantName: {
    fontSize: moderateScale(14),
    fontWeight: '600',
    color: '#000',
    textAlign: 'center',
  },
  restaurantDetails: {
    fontSize: moderateScale(11),
    color: '#666',
    textAlign: 'center',
  },
  experienceContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  experienceCard: {
    width: moderateScale(95),
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: moderateScale(12),
    paddingVertical: moderateScale(18),
    margin: moderateScale(5),
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  selectedCard: { borderColor: '#e53935', borderWidth: 2 },
  icon: {
    width: moderateScale(40),
    height: moderateScale(40),
    marginBottom: moderateScale(8),
  },
  cardText: { fontSize: moderateScale(12), color: '#000' },
  continueButton: {
    backgroundColor: '#e53935',
    paddingVertical: moderateScale(12),
    paddingHorizontal: moderateScale(40),
    borderRadius: moderateScale(16),
    alignItems: 'center',
    marginTop: moderateScale(20),
  },
  disabledButton: { backgroundColor: '#ccc' },
  continueText: {
    color: '#fff',
    fontSize: moderateScale(14),
    fontWeight: '600',
  },
});

export default ExperienceScreen;
