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
      style={styles.item}
      onPress={() => toggleTaskCompletion(item.id)}
    >
      <Image
        style={styles.image}
        source={{
          uri: item.completed
            ? "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Check_green_icon.svg/2048px-Check_green_icon.svg.png"
            : "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cc/Cross_red_circle.svg/1024px-Cross_red_circle.svg.png",
        }}
      />
      <View style={styles.textContainer}>
        <Text style={[styles.title, item.completed && styles.completed]}>
          {item.title}
        </Text>
        <Text style={styles.description}>{item.description}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={tasks}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20,
  },
  item: {
    flexDirection: "row",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  image: {
    width: 30,
    height: 30,
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
  },
  description: {
    fontSize: 14,
  },
  completed: {
    textDecorationLine: "line-through",
    color: "grey",
  },
});
