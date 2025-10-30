import React, {useEffect, useState} from 'react';
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
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useDispatch, useSelector} from 'react-redux';
import DashboardScreen from '../components/DashboardScreen';
import CustomHeader from '../components/CustomHeader';
import Theme from '../assets/theme';
import LinearGradient from 'react-native-linear-gradient';
import {fetchDeliverySettings} from '../redux/slice/deliverySettingsSlice';
import {fetchCoupons} from '../redux/slice/couponSlice';
import {postBilling} from '../redux/slice/postBillingSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { clearCart } from '../redux/slice/cartSlice';
const OrderSummaryScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const {selectedRestaurant, experienceType} = useSelector(
    state => state.experience,
  );
  const [savedAddress,setSavedAddress] = useState("")
  console.log(
 savedAddress,
    '----------------v ----------------123',
  );

  const {items: cartItems} = useSelector(state => state.cart);
  // const c = useSelector(state => state.savedAddress);

  const addressid = savedAddress?._id;
  console.log(addressid, '----------------------------getaddress_id');

  const {data} = useSelector(state => state.deliverySettings);
  console.log(data,"---------------------data");
  
  const couponState = useSelector(state => state.coupons);
  const couponList = couponState?.list || [];
  const {token, user} = useSelector(state => state.auth);
  const [userid, setUserId] = useState("68c121cdb40227b610ae2ad0");
  console.log(
    userid,
    '--------------------------userid-----------------as per loing',
  );

