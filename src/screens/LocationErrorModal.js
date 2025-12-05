// LocationErrorModal.js
import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Image,
  ActivityIndicator,
} from "react-native";

const LocationErrorModal = ({ visible, onRetry, onClose, searching }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 6,
          tension: 80,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  return (
    <Modal visible={visible} transparent animationType="fade">
      <Animated.View style={[styles.overlay, { opacity: fadeAnim }]} />

      <View style={styles.centeredView}>
        <Animated.View style={[styles.modalBox, { transform: [{ scale: scaleAnim }] }]}>
          
          {searching ? (
            <>
              <ActivityIndicator size="large" color="#FF3B30" style={{ marginBottom: 15 }} />
              <Text style={styles.title}>Fetching Location…</Text>
              <Text style={styles.message}>
                Please wait while we detect your location.
              </Text>
            </>
          ) : (
            <>
              {/* <Image
                source={require("../assets/icons/location-warning.png")}
                style={styles.icon}
              /> */}
              <Text style={styles.title}>Location Access Needed</Text>
              <Text style={styles.message}>
                We are unable to fetch your location. Please enable GPS or grant permission.
              </Text>
            </>
          )}

          {!searching && (
            <>
              <TouchableOpacity style={styles.retryBtn} onPress={onRetry}>
                <Text style={styles.retryTxt}>Grant Permission</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
                <Text style={styles.cancelTxt}>Cancel</Text>
              </TouchableOpacity>
            </>
          )}
        </Animated.View>
      </View>
    </Modal>
  );
};

export default LocationErrorModal;

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.55)",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 22,
    alignItems: "center",
    elevation: 8,
  },
  icon: {
    width: 65,
    height: 65,
    marginBottom: 10,
    tintColor: "#FF3B30",
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#000",
    marginBottom: 8,
    textAlign: "center",
  },
  message: {
    fontSize: 14,
    color: "#444",
    textAlign: "center",
    marginBottom: 20,
    lineHeight: 20,
  },
  retryBtn: {
    backgroundColor: "#FF3B30",
    paddingVertical: 12,
    borderRadius: 12,
    width: "100%",
    alignItems: "center",
    marginBottom: 10,
  },
  retryTxt: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  cancelBtn: {
    paddingVertical: 10,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
  },
  cancelTxt: {
    color: "#333",
    fontSize: 15,
    fontWeight: "500",
  },
});
