import React, {useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Image,
  TouchableOpacity,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';


import {useNavigation} from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import DashboardScreen from '../../components/DashboardScreen';
import CustomHeader from '../../components/CustomHeader';
import Theme from '../../assets/theme';
import { fetchFoodOrders } from '../../redux/slice/getfoodorderSlice';

const OrderSummary = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const {orders, loading, error} = useSelector(state => state.foodOrder);
  const orderData = orders?.data || [];
  // console.log(
  //   orderData[0]?.restaurant?.image,
  //   '------------------------------orderData',
  // );

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
        <Image
          source={{
            uri: 'https://cdn-icons-png.flaticon.com/512/4076/4076500.png',
          }}
          style={{width: 120, height: 120, marginBottom: 20}}
        />
        <Text style={styles.noDataText}>No orders found yet</Text>
        <Text style={{color: '#999', marginTop: 6}}>
          Start ordering delicious food 🍔
        </Text>
      </View>
    );

  return (
    <> 
          <CustomHeader title="My Orders" />

    <DashboardScreen scrollable={false}>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {orderData.map((item, index) => {
          const restaurant = item?.restaurant || {};
          console.log(
            restaurant,
            '-------------------------restaurant----------------------3333',
          );

          const foodDetails = item?.foodDetails || [];
          const deliveryTime = item?.deliveryTime || '30-45 mins';
          const status = item?.deliveryStatus || 'Ordered';
          const paymentStatus = item?.paymentStatus || 0;

          const statusColor =
            status === 'Delivered'
              ? '#4BB543'
              : status === 'Cancelled'
              ? '#d24942ff'
              : '#FF9500';

          return (
            <TouchableOpacity
              key={item._id || index}
              style={styles.orderCard}
              activeOpacity={0.9}
              onPress={() =>
                navigation.navigate('OrderDetailsScreen', {order: item})
              }>
              {/* Restaurant Header */}
              <View style={styles.headerRow}>
                <Image
                  source={{
                    uri:
                      restaurant?.image ||
                      'https://cdn-icons-png.flaticon.com/512/2921/2921820.png',
                  }}
                  style={styles.restaurantImage}
                />
                <View style={{flex: 1, marginLeft: 12}}>
                  <Text style={styles.restaurantName}>
                    {restaurant?.name || 'Restaurant Name'}
                  </Text>
                  <View style={styles.deliveryTimeRow}>
                    <Ionicons
                      name="time-outline"
                      size={14}
                      color="#FF6347"
                      style={{marginRight: 5}}
                    />
                    <Text style={styles.deliveryTimeText}>{deliveryTime}</Text>
                  </View>
                </View>
                <View style={styles.statusBadge(statusColor)}>
                  <Text style={styles.statusBadgeText}>{status}</Text>
                </View>
              </View>

              {/* Food Item List */}
              <View style={styles.foodListContainer}>
                {foodDetails.map((food, idx) => (
                  <View key={idx} style={styles.foodRow}>
                    <Image
                      source={{
                        uri:
                          food?.food?.image ||
                          'https://cdn-icons-png.flaticon.com/512/1046/1046784.png',
                      }}
                      style={styles.foodImage}
                    />

                    <View style={styles.foodInfo}>
                      <Text style={styles.foodName}>
                        {food?.foodId?.name || 'Food Item'}
                      </Text>
                      <Text style={styles.foodDesc}>
                        Qty: {food?.quantity} | ₹
                        {food?.price || food?.foodId?.price || 0}
                      </Text>
                    </View>

                    <View style={styles.foodPriceBox}>
                      <Text style={styles.foodPrice}>
                        ₹
                        {(food?.price || food?.foodId?.price || 0) *
                          (food?.quantity || 1)}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>

              {/* Footer */}
              <View style={styles.footerRow}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <MaterialIcons
                    name={
                      paymentStatus === 1 ? 'check-circle' : 'pending-actions'
                    }
                    size={18}
                    color={paymentStatus === 1 ? '#4BB543' : '#FF3B30'}
                  />
                  <Text
                    style={[
                      styles.paymentStatus,
                      {color: paymentStatus === 1 ? '#4BB543' : '#FF3B30'},
                    ]}>
                    {paymentStatus === 1 ? 'Paid' : 'Pending'}
                  </Text>
                </View>

                <TouchableOpacity
                  style={styles.viewDetailsButton}
                  onPress={() =>
                    navigation.navigate('OrderDetailsScreen', {order: item})
                  }>
                  <Text style={styles.viewDetailsText}>View Details</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </DashboardScreen>
        </>
  );
};

export default OrderSummary;

const styles = StyleSheet.create({
  container: {flex: 1, padding: 10},
  center: {flex: 1, justifyContent: 'center', alignItems: 'center'},

  orderCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 16,
    padding: 14,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowOffset: {width: 0, height: 4},
    shadowRadius: 6,
    elevation: 4,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  restaurantImage: {
    width: 60,
    height: 60,
    borderRadius: 10,
    backgroundColor: '#eee',
  },
  restaurantName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
  },
deliveryTimeRow: {
  flexDirection: 'row',
  alignItems: 'center',
  marginTop: 6,
},

deliveryTimeText: {
  fontSize: 12,
  color: '#777',
  fontWeight: '500',
},

  statusBadge: color => ({
    backgroundColor: color + '15',
    borderColor: color,
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
  }),
  statusBadgeText: {
    fontSize: 11,
    color: '#333',
    fontWeight: '600',
  },

  foodListContainer: {
    marginTop: 10,
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 8,
  },

  foodRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginVertical: 6,
    marginHorizontal: 8,
    borderRadius: 10,
    padding: 10,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 3,
    elevation: 2,
  },

  foodImage: {
    width: 70,
    height: 70,
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
  },

  foodInfo: {
    flex: 1,
    marginLeft: 12,
  },

  foodName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
  },

  foodDesc: {
    fontSize: 13,
    color: '#777',
    marginTop: 2,
  },

  foodPriceBox: {
    backgroundColor: '#FFF6F3',
    borderRadius: 8,
    paddingVertical: 4,
    paddingHorizontal: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },

  foodPrice: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FF6347',
  },

  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 14,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 10,
  },
  paymentStatus: {marginLeft: 6, fontSize: 13, fontWeight: '600'},
  viewDetailsButton: {
    backgroundColor: Theme.colors.red,
    paddingHorizontal: 12, 
    paddingVertical: 6,
    borderRadius: 8,
  },
  viewDetailsText: {color: '#fff', fontWeight: '600', fontSize: 12},

  errorText: {color: 'red', fontSize: 16, textAlign: 'center'},
  noDataText: {color: '#333', fontSize: 16, fontWeight: '600'},
});
