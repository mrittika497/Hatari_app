// CustomHeader.js
import React from "react";
import {
  View,
  Text,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  Image,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import LinearGradient from "react-native-linear-gradient";

const CustomHeader = ({ title = "Dashboard", rightComponent, onBackPress=null }) => {
  const navigation = useNavigation();

  return (
    <>
      {/* StatusBar */}
      <StatusBar
        translucent={false}
        backgroundColor="#ef2435"
        barStyle="light-content"
      />

      {/* Header */}
      <LinearGradient
        colors={["#ef2435", "#fefefc"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.headerBackground}
      >
        <SafeAreaView edges={["top"]} style={styles.safeArea}>
          {/* Left Back Button */}
          <TouchableOpacity
            onPress={() => {onBackPress && onBackPress(); navigation.goBack()}}
            style={styles.iconWrap}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Image
              source={require("../assets/images/left.png")}
              style={styles.icon}
            />
          </TouchableOpacity>

          {/* Title */}
          <View style={styles.titleWrapper}>
            <Text style={styles.titleText}>{title}</Text>
          </View>

          {/* Right Component */}
          <View style={styles.iconWrap}>
            {rightComponent ? (
              rightComponent
            ) : (
              <Image
                source={require("../assets/images/Cover/logo.png")}
                style={styles.logo}
              />
            )}
          </View>
        </SafeAreaView>
      </LinearGradient>
    </>
  );
};

export default CustomHeader;

const styles = StyleSheet.create({
  headerBackground: {
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    overflow: "hidden",
  },
  safeArea: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    // paddingVertical: Platform.OS === "ios" ? 15 : 25,
    paddingHorizontal: 15,
  },
  iconWrap: {
    padding: 5,
  },
  icon: {
    width: 23,
    height: 23,
    tintColor: "#fff",
    resizeMode: "contain",
  },
  titleWrapper: {
    flex: 1,
    alignItems: "center",
    marginHorizontal: 10,
  },
  titleText: {
    fontSize: 20,
    fontWeight: "700",
    color: "#fff",
  },
  logo: {
    width: 70,
    height: 70,
    resizeMode: "contain",
  },
});
