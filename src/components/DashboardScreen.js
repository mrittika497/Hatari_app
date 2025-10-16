import { useNavigation } from "@react-navigation/native";
import React from "react";
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  View,
} from "react-native";
import ReusableBtn from "./ReuseableBtn";
import {
  responsiveWidth,
  responsiveHeight,
} from "react-native-responsive-dimensions";

const DashboardScreen = ({
  onNavigate,
  children,
  scrollable = true,
  style = {},
  contentStyle = {},
  statusBarColor = "#fff",
  barStyle = "dark-content",
  showNavigateButton = false,
}) => {
  const Wrapper = scrollable ? ScrollView : View;
  const navigation = useNavigation();

  return (
    <SafeAreaView style={[styles.safeArea, style]}>
      <StatusBar backgroundColor={statusBarColor} barStyle={barStyle} />
      <Wrapper
        contentContainerStyle={
          scrollable ? [styles.wrapper, contentStyle] : null
        }
        style={!scrollable ? [styles.wrapper, contentStyle] : null}
      >
        {children}

        {onNavigate && showNavigateButton && (
          <ReusableBtn
            title="Go"
            onPress={() => navigation.navigate(onNavigate)}
          />
        )}
      </Wrapper>
    </SafeAreaView>
  );
};

export default DashboardScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: responsiveWidth(5), // ~5% of screen width
  },
  wrapper: {
    flexGrow: 1,
    marginVertical: responsiveHeight(2), // ~2% of screen height
  },
});
