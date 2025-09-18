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

import DashboardScreen from '../components/DashboardScreen';
import CustomHeader from '../components/CustomHeader';
import {fetchFoodPagination} from '../redux/slice/SearchFoodPaginationSlice';
import SmallbtnReuseable from '../components/SmallbtnReuseable';
import { useNavigation } from '@react-navigation/native';
import Theme from '../assets/theme';

const SearchScreen = () => {
    const navigation = useNavigation();
  const dispatch = useDispatch();
  const {AllFoodsData, page, hasMore, loading, error} = useSelector(
    state => state.FoodPagination,
  );

  const [search, setSearch] = useState('');

  // ✅ Fetch first page on mount
  useEffect(() => {
    dispatch(fetchFoodPagination({page: 1, limit: 10}));
  }, [dispatch]);

  // ✅ Local filter
  const filteredResults =
    search.trim().length > 0
      ? AllFoodsData.filter(item =>
          item?.food?.name?.toLowerCase().includes(search.toLowerCase()),
        )
      : AllFoodsData;

  // ✅ Load more pages
  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      dispatch(fetchFoodPagination({page: page + 1, limit: 10}));
    }
  }, [dispatch, page, hasMore, loading]);

  // ✅ Footer loader
const renderFooter = () => {
  if (loading && page > 1) {
    return (
      <View style={{ paddingVertical: 20 }}>
        <ActivityIndicator size="large" color="#FD9D56" />
      </View>
    );
  }
  return null;
};

  // ✅ Render each food card
  const renderItem = ({item}) => {
    const food = item?.food || {};
    return (
      <View key={item.food._id} style={styles.card}>
                {/* Food Image */}
                <Image source={{uri: item.food.image}} style={styles.image} />

                {/* Details */}
                <View style={styles.details}>
                  {/* Cuisine type (dynamic) */}
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Image
                      source={require('../assets/images/dineBlack.png')}
                      style={{width: 12, height: 12}}
                    />
                    <Text
                      style={{
                        marginLeft: 10,
                        color: 'black',
                        fontSize: 13,
                        fontWeight: '500',
                      }}>
                      {item.food.cuisineType.join(', ')}
                    </Text>
                  </View>

                  {/* Veg / Non-Veg */}
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginTop: 5,
                    }}>
                    <View
                      style={[
                        styles.typeIndicator,
                        {
                          borderColor: item.food.type.includes('non-veg')
                            ? 'red'
                            : 'green',
                        },
                      ]}>
                      <View
                        style={[
                          styles.typeDot,
                          {
                            backgroundColor: item.food.type.includes('veg')
                              ? 'green'
                              : 'red',
                          },
                        ]}
                      />
                    </View>
                    <Text style={styles.name}>{item.food.name}</Text>
                  </View>

                  {/* Price */}
                  <Text style={styles.price}>₹{item.food.price}</Text>

                  {/* Rating */}
                  <View style={styles.ratingWrapper}>
                    <Text style={styles.ratingText}>★ {item.food.rating}</Text>
                  </View>

                </View>

                {/* Button */}
                <SmallbtnReuseable
                  onPress={() => {
                    navigation.navigate('FoodDetailScreen', {
                      foodItem: item.food,
                    });
                  }}
                />
              </View>
    );
  };

  return (
    <DashboardScreen scrollable={false}>
      {/* Header */}
      <CustomHeader title="Search Food" />

      {/* Search Bar */}
      <View style={styles.searchBox}>
        <Ionicons name="search" size={22} color="#B00020" />
        <TextInput
          style={styles.input}
          placeholder="Try Pizza, Biryani, Sushi..."
          value={search}
          onChangeText={setSearch}
          placeholderTextColor="#999"
        />
      </View>

      {/* Results */}
      {filteredResults.length > 0 ? (
        <FlatList
          data={filteredResults}
          keyExtractor={(item, index) =>
            item?.food?._id?.toString() || index.toString()
          }
          renderItem={renderItem}
          contentContainerStyle={{padding: 16}}
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={renderFooter}
            ListFooterComponentStyle={{ paddingVertical: 80 }}
        />
      ) : loading ? (
        <ActivityIndicator
          size="large"
          color="#FD9D56"
          style={{marginTop: 50}}
        />
      ) : (
        <View style={styles.emptyState}>
          <Ionicons name="alert-circle-outline" size={40} color="#FD9D56" />
          <Text style={styles.emptyText}>No results found</Text>
        </View>
      )}

      {/* Error */}
      {error && (
        <Text style={{color: 'red', textAlign: 'center', marginTop: 20}}>
          {error}
        </Text>
      )}
    </DashboardScreen>
  );
};

const styles = StyleSheet.create({
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 14,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: Theme.colors.red,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: {width: 0, height: 2},
    elevation: 3,
    margin: 16,
  },
  input: {
    marginLeft: 8,
    fontSize: 16,
    flex: 1,
    color: '#333',
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#f9f9f9',
    borderRadius: 15,
    padding: 10,
    marginBottom: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 5,
    elevation: 3,
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
  name: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 5,
    color: '#000',
  },
  price: {
    fontSize: 14,
    color: '#000',
    marginVertical: 4,
    fontWeight: '500',
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
  ratingWrapper: {
    backgroundColor: 'green',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  ratingText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '600',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
  emptyText: {
    fontSize: 16,
    marginTop: 8,
    color: '#999',
  },
});

export default SearchScreen;
