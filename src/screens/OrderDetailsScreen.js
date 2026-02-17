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
          return true; // block default back
        },
      );

      return () => backHandler.remove();
    }, [navigation]),
  );

  const {selectedRestaurant, experienceType} = useSelector(
    state => state.experience,
  );

  // -----------------------
  // Price Calculation
  // -----------------------
  const getItemPrice = item => {
    console.log(item,"---------item");
    
  if (!item) return 0;

  // Use price if available
  if (item.price != null) return Number(item.price);

  // Use variant explicitly if set
  if (item.variant === 'fullPrice' && item.fullPrice != null) return Number(item.fullPrice);
  if (item.variant === 'halfPrice' && item.halfPrice != null) return Number(item.halfPrice);

  // If variant is null, pick whichever price exists
  if (item.fullPrice != null) return Number(item.fullPrice);
  if (item.halfPrice != null) return Number(item.halfPrice);

  // Fallback to staticPrice
  return Number(item.foodId?.priceInfo?.staticPrice ?? 0);
};


  const foodPrices = order?.foodDetails?.reduce((total, item) => {
    console.log("----------------fooditem",item);
    
    const unitPrice = getItemPrice(item);
    const addonsTotal = (item.selectedAddOns || []).reduce(
      (sum, a) => sum + Number(a.price || 0) * (Number(a.quantity || 1)),
      0,
    );
    const qty = Number(item.quantity || 1);
    return total + (unitPrice + addonsTotal) * qty;
  }, 0);

  const discount = Number(order?.discount || 0);
  const cgst = Number(order?.CGST || 0);
  const sgst = Number(order?.SGST || 0);
  const deliveryCharges = Number(order?.deliveryCharges || 0);
  const packingCharge = Number(order?.packingCharge || 0);
  const convenienceCharges = Number(order?.convenienceCharges || 0);

  const taxableAmount = Math.max(foodPrices - discount, 0);

  const totalAmountPrice = Number(
    (
      taxableAmount +
      cgst +
      sgst +
      deliveryCharges +
      packingCharge +
      convenienceCharges
    ).toFixed(2),
  );

  const restaurant = order?.restaurant || {};
  const foodDetails = order?.foodDetails || [];
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
      <CustomHeader title="Order Details" />
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
              renderItem={({item}) => {
                const unitPrice = getItemPrice(item);
                console.log(unitPrice,"---------unitPrice");
                
                const qty = Number(item.quantity || 1);
                const addonsTotal = (item.selectedAddOns || []).reduce(
                  (sum, a) => sum + Number(a.price || 0) * (Number(a.quantity || 1)),
                  0,
                );
                const totalPerItem = (unitPrice + addonsTotal) * qty;
                return (
                  <View style={styles.foodCard}>
                    <Image
                      source={{
                        uri: item?.food?.image || 'https://via.placeholder.com/80',
                      }}
                      style={styles.foodImage}
                    />
                    <Text style={styles.foodName}>{item?.foodId?.name}</Text>
                    <Text style={styles.foodQtyPrice}>
                      Qty: {qty} | ₹{unitPrice.toFixed(2)} each
                    </Text>
                    {addonsTotal > 0 && (
                      <Text style={styles.foodQtyPrice}>
                        Addons: ₹{addonsTotal.toFixed(2)}
                      </Text>
                    )}
                    <Text style={styles.foodPrice}>Total: ₹{totalPerItem.toFixed(2)}</Text>
                    {item?.note ? <Text style={styles.foodNote}>{item?.note}</Text> : null}
                  </View>
                );
              }}
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
              <Text style={styles.chargeText}>Food Total</Text>
              <Text style={styles.chargeText}>₹{foodPrices.toFixed(2)}</Text>
            </View>
            {experienceType === 'Delivery' && (
              <View style={styles.chargeRow}>
                <Text style={styles.chargeText}>Delivery</Text>
                <Text style={styles.chargeText}>₹{deliveryCharges.toFixed(2)}</Text>
              </View>
            )}
            <View style={styles.chargeRow}>
              <Text style={styles.chargeText}>Convenience</Text>
              <Text style={styles.chargeText}>₹{convenienceCharges.toFixed(2)}</Text>
            </View>
            <View style={styles.chargeRow}>
              <Text style={styles.chargeText}>Packing Charge</Text>
              <Text style={styles.chargeText}>₹{packingCharge.toFixed(2)}</Text>
            </View>
            <View style={styles.chargeRow}>
              <Text style={styles.chargeText}>CGST</Text>
              <Text style={styles.chargeText}>₹{cgst.toFixed(2)}</Text>
            </View>
            <View style={styles.chargeRow}>
              <Text style={styles.chargeText}>SGST</Text>
              <Text style={styles.chargeText}>₹{sgst.toFixed(2)}</Text>
            </View>
            <View style={styles.chargeRow}>
              <Text style={styles.chargeText}>Discount</Text>
              <Text style={styles.chargeText}>-₹{discount.toFixed(2)}</Text>
            </View>
            <View style={[styles.chargeRow, {marginTop: 8}]}>
              <Text style={[styles.chargeText, {fontWeight: 'bold', color: '#FF6347'}]}>
                Total
              </Text>
              <Text style={[styles.chargeText, {fontWeight: 'bold', color: '#FF6347'}]}>
                ₹{totalAmountPrice.toFixed(2)}
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
  foodQtyPrice: {fontSize: 12, color: '#FF6347', marginTop: 2, textAlign: 'center'},
  foodPrice: {fontSize: 13, fontWeight: 'bold', marginTop: 2, color: Theme.colors.black},
  foodNote: {fontSize: 12, color: '#555', marginTop: 2, textAlign: 'center'},

  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    flexWrap: 'wrap',
    width: '100%',
  },
  infoText: {
    fontSize: 14,
    color: '#0A0909',
    marginLeft: 6,
    flexShrink: 1,
    flexWrap: 'wrap',
  },

  chargeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  chargeText: {fontSize: 13, color: '#555'},
});
