// ✅ FULL WORKING ORDER SUMMARY SCREEN (UPDATED)
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Modal,
  ToastAndroid,
  ActivityIndicator,
  Dimensions,
  Alert,
  LogBox,
} from 'react-native';

import Ionicons from 'react-native-vector-icons/Ionicons';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';

import {useDispatch, useSelector} from 'react-redux';
import DashboardScreen from '../components/DashboardScreen';
import CustomHeader from '../components/CustomHeader';

import {clearCart} from '../redux/slice/cartSlice';
import {fetchDeliverySettings} from '../redux/slice/deliverySettingsSlice';
import {fetchCoupons} from '../redux/slice/couponSlice';
import {postBilling} from '../redux/slice/postBillingSlice';
import {
  fetchUserAddresses,
  deleteAddress,
} from '../redux/slice/saveaddressSlice';
import {deleteUserAddress} from '../redux/slice/AddressDeleteSlice';

const {width} = Dimensions.get('window');

const OrderSummaryScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const {selectedRestaurant, experienceType} = useSelector(
    state => state.experience,
  );
  const {billingdata} = useSelector(state => state.billing);
  console.log(
    billingdata,
    '--------------------billingdata----------------------by api',
  );

  const {addresses, loading} = useSelector(state => state.address);
  const {items: cartItems} = useSelector(state => state.cart);
  console.log(cartItems, '------------------cartItems');

  const {token} = useSelector(state => state.auth);
  const {data} = useSelector(state => state.deliverySettings);
  const couponState = useSelector(state => state.coupons);

  const couponList = couponState?.list?.data || [];

  const [savedAddress, setSavedAddress] = useState(null);
  const [userid, setUserId] = useState(null);
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [codModalVisible, setCodModalVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  // Currency formatter
  const formatCurrency = value => {
    try {
      return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 2,
      }).format(value);
    } catch {
      const n = Number(value) || 0;
      return `₹${n.toFixed(2)}`;
    }
  };

  // Fetch data
  useEffect(() => {
    dispatch(fetchDeliverySettings());
    dispatch(fetchCoupons());
    dispatch(fetchUserAddresses(token));
  }, []);

  // Load address
  useEffect(() => {
    const load = async () => {
      const saved = await AsyncStorage.getItem('savedAddress');
      if (saved) setSavedAddress(JSON.parse(saved));
      else if (addresses?.length > 0) {
        const first = addresses[0];
        setSavedAddress(first);
        await AsyncStorage.setItem('savedAddress', JSON.stringify(first));
      }
    };
    load();
  }, [addresses]);

  // User ID
  useEffect(() => {
    (async () => {
      const id = await AsyncStorage.getItem('userId');
      if (id) setUserId(id);
    })();
  }, []);

  // Total calculations
  // const itemTotal = cartItems.reduce((sum, item) => {
  //   return sum + item.totalPrice * item.quantity;
  // }, 0);

  // Calculate total addon price for an item
const getAddOnsTotal = (item) => {
  return (item?.selectedAddOns || []).reduce(
    (sum, addon) => sum + Number(addon.price),
    0
  );
};

// Calculate total price for a single cart item
const getItemTotal = (item) => {
  const quantity = Number(item.quantity) || 1;

  // Base price (half/full/static)
  const basePrice = Number(item.totalPrice) || 0;
  console.log(basePrice,"----------------------basePrice");
  

  // Add-ons total for ONE unit
  const addonsTotal =
    (item?.selectedAddOns || []).reduce((sum, add) => {
      return sum + Number(add.price || 0);
    }, 0);

  // Multiply both by quantity
  return (basePrice + addonsTotal) * quantity;
};


// Final total for all cart items
const itemTotal = cartItems.reduce((sum, item) => {
  return sum + getItemTotal(item);
}, 0);


  console.log(itemTotal, '------------------itemTotal777');

  const packingFee = cartItems.reduce(
    (sum, item) => sum + (item.packagingCharges || 0),
    0,
  );

  let discount = 0;

  if (selectedCoupon) {
    discount =
      selectedCoupon.discountType === 'percentage'
        ? (itemTotal * selectedCoupon.discountValue) / 100
        : selectedCoupon.discountValue;

    if (itemTotal < selectedCoupon.minOrderAmount) discount = 0;
  }

  const cgstAmt = data?.Cgst ? (itemTotal * parseFloat(data.Cgst)) / 100 : 0;
  const sgstAmt = data?.Sgst ? (itemTotal * parseFloat(data.Sgst)) / 100 : 0;

  let convenienceAmt = 0;
  if (data?.convenience_charges_type === 'percentage') {
    convenienceAmt = (itemTotal * data.convenience_charges_value) / 100;
  } else if (data?.convenience_charges_type === 'flat') {
    convenienceAmt = data.convenience_charges_value || 0;
  }

  const grandTotal =
    itemTotal +
    (data?.delivery_charges_value || 0) +
    packingFee +
    cgstAmt +
    sgstAmt +
    convenienceAmt -
    discount;

  // Apply coupon
  const applyCoupon = coupon => {
    if (itemTotal < coupon.minOrderAmount) {
      ToastAndroid.show(
        `Min order ₹${coupon.minOrderAmount} required`,
        ToastAndroid.SHORT,
      );
      return;
    }

    setSelectedCoupon(coupon);
    ToastAndroid.show(`${coupon.code} applied`, ToastAndroid.SHORT);
  };

  // Proceed button (MINIMUM ORDER VALIDATION ADDED)
  const handleProceed = () => {
    if (itemTotal < 500) {
      ToastAndroid.show('Minimum order amount is ₹500', ToastAndroid.SHORT);
      return;
    }

    if (!savedAddress) {
      ToastAndroid.show('Add a delivery address.', ToastAndroid.SHORT);
      return;
    }

    setCodModalVisible(true);
  };

  // COD confirm
  const handleConfirmCOD = async () => {
    console.log(
      userid,
      selectedRestaurant?._id,
      savedAddress?._id,
      '------------------why error',
    );

    try {
      const billingData = {
        userId: userid,
        restaurantId: selectedRestaurant?._id || '12345',
        address: savedAddress?._id || '54321',
        billingName: savedAddress?.name,
        billingMobile: savedAddress?.contact,
        type: experienceType?.toLowerCase() || 'delivery',

        deliveryCharges: Number(data?.delivery_charges_value) || 0,

        foodDetails: cartItems.map(item => {
  console.log(item, '----------------------item ------------------11223');

  const priceInfo = item?.priceInfo || {};

  let obj = {
    foodId: item.id || item.foodId,
    quantity: Number(item.quantity),
    variant: item.selectedOption || 'full',
    note: item.note || '',
  };

  console.log(obj, '---------------------------obj');

  // 👉 Add Add-ons to object
obj.addOns = (item.selectedAddOns || []).map(add => ({
  name: add.name,
  image: add.image || "",
  type: add.type || "",
  price: Number(add.price) || 0,
}));


  // 👉 If item has NO variation
  if (!item?.hasVariation) {
    obj.price =
      Number(item?.totalPrice) || Number(priceInfo?.staticPrice) || 0;
  }

  // 👉 If item has variation
  else {
    if (item.selectedOption === 'full') {
      obj.variant = 'full';
      obj.price = Number(priceInfo.fullPrice);
    } else {
      obj.variant = 'half';
      obj.price = Number(priceInfo.halfPrice);
    }
  }

  return obj;
}),


        totalAmount: itemTotal,
        grossAmount: grandTotal,
        packingCharge: packingFee,
        CGST: cgstAmt,
        SGST: sgstAmt,
        couponCode: selectedCoupon?.code || null,
        paymentStatus: 'Pending',
      };

      await dispatch(postBilling(billingData)).unwrap();
      dispatch(clearCart());
      setCodModalVisible(false);

      ToastAndroid.show('Order placed successfully!', ToastAndroid.LONG);

      // navigation.navigate('OrderSuccessScreen');
    } catch (e) {
      ToastAndroid.show('Order failed. Try again.', ToastAndroid.SHORT);
    }
  };
  const [localAddresses, setLocalAddresses] = useState([]);

  useEffect(() => {
    setLocalAddresses(addresses);
  }, [addresses]);

  const handleDeleteAddress = id => {
    console.log(id, '------------------id');
    setLocalAddresses(prev => prev.filter(item => item._id !== id));
    Alert.alert('Delete Address', 'Are you sure?', [
      {text: 'Cancel', style: 'cancel'},
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            // Dispatch delete thunk
            await dispatch(deleteUserAddress(id)).unwrap();

            // Update savedAddress if it was the deleted one
            if (savedAddress?._id === id) {
              setSavedAddress(null);
              await AsyncStorage.removeItem('savedAddress');
            }

            ToastAndroid.show('Address deleted', ToastAndroid.SHORT);
          } catch (error) {
            ToastAndroid.show('Failed to delete address', ToastAndroid.SHORT);
          }
        },
      },
    ]);
  };

  return (
    <>
      <CustomHeader title="Order Summary" />
      <DashboardScreen scrollable={false}>
        <ScrollView
          contentContainerStyle={{paddingBottom: 200}}
          showsVerticalScrollIndicator={false}>
          {/* ADDRESS CARD */}
          {/* ADDRESS CARD */}
          <View style={styles.addressCard}>
            {savedAddress ? (
              <>
                <View style={{flex: 1}}>
                  <Text style={styles.addrName}>
                    {savedAddress?.name} ({savedAddress?.addressType})
                  </Text>
                  <Text style={styles.addrDetails}>
                    {savedAddress.flat}, {savedAddress.address},{' '}
                    {savedAddress.pin}
                  </Text>
                  <Text style={styles.addrPhone}>{savedAddress.contact}</Text>
                </View>

                <TouchableOpacity
                  onPress={() => setModalVisible(true)}
                  style={styles.changeBtn}>
                  <Text style={styles.changeText}>Change</Text>
                </TouchableOpacity>
              </>
            ) : (
              <TouchableOpacity
                onPress={() => navigation.navigate('MapScreen')}
                style={{flexDirection: 'row', alignItems: 'center'}}>
                <Icon name="add-location-alt" size={22} color="red" />
                <Text style={styles.addAddressText}>Add Delivery Address</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* COUPONS */}
          <View style={styles.sectionBox}>
            <Text style={styles.sectionTitle}>Available Coupons</Text>

            {couponList.map(coupon => (
              <LinearGradient
                key={coupon._id}
                colors={
                  selectedCoupon?._id === coupon._id
                    ? ['#f50606e6', '#c16280ff']
                    : ['#e47369ff', '#db2b2bff']
                }
                style={styles.couponCard}>
                <View style={{flex: 1}}>
                  <Text style={styles.couponDesc}>{coupon.description}</Text>
                  <Text style={styles.couponDetails}>
                    Min ₹{coupon.minOrderAmount} | {coupon.discountDisplay}
                  </Text>
                </View>

                <TouchableOpacity
                  onPress={() => applyCoupon(coupon)}
                  style={[
                    styles.applyBtn,
                    selectedCoupon?._id === coupon._id && {
                      backgroundColor: '#ccc',
                    },
                  ]}>
                  <Text style={styles.applyText}>
                    {selectedCoupon?._id === coupon._id ? 'APPLIED' : 'APPLY'}
                  </Text>
                </TouchableOpacity>
              </LinearGradient>
            ))}
          </View>

          {/* CART ITEMS */}
          <View style={styles.sectionBox}>
            <Text style={styles.sectionTitle}>Your Items</Text>

            {cartItems.map(item => (
              <View key={item._id} style={styles.itemRow}>
                <Image source={{uri: item.image}} style={styles.itemImage} />

                <View style={{flex: 1, marginLeft: 10}}>
                  <Text style={styles.itemName}>{item?.name}</Text>
                  <Text style={styles.foodQtyPrice}>Qty: {item?.quantity}</Text>

                  <Text style={styles.itemPrice}>
                    {formatCurrency(
                      (item?.totalPrice || item?.priceInfo?.staticPrice || 0) *
                        (item?.quantity || 1),
                    )}{' '}
                    {item.selectedOption === 'half'
                      ? '(Half)'
                      : item.selectedOption === 'full'
                      ? '(Full)'
                      : ''}
                  </Text>

                  <Text style={{color: '#555', fontSize: 13}}>
                    {item?.selectedAddOns
                      ?.map(a => `${a.name} (+₹${a.price})`)
                      .join(', ')}
                  </Text>

                  {item.note ? (
                    <View style={styles.noteTag}>
                      <Text style={styles.noteText}>📝 {item.note}</Text>
                    </View>
                  ) : null}
                </View>

                <Text style={styles.itemPrice}>
                  {formatCurrency(
                    (item?.totalPrice || item?.priceInfo?.staticPrice || 0) *
                      (item?.quantity || 1),
                  )}
                </Text>
              </View>
            ))}
          </View>

          {/* BILL DETAILS */}
          <View style={styles.sectionBox}>
            <Text style={styles.sectionTitle}>Bill Details</Text>

            <View style={styles.billRow}>
              <Text style={styles.billLabel}>Item Total</Text>
              <Text style={styles.billLabel}>{formatCurrency(itemTotal)}</Text>
            </View>

            {cartItems.map((item, index) =>
              item?.selectedAddOns?.length > 0 ? (
                <View key={index}>
                  <Text style={{fontWeight: '600', marginTop: 10}}>
                    {item.name}
                  </Text>

                  {item.selectedAddOns.map((a, i) => (
                    <View key={i} style={styles.billRow}>
                      <Text style={styles.billLabel}>{a.name}</Text>
                      <Text style={styles.billLabel}>
                        {formatCurrency(a.price)}
                      </Text>
                    </View>
                  ))}
                </View>
              ) : null,
            )}

            <View style={styles.billRow}>
              <Text style={styles.billLabel}>Delivery Fee</Text>
              <Text style={styles.billLabel}>
                {formatCurrency(data?.delivery_charges_value || 0)}
              </Text>
            </View>

            <View style={styles.billRow}>
              <Text style={styles.billLabel}>Packing Fee</Text>
              <Text style={styles.billLabel}>{formatCurrency(packingFee)}</Text>
            </View>

            {data?.Cgst && (
              <View style={styles.billRow}>
                <Text style={styles.billLabel}>CGST ({data.Cgst}%)</Text>
                <Text style={styles.billValue}>{formatCurrency(cgstAmt)}</Text>
              </View>
            )}

            {data?.Sgst && (
              <View style={styles.billRow}>
                <Text style={styles.billLabel}>SGST ({data.Sgst}%)</Text>
                <Text style={styles.billValue}>{formatCurrency(sgstAmt)}</Text>
              </View>
            )}

            {selectedCoupon && (
              <View style={styles.billRow}>
                <Text style={styles.billLabel}>Coupon Discount</Text>
                <Text style={styles.billLabel}>
                  - {formatCurrency(discount)}
                </Text>
              </View>
            )}

            <View style={styles.divider} />

            <View style={styles.billRow}>
              <Text style={styles.totalLabel}>Grand Total</Text>
              <Text style={styles.totalValue}>
                {formatCurrency(grandTotal)}
              </Text>
            </View>
          </View>
        </ScrollView>

        {/* BOTTOM BAR */}
        {cartItems.length > 0 && (
          <View style={styles.bottomBar}>
            <Text style={styles.bottomTotal}>{formatCurrency(grandTotal)}</Text>

            <TouchableOpacity
              onPress={handleProceed}
              style={styles.continueBtn}>
              <Text style={styles.continueText}>Proceed to Pay</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ADDRESS MODAL */}
        {/* ADDRESS MODAL */}
        <Modal
          visible={modalVisible}
          transparent
          animationType="slide"
          onRequestClose={() => setModalVisible(false)}>
          <View style={styles.savemodalView}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Address</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Icon name="close" size={26} color="red" />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.locationContainer}
              onPress={() => navigation.navigate('MapScreen')}>
              <Text style={styles.locationText}>
                Select your current location +
              </Text>
            </TouchableOpacity>

            {/* Scrollable Address List */}
            {loading ? (
              <ActivityIndicator color="red" />
            ) : (
              <ScrollView style={{maxHeight: 450}}>
                {localAddresses.map(item => (
                  <View key={item._id} style={styles.addressItem}>
                    <TouchableOpacity
                      style={{flex: 1}}
                      onPress={async () => {
                        setSavedAddress(item);
                        await AsyncStorage.setItem(
                          'savedAddress',
                          JSON.stringify(item),
                        );
                        setModalVisible(false);
                        ToastAndroid.show(
                          'Address selected!',
                          ToastAndroid.SHORT,
                        );
                      }}>
                      <Text style={styles.addressType}>{item.addressType}</Text>
                      <Text style={styles.addressText}>
                        {item.flat}, {item.address}
                      </Text>
                      <Text style={styles.nameText}>
                        {item.name} - {item.contact}
                      </Text>
                    </TouchableOpacity>

                    {savedAddress?._id === item._id && (
                      <Ionicons
                        name="checkmark-circle"
                        size={22}
                        color="#f11b1b"
                      />
                    )}

                    <TouchableOpacity
                      onPress={() =>
                        navigation.navigate('MapScreen', {editData: item})
                      }
                      style={{marginLeft: 10}}>
                      <Ionicons name="create-outline" size={22} color="blue" />
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => handleDeleteAddress(item._id)}
                      style={{marginLeft: 10}}>
                      <Ionicons name="trash-outline" size={22} color="red" />
                    </TouchableOpacity>
                  </View>
                ))}
              </ScrollView>
            )}
          </View>
        </Modal>

        {/* COD MODAL */}
        <Modal
          visible={codModalVisible}
          transparent
          animationType="slide"
          onRequestClose={() => setCodModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Ionicons name="cash-outline" size={50} color="red" />
              <Text style={styles.modalTitle}>Cash on Delivery</Text>
              <Text style={styles.modalText}>
                You’ll pay {formatCurrency(grandTotal)} on delivery.
              </Text>

              <TouchableOpacity
                onPress={handleConfirmCOD}
                style={styles.modalBtn}>
                <Text style={styles.modalBtnText}>Confirm Order</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setCodModalVisible(false)}
                style={[
                  styles.modalBtn,
                  {backgroundColor: '#ccc', marginTop: 8},
                ]}>
                <Text style={styles.modalBtnText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </DashboardScreen>
    </>
  );
};

