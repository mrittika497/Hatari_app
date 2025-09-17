// src/screens/MenuScreen.js

import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  SafeAreaView,
  TextInput,
  ScrollView,
  Dimensions,
} from 'react-native';
import ShimmerPlaceHolder from 'react-native-shimmer-placeholder';
import LinearGradient from 'react-native-linear-gradient';
import {useNavigation} from '@react-navigation/native';
import {useSelector, useDispatch} from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';

import DashboardScreen from '../../components/DashboardScreen';
import CustomHeader from '../../components/CustomHeader';
import SmallbtnReuseable from '../../components/SmallbtnReuseable';
import {fetchMenuFoods} from '../../redux/slice/menucuisineTypeSlice';

const categories = ['Indian', 'Chinese', 'Italian', 'Mexican', 'Top Picks'];
const {width} = Dimensions.get('window');

const MenuScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const [activeCategory, setActiveCategory] = useState('Indian');
  const [search, setSearch] = useState('');

  const {
    data: menuFoods,
    loading,
    error,
  } = useSelector(state => state.menuItems);

  // Fetch foods whenever category changes
  useEffect(() => {
    if (activeCategory === 'Top Picks') {
      dispatch(fetchMenuFoods({isTopPick: true}));
    } else {
      dispatch(fetchMenuFoods({cuisineType: activeCategory}));
    }
  }, [dispatch, activeCategory]);

  // Filter items
  const filteredItems = menuFoods.filter(
    item =>
      item?.food?.cuisineType?.[0]?.toLowerCase() ===
        activeCategory.toLowerCase() &&
      item?.food?.name?.toLowerCase().includes(search.toLowerCase()),
  );

  /** =======================
   * Render Shimmer Loader
   =========================*/
  const renderShimmerItem = () => (
    <View style={styles.card}>
      <ShimmerPlaceHolder
        LinearGradient={LinearGradient}
        style={styles.shimmerImage}
      />
      <View style={{flex: 1, marginLeft: 12}}>
        <ShimmerPlaceHolder
          LinearGradient={LinearGradient}
          style={styles.shimmerLine}
        />
        <ShimmerPlaceHolder
          LinearGradient={LinearGradient}
          style={[styles.shimmerLine, {width: '40%'}]}
        />
        <ShimmerPlaceHolder
          LinearGradient={LinearGradient}
          style={[styles.shimmerLine, {width: '30%'}]}
        />
      </View>
    </View>
  );

  /** =======================
   * Render Food Item
   =========================*/
  const renderItem = ({item}) => (
    <View style={styles.card}>
      <Image source={{uri: item.food?.image}} style={styles.image} />
      <View style={styles.details}>
        <View style={styles.nameRow}>
          <View
            style={[
              styles.typeIndicator,
              {borderColor: item.food?.type?.includes('veg') ? 'green' : 'red'},
            ]}>
            <View
              style={[
                styles.typeDot,
                {
                  backgroundColor: item.food?.type?.includes('veg')
                    ? 'green'
                    : 'red',
                },
              ]}
            />
          </View>
          <Text style={styles.name}>{item.food?.name}</Text>
        </View>
        <Text style={styles.restaurantName}>{item.restaurant?.name}</Text>
        <Text style={styles.price}>₹{item.food?.price}</Text>
        <View style={styles.ratingWrapper}>
          <Ionicons name="star" size={14} color="green" />
          <Text style={styles.ratingText}>{item.food?.rating || 0}</Text>
        </View>
      </View>

      <SmallbtnReuseable
        onPress={() => {
          navigation.navigate('FoodDetailScreen', {
            foodItem: item.food,
          });
        }}
      />
    </View>
  );

  return (
    <DashboardScreen>
      <CustomHeader title="Menu" />
      <SafeAreaView style={styles.container}>
        {/* Categories */}
        <ScrollView
          style={styles.tabContainer}
          horizontal
          showsHorizontalScrollIndicator={false}>
          {categories.map(cat => (
            <TouchableOpacity
              key={cat}
              style={[styles.tab, activeCategory === cat && styles.activeTab]}
              onPress={() => setActiveCategory(cat)}>
              <Text
                style={[
                  styles.tabText,
                  activeCategory === cat && styles.activeTabText,
                ]}>
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Search */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#666" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search for dishes..."
            value={search}
            onChangeText={setSearch}
            placeholderTextColor="#888"
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch('')}>
              <Ionicons name="close-circle" size={20} color="gray" />
            </TouchableOpacity>
          )}
        </View>

        {/* Section Title */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Best Selling {activeCategory}</Text>
        </View>

        {/* Loader / Error / Food List */}
        {loading ? (
          <FlatList
            data={[1, 2, 3, 4, 5]}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderShimmerItem}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{paddingBottom: 100}}
          />
        ) : error ? (
          <Text style={styles.error}>{error}</Text>
        ) : (
          <FlatList
            data={filteredItems}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderItem}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{paddingBottom: 100}}
            ListEmptyComponent={
              <Text style={styles.noResults}>
                No items found for {activeCategory}
              </Text>
            }
          />
        )}
      </SafeAreaView>
    </DashboardScreen>
  );
};

export default MenuScreen;

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    marginTop: 20,
  },
  tabContainer: {
    flexDirection: 'row',
    marginHorizontal: 10,
    marginBottom: 10,
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    marginRight: 10,
  },
  activeTab: {
    backgroundColor: '#f44336',
    borderColor: '#f44336',
  },
  tabText: {
    fontSize: 14,
    color: '#555',
  },
  activeTabText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f1f1',
    borderRadius: 10,
    marginHorizontal: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginBottom: 20,
    marginTop: 20,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
    color: '#333',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
    marginHorizontal: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 10,
    marginHorizontal: 10,
    marginVertical: 6,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: {width: 0, height: 3},
    shadowRadius: 4,
    elevation: 3,
    alignItems: 'center',
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 10,
  },
  details: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  name: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 6,
  },
  restaurantName: {
    fontSize: 13,
    color: '#777',
    marginTop: 2,
  },
  price: {
    fontSize: 14,
    color: '#000',
    fontWeight: 'bold',
    marginTop: 4,
  },
  ratingWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  ratingText: {
    fontSize: 12,
    color: 'green',
    fontWeight: '600',
    marginLeft: 4,
  },
  typeIndicator: {
    width: 16,
    height: 16,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  typeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  shimmerImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
  },
  shimmerLine: {
    width: '60%',
    height: 15,
    marginBottom: 6,
    borderRadius: 5,
  },
  noResults: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 14,
    color: '#666',
  },
  error: {textAlign: 'center', color: 'red', marginTop: 20},
  addButton: {
    alignSelf: 'center',
    backgroundColor: '#f44336',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 8,
  },
});
