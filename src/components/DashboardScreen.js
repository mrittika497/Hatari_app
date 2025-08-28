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

const DashboardScreen = ({
  onNavigate,
  children,
  scrollable = true,
  style = {},
  contentStyle = {},
  statusBarColor = "#fff",
  barStyle = "dark-content",
  showNavigateButton = false, // ✅ Fixed default value
}) => {
  const Wrapper = scrollable ? ScrollView : View;
  const navigation = useNavigation();

  return (
    <SafeAreaView style={[styles.safeArea, style]}>
      <StatusBar backgroundColor={statusBarColor} barStyle={barStyle} />
      <Wrapper
        contentContainerStyle={scrollable ? [styles.wrapper, contentStyle] : null}
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
    paddingHorizontal: 20,
  },
  wrapper: {
    flexGrow: 1,
  },
});
