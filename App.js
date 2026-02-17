// App.js
import React, { useEffect } from 'react';
import { SafeAreaView, StyleSheet, StatusBar, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import StackNav from './src/navigation/StackNav';
import { Provider } from 'react-redux';
import store, { loadCartFromStorage } from './src/redux/store/store';
import OtpScreen from './src/screens/auth/OtpScreen';

const App = () => {

    useEffect(() => {
    store.dispatch(loadCartFromStorage());
  }, []);
  return (
    <Provider store={store}> 
    {/* <OtpScreen/> */}
    {/* <SafeAreaView style={styles.safeArea}> */}
      <NavigationContainer>
        <StackNav />
      </NavigationContainer>
    {/* </SafeAreaView> */}
    </Provider>
  );
};

export default App;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
});
