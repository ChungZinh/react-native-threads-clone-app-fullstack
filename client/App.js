import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import StackNavigator from "./navigation/StackNavigator";
import { UserContext, UserType } from "./UserContext";
import { useState } from "react";

export default function App() {
  const [userId, setUserId] = useState(null);
 
  return (
    <>
      <UserContext>
        <StackNavigator />
      </UserContext>
    </>
  );
}
