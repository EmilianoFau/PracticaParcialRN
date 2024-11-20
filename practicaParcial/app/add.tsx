import { Text, View, TextInput, Button } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import { addPlanet } from "../app/api";

const AddPlanet = () => {
  const router = useRouter();
  const [newPlanet, setNewPlanet] = useState({
    name: "",
    description: "",
    moons: 0,
    moon_names: [] as string[],
  });

  const handleAddPlanet = async () => {
    if (!newPlanet.name || !newPlanet.description) {
      alert("Please fill in all the fields");
      return;
    }

    const addedPlanet = await addPlanet(newPlanet);

    if (addedPlanet) {
      alert("Planet added successfully");
      router.push("/"); 
    } else {
      alert("Error adding the planet");
    }
  };

  return (
    <View style={{ padding: 16, flex: 1, justifyContent: "center" }}>
      <TextInput
        placeholder="Name"
        value={newPlanet.name}
        onChangeText={(text) => setNewPlanet({ ...newPlanet, name: text })}
        style={{
          marginBottom: 8,
          borderBottomWidth: 1,
          borderColor: "#ccc",
          padding: 8,
        }}
      />
      <TextInput
        placeholder="Description"
        value={newPlanet.description}
        onChangeText={(text) =>
          setNewPlanet({ ...newPlanet, description: text })
        }
        style={{
          marginBottom: 8,
          borderBottomWidth: 1,
          borderColor: "#ccc",
          padding: 8,
        }}
      />
      <TextInput
        placeholder="Moons number"
        keyboardType="numeric"
        value={newPlanet.moons.toString()}
        onChangeText={(text) =>
          setNewPlanet({ ...newPlanet, moons: parseInt(text) || 0 })
        }
        style={{
          marginBottom: 8,
          borderBottomWidth: 1,
          borderColor: "#ccc",
          padding: 8,
        }}
      />
      <TextInput
        placeholder="Names of moons (separated by commas)"
        value={newPlanet.moon_names.join(", ")}
        onChangeText={(text) =>
          setNewPlanet({
            ...newPlanet,
            moon_names: text.split(",").map((name) => name.trim()),
          })
        }
        style={{
          marginBottom: 16,
          borderBottomWidth: 1,
          borderColor: "#ccc",
          padding: 8,
        }}
      />
      <Button title="Add planet" onPress={handleAddPlanet} />
    </View>
  );
};

export default AddPlanet;
