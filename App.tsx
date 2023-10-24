import { Picker } from "@react-native-picker/picker";
import classNames from "classnames";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import { Button, Text, TextInput, View } from "react-native";
import { Lab1Layout1, Lab1Layout2 } from "./components/solutions/Lab1";
import { Lab2 } from "./components/solutions/Lab2";
import { Lab3 } from "./components/solutions/Lab3";

export default function App() {
  const [currentLab, setCurrentLab] = useState("Lab1Layout1");

  return (
    <View className="flex flex-col items-center justify-center bg-gray-100 h-full w-full">
      <View className="w-2/3 h-1/5 bg-white rounded-lg overflow-hidden shadow">
        <Picker
          selectedValue={currentLab}
          onValueChange={(itemValue) => setCurrentLab(itemValue)}
        >
          <Picker.Item label="Lab 1 Layout 1" value="Lab1Layout1" />
          <Picker.Item label="Lab 1 Layout 2" value="Lab1Layout2" />
          <Picker.Item label="Lab 2" value="Lab2" />
          <Picker.Item label="Lab 3" value="Lab3" />
        </Picker>
      </View>
      <View className="h-3/5 w-full">
        {currentLab === "Lab1Layout1" && <Lab1Layout1 />}
        {currentLab === "Lab1Layout2" && <Lab1Layout2 />}
        {currentLab === "Lab2" && <Lab2 />}
        {currentLab === "Lab3" && <Lab3 />}
      </View>
    </View>
  );
}
