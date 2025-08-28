import React, { useState } from 'react';
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
} from 'react-native';
import Theme from '../../assets/theme';

const LoginScreen = ({ navigation }) => {
  const [phone, setPhone] = useState('');

  const handlePhoneChange = (text) => {
    const cleanedText = text.replace(/[^0-9]/g, '');
    setPhone(cleanedText);
    if (cleanedText.length === 10) {
      Keyboard.dismiss();
    }
  };

  const handleSendOtp = () => {
    if (phone.length !== 10) {
      Alert.alert('Invalid number', 'Please enter a valid 10-digit number');
      return;
    }
    // ✅ Navigate to OTP Screen with phone number
    navigation.navigate('OtpScreen', { phone });
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
        >
          {/* Logo */}
          <Image
            source={require('../../assets/images/project_logo.png')}
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
              <Text style={styles.countryCode}>+91</Text>
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
          <TouchableOpacity
            style={[
              styles.button,
              { backgroundColor: phone.length === 10 ? Theme.colors.red : '#ccc' },
            ]}
            onPress={handleSendOtp}
            disabled={phone.length !== 10}
          >
            <Text style={styles.buttonText}>Get OTP</Text>
          </TouchableOpacity>

          {/* Small Footer */}
          <Text style={styles.footerText}>
            By continuing, you agree to our{' '}
            <Text style={styles.link}>Terms & Conditions</Text>
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
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
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  logo: {
    width: 140,
    height: 140,
    marginBottom: 10,
  },
  cuisine: {
    textAlign: 'center',
    fontSize: 14,
    color: Theme.colors.error,
    marginTop: 4,
    fontWeight: '500',
    marginBottom: 40,
    letterSpacing: 0.5,
  },
  heading: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '700',
    color: Theme.colors.text,
    marginBottom: 25,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 25,
  },
  label: {
    fontSize: 14,
    color: Theme.colors.graylightblack,
    marginBottom: 8,
    fontWeight: '500',
  },
  phoneWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Theme.colors.whiteddd,
    backgroundColor: Theme.colors.whitefff,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    elevation: 2, // shadow for Android
    shadowColor: Theme.colors.blackshadow, // shadow for iOS
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  countryCode: {
    fontSize: 16,
    fontWeight: '600',
    marginRight: 10,
    color: '#333',
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: Theme.colors.blackshadow,
  },
  button: {
    width: '100%',
    paddingVertical: 15,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowOpacity: 0.2,
    shadowRadius: 6,
    marginBottom: 15,
  },
  buttonText: {
    textAlign: 'center',
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  footerText: {
    fontSize: 12,
    color: '#888',
    textAlign: 'center',
    marginTop: 10,
  },
  link: {
    color: Theme.colors.red,
    fontWeight: '600',
  },
});
