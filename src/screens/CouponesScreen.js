import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  SafeAreaView,
  Animated
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useSelector, useDispatch } from 'react-redux';
import { fetchCoupons } from '../redux/slice/couponSlice';
import Ionicons from 'react-native-vector-icons/Ionicons';


const CouponesScreen = () => {
  const dispatch = useDispatch();
  const { list: couponList = [], loading, error } = useSelector(
    state => state.coupons
  );

  const [selectedCoupon, setSelectedCoupon] = useState(null);

  useEffect(() => {
    dispatch(fetchCoupons());
  }, [dispatch]);

  const applyCoupon = coupon => {
    setSelectedCoupon(coupon);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Available Coupons</Text>

      {loading && <ActivityIndicator size="large" color="#ff4d4d" />}
      {error && <Text style={styles.errorText}>Failed to load coupons.</Text>}

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}>
        {couponList.length === 0 && !loading ? (
          <Text style={styles.noCouponText}>No coupons available.</Text>
        ) : (
          couponList.map((coupon, index) => (
            <Animated.View
              key={coupon._id}
              entering={FadeInUp.delay(index * 100).duration(400)}
              style={styles.sectionBox}>
              <LinearGradient
                colors={
                  selectedCoupon?._id === coupon._id
                    ? ['#ff4d4d', '#ff6b81']
                    : ['#e57373', '#ef5350']
                }
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.card}>
                {/* Left Section */}
                <View style={styles.leftSection}>
                  <View style={styles.couponIconBox}>
                    <Ionicons name="pricetag" size={20} color="#fff" />
                  </View>
                  <View style={{ flex: 1, marginLeft: 10 }}>
                    <Text style={styles.title} numberOfLines={2}>
                      {coupon.description}
                    </Text>
                    <Text style={styles.detailText}>
                      Min Order: ₹{coupon.minOrderAmount}
                    </Text>
                    <Text style={styles.detailText}>
                      Discount: {coupon.discountDisplay}
                    </Text>
                    <Text style={styles.expiry}>
                      Expires on:{' '}
                      {new Date(coupon.expiry).toLocaleDateString()}
                    </Text>
                  </View>
                </View>

                {/* Right Section */}
                <View style={styles.rightSection}>
                  <View style={styles.codeBox}>
                    <Text style={styles.codeText}>{coupon.code}</Text>
                  </View>
                  <TouchableOpacity
                    activeOpacity={0.8}
                    style={[
                      styles.applyBtn,
                      selectedCoupon?._id === coupon._id && styles.appliedBtn,
                    ]}
                    onPress={() => applyCoupon(coupon)}
                    disabled={selectedCoupon?._id === coupon._id}>
                    <Text
                      style={[
                        styles.applyText,
                        selectedCoupon?._id === coupon._id && {
                          color: '#666',
                        },
                      ]}>
                      {selectedCoupon?._id === coupon._id ? 'APPLIED' : 'APPLY'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </LinearGradient>
            </Animated.View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default CouponesScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff8f8',
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  header: {
    fontSize: 22,
    fontWeight: '700',
    color: '#d32f2f',
    marginBottom: 15,
    textAlign: 'center',
  },
  errorText: {
    textAlign: 'center',
    color: 'red',
    marginVertical: 10,
  },
  noCouponText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#999',
    marginTop: 40,
  },
  sectionBox: {
    marginBottom: 18,
  },
  card: {
    borderRadius: 18,
    flexDirection: 'row',
    padding: 18,
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 3 },
    elevation: 5,
  },
  leftSection: {
    flex: 2.2,
    flexDirection: 'row',
    alignItems: 'center',
  },
  rightSection: {
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  couponIconBox: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    padding: 8,
    borderRadius: 8,
  },
  title: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  detailText: {
    fontSize: 13,
    color: '#f9f9f9',
  },
  expiry: {
    fontSize: 12,
    color: '#fddcdc',
    marginTop: 4,
  },
  codeBox: {
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginBottom: 10,
    elevation: 3,
  },
  codeText: {
    fontWeight: '700',
    fontSize: 14,
    color: '#d32f2f',
  },
  applyBtn: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 16,
  },
  appliedBtn: {
    backgroundColor: '#eee',
  },
  applyText: {
    color: '#1e1c1cff',
    fontWeight: '700',
    fontSize: 13,
  },
});
