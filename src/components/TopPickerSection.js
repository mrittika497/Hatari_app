import React, { useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPaginatedFoods, resetFoods } from '../redux/slice/foodSlice';


const TopPickerSection = () => {
  const dispatch = useDispatch();
  const { items, loading, page, hasMore } = useSelector((state) => state.foods);

  useEffect(() => {
    dispatch(fetchPaginatedFoods({ page: 1, limit: 10 }));
    return () => {
      dispatch(resetFoods());
    };
  }, [dispatch]);

  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      dispatch(fetchPaginatedFoods({ page, limit: 10 }));
    }
  }, [dispatch, loading, hasMore, page]);

  const renderFooter = () => {
    if (!loading) return null;
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#FF7B00" />
      </View>
    );
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.card} activeOpacity={0.8}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <View style={styles.infoContainer}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.desc} numberOfLines={2}>
          {item.description || 'Delicious food waiting for you!'}
        </Text>
        <Text style={styles.price}>₹{item.price}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🍽 Food Menu</Text>

      <FlatList
        data={items}
        keyExtractor={(item, index) => item._id || index.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
      />

      {!loading && items.length === 0 && (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No foods found 😞</Text>
        </View>
      )}
    </View>
  );
};

export default TopPickerSection;

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    backgroundColor: '#bd5734ff',
    paddingHorizontal: 15,
    // paddingTop: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#222',
    marginBottom: 10,
  },
  list: {
    paddingBottom: 100,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderRadius: 16,
    marginVertical: 8,
    padding: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  image: {
    width: 90,
    height: 90,
    borderRadius: 12,
  },
  infoContainer: {
    flex: 1,
    marginLeft: 10,
    justifyContent: 'space-between',
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
   
  },
  desc: {
    fontSize: 13,
    color: '#666',
  },
  price: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FF7B00',
  },
  loaderContainer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
  },
});


