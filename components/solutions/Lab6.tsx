import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, Image } from "react-native";
import * as SQLite from "expo-sqlite";
import Toast from "react-native-toast-message";
import classNames from "classnames";

type DataType = {
  id: number;
  title: string;
  description: string;
  imageUri: string;
};

const connectToDatabase = async () => {
  return new Promise((resolve, reject) => {
    try {
      const db = SQLite.openDatabase("tasks_table2.db");
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
        "CREATE TABLE IF NOT EXISTS tasks_table2 (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, description TEXT, imageUri TEXT)",
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

const insertData = async (db: SQLite.SQLiteDatabase, data: DataType) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "INSERT INTO tasks_table2 (title, description, imageUri) VALUES (?, ?, ?)",
        [data.title, data.description, data.imageUri],
        () => {
          console.log("Data inserted");
          resolve(true);
        },
        (_, error) => {
          console.log("Error inserting data", error);
          reject(error);
          return false;
        }
      );
    });
  });
};

const loadData = async (db: SQLite.SQLiteDatabase) => {
  return new Promise<DataType[]>((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM tasks_table2",
        [],
        (_, results) => {
          let temp: DataType[] = [];
          for (let i = 0; i < results.rows.length; i++) {
            temp.push(results.rows.item(i));
          }
          console.log("Data loaded");
          resolve(temp);
        },
        (_, error) => {
          console.log("Error loading data", error);
          reject(error);
          return false;
        }
      );
    });
  });
};

const mockData: DataType[] = [
  {
    id: 1,
    title: "Zrobić zakupy",
    description: "Kupić chleb, masło, szynkę",
    imageUri:
      "https://randomwordgenerator.com/img/picture-generator/54e3d5434d53af14f1dc8460962e33791c3ad6e04e507749712a72dd9345c2_640.jpg",
  },
  {
    id: 2,
    title: "Nakarmić kota",
    description: "Kot głodny",
    imageUri:
      "https://randomwordgenerator.com/img/picture-generator/52e1d64a435aae14f1dc8460962e33791c3ad6e04e507441722a72dd904ac1_640.jpg",
  },
  {
    id: 3,
    title: "Zrobić pranie",
    description: "Prać białe rzeczy",
    imageUri:
      "https://randomwordgenerator.com/img/picture-generator/5ee2d1404d52b10ff3d8992cc12c30771037dbf85254784a70287fd2924f_640.jpg",
  },
  {
    id: 4,
    title: "Zrobić zakupy 2",
    description: "Kupić chleb, masło, szynkę 2",
    imageUri:
      "https://randomwordgenerator.com/img/picture-generator/lance-asper-BtNGtteMH0c-unsplash.jpg",
  },
  {
    id: 5,
    title: "Zrobić zakupy 3",
    description: "Kupić chleb, masło, szynkę 3",
    imageUri:
      "https://randomwordgenerator.com/img/picture-generator/g945e90b94016cc464cc817190eaf574fb026608d22841d76ddecfb32facebf9651b16faf2f89725c77358343a9afe384_640.jpg",
  },
  {
    id: 6,
    title: "Zrobić zakupy 4",
    description: "Kupić chleb, masło, szynkę 4",
    imageUri:
      "https://randomwordgenerator.com/img/picture-generator/57e5d04a4a53ac14f1dc8460962e33791c3ad6e04e507749712e79d2934cc4_640.jpg",
  },
  {
    id: 7,
    title: "Zrobić zakupy 5",
    description: "Kupić chleb, masło, szynkę 5",
    imageUri:
      "https://randomwordgenerator.com/img/picture-generator/57e8dc474256ab14f1dc8460962e33791c3ad6e04e507440702d79d29444cc_640.jpg",
  },
  {
    id: 8,
    title: "Zrobić zakupy 6",
    description: "Kupić chleb, masło, szynkę 6",
    imageUri:
      "https://randomwordgenerator.com/img/picture-generator/55e8d4474c50a514f1dc8460962e33791c3ad6e04e507440762879dc9144c2_640.jpg",
  },
  {
    id: 9,
    title: "Zrobić zakupy 7",
    description: "Kupić chleb, masło, szynkę 7",
    imageUri:
      "https://randomwordgenerator.com/img/picture-generator/57e9d2454f51a414f1dc8460962e33791c3ad6e04e507441722872d69f4bc6_640.jpg",
  },
  {
    id: 10,
    title: "Zrobić zakupy 8",
    description: "Kupić chleb, masło, szynkę 8",
    imageUri:
      "https://randomwordgenerator.com/img/picture-generator/55e9d14a4957b10ff3d8992cc12c30771037dbf85254794075297bdd9f45_640.jpg",
  },
];

export const Lab6 = () => {
  const [data, setData] = useState<DataType[]>([]);

  useEffect(() => {
    let db: SQLite.SQLiteDatabase;

    const setupDatabase = async () => {
      try {
        db = (await connectToDatabase()) as SQLite.SQLiteDatabase;
        await createTable(db);
        const existingData = await loadData(db);
        if (existingData.length === 0) {
          for (const item of mockData) {
            await insertData(db, item);
          }
        }
        const loadedData = await loadData(db);
        setData(loadedData);
      } catch (error) {
        console.error("Database operation error", error);
      }
    };

    setupDatabase();

    return () => {
      if (db) {
        db.close();
        console.log("Database closed");
      }
    };
  }, []);

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      onPress={() => {
        Toast.show({
          type: "success",
          text1: `Wybrano: ${item.title}`,
          text2: item.description,
        });
      }}
      className={`flex-row p-5 border-b border-gray-300`}
    >
      <Image
        className="w-[70px] h-[70px] mr-[10px]"
        source={{
          uri: item.imageUri,
        }}
      />
      <View className="flex-1">
        <Text className={classNames(`text-lg font-bold`)}>{item.title}</Text>
        <Text className="text-sm">{item.description}</Text>
      </View>
      <View className="flex-1">
        <Text className={classNames(`text-sm font-bold`)}>
          {JSON.stringify(item)}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 mt-[20px]">
      {data && (
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
        />
      )}
      <Toast position="bottom" />
    </View>
  );
};
