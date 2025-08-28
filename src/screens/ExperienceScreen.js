import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import DashboardScreen from "../components/DashboardScreen";

const experiences = [
  { id: 1, title: "Delivery", icon: require("../assets/images/delivery.png") },
  { id: 2, title: "Dine in", icon: require("../assets/images/dinein.png") },
  { id: 3, title: "Takeaway", icon: require("../assets/images/takeaway.png") },
];

const branches = [
  { id: 1, title: "GARIA", logo: require("../assets/images/project_logo.png") },
  { id: 2, title: "BARISHA", logo: require("../assets/images/project_logo.png") },
  { id: 3, title: "DHAKURIA", logo: require("../assets/images/project_logo.png") },
];

const ExperienceScreen = () => {
  const [selectedExperience, setSelectedExperience] = useState(null);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const navigation = useNavigation();

  const handleContinue = () => {
    if (selectedExperience && selectedBranch) {
      navigation.navigate("Bottom", {
        experienceId: selectedExperience,
        branchId: selectedBranch,
      });
    } else {
      alert("Please select both experience and branch.");
    }
  };

  return (
    <DashboardScreen>
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {/* Header */}
          <Text style={styles.title}>
            Welcome to <Text style={styles.brand}>Hatari</Text>
          </Text>
          <Text style={styles.subtitle}>Elevate Your Dining Experience</Text>

          {/* Choose Experience */}
          <Text style={styles.sectionHeading}>Choose your experience</Text>
          <View style={styles.experienceContainer}>
            {experiences.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.experienceCard,
                  selectedExperience === item.id && styles.selectedCard,
                ]}
                onPress={() => setSelectedExperience(item.id)}
              >
                <Image source={item.icon} style={styles.icon} resizeMode="contain" />
                <Text style={styles.cardText}>{item.title}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Select Branch */}
          <Text style={styles.sectionHeading}>Please select branch</Text>
          <View style={styles.branchContainer}>
            {branches.map((branch) => (
              <TouchableOpacity
                key={branch.id}
                style={[
                  styles.branchCard,
                  selectedBranch === branch.id && styles.selectedBranchCard,
                ]}
                onPress={() => setSelectedBranch(branch.id)}
              >
                <Image source={branch.logo} style={styles.branchLogo} resizeMode="contain" />
                <Text
                  style={[
                    styles.branchText,
                    selectedBranch === branch.id && styles.selectedBranchText,
                  ]}
                >
                  {branch.title}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Continue Button */}
          <TouchableOpacity
            style={[
              styles.continueButton,
              !(selectedExperience && selectedBranch) && styles.disabledButton,
            ]}
            onPress={handleContinue}
            disabled={!(selectedExperience && selectedBranch)}
          >
            <Text style={styles.continueText}>Continue</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </DashboardScreen>
  );
};

export default ExperienceScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContainer: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  brand: {
    color: "#e53935",
    fontWeight: "700",
  },
  subtitle: {
    fontSize: 14,
    color: "#e53935",
    marginBottom: 25,
    fontWeight: "500",
  },
  sectionHeading: {
    fontSize: 16,
    color: "#000",
    fontWeight: "500",
    marginBottom: 12,
    marginTop: 20,
  },
  experienceContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  experienceCard: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 12,
    paddingVertical: 20,
    marginHorizontal: 5,
    alignItems: "center",
    backgroundColor: "#fff",
  },
  selectedCard: {
    borderColor: "#e53935",
  },
  icon: {
    width: 30,
    height: 30,
    marginBottom: 8,
  },
  cardText: {
    fontSize: 14,
    color: "#000",
  },
  branchContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
    marginTop: 10,
  },
  branchCard: {
    width: "30%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 12,
    paddingVertical: 15,
    marginBottom: 10,
    alignItems: "center",
    backgroundColor: "#fff",
  },
  selectedBranchCard: {
    borderColor: "#e53935",
  },
  branchLogo: {
    width: 80,
    height: 40,
    marginBottom: 8,
  },
  branchText: {
    fontSize: 14,
    color: "#000",
  },
  selectedBranchText: {
    color: "#e53935",
    fontWeight: "700",
  },
  continueButton: {
    backgroundColor: "#e53935",
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 20,
  },
  disabledButton: {
    backgroundColor: "#ccc",
  },
  continueText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
