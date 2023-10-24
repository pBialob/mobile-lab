import { useState } from "react";
import { View, TextInput, Button } from "react-native";

export const Lab2 = () => {
  {
    /* Calculator TODO */
  }
  const [result, setResult] = useState({
    firstNumber: "",
    secondNumber: "",
    operator: "",
  });

  const setNumber = (number: string) => {
    if (result.operator === "") {
      setResult({ ...result, firstNumber: result.firstNumber + number });
    } else {
      setResult({ ...result, secondNumber: result.secondNumber + number });
    }
  };

  const calculate = () => {
    switch (result.operator) {
      case "+":
        setResult({
          firstNumber: `${
            parseInt(result.firstNumber) + parseInt(result.secondNumber)
          }`,
          secondNumber: ``,
          operator: "",
        });
        break;
      case "-":
        setResult({
          firstNumber: `${
            parseInt(result.firstNumber) - parseInt(result.secondNumber)
          }`,
          secondNumber: ``,
          operator: "",
        });
        break;
      case "*":
        setResult({
          firstNumber: `${
            parseInt(result.firstNumber) * parseInt(result.secondNumber)
          }`,
          secondNumber: ``,
          operator: "",
        });
        break;
      case "/":
        setResult({
          firstNumber: `${
            parseInt(result.firstNumber) / parseInt(result.secondNumber)
          }`,
          secondNumber: ``,
          operator: "",
        });
        break;
      default:
        break;
    }
  };

  return (
    <View className="h-full w-full flex-1 gap-4 justify-center items-start">
      <TextInput
        className="w-full h-12 bg-gray-200 rounded-lg text-center text-2xl"
        value={
          result.operator === "" ? result.firstNumber : result.secondNumber
        }
      />
      <View className="flex flex-row w-full justify-center">
        <View className="w-1/4">
          <Button title="1" onPress={() => setNumber("1")} />
        </View>
        <View className="w-1/4">
          <Button title="2" onPress={() => setNumber("2")} />
        </View>
        <View className="w-1/4">
          <Button title="3" onPress={() => setNumber("3")} />
        </View>
        <View className="w-1/4">
          <Button
            title="+"
            onPress={() =>
              setResult({
                firstNumber: result.firstNumber,
                secondNumber: result.secondNumber,
                operator: "+",
              })
            }
          />
        </View>
      </View>
      <View className="flex flex-row w-full justify-center">
        <View className="w-1/4">
          <Button title="4" onPress={() => setNumber("4")} />
        </View>
        <View className="w-1/4">
          <Button title="5" onPress={() => setNumber("5")} />
        </View>
        <View className="w-1/4">
          <Button title="6" onPress={() => setNumber("6")} />
        </View>
        <View className="w-1/4">
          <Button
            title="-"
            onPress={() =>
              setResult({
                firstNumber: result.firstNumber,
                secondNumber: result.secondNumber,
                operator: "-",
              })
            }
          />
        </View>
      </View>
      <View className="flex flex-row w-full justify-center">
        <View className="w-1/4">
          <Button title="7" onPress={() => setNumber("7")} />
        </View>
        <View className="w-1/4">
          <Button title="8" onPress={() => setNumber("8")} />
        </View>
        <View className="w-1/4">
          <Button title="9" onPress={() => setNumber("9")} />
        </View>
        <View className="w-1/4">
          <Button
            title="*"
            onPress={() =>
              setResult({
                firstNumber: result.firstNumber,
                secondNumber: result.secondNumber,
                operator: "*",
              })
            }
          />
        </View>
      </View>
      <View className="flex flex-row w-full justify-center">
        <View className="w-1/4">
          <Button title="0" onPress={() => setNumber("0")} />
        </View>
        <View className="w-1/4">
          <Button title="=" onPress={() => calculate()} />
        </View>
        <View className="w-1/4">
          <Button
            title="/"
            onPress={() =>
              setResult({
                firstNumber: result.firstNumber,
                secondNumber: result.secondNumber,
                operator: "/",
              })
            }
          />
        </View>
        <View className="w-1/4">
          <Button
            title="C"
            onPress={() =>
              setResult({
                firstNumber: "",
                secondNumber: "",
                operator: "",
              })
            }
          />
        </View>
      </View>
    </View>
  );
};
