import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from "react-native";
import DashboardScreen from "../../components/DashboardScreen";
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from "react-native-confirmation-code-field";
import Theme from "../../assets/theme";
import ReusableBtn from "../../components/ReuseableBtn";

const CELL_COUNT = 6;

const OtpScreen = ({ navigation }) => {
  const [value, setValue] = useState("");

  const ref = useBlurOnFulfill({ value, cellCount: CELL_COUNT });
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });

  const handleVerify = () => {
    if (value.length === 6) {
      navigation.navigate("ExperienceScreen");
    } else {
      alert("Please enter 6-digit OTP");
    }
  };

  const handleResend = () => {
    alert("Resending OTP...");
  };

  const isButtonActive = value.length === CELL_COUNT;

  return (
    <DashboardScreen>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        {/* Logo */}
        <Image
          source={require("../../assets/images/project_logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.tagline}>Chinese • Indian • Tandoor</Text>

        {/* Instruction */}
        <Text style={styles.instruction}>Enter 6 digit OTP</Text>

        {/* OTP Input */}
        <CodeField
          ref={ref}
          {...props}
          value={value}
          onChangeText={setValue}
          cellCount={CELL_COUNT}
          rootStyle={styles.codeFieldRoot}
          keyboardType="number-pad"
          textContentType="oneTimeCode"
          renderCell={({ index, symbol, isFocused }) => (
            <View
              key={index}
              style={[styles.cell, isFocused && styles.focusCell]}
              onLayout={getCellOnLayoutHandler(index)}
            >
              <Text style={styles.cellText}>
                {symbol || (isFocused ? <Cursor /> : null)}
              </Text>
            </View>
          )}
        />

        {/* Verify Button */}
        {/* <TouchableOpacity
          style={[styles.verifyBtn, !isButtonActive && styles.verifyBtnDisabled]}
          onPress={handleVerify}
          disabled={!isButtonActive}
        >
          <Text
            style={[
              styles.verifyText,
              !isButtonActive && styles.verifyTextDisabled,
            ]}
          >
            Verify
          </Text>
        </TouchableOpacity> */}
        <ReusableBtn title="Verify"
          style={[styles.verifyBtn, !isButtonActive && styles.verifyBtnDisabled]}
          onPress={handleVerify}
          disabled={!isButtonActive}
        />

        {/* Resend Text */}
        <Text style={styles.resendText}>
          Having any issue?
          <Text style={styles.resendLink} onPress={handleResend}>
            {" "}
            Send again
          </Text>
        </Text>
      </KeyboardAvoidingView>
    </DashboardScreen>
  );
};

export default OtpScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 10,
  },
  tagline: {
    fontSize: 14,
    color: Theme.colors.red,
    marginBottom: 20,
    fontWeight: "500",
  },
  instruction: {
    fontSize: 16,
    marginBottom: 20,
    color: Theme.colors.black,
    fontWeight: "500",
  },
  codeFieldRoot: {
    marginBottom: 30,
    flexDirection: "row",
    justifyContent: "center",
  },
  cell: {
    width: 45,
    height: 50,
    lineHeight: 48,
    fontSize: 24,
    borderWidth: 1,
    borderColor: Theme.colors.red,
    borderRadius: 8,
    marginHorizontal: 5,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Theme.colors.white,
  },
  cellText: {
    fontSize: 22,
    color: "#333",
  },
  focusCell: {
    borderColor: Theme.colors.red,
  },
  verifyBtn: {
    width: "100%",
    paddingVertical: 14,
    backgroundColor: Theme.colors.red,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 15,
  },
  verifyBtnDisabled: {
    backgroundColor: "#ccc",
  },
  verifyText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
  },
  verifyTextDisabled: {
    color: "#666",
  },
  resendText: {
    fontSize: 14,
    color: Theme.colors.black,
    marginTop: 15,
  },
  resendLink: {
    color: Theme.colors.red,
    fontWeight: "bold",
  },
});
