import React, { useEffect, useState } from 'react';
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
  Dimensions,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';
import DashboardScreen from '../../components/DashboardScreen';
import Theme from '../../assets/theme';
import ReusableBtn from '../../components/ReuseableBtn';
import { sendOtp, verifyOtp, setAuth } from '../../redux/slice/authSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CELL_COUNT = 6;
const { width } = Dimensions.get('window');
const CELL_WIDTH = Math.min(60, (width - 80) / 8); // responsive cell width

const OtpScreen = ({ route, navigation }) => {
  const phone = route?.params?.phone;
  const dispatch = useDispatch();
  const { token, user } = useSelector(state => state.auth);



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

  const [value, setValue] = useState('');
  const ref = useBlurOnFulfill({ value, cellCount: CELL_COUNT });
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });

  useEffect(() => {
    if (token && user) {
      navigation.reset({
        index: 0,
        routes: [{ name: 'ExperienceScreen', params: { token, user } }],
      });
    }
  }, [token, user]);

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

  return (
    <DashboardScreen>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
        >
          <Image
            source={require('../../assets/images/project_logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.tagline}>Chinese • Indian • Tandoor</Text>

          <Text style={styles.instruction}>Enter 6 digit OTP</Text>

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

          <ReusableBtn
            title="Verify"
            style={[isButtonActive ? styles.verifyBtn : styles.verifyBtnDisabled]}
            onPress={handleVerify}
            disabled={!isButtonActive}
          />

          <Text style={styles.resendText}>
            Having any issue?
            <Text style={styles.resendLink} onPress={handleResend}>
              {' '}
              Send again
            </Text>
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </DashboardScreen>
  );
};

export default OtpScreen;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#fff',
  },
  logo: {
    width: width * 0.3,
    height: width * 0.3,
    marginBottom: 10,
  },
  tagline: {
    fontSize: 14,
    color: Theme.colors.red,
    marginBottom: 20,
    fontWeight: '500',
  },
  instruction: {
    fontSize: 16,
    marginBottom: 20,
    color: Theme.colors.black,
    fontWeight: '500',
  },
  codeFieldRoot: {
    marginBottom: 30,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  cell: {
    width: CELL_WIDTH,
    height: CELL_WIDTH * 1.1,
    borderWidth: 1,
    borderColor: Theme.colors.red,
    borderRadius: 8,
    marginHorizontal: 5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Theme.colors.white,
  },
  cellText: {
    fontSize: CELL_WIDTH * 0.45,
    color: '#333',
  },
  focusCell: {
    borderColor: Theme.colors.red,
  },
  verifyBtn: {
    width: '100%',
    paddingVertical: 15,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Theme.colors.red,
    elevation: 3,
    shadowOpacity: 0.15,
    shadowRadius: 6,
    marginBottom: 15,
  },
  verifyBtnDisabled: {
    width: '100%',
    paddingVertical: 15,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ccc',
    marginBottom: 15,
  },
  resendText: {
    fontSize: 14,
    color: Theme.colors.black,
    marginTop: 15,
  },
  resendLink: {
    color: Theme.colors.red,
    fontWeight: 'bold',
  },
});
