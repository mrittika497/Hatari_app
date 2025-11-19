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
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useDispatch, useSelector} from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import DashboardScreen from '../components/DashboardScreen';
import CustomHeader from '../components/CustomHeader';
import Theme from '../assets/theme';
import {clearCart} from '../redux/slice/cartSlice';
import {fetchDeliverySettings} from '../redux/slice/deliverySettingsSlice';
import {fetchCoupons} from '../redux/slice/couponSlice';
import {postBilling} from '../redux/slice/postBillingSlice';
import {fetchUserAddresses} from '../redux/slice/saveaddressSlice';

const {width} = Dimensions.get('window');

const OrderSummaryScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const {selectedRestaurant, experienceType} = useSelector(
    state => state.experience,
  );
  console.log(
    selectedRestaurant?._id,
    experienceType,
    '-------------------selectedRestaurant',
  );

  const {addresses, loading} = useSelector(state => state.address);
  const {items: cartItems} = useSelector(state => state.cart);
  console.log(cartItems,"------------------------------cartItemsodersection");
  
const allNotes = cartItems.map(item => item.note || '');
console.log(allNotes,"------------------notedata");

  
  const {token} = useSelector(state => state.auth);
  const {data} = useSelector(state => state.deliverySettings);
  const couponState = useSelector(state => state.coupons);
  const couponList = couponState?.list?.data || [];
  console.log(couponList, '--------------------couponList');

  const [savedAddress, setSavedAddress] = useState(null);
  console.log(savedAddress?._id,"---------------------address");
  
  const [userid, setUserId] = useState(null);
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [codModalVisible, setCodModalVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  // Format currency
  const formatCurrency = value => {
    try {
      return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 2,
      }).format(value);
    } catch (e) {
      const n = Number(value) || 0;
      return `₹${n.toFixed(2)}`;
    }
  };

  // Fetch addresses, coupons, and delivery settings
  useEffect(() => {
    dispatch(fetchDeliverySettings());
    dispatch(fetchCoupons());
    dispatch(fetchUserAddresses(token));
  }, [dispatch, token]);

  // Load saved address
  useEffect(() => {
    const loadAddress = async () => {
      try {
        const saved = await AsyncStorage.getItem('savedAddress');
        if (saved) {
          setSavedAddress(JSON.parse(saved));
        } else if (addresses?.length > 0) {
          const first = addresses[0];
          setSavedAddress(first);
          await AsyncStorage.setItem('savedAddress', JSON.stringify(first));
        }
      } catch (err) {
        console.log('❌ Error loading address:', err);
      }
    };
    loadAddress();
  }, [addresses]);

  // Get user ID
  useEffect(() => {
    (async () => {
      const id = await AsyncStorage.getItem('userId');
      if (id) setUserId(id);
    })();
  }, []);

  // Calculate totals
  const itemTotal = cartItems.reduce((sum, item) => {
    const price = !item?.priceInfo?.hasVariation
      ? item?.priceInfo?.staticPrice
      : item?.selectedSize === 'half'
      ? item?.priceInfo?.halfPrice
      : item?.priceInfo?.fullPrice;
    return sum + price * item.quantity;
  }, 0);

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
    convenienceAmt = data?.convenience_charges_value || 0;
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
        `Minimum order ₹${coupon.minOrderAmount} required`,
        ToastAndroid.SHORT,
      );
      return;
    }
    setSelectedCoupon(coupon);
    ToastAndroid.show(`${coupon.code} applied!`, ToastAndroid.SHORT);
  };

  const handleProceed = () => {
    if (!savedAddress) {
      ToastAndroid.show('Please add a delivery address.', ToastAndroid.SHORT);
      return;
    }
    setCodModalVisible(true);
  };

  // const handleConfirmCOD = async () => {
  //   try {
  //     const billingData = {
  //       userId: userid,
  //       restaurantId: selectedRestaurant._id,
  //       address: savedAddress._id,
  //       billingName: savedAddress?.name,
  //       billingMobile: savedAddress?.contact,
  //       type: experienceType?.toLowerCase(),
  //       deliveryCharges: Number(data?.delivery_charges_value) || 0,
  //       foodDetails: cartItems.map(item => ({
  //         foodId: item._id,
  //         quantity: Number(item.quantity) || 1,
  //         price: !item?.priceInfo?.hasVariation
  //           ? item?.priceInfo?.staticPrice
  //           : item?.selectedSize === 'half'
  //           ? item?.priceInfo?.halfPrice
  //           : item?.priceInfo?.fullPrice,
  //       })),
  //       totalAmount: Number(itemTotal),
  //       grossAmount: Number(grandTotal),
  //       packingCharge: Number(packingFee),
  //       CGST: Number(cgstAmt),
  //       SGST: Number(sgstAmt),
  //       couponCode: selectedCoupon?.code || null,
  //       paymentStatus: 'Pending',
  //     };

  //     await dispatch(postBilling(billingData)).unwrap();
  //     dispatch(clearCart());
  //     setCodModalVisible(false);
  //     ToastAndroid.show('Order placed successfully!', ToastAndroid.LONG);
  //     navigation.navigate('OrderSuccessScreen');
  //   } catch (error) {
  //     ToastAndroid.show('Order failed. Try again.', ToastAndroid.SHORT);
  //   }
  // };

