import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import Ionicons from 'react-native-vector-icons/Ionicons';
import Theme from "../assets/theme";

const OrderSuccessScreen = ({ navigation }) => {

  // Auto-navigate to Home after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.navigate("ItemDetalis");
    }, 3000); // 3000ms = 3 seconds

    // Clear timer if the component unmounts before timeout
    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
        {/* Checkmark */}
        <View style={styles.iconContainer}>
          <Ionicons name="checkmark-circle" size={80} color="#e53935" />
        </View>

        {/* Text */}
        <Text style={styles.congrats}>🎉 Congratulations!</Text>
        <Text style={styles.confirmed}>Order confirmed</Text>

        {/* Back Button
        <TouchableOpacity
          style={styles.homeBtn}
          onPress={() => navigation.navigate("Home")}
        >
          <Text style={styles.homeBtnText}>Back to home</Text>
        </TouchableOpacity> */}
      </View>
    </SafeAreaView>
  );
};

export default OrderSuccessScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#e53935",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 30,
    alignItems: "center",
    width: "90%",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  iconContainer: {
    backgroundColor: "#fdecea",
    borderRadius: 100,
    padding: 30,
    marginBottom: 20,
  },
  congrats: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 5,
    color:Theme.colors.black
  },
  confirmed: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 30,
    color: "#222",
  },
  homeBtn: {
    backgroundColor: "#e53935",
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 30,
  },
  homeBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});
