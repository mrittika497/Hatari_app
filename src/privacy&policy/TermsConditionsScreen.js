import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  StatusBar,
} from "react-native";

const TermsConditionsScreen = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      <ScrollView contentContainerStyle={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Terms & Conditions</Text>
          <Text style={styles.subTitle}>Hatari Restaurant App</Text>
          <Text style={styles.updated}>Last updated: 15-01-2026</Text>
        </View>

        {/* Terms content */}
        <View style={styles.card}>
          <Text style={styles.text}>
            By using the Hatari mobile application, you agree to the following Terms & Conditions.
          </Text>

          {/* Sections */}
          <Section heading="1. App Usage">
            <Bullet text="The app is intended for users ordering food from Hatari restaurant branches in Kolkata." />
            <Bullet text="Users must provide accurate information while placing orders." />
            <Bullet text="Misuse, fraud, or abuse may result in account suspension." />
          </Section>

          <Section heading="2. Account & Login">
            <Bullet text="Login is done using a mobile number and OTP." />
            <Bullet text="Users are responsible for maintaining the confidentiality of their device and access." />
          </Section>

          <Section heading="3. Location Services">
            <Bullet text="Location is used to identify the nearest branch and delivery availability." />
            <Bullet text="The app may not function correctly if location access is denied." />
          </Section>

          <Section heading="4. Orders & Availability">
            <Bullet text="Menu items, prices, and availability may vary by branch." />
            <Bullet text="Orders are subject to confirmation by the selected restaurant branch." />
            <Bullet text="Once an order is placed, cancellation may not be guaranteed." />
          </Section>

          <Section heading="5. Delivery & Takeaway">
            <Bullet text="Users can choose between Delivery or Takeaway." />
            <Bullet text="Delivery timelines are approximate and may vary due to traffic, weather, or operational reasons." />
            <Bullet text="Correct address details are the user’s responsibility." />
          </Section>

          <Section heading="6. Payments">
            <Bullet text="Currently, only Cash on Delivery (COD) is supported." />
            <Bullet text="Payment must be made at the time of delivery." />
          </Section>

          <Section heading="7. Coupons & Offers">
            <Bullet text="Coupons are subject to availability and terms." />
            <Bullet text="Hatari reserves the right to modify or cancel offers at any time." />
          </Section>

          <Section heading="8. Limitation of Liability">
            <Bullet text="Delays due to external factors." />
            <Bullet text="Incorrect orders caused by user-provided information." />
            <Bullet text="Temporary service interruptions." />
          </Section>

          <Section heading="9. Intellectual Property">
            <Text style={styles.text}>
              All logos, brand names, and content belong to Hatari Restaurant. Unauthorized use is prohibited.
            </Text>
          </Section>

          <Section heading="10. Changes to Terms">
            <Text style={styles.text}>
              We reserve the right to update these Terms at any time. Continued use of the app means acceptance of the updated terms.
            </Text>
          </Section>

          <Section heading="11. Governing Law">
            <Text style={styles.text}>
              These terms are governed by the laws of India, with jurisdiction in Kolkata.
            </Text>
          </Section>

          <Section heading="12. Contact Information">
            <Bullet text="📧 Email: hatari.app1966@gmail.com" />
            <Bullet text="📍 Location: Kolkata, India" />
          </Section>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default TermsConditionsScreen;

// Section Component
const Section = ({ heading, children }) => (
  <View style={styles.section}>
    <Text style={styles.heading}>{heading}</Text>
    {children}
  </View>
);

// Bullet Component
const Bullet = ({ text }) => (
  <View style={styles.bulletContainer}>
    <View style={styles.bulletDot} />
    <Text style={styles.bullet}>{text}</Text>
  </View>
);

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FDECEC",
  },
  container: {
    padding: 16,
    paddingBottom: 30,
  },
  header: {
    marginBottom: 16,
    alignItems: "center",
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
    color: "#E53935",
  },
  subTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginTop: 4,
  },
  updated: {
    fontSize: 12,
    color: "#777",
    marginTop: 2,
  },
  card: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
  },
  section: {
    marginTop: 12,
  },
  heading: {
    fontSize: 17,
    fontWeight: "700",
    color: "#E53935",
    marginBottom: 6,
  },
  text: {
    fontSize: 14,
    lineHeight: 22,
    color: "#333",
    marginBottom: 6,
  },
  bulletContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 6,
  },
  bulletDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#E53935",
    marginRight: 8,
    marginTop: 6,
  },
  bullet: {
    flex: 1,
    fontSize: 14,
    lineHeight: 22,
    color: "#333",
  },
});
