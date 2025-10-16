import React, { useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Keyboard,
  Alert,
  ScrollView,
  ToastAndroid,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Theme from "../../assets/theme";
import { useDispatch, useSelector } from "react-redux";
import { sendOtp } from "../../redux/slice/authSlice";
import { useNavigation } from "@react-navigation/native";
import ReusableBtn from "../../components/ReuseableBtn";

const LoginScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [phone, setPhone] = useState("");
  const { loading } = useSelector((state) => state.auth);

  const handlePhoneChange = (text) => {
    const cleanedText = text.replace(/[^0-9]/g, "");
    setPhone(cleanedText);
    if (cleanedText.length === 10) {
      Keyboard.dismiss();
    }
  };

  const handleSendOtp = () => {
    if (phone.length !== 10) {
      Alert.alert("Invalid number", "Please enter a valid 10-digit number");
      return;
    }

    dispatch(sendOtp(phone)).then((res) => {
      if (res.meta.requestStatus === "fulfilled") {
        Platform.OS === "android"
          ? ToastAndroid.show("OTP sent successfully ✅", ToastAndroid.SHORT)
          : Alert.alert("Success", "OTP sent successfully ✅");

        navigation.navigate("OtpScreen", { phone });
      } else {
        const errMsg =
          res.payload?.message || "Failed to send OTP. Please try again.";
        Platform.OS === "android"
          ? ToastAndroid.show(errMsg, ToastAndroid.LONG)
          : Alert.alert("Error", errMsg);
      }
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
        >
          {/* Logo */}
          <Image
            source={require("../../assets/images/project_logo.png")}
            style={styles.logo}
            resizeMode="contain"
          />

          {/* Subtitle */}
          <Text style={styles.cuisine}>Chinese • Indian • Tandoor</Text>

          {/* Heading */}
          <Text style={styles.heading}>Login to Your Account</Text>

          {/* Phone Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Enter phone number</Text>
            <View style={styles.phoneWrapper}>
              <View style={styles.countryCodeBox}>
                <Text style={styles.countryCode}>+91</Text>
              </View>
              <TextInput
                style={styles.input}
                placeholder="12345 67890"
                placeholderTextColor="#999"
                keyboardType="number-pad"
                maxLength={10}
                value={phone}
                onChangeText={handlePhoneChange}
              />
            </View>
          </View>

          {/* Get OTP Button */}
     

<ReusableBtn
  title={loading ? "Sending..." : "Get OTP"}
  style={{
    backgroundColor: phone.length === 10 ? '#FF3B30' : '#ccc', // active red or disabled gray
    opacity: loading ? 0.8 : 1, // optional slight dim while loading
  }}
  onPress={handleSendOtp}
  disabled={phone.length !== 10 || loading}
/>




          {/* Small Footer */}
          <Text style={styles.footerText}>
            By continuing, you agree to our{" "}
            <Text style={styles.link}>Terms & Conditions</Text>
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.background,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  logo: {
    width: 140,
    height: 140,
    marginBottom: 10,
  },
  cuisine: {
    textAlign: "center",
    fontSize: 14,
    color: Theme.colors.error,
    marginTop: 4,
    fontWeight: "500",
    marginBottom: 40,
    letterSpacing: 0.5,
  },
  heading: {
    textAlign: "center",
    fontSize: 22,
    fontWeight: "700",
    color: Theme.colors.text,
    marginBottom: 25,
  },
  inputContainer: {
    width: "100%",
    marginBottom: 25,
  },
  label: {
    fontSize: 14,
    color: Theme.colors.graylightblack,
    marginBottom: 8,
    fontWeight: "500",
  },
  phoneWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: Theme.colors.whiteddd,
    backgroundColor: Theme.colors.whitefff,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 10,
    elevation: 2,
    shadowColor: Theme.colors.blackshadow,
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  countryCodeBox: {
    backgroundColor: "#F5F5F5",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    marginRight: 8,
  },
  countryCode: {
    fontSize: 16,
    fontWeight: "600",
    color: Theme.colors.blackshadow,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: Theme.colors.blackshadow,
  },
  button: {
    width: "100%",
    paddingVertical: 15,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Theme.colors.red,
    elevation: 3,
    shadowOpacity: 0.15,
    shadowRadius: 6,
    marginBottom: 15,
  },
  buttonText: {
    textAlign: "center",
    color: "#fff",
    fontSize: 17,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  footerText: {
    fontSize: 12,
    color: "#888",
    textAlign: "center",
    marginTop: 10,
  },
  link: {
    color: Theme.colors.red,
    fontWeight: "600",
  },
});
