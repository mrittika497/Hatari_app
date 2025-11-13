import React from "react";
import {
  View,
  Text,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  Image,
  Platform,
  SafeAreaView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import LinearGradient from "react-native-linear-gradient";

const CustomHeader = ({
  title = "Dashboard",
  gradientColors = ['#f0e7e7ff', '#f42648ff'],// Swiggy-style orange gradient
  onLeftPress,
  rightComponent,
  textColor = "#fff", // Default white text on gradient
}) => {
  const navigation = useNavigation();

  const handleGoBack = () => {
    if (onLeftPress) onLeftPress();
    else navigation.goBack();
  };

  return (
    <>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />
      <SafeAreaView style={{ backgroundColor: gradientColors[0] }}>
        <LinearGradient
          colors={gradientColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradientHeader}
        >
          {/* Left Button */}
          <TouchableOpacity
            onPress={handleGoBack}
            style={styles.iconButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Image
              source={require("../assets/images/left.png")}
              style={[styles.iconImage, { tintColor: textColor }]}
            />
          </TouchableOpacity>

          {/* Title */}
          <View style={styles.titleContainer}>
            <Text style={[styles.title, { color: textColor }]}>{title}</Text>
          </View>

          {/* Right Component or Logo */}
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
        </LinearGradient>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  gradientHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginTop: Platform.OS === "ios" ? 0 : 25,
    // borderBottomLeftRadius: 20,
    // borderBottomRightRadius: 20,
    // shadowColor: "#FF6B00",
    // shadowOpacity: 0.3,
    // shadowOffset: { width: 0, height: 3 },
    // shadowRadius: 5,
    // elevation: 6,
      paddingVertical: 15,
    paddingHorizontal: 10,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    elevation: 8,
   
  },
  titleContainer: {
    flex: 1,
    alignItems: "center",
    marginHorizontal: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  iconButton: {
    padding: 8,
  },
  iconImage: {
    width: 24,
    height: 24,
    resizeMode: "contain",
  },
  logoImage: {
    width: 55,
    height: 35,
    resizeMode: "contain",
  },
});

export default CustomHeader;
