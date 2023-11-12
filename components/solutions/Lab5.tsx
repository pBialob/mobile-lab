import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import classNames from "classnames";

type Task = {
  id: string;
  title: string;
  description: string;
  completed: boolean;
};

const mockTasks: Array<Task> = [
  {
    id: "1",
    title: "Zrobić zakupy",
    description: "Kupić chleb, masło, szynkę",
    completed: false,
  },
  {
    id: "2",
    title: "Nakarmić kota",
    description: "Kot głodny",
    completed: false,
  },
  {
    id: "3",
    title: "Zrobić pranie",
    description: "Prać białe rzeczy",
    completed: false,
  },
];

export const Lab5 = () => {
  const [tasks, setTasks] = useState<Array<Task>>([]);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const storedTasks = await AsyncStorage.getItem("tasks");
      if (storedTasks === null) {
        await AsyncStorage.setItem("tasks", JSON.stringify(mockTasks));
        setTasks(mockTasks);
      } else {
        setTasks(JSON.parse(storedTasks));
      }
    } catch (e) {
      console.error("Failed to load tasks", e);
    }
  };

  const toggleTaskCompletion = async (id: string) => {
    try {
      const newTasks = tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      );
      setTasks(newTasks);
      await AsyncStorage.setItem("tasks", JSON.stringify(newTasks));
    } catch (e) {
      console.error("Failed to toggle task", e);
    }
  };

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      className={`flex-row p-5 border-b border-gray-300`}
      onPress={() => toggleTaskCompletion(item.id)}
    >
      <Image
        className="w-[30px] h-[30px] mr-[10px]"
        source={{
          uri: item.completed
            ? "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Check_green_icon.svg/2048px-Check_green_icon.svg.png"
            : "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cc/Cross_red_circle.svg/1024px-Cross_red_circle.svg.png",
        }}
      />
      <View className="flex-1">
        <Text
          className={classNames(
            `text-lg font-bold`,
            item.completed && `text-gray-500 line-through`
          )}
        >
          {item.title}
        </Text>
        <Text className="text-sm">{item.description}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 mt-[20px]">
      <FlatList
        data={tasks}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};
