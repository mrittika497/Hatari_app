// ⭐ ITEM DETAILS SCREEN — CLEAN & ENHANCED
import React, {useCallback, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Image,
  TouchableOpacity,
  BackHandler,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {fetchFoodOrders} from '../redux/slice/getfoodorderSlice';
import DashboardScreen from '../components/DashboardScreen';
import CustomHeader from '../components/CustomHeader';
import {CommonActions, useFocusEffect, useNavigation} from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Theme from '../assets/theme';

const ItemDetalis = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const {orders, loading, error} = useSelector(state => state.foodOrder);
  // console.log("----------------orders",orders,"--------------------------------orders");
  

  
  const orderData = orders?.data || [];
  console.log(orderData,"----------orderData");
  
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
                  routes: [{ name: 'HomeScreen' }],
                },
              },
            ],
          })
        );
        return true; // ⛔ block default back
      }
    );

    return () => backHandler.remove(); // ✅ correct cleanup
  }, [navigation])
);

  useEffect(() => {
    dispatch(fetchFoodOrders());
  }, [dispatch]);

  if (loading)
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={Theme.colors.red} />
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
          source={{uri: 'https://cdn-icons-png.flaticon.com/512/4076/4076500.png'}}
          style={{width: 120, height: 120, marginBottom: 20}}
        />
        <Text style={styles.noDataText}>No orders found yet</Text>
        <Text style={{color: '#999', marginTop: 6}}>
          Start ordering delicious food 🍔
        </Text>
      </View>
    );

  const getSelectedPrice = food => {
    console.log(food,"---------------123food");
    
  
    
    if (!food) return 0;   
    if (food?.foodDetails?.variant === 'fullPrice') return Number(food?.foodDetails?.fullPrice || 0);
    if (food?.foodDetails?.variant === 'halfPrice') return Number(food?.foodDetails?.halfPrice || 0);
    return Number(food?.price || food?.fullPrice || food?.halfPrice || 0);
  };

//  const getBasePrice = (food) => {
//   if (!food) return 0;

//   // Priority: main item price > variant price > foodId.staticPrice
//   if (food.price != null) return Number(food.price);
//   if (food.variant === 'fullPrice' && food.fullPrice != null) return Number(food.fullPrice);
//   if (food.variant === 'halfPrice' && food.halfPrice != null) return Number(food.halfPrice);
//   if (food.fullPrice != null) return Number(food.fullPrice);
//   if (food.halfPrice != null) return Number(food.halfPrice);

//   return Number(food.foodId?.priceInfo?.staticPrice || 0);
// };

// const getAddOnsTotal = (food) => {
//   if (!food?.addOns || food.addOns.length === 0) return 0;

//   return food.addOns.reduce((sum, addon) => {
//     const addonQty = Number(addon.quantity || 1); // default to 1 if quantity missing
//     return sum + Number(addon.price || 0) * addonQty;
//   }, 0);
// };




// const getItemTotal = (food) => {
//   if (!food) return 0;

//   const qty = Number(food.quantity || 1);

//   // Determine base price
//   let basePrice = 0;
//   if (food.price != null) basePrice = Number(food.price);
//   else if (food.variant === 'fullPrice' && food.fullPrice != null) basePrice = Number(food.fullPrice);
//   else if (food.variant === 'halfPrice' && food.halfPrice != null) basePrice = Number(food.halfPrice);
//   else basePrice = Number(food.foodId?.priceInfo?.staticPrice || 0);

//   // Add-ons total
//   const addonsTotal = (food.addOns || []).reduce((sum, addon) => {
//     const addonQty = Number(addon.quantity || 1); // default 1
//     return sum + Number(addon.price || 0) * addonQty;
//   }, 0);

//   return (basePrice + addonsTotal) * qty;
// };


// const getBasePrice = (food) => {
//   if (!food) return 0;

//   // Variant-based priority
//   if (food.variant === 'fullPrice' && food.fullPrice != null) return Number(food.fullPrice);
//   if (food.variant === 'halfPrice' && food.halfPrice != null) return Number(food.halfPrice);

//   // Fallbacks
//   if (food.price != null) return Number(food.price);
//   if (food.fullPrice != null) return Number(food.fullPrice);
//   if (food.halfPrice != null) return Number(food.halfPrice);

//   // Last fallback: static price from foodId
//   return Number(food.foodId?.priceInfo?.staticPrice || 0);
// };


const getBasePrice = (food) => {
  if (!food) return 0;

  // Variant-based priority
  if (food.variant === 'fullPrice' && food.fullPrice > 0) return Number(food.fullPrice);
  if (food.variant === 'halfPrice' && food.halfPrice > 0) return Number(food.halfPrice);

  // Fallbacks
  if (food.price > 0) return Number(food.price);
  if (food.fullPrice > 0) return Number(food.fullPrice);
  if (food.halfPrice > 0) return Number(food.halfPrice);

  // Last fallback: static price from foodId
  return Number(food.foodId?.priceInfo?.staticPrice || 0);
};

