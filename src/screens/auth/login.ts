import React, { useState, useRef, useEffect } from "react";
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
  Animated,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import { sendOtp } from "../../redux/slice/authSlice";
import { useNavigation } from "@react-navigation/native";
import LinearGradient from "react-native-linear-gradient";
import Theme from "../../assets/theme";
import ReusableBtn from "../../components/ReuseableBtn";
import DashboardScreen from "../../components/DashboardScreen";

const { width } = Dimensions.get("window");

const LoginScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [phone, setPhone] = useState("");
  const { loading } = useSelector((state) => state.auth);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        bounciness: 12,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handlePhoneChange = (text) => {
    const cleanedText = text.replace(/[^0-9]/g, "");
    setPhone(cleanedText);
    if (cleanedText.length === 10) Keyboard.dismiss();
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
   
    <View style={styles.container}>
      
      <LinearGradient
        colors={["#ff3d3d", "#ff5c5c", "#fff"]}
        style={styles.backgroundGradient}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={{ flex: 1 }}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContainer}
            keyboardShouldPersistTaps="handled"
          >
            {/* Animated Logo */}
            <Animated.View
              style={{
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
                alignItems: "center",
              }}
            >
              <Image
                source={require("../../assets/images/project_logo.png")}
                style={styles.logo}
                resizeMode="contain"
              />
              <Text style={styles.cuisine}>Chinese • Indian • Tandoor</Text>
            </Animated.View>

            {/* Login Card */}
            <Animated.View
              style={[
                styles.loginCard,
                {
                  opacity: fadeAnim,
                  transform: [{ translateY: slideAnim }],
                },
              ]}
            >
              <Text style={styles.heading}>Login to Continue</Text>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Phone Number</Text>
                <View style={styles.phoneWrapper}>
                  <View style={styles.countryCodeBox}>
                    <Text style={styles.countryCode}>+91</Text>
                  </View>
                  <TextInput
                    style={styles.input}
                    placeholder="12345 67890"
                    placeholderTextColor="#aaa"
                    keyboardType="number-pad"
                    maxLength={10}
                    value={phone}
                    onChangeText={handlePhoneChange}
                  />
                </View>
              </View>

              {/* OTP Button */}
              <TouchableOpacity
                activeOpacity={0.9}
                disabled={phone.length !== 10 || loading}
                onPress={handleSendOtp}
              >
                <LinearGradient
                  colors={
                    phone.length === 10
                      ? ["#ff3b30", "#ff6659"]
                      : ["#cccccc", "#cccccc"]
                  }
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={[
                    styles.otpButton,
                    { opacity: loading ? 0.8 : 1 },
                  ]}
                >
                  <Text style={styles.otpText}>
                    {loading ? "Sending..." : "Get OTP"}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>

              {/* Footer */}
              <Text style={styles.footerText}>
                By continuing, you agree to our{" "}
                <Text style={styles.link}>Terms & Conditions</Text>
              </Text>
            </Animated.View>
          </ScrollView>
        </KeyboardAvoidingView>
      </LinearGradient>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  backgroundGradient: { flex: 1 },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  logo: {
    width: width * 0.6,
    height: width * 0.6,
    marginBottom: 5,
  },
  cuisine: {
    fontSize: 15,
    color: "#fff",
    fontWeight: "500",
    letterSpacing: 1,
    marginBottom: 40,
  },
  loginCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
  },
  heading: {
    fontSize: 22,
    fontWeight: "700",
    color: "#222",
    textAlign: "center",
    marginBottom: 25,
  },
  inputContainer: { marginBottom: 25 },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#555",
    marginBottom: 8,
  },
  phoneWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 10,
    backgroundColor: "#fafafa",
  },
  countryCodeBox: {
    backgroundColor: "#f2f2f2",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    marginRight: 8,
  },
  countryCode: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  input: { flex: 1, fontSize: 16, color: "#000" },
  otpButton: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  otpText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
    letterSpacing: 0.5,
  },
  footerText: {
    textAlign: "center",
    color: "#666",
    fontSize: 12,
    marginTop: 20,
  },
  link: {
    color: "#ff3b30",
    fontWeight: "600",
  },
});