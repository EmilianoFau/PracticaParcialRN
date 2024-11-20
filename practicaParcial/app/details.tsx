import { Stack, useLocalSearchParams } from "expo-router";
import { Text, View, StyleSheet } from "react-native";
import { useEffect, useState } from "react";
import { getInfoById } from "./api";

const Details = () => {
  const params = useLocalSearchParams();
  const [planet, setPlanet] = useState({} as any);
  useEffect(() => {
    const fetchInfo = async () => {
      const response = await getInfoById(params.id as string);
      setPlanet(response);
    };

    fetchInfo();
  }, []);

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
      {planet && (
        <View
          style={{
            backgroundColor: "white",
            borderRadius: 10,
            width: "90%",
            margin: 16,
            padding: 16,
          }}
        >
          <Text style={{ fontWeight: "bold" }}>{planet.name}</Text>
          <Text style={{ fontWeight: "normal" }}>{planet.description}</Text>
          <Text style={{ fontWeight: "normal" }}>{planet.moons}</Text>
          <Text style={{ fontWeight: "normal" }}>{planet.moon_names}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default Details;