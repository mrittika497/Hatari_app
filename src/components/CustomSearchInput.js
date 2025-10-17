import React, { useState } from "react";
import {
  View,
  TextInput,
  FlatList,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import Theme from "../assets/theme";
import { GOOGLE_API_KEY } from "../global_Url/googlemapkey";

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

      const response = await fetch(url);
      const data = await response.json();

      if (data.status === "OK" && data.predictions) {
        setSuggestions(data.predictions);
      } else {
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
      const response = await fetch(url);
      const data = await response.json();

      if (data.result?.geometry?.location) {
        const location = data.result.geometry.location;
        onPlaceSelect({
          description,
          latitude: location.lat,
          longitude: location.lng,
        });
      }
    } catch (error) {
      console.log("Error fetching place details:", error);
    }
  };

  // 🔹 Clear search
  const clearSearch = () => {
    setQuery("");
    setSuggestions([]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputWrapper}>
        <TextInput
          style={styles.input}
          placeholder="Search location..."
          value={query}
          onChangeText={fetchPlaces}
          placeholderTextColor="#888"
        />
        {query.length > 0 && (
          <TouchableOpacity onPress={clearSearch} style={styles.clearIcon}>
            <Ionicons name="close-circle" size={20} color="#888" />
          </TouchableOpacity>
        )}
      </View>

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
              <Text style={styles.suggestionText}>{item.description}</Text>
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
    marginHorizontal: 20,
    position: "absolute",
    top: 5,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    borderRadius: 10,
    elevation: 5,
    zIndex: 999,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center", // vertically center
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: "#f9f9f9",
    paddingHorizontal: 10,
    height: 50,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: Theme.colors.black,
  },
  clearIcon: {
    justifyContent: "center",
    alignItems: "center",
    padding: 5,
  },
  suggestion: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  suggestionText: {
    color: "#333",
    fontSize: 14,
  },
});
