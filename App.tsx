import { Picker } from "@react-native-picker/picker";
import classNames from "classnames";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import { Button, Text, TextInput, View } from "react-native";
import { Lab1Layout1, Lab1Layout2 } from "./components/solutions/Lab1";
import { Lab2 } from "./components/solutions/Lab2";
import { Lab3 } from "./components/solutions/Lab3";
import { Lab4 } from "./components/solutions/Lab4";
import { Lab5 } from "./components/solutions/Lab5";
import { Lab6 } from "./components/solutions/Lab6";
import { Project } from "./components/solutions/Project";
import { NativeBaseProvider } from "native-base";

export default function App() {
  const [currentLab, setCurrentLab] = useState("Lab1Layout1");

  return (
    <NativeBaseProvider>
      <View className="flex flex-col items-center justify-center bg-gray-100 h-full w-full">
        <View className="w-2/3 h-1/8 bg-white rounded-lg overflow-hidden shadow">
          <Picker
            selectedValue={currentLab}
            onValueChange={(itemValue) => setCurrentLab(itemValue)}
          >
            <Picker.Item label="Lab 1 Layout 1" value="Lab1Layout1" />
            <Picker.Item label="Lab 1 Layout 2" value="Lab1Layout2" />
            <Picker.Item label="Lab 2" value="Lab2" />
            <Picker.Item label="Lab 3" value="Lab3" />
            <Picker.Item label="Lab 4" value="Lab4" />
            <Picker.Item label="Lab 5" value="Lab5" />
            <Picker.Item label="Lab 6" value="Lab6" />
            <Picker.Item label="Projekt" value="Project" />
          </Picker>
        </View>
        <View className="h-4/5 w-full">
          {currentLab === "Lab1Layout1" && <Lab1Layout1 />}
          {currentLab === "Lab1Layout2" && <Lab1Layout2 />}
          {currentLab === "Lab2" && <Lab2 />}
          {currentLab === "Lab3" && <Lab3 />}
          {currentLab === "Lab4" && <Lab4 />}
          {currentLab === "Lab5" && <Lab5 />}
          {currentLab === "Lab6" && <Lab6 />}
          {currentLab === "Project" && <Project />}
        </View>
      </View>
    </NativeBaseProvider>
  );
}
