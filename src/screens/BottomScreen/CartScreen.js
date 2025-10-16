// src/screens/cart/CartScreen.js
import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  Dimensions,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Modal,
  SafeAreaView,
} from 'react-native';
import ShimmerPlaceHolder from 'react-native-shimmer-placeholder';
import LinearGradient from 'react-native-linear-gradient';
import {useNavigation} from '@react-navigation/native';
import {useSelector, useDispatch} from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import DashboardScreen from '../../components/DashboardScreen';
import CustomHeader from '../../components/CustomHeader';
import Theme from '../../assets/theme';

import {
  updateQuantity,
  removeFromCart,
  updateNote,
} from '../../redux/slice/cartSlice';
import {postCustomizedFood} from '../../redux/slice/CustomizeSlice';

const {width, height} = Dimensions.get('window');

const CartScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const {items: cartItems} = useSelector(state => state.cart);
  const [loading, setLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [noteText, setNoteText] = useState('');
  const insets = useSafeAreaInsets();

  const formatCurrency = amount => `₹${amount.toLocaleString('en-IN')}`;

  const incrementQty = (id, currentQty) => {
    dispatch(updateQuantity({id, quantity: currentQty + 1}));
  };
  const decrementQty = (id, currentQty) => {
    dispatch(updateQuantity({id, quantity: currentQty > 1 ? currentQty - 1 : 1}));
  };
  const deleteItem = id => {
    dispatch(removeFromCart(id));
  };

  const openModal = item => {
    setSelectedItem(item);
    setNoteText(item.note || '');
  };
  const closeModal = () => {
    setSelectedItem(null);
    setNoteText('');
  };

  const handleSaveNote = async () => {
    if (selectedItem) {
      dispatch(updateNote({id: selectedItem._id, note: noteText}));
      const resultAction = await dispatch(
        postCustomizedFood({
          food: selectedItem._id,
          quantity: selectedItem.quantity,
          note: noteText,
        }),
      );
      if (postCustomizedFood.fulfilled.match(resultAction)) {
        alert('Customization saved!');
      } else {
        alert('Failed to save customization');
      }
    }
    closeModal();
  };

  const renderItem = ({item}) => (
    <View style={styles.itemCard}>
      <Image source={{uri: item.image}} style={styles.itemImage} />
      <View style={styles.detailsContainer}>
        <View style={styles.itemHeader}>
          <View
            style={[
              styles.typeIndicator,
              {borderColor: item.type?.includes('veg') ? 'green' : 'red'},
            ]}>
            <View
              style={[
                styles.typeDot,
                {backgroundColor: item.type?.includes('veg') ? 'green' : 'red'},
              ]}
            />
          </View>
          <Text style={styles.itemName} numberOfLines={1}>
            {item.name}
          </Text>
        </View>

        <Text style={styles.itemPrice}>
          {formatCurrency(item.price * item.quantity)}
        </Text>
        <View style={styles.ratingWrapper}>
          <Text style={styles.ratingText}>★ {item?.rating}</Text>
        </View>

        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.customizeBtn} onPress={() => openModal(item)}>
            <Icon name="pencil" size={16} color={Theme.colors.red} />
            <Text style={styles.customizeText}>Customize</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.deleteBtn} onPress={() => deleteItem(item._id)}>
            <Ionicons name="trash-outline" size={18} color="red" />
            <Text style={styles.deleteText}>Remove</Text>
          </TouchableOpacity>
        </View>

        {item.note ? (
          <View style={styles.noteTag}>
            <Text style={styles.noteText}>📝 {item.note}</Text>
          </View>
        ) : null}
      </View>

      <View style={styles.quantityBox}>
        <TouchableOpacity
          style={styles.qtyBtn}
          onPress={() => decrementQty(item._id, item.quantity)}>
          <Text style={styles.qtyText}>-</Text>
        </TouchableOpacity>
        <Text style={styles.qtyValue}>{item.quantity}</Text>
        <TouchableOpacity
          style={styles.qtyBtn}
          onPress={() => incrementQty(item._id, item.quantity)}>
          <Text style={styles.qtyText}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <DashboardScreen scrollable={false}>
      <CustomHeader title="My Cart" />

      <SafeAreaView style={{flex: 1}}>
        <KeyboardAvoidingView
          style={{flex: 1}}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <TouchableOpacity
            style={styles.addMore}
            onPress={() => navigation.navigate('HomeScreen')}>
            <Text style={{color: Theme.colors.red, fontWeight: '600'}}>
              + Add more Items
            </Text>
          </TouchableOpacity>

          <View style={styles.container}>
            {loading ? (
              Array.from({length: 3}).map((_, i) => (
                <View key={i} style={{marginVertical: 8}}>
                  <ShimmerPlaceHolder
                    LinearGradient={LinearGradient}
                    style={{width: width * 0.9, height: 80, borderRadius: 8}}
                  />
                </View>
              ))
            ) : cartItems.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Image
                  source={{
                    uri: 'https://cdn-icons-png.flaticon.com/512/2038/2038854.png',
                  }}
                  style={{width: width * 0.35, height: width * 0.35, marginBottom: 10}}
                />
                <Text style={styles.emptyText}>Your cart is empty</Text>
                <TouchableOpacity
                  style={styles.browseBtn}
                  onPress={() => navigation.navigate('HomeScreen')}>
                  <Text style={styles.browseText}>Browse Menu</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <>
                <FlatList
                  data={cartItems}
                  keyExtractor={item => item._id}
                  renderItem={renderItem}
                  contentContainerStyle={{paddingBottom: height * 0.15}}
                  showsVerticalScrollIndicator={false}
                />

                {/* ✅ Fixed Responsive Bottom Bar */}
                <View style={[styles.bottomBar, {paddingBottom: insets.bottom || 16}]}>
                  <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                    <Text style={{fontSize: width * 0.035, color: '#555', textAlign: 'center'}}>
                      🛒 Oops! Your cart is lonely. Tap "Continue" to see all the goodies!
                    </Text>
                  </View>

                  <TouchableOpacity
                    style={styles.checkoutBtn}
                    onPress={() =>
                      navigation.navigate('OrderSummaryScreen', {cartItems})
                    }>
                    <Text style={styles.checkoutText}>Continue</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>

      {/* Note Modal */}
      <Modal visible={!!selectedItem} animationType="slide" transparent onRequestClose={closeModal}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Edit Item: {selectedItem?.name}</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Enter special note..."
              placeholderTextColor="#999"
              value={noteText}
              onChangeText={setNoteText}
              multiline
            />

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalBtn, {backgroundColor: '#ccc'}]}
                onPress={closeModal}>
                <Text style={[styles.modalBtnText, {color: '#333'}]}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalBtn, {backgroundColor: Theme.colors.red}]}
                onPress={handleSaveNote}>
                <Text style={styles.modalBtnText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </DashboardScreen>
  );
};

