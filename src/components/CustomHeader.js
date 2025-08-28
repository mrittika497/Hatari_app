import React from "react";
import {
  View,
  Text,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  Image,
  Platform,
  SafeAreaView
} from "react-native";
import { useNavigation } from "@react-navigation/native";

const CustomHeader = ({
  title = "Dashboard",
  statusBarColor = "#fff",
  onLeftPress,
  rightComponent
}) => {
  const navigation = useNavigation();

  const handleGoBack = () => {
    if (onLeftPress) {
      onLeftPress(); // Custom action if passed
    } else {
      navigation.goBack(); // Default back navigation
    }
  };

  return (
    <>
      <StatusBar
        backgroundColor={statusBarColor}
        barStyle={statusBarColor === "#fff" ? "dark-content" : "light-content"}
      />

      <SafeAreaView style={{ backgroundColor: statusBarColor }}>
        <View style={[styles.header, { backgroundColor: statusBarColor }]}>

          {/* Left Button */}
          <TouchableOpacity
            onPress={handleGoBack}
            style={styles.iconButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Image
              source={require("../assets/images/left.png")}
              style={[styles.iconImage, { tintColor: "black" }]}
            />
          </TouchableOpacity>

          {/* Title */}
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{title}</Text>
          </View>

          {/* Right Component */}
          <View style={styles.iconButton}>
            {rightComponent ? (
              rightComponent
            ) : (
              <Image
                source={require("../assets/images/project_logo.png")}
                style={styles.logoImage}
              />
            )}
          </View>
        </View>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    // paddingHorizontal: 12,
    marginTop:20,
    paddingVertical: 12,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOpacity: 0.12,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 3,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  titleContainer: {
    flex: 1,
    alignItems: "center",
    marginHorizontal: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "black",
    letterSpacing: 0.5,
  },
  iconButton: {
    padding: 5,
  },
  iconImage: {
    width: 24,
    height: 24,
    resizeMode: "contain",
  },
  logoImage: {
    width: 60,
    height: 40,
    resizeMode: "contain",
  }
});

export default CustomHeader;
