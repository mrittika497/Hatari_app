// src/screens/ProfileScreen.js
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Modal,
} from "react-native";
import ShimmerPlaceHolder from "react-native-shimmer-placeholder";
import Icon from "react-native-vector-icons/MaterialIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DashboardScreen from "../../components/DashboardScreen";
import CustomHeader from "../../components/CustomHeader";

const ProfileScreen = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState({
    name: "Customer Name",
    phone: "+91 9876543210",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
  });

  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editName, setEditName] = useState(user.name);
  const [editPhone, setEditPhone] = useState(user.phone);

  // Load token & user data from AsyncStorage
  useEffect(() => {
    const loadData = async () => {
      try {
        const token = await AsyncStorage.getItem("authToken");
        const savedUser = await AsyncStorage.getItem("userData");

        if (token) setIsLoggedIn(true);
        if (savedUser) setUser(JSON.parse(savedUser));
      } catch (error) {
        console.log("Error loading data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Handle Login
  const handleLogin = async () => {
    try {
      const fakeToken = "123456789"; // you will replace with real token from API
      await AsyncStorage.setItem("authToken", fakeToken);
      await AsyncStorage.setItem("userData", JSON.stringify(user));
      setIsLoggedIn(true);
    } catch (error) {
      console.log("Login error:", error);
    }
  };

  // Handle Logout
  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("authToken");
      await AsyncStorage.removeItem("userData");
      setIsLoggedIn(false);
    } catch (error) {
      console.log("Logout error:", error);
    }
  };

  // Save profile changes
  const handleSaveProfile = async () => {
    const updatedUser = { ...user, name: editName, phone: editPhone };
    setUser(updatedUser);
    await AsyncStorage.setItem("userData", JSON.stringify(updatedUser));
    setEditModalVisible(false);
  };

  return (
    <DashboardScreen>
      <CustomHeader title="Profile" />
      <ScrollView style={styles.container}>
        {/* ===== If NOT Logged In ===== */}
        {!isLoggedIn ? (
          <View style={styles.loginBox}>
            <Text style={styles.loginText}>Welcome Guest</Text>
            <TouchableOpacity style={styles.loginBtn} onPress={handleLogin}>
              <Text style={styles.loginBtnText}>Login / Sign Up</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {/* ===== Profile Header ===== */}
            <View style={styles.header}>
              <ShimmerPlaceHolder
                visible={!isLoading}
                style={styles.profileImageShimmer}
              >
                <Image source={{ uri: user.image }} style={styles.profileImage} />
              </ShimmerPlaceHolder>
              <View style={{ marginLeft: 15 }}>
                <ShimmerPlaceHolder visible={!isLoading} style={styles.shimmerName}>
                  <Text style={styles.name}>{user.name}</Text>
                </ShimmerPlaceHolder>
                <ShimmerPlaceHolder
                  visible={!isLoading}
                  style={styles.shimmerPhone}
                >
                  <Text style={styles.phone}>{user.phone}</Text>
                </ShimmerPlaceHolder>
              </View>
              <TouchableOpacity
                style={styles.editIcon}
                onPress={() => {
                  setEditName(user.name);
                  setEditPhone(user.phone);
                  setEditModalVisible(true);
                }}
              >
                <Icon name="edit" size={20} color="#666" />
              </TouchableOpacity>
            </View>

            {/* ===== Menu Options ===== */}
            <View style={styles.menuContainer}>
              {[
                { title: "Address", icon: "location-on" },
                { title: "My Orders", icon: "shopping-cart" },
                { title: "Help and Support", icon: "support-agent" },
              ].map((item, index) => (
                <TouchableOpacity key={index} style={styles.menuItem}>
                  <Icon name={item.icon} size={22} color="#444" />
                  <Text style={styles.menuText}>{item.title}</Text>
                  <Icon name="chevron-right" size={24} color="#ccc" />
                </TouchableOpacity>
              ))}
            </View>

            {/* ===== Logout ===== */}
            <TouchableOpacity
              style={styles.logoutContainer}
              onPress={handleLogout}
            >
              <Icon name="logout" size={22} color="#E74C3C" />
              <Text style={styles.logoutText}>Logout</Text>
              <Icon name="chevron-right" size={24} color="#E74C3C" />
            </TouchableOpacity>
          </>
        )}
      </ScrollView>

      {/* ===== Edit Profile Modal ===== */}
      <Modal
        visible={editModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Edit Profile</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter Name"
              value={editName}
              onChangeText={setEditName}
            />
            <TextInput
              style={styles.input}
              placeholder="Enter Phone"
              value={editPhone}
              onChangeText={setEditPhone}
              keyboardType="phone-pad"
            />
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalBtn, { backgroundColor: "#ccc" }]}
                onPress={() => setEditModalVisible(false)}
              >
                <Text style={styles.modalBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalBtn, { backgroundColor: "#2ecc71" }]}
                onPress={handleSaveProfile}
              >
                <Text style={styles.modalBtnText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </DashboardScreen>
  );
};

export default ProfileScreen;

/* ================== Styles ================== */
const styles = StyleSheet.create({
  container: { marginTop: 20 },

  /* Login */
  loginBox: {
    alignItems: "center",
    justifyContent: "center",
    padding: 30,
  },
  loginText: { fontSize: 18, fontWeight: "600", marginBottom: 10 },
  loginBtn: {
    backgroundColor: "#2ecc71",
    paddingHorizontal: 25,
    paddingVertical: 10,
    borderRadius: 8,
  },
  loginBtnText: { color: "#fff", fontWeight: "700", fontSize: 14 },

  /* Profile Header */
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F7F7F7",
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
    position: "relative",
  },
  profileImageShimmer: { width: 60, height: 60, borderRadius: 30 },
  profileImage: { width: 60, height: 60, borderRadius: 30 },
  shimmerName: { width: 120, borderRadius: 4, marginBottom: 5 },
  shimmerPhone: { width: 140, borderRadius: 4 },
  name: { fontSize: 18, fontWeight: "bold", color: "#333" },
  phone: { color: "#666" },
  editIcon: { position: "absolute", right: 15, top: 15 },

  /* Menu */
  menuContainer: {
    backgroundColor: "#F7F7F7",
    borderRadius: 12,
    paddingVertical: 10,
    marginBottom: 20,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#EAEAEA",
  },
  menuText: {
    flex: 1,
    marginLeft: 15,
    fontSize: 16,
    color: "#333",
  },

  /* Logout */
  logoutContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FDEDEC",
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
  },
  logoutText: {
    flex: 1,
    marginLeft: 15,
    fontSize: 16,
    color: "#E74C3C",
    fontWeight: "600",
  },

  /* Modal */
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: {
    width: "85%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 15,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  modalBtn: {
    flex: 1,
    marginHorizontal: 5,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  modalBtnText: { color: "#fff", fontWeight: "600" },
});