export default CartScreen;

const styles = StyleSheet.create({
  addMore: {alignSelf: 'flex-end', marginVertical: 10, marginRight: 15},
  container: {flex: 1, backgroundColor: '#fff'},
  emptyContainer: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  emptyText: {fontSize: width * 0.045, color: '#555', fontWeight: '600'},
  browseBtn: {
    backgroundColor: Theme.colors.red,
    marginTop: 15,
    paddingHorizontal: width * 0.06,
    paddingVertical: 10,
    borderRadius: 25,
  },
  browseText: {color: '#fff', fontWeight: '600'},
  itemCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginHorizontal: 12,
    marginVertical: 6,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  itemImage: {width: width * 0.18, height: width * 0.18, borderRadius: 10},
  detailsContainer: {flex: 1, marginLeft: 12},
  itemHeader: {flexDirection: 'row', alignItems: 'center', marginBottom: 6},
  typeIndicator: {
    width: 16,
    height: 16,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 6,
    borderRadius: 3,
  },
  typeDot: {width: 8, height: 8, borderRadius: 4},
  itemName: {fontSize: width * 0.04, fontWeight: '700', color: '#333', flexShrink: 1},
  itemPrice: {fontSize: width * 0.037, color: '#777', marginTop: 2},
  ratingWrapper: {
    backgroundColor: 'green',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  ratingText: {color: '#fff', fontSize: width * 0.03, fontWeight: '600'},
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
  actionRow: {flexDirection: 'row', alignItems: 'center', marginTop: 8},
  customizeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF1F1',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    marginRight: 10,
  },
  customizeText: {fontSize: width * 0.032, color: Theme.colors.red, fontWeight: '600', marginLeft: 5},
  deleteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF1F1',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  deleteText: {fontSize: width * 0.032, color: 'red', fontWeight: '600', marginLeft: 5},
  quantityBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9F9F9',
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 5,
    marginLeft: 8,
  },
  qtyBtn: {
    width: 28,
    height: 28,
    backgroundColor: '#fff',
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
  },
  qtyText: {fontSize: width * 0.05, fontWeight: 'bold', color: Theme.colors.red},
  qtyValue: {fontSize: width * 0.035, fontWeight: '600', marginHorizontal: 8, color: '#000'},
  bottomBar: {
    position: 'absolute',
    bottom: "10%",
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderColor: '#eee',
    paddingHorizontal: 16,
    paddingVertical: 12,
    elevation: 12,
  },
  checkoutBtn: {
    backgroundColor: Theme.colors.red,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
  },
  checkoutText: {color: '#fff', fontWeight: '600', fontSize: width * 0.038},
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '85%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    elevation: 6,
  },
  modalTitle: {fontSize: width * 0.045, fontWeight: '700', marginBottom: 12, color: '#000'},
  modalInput: {
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    padding: 10,
    minHeight: 60,
    textAlignVertical: 'top',
    fontSize: 14,
    color: '#000',
  },
  modalActions: {flexDirection: 'row', justifyContent: 'flex-end', marginTop: 15},
  modalBtn: {paddingHorizontal: 16, paddingVertical: 10, borderRadius: 6, marginLeft: 10},
  modalBtnText: {color: '#fff', fontWeight: '600'},
});
