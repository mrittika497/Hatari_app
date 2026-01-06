import React, {useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  FlatList,
  Dimensions,
  BackHandler,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Theme from '../assets/theme';
import DashboardScreen from '../components/DashboardScreen';
import CustomHeader from '../components/CustomHeader';
import {useSelector} from 'react-redux';
import {
  CommonActions,
  useFocusEffect,
  useNavigation,
} from '@react-navigation/native';

const {width} = Dimensions.get('window');

const OrderDetailsScreen = ({route}) => {
  const navigation = useNavigation();
  const {order} = route.params;
  console.log('order',"---------------------------",order);
  
  console.log(order, 'orderDetails');
  




  useFocusEffect(
    useCallback(() => {
      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        () => {
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [
                {
                  name: 'Bottom',
                  state: {
                    routes: [{name: 'HomeScreen'}],
                  },
                },
              ],
            }),
          );
          return true; // ⛔ block default back
        },
      );

      return () => backHandler.remove(); // ✅ correct cleanup
    }, [navigation]),
  );

  const {selectedRestaurant, experienceType} = useSelector(
    state => state.experience,
  );
// ✅ DEFINE FIRST
const getItemPrice = item => {
  if (item.variant === 'full') {
    return item.fullPrice ?? item.foodId?.priceInfo?.fullPrice ?? 0;
  }

  if (item.variant === 'half') {
    return item.halfPrice ?? item.foodId?.priceInfo?.halfPrice ?? 0;
  }

  return (
    item.price ??
    item.foodId?.priceInfo?.fullPrice ??
    item.foodId?.priceInfo?.halfPrice ??
    0
  );
};

// ✅ THEN USE IT
const foodprices = order?.foodDetails.reduce((total, item) => {
  const unitPrice = getItemPrice(item);
  const qty = Number(item.quantity || 1);
  return total + unitPrice * qty;
}, 0);

const foodPrices = Number(foodprices || 0);
const discount = Number(order?.discount || 0);
const cgst = Number(order?.CGST || 0);
const sgst = Number(order?.SGST || 0);

const taxableAmount = Math.max(foodPrices - discount, 0);

const totalAmountPrice = Number(
  (taxableAmount + cgst + sgst).toFixed(2)
);

console.log('Total Amount:', totalAmountPrice);





  const restaurant = order?.restaurant || {};
  const foodDetails = order?.foodDetails || [];
  console.log(foodDetails, 'foodDetails');

  const address = order?.address || {};

  const status = order?.deliveryStatus || 'Ordered';

  const statusColor =
    status === 'Delivered'
      ? '#4BB543'
      : status === 'Cancelled'
      ? '#FF3B30'
      : '#FF9500';

  return (
    <>
      <CustomHeader title="Order Detalis" />
      <DashboardScreen scrollable={false}>
        <ScrollView
          style={styles.container}
          contentContainerStyle={{paddingBottom: 30}}
          showsVerticalScrollIndicator={false}>
          {/* Restaurant Info */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Restaurant</Text>
            <View style={styles.restaurantRow}>
              <Image
                source={{
                  uri: restaurant?.image || 'https://via.placeholder.com/100',
                }}
                style={styles.restaurantImage}
              />
              <View style={{flex: 1, marginLeft: 10}}>
                <Text style={styles.restaurantName}>{restaurant?.name}</Text>
                <Text style={styles.orderType}>
                  {order?.type?.toUpperCase() || 'TYPE'}
                </Text>
              </View>
              <View
                style={[styles.statusBadge, {backgroundColor: statusColor}]}>
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
              renderItem={({item}) => (
                <View style={styles.foodCard}>
                  <Image
                    source={{
                      uri:
                        item?.food?.image || 'https://via.placeholder.com/80',
                    }}
                    style={styles.foodImage}
                  />
                  <Text style={styles.foodName}>{item?.foodId?.name}</Text>
                  <Text style={styles.foodQtyPrice}>Qty: {item?.quantity}</Text>
                  <Text style={styles.foodPrice}>₹{getItemPrice(item)}</Text>

                  <Text style={styles.foodPrice}>{item?.note}</Text>
                </View>
              )}
            />
          </View>

          {/* Delivery Address */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Delivery Address</Text>
            <View style={styles.infoRow}>
              <MaterialIcons name="location-on" size={22} color="#FF6347" />
              <View style={{marginLeft: 10}}>
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
              <Text style={styles.chargeText}>
                ₹{(foodprices || 0).toFixed(2)}
              </Text>
            </View>
            {experienceType === 'Delivery' && (
              <View style={styles.chargeRow}>
                <Text style={styles.chargeText}>Delivery</Text>
                <Text style={styles.chargeText}>
                  ₹{order?.deliveryCharges || 0}
                </Text>
              </View>
            )}

            <View style={styles.chargeRow}>
              <Text style={styles.chargeText}>Convenience</Text>
              <Text style={styles.chargeText}>
                ₹{order?.convenienceCharges || 0}
              </Text>
            </View>
            <View style={styles.chargeRow}>
              <Text style={styles.chargeText}>packingCharge</Text>
              <Text style={styles.chargeText}>
                ₹{order?.packingCharge || 0}
              </Text>
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
              <Text style={styles.chargeText}>discount</Text>
              <Text style={styles.chargeText}>₹{order?.discount || 0}</Text>
            </View>
            <View style={[styles.chargeRow, {marginTop: 8}]}>
              <Text
                style={[
                  styles.chargeText,
                  {fontWeight: 'bold', color: '#FF6347'},
                ]}>
                Total
              </Text>
              <Text
                style={[
                  styles.chargeText,
                  {fontWeight: 'bold', color: '#FF6347'},
                ]}>
                ₹{totalAmountPrice || 0}
              </Text>
            </View>
          </View>
        </ScrollView>
      </DashboardScreen>
    </>
  );
};

export default OrderDetailsScreen;

const styles = StyleSheet.create({
  container: {flex: 1, padding: 10},

  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: {width: 0, height: 2},
    elevation: 3,
  },

  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },

  restaurantRow: {flexDirection: 'row', alignItems: 'center'},
  restaurantImage: {width: 100, height: 100, borderRadius: 12},
  restaurantName: {fontSize: 16, fontWeight: 'bold', color: '#333'},
  orderType: {fontSize: 13, color: '#FF6347', marginTop: 2},
  statusBadge: {paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12},
  statusText: {color: '#fff', fontWeight: 'bold', fontSize: 12},

  foodCard: {
    width: width / 3,
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    padding: 8,
    marginRight: 10,
    alignItems: 'center',
  },
  foodImage: {width: 80, height: 80, borderRadius: 12, marginBottom: 6},
  foodName: {
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
    color: Theme.colors.black,
  },
  foodQtyPrice: {fontSize: 12, color: '#FF6347', marginTop: 2},
  foodPrice: {
    fontSize: 13,
    fontWeight: 'bold',
    marginTop: 2,
    color: Theme.colors.black,
  },

  infoRow: {
    flexDirection: 'row',
    alignItems: 'center', // FIX 1: Perfect vertical alignment
    marginTop: 6,
    flexWrap: 'wrap', // FIX 2: Prevents text from going outside the box
    width: '100%', // FIX 3: Makes wrapping work properly
  },

  infoText: {
    fontSize: 14,
    color: '#0A0909',
    marginLeft: 6, // Space between icon & text
    flexShrink: 1, // FIX 4: Prevents overflow
    flexWrap: 'wrap', // Ensures long text wraps properly
  },

  chargeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  chargeText: {fontSize: 13, color: '#555'},
});
