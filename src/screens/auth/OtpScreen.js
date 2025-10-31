import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ToastAndroid,
  ScrollView,
  Animated,
  Easing,
  Dimensions,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';
import LinearGradient from 'react-native-linear-gradient';
import { sendOtp, verifyOtp, setAuth } from '../../redux/slice/authSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Theme from '../../assets/theme';

const CELL_COUNT = 6;
const { width } = Dimensions.get('window');
const CELL_WIDTH = Math.min(60, (width - 80) / 8);

const OtpScreen = ({ route, navigation }) => {
  const phone = route?.params?.phone;
  const dispatch = useDispatch();
  const { token, user } = useSelector(state => state.auth);

  const [value, setValue] = useState('');
  const ref = useBlurOnFulfill({ value, cellCount: CELL_COUNT });
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const bounceAnim = useRef(new Animated.Value(0)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(bounceAnim, {
        toValue: 1,
        friction: 6,
        tension: 70,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  useEffect(() => {
    if (token && user) {
      navigation.reset({
        index: 0,
        routes: [{ name: 'ExperienceScreen', params: { token, user } }],
      });
    }
  }, [token, user]);


     useEffect(() => {
    const storeUserId = async () => {
      if (user?._id) {
        try {
          await AsyncStorage.setItem('userId', user._id);
          console.log('✅ User ID saved:', user._id);
        } catch (error) {
          console.log('❌ Error saving user ID:', error);
        }
      }
    };

    storeUserId();
  }, [user]);

  const handleVerify = () => {
    if (value.length !== CELL_COUNT) {
      Alert.alert('Invalid OTP', 'Please enter a valid 6-digit OTP');
      return;
    }

    dispatch(verifyOtp({ phone, value })).then(async res => {
      if (res.meta.requestStatus === 'fulfilled') {
        const { token, user } = res.payload;

        await AsyncStorage.setItem('userToken', token);
        await AsyncStorage.setItem('userData', JSON.stringify(user));
        dispatch(setAuth({ token, user }));

        navigation.reset({
          index: 0,
          routes: [{ name: 'ExperienceScreen' }],
        });
      }
    });
  };

  const handleResend = () => {
    dispatch(sendOtp(phone)).then(res => {
      if (res.meta.requestStatus === 'fulfilled') {
        Platform.OS === 'android'
          ? ToastAndroid.show('OTP Resent ✅', ToastAndroid.SHORT)
          : Alert.alert('Success', 'OTP Resent ✅');
      } else {
        const errMsg = res.payload?.message || 'Failed to resend OTP.';
        Platform.OS === 'android'
          ? ToastAndroid.show(errMsg, ToastAndroid.LONG)
          : Alert.alert('Error', errMsg);
      }
    });
  };

  const isButtonActive = value.length === CELL_COUNT;

  useEffect(() => {
    if (isButtonActive) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(buttonScale, {
            toValue: 1.05,
            duration: 700,
            easing: Easing.ease,
            useNativeDriver: true,
          }),
          Animated.timing(buttonScale, {
            toValue: 1,
            duration: 700,
            easing: Easing.ease,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      buttonScale.stopAnimation();
      buttonScale.setValue(1);
    }
  }, [isButtonActive]);

  return (
    <LinearGradient
      colors={['#FF4B2B', '#FF416C']}
      style={{ flex: 1 }}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
        >
          {/* Transparent White Card */}
          <Animated.View
            style={[
              styles.card,
              {
                opacity: fadeAnim,
                transform: [
                  {
                    scale: bounceAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.9, 1],
                    }),
                  },
                ],
              },
            ]}
          >
            <Image
              source={require('../../assets/images/project_logo.png')}
              style={styles.logo}
              resizeMode="contain"
            />
            <Text style={styles.tagline}>Chinese • Indian • Tandoor</Text>
            <Text style={styles.heading}>Enter the OTP</Text>
            <Text style={styles.subText}>Sent to +91 {phone}</Text>

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
                <Animated.View
                  key={index}
                  style={[
                    styles.cell,
                    {
                      borderColor: isFocused ? '#FF3B30' : '#E5E5E5',
                      transform: [{ scale: isFocused ? 1.1 : 1 }],
                    },
                  ]}
                  onLayout={getCellOnLayoutHandler(index)}
                >
                  <Text style={styles.cellText}>
                    {symbol || (isFocused ? <Cursor /> : null)}
                  </Text>
                </Animated.View>
              )}
            />

            {/* Verify Button */}
            <Animated.View
              style={[
                styles.buttonWrapper,
                { transform: [{ scale: buttonScale }] },
              ]}
            >
              <LinearGradient
                colors={
                  isButtonActive
                    ? ['#FF3B30', '#FF6F61']
                    : ['#ccc', '#bbb']
                }
                style={styles.gradientBtn}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Text
                  style={styles.btnText}
                  onPress={isButtonActive ? handleVerify : null}
                >
                  Verify OTP
                </Text>
              </LinearGradient>
            </Animated.View>

            <Text style={styles.resendText}>
              Didn’t receive code?{' '}
              <Text style={styles.resendLink} onPress={handleResend}>
                Resend
              </Text>
            </Text>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

export default OtpScreen;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  card: {
    width: '90%',
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 10,
  },
  tagline: {
    fontSize: 13,
    color: '#FF3B30',
    marginBottom: 25,
    fontWeight: '600',
  },
  heading: {
    fontSize: 22,
    fontWeight: '700',
    color: '#222',
    marginBottom: 8,
  },
  subText: {
    fontSize: 14,
    color: '#555',
    marginBottom: 25,
  },
  codeFieldRoot: {
    marginBottom: 25,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  cell: {
    width: CELL_WIDTH,
    height: CELL_WIDTH * 1.1,
    borderWidth: 1.5,
    borderRadius: 10,
    marginHorizontal: 5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    elevation: 2,
  },
  cellText: {
    fontSize: CELL_WIDTH * 0.45,
    color: '#222',
    fontWeight: '600',
  },
  buttonWrapper: {
    width: '75%',
    alignSelf: 'center',
    marginBottom: 10,
  },
  gradientBtn: {
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: 'center',
    elevation: 4,
  },
  btnText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  resendText: {
    fontSize: 14,
    color: '#555',
    marginTop: 15,
  },
  resendLink: {
    color: '#FF3B30',
    fontWeight: '700',
  },
});