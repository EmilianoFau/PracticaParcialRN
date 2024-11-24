import { Text, View, ScrollView, Button, StyleSheet, TouchableOpacity, Platform } from "react-native";
import { useEffect, useState } from "react";
import { getInfo } from "../app/api";
import { Stack, Link } from "expo-router";

interface Planet {
    id: string;
    name: string;
    description: string;
    moons: number;
    moon_names: string[];
    image?: string;
}

const Index = () => {
  const [planets, setPlanets] = useState<Planet[]>([]);
  const [originalPlanets, setOriginalPlanets] = useState<Planet[]>([]);

  useEffect(() => {
    const fetchInfo = async () => {
      const response = await getInfo();
      setPlanets(response);
      setOriginalPlanets(response);
    };

    fetchInfo();
  }, []);
  console.log(planets);

  const handleSortByMoons = () => {
    const sortedPlanets = [...planets].sort((a, b) => b.moons - a.moons);
    setPlanets(sortedPlanets);
  };

  const handleResetOrder = () => {
    setPlanets(originalPlanets);
  };

  return (
    <ScrollView
      style={{
        flex: 1,
      }}
    >
      <Stack.Screen
        options={{
          title: "Home",
          headerStyle: { backgroundColor: "#020127" },
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }}
      />
      <View
        style={[
          styles.buttonContainer,
          Platform.OS === "android"
            ? styles.buttonContainerAndroid
            : styles.buttonContainerIOS,
        ]}
      >
        <Link href="/add">
          <TouchableOpacity
            style={[
              styles.addButton,
              Platform.OS === "android" ? styles.androidButton : styles.iosButton,
            ]}
          >
            <Text
              style={
                Platform.OS === "android"
                  ? styles.androidButtonText
                  : styles.iosButtonText
              }
            >
              {Platform.OS === "android" ? "Nuevo Planeta" : "Crear Planeta"}
            </Text>
          </TouchableOpacity>
        </Link>
      </View>
      {planets &&
        planets.map((planet) => {
          return (
            <View
              key={planet.id}
              style={{
                backgroundColor: "white",
                borderRadius: 10,
                width: "85%",
                margin: 16,
                padding: 16,
              }}
            >
              <Link
                href={{
                  pathname: "/details",
                  params: { id: planet.id },
                }}
              >
                <Text style={{ fontWeight: "bold" }}>{planet.name}</Text>
              </Link>
            </View>
          );
        })}
      <View style={styles.actionButtonsContainer}>
        <TouchableOpacity style={styles.sortButton} onPress={handleSortByMoons}>
          <Text style={styles.buttonText}>Ordenar por lunas</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.resetButton} onPress={handleResetOrder}>
          <Text style={styles.buttonText}>Restablecer</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default Index;

const styles = StyleSheet.create({
    buttonContainer: {
      marginTop: 16,
      marginBottom: 16,
      width: "100%",
    },
    buttonContainerAndroid: {
      alignItems: "flex-start",
      paddingLeft: 16,
    },
    buttonContainerIOS: {
      alignItems: "flex-end",
      paddingRight: 16,
    },
    addButton: {
      padding: 12,
      borderRadius: 8,
    },
    androidButton: {
      backgroundColor: "blue",
    },
    iosButton: {
      backgroundColor: "green",
    },
    androidButtonText: {
      color: "white",
      fontWeight: "bold",
    },
    iosButtonText: {
      color: "black",
      fontWeight: "bold",
    },
    actionButtonsContainer: {
      flexDirection: "row",
      justifyContent: "space-around",
      marginBottom: 16,
    },
    sortButton: {
      backgroundColor: "#030237",
      padding: 10,
      borderRadius: 8,
    },
    resetButton: {
      backgroundColor: "#030237",
      padding: 10,
      borderRadius: 8,
    },
    buttonText: {
      color: "white",
      fontWeight: "bold",
    },
  });