useEffect(() => {
  const loadSavedAddress = async () => {
    try {
      const saved = await AsyncStorage.getItem("savedAddress");
    if (saved) {
          setSavedAddress(JSON.parse(saved));
        }
      console.log(saved,"----------------------saved");
      
    } catch (error) {
      console.log("❌ Error loading saved address:", error);
    }
  };
  loadSavedAddress();
}, []);;


  // const [addressid, setAddressId] = useState(null);
  // console.log(addressid, '-----------------useraddresssd---------------,');
  //  user_id --------------
  const getUserId = async () => {
    try {
      const userid = await AsyncStorage.getItem('userId');
      if (userid) {
        console.log('📦 Stored User ID:', userid);
        setUserId(userid);
      } else {
        console.log('⚠️ No user ID found');
      }
    } catch (error) {
      console.log('❌ Error retrieving user ID:', error);
    }
  };

  useEffect(() => {
    getUserId();
  }, []);
  // user id ------------------------
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [codModalVisible, setCodModalVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    dispatch(fetchDeliverySettings());
    dispatch(fetchCoupons());
  }, [dispatch]);

  // Calculate totals
  const itemTotal = cartItems.reduce(
    (sum, item) =>
      sum + (Number(item.price) || 0) * (Number(item.quantity) || 1),
    0,
  );

  const packingFee = cartItems.reduce(
    (sum, item) => sum + (Number(item.packagingCharges) || 0),
    0,
  );

  // Coupon discount
  let discount = 0;
  if (selectedCoupon) {
    discount =
      selectedCoupon.discountType === 'percentage'
        ? (itemTotal * selectedCoupon.discountValue) / 100
        : selectedCoupon.discountValue;

    if (itemTotal < selectedCoupon.minOrderAmount) discount = 0;
  }

  // Taxes
  const cgstAmt = data?.Cgst ? (itemTotal * parseFloat(data.Cgst)) / 100 : 0;
  const sgstAmt = data?.Sgst ? (itemTotal * parseFloat(data.Sgst)) / 100 : 0;

  // Convenience
  let convenienceAmt = 0;
  if (data?.convenience_charges_type === 'percentage') {
    convenienceAmt = (itemTotal * data.convenience_charges_value) / 100;
  } else if (data?.convenience_charges_type === 'flat') {
    convenienceAmt = data?.convenience_charges_value || 0;
  }

  // Grand total
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
    // Check minimum order condition (e.g., ₹500)
    if (itemTotal < 500) {
      ToastAndroid.show(
        'Order must be ₹500 or more to apply a coupon!',
        ToastAndroid.LONG,
      );
      return;
    }

    setSelectedCoupon(coupon);
    ToastAndroid.show(
      `${coupon.code} applied successfully!`,
      ToastAndroid.SHORT,
    );
  };

  // Proceed to COD
  const handleProceed = () => {
    if (!savedAddress) {
      ToastAndroid.show(
        'Please add a delivery address before proceeding.',
        ToastAndroid.LONG,
      );
      return;
    }

    setCodModalVisible(true);
  };

  // Confirm COD
  const handleConfirmCOD = async () => {
    if (!addressid || !userid || !selectedRestaurant?._id) {
      console.log('User--------------------------------:', userid);
      console.log('Restaurant:----------------------------', selectedRestaurant);
      console.log(
        'getaddressid -------------------------------------:',
        addressid,
      );
      console.log('Missing info:', {
        userId: userid,
        restaurantId: selectedRestaurant?._id,
        address: addressid,
      });
      Alert.alert(
        'Error',
        'User, restaurant, or address information is missing.',
        userid,
      );
      return;
    }

    // Prepare billing payload
    const billingData = {
      userId: userid,
      restaurantId: selectedRestaurant._id,
      address: addressid,
      billingName: savedAddress?.name,
      billingMobile: savedAddress?.contact,
      type: (experienceType || 'delivery').toLowerCase(),
      deliveryCharges: Number(data?.delivery_charges_value) || 0,
      foodDetails: cartItems.map(item => ({
        foodId: item._id,
        quantity: Number(item.quantity) || 1,
        price: Number(item.price) || 0,
      })),
      totalAmount: Number(itemTotal) || 0,
      grossAmount: Number(grandTotal) || 0,
      convenienceCharges: Number(convenienceAmt) || 0,
      packingCharge: Number(packingFee) || 0,
      CGST: Number(cgstAmt.toFixed(2)) || 0,
      SGST: Number(sgstAmt.toFixed(2)) || 0,
      couponCode: selectedCoupon?.code || null,
      paymentStatus: 'Pending',
    };

    console.log(
      '-------------------------------Billing Data Sent:',
      billingData,
    );

    try {
      // Use unwrap() to get payload directly or throw error
      const response = await dispatch(postBilling(billingData)).unwrap();
      console.log(
        'apii---biilingcreatedresponse ---------------------res:',
        response,
      );
 dispatch(clearCart());
      setCodModalVisible(false);
      ToastAndroid.show(
        response?.message || 'Your order has been placed successfully!',
        ToastAndroid.LONG,
      );
      setTimeout(() => {
        navigation.navigate('OrderSuccessScreen');
      }, 1000);
    } catch (error) {
      
      console.log('Billing Failed:', error);
      ToastAndroid.show(
        error?.message || 'Failed to place order. Please try again.',
        ToastAndroid.LONG,
      );
    }
  };

  return (
    <DashboardScreen scrollable={false}>
      <CustomHeader title="Order Summary" />
      <ScrollView
        contentContainerStyle={{paddingBottom: 200}}
        showsVerticalScrollIndicator={false}>
        {/* Address Section */}
        {savedAddress ? (
          <View style={styles.addressCard}>
            <View style={{flex: 1}}>
              <Text style={styles.addrName}>
               {savedAddress?.name} ({savedAddress?.addressType || 'Address'})
              </Text>
              <Text style={styles.addrDetails}>
                {savedAddress.flat},{' '}
                {savedAddress.landmark ? `${savedAddress.landmark}, ` : ''}
                {savedAddress.address} - {savedAddress.pin}
              </Text>
              <Text style={styles.addrPhone}>{savedAddress.contact}</Text>
            </View>
            <TouchableOpacity
              style={styles.changeBtn}
              onPress={() => navigation.navigate('MapScreen')}>
              <Text style={styles.changeText}>Change</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.addressCard}>
            <TouchableOpacity
              style={{flex: 1}}
              onPress={() => navigation.navigate('MapScreen')}>
              <Text style={styles.addressText}>
                {savedAddress ? savedAddress : '+ Add Delivery Address'}
              </Text>
            </TouchableOpacity>

            {/* Down arrow opens modal */}
            <TouchableOpacity onPress={() => setModalVisible(true)}>
              <Icon name="keyboard-arrow-down" size={26} color="#f11b1bff" />
            </TouchableOpacity>
          </View>
        )}

        {/* Coupons */}
        {savedAddress &&
          couponList.map(coupon => (
            <View key={coupon._id} style={styles.sectionBox}>
              <LinearGradient
                colors={
                  selectedCoupon?._id === coupon._id
                    ? ['#f50606e6', '#c16280ff']
                    : ['#e47369ff', '#db2b2bff']
                }
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}
                style={styles.card}>
                <View style={styles.leftSection}>
                  <View style={styles.iconBox}>
                    <Text style={styles.giftIcon}>🎁</Text>
                  </View>
                  <View style={{flex: 1}}>
                    <Text style={styles.title}>{coupon.description}</Text>
                    <Text style={styles.detailText}>
                      Min Order: ₹{coupon?.minOrderAmount}
                    </Text>
                    <Text style={styles.detailText}>
                      Discount: {coupon?.discountDisplay}
                    </Text>
                    <Text style={styles.expiry}>
                      Expiry: {new Date(coupon.expiry).toLocaleDateString()}
                    </Text>
                  </View>
                </View>

                <View style={styles.rightSection}>
                  <View style={styles.codeBox}>
                    {/* <Text style={styles.codeText}>{coupon.code}</Text> */}
                  </View>
                  <TouchableOpacity
                    style={[
                      styles.applyBtn,
                      selectedCoupon?._id === coupon._id && styles.appliedBtn,
                    ]}
                    onPress={() => applyCoupon(coupon)}
                    disabled={selectedCoupon?._id === coupon._id}>
                    <Text style={styles.applyText}>
                      {selectedCoupon?._id === coupon._id ? 'APPLIED' : 'APPLY'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </LinearGradient>
            </View>
          ))}

        {/* Cart Items */}
        <View style={styles.sectionBox}>
          <Text style={styles.sectionTitle}>Your Items</Text>
          {cartItems.length === 0 ? (
            <Text style={{color: '#777', marginTop: 8}}>
              Your cart is empty
            </Text>
          ) : (
            cartItems.map(item => (
              <View key={item._id} style={styles.itemRow}>
                <Image source={{uri: item?.image}} style={styles.itemImage} />
                <View style={{flex: 1, marginLeft: 10}}>
                  <Text style={styles.itemName} numberOfLines={2}>
                    {item.name}
                  </Text>
                  <Text style={styles.itemPrice}>
                    ₹{item?.price} x {item?.quantity}
                  </Text>
                  {item.note && (
                    <Text style={styles.itemNote}>📝 {item?.note}</Text>
                  )}
                </View>
                {savedAddress && (
                  <Text style={styles.itemQty}>
                    ₹{item?.price * item?.quantity}
                  </Text>
                )}
              </View>
            ))
          )}
        </View>

        {/* Billing Section */}
        {savedAddress && (
          <View style={styles.sectionBox}>
            <Text style={styles.sectionTitle}>Bill Details</Text>
            <View style={styles.billRow}>
              <Text style={styles.billLabel}>Item Total</Text>
              <Text style={styles.billValue}>₹{itemTotal?.toFixed(2)}</Text>
            </View>
            {experienceType === 'Delivery' && (
              <View style={styles.billRow}>
                <Text style={styles.billLabel}>Delivery Fee</Text>
                <Text style={styles.billValue}>
                  ₹{(data?.delivery_charges_value || 0).toFixed(2)}
                </Text>
              </View>
            )}
            <View style={styles.billRow}>
              <Text style={styles.billLabel}>Packing Fee</Text>
              <Text style={styles.billValue}>₹{packingFee?.toFixed(2)}</Text>
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
            {convenienceAmt > 0 && (
              <View style={styles.billRow}>
                <Text style={styles.billLabel}>
                  Convenience Charges (
                  {data?.convenience_charges_type === 'percentage'
                    ? `${data?.convenience_charges_value}%`
                    : 'Flat'}
                  )
                </Text>
                <Text style={styles.billValue}>
                  {convenienceAmt?.toFixed(2)}
                </Text>
              </View>
            )}
            {selectedCoupon && (
              <View style={styles.billRow}>
                <Text style={styles.billLabel}>
                  Coupon Discount ({selectedCoupon?.code})
                </Text>
                <Text style={styles.billValue}>-₹{discount?.toFixed(2)}</Text>
              </View>
            )}

            <View style={styles.divider} />
            <View style={styles.billRow}>
              <Text style={styles.totalLabel}>Grand Total</Text>
              <Text style={styles.totalValue}>₹{grandTotal?.toFixed(2)}</Text>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Bottom Bar */}
      {cartItems.length > 0 && (
        // <SafeAreaView style={{backgroundColor: 'transparent'}}>
        <View style={styles.bottomBar}>
          <View>
            <Text style={styles.bottomLabel}>To Pay</Text>
            <Text style={styles.bottomTotal}>
              {savedAddress ? `₹${grandTotal.toFixed(2)}` : '-'}
            </Text>
          </View>
          <TouchableOpacity
            style={[
              styles.continueBtn,
              {backgroundColor: savedAddress ? Theme.colors.red : '#ccc'},
            ]}
            onPress={handleProceed}
            disabled={!savedAddress}>
            <Text style={styles.continueText}>Proceed to Pay</Text>
          </TouchableOpacity>
        </View>
        // </SafeAreaView>
      )}

      {/* Modal */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContentAddress}>
            <Text style={styles.modalTitle}>Select Address</Text>

            {/* Example modal content */}
            <TouchableOpacity
              style={styles.option}
              onPress={() => {
                setModalVisible(false);
                // Handle selection logic here
              }}>
              <Text style={styles.optionText}>Home Address</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.option}
              onPress={() => {
                setModalVisible(false);
              }}>
              <Text style={styles.optionText}>Work Address</Text>
            </TouchableOpacity>

            {/* Close button */}
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}>
              <Text style={styles.closeText}>Close</Text>
            </TouchableOpacity>
          </View>
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
            <Ionicons name="cash-outline" size={50} color={Theme.colors.red} />
            <Text style={styles.modalTitle}>Cash on Delivery</Text>
            <Text style={styles.modalText}>
              You will pay ₹{grandTotal.toFixed(2)} when the order is delivered.
            </Text>

            <TouchableOpacity
              style={styles.modalBtn}
              onPress={handleConfirmCOD}>
              <Text style={styles.modalBtnText}>Confirm Order</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.modalBtn,
                {backgroundColor: '#ccc', marginTop: 10},
              ]}
              onPress={() => setCodModalVisible(false)}>
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
    padding: 14,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 10,
    margin: 12,
    elevation: 2,
  },

  addressText: {
    color: '#555',
    fontSize: 16,
    fontWeight: '500',
  },
  addrName: {fontSize: 15, fontWeight: '600', color: '#000'},
  addrDetails: {fontSize: 13, color: '#444', marginTop: 4},
  addrPhone: {fontSize: 13, marginTop: 2, color: '#444'},
  changeBtn: {
    alignSelf: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: Theme.colors.red,
    borderRadius: 6,
  },
  changeText: {color: Theme.colors.red, fontSize: 12, fontWeight: '600'},
  sectionBox: {
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 10,
    // marginHorizontal: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#eee',
  },
  sectionTitle: {fontSize: 15, fontWeight: '700', marginBottom: 8},
  itemRow: {flexDirection: 'row', alignItems: 'center', marginBottom: 12},
  itemImage: {width: 60, height: 60, borderRadius: 8},
  itemName: {fontSize: 14, fontWeight: '600', color: '#000'},
  itemPrice: {fontSize: 13, color: '#000', fontWeight: '500', marginTop: 2},
  itemQty: {fontSize: 13, fontWeight: '600', marginLeft: 10},
  itemNote: {fontSize: 12, color: '#555', marginTop: 3},
  billRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  billLabel: {fontSize: 13, color: '#555'},
  billValue: {fontSize: 13, color: '#000', fontWeight: '500'},
  divider: {height: 1, backgroundColor: '#eee', marginVertical: 8},
  totalLabel: {fontSize: 14, fontWeight: '700'},
  totalValue: {fontSize: 15, fontWeight: '700', color: Theme.colors.red},
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderColor: '#eee',
    paddingHorizontal: 15,
    paddingVertical: 12,
    backgroundColor: '#fff',
    position: 'absolute',
    bottom: '13%', // always stick to bottom
    left: 0,
    right: 0,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: {width: 0, height: -2},
    shadowRadius: 4,
    elevation: 5,
  },

  bottomLabel: {fontSize: 12, color: '#555'},
  bottomTotal: {fontSize: 18, fontWeight: '700', color: Theme.colors.red},
  continueBtn: {paddingHorizontal: 20, paddingVertical: 10, borderRadius: 20},
  continueText: {color: '#fff', fontWeight: '700', fontSize: 14},
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
  modalTitle: {fontSize: 18, fontWeight: '700', marginVertical: 10},
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
  title: {color: '#fff', fontSize: 18, fontWeight: 'bold',marginBottom:10},
  expiry: {color: '#fff', marginTop: 5, fontSize: 12,},
  code: {color: '#fff', fontWeight: 'bold', fontSize: 14, marginBottom: 8},
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
  fontSize: 16,
  fontWeight: '500',
  letterSpacing: 0.5,
  lineHeight: 22,
  textAlign: 'left',
},

});