export default OrderSummaryScreen;

/* ------------------ STYLES ------------------ */
const styles = StyleSheet.create({
  addressCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    margin: 12,
    borderRadius: 10,
    backgroundColor: '#fff',
    elevation: 3,
  },
  addrName: {fontSize: 15, fontWeight: '600', color: '#000'},
  addrDetails: {fontSize: 13, color: '#444', marginTop: 4},
  addrPhone: {fontSize: 13, marginTop: 2, color: '#444'},
  changeBtn: {
    alignSelf: 'center',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: 'red',
    borderRadius: 8,
  },
  changeText: {color: 'red', fontWeight: '700', fontSize: 12},
  addAddressText: {
    color: 'red',
    fontWeight: '600',
    marginLeft: 6,
    fontSize: 14,
  },
  sectionBox: {
    backgroundColor: '#fff',
    margin: 12,
    padding: 14,
    borderRadius: 10,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 8,
    color: 'black',
  },
  couponCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 14,
    borderRadius: 10,
    marginBottom: 8,
  },
  couponDesc: {color: '#fff', fontSize: 13, fontWeight: 'bold'},
  couponDetails: {color: '#fff', fontSize: 12},
  applyBtn: {
    backgroundColor: '#fff',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignSelf: 'center',
  },
  applyText: {color: 'red', fontWeight: '700'},
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  itemImage: {width: 55, height: 55, borderRadius: 8},
  itemName: {fontSize: 14, fontWeight: '600', color: '#000'},
  foodQtyPrice: {fontSize: 14, fontWeight: '600', color: '#8e8b8bff'},
  noteTag: {
    marginTop: 6,
    backgroundColor: '#FFF6E5',
    borderLeftWidth: 3,
    borderLeftColor: '#FF9800',
    padding: 6,
    borderRadius: 6,
    width: width * 0.55,
  },
  noteText: {fontSize: width * 0.035, color: '#444'},
  itemPrice: {fontSize: 13, color: '#444'},
  billRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 4,
  },
  billLabel: {fontSize: 13, color: '#555'},
  billValue: {fontSize: 13, color: '#555'},
  divider: {
    borderBottomWidth: 0.7,
    borderBottomColor: '#ccc',
    marginVertical: 6,
  },
  totalLabel: {fontSize: 15, fontWeight: '700'},
  totalValue: {fontSize: 15, fontWeight: '700', color: 'red'},
  bottomBar: {
    position: 'absolute',
    bottom: 26,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    backgroundColor: '#fff',
    width: '100%',
    elevation: 5,
  },
  bottomTotal: {fontSize: 16, fontWeight: '700', color: 'black'},
  continueBtn: {
    backgroundColor: 'red',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  continueText: {color: '#fff', fontWeight: '700', fontSize: 14},

  savemodalView: {
    position: 'absolute', // Make it absolute to position relative to screen
    bottom: 0, // Stick to bottom
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    padding: 15,
    elevation: 6,
    maxHeight: '80%',
  },

  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalTitle: {fontSize: 16, fontWeight: '700', color: '#000'},
  locationContainer: {
    padding: 12,
    backgroundColor: '#FFECEC',
    borderRadius: 8,
    marginVertical: 12,
  },
  locationText: {color: 'red', fontWeight: '600', fontSize: 14},

  addressItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 10,
    elevation: 1,
  },
  addressType: {fontWeight: '700', color: '#000'},
  addressText: {color: '#555'},
  nameText: {color: '#000', marginTop: 4},

  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#00000066',
  },
  modalContent: {
    width: '85%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  modalText: {fontSize: 14, color: '#555', marginVertical: 10},
  modalBtn: {
    backgroundColor: 'red',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginTop: 10,
  },
  modalBtnText: {color: '#fff', fontSize: 14, fontWeight: '600'},
});
