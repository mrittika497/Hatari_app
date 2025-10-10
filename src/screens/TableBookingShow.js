// src/screens/TableBookingShow.js
import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import DashboardScreen from '../components/DashboardScreen';
import CustomHeader from '../components/CustomHeader';
import Theme from '../assets/theme';

const TableBookingShow = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const booking = route.params || {};

  const {
    name,
    phone,
    restaurantName,
    selectedOutlet,
    date,
    time,
    mealType,
    groupSize,
    additional,
  } = booking;

  return (
    <DashboardScreen>
      <CustomHeader title="Booking Details" />
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* Title */}
        <Text style={styles.title}>Your Table is Booked!</Text>

        {/* Restaurant Card */}
        <View style={styles.restaurantCard}>
          <Ionicons name="restaurant-outline" size={40} color={Theme.colors.red} />
          <View style={{ marginLeft: 10 }}>
            <Text style={styles.restaurantName}>{restaurantName || selectedOutlet || 'Unknown Restaurant'}</Text>
            <Text style={styles.mealType}>{mealType || 'Dinner'}</Text>
          </View>
        </View>

        {/* Booking Details */}
        <View style={styles.card}>
          <View style={styles.row}>
            <Ionicons name="person-outline" size={20} color={Theme.colors.red} />
            <Text style={styles.label}>Name</Text>
            <Text style={styles.value}>{name || 'N/A'}</Text>
          </View>

          <View style={styles.row}>
            <Ionicons name="call-outline" size={20} color={Theme.colors.red} />
            <Text style={styles.label}>Phone</Text>
            <Text style={styles.value}>{phone || 'N/A'}</Text>
          </View>

          <View style={styles.row}>
            <Ionicons name="calendar-outline" size={20} color={Theme.colors.red} />
            <Text style={styles.label}>Date</Text>
            <Text style={styles.value}>{date || 'N/A'}</Text>
          </View>

          <View style={styles.row}>
            <Ionicons name="time-outline" size={20} color={Theme.colors.red} />
            <Text style={styles.label}>Time</Text>
            <Text style={styles.value}>{time || 'N/A'}</Text>
          </View>

          <View style={styles.row}>
            <Ionicons name="people-outline" size={20} color={Theme.colors.red} />
            <Text style={styles.label}>Guests</Text>
            <Text style={styles.value}>{groupSize || '1'}</Text>
          </View>

          {additional ? (
            <View style={[styles.row, { alignItems: 'flex-start' }]}>
              <Ionicons name="chatbubble-ellipses-outline" size={20} color={Theme.colors.red} />
              <Text style={styles.label}>Special Request</Text>
              <Text style={[styles.value, { flex: 1 }]}>{additional}</Text>
            </View>
          ) : null}
        </View>

        {/* Note Section */}
        <View style={styles.noteBox}>
          <Ionicons name="information-circle-outline" size={22} color="#fff" />
          <Text style={styles.noteText}>
            Please arrive 10 minutes before your booked time. Enjoy your dining experience!
          </Text>
        </View>

        {/* Button */}
        <TouchableOpacity
          style={styles.btn}
          onPress={() => navigation.navigate('Bottom', { screen: 'HomeScreen' })}
        >
          <Ionicons name="home-outline" size={20} color="#fff" />
          <Text style={styles.btnText}>Back to Home</Text>
        </TouchableOpacity>
      </ScrollView>
    </DashboardScreen>
  );
};

export default TableBookingShow;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 40,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: Theme.colors.red,
    marginBottom: 20,
    textAlign: 'center',
  },
  restaurantCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 4,
    marginBottom: 20,
  },
  restaurantName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
  },
  mealType: {
    fontSize: 14,
    color: '#777',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
    marginLeft: 8,
    flex: 0.4,
  },
  value: {
    fontSize: 15,
    fontWeight: '600',
    color: '#000',
    flex: 0.6,
  },
  noteBox: {
    flexDirection: 'row',
    backgroundColor: Theme.colors.red,
    borderRadius: 10,
    padding: 12,
    alignItems: 'center',
    marginBottom: 30,
  },
  noteText: {
    flex: 1,
    color: '#fff',
    fontSize: 13,
    marginLeft: 8,
  },
  btn: {
    backgroundColor: Theme.colors.red,
    borderRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  btnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
    marginLeft: 6,
  },
});
