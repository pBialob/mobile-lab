import classNames from "classnames";
import { Button, Text, TextInput, View } from "react-native";

export const Lab1Layout1 = () => {
  let squareCounter = 0;

  return (
    <View className="h-full w-full flex-1 gap-4 justify-center items-start">
      {[...Array(4)].map((_, rowIndex) => (
        <View key={rowIndex} className="flex flex-row gap-4">
          {[...Array(rowIndex + 1)].map((_, squareIndex) => {
            squareCounter += 1;
            return (
              <View
                key={squareIndex}
                className={classNames("w-12 h-12", {
                  "bg-red-500": rowIndex === 0,
                  "bg-blue-500": rowIndex === 1,
                  "bg-green-500": rowIndex === 2,
                  "bg-yellow-500": rowIndex === 3,
                })}
              >
                <Text className="text-center text-white">{squareCounter}</Text>
              </View>
            );
          })}
        </View>
      ))}
    </View>
  );
};

export const Lab1Layout2 = () => (
  <View className="h-full w-full flex-1 gap-4 justify-center items-start">
    <View className="w-full flex items-center">
      <View className={classNames("w-1/3 h-12 bg-blue-400", {})}>
        <Text className="text-center text-white">{3}</Text>
      </View>
    </View>
    <View className="flex flex-row w-full justify-end">
      <View className={classNames("w-1/3 h-12 bg-red-400", {})}>
        <Text className="text-center text-white">{3}</Text>
      </View>
      <View className={classNames("w-1/3 h-12 bg-red-500", {})}>
        <Text className="text-center text-white">{3}</Text>
      </View>
    </View>
    <View className="flex flex-row w-full">
      <View className={classNames("w-1/3 h-12 bg-yellow-400", {})}>
        <Text className="text-center text-white">{3}</Text>
      </View>
      <View className={classNames("w-1/3 h-12 bg-yellow-500", {})}>
        <Text className="text-center text-white">{3}</Text>
      </View>
      <View className={classNames("w-1/3 h-12 bg-yellow-600", {})}>
        <Text className="text-center text-white">{3}</Text>
      </View>
    </View>
  </View>
);
