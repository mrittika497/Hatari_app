import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  StatusBar,
} from "react-native";

const PrivacyPolicyScreen = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      <ScrollView contentContainerStyle={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Privacy Policy</Text>
          <Text style={styles.subTitle}>Hatari Restaurant App</Text>
          <Text style={styles.updated}>Last updated: 15-01-2026</Text>
        </View>

        {/* Privacy content */}
        <View style={styles.card}>
          {/* Intro */}
          <Text style={styles.text}>
            Hatari Restaurant (“we”, “our”, “us”) operates the Hatari mobile
            application (the “App”), a food ordering platform for customers in
            Kolkata. This Privacy Policy explains how we collect, use, and protect
            user information in compliance with Google Play policies.
          </Text>

          {/* Sections */}
          <Section heading="1. Information We Collect">
            <Text style={styles.text}>
              We collect only the information necessary to provide food ordering services.
            </Text>

            <SubHeading text="a. Personal Information" />
            <Bullet text="Phone number (for login and OTP verification)" />
            <Bullet text="Delivery address (entered by the user)" />
            <Bullet text="Selected branch and order details" />

            <SubHeading text="b. Location Information" />
            <Text style={styles.text}>
              We access approximate or precise location only to:
            </Text>
            <Bullet text="Show the nearest Hatari branch" />
            <Bullet text="Enable delivery or takeaway selection" />
            <Text style={styles.text}>
              Location access is optional and requires user permission. Users can
              disable location services anytime from device settings.
            </Text>

            <SubHeading text="c. Device & App Information" />
            <Bullet text="Basic app diagnostics for performance and error handling" />
            <Bullet text="No tracking for advertising purposes" />
          </Section>

          <Section heading="2. OTP & Third-Party Services">
            <Text style={styles.text}>
              OTP verification is handled via a third-party authentication service.
              We do not store OTP codes. Phone numbers are used only for
              authentication and order communication.
            </Text>
          </Section>

          <Section heading="3. Payments">
            <Text style={styles.text}>
              Currently, the app supports Cash on Delivery (COD) only. We do not
              collect or store any card, bank, or payment details.
            </Text>
          </Section>

          <Section heading="4. How We Use Your Information">
            <Bullet text="Authenticate users" />
            <Bullet text="Display nearby restaurant branches" />
            <Bullet text="Process food orders" />
            <Bullet text="Deliver orders to the correct address" />
            <Bullet text="Provide customer support" />
            <Bullet text="Improve app performance and user experience" />
          </Section>

          <Section heading="5. Data Sharing">
            <Text style={styles.text}>
              We do not sell or rent user data. Data may be shared only with:
            </Text>
            <Bullet text="Restaurant branches for order fulfillment" />
            <Bullet text="Delivery staff for delivery purposes" />
            <Bullet text="Legal authorities if required by law" />
          </Section>

          <Section heading="6. Data Security">
            <Text style={styles.text}>
              We take reasonable steps to protect user data using secure servers,
              restricted access, and industry-standard practices. However, no system
              is 100% secure, and we cannot guarantee absolute security.
            </Text>
          </Section>

          <Section heading="7. User Rights">
            <Bullet text="Update their address information" />
            <Bullet text="Disable location access" />
            <Bullet text="Stop using the app at any time" />
            <Text style={styles.text}>
              To request data removal, users can contact us using the details below.
            </Text>
          </Section>

          <Section heading="8. Children’s Privacy">
            <Text style={styles.text}>
              This app is not intended for children under 13 years of age. We do not
              knowingly collect data from children.
            </Text>
          </Section>

          <Section heading="9. Changes to This Policy">
            <Text style={styles.text}>
              We may update this Privacy Policy from time to time. Any changes will
              be reflected within the app or on our website.
            </Text>
          </Section>

          <Section heading="10. Contact Us">
            <Bullet text="📧 Email: hatari.app1966@gmail.com" />
            <Bullet text="📍 Location: Kolkata, India" />
          </Section>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default PrivacyPolicyScreen;

// Section Component
const Section = ({ heading, children }) => (
  <View style={styles.section}>
    <Text style={styles.heading}>{heading}</Text>
    {children}
  </View>
);

// SubHeading Component
const SubHeading = ({ text }) => (
  <Text style={styles.subHeading}>{text}</Text>
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
  subHeading: {
    fontSize: 14,
    fontWeight: "600",
    color: "#E53935",
    marginTop: 6,
    marginBottom: 4,
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
