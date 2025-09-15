import React, { useState } from "react";
import {
  View,
  TextInput,
  FlatList,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import Theme from "../assets/theme";

const GOOGLE_API_KEY = "AIzaSyCLItgC8e0snQFn61EJGVInDOBVRX6tfQQ"// ⚠️ Replace with unrestricted / correct key

const CustomSearchInput = ({ onPlaceSelect }) => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  // 🔹 Fetch autocomplete suggestions
  const fetchPlaces = async (text) => {
    setQuery(text);
    if (text.length < 2) {
      setSuggestions([]);
      return;
    }

    try {
      const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(
        text
      )}&key=${GOOGLE_API_KEY}&components=country:in`;

      console.log("Fetching Autocomplete:", url);

      const response = await fetch(url);
      const data = await response.json();
      console.log("Autocomplete Response:", data);

      if (data.status === "OK" && data.predictions) {
        setSuggestions(data.predictions);
      } else {
        console.log("Autocomplete failed:", data.status, data.error_message);
        setSuggestions([]);
      }
    } catch (error) {
      console.log("Error fetching places:", error);
    }
  };

  // 🔹 Handle user selecting a place
  const handleSelect = async (placeId, description) => {
    setQuery(description);
    setSuggestions([]);

    try {
      const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${GOOGLE_API_KEY}`;
      console.log("Fetching Details:", url);

      const response = await fetch(url);
      const data = await response.json();
      console.log("Place Details Response:", data);

      if (data.result?.geometry?.location) {
        const location = data.result.geometry.location;
        onPlaceSelect({
          description,
          latitude: location.lat,
          longitude: location.lng,
        });
      } else {
        console.log("Details failed:", data.status, data.error_message);
      }
    } catch (error) {
      console.log("Error fetching place details:", error);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Search location..."
        value={query}
        onChangeText={fetchPlaces}
        placeholderTextColor="#888"
      />

      {suggestions.length > 0 && (
        <FlatList
          keyboardShouldPersistTaps="handled"
          data={suggestions}
          keyExtractor={(item) => item.place_id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.suggestion}
              onPress={() => handleSelect(item.place_id, item.description)}
            >
              <Text style={{ color: "#333" }}>{item.description}</Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
};

export default CustomSearchInput;

const styles = StyleSheet.create({
  container: {
    margin: 10,
    position: "absolute",
    top: 40,
    left: 10,
    right: 10,
    backgroundColor: "#fff",
    borderRadius: 10,
    elevation: 5,
    zIndex: 999,
  },
  input: {
    height: 50,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
    backgroundColor: "#f9f9f9",
    color: Theme.colors.black,
  },
  suggestion: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
});
