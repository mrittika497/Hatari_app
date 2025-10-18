import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Image,
  TouchableOpacity,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFoodOrders } from '../redux/slice/getfoodorderSlice';
import DashboardScreen from '../components/DashboardScreen';
import CustomHeader from '../components/CustomHeader';
import { useNavigation } from '@react-navigation/native';
import { BASE_URL } from '../global_Url/GlobalUrl';

const ItemDetalis = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { orders, loading, error } = useSelector(state => state.foodOrder);
  const orderData = orders?.data || [];
  console.log(orderData, '----------------------orderData');

  useEffect(() => {
    dispatch(fetchFoodOrders());
  }, [dispatch]);

  if (loading)
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#FF6347" />
      </View>
    );

  if (error)
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Error: {error}</Text>
      </View>
    );

  if (orderData.length === 0)
    return (
      <View style={styles.center}>
        <Text style={styles.noDataText}>No orders found</Text>
      </View>
    );

  return (
    <DashboardScreen scrollable={false}>
      <CustomHeader />
      <ScrollView style={styles.container}>
        {orderData.map((item, index) => {
          const restaurant = item?.restaurant || {};
          const images = restaurant?.image || {}
          console.log(images,"-------------------------restaurant-----imhhggimages");
<Image
  source={{
    uri: 'https://hatari.backend.sensegeofence.com/Upload/Restaurant/1757673531195.png'
  }}
  style={styles.restaurantImage}
/>


       
          const foodDetails = item?.foodDetails || [];
          console.log(foodDetails[0]?.food?.image,"------------------------foodD");
          
          const deliveryTime = item?.deliveryTime || '30-45 mins';
          console.log(deliveryTime ,"----------------------------deliveryTime");
          
          const status = item?.deliveryStatus || 'Ordered';
          const paymentStatus = item?.paymentStatus || 0;

          const statusColor =
            status === 'Delivered'
              ? '#4BB543'
              : status === 'Cancelled'
              ? '#FF3B30'
              : '#FF9500';

          return (
            <TouchableOpacity
              key={item._id || index}
              style={styles.orderCard}
              onPress={() =>
                navigation.navigate('OrderDetailsScreen', { order: item })
              }>
              {/* Restaurant Header */}
              <View style={styles.cardRow}>
                <Image
                  source={{uri:restaurant?.img}}
                  style={styles.restaurantImage}
                />

                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={styles.restaurantName}>
                    {restaurant?.name || 'Restaurant Name'}
                  </Text>
                  <Text style={styles.deliveryTime}>
                    Delivery: {deliveryTime}
                  </Text>
                </View>
              </View>

              {/* Food Items */}
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.foodScroll}>
                {foodDetails.map((food, idx) => (
                  <View key={idx} style={styles.foodCard}>
                    <Image
                      source={{
                        uri:
                          food?.food?.image ||
                          'https://via.placeholder.com/70',
                      }}
                      style={styles.foodImage}
                    />
                    <Text
                      style={styles.foodName}
                      numberOfLines={1}
                      ellipsizeMode="tail">
                      {food?.foodId?.name}
                    </Text>
                    <Text style={styles.foodQtyPrice}>
                      Qty: {food?.quantity} | ₹
                      {food?.price || food?.foodId?.price}
                    </Text>
                  </View>
                ))}
              </ScrollView>

              {/* Order Status Section */}
              <View style={styles.statusContainer}>
                {/* Delivery Status */}
                <View style={[styles.statusCard, { borderLeftColor: statusColor }]}>
                  <View style={styles.statusHeader}>
                    <Image
                      source={{
                        uri: 'https://cdn-icons-png.flaticon.com/512/2942/2942811.png',
                      }}
                      style={styles.statusIcon}
                    />
                    <Text style={styles.statusTitle}>Delivery Status</Text>
                  </View>
                  <Text style={[styles.statusValue, { color: statusColor }]}>
                    {status}
                  </Text>
                </View>

                {/* Payment Status */}
                <View style={[styles.statusCard, { borderLeftColor: '#007AFF' }]}>
                  <View style={styles.statusHeader}>
                    <Image
                      source={{
                        uri: 'https://cdn-icons-png.flaticon.com/512/2331/2331970.png',
                      }}
                      style={styles.statusIcon}
                    />
                    <Text style={styles.statusTitle}>Payment Status</Text>
                  </View>
                  <Text
                    style={[
                      styles.statusValue,
                      { color: paymentStatus === 1 ? '#4BB543' : '#FF3B30' },
                    ]}>
                    {paymentStatus === 1 ? 'Paid' : 'Pending'}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </DashboardScreen>
  );
};

export default ItemDetalis;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 12, backgroundColor: '#f2f2f2' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  orderCard: {
    backgroundColor: '#fff',
    borderRadius: 14,
    marginBottom: 18,
    padding: 14,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 5,
  },
  cardRow: { flexDirection: 'row', alignItems: 'center' },
  // restaurantImage: { width: 60, height: 60, borderRadius: 6,backgroundColor:"red" },
  restaurantName: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  deliveryTime: { fontSize: 12, color: '#FF6347', marginTop: 4 },

  foodScroll: { marginTop: 12 },
  foodCard: {
    width: 100,
    marginRight: 12,
    alignItems: 'center',
    backgroundColor: '#fafafa',
    borderRadius: 10,
    padding: 6,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    marginTop: 10,
  },
  foodImage: { width: 70, height: 70, borderRadius: 10 },
  foodName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
    marginTop: 6,
    textAlign: 'center',
  },
  foodQtyPrice: {
    fontSize: 11,
    color: '#FF6347',
    marginTop: 2,
    textAlign: 'center',
  },

  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 14,
    gap: 10,
  },
  statusCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderLeftWidth: 5,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  statusIcon: {
    width: 18,
    height: 18,
    tintColor: '#555',
    marginRight: 6,
  },
  statusTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
  },
  statusValue: {
    fontSize: 14,
    fontWeight: 'bold',
  },

  errorText: { color: 'red', fontSize: 16, textAlign: 'center' },
  noDataText: { color: '#666', fontSize: 16, textAlign: 'center' },
});
