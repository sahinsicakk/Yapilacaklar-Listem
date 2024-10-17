import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "@/app/(tabs)/index";
import LoginScreen from "@/app/(tabs)/loginScreen";
import FirstScreen from "./(tabs)/first";
import RegisterScreen from "./(tabs)/RegisterScreen";


const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer independent={true}>
      <Stack.Navigator initialRouteName="First"
      screenOptions={{headerShown:false}}
      >
        <Stack.Screen name="Home"  component={HomeScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="First" component={FirstScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;

const styles = StyleSheet.create({});
