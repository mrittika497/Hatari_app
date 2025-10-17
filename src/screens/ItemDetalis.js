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
import {fetchFoodOrders} from '../redux/slice/getfoodorderSlice';
import DashboardScreen from '../components/DashboardScreen';
import CustomHeader from '../components/CustomHeader';
import {useNavigation} from '@react-navigation/native';

const ItemDetalis = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const {orders, loading, error} = useSelector(state => state.foodOrder);
  const orderData = orders?.data || [];

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
          const restaurant = item?.restaurantId || {};
          const foodDetails = item?.foodDetails || [];
          const deliveryTime = item?.deliveryTime || '30-45 mins';
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
                navigation.navigate('OrderDetailsScreen', {order: item})
              }>
              {/* Restaurant Header */}
              <View style={styles.cardRow}>
                <Image
                  source={{
                    uri: restaurant?.image || 'https://via.placeholder.com/60',
                  }}
                  style={styles.restaurantImage}
                />
                <View style={{flex: 1, marginLeft: 12}}>
                  <Text style={styles.restaurantName}>
                    {restaurant?.name || 'Restaurant Name'}
                  </Text>
                  <Text style={styles.deliveryTime}>
                    Delivery: {deliveryTime}
                  </Text>
                </View>
              </View>

              {/* Food Items Horizontal Row */}
              <ScrollView
                // horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.foodScroll}>
                {foodDetails.map((food, idx) => (
                  <View style={{flexDirection: 'row'}}>
                    <View key={idx} style={styles.foodCard}>
                      <Image
                        source={{
                          uri:
                            food?.foodId?.image ||
                            'https://via.placeholder.com/70',
                        }}
                        style={styles.foodImage}
                      />
                      <View style={{alignItems: 'center', marginTop: 6}}>
                        <Text style={styles.foodQtyPrice}>
                          Qty: {food?.quantity} | ₹
                          {food?.price || food?.foodId?.price}
                        </Text>
                      </View>
                    </View>
                    <View style={{justifyContent: 'center'}}>
                      <Text style={styles.foodName} numberOfLines={1}>
                        {food?.foodId?.name}
                      </Text>
                    </View>
                  </View>
                ))}
              </ScrollView>

              <View>
                     <View style={{backgroundColor:"red"}}>
                  <View
                    style={[
                      styles.statusBadge,
                      {backgroundColor: statusColor},
                    ]}>
                      <Text style={styles.deliveryStatus}>deliveryStatus</Text>
                    <Text style={styles.statusText}>{status}</Text>
                  </View>
                  <View
                    style={[
                      styles.statusBadge,
                      {backgroundColor: statusColor},
                    ]}>
                    <Text style={styles.statusText}>{paymentStatus}</Text>
                  </View>
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
  container: {flex: 1, padding: 12, backgroundColor: '#f2f2f2'},
  center: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  orderCard: {
    backgroundColor: '#fff',
    borderRadius: 14,
    marginBottom: 18,
    padding: 14,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: {width: 0, height: 3},
    shadowRadius: 6,
    elevation: 5,
  },
  cardRow: {flexDirection: 'row', alignItems: 'center'},
  restaurantImage: {width: 60, height: 60, borderRadius: 12},
  restaurantName: {fontSize: 16, fontWeight: 'bold', color: '#333'},
  deliveryTime: {fontSize: 12, color: '#FF6347', marginTop: 4},
  statusBadge: {paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12,flexDirection:"row"},
  statusText: {color: '#fff', fontWeight: 'bold', fontSize: 12},
deliveryStatus :{color: '#131212ff', fontWeight: 'bold', fontSize: 12},
  foodScroll: {marginTop: 12},
  foodCard: {
    width: 100,
    marginRight: 12,
    alignItems: 'center',
    backgroundColor: '#fafafa',
    borderRadius: 10,
    padding: 6,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 4,
    // elevation: 0.6,
    marginTop: 10,
  },
  foodImage: {width: 70, height: 70, borderRadius: 10},
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

  errorText: {color: 'red', fontSize: 16, textAlign: 'center'},
  noDataText: {color: '#666', fontSize: 16, textAlign: 'center'},
});
