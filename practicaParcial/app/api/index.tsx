export const getInfo = async () => {
    const URL = "http://localhost:8000/planets";
    try {
      const response = await fetch(URL, {
        headers: {
          "bypass-tunnel-reminder": "true",
        },
      });
      if (response.ok) {
        const data = await response.json();
        return data;
      } else {
        console.log("Error getting info");
        return [];
      }
    } catch (error) {
      console.error(error);
    }
  };
  
  export const getInfoById = async (id: string) => {
    const URL = `http://localhost:8000/planets/${id}`;
    try {
      const response = await fetch(URL, {
        headers: {
          "bypass-tunnel-reminder": "true",
        },
      });
      if (response.ok) {
        const data = await response.json();
        return data;
      } else {
        console.log("Error getting info");
        return [];
      }
    } catch (error) {
      console.error(error);
    }
  };

  export const addPlanet = async (planet: {
    name: string;
    description: string;
    moons: number;
    moon_names: string[];
  }) => {
    const URL = "http://localhost:8000/planets";
    try {
      const response = await fetch(URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(planet),
      });
  
      if (!response.ok) {
        throw new Error("Error adding new planet");
      }
  
      return await response.json();
    } catch (error) {
      console.error(error);
      return null;
    }
  };