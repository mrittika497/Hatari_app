// src/screens/OrderSummaryScreen.js
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
  Modal,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useDispatch, useSelector } from 'react-redux';
import DashboardScreen from '../components/DashboardScreen';
import CustomHeader from '../components/CustomHeader';
import Theme from '../assets/theme';
import { fetchDeliverySettings } from '../redux/slice/deliverySettingsSlice';

const OrderSummaryScreen = ({ navigation }) => {
  const dispatch = useDispatch();

  const { data, loading, error } = useSelector(
    state => state.deliverySettings
  );
    const { experienceType} = useSelector(
      state => state.experience,
    );
    console.log(experienceType, '--------------go90998sselectedRest')

  useEffect(() => {
    dispatch(fetchDeliverySettings());
  }, [dispatch]);

  const [codModalVisible, setCodModalVisible] = useState(false);
  const { items: cartItems } = useSelector(state => state.cart);
  const savedAddress = useSelector(state => state.address.savedAddress);

  // Calculate packing fee dynamically from cart items
  const packingFee = cartItems.reduce(
    (sum, item) => sum + (item.packagingCharges || 0),
    0
  );

  // Item total
  const itemTotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  // Discount (existing logic)
  // const discount = cartItems.length > 0 ? 50 : 0;

  // Taxes
  const cgstAmt = data?.Cgst ? (itemTotal * parseFloat(data.Cgst)) / 100 : 0;
  const sgstAmt = data?.Sgst ? (itemTotal * parseFloat(data.Sgst)) / 100 : 0;

  // Convenience charges (dynamic from API)
  let convenienceAmt = 0;
  if (data?.convenience_charges_type === 'percentage') {
    convenienceAmt = (itemTotal * data.convenience_charges_value) / 100;
  } else if (data?.convenience_charges_type === 'flat') {
    convenienceAmt = data.convenience_charges_value || 0;
  }

  // Grand Total
  const grandTotal =
    itemTotal +
    (data?.delivery_charges_value || 0) +
    packingFee +
    cgstAmt +
    sgstAmt +
    convenienceAmt 

  // Proceed to COD
  const handleProceed = () => {
    if (!savedAddress) {
      Alert.alert(
        'Add Address',
        'Please add a delivery address before proceeding to payment.'
      );
      return;
    }
    setCodModalVisible(true);
  };

  const handleConfirmCOD = () => {
    setCodModalVisible(false);
    Alert.alert('Order Placed', 'Your order has been placed successfully!');
    navigation.navigate('OrderSuccessScreen');
  };

  return (
    <DashboardScreen>
      <CustomHeader title="Order Summary" />

      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
        {/* Address Section */}
        {savedAddress ? (
          <View style={styles.addressCard}>
            <View style={{ flex: 1 }}>
              <Text style={styles.addrName}>
                {savedAddress.name} ({savedAddress.type})
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
              onPress={() => navigation.navigate('MapScreen')}
            >
              <Text style={styles.changeText}>Change</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            style={styles.addressCard}
            onPress={() => navigation.navigate('MapScreen')}
          >
            <Text style={{ color: '#555' }}>+ Add Delivery Address</Text>
          </TouchableOpacity>
        )}

        {/* Cart Items Section */}
        <View style={styles.sectionBox}>
          <Text style={styles.sectionTitle}>Your Items</Text>
          {cartItems.length === 0 ? (
            <Text style={{ color: '#777', marginTop: 8 }}>
              Your cart is empty
            </Text>
          ) : (
            cartItems.map(item => (
              <View key={item._id} style={styles.itemRow}>
                <Image source={{ uri: item.image }} style={styles.itemImage} />
                <View style={{ flex: 1, marginLeft: 10 }}>
                  <Text style={styles.itemName} numberOfLines={2}>
                    {item.name}
                  </Text>
                  <Text style={styles.itemPrice}>
                    ₹{item.price} x {item.quantity}
                  </Text>
                  {item.note ? (
                    <Text style={styles.itemNote}>📝 {item.note}</Text>
                  ) : null}
                </View>
                {savedAddress && (
                  <Text style={styles.itemQty}>
                    ₹{item.price * item.quantity}
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
              <Text style={styles.billValue}>₹{itemTotal.toFixed(2)}</Text>
            </View>

            <View style={styles.billRow}>
              <Text style={styles.billLabel}>Delivery Fee</Text>
              <Text style={styles.billValue}>
                ₹{(data?.delivery_charges_value || 0).toFixed(2)}
              </Text>
            </View>

            <View style={styles.billRow}>
              <Text style={styles.billLabel}>Packing Fee</Text>
              <Text style={styles.billValue}>₹{packingFee.toFixed(2)}</Text>
            </View>

            {data.Cgst && (
              <View style={styles.billRow}>
                <Text style={styles.billLabel}>CGST ({data.Cgst})</Text>
                <Text style={styles.billValue}>{cgstAmt.toFixed(2)}</Text>
              </View>
            )}

            {data.Sgst && (
              <View style={styles.billRow}>
                <Text style={styles.billLabel}>SGST ({data.Sgst})</Text>
                <Text style={styles.billValue}>{sgstAmt.toFixed(2)}</Text>
              </View>
            )}

            {convenienceAmt > 0 && (
              <View style={styles.billRow}>
                <Text style={styles.billLabel}>
                  Convenience Charges ({data.convenience_charges_type === 'percentage' ? `${data.convenience_charges_value}%` : 'Flat'})
                </Text>
                <Text style={styles.billValue}>{convenienceAmt.toFixed(2)}</Text>
              </View>
            )}

     

            <View style={styles.divider} />

            <View style={styles.billRow}>
              <Text style={styles.totalLabel}>Grand Total</Text>
              <Text style={styles.totalValue}>₹{grandTotal.toFixed(2)}</Text>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Bottom Bar */}
      {cartItems.length > 0 && (
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
              { backgroundColor: savedAddress ? Theme.colors.red : '#ccc' },
            ]}
            onPress={handleProceed}
            disabled={!savedAddress}
          >
            <Text style={styles.continueText}>Proceed to Pay</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* COD Modal */}
      <Modal
        visible={codModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setCodModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Ionicons name="cash-outline" size={50} color={Theme.colors.red} />
            <Text style={styles.modalTitle}>Cash on Delivery</Text>
            <Text style={styles.modalText}>
              You will pay ₹{grandTotal.toFixed(2)} when the order is delivered.
            </Text>

            <TouchableOpacity
              style={styles.modalBtn}
              onPress={handleConfirmCOD}
            >
              <Text style={styles.modalBtnText}>Confirm Order</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.modalBtn, { backgroundColor: '#ccc', marginTop: 10 }]}
              onPress={() => setCodModalVisible(false)}
            >
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
  addressCard: { flexDirection: 'row', padding: 14, backgroundColor: '#fff', borderWidth: 1, borderColor: '#eee', borderRadius: 10, margin: 12, elevation: 2 },
  addrName: { fontSize: 15, fontWeight: '600', color: '#000' },
  addrDetails: { fontSize: 13, color: '#444', marginTop: 4 },
  addrPhone: { fontSize: 13, marginTop: 2, color: '#444' },
  changeBtn: { alignSelf: 'center', paddingHorizontal: 12, paddingVertical: 6, borderWidth: 1, borderColor: Theme.colors.red, borderRadius: 6 },
  changeText: { color: Theme.colors.red, fontSize: 12, fontWeight: '600' },

  sectionBox: { backgroundColor: '#fff', padding: 14, borderRadius: 10, marginHorizontal: 12, marginBottom: 12, borderWidth: 1, borderColor: '#eee' },
  sectionTitle: { fontSize: 15, fontWeight: '700', marginBottom: 8 },
  itemRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  itemImage: { width: 60, height: 60, borderRadius: 8 },
  itemName: { fontSize: 14, fontWeight: '600', color: '#000' },
  itemPrice: { fontSize: 13, color: '#000', fontWeight: '500', marginTop: 2 },
  itemQty: { fontSize: 13, fontWeight: '600', marginLeft: 10 },
  itemNote: { fontSize: 12, color: '#555', marginTop: 3 },

  billRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  billLabel: { fontSize: 13, color: '#555' },
  billValue: { fontSize: 13, color: '#000', fontWeight: '500' },
  divider: { height: 1, backgroundColor: '#eee', marginVertical: 8 },
  totalLabel: { fontSize: 14, fontWeight: '700' },
  totalValue: { fontSize: 15, fontWeight: '700', color: Theme.colors.red },

  bottomBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, borderColor: '#eee', padding: 15, backgroundColor: '#fff', position: 'absolute', bottom: '3%', left: 0, right: 0 },
  bottomLabel: { fontSize: 12, color: '#555' },
  bottomTotal: { fontSize: 18, fontWeight: '700', color: Theme.colors.red },
  continueBtn: { paddingHorizontal: 20, paddingVertical: 10, borderRadius: 20 },
  continueText: { color: '#fff', fontWeight: '700', fontSize: 14 },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { width: '80%', backgroundColor: '#fff', borderRadius: 12, padding: 20, alignItems: 'center' },
  modalTitle: { fontSize: 18, fontWeight: '700', marginVertical: 10 },
  modalText: { fontSize: 14, color: '#555', textAlign: 'center', marginBottom: 20 },
  modalBtn: { backgroundColor: Theme.colors.red, paddingVertical: 12, paddingHorizontal: 25, borderRadius: 25 },
  modalBtnText: { color: '#fff', fontWeight: '700', fontSize: 14 },
});
