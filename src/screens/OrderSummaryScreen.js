// import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
  Modal,
  ToastAndroid,
  SafeAreaView,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useDispatch, useSelector} from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import {clearCart} from '../redux/slice/cartSlice';
import {fetchDeliverySettings} from '../redux/slice/deliverySettingsSlice';
import {fetchCoupons} from '../redux/slice/couponSlice';
import {postBilling} from '../redux/slice/postBillingSlice';
import {fetchUserAddresses} from '../redux/slice/saveaddressSlice';
import Theme from '../assets/theme';
import DashboardScreen from '../components/DashboardScreen';
import CustomHeader from '../components/CustomHeader';
import {useEffect, useState} from 'react';
const {width, height} = Dimensions.get('window');
const OrderSummaryScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const {selectedRestaurant, experienceType} = useSelector(
    state => state.experience,
  );
  const {addresses, loading} = useSelector(state => state.address);
  const {items: cartItems} = useSelector(state => state.cart);
  console.log(cartItems,"----------------------------cartItems");
  
  const {token} = useSelector(state => state.auth);
  const {data} = useSelector(state => state.deliverySettings);
  const couponState = useSelector(state => state.coupons);
  const couponList = couponState?.list || [];

  const [savedAddress, setSavedAddress] = useState(null);
  const [userid, setUserId] = useState(null);
  console.log(userid,"--------------------------------userid");
  
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [codModalVisible, setCodModalVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  // Fetch addresses and delivery data
  useEffect(() => {
    dispatch(fetchDeliverySettings());
    dispatch(fetchCoupons());
    dispatch(fetchUserAddresses(token));
  }, [dispatch, token]);

  // Load address from AsyncStorage or Redux
  useEffect(() => {
    const loadAddress = async () => {
      try {
        const saved = await AsyncStorage.getItem('savedAddress');
        if (saved) {
          const parsed = JSON.parse(saved);
          setSavedAddress(parsed);
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
  const itemTotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
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

  const handleConfirmCOD = async () => {
    try {
      const billingData = {
        userId: userid,
        restaurantId: selectedRestaurant._id,
        address: savedAddress._id,
        billingName: savedAddress?.name,
        billingMobile: savedAddress?.contact,
        type: experienceType?.toLowerCase(),
        deliveryCharges: Number(data?.delivery_charges_value) || 0,
        foodDetails: cartItems.map(item => ({
          foodId: item._id,
          quantity: Number(item.quantity) || 1,
          price: Number(item.price) || 0,
        })),
        totalAmount: Number(itemTotal),
        grossAmount: Number(grandTotal),
        packingCharge: Number(packingFee),
        CGST: Number(cgstAmt),
        SGST: Number(sgstAmt),
        couponCode: selectedCoupon?.code || null,
        paymentStatus: 'Pending',
      };

      await dispatch(postBilling(billingData)).unwrap();
      dispatch(clearCart());
      setCodModalVisible(false);
      ToastAndroid.show('Order placed successfully!', ToastAndroid.LONG);
      navigation.navigate('OrderSuccessScreen');
    } catch (error) {
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
        {savedAddress && couponList.length > 0 && (
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
        )}

        {/* Cart Items */}
        <View style={styles.sectionBox}>
          <Text style={styles.sectionTitle}>Your Items</Text>
          {cartItems.map(item => (
            <View key={item._id} style={styles.itemRow}>
              <Image source={{uri: item.image}} style={styles.itemImage} />
              <View style={{flex: 1, marginLeft: 10}}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemPrice}>
                  ₹{item.price} × {item.quantity}
                </Text>
                {}
                 {item.note ? (
                     <View style={styles.noteTag}>
                       <Text style={styles.noteText}>📝 {item?.note}</Text>
                     </View>
                   ) : null}
              </View>
              <Text style={styles.itemTotal}>
                ₹{item.price * item.quantity}
              </Text>
            
            </View>
          ))}
        </View>

        {/* Bill Section */}
        <View style={styles.sectionBox}>
          <Text style={styles.sectionTitle}>Bill Details</Text>
          <View style={styles.billRow}>
            <Text style={styles.billLabel}>Item Total</Text>
            <Text style={styles.billLabel}>₹{itemTotal.toFixed(2)}</Text>
          </View>
          <View style={styles.billRow}>
            <Text style={styles.billLabel}>Delivery Fee</Text>
            <Text style={styles.billLabel}>
              ₹{(data?.delivery_charges_value || 0).toFixed(2)}
            </Text>
          </View>
          <View style={styles.billRow}>
            <Text style={styles.billLabel}>Packing Fee</Text>
            <Text style={styles.billLabel}>₹{packingFee.toFixed(2)}</Text>
          </View>

          {data?.Cgst && (
            <View style={styles.billRow}>
              <Text style={styles.billLabel}>CGST ({data?.Cgst})</Text>
              <Text style={styles.billValue}>{cgstAmt?.toFixed(2)}</Text>
            </View>
          )}
          {data?.Sgst && (
            <View style={styles.billRow}>
              <Text style={styles.billLabel}>SGST ({data?.Sgst})</Text>
              <Text style={styles.billValue}>{sgstAmt?.toFixed(2)}</Text>
            </View>
          )}

          {selectedCoupon && (
            <View style={styles.billRow}>
              <Text style={styles.billLabel}>Coupon Discount</Text>
              <Text style={styles.billLabel}>-₹{discount.toFixed(2)}</Text>
            </View>
          )}
          <View style={styles.divider} />
          <View style={styles.billRow}>
            <Text style={styles.totalLabel}>Grand Total</Text>
            <Text style={styles.totalValue}>₹{grandTotal.toFixed(2)}</Text>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Proceed Bar */}
      {cartItems.length > 0 && (
        <View style={styles.bottomBar}>
          <Text style={styles.bottomTotal}>₹{grandTotal.toFixed(2)}</Text>
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
              Selected your current location +
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
              You’ll pay ₹{grandTotal.toFixed(2)} on delivery.
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
  itemTotal: {fontSize: 13, fontWeight: '700', color: '#000'},
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
  billValue: {fontSize: 13, color: '#000', fontWeight: '500'},
  divider: {height: 1, backgroundColor: '#eee', marginVertical: 8},
  totalLabel: {fontWeight: '700', fontSize: 14,color:"#000"},
  totalValue: {fontWeight: '700', fontSize: 14, color: 'red'},
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 14,
    borderTopWidth: 1,
    borderColor: '#eee',
    backgroundColor: '#fff',
    position: 'absolute',
    bottom: '13%',
    width: '100%',
  },
  bottomTotal: {fontSize: 17, fontWeight: '700', color: 'red'},
  continueBtn: {
    backgroundColor: 'red',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
  },
  continueText: {color: '#fff', fontWeight: '700'},
  savemodalView: {
    height: 400,
    width: '100%',
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    position: 'absolute',
    bottom: 0,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  modalTitle: {fontSize: 17, fontWeight: '700', color: 'red'},
  addressItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingVertical: 12,
  },
  locationContainer: {
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    marginVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  locationText: {
    color: '#FF4C4C', // red tone
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },

  addressType: {
    fontWeight: 'bold',
    color: '#f11b1b',
    marginBottom: 5,
  },
  addressText: {
    color: '#333',
  },
  nameText: {
    color: '#555',
    marginTop: 4,
  },
  modalText: {
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
    marginBottom: 20,
  },
  modalBtn: {
    backgroundColor: Theme.colors.red,
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 25,
  },
  modalBtnText: {color: '#fff', fontWeight: '700', fontSize: 14},
  card: {
    flexDirection: 'row',
    padding: 15,
    borderRadius: 15,
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 3,
  },
  leftSection: {flex: 2},
  rightSection: {flex: 1, alignItems: 'flex-end'},
  title: {color: '#fff', fontSize: 14, fontWeight: 'bold', marginBottom: 10},
  expiry: {color: '#fff', marginTop: 5, fontSize: 12},
  code: {color: '#fff', fontWeight: 'bold', fontSize: 10, marginBottom: 8},
  applyBtn: {
    backgroundColor: '#fff',
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  applyText: {color: '#FF8C00', fontWeight: 'bold', fontSize: 12},

  modalContentAddress: {
    backgroundColor: '#fff',
    width: '100%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    elevation: 10,
  },
  detailText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '500',
    letterSpacing: 0.5,
    lineHeight: 22,
    textAlign: 'left',
  },
  savemodalView: {
    height: 400,
    width: '100%',
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    position: 'absolute',
    bottom: 0,
    elevation: 10,
  },
    modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
    modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {fontSize: 18, fontWeight: '700', marginVertical: 10,color:"red"},
  addressItem: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  paddingVertical: 12,
  borderBottomWidth: 1,
  borderBottomColor: '#eee',
},
});
