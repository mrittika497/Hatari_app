import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

const SmallbtnReuseable = ({ title = "Add", onPress, bgColor = "#ff0000", textColor = "#fff", style }) => {
  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor: bgColor }, style]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text style={[styles.text, { color: textColor }]}>{title}</Text>
    </TouchableOpacity>
  );
};

export default SmallbtnReuseable;

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#f44336',
    paddingHorizontal: 15,
    paddingVertical: 6,
    borderRadius: 20,
  },
  text: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
});
