import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
  Image,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";

const HomeCatModal = ({
  visible,
  onClose,
  title = "What Are You Craving?",
  data = [],
  onSelect,
}) => {
  return (
    <Modal transparent visible={visible} animationType="slide">
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.backdrop} onPress={onClose} />

        <View style={styles.container}>
          {/* HEADER */}
  <LinearGradient
   colors={['#ef2435', '#fefefc']}
  style={styles.header}
  start={{ x: 0, y: 0 }}
  end={{ x: 1, y: 0 }}
>
  <Text style={styles.headerTitle}>{title}</Text>
  <TouchableOpacity onPress={onClose}>
    <Text style={styles.closeText}>✕</Text>
  </TouchableOpacity>
</LinearGradient>


          {/* LIST */}
          <ScrollView
            showsVerticalScrollIndicator={false}
            style={{ maxHeight: 400, marginTop: 10 }}
          >
            {data.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.itemBox}
                onPress={() => onSelect(item)}
              >
                {item?.icon && (
                  <LinearGradient
                colors={['#ef2435', '#fefefc']}
                    style={styles.itemIconWrapper}
                  >
                    <Image source={item.icon} style={styles.itemIcon} />
                  </LinearGradient>
                )}

                <Text style={styles.itemText}>{item.name}</Text>

                {/* <Image
                  source={require("../../assets/images/arrow-right.png")}
                  style={styles.arrowIcon}
                /> */}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default HomeCatModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.45)",
  },
  backdrop: {
    flex: 1,
  },
container: {
  backgroundColor: "#fff",
  borderTopLeftRadius: 25,
  borderTopRightRadius: 25,
  paddingBottom: 20,
  paddingHorizontal: 0, // remove padding so header can stretch full width
  elevation: 20,
  shadowColor: "#000",
  shadowOpacity: 0.25,
  shadowRadius: 10,
  shadowOffset: { width: 0, height: -3 },
},

header: {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  width: "100%",           // 👈 full width
  paddingVertical: 18,
  paddingHorizontal: 20,   // internal spacing
  borderTopLeftRadius: 25,
  borderTopRightRadius: 25,
}

,
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#fff",
  },
  closeText: {
    fontSize: 22,
    color: "#fb0d0dff",
    fontWeight: "700",
  },
  itemBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fefefe",
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 15,
    marginBottom: 12,
    shadowColor: "#aaa",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  itemIconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  itemIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
  },
  itemText: {
    flex: 1,
    fontSize: 17,
    fontWeight: "600",
    color: "#333",
  },
  arrowIcon: {
    width: 18,
    height: 18,
    tintColor: "#666",
  },
});
