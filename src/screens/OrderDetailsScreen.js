import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, FlatList, Dimensions } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Theme from '../assets/theme';
import DashboardScreen from '../components/DashboardScreen';
import CustomHeader from '../components/CustomHeader';

const { width } = Dimensions.get('window');

const OrderDetailsScreen = ({ route }) => {
  const { order } = route.params;
  const restaurant = order?.restaurantId || {};
  const foodDetails = order?.foodDetails || [];
  const address = order?.userId || {};
  const status = order?.deliveryStatus || 'Ordered';

  const statusColor =
    status === 'Delivered' ? '#4BB543' :
    status === 'Cancelled' ? '#FF3B30' :
    '#FF9500';

  return (
    <DashboardScreen scrollable={false}> 
        <CustomHeader/>
    <ScrollView style={styles.container}>
      
      {/* Restaurant Info */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Restaurant</Text>
        <View style={styles.restaurantRow}>
          <Image source={{ uri: restaurant?.image || 'https://via.placeholder.com/100' }} style={styles.restaurantImage} />
          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text style={styles.restaurantName}>{restaurant?.name}</Text>
            <Text style={styles.orderType}>{order?.type?.toUpperCase() || 'TYPE'}</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
            <Text style={styles.statusText}>{status}</Text>
          </View>
        </View>
      </View>

      {/* Food Items */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Food Items</Text>
        <FlatList
          data={foodDetails}
          horizontal
          keyExtractor={(item, idx) => idx.toString()}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <View style={styles.foodCard}>
              <Image source={{ uri: item?.foodId?.image || 'https://via.placeholder.com/80' }} style={styles.foodImage} />
              <Text style={styles.foodName}>{item?.foodId?.name}</Text>
              <Text style={styles.foodQtyPrice}>Qty: {item?.quantity}</Text>
              <Text style={styles.foodPrice}>₹{item?.price || item?.foodId?.price}</Text>
            </View>
          )}
        />
      </View>

      {/* Delivery Address */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Delivery Address</Text>
        <View style={styles.infoRow}>
          <MaterialIcons name="location-on" size={22} color="#FF6347" />
          <View style={{ marginLeft: 10 }}>
            <Text style={styles.infoText}>{address?.name}</Text>
            <Text style={styles.infoText}>{address?.address}</Text>
            <Text style={styles.infoText}>{address?.mobileNumber}</Text>
          </View>
        </View>
      </View>

      {/* Charges */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Charges</Text>
                <View style={styles.chargeRow}>
          <Text style={styles.chargeText}>totalAmount</Text>
          <Text style={styles.chargeText}>₹{order?.totalAmount || 0}</Text>
        </View>
        <View style={styles.chargeRow}>
          <Text style={styles.chargeText}>Delivery</Text>
          <Text style={styles.chargeText}>₹{order?.deliveryCharges || 0}</Text>
        </View>
        <View style={styles.chargeRow}>
          <Text style={styles.chargeText}>Convenience</Text>
          <Text style={styles.chargeText}>₹{order?.convenienceCharges || 0}</Text>
        </View>
                   <View style={styles.chargeRow}>
          <Text style={styles.chargeText}>packingCharge</Text>
          <Text style={styles.chargeText}>₹{order?.packingCharge || 0}</Text>
        </View>
        <View style={styles.chargeRow}>
          <Text style={styles.chargeText}>CGST</Text>
          <Text style={styles.chargeText}>₹{order?.CGST || 0}</Text>
        </View>
        <View style={styles.chargeRow}>
          <Text style={styles.chargeText}>SGST</Text>
          <Text style={styles.chargeText}>₹{order?.SGST || 0}</Text>
        </View>
    <View style={styles.chargeRow}>
          <Text style={styles.chargeText}>couponCode</Text>
          <Text style={styles.chargeText}>₹{order?.couponCode || 0}</Text>
        </View>
        <View style={[styles.chargeRow, { marginTop: 8 }]}>
          <Text style={[styles.chargeText, { fontWeight: 'bold', color: '#FF6347' }]}>Total</Text>
          <Text style={[styles.chargeText, { fontWeight: 'bold', color: '#FF6347' }]}>₹{order?.grossAmount || 0}</Text>
        </View>
      </View>

    </ScrollView>
    </DashboardScreen>
  );
};

export default OrderDetailsScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f2f2f2', padding: 10 },

  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },

  sectionTitle: { fontSize: 14, fontWeight: 'bold', color: '#333', marginBottom: 8 },

  restaurantRow: { flexDirection: 'row', alignItems: 'center' },
  restaurantImage: { width: 100, height: 100, borderRadius: 12 },
  restaurantName: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  orderType: { fontSize: 13, color: '#FF6347', marginTop: 2 },
  statusBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
  statusText: { color: '#fff', fontWeight: 'bold', fontSize: 12 },

  foodCard: {
    width: width / 3,
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    padding: 8,
    marginRight: 10,
    alignItems: 'center',
  },
  foodImage: { width: 80, height: 80, borderRadius: 12, marginBottom: 6 },
  foodName: { fontSize: 13, fontWeight: '600', textAlign: 'center' ,color:Theme.colors.black},
  foodQtyPrice: { fontSize: 12, color: '#FF6347', marginTop: 2 ,},
  foodPrice: { fontSize: 13, fontWeight: 'bold', marginTop: 2 ,color:Theme.colors.black},

  infoRow: { flexDirection: 'row', alignItems: 'flex-start', marginTop: 4 },
  infoText: { fontSize: 13, color: '#0a0909ff', marginTop: 2 },

  chargeRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 },
  chargeText: { fontSize: 13, color: '#555' },
});
