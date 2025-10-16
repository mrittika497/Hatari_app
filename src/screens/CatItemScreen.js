import React, {useEffect} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  Dimensions,
} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import ShimmerPlaceHolder from 'react-native-shimmer-placeholder';
import LinearGradient from 'react-native-linear-gradient';

import DashboardScreen from '../components/DashboardScreen';
import CustomHeader from '../components/CustomHeader';
import SmallbtnReuseable from '../components/SmallbtnReuseable';
import {fetchCategoryFoods} from '../redux/slice/catItemSlice';
import Theme from '../assets/theme';

const {width} = Dimensions.get('window');

const CatItemScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const route = useRoute();

  const {categoryId, categoryName, restaurantId, categoryIngredients} =
    route.params;
  console.log(
    restaurantId,
    '-------------restaurantId-------------------hbhbhbs',
  );

  const {
    data: categoryFoods,
    loading,
    error,
  } = useSelector(state => state.catItems);

  useEffect(() => {
    dispatch(
      fetchCategoryFoods({
        categoryId,
        categoryIngredients,
        restaurantId,
      }),
    );
  }, [dispatch, categoryId, categoryIngredients]);

  // Skeleton loader
  const renderSkeleton = () => (
    <View style={styles.card}>
      <ShimmerPlaceHolder
        LinearGradient={LinearGradient}
        style={styles.image}
      />
      <View style={{flex: 1, marginLeft: 10}}>
        <ShimmerPlaceHolder
          LinearGradient={LinearGradient}
          style={{
            width: width * 0.4,
            height: 14,
            marginBottom: 6,
            borderRadius: 4,
          }}
        />
        <ShimmerPlaceHolder
          LinearGradient={LinearGradient}
          style={{
            width: width * 0.25,
            height: 14,
            marginBottom: 6,
            borderRadius: 4,
          }}
        />
        <ShimmerPlaceHolder
          LinearGradient={LinearGradient}
          style={{width: width * 0.2, height: 14, borderRadius: 4}}
        />
      </View>
    </View>
  );

  const renderItem = ({item}) => {
    const food = item.food;

    return (
      <View style={styles.card}>
        <Image source={{uri: food.image}} style={styles.image} />

        <View style={styles.details}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Image
              source={require('../assets/images/dineBlack.png')}
              style={{width: 12, height: 12}}
            />
            <Text
              style={{
                marginLeft: 10,
                color: 'black',
                fontSize: Theme.fontSizes.small,
                fontWeight: '500',
              }}>
              {food.cuisineType?.[0] || 'Indian'}
            </Text>
          </View>

          <View
            style={{flexDirection: 'row', alignItems: 'center', marginTop: 4}}>
            <View
              style={[
                styles.typeIndicator,
                {borderColor: food.type?.[0] === 'veg' ? 'green' : 'red'},
              ]}>
              <View
                style={[
                  styles.typeDot,
                  {backgroundColor: food.type?.[0] === 'veg' ? 'green' : 'red'},
                ]}
              />
            </View>
            <Text style={styles.name}>{food.name}</Text>
          </View>

          <Text style={styles.price}>₹{food.price}</Text>

          <View style={styles.ratingWrapper}>
            <Text style={styles.ratingText}>★ {food.rating}</Text>
          </View>
        </View>

        <View style={styles.actions}>
          <SmallbtnReuseable
            onPress={() => {
              navigation.navigate('FoodDetailScreen', {
                foodItem: item.food,
              });
            }}
          />
        </View>
      </View>
    );
  };

  return (
    <DashboardScreen scrollable={false}>
      <CustomHeader title="Category Item" />
 
        <View style={styles.container}>
          <Text style={styles.header}>{categoryName} Items</Text>

          {loading ? (
            Array.from({length: 5}).map((_, i) => (
              <View key={i}>{renderSkeleton()}</View>
            ))
          ) : error ? (
            <Text style={{textAlign: 'center', marginTop: 20, color: 'red'}}>
              {error}
            </Text>
          ) : categoryFoods.length > 0 ? (
            <FlatList
            // showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
              data={categoryFoods}
              keyExtractor={item => item.food._id}
              renderItem={renderItem}
              contentContainerStyle={{paddingBottom: 20}}
            />
          ) : (
            <Text style={{textAlign: 'center', marginTop: 20, color: 'gray'}}>
              No items found in {categoryName}
            </Text>
          )}
        </View>
   
    </DashboardScreen>
  );
};

export default CatItemScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    marginTop: 20,
  },
  header: {
    fontSize: Theme.fontSizes.smedium,
    fontWeight: '600',
    marginVertical: 10,
    color: '#000',
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
    fontSize: Theme.fontSizes.small,
    fontWeight: '600',
    marginLeft: 5,
    color: '#000',
  },
  price: {
    fontSize: Theme.fontSizes.small,
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
    marginTop: 4,
  },
  ratingText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '600',
  },
  actions: {},
});
