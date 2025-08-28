import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import ShimmerPlaceHolder from 'react-native-shimmer-placeholder';
import Icon from 'react-native-vector-icons/MaterialIcons';
import DashboardScreen from '../../components/DashboardScreen';
import CustomHeader from '../../components/CustomHeader';

const ProfileScreen = () => {
  const [isLoading, setIsLoading] = useState(true);

  // Fake API loading simulation
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <DashboardScreen>
      <CustomHeader title='Profile' />
      <ScrollView style={styles.container}>
        {/* Profile Header */}
        <View style={styles.header}>
          <ShimmerPlaceHolder
            visible={!isLoading}
            style={styles.profileImageShimmer}
          >
            <Image
              source={{
                uri: 'https://randomuser.me/api/portraits/men/32.jpg',
              }}
              style={styles.profileImage}
            />
          </ShimmerPlaceHolder>
          <View style={{ marginLeft: 15 }}>
            <ShimmerPlaceHolder visible={!isLoading} style={styles.shimmerName}>
              <Text style={styles.name}>Customer Namegygygg</Text>
            </ShimmerPlaceHolder>
            <ShimmerPlaceHolder visible={!isLoading} style={styles.shimmerPhone}>
              <Text style={styles.phone}>+91 9876543210</Text>
            </ShimmerPlaceHolder>
          </View>
          <TouchableOpacity style={styles.editIcon}>
            <Icon name="edit" size={20} color="#666" />
          </TouchableOpacity>
        </View>

        {/* Menu Options */}
        <View style={styles.menuContainer}>
          {[
            { title: 'Address', icon: 'location-on' },
            // { title: 'Favorites', icon: 'favorite-border' },
            { title: 'My Orders', icon: 'shopping-cart' },
            { title: 'Help and Support', icon: 'support-agent' },
          ].map((item, index) => (
            <TouchableOpacity key={index} style={styles.menuItem}>
              <Icon name={item.icon} size={22} color="#444" />
              <Text style={styles.menuText}>{item.title}</Text>
              <Icon name="chevron-right" size={24} color="#ccc" />
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout */}
        <TouchableOpacity style={styles.logoutContainer}>
          <Icon name="logout" size={22} color="#E74C3C" />
          <Text style={styles.logoutText}>Logout</Text>
          <Icon name="chevron-right" size={24} color="#E74C3C" />
        </TouchableOpacity>
      </ScrollView>
    </DashboardScreen>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    marginTop: 20
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F7F7F7',
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
    position: 'relative',
  },
  profileImageShimmer: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  shimmerName: {
    width: 120,
    // height: 18,
    borderRadius: 4,
    marginBottom: 5,
  },
  shimmerPhone: {
    width: 140,
    // height: 30,
    borderRadius: 4,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  phone: {
    // fontSize: 14,
    color: '#666',
    width: "100%"
  },
  editIcon: {
    position: 'absolute',
    right: 15,
    top: 15,
  },
  menuContainer: {
    backgroundColor: '#F7F7F7',
    borderRadius: 12,
    paddingVertical: 10,
    marginBottom: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EAEAEA',
  },
  menuText: {
    flex: 1,
    marginLeft: 15,
    fontSize: 16,
    color: '#333',
  },
  logoutContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FDEDEC',
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
  },
  logoutText: {
    flex: 1,
    marginLeft: 15,
    fontSize: 16,
    color: '#E74C3C',
    fontWeight: '600',
  },
});
