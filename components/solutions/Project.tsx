import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Button,
  ScrollView,
  StyleSheet,
  TouchableWithoutFeedback,
} from "react-native";
import { LineChart } from "react-native-chart-kit";
import { Picker } from "@react-native-picker/picker";
import * as SQLite from "expo-sqlite";
import { CheckIcon, Select } from "native-base";
import { Modal } from "react-native";

type DataType = {
  id: number;
  city: string;
  period: string;
};

type WeatherDataItem = {
  date: string;
  temperature: number;
  humidity: number;
  weatherType: string;
  extendedData: {
    pressure: number;
    dewPoint: number;
    clouds: number;
    windSpeed: number;
    windGust?: number;
    windDirection: number;
  };
};

type WeatherData = {
  [key: string]: WeatherDataItem[];
};

const initialWeatherData: WeatherData = {
  minutely: [],
  hourly: [],
  daily: [],
};

const connectToDatabase = async () => {
  return new Promise((resolve, reject) => {
    try {
      const db = SQLite.openDatabase("preferences_table1.db");
      console.log("Database opened");
      resolve(db);
    } catch (error) {
      console.log("Error opening database", error);
      reject(error);
    }
  });
};

const createTable = async (db: SQLite.SQLiteDatabase) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "CREATE TABLE IF NOT EXISTS preferences_table1 (id INTEGER PRIMARY KEY AUTOINCREMENT, city TEXT, period TEXT)",
        [],
        () => {
          console.log("Table created");
          resolve(true);
        },
        (_, error) => {
          console.log("Error creating table", error);
          reject(error);
          return false;
        }
      );
    });
  });
};

const loadData = async (db: SQLite.SQLiteDatabase) => {
  return new Promise<DataType>((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM preferences_table1 WHERE id = 1",
        [],
        (_, results) => {
          if (results.rows.length > 0) {
            console.log("Preferences data loaded");
            resolve(results.rows.item(0));
          } else {
            console.log("No preferences data found");
            resolve({
              id: 1,
              city: "Warszawa",
              period: "Minutowo 1 godzina",
            });
          }
        },
        (_, error) => {
          console.log("Error loading preferences data", error);
          reject(error);
          return false;
        }
      );
    });
  });
};

const savePreferences = async (db: SQLite.SQLiteDatabase, data: DataType) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM preferences_table1 WHERE id = 1",
        [],
        (_, results) => {
          if (results.rows.length === 0) {
            tx.executeSql(
              "INSERT INTO preferences_table1 (id, city, period) VALUES (1, ?, ?)",
              [data.city, data.period],
              () => {
                console.log("Preferences initialized");
                resolve(true);
              },
              (_, error) => {
                console.log("Error initializing preferences", error);
                reject(error);
                return false;
              }
            );
          } else {
            // Update if row exists
            tx.executeSql(
              "UPDATE preferences_table1 SET city = ?, period = ? WHERE id = 1",
              [data.city, data.period],
              () => {
                console.log("Preferences updated");
                resolve(true);
              },
              (_, error) => {
                console.log("Error updating preferences", error);
                reject(error);
                return false;
              }
            );
          }
        },
        (_, error) => {
          console.log("Error checking preferences", error);
          reject(error);
          return false;
        }
      );
    });
  });
};

