import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useSelector, useDispatch } from 'react-redux';
import { fetchCoupons } from '../redux/slice/couponSlice';

const CouponScreen = () => {
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
    <View style={styles.container}>
      <Text style={styles.header}>Available Coupons</Text>

      {loading && <ActivityIndicator size="large" color="#ff4d4d" />}
      {error && <Text style={styles.errorText}>Failed to load coupons.</Text>}

      <ScrollView showsVerticalScrollIndicator={false}>
        {couponList.length === 0 && !loading ? (
          <Text style={styles.noCouponText}>No coupons available.</Text>
        ) : (
          couponList.map(coupon => (
            <View key={coupon._id} style={styles.sectionBox}>
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
                  <Text style={styles.title}>{coupon.description}</Text>
                  <Text style={styles.detailText}>
                    Min Order: ₹{coupon.minOrderAmount}
                  </Text>
                  <Text style={styles.detailText}>
                    Discount: {coupon.discountDisplay}
                  </Text>
                  <Text style={styles.expiry}>
                    Expiry: {new Date(coupon.expiry).toLocaleDateString()}
                  </Text>
                </View>

                {/* Right Section */}
                <View style={styles.rightSection}>
                  <View style={styles.codeBox}>
                    <Text style={styles.codeText}>{coupon.code}</Text>
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
          ))
        )}
      </ScrollView>
    </View>
  );
};

export default CouponScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#222',
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
    color: '#666',
    marginTop: 30,
  },
  sectionBox: {
    marginBottom: 16,
  },
  card: {
    borderRadius: 16,
    flexDirection: 'row',
    padding: 16,
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  leftSection: {
    flex: 2,
    paddingRight: 10,
  },
  rightSection: {
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  detailText: {
    fontSize: 13,
    color: '#f0f0f0',
    marginVertical: 1,
  },
  expiry: {
    fontSize: 12,
    color: '#f9dada',
    marginTop: 5,
  },
  codeBox: {
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginBottom: 10,
  },
  codeText: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#e53935',
  },
  applyBtn: {
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingVertical: 6,
    paddingHorizontal: 16,
  },
  appliedBtn: {
    backgroundColor: '#ccc',
  },
  applyText: {
    color: '#e53935',
    fontWeight: 'bold',
  },
});
