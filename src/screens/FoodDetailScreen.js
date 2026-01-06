import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import ShimmerPlaceholder from 'react-native-shimmer-placeholder';
import LinearGradient from 'react-native-linear-gradient';
import DashboardScreen from '../components/DashboardScreen';
import CustomHeader from '../components/CustomHeader';
import {useNavigation} from '@react-navigation/native';
import {addToCart} from '../redux/slice/cartSlice';
import { useDispatch } from 'react-redux';

const FoodDetailScreen = ({route}) => {
  const dispatch = useDispatch()
  const foodItemdata = route?.params?.foodItem;

  
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  if (!foodItemdata) return null;

  // Normalize type to lowercase array
  const typeArray = Array.isArray(foodItemdata?.type)
    ? foodItemdata.type.map(t => String(t).toLowerCase())
    : String(foodItemdata?.type || '')
        .toLowerCase()
        .split(',');

  const isVeg = typeArray.includes('veg');
  const isNonVeg = typeArray.includes('non-veg');

  return (
    <DashboardScreen>
      <CustomHeader title="Item Details" />

      {/* Food Image */}
      <ShimmerPlaceholder
        LinearGradient={LinearGradient}
        visible={!loading}
        style={styles.image}>
        <Image source={{uri: foodItemdata?.image}} style={styles.image} />
      </ShimmerPlaceholder>

      <ScrollView style={styles.content}>
        {/* Cuisine */}
        <View style={styles.row}>
          <Image
            source={require('../assets/images/dineBlack.png')}
            style={{height: 12, width: 12}}
          />
          <Text style={styles.category}>
            {foodItemdata?.cuisineType?.join(', ')}
          </Text>
        </View>

        {/* Name */}
        <Text style={styles.title}>{foodItemdata?.name}</Text>

        {/* Type + Rating */}
        <View style={styles.row}>
          {/* Veg priority: if veg exists, show only green */}
          {isVeg ? (
            <View style={styles.typeIndicator}>
              <View style={[styles.typeDot, {backgroundColor: 'green'}]} />
            </View>
          ) : isNonVeg ? (
            <View style={styles.typeIndicator}>
              <View style={[styles.typeDot, {backgroundColor: 'red'}]} />
            </View>
          ) : null}

          {/* Rating */}
          <View style={styles.ratingBox}>
            <Text style={styles.ratingText}>★ {foodItemdata?.rating}</Text>
          </View>
        </View>

        {/* Description */}
        <Text style={styles.sectionTitle}>Description</Text>
        <Text style={styles.description}>{foodItemdata?.description}</Text>

        {/* Price */}
        <Text style={styles.price}>₹{foodItemdata?.price}</Text>

        {/* Quantity + Add Button */}
        <View style={styles.bottomRow}>
          <View style={styles.quantityBox}>
            <TouchableOpacity
              style={styles.qtyBtn}
              onPress={() => setQuantity(quantity > 1 ? quantity - 1 : 1)}>
              <Text style={styles.qtyText}>-</Text>
            </TouchableOpacity>
            <Text style={styles.qtyValue}>{quantity}</Text>
            <TouchableOpacity
              style={styles.qtyBtn}
              onPress={() => setQuantity(quantity + 1)}>
              <Text style={styles.qtyText}>+</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.addBtn}
            onPress={() => {
              dispatch(
                addToCart({
                  ...foodItemdata,
                  quantity,
                }),
              );
              navigation.navigate('Bottom', {screen: 'CartScreen'});
            }}>
            <Text style={styles.addBtnText}>Add to Cart</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </DashboardScreen>
  );
};

export default FoodDetailScreen;

const styles = StyleSheet.create({
  content: {marginVertical: 20, paddingHorizontal: 15},
  image: {
    width: '100%',
    height: 300,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    marginTop: 10,
  },
  row: {flexDirection: 'row', alignItems: 'center', marginBottom: 10},
  category: {fontSize: 14, color: '#333', marginLeft: 6},
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000',
    marginVertical: 8,
  },
  typeIndicator: {
    width: 14,
    height: 14,
    borderWidth: 1,
    borderRadius: 3,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  typeDot: {
    width: 7,
    height: 7,
    borderRadius: 50,
  },
  ratingBox: {
    backgroundColor: '#FFD700',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  ratingText: {color: '#000', fontSize: 12, fontWeight: '600'},
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 10,
    color: '#000',
  },
  description: {fontSize: 14, color: '#555', marginBottom: 20},
  price: {fontSize: 18, fontWeight: 'bold', color: '#000', marginBottom: 30},
  bottomRow: {flexDirection: 'row', alignItems: 'center', marginBottom: 30},
  quantityBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F1F1',
    borderRadius: 25,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginRight: 15,
  },
  qtyBtn: {
    width: 30,
    height: 30,
    backgroundColor: '#fff',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
  },
  qtyText: {fontSize: 18, fontWeight: 'bold', color: '#FF4D4D'},
  qtyValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginHorizontal: 10,
  },
  addBtn: {
    flex: 1,
    backgroundColor: '#FF4D4D',
    borderRadius: 25,
    paddingVertical: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addBtnText: {color: '#fff', fontSize: 16, fontWeight: 'bold'},
});