const handleConfirmCOD = async () => {
  if (!savedAddress?._id) {
    ToastAndroid.show('Please select a delivery address', ToastAndroid.SHORT);
    return;
  }

  if (!selectedRestaurant?._id) {
    ToastAndroid.show('Restaurant info missing', ToastAndroid.SHORT);
    return;
  }

  try {
  const billingData = {
    userId: userid,
    restaurantId: selectedRestaurant?._id || "1234567890", // fallback static _id
    address: savedAddress?._id || "0987654321", // fallback static _id
    billingName: savedAddress?.name || "John Doe",
    billingMobile: savedAddress?.contact || "9999999999",
    type: experienceType?.toLowerCase() || "dinein",
    deliveryCharges: Number(data?.delivery_charges_value) || 50, // static fallback

foodDetails: cartItems.map(item => {
  const priceInfo = item?.priceInfo || {};

  let data = {
    foodId: item.id || item.foodId,
    quantity: Number(item.quantity) || 1,
    note: item.note || "",
  };

  // CASE 1: No variations → use staticPrice
  if (!priceInfo.hasVariation) {
    data.price = Number(priceInfo.staticPrice) || 0;
    return data;
  }

  // CASE 2: Has variations → pick based on selectedSize
  if (priceInfo.hasVariation) {
    if (item.selectedSize === "full") {
      data.variant = "full";
      data.fullPrice = Number(priceInfo?.fullPrice) || 0;
    } else {
      data.variant = "half";
      data.halfPrice = Number(priceInfo?.halfPrice) || 0;
    }
    return data;
  }

  return data;
}),


    totalAmount: Number(itemTotal) || 667, // static fallback
    grossAmount: Number(grandTotal) || 700, // static fallback
    packingCharge: Number(packingFee) || 20,
    CGST: Number(cgstAmt) || 33,
    SGST: Number(sgstAmt) || 33,
    couponCode: selectedCoupon?.code || null,
    paymentStatus: "Pending",
  };


    await dispatch(postBilling(billingData)).unwrap();

    dispatch(clearCart());
    setCodModalVisible(false);

    ToastAndroid.show('Order placed successfully!', ToastAndroid.LONG);
    navigation.navigate('OrderSuccessScreen');
  } catch (error) {
    console.log('Billing error:', error);
    ToastAndroid.show('Order failed. Try again.', ToastAndroid.SHORT);
  }
};



  return (
    <DashboardScreen scrollable={false}>
      <CustomHeader title="Order Summary" />
      <ScrollView contentContainerStyle={{paddingBottom: 200}}>
        {/* Address Section */}
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

        {/* Coupon Section */}

        <View style={styles.sectionBox}>
          <Text style={styles.sectionTitle}>Available Coupons</Text>
          {couponList?.map(coupon => (
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
                style={[
                  styles.applyBtn,
                  selectedCoupon?._id === coupon._id && {
                    backgroundColor: '#ccc',
                  },
                ]}
                onPress={() => applyCoupon(coupon)}>
                <Text style={styles.applyText}>
                  {selectedCoupon?._id === coupon._id ? 'APPLIED' : 'APPLY'}
                </Text>
              </TouchableOpacity>
            </LinearGradient>
          ))}
        </View>

        {/* Cart Items */}
        <View style={styles.sectionBox}>
          <Text style={styles.sectionTitle}>Your Items</Text>
          {cartItems.map(item => (
            <View key={item._id} style={styles.itemRow}>
              <Image source={{uri: item.image}} style={styles.itemImage} />
              <View style={{flex: 1, marginLeft: 10}}>
                <Text style={styles.itemName}>{item.name}</Text>
                {item.note ? (
                  <View style={styles.noteTag}>
                    <Text style={styles.noteText}>📝 {item?.note}</Text>
                  </View>
                ) : null}
              </View>
              <Text style={styles.itemPrice}>
                {formatCurrency(
                  (!item?.priceInfo?.hasVariation
                    ? item?.priceInfo?.staticPrice
                    : item?.selectedSize === 'half'
                    ? item?.priceInfo?.halfPrice
                    : item?.priceInfo?.fullPrice) * item.quantity,
                )}
              </Text>
            </View>
          ))}
        </View>

        {/* Bill Section */}
        <View style={styles.sectionBox}>
          <Text style={styles.sectionTitle}>Bill Details</Text>
          <View style={styles.billRow}>
            <Text style={styles.billLabel}>Item Total</Text>
            <Text style={styles.billLabel}>{formatCurrency(itemTotal)}</Text>
          </View>
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
              <Text style={styles.billLabel}>CGST ({data?.Cgst}%)</Text>
              <Text style={styles.billValue}>{formatCurrency(cgstAmt)}</Text>
            </View>
          )}
          {data?.Sgst && (
            <View style={styles.billRow}>
              <Text style={styles.billLabel}>SGST ({data?.Sgst}%)</Text>
              <Text style={styles.billValue}>{formatCurrency(sgstAmt)}</Text>
            </View>
          )}
          {selectedCoupon && (
            <View style={styles.billRow}>
              <Text style={styles.billLabel}>Coupon Discount</Text>
              <Text style={styles.billLabel}>-{formatCurrency(discount)}</Text>
            </View>
          )}
          <View style={styles.divider} />
          <View style={styles.billRow}>
            <Text style={styles.totalLabel}>Grand Total</Text>
            <Text style={styles.totalValue}>{formatCurrency(grandTotal)}</Text>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Proceed Bar */}
      {cartItems.length > 0 && (
        <View style={styles.bottomBar}>
          <Text style={styles.bottomTotal}>{formatCurrency(grandTotal)}</Text>
          <TouchableOpacity onPress={handleProceed} style={styles.continueBtn}>
            <Text style={styles.continueText}>Proceed to Pay</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Address Modal */}
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
          {loading ? (
            <ActivityIndicator color="red" />
          ) : (
            <ScrollView>
              {addresses.map(item => (
                <TouchableOpacity
                  key={item._id}
                  style={styles.addressItem}
                  onPress={async () => {
                    setSavedAddress(item);
                    await AsyncStorage.setItem(
                      'savedAddress',
                      JSON.stringify(item),
                    );
                    setModalVisible(false);
                    ToastAndroid.show('Address selected!', ToastAndroid.SHORT);
                  }}>
                  <View style={{flex: 1}}>
                    <Text style={styles.addressType}>{item.addressType}</Text>
                    <Text style={styles.addressText}>
                      {item.flat}, {item.address}
                    </Text>
                    <Text style={styles.nameText}>
                      {item.name} - {item.contact}
                    </Text>
                  </View>
                  {savedAddress?._id === item._id && (
                    <Ionicons
                      name="checkmark-circle"
                      size={22}
                      color="#f11b1b"
                    />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}
        </View>
      </Modal>

      {/* COD Modal */}
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
  );
};

export default OrderSummaryScreen;

// ---------- STYLES ----------
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
    color: '#000',
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
  itemRow: {flexDirection: 'row', alignItems: 'center', marginBottom: 12},
  itemImage: {width: 55, height: 55, borderRadius: 8},
  itemName: {fontSize: 14, fontWeight: '600', color: '#000'},
  itemPrice: {fontSize: 13, color: '#444'},
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
  totalLabel: {fontSize: 15, fontWeight: '700', color: '#000'},
  totalValue: {fontSize: 15, fontWeight: '700', color: 'red'},
  bottomBar: {
    position: 'absolute',
    bottom: 100,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    backgroundColor: '#fff',
    width: '100%',
    elevation: 5,
  },
  bottomTotal: {fontSize: 16, fontWeight: '700', color: '#000'},
  continueBtn: {
    backgroundColor: 'red',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  continueText: {color: '#fff', fontWeight: '700'},
  savemodalView: {
    backgroundColor: '#fff',
    marginTop: 120,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    flex: 1,
    padding: 12,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  modalTitle: {fontSize: 16, fontWeight: '700', color: '#000'},
  locationContainer: {
    backgroundColor: '#ffe6e6',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  locationText: {color: 'red', fontWeight: '600'},
  addressItem: {
    flexDirection: 'row',
    padding: 12,
    borderBottomWidth: 0.6,
    borderBottomColor: '#ccc',
  },
  addressType: {fontWeight: '700', color: '#000', marginBottom: 4},
  addressText: {fontSize: 13, color: '#555'},
  nameText: {fontSize: 13, color: '#555'},
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#00000099',
  },
  modalContent: {
    backgroundColor: '#fff',
    width: '80%',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  modalText: {textAlign: 'center', marginVertical: 12, color: '#444'},
  modalBtn: {
    backgroundColor: 'red',
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 10,
    marginTop: 10,
  },
  modalBtnText: {color: '#fff', fontWeight: '700', fontSize: 15},
});
