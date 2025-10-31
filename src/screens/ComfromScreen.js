import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Animated,
  Easing,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import Theme from "../assets/theme";

const OrderSuccessScreen = ({ navigation }) => {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const cardFade = useRef(new Animated.Value(0)).current;

  // 🎉 Floating emoji positions
  const emoji1Y = useRef(new Animated.Value(40)).current;
  const emoji2Y = useRef(new Animated.Value(60)).current;
  const emoji3Y = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    // 🟢 Animate icon + text entrance
    Animated.sequence([
      Animated.timing(cardFade, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 5,
        useNativeDriver: true,
      }),
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    // 💓 Continuous pulse on icon
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 600,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 600,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // 🎊 Floating confetti effect
    const float = (anim, delay) => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(anim, {
            toValue: -50,
            duration: 3000,
            delay,
            useNativeDriver: true,
          }),
          Animated.timing(anim, {
            toValue: 40,
            duration: 0,
            useNativeDriver: true,
          }),
        ])
      ).start();
    };

    float(emoji1Y, 0);
    float(emoji2Y, 500);
    float(emoji3Y, 1000);

    // Auto navigate after 3 seconds
    const timer = setTimeout(() => {
      navigation.navigate("ItemDetalis");
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <SafeAreaView style={styles.container}>
      {/* Floating emojis */}
      <Animated.Text
        style={[styles.emoji, { transform: [{ translateY: emoji1Y }, { translateX: -80 }] }]}
      >
        🎉
      </Animated.Text>
      <Animated.Text
        style={[styles.emoji, { transform: [{ translateY: emoji2Y }, { translateX: 80 }] }]}
      >
        ✨
      </Animated.Text>
      <Animated.Text
        style={[styles.emoji, { transform: [{ translateY: emoji3Y }, { translateX: -40 }] }]}
      >
        ⭐
      </Animated.Text>

      {/* Card */}
      <Animated.View style={[styles.card, { opacity: cardFade }]}>
        {/* Checkmark with pulse */}
        <Animated.View
          style={[
            styles.iconContainer,
            {
              transform: [{ scale: Animated.multiply(scaleAnim, pulseAnim) }],
            },
          ]}
        >
          <Ionicons name="checkmark-circle" size={90} color="#e53935" />
        </Animated.View>

        {/* Text */}
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
            alignItems: "center",
          }}
        >
          <Text style={styles.congrats}>🎉 Congratulations!</Text>
          <Text style={styles.confirmed}>Order confirmed successfully</Text>
        </Animated.View>
      </Animated.View>
    </SafeAreaView>
  );
};

export default OrderSuccessScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#e53935",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 30,
    alignItems: "center",
    width: "90%",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 6,
  },
  iconContainer: {
    backgroundColor: "#fdecea",
    borderRadius: 100,
    padding: 30,
    marginBottom: 20,
  },
  congrats: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 5,
    color: Theme.colors.black,
  },
  confirmed: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 30,
    color: "#222",
  },
  emoji: {
    position: "absolute",
    fontSize: 28,
    opacity: 0.8,
  },
});
