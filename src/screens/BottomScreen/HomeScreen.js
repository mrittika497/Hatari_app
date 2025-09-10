import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  FlatList,
} from 'react-native';
import SectionDivider from '../../components/SectionDivider';
import DashboardScreen from '../../components/DashboardScreen';
import ShimmerPlaceholder from 'react-native-shimmer-placeholder';
// import { useNavigation } from '@react-navigation/native';
import SmallbtnReuseable from '../../components/SmallbtnReuseable';
import { useNavigation } from '@react-navigation/native';

const HomeScreen = ({navigation}) => {
  // const navigation = useNavigation();
  const [selectedExperience, setSelectedExperience] = useState('Delivery');
  const [loading, setLoading] = useState(true);
  const [selectedOutlet, setSelectedOutlet] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  const outlets = [
    'Hatari (Barisha)',
    'Hatari (Salt Lake)',
    'Hatari (Park Street)',
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000); // Simulate API load
    return () => clearTimeout(timer);
  }, []);

  const experiences = [
    {
      id: 1,
      title: 'Delivery',
      img: require('../../assets/images/deliveryH.png'),
    },
    {
      id: 2,
      title: 'Dine in',
      img: require('../../assets/images/dineH.png'),
      redirection: 'DineSection',
    },
    {
      id: 3,
      title: 'Takeaway',
      img: require('../../assets/images/takeawayH.png'),
    },
  ];

  const categories = [
    {
      id: 1,
      name: 'Chicken',
      img: require('../../assets/images/remove/Chicken.png'),
    },
    {
      id: 2,
      name: 'Fish',
      img: require('../../assets/images/remove/Chicken.png'),
    },
    {
      id: 3,
      name: 'Mutton',
      img: require('../../assets/images/remove/Chicken.png'),
    },
    {
      id: 4,
      name: 'Prawns',
      img: require('../../assets/images/remove/Chicken.png'),
    },
  ];

  const topPicks = [
    {
      id: 1,
      name: 'Bhetki Fish Fry (4pcs)',
      price: '₹210 for one',
      rating: 4.6,
      tag: 'Indian',
      type: 'Non Veg',
    },
    {
      id: 2,
      name: 'Chicken Biriyani',
      price: '₹180 for one',
      rating: 4.4,
      tag: 'Indian',
      type: 'Non Veg',
    },
    {
      id: 3,
      name: 'Chicken Biriyani',
      price: '₹180 for one',
      rating: 4.4,
      tag: 'Indian',
      type: 'veg',
    },
  ];

  const banners = [
    require('../../assets/images/remove/banner.png'),
    require('../../assets/images/remove/banner.png'),
    require('../../assets/images/remove/banner.png'),
  ];

  return (
    <DashboardScreen scrollable={false}>
      {/* Header */}
      <View style={styles.header}>
        <View style={{flexDirection: 'row', width: '60%'}}>
          <Image
            source={require('../../assets/images/location.png')}
            style={styles.logo}
          />
          <Text style={styles.locationText}>{selectedOutlet}</Text>
          {/* <TouchableOpacity> 
        <Image source={require("../../assets/images/downarrow.png")} style={[styles.logo,{alignItems:"center"}]}/>
        </TouchableOpacity> */}

          {/* Dropdown button */}
          <TouchableOpacity onPress={() => setShowDropdown(!showDropdown)}>
            <Image
              source={require('../../assets/images/downarrow.png')} // Your arrow icon
              style={styles.arrowIcon}
            />
          </TouchableOpacity>
        </View>
        <Image
          source={require('../../assets/images/project_logo.png')}
          style={styles.projectLogo}
        />
      </View>

      {/* Dropdown list */}
      {showDropdown && (
        <View style={styles.dropdownList}>
          <ScrollView>
            {outlets.map((outlet, index) => (
              <TouchableOpacity
                key={index}
                style={styles.dropdownItem}
                onPress={() => {
                  setSelectedOutlet(outlet);
                  setShowDropdown(false);
                }}>
                <Text style={styles.dropdownItemText}>{outlet}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBox}>
            <Image
              source={require('../../assets/images/search.png')}
              style={styles.searchIcon}
            />
            <TextInput
              placeholder="Search your favourite food!"
              style={styles.searchInput}
              placeholderTextColor="#999"
            />
          </View>
          <TouchableOpacity style={styles.cartBtn}>
            <Image
              source={require('../../assets/images/cart.png')}
              style={styles.cartIcon}
            />
            <View style={styles.cartBadge}>
              <Text style={styles.cartCount}>0</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Experiences */}
        <View style={styles.experienceContainer}>
          {experiences.map(item => (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.experienceCard,
                selectedExperience === item.title && styles.activeExperience,
              ]}
              onPress={() => {
                setSelectedExperience(item.title),
                  navigation.navigate(item?.redirection);
              }}>
              <Image source={item.img} style={styles.experienceImg} />
              <Text
                style={[
                  styles.experienceText,
                  selectedExperience === item.title && {color: '#fff'},
                ]}>
                {item.title}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Banner Section with Shimmer */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.bannerScroll}>
          {loading
            ? [1, 2, 3].map(i => (
                <ShimmerPlaceholder
                  key={i}
                  style={{
                    width: 300,
                    height: 130,
                    borderRadius: 10,
                    marginRight: 10,
                  }}
                />
              ))
            : banners.map((banner, index) => (
                <Image
                  key={index}
                  source={banner}
                  style={styles.bannerImage}
                  resizeMode="cover"
                />
              ))}
        </ScrollView>

        {/* Categories */}
        <SectionDivider title="Choose what you like" />
        {loading ? (
          <View style={{flexDirection: 'row', paddingVertical: 10}}>
            {[1, 2, 3, 4].map(i => (
              <ShimmerPlaceholder
                key={i}
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: 40,
                  marginRight: 15,
                }}
              />
            ))}
          </View>
        ) : (
          <FlatList
            horizontal
            data={categories}
            showsHorizontalScrollIndicator={false}
            keyExtractor={item => item.id.toString()}
            contentContainerStyle={{paddingVertical: 10}}
            renderItem={({item}) => (
              <TouchableOpacity
                style={styles.categoryCard}
                onPress={() => {
                  navigation.navigate('CatItemScreen');
                }}>
                <Image source={item.img} style={styles.categoryImage} />
                <Text style={styles.categoryText}>{item.name}</Text>
              </TouchableOpacity>
            )}
          />
        )}

        {/* Top Picks */}
        <SectionDivider
          title="Top Picks"
          containerStyle={{marginVertical: 10}}
        />
        {loading
          ? [1, 2].map(i => (
              <View key={i} style={[styles.foodCard, {alignItems: 'center'}]}>
                <ShimmerPlaceholder
                  style={{width: 80, height: 80, borderRadius: 10}}
                />
                <View style={{flex: 1, marginLeft: 10}}>
                  <ShimmerPlaceholder
                    style={{width: '60%', height: 12, marginBottom: 8}}
                  />
                  <ShimmerPlaceholder
                    style={{width: '40%', height: 12, marginBottom: 8}}
                  />
                  <ShimmerPlaceholder style={{width: '30%', height: 12}} />
                </View>
              </View>
            ))
          : topPicks.map(item => (
              <View style={styles.card}>
                {/* Food Image */}
                <Image source={item.image} style={styles.image} />

                {/* Details */}
                <View style={styles.details}>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Image
                      source={require('../../assets/images/dineBlack.png')}
                      style={{width: 12, height: 12}}
                    />
                    <Text
                      style={{
                        marginLeft: 10,
                        color: 'black',
                        fontSize: 13,
                        fontWeight: '500',
                      }}>
                      Indian
                    </Text>
                  </View>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    {/* Veg / Non-Veg Icon */}
                    <View
                      style={[
                        styles.typeIndicator,
                        {borderColor: item.type === 'veg' ? 'green' : 'red'},
                      ]}>
                      <View
                        style={[
                          styles.typeDot,
                          {
                            backgroundColor:
                              item.type === 'veg' ? 'green' : 'red',
                          },
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
                  <SmallbtnReuseable
                    onPress={() => {
                      navigation.navigate('FoodDetailScreen');
                    }}
                  />
                </View>
              </View>
            ))}
      </ScrollView>
    </DashboardScreen>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#fff'},
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    // marginBottom: 10,
    marginVertical: 15,
  },
  locationText: {fontSize: 14, fontWeight: '500', flex: 1, marginLeft: 5},
  logo: {width: 20, height: 20, resizeMode: 'contain'},
  projectLogo: {width: 50, height: 50, resizeMode: 'contain'},

  searchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 20,
  },
  searchBox: {
    height: 46,
    width: '75%',
    borderWidth: 1,
    borderRadius: 17,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    borderColor: '#ccc',
  },
  searchIcon: {width: 18, height: 18, marginRight: 8, tintColor: '#999'},
  searchInput: {flex: 1, fontSize: 14},
  cartBtn: {
    position: 'relative',
    height: 46,
    width: 60,
    borderWidth: 1,
    borderRadius: 17,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#ccc',
  },
  cartIcon: {width: 22, height: 22},
  cartBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: 'red',
    borderRadius: 8,
    paddingHorizontal: 5,
  },
  cartCount: {color: '#fff', fontSize: 10},

  experienceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
  },
  experienceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginHorizontal: 5,
  },
  activeExperience: {backgroundColor: '#e63946', borderColor: '#e63946'},
  experienceText: {marginLeft: 6, fontSize: 14},
  experienceImg: {width: 20, height: 20, resizeMode: 'contain'},

  bannerScroll: {marginTop: 20},
  bannerImage: {
    width: 300,
    height: 130,
    borderRadius: 10,
    marginRight: 10,
    marginBottom: 15,
  },

  categoryCard: {alignItems: 'center', marginRight: 15},
  categoryImage: {
    width: 80,
    height: 80,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: '#eee',
  },
  categoryText: {marginTop: 5, fontSize: 14, fontWeight: '500'},

  foodCard: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 4,
  },
  foodImage: {width: 80, height: 80, borderRadius: 10},
  foodDetails: {flex: 1, marginLeft: 10},
  foodType: {fontSize: 12, color: '#555', marginLeft: 5},
  foodName: {fontSize: 14, fontWeight: '600', marginVertical: 4},
  foodPrice: {fontSize: 12, color: '#333'},
  foodTag: {fontSize: 12, color: 'red', marginTop: 4},
  foodRight: {justifyContent: 'space-between', alignItems: 'flex-end'},
  ratingBox: {
    backgroundColor: '#d4edda',
    borderRadius: 5,
    paddingHorizontal: 6,
    paddingVertical: 3,
  },
  ratingText: {fontSize: 12, color: '#155724'},
  addBtn: {
    backgroundColor: '#e63946',
    paddingHorizontal: 15,
    paddingVertical: 6,
    borderRadius: 8,
    marginTop: 10,
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
  label: {fontSize: 14, marginBottom: 8, color: '#444'},
  dropdownBtn: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 12,
    paddingHorizontal: 16,
    backgroundColor: '#f9f9f9',
  },
  dropdownText: {fontSize: 16, color: '#444'},
  arrowIcon: {width: 20, height: 20, resizeMode: 'contain'},
  dropdownList: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 12,
    marginTop: 4,
    backgroundColor: '#fff',
    maxHeight: 150,
  },
  dropdownItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  dropdownItemText: {fontSize: 16, color: '#444'},
});

export default HomeScreen;
