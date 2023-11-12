import React, { useEffect, useMemo } from "react";
import { View, Text, Button, TextInput, StyleSheet } from "react-native";

import RNDateTimePicker from "@react-native-community/datetimepicker";
import { RadioGroup } from "react-native-radio-buttons-group";
import { Dropdown, MultiSelect } from "react-native-element-dropdown";

import AsyncStorage from "@react-native-async-storage/async-storage";

export const Lab4 = () => {
  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [birthDate, setBirthDate] = React.useState<Date | undefined>(
    new Date()
  );
  const [sex, setSex] = React.useState<string | undefined>();
  const [street, setStreet] = React.useState("");
  const [houseNumber, setHouseNumber] = React.useState("");
  const [city, setCity] = React.useState("");
  const [zipCode, setZipCode] = React.useState("");
  const [hobbies, setHobbies] = React.useState<Array<string>>([]);

  const [showGatheredData, setShowGatheredData] = React.useState(false);

  const sexOptions = useMemo(
    () => [
      {
        id: "1",
        label: "Mężczyzna",
        value: "male",
      },
      {
        id: "2",
        label: "Kobieta",
        value: "female",
      },
    ],
    []
  );

  const hobbiesOptions = useMemo(
    () => [
      {
        label: "Sport",
        value: "sport",
      },
      {
        label: "Muzyka",
        value: "music",
      },
      {
        label: "Gry",
        value: "games",
      },
      {
        label: "Filmy",
        value: "movies",
      },
      {
        label: "Książki",
        value: "books",
      },
      {
        label: "Podróże",
        value: "travel",
      },
    ],
    []
  );

  useEffect(() => {
    loadData();
  }, []);

  const saveData = async () => {
    try {
      const userData = JSON.stringify({
        firstName,
        lastName,
        birthDate,
        sex,
        street,
        houseNumber,
        city,
        zipCode,
        hobbies,
      });
      await AsyncStorage.setItem("userData", userData);
    } catch (e) {
      console.log(e);
    }
  };

  const loadData = async () => {
    try {
      const userData = await AsyncStorage.getItem("userData");
      if (userData !== null) {
        const parsedData = JSON.parse(userData);
        setFirstName(parsedData.firstName);
        setLastName(parsedData.lastName);
        setBirthDate(new Date(parsedData.birthDate));
        setSex(parsedData.sex);
        setStreet(parsedData.street);
        setHouseNumber(parsedData.houseNumber);
        setCity(parsedData.city);
        setZipCode(parsedData.zipCode);
        setHobbies(parsedData.hobbies);
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <View className="h-full w-full">
      {showGatheredData && (
        <>
          <Text className="text-xl">
            Imię i nazwisko: {firstName} {lastName}
          </Text>
          <Text className="text-xl">
            Data urodzenia: {birthDate?.toDateString()}
          </Text>
          <Text className="text-xl">
            Adres: {street} {houseNumber}
          </Text>
          <Text className="text-xl">
            Płeć: {sexOptions.find((x) => x.id == sex)?.label}
          </Text>
          <Text className="text-xl">
            {city} {zipCode}
          </Text>
          <Text className="text-xl">Hobby:</Text>
          {hobbies.map((hobby) => (
            <Text className="text-xl">{hobby}</Text>
          ))}
        </>
      )}
      {!showGatheredData && (
        <View className="h-full w-full flex-col flex justify-start items-center gap-4 mt-4">
          <TextInput
            placeholder="First name"
            className="border-2 border-gray-400 rounded-md h-10 w-4/5 p-1"
            onChangeText={(text) => setFirstName(text)}
            defaultValue={firstName}
          />
          <TextInput
            placeholder="First name"
            className="border-2 border-gray-400 rounded-md h-10 w-4/5 p-1"
            onChangeText={(text) => setLastName(text)}
            defaultValue={lastName}
          />
          <View className="flex flex-row w-4/5 justify-between">
            <Text className="text-md">Birth date</Text>
            <RNDateTimePicker
              className="border-2 border-gray-400 rounded-md h-10 w-4/5 p-1"
              mode="date"
              display="default"
              onChange={(event, selectedDate) => setBirthDate(selectedDate)}
              value={birthDate || new Date()}
            />
          </View>
          <View className="flex flex-row w-4/5 justify-between items-center">
            <Text className="text-md">Płeć</Text>
            <RadioGroup
              radioButtons={sexOptions}
              onPress={(data) => setSex(data)}
              selectedId={sex}
              layout="row"
            />
          </View>

          <View className="w-full flex flex-row justify-center">
            <TextInput
              placeholder="Street"
              className="border-2 border-gray-400 rounded-md h-10 w-3/5 p-1 mr-1"
              onChangeText={(text) => setStreet(text)}
              defaultValue={street}
            />
            <TextInput
              placeholder="House number"
              className="border-2 border-gray-400 rounded-md h-10 w-1/5 p-1"
              onChangeText={(text) => setHouseNumber(text)}
              defaultValue={houseNumber}
            />
          </View>
          <View className="w-full flex flex-row justify-center">
            <TextInput
              placeholder="City"
              className="border-2 border-gray-400 rounded-md h-10 w-2/5 p-1 mr-1"
              onChangeText={(text) => setCity(text)}
              defaultValue={city}
            />
            <TextInput
              placeholder="Zip code"
              className="border-2 border-gray-400 rounded-md h-10 w-2/5 p-1"
              onChangeText={(text) => setZipCode(text)}
              defaultValue={zipCode}
            />
          </View>
          <View style={styles.container} className="w-full">
            <MultiSelect
              style={styles.dropdown}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              inputSearchStyle={styles.inputSearchStyle}
              iconStyle={styles.iconStyle}
              search
              data={hobbiesOptions}
              labelField="label"
              valueField="value"
              placeholder="Wybierz hobby"
              searchPlaceholder="Search..."
              value={hobbies}
              onChange={(item) => {
                setHobbies(item);
              }}
            />
          </View>
        </View>
      )}

      <Button
        onPress={() => {
          setShowGatheredData(!showGatheredData);
          saveData();
        }}
        title="Submit"
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        accessibilityLabel="Submit"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    padding: 16,
  },
  dropdown: {
    height: 50,
    borderColor: "gray",
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  icon: {
    marginRight: 5,
  },
  label: {
    position: "absolute",
    backgroundColor: "white",
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
});
