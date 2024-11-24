import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { Text, View, StyleSheet, TouchableOpacity, Alert, TextInput, ActivityIndicator, Image } from "react-native";
import { useEffect, useState } from "react";
import { getInfoById, deletePlanetById, updatePlanetById } from "./api";

type Planet = {
  name: string;
  description: string;
  moons: number;
  moon_names: string[];
  image?: string;
};

const Details = () => {
  const params = useLocalSearchParams();
  const router = useRouter();
  const [planet, setPlanet] = useState<Planet | null>(null); 
  const [isLoading, setIsLoading] = useState(true); 
  const [isEditing, setIsEditing] = useState(false);
  const [editValues, setEditValues] = useState({
    name: "",
    description: "",
    moons: 0,
    moon_names: "",
  });

  useEffect(() => {
    const fetchInfo = async () => {
      try {
        const response = await getInfoById(params.id as string);
        if (!response) throw new Error("Planet not found");
        setPlanet(response);
        setEditValues({
          name: response.name,
          description: response.description,
          moons: response.moons,
          moon_names: response.moon_names?.join(", ") || "",
        });
      } catch (error) {
        Alert.alert("Error", "Planet not found or error loading details.");
        router.push("/"); 
      } finally {
        setIsLoading(false);
      }
    };

    fetchInfo();
  }, []);

  const handleDelete = async () => {
    try {
      await deletePlanetById(params.id as string);
      Alert.alert("Planet deleted", "The planet has been deleted.");
      router.push("/"); 
    } catch (error) {
      Alert.alert("Error", "There was an error deleting the planet.");
    }
  };

  const handleSaveEdit = async () => {
    if (!editValues.name.trim() || !editValues.description.trim()) {
      Alert.alert("Error", "Name and description are required.");
      return;
    }
    if (isNaN(editValues.moons) || editValues.moons < 0) {
      Alert.alert("Error", "Please enter a valid number of moons.");
      return;
    }

    try {
      const updatedPlanet = {
        ...editValues,
        moons: parseInt(editValues.moons.toString(), 10),
        moon_names: editValues.moon_names.split(",").map((moon) => moon.trim()),
      };

      const response = await updatePlanetById(params.id as string, updatedPlanet);

      if (response) {
        setPlanet(response);
        setIsEditing(false);
        Alert.alert("Planet updated", "The planet has been updated.");
      } else {
        throw new Error("Error updating planet");
      }
    } catch (error) {
      Alert.alert("Error", "There was an error updating the planet.");
    }
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading...</Text>
      </View>
    );
  }

  if (!planet) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Planet not found.</Text>
        <TouchableOpacity onPress={() => router.push("/")} style={styles.goBackButton}>
          <Text style={styles.buttonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  console.log(planet);
  console.log(planet.image);

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: "Details",
          headerStyle: { backgroundColor: "#020127" },
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }}
      />
      <View style={styles.card}>
        <Text style={styles.title}>{planet.name} Details:</Text>
        {planet.image ? (
          <Image source={{ uri: planet.image }} style={styles.image} />
        ) : (
          <Text>No image available</Text> 
        )}
        {!isEditing ? (
          <>
            <Text style={styles.description}>Description: {planet.description}</Text>
            <Text style={styles.description}>Moons Amount: {planet.moons}</Text>
            <Text style={styles.description}>Moons: {planet.moon_names?.join(", ") || "No moons"}</Text>
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
                <Text style={styles.buttonText}>Delete</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.editButton} onPress={() => setIsEditing(true)}>
                <Text style={styles.buttonText}>Edit</Text>
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <>
            <Text style={styles.title}>Edit Planet:</Text>
            <TextInput
              style={styles.input}
              value={editValues.name}
              onChangeText={(text) => setEditValues((prev) => ({ ...prev, name: text }))}
              placeholder="Name"
            />
            <TextInput
              style={styles.input}
              value={editValues.description}
              onChangeText={(text) => setEditValues((prev) => ({ ...prev, description: text }))}
              placeholder="Description"
            />
            <TextInput
              style={styles.input}
              value={editValues.moons.toString()}
              onChangeText={(text) => setEditValues((prev) => ({ ...prev, moons: parseInt(text, 10) || 0 }))}
              placeholder="Number of Moons"
              keyboardType="numeric"
            />
            <TextInput
              style={styles.input}
              value={editValues.moon_names}
              onChangeText={(text) => setEditValues((prev) => ({ ...prev, moon_names: text }))}
              placeholder="Moons (comma-separated)"
            />
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setIsEditing(false)}>
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveButton} onPress={handleSaveEdit}>
                <Text style={styles.buttonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>
    </View>
  );
};


export default Details;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    backgroundColor: "white",
    borderRadius: 10,
    width: "90%",
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 8,
    textAlign: "center",
  },
  image: {
    width: 150,
    height: 150,
    alignSelf: "center",
    marginBottom: 16,
    borderRadius: 75,
  },
  description: {
    fontWeight: "normal",
    marginBottom: 8,
    textAlign: "left",
  },
  buttonContainer: {
    marginTop: 16,
    marginBottom: 16,
    width: "100%",
    display: "flex",
    flexDirection: "row",
  },
  addButton: {
    padding: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  deleteButton: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#dc3545",
    flex: 1,
    marginRight: 8,
    alignItems: "center",
  },
  editButton: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#007bff",
    flex: 1,
    marginLeft: 8,
    alignItems: "center",
  },
  cancelButton: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#6c757d",
    flex: 1,
    marginRight: 8,
    alignItems: "center",
  },
  saveButton: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#28a745",
    flex: 1,
    marginLeft: 8,
    alignItems: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 8,
    marginBottom: 12,
  },
  errorText: {
    fontSize: 18,
    color: "red",
    marginBottom: 16,
  },
  goBackButton: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#007bff",
  },
});