export const Project = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [weatherData, setWeatherData] =
    useState<WeatherData>(initialWeatherData);
  const [showChart, setShowChart] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedWeatherData, setSelectedWeatherData] = useState(null);

  const openModalWithWeatherData = (weatherData: any) => {
    setSelectedWeatherData(weatherData);
    setModalVisible(true);
  };

  useEffect(() => {
    const initPreferences = async () => {
      try {
        const db: any = await connectToDatabase();
        await createTable(db);
        const loadedData = await loadData(db);
        if (loadedData) {
          setSelectedCity(loadedData.city);
          setSelectedPeriod(loadedData.period);
        }
      } catch (error) {
        console.log("Error initializing preferences", error);
      }
    };
    initPreferences();
  }, []);

  const handleSavePreferences = async ({
    city,
    period,
  }: {
    city: string;
    period: string;
  }) => {
    try {
      const db: any = await connectToDatabase();
      await createTable(db);
      await savePreferences(db, { id: 1, city, period });
      console.log("Preferences saved/updated");
    } catch (error) {
      console.log("Error saving/updating preferences", error);
    }
  };

  const handleCityChange = async (newCity: string) => {
    setSelectedCity(newCity);
    await handleSavePreferences({ city: newCity, period: selectedPeriod });
  };

  const handlePeriodChange = async (newPeriod: string) => {
    setSelectedPeriod(newPeriod);
    await handleSavePreferences({
      city: selectedCity,
      period: newPeriod,
    });
  };

  const cities = [
    {
      label: "Warszawa",
      lat: 52.229676,
      lon: 21.012229,
    },
    {
      label: "Kraków",
      lat: 50.064651,
      lon: 19.944981,
    },
    {
      label: "Łódź",
      lat: 51.759445,
      lon: 19.457216,
    },
    {
      label: "Wrocław",
      lat: 51.107883,
      lon: 17.038538,
    },
    {
      label: "Poznań",
      lat: 52.406376,
      lon: 16.925167,
    },
    {
      label: "Gdańsk",
      lat: 54.352025,
      lon: 18.646638,
    },
  ];

  const periods = [
    {
      label: "Godzinowo 24 godziny",
      value: "hourly",
    },
    {
      label: "Dobowo 8 dni",
      value: "daily",
    },
  ];

  const fetchWeatherData = async () => {
    const cityInfo = cities.find((city) => city.label === selectedCity);
    const period = periods.find((p) => p.value === selectedPeriod)?.value;
    console.log("Fetching weather data for: ", cityInfo, period);

    if (!cityInfo || !period) {
      console.log("City or period not selected");
      return;
    }

    const API_KEY = "a1f0723b1e4d4c462b2c803ba072a0cc";
    const url = `https://api.openweathermap.org/data/3.0/onecall?lat=${cityInfo.lat}&lon=${cityInfo.lon}&units=metric&exclude=current,alerts&appid=${API_KEY}`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      console.log("API Response:", data);

      let newWeatherData = { ...initialWeatherData };
      if (period === "hourly") {
        newWeatherData.hourly = data.hourly.map((item: any) => ({
          date: new Date(item.dt * 1000).toLocaleString(),
          temperature: item.temp,
          humidity: item.humidity,
          weatherType: item.weather[0].main,
          extendedData: {
            pressure: item.pressure,
            dewPoint: item.dew_point,
            clouds: item.clouds,
            windSpeed: item.wind_speed,
            windGust: item.wind_gust,
            windDirection: item.wind_deg,
          },
        }));
      } else if (period === "daily") {
        newWeatherData.daily = data.daily.map((item: any) => ({
          date: new Date(item.dt * 1000).toLocaleDateString(),
          temperature: item.temp.day,
          humidity: item.humidity,
          weatherType: item.weather[0].main,
          extendedData: {
            pressure: item.pressure,
            dewPoint: item.dew_point,
            clouds: item.clouds,
            windSpeed: item.wind_speed,
            windGust: item.wind_gust,
            windDirection: item.wind_deg,
          },
        }));
      }
      setWeatherData(newWeatherData);
    } catch (error) {
      console.error("Error fetching weather data: ", error);
    }
  };

  useEffect(() => {
    console.log(
      "Weather data changed: ",
      selectedPeriod,
      weatherData[selectedPeriod]
    );
  }, [weatherData]);

  const nth = 5;
  const chartTempData = {
    labels: weatherData[selectedPeriod]?.map((item, index) =>
      index % nth === 0
        ? item.date.split(" ")[selectedPeriod === "hourly" ? 1 : 0]
        : ""
    ),
    datasets: [
      {
        data: weatherData[selectedPeriod]?.map((item) => item.temperature),
      },
    ],
  };

  const chartHumidityData = {
    labels: weatherData[selectedPeriod]?.map((item, index) =>
      index % nth === 0
        ? item.date.split(" ")[selectedPeriod === "hourly" ? 1 : 0]
        : ""
    ),
    datasets: [
      {
        data: weatherData[selectedPeriod]?.map((item) => item.humidity),
      },
    ],
  };

  const chartTempConfig = {
    backgroundGradientFrom: "#fff",
    backgroundGradientTo: "#fff",
    decimalPlaces: 1,
    propsForLabels: {
      rotation: 45,
      fontSize: 10,
    },
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  };

  const chartHumidityConfig = {
    backgroundGradientFrom: "#fff",
    backgroundGradientTo: "#fff",
    decimalPlaces: 1,
    propsForLabels: {
      rotation: 45,
      fontSize: 10,
    },
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  };

  return (
    <View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>
              Szczegółowe dane pogodowe dla {selectedCity} dnia{" "}
              {selectedWeatherData && selectedWeatherData.date}
            </Text>
            {selectedWeatherData && (
              <>
                <Text>Temperatura: {selectedWeatherData.temperature}°</Text>
                <Text>Wilgotność: {selectedWeatherData.humidity}%</Text>
                <Text>
                  Ciśnienie: {selectedWeatherData.extendedData.pressure} hPa
                </Text>
                <Text>
                  Punkt rosy: {selectedWeatherData.extendedData.dewPoint}°
                </Text>
                <Text>
                  Zachmurzenie: {selectedWeatherData.extendedData.clouds}%
                </Text>
                <Text>
                  Prędkość wiatru: {selectedWeatherData.extendedData.windSpeed}{" "}
                  m/s
                </Text>
                <Text>
                  Poryw wiatru:{" "}
                  {selectedWeatherData.extendedData.windGust
                    ? `${selectedWeatherData.extendedData.windGust} m/s`
                    : "brak"}
                </Text>
                <Text>
                  Kierunek wiatru:{" "}
                  {selectedWeatherData.extendedData.windDirection}°
                </Text>
                <Text>Typ pogody: {selectedWeatherData.weatherType}</Text>
                <Button
                  title="Close"
                  onPress={() => setModalVisible(!modalVisible)}
                />
              </>
            )}
          </View>
        </View>
      </Modal>
      <View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingHorizontal: 10,
          }}
        >
          <Text>Wybierz okres:</Text>
          <Select
            selectedValue={selectedPeriod}
            minWidth="250"
            accessibilityLabel="Choose Service"
            placeholder="Choose Service"
            _selectedItem={{
              bg: "teal.100",
              endIcon: <CheckIcon size="5" />,
            }}
            mt={1}
            onValueChange={(itemValue) => {
              handlePeriodChange(itemValue);
            }}
          >
            {periods.map((period) => (
              <Select.Item
                key={period.value}
                label={period.label}
                value={period.value}
              />
            ))}
          </Select>
        </View>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingHorizontal: 10,
          }}
        >
          <Text>Wybierz miasto:</Text>
          <Select
            selectedValue={selectedCity}
            minWidth="250"
            accessibilityLabel="Wybierz miasto"
            placeholder="Wybierz miasto"
            _selectedItem={{
              bg: "teal.100",
              endIcon: <CheckIcon size="5" />,
            }}
            mt={1}
            onValueChange={(itemValue) => handleCityChange(itemValue)}
          >
            {cities.map((city) => (
              <Select.Item
                key={city.label}
                label={city.label}
                value={city.label}
              />
            ))}
          </Select>
        </View>
      </View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingHorizontal: 10,
        }}
      >
        <Button title="Pobierz dane" onPress={fetchWeatherData} />
        <Button
          title={showChart ? "Pokaż liste" : "Pokaż wykres"}
          onPress={() => setShowChart(!showChart)}
        />
      </View>

      {showChart ? (
        <ScrollView>
          <Text>Temperatura w czasie</Text>
          {weatherData[selectedPeriod] &&
          weatherData[selectedPeriod].length > 0 ? (
            <>
              <LineChart
                data={chartTempData}
                width={390}
                height={500}
                chartConfig={chartTempConfig}
              />
              <Text>Wilgotność w czasie</Text>
              <LineChart
                data={chartHumidityData}
                width={390}
                height={500}
                chartConfig={chartHumidityConfig}
              />
            </>
          ) : (
            <Text>Brak danych</Text>
          )}
        </ScrollView>
      ) : (
        <ScrollView
          style={{
            height: 500,
            overflow: "scroll",
          }}
        >
          {weatherData[selectedPeriod]?.map((item, index) => (
            <TouchableWithoutFeedback
              key={index}
              onPress={() => openModalWithWeatherData(item)}
            >
              <View
                style={{
                  padding: 10,
                  borderBottomWidth: 1,
                  borderBottomColor: "#ccc",
                }}
              >
                <Text>Data: {item.date}</Text>
                <Text>Temperatura: {item.temperature}°</Text>
                <Text>Wilgotność: {item.humidity}%</Text>
                <Text>Typ pogody: {item.weatherType}</Text>
              </View>
            </TouchableWithoutFeedback>
          ))}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
});
