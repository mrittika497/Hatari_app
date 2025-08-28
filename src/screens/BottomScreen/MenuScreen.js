import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    FlatList,
    SafeAreaView,
    ScrollView,
    TextInput
} from "react-native";
import ShimmerPlaceHolder from "react-native-shimmer-placeholder";
import LinearGradient from "react-native-linear-gradient";
import CustomHeader from "../../components/CustomHeader";
import DashboardScreen from "../../components/DashboardScreen";
import Theme from "../../assets/theme";
import SmallbtnReuseable from "../../components/SmallbtnReuseable";
import { useNavigation } from "@react-navigation/native";

const categories = ["Chinese", "Indian", "Tandoor", "Top Rated"];

const sampleData = [
    {
        id: "1",
        name: "Mixed Hakka Noodles",
        Type: "Veg",
        price: 340,
        rating: 4.2,
        // reviews: "2.1k",
        image:
            "https://www.themealdb.com/images/media/meals/1529444830.jpg",
    },
    {
        id: "2",
        name: "Mixed Fried Rice",
        Type: "Veg",
        price: 370,
        rating: 4.4,
        // reviews: "2.3k",
        image:
            "https://www.themealdb.com/images/media/meals/1529443236.jpg",
    },
    {
        id: "3",
        name: "Chicken Manchurian",
        Type: "Non_Veg",
        price: 220,
        rating: 4.1,
        // reviews: "2.4k",
        image:
            "https://www.themealdb.com/images/media/meals/1529444830.jpg",
    },
    {
        id: "4",
        name: "Chilli Prawn",
        Type: "Veg",
        price: 510,
        rating: 4.6,
        // reviews: "2.7k",
        image:
            "https://www.themealdb.com/images/media/meals/1529443236.jpg",
    },
    {
        id: "5",
        name: "Chilli Prawn",
        Type: "Veg",
        price: 510,
        rating: 4.6,
        // reviews: "2.7k",
        image:
            "https://www.themealdb.com/images/media/meals/1529443236.jpg",
    },
    {
        id: "6",
        name: "Chilli Prawn",
        Type: "Veg",
        price: 510,
        rating: 4.6,
        // reviews: "2.7k",
        image:
            "https://www.themealdb.com/images/media/meals/1529443236.jpg",
    },
];


const MenuScreen = () => {
    const Navigation = useNavigation();
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState("Chinese");
    const [searchText, setSearchText] = useState('');

    const handleSearch = () => {
        if (onSearch) {
            onSearch(searchText);
        }
    };
    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 2000);
        return () => clearTimeout(timer);
    }, []);

    const renderFoodCard = ({ item }) => {

        return (
            <View style={styles.card}>
                {/* Food Image */}
                <Image source={item.image} style={styles.image} />

                {/* Details */}
                <View style={styles.details}>
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <Image source={require("../../assets/images/dineBlack.png")}
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
                        <Text style={styles.ratingText}>{item.reviews}★ {item.rating}</Text>
                    </View>
                </View>

                {/* Right Side Buttons */}
                <View style={styles.actions}>

                    <SmallbtnReuseable />
                </View>
            </View>
        )
    };

    return (
        <>
            <CustomHeader title="Menu" />
            <DashboardScreen >
                <SafeAreaView style={{ backgroundColor: "#fff" }}>


                    {/* Categories */}
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.categoryContainer}
                    >
                        {categories.map((cat) => (
                            <TouchableOpacity
                                key={cat}
                                style={[
                                    styles.categoryButton,
                                    activeCategory === cat && styles.activeCategoryButton,
                                ]}
                                onPress={() => setActiveCategory(cat)}
                            >
                                <Text
                                    style={[
                                        styles.categoryText,
                                        activeCategory === cat && styles.activeCategoryText,
                                    ]}
                                >
                                    {cat}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>

                    <View style={styles.searchContainer}>
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Search for dishes..."
                            placeholderTextColor="#888"
                            value={searchText}
                            onChangeText={setSearchText}
                        />
                        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
                            <Image
                                source={require('../../assets/images/search.png')}
                                style={styles.searchIcon}
                            />
                        </TouchableOpacity>
                    </View>

                    {/* Best Selling */}
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Best Selling {activeCategory}</Text>

                    </View>

                    {/* Shimmer or Data */}
                    {loading ? (
                        <View >
                            {[1, 2, 3, 4].map((_, index) => (
                                <View style={styles.shimmerRow} key={index}>
                                    <ShimmerPlaceHolder
                                        LinearGradient={LinearGradient}
                                        style={styles.shimmerImage}
                                    />
                                    <View style={{ flex: 1, marginLeft: 10 }}>
                                        <ShimmerPlaceHolder
                                            LinearGradient={LinearGradient}
                                            style={styles.shimmerText}
                                        />
                                        <ShimmerPlaceHolder
                                            LinearGradient={LinearGradient}
                                            style={[styles.shimmerText, { width: 80 }]}
                                        />
                                    </View>
                                </View>
                            ))}
                        </View>
                    ) : (
                        <FlatList
                            data={sampleData}
                            keyExtractor={(item) => item.id}
                            renderItem={renderFoodCard}
                            contentContainerStyle={{ paddingBottom: 60 }}

                        />
                    )}
                </SafeAreaView>
            </DashboardScreen>
        </>
    );
};

export default MenuScreen;

const styles = StyleSheet.create({
    categoryContainer: {
        paddingHorizontal: 10,
        paddingVertical: 10,
    },
    categoryButton: {
        borderWidth: 1,
        borderColor: "#ccc",
        paddingHorizontal: 15,
        // paddingVertical: 8,
        borderRadius: 20,
        marginRight: 10,
        height: 30,
        justifyContent: "center",
        marginVertical: 20
    },
    activeCategoryButton: {
        backgroundColor: "#ff4d4d",
        borderColor: "#ff4d4d",
    },
    categoryText: {
        color: "#333",
        fontWeight: "500",
    },
    activeCategoryText: {
        color: "#fff",
    },
    sectionHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginVertical: 30
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: "700",
        color: "#000",
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
    shimmerRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 15,
    },
    shimmerImage: {
        width: 70,
        height: 70,
        borderRadius: 8,
    },
    shimmerText: {
        height: 12,
        borderRadius: 4,
        marginBottom: 8,
        width: 150,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 25,
        paddingHorizontal: 15,
        elevation: 3,
        marginTop: 10,
        height: 50
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        color: '#333'
    },
    searchButton: {
        paddingLeft: 10
    },
    searchIcon: {
        width: 20,
        height: 20,
        tintColor: '#000'
    }
});
