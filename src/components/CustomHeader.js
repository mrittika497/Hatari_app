import React from "react";
import {
  View,
  Text,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  Image,
  SafeAreaView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import LinearGradient from "react-native-linear-gradient";

const CustomHeader = ({
  title = "Dashboard",
  rightComponent,
}) => {
  const navigation = useNavigation();

  return (
    <>
      {/* 🔥 SAME STATUSBAR STYLE LIKE HOMEHEADER */}
      <StatusBar
        translucent={false}
        backgroundColor="#ef2435"
        barStyle="light-content"
      />
      <View
        style={{
          height: StatusBar.currentHeight,
          backgroundColor: "#ef2435",
        }}
      />

      {/* 🔥 SAME GRADIENT + ROUNDED STYLE LIKE HOMEHEADER */}
      <LinearGradient
        colors={["#ef2435", "#fefefc"]}
        style={styles.headerBackground}
      >
        {/* Left Back Button */}
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.iconWrap}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Image
            source={require("../assets/images/left.png")}
            style={styles.icon}
          />
        </TouchableOpacity>

        {/* Title Center */}
        <View style={styles.titleWrapper}>
          <Text style={styles.titleText}>{title}</Text>
        </View>

        {/* Right Component (Logo by default) */}
        <View style={styles.iconWrap}>
          {rightComponent ? (
            rightComponent
          ) : (
            <Image
              source={require("../assets/images/project_logo.png")}
              style={styles.logo}
            />
          )}
        </View>
      </LinearGradient>
    </>
  );
};

export default CustomHeader;

const styles = StyleSheet.create({
  headerBackground: {
    paddingVertical: 25,
    paddingHorizontal: 15,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    // elevation: 10,
    marginBottom: 15,
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
    width: 50,
    height: 35,
    resizeMode: "contain",
  },
});
