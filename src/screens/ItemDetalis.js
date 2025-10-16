import React, { useEffect } from 'react';
import { 
  View, Text, StyleSheet, ActivityIndicator, Dimensions, Image, ScrollView 
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFoodOrders } from '../redux/slice/getfoodorderSlice';
import DashboardScreen from '../components/DashboardScreen';
import CustomHeader from '../components/CustomHeader';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const { width } = Dimensions.get('window');

const ItemDetalis = () => {
    const {selectedRestaurant, experienceType} = useSelector(
      state => state.experience,
    );
  const dispatch = useDispatch();
  const { orders, loading, error } = useSelector(state => state.foodOrder);
  const orderData = orders?.data || [];

  useEffect(() => {
    dispatch(fetchFoodOrders());
  }, [dispatch]);

  if (loading) return <View style={styles.center}><ActivityIndicator size="large" color="#FF6347" /></View>;
  if (error) return <View style={styles.center}><Text style={styles.errorText}>Error: {error}</Text></View>;
  if (orderData.length === 0) return <View style={styles.center}><Text style={styles.noDataText}>No orders found</Text></View>;

  return (
    <DashboardScreen scrollable={false}>
      <CustomHeader />
      <ScrollView style={styles.container}>
        {orderData.map((item, index) => {
          const restaurant = item?.restaurantId || {};
          const foodDetails = item?.foodDetails || [];
          const address = item?.address || {};
          console.log(address,"----------------------address");
          
          const status = item?.deliveryStatus || 'Ordered';
          const statusColor = status === 'Delivered' ? '#4BB543' 
                            : status === 'Cancelled' ? '#FF3B30'
                            : '#FF9500';

          return (
            <View key={item._id || index} style={styles.orderCard}>

              {/* Restaurant Header */}
              <View style={styles.restaurantHeader}>
                <Image source={{ uri: restaurant?.image || 'https://via.placeholder.com/60' }} style={styles.restaurantImage} />
                <View style={{ flex: 1, marginLeft: 10 }}>
                  <Text style={styles.restaurantName}>{restaurant?.name || 'Restaurant Name'}</Text>
                  <Text style={styles.orderType}>{item?.type?.toUpperCase() || 'TYPE'}</Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
                  <Text style={styles.statusText}>{status}</Text>
                </View>
              </View>

              {/* Food Items */}
              <View style={styles.foodContainer}>
                {foodDetails.length > 0 ? foodDetails.map((food, idx) => (
                  <View key={idx} style={styles.foodRow}>
                    <Image source={{ uri: food?.foodId?.image || 'https://via.placeholder.com/50' }} style={styles.foodImage} />
                    <View style={{ flex: 1, marginLeft: 10 }}>
                      <Text style={styles.foodName}>{food?.foodId?.name || 'Food Name'}</Text>
                      <Text style={styles.foodQtyPrice}>Qty: {food?.quantity || 0} × ₹{food?.price || food?.foodId?.price || 0}</Text>
                      {food?.foodId?.description ? <Text style={styles.foodDesc}>{food.foodId.description}</Text> : null}
                    </View>
                  </View>
                )) : <Text style={{ color:'#666' }}>No food items</Text>}
              </View>

              {/* Delivery Address */}
              <View style={styles.infoCard}>
                <MaterialIcons name="location-on" size={20} color="#FF6347" />
                <View style={{ marginLeft: 10 }}>
                  <Text style={styles.infoTitle}>Delivery Address</Text>
                  <Text style={styles.infoText}>
                    {address?.flat || ''}{address?.apartment ? `, ${address.apartment}` : ''}
                  </Text>
                  <Text style={styles.infoText}>{address?.address || ''}</Text>
                </View>
              </View>

              {/* Charges */}
              <View style={styles.infoCard}>
                {/* <MaterialIcons name="attach-money" size={20} color="#FF6347" /> */}
                <View style={{ marginLeft: 10, flex: 1 }}>
                  <Text style={styles.infoTitle}>Charges</Text>
                  { experienceType == 'Delivery' && ( 
                  <Text style={styles.infoText}>Delivery: ₹{item?.deliveryCharges || 0}</Text>
                  )}
                  <Text style={styles.infoText}>Convenience: ₹{item?.convenienceCharges || 0}</Text>
                  <Text style={styles.infoText}>CGST: ₹{item?.CGST || 0}</Text>
                   <Text style={styles.infoText}>SGST: ₹{item?.SGST || 0}</Text>
                  <Text style={[styles.infoText, { fontWeight: 'bold', color: '#FF6347' }]}>Total: ₹{item?.grossAmount || 0}</Text>
                </View>
              </View>

            </View>
          );
        })}
      </ScrollView>
    </DashboardScreen>
  );
};

export default ItemDetalis;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10, backgroundColor: '#f2f2f2' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  orderCard: {
    backgroundColor: '#fff', borderRadius: 12, marginBottom: 20, padding: 15,
    shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.1, shadowRadius: 5, elevation: 5,
  },
  restaurantHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  restaurantImage: { width: 60, height: 60, borderRadius: 12 },
  restaurantName: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  orderType: { fontSize: 13, color: '#FF6347', marginTop: 2 },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  statusText: { color: '#fff', fontWeight: 'bold', fontSize: 12 },
  foodContainer: { marginBottom: 15 },
  foodRow: { flexDirection: 'row', marginBottom: 10, alignItems: 'center' },
  foodImage: { width: 50, height: 50, borderRadius: 8 },
  foodName: { fontSize: 14, fontWeight: '600', color: '#333' },
  foodQtyPrice: { fontSize: 12, color: '#FF6347', marginTop: 2 },
  foodDesc: { fontSize: 12, color: '#666' },
  infoCard: { flexDirection: 'row', backgroundColor: '#f9f9f9', padding: 10, borderRadius: 10, marginBottom: 10, alignItems: 'center' },
  infoTitle: { fontSize: 14, fontWeight: 'bold', color: '#333' },
  infoText: { fontSize: 13, color: '#555', marginTop: 2 },
  errorText: { color: 'red', fontSize: 16, textAlign: 'center' },
  noDataText: { color: '#666', fontSize: 16, textAlign: 'center' },
});
