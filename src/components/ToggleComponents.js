// ToggleComponents.js
import React, { useRef, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Animated } from 'react-native';

import { toggleFilter } from '../redux/slice/toggleSlice';
import { useDispatch, useSelector } from 'react-redux';


const ToggleComponents = () => {
  const dispatch = useDispatch();
  const isVeg = useSelector(state => state.foodFilter?.isVeg); 
  console.log(isVeg,"-----------------------------isVeg");
  
  const anim = useRef(new Animated.Value(isVeg ? 0 : 1)).current;

  // Animate toggle when Redux state changes
  useEffect(() => {
    Animated.timing(anim, {
      toValue: isVeg ? 0 : 1,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [isVeg]);

  const thumbTranslate = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 12], // thumb movement distance
  });

  const backgroundColor = anim.interpolate({
    inputRange: [0, 1],
    outputRange: ['#4CAF50', '#E53935'], // Veg = Green, Non-Veg = Red
  });

  return (
    <View style={styles.toggleWrapper}>
      <Text
        style={[
          styles.toggleLabel,
          { color: isVeg ? '#4CAF50' : '#999' },
        ]}>
        Veg
      </Text>

      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => dispatch(toggleFilter())} // ✅ Dispatch Redux toggle
        style={styles.togglePressArea}>
        <Animated.View style={[styles.toggleSwitch, { backgroundColor }]}>
          <Animated.View
            style={[
              styles.toggleThumb,
              { transform: [{ translateX: thumbTranslate }] },
            ]}
          />
        </Animated.View>
      </TouchableOpacity>

      <Text
        style={[
          styles.toggleLabel,
          { color: !isVeg ? '#E53935' : '#999' },
        ]}>
        Non-Veg
      </Text>
    </View>
  );
};

export default ToggleComponents;

const styles = StyleSheet.create({
  toggleWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 8,
    justifyContent:'flex-end',
    marginTop:-4
  },
  toggleLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginHorizontal: 6,
  },
  togglePressArea: {
    paddingHorizontal: 4,
  },
  toggleSwitch: {
    width: 28,
    height: 16,
    borderRadius: 10,
    padding: 2,
    justifyContent: 'center',
  },
  toggleThumb: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#fff',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
    padding:6
  },
});
