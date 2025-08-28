import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions
} from 'react-native';
import DashboardScreen from '../components/DashboardScreen';
import CustomHeader from '../components/CustomHeader';
import SmallbtnReuseable from '../components/SmallbtnReuseable';

const { width } = Dimensions.get('window');

const items = [
  {
    id: '1',
    name: 'Chicken Biriyani',
    price: 280,
    rating: 4.5,
    reviews: '2.8k',
    type: 'non-veg',
    image: require('../assets/images/remove/Chicken.png'),
  },
  {
    id: '2',
    name: 'Chicken Kadai',
    price: 370,
    rating: 4.3,
    reviews: '2.3k',
    type: 'non-veg',
    image: require('../assets/images/remove/Chicken.png'),
  },
  {
    id: '3',
    name: 'Butter Chicken',
    price: 250,
    rating: 4.4,
    reviews: '2.2k',
    type: 'non-veg',
      image: require('../assets/images/remove/Chicken.png'),
  },
  {
    id: '4',
    name: 'Chicken Rezala',
    price: 250,
    rating: 4.4,
    reviews: '2.0k',
    type: 'non-veg',
    image: require('../assets/images/remove/Chicken.png'),
  },
];

const CatItemScreen = () => {
  const renderItem = ({ item }) => (
    <View style={styles.card}>
      {/* Food Image */}
      <Image source={item.image} style={styles.image} />

      {/* Details */}
      <View style={styles.details}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
                                <Image source={require("../assets/images/dineBlack.png")}
                                    style={{ width: 12, height: 12 }}
                                />
                                <Text style={{ marginLeft: 10, color: "black", fontSize: 13, fontWeight: "500" }}>Indian</Text>
                            </View>
        
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          {/* Veg / Non-Veg Icon */}
          <View
            style={[
              styles.typeIndicator,
              { borderColor: item.type === 'veg' ? 'green' : 'red' },
            ]}
          >
            <View
              style={[
                styles.typeDot,
                { backgroundColor: item.type === 'veg' ? 'green' : 'red' },
              ]}
            />
          </View>
          <Text style={styles.name}>{item.name}</Text>
        </View>

        <Text style={styles.price}>₹{item.price}</Text>

        {/* Rating */}
        <View style={styles.ratingWrapper}>
          <Text style={styles.ratingText}>★ {item.rating}</Text>
        </View>
      </View>

      {/* Right Side Buttons */}
      <View style={styles.actions}>
       
        <SmallbtnReuseable/>
      </View>
    </View>
  );

  return (
    <DashboardScreen> 
      <CustomHeader/>
    <View style={styles.container}>
      <Text style={styles.header}>Chicken items</Text>
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
    </DashboardScreen>
  );
};

export default CatItemScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    marginTop:20
  },
  header: {
    fontSize: 16,
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
    shadowOffset: { width: 0, height: 2 },
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
  actions: {
    // alignItems: 'center',
    // justifyContent: 'space-between',
    // height: 80,
    // marginLeft: 10,
  },
  heartIcon: {
    width: 18,
    height: 18,
    tintColor: 'red',
  },
  
});
