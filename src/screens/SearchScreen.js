import React, {useEffect, useState, useCallback} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';

import DashboardScreen from '../components/DashboardScreen';
import CustomHeader from '../components/CustomHeader';
import SmallbtnReuseable from '../components/SmallbtnReuseable';
import {fetchFoodPagination} from '../redux/slice/SearchFoodPaginationSlice';
import Theme from '../assets/theme';

const SearchScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const {AllFoodsData, page, hasMore, loading} = useSelector(
    state => state.FoodPagination,
  );

  const [search, setSearch] = useState('');

  // ✅ Initial fetch
  useEffect(() => {
    dispatch(fetchFoodPagination({page: 1, limit: 10}));
  }, [dispatch]);

  // ✅ Local search filter
  const filteredResults =
    search.trim().length > 0
      ? AllFoodsData.filter(item =>
          item?.food?.name?.toLowerCase().includes(search.toLowerCase()),
        )
      : AllFoodsData;

  // ✅ Load more pagination
  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      dispatch(fetchFoodPagination({page: page + 1, limit: 10}));
    }
  }, [dispatch, page, hasMore, loading]);

  // ✅ Footer loader for infinite scroll
  const renderFooter = () => {
    if (loading && page > 1) {
      return (
        <View style={styles.footerLoader}>
          <ActivityIndicator size="large" color="red" />
        </View>
      );
    }
    return null;
  };

  // ✅ Render each food card
  const renderItem = ({item}) => {
    const food = item?.food || {};
    return (
      <TouchableOpacity
        key={food._id}
        style={styles.card}
        activeOpacity={0.9}
        onPress={() =>
          navigation.navigate('FoodDetailScreen', {foodItem: food})
        }>
        {/* Food Image */}
        <Image source={{uri: food.image}} style={styles.image} />

        {/* Details */}
        <View style={styles.details}>
          {/* Cuisine type */}
          {food.cuisineType && food.cuisineType.length > 0 && (
            <View style={styles.cuisineRow}>
              <Ionicons name="restaurant" size={12} color="#666" />
              <Text style={styles.cuisineText}>
                {food.cuisineType.join(', ')}
              </Text>
            </View>
          )}

          {/* Veg / Non-Veg */}
          <View style={styles.typeRow}>
            <View
              style={[
                styles.typeIndicator,
                {
                  borderColor: food.type?.includes('non-veg') ? 'red' : 'green',
                },
              ]}>
              <View
                style={[
                  styles.typeDot,
                  {
                    backgroundColor: food.type?.includes('veg')
                      ? 'green'
                      : 'red',
                  },
                ]}
              />
            </View>
            <Text style={styles.name}>{food.name}</Text>
          </View>

          {/* Price */}
          <Text style={styles.price}>₹{food.price}</Text>

          {/* Rating */}
          <View style={styles.ratingWrapper}>
            <Ionicons name="star" color="#fff" size={10} />
            <Text style={styles.ratingText}>{food.rating || 4.5}</Text>
          </View>
        </View>

        {/* Add Button */}
        <SmallbtnReuseable
          onPress={() =>
            navigation.navigate('FoodDetailScreen', {foodItem: food})
          }
        />
      </TouchableOpacity>
    );
  };

  return (
    <DashboardScreen scrollable={false}>
      {/* Header */}
      <CustomHeader title="Search Food" />

      {/* Search Bar */}
      <View style={styles.searchBox}>
        <Ionicons name="search" size={22} color="red" />
        <TextInput
          style={styles.input}
          placeholder="Try Pizza, Biryani, Sushi..."
          value={search}
          onChangeText={setSearch}
          placeholderTextColor="#999"
        />
      </View>

      {/* Main Content */}
      {loading && page === 1 ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="red" />
        </View>
      ) : filteredResults.length > 0 ? (
        <FlatList
          data={filteredResults}
          keyExtractor={(item, index) =>
            item?.food?._id?.toString() || index.toString()
          }
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={renderFooter}
        />
      ) : (
        <View style={styles.emptyState}>
          <Image
            source={{
              uri: 'https://cdn-icons-png.flaticon.com/512/4076/4076505.png',
            }}
            style={styles.emptyImage}
          />
          <Text style={styles.emptyText}>No items found</Text>
          <Text style={styles.emptySubText}>
            Try searching with a different keyword.
          </Text>
        </View>
      )}
  
    </DashboardScreen>
  );
};

export default SearchScreen;

const styles = StyleSheet.create({
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 14,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: 'red',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: {width: 0, height: 2},
    elevation: 2,
    marginHorizontal: 10,
    marginTop: 10,
  },
  input: {
    marginLeft: 8,
    fontSize: 16,
    flex: 1,
    color: '#333',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 60,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 10,
    marginBottom: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 5,
    elevation: 2,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 10,
  },
  details: {
    flex: 1,
    marginLeft: 10,
  },
  cuisineRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cuisineText: {
    marginLeft: 6,
    color: '#555',
    fontSize: 12,
  },
  typeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  typeIndicator: {
    width: 14,
    height: 14,
    borderWidth: 1,
    borderRadius: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  typeDot: {
    width: 7,
    height: 7,
    borderRadius: 50,
  },
  name: {
    fontSize: 15,
    fontWeight: '600',
    marginLeft: 8,
    color: '#000',
    flexShrink: 1,
  },
  price: {
    fontSize: 14,
    color: '#000',
    marginVertical: 5,
    fontWeight: '500',
  },
  ratingWrapper: {
    backgroundColor: '#2e7d32',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    alignSelf: 'flex-start',
  },
  ratingText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '600',
    marginLeft: 2,
  },
  listContent: {
    padding: 16,
    paddingBottom: 120,
  },
  footerLoader: {
    paddingVertical: 30,
   
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
  },
  emptyImage: {
    width: 90,
    height: 90,
    tintColor: '#ccc',
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 12,
    color: '#555',
  },
  emptySubText: {
    fontSize: 13,
    color: '#999',
    marginTop: 4,
  },
});