const getAddOnsTotal = (food) => {
  if (!food?.addOns || food.addOns.length === 0) return 0;
  return food.addOns.reduce((sum, addon) => {
    const addonQty = Number(addon.quantity || 1);
    return sum + Number(addon.price || 0) * addonQty;
  }, 0);
};

const getItemTotal = (food) => {
  const basePrice = getBasePrice(food);
  const addonsTotal = getAddOnsTotal(food);
  const qty = Number(food.quantity || 1);
  return (basePrice + addonsTotal) * qty;
};




  return (
    <>
      <CustomHeader title="Order Summary" />
      <DashboardScreen scrollable={false}>
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
          {orderData.map((item, index) => {
  //  console.log(item,"--------------------------------itemItemDetalis88888888888888888888888888888***********");
   
            
            const restaurant = item?.restaurant || {};
            const foodDetails = item?.foodDetails || [];
            const status = item?.deliveryStatus || 'Ordered';
            const paymentStatus = item?.paymentStatus || 0;
            const statusColor =
              status === 'Delivered'
                ? '#4BB543'
                : status === 'Cancelled'
                ? '#d24942'
                : '#FF9500';

            return (
              <TouchableOpacity
                key={item._id || index}
                style={styles.orderCard}
                activeOpacity={0.9}
                onPress={() =>
                  navigation.navigate('OrderDetailsScreen', {order: item})
                }>

                {/* RESTAURANT HEADER */}
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
                      {restaurant?.name || 'Restaurant'}
                    </Text>
                  </View>
                  <View style={styles.statusBadge(statusColor)}>
                    <Text style={styles.statusBadgeText}>{status}</Text>
                  </View>
                </View>

                {/* FOOD ITEMS */}
                <View style={styles.foodListContainer}>
                  {foodDetails.map((food, idx) => {
                    console.log(food,"-------------------food");
                    
                    const basePrice = getSelectedPrice(food);
                    const addOnsTotal = getAddOnsTotal(food);
                    const totalPrice = (basePrice + addOnsTotal) * (food?.quantity || 1);

                    return (
                      <View key={idx} style={styles.foodRow}>
                        <Image
                          source={{
                            uri:
                              food?.food?.image ||
                              food?.foodId?.image ||
                              'https://cdn-icons-png.flaticon.com/512/1046/1046784.png',
                          }}
                          style={styles.foodImage}
                        />

                        <View style={styles.foodInfo}>
                          <Text style={styles.foodName}>
                            {food?.foodId?.name || 'Food Item'}
                          </Text>
                          <Text style={styles.foodDesc}>
                            Qty: {food?.quantity} |
                            {food?.variant === 'fullPrice' && ' Full Price'}
                            {food?.variant === 'halfPrice' && ' Half Price'}
                            {food?.variant === null && ' Static Price'}
                          </Text>

                          {/* AddOns */}
                          {food?.addOns?.length > 0 && (
                            <View style={{marginTop: 4}}>
                              {food.addOns.map((ad, i) => (
                                <Text key={i} style={styles.addOnText}>
                                  ➤ {ad.name} (+₹{ad.price} × {ad.quantity})
                                </Text>
                              ))}
                            </View>
                          )}

                          <Text style={[styles.foodDesc, { fontWeight: '700', marginTop: 4 }]}>
  Total: ₹{getItemTotal(food)}
</Text>


                          {/* Note */}
                          {food?.note && (
                            <Text style={[styles.foodDesc, {fontStyle: 'italic'}]}>
                              📝 {food.note} 
                            </Text>
                          )}
                        </View>

                        {/* PRICE */}
                        <View style={styles.foodPriceBox}>
                          <Text style={styles.foodPrice}>₹ {getItemTotal(food)}</Text>
                        </View>
                      </View>
                    );
                  })}
                </View>

                {/* FOOTER */}
                <View style={styles.footerRow}>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <MaterialIcons
                      name={paymentStatus === 1 ? 'check-circle' : 'pending-actions'}
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

export default ItemDetalis;


/* ---------------------- STYLES ---------------------- */

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#f9f9f9', padding: 10},
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
    width: 55,
    height: 55,
    borderRadius: 10,
    backgroundColor: '#eee',
  },
  restaurantName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
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
    marginVertical: 6,
    marginHorizontal: 8,
    borderRadius: 10,
    padding: 10,
    backgroundColor: '#fff',
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

  addOnText: {
    fontSize: 12,
    color: '#555',
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