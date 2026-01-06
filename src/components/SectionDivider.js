import React from "react";
import { View, Text, StyleSheet } from "react-native";

const SectionDivider = ({ title, textStyle, lineColor = "#ccc", containerStyle }) => {
  return (
    <View style={[styles.container, containerStyle]}>
      <View style={[styles.line, { backgroundColor: lineColor }]} />
      <Text style={[styles.text, textStyle]}>{title}</Text>
      <View style={[styles.line, { backgroundColor: lineColor }]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
  line: {
    flex: 1,
    height: 1,
  },
  text: {
    marginHorizontal: 10,
    fontSize: 16,
    fontWeight: "bold",
    color: "#0e0e0eff",
  },
});

export default SectionDivider;
