import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { MaterialIcons } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import axois, { all } from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation();

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const token = await AsyncStorage.getItem("authToken");

        if (token) {
          setTimeout(() => {
            navigation.navigate("Main");
          }, 400);
        }
      } catch (error) {
        console.log("error", error);
      }
    };
    checkLoginStatus();
  }, []);

  const handleLogin = () => {
    const user = {
      email: email,
      password: password,
    };

    axois
      .post("http://10.0.2.2:3000/login", user)
      .then((res) => {
        console.log(res);
        const token = res.data;
        console.log(token);
        AsyncStorage.setItem("authToken", token);
        navigation.navigate("Main");
      })
      .catch((err) => {
        Alert.alert("Login error");
        console.log("error: ", err);
      });
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar />
      <View className="mt-20 items-center">
        <Image
          style={{ width: wp(20), height: hp(20), resizeMode: "contain" }}
          source={{
            uri: "https://freelogopng.com/images/all_img/1688663386threads-logo-transparent.png",
          }}
        />
      </View>

      <KeyboardAvoidingView>
        <View className="items-center justify-center font-bold">
          <Text className="" style={{ fontSize: wp(5) }}>
            Login to Your Account
          </Text>
        </View>

        <View className="mt-6 space-y-8">
          <View className="flex-row border rounded-xl py-3 px-3 space-x-4 mx-6 border-gray-300">
            <MaterialIcons name="email" size={24} color="gray" />
            <TextInput
              value={email}
              onChangeText={(text) => setEmail(text)}
              className="pr-10"
              style={{ color: "gray", fontSize: email ? 16 : 16 }}
              placeholder="Enter your email"
            />
          </View>

          <View className="flex-row border rounded-xl py-3 px-3 space-x-4 mx-6 border-gray-300">
            <Entypo name="lock" size={24} color="gray" />
            <TextInput
              value={password}
              onChangeText={(text) => setPassword(text)}
              className="pr-10"
              style={{ color: "gray", fontSize: password ? 16 : 16 }}
              placeholder="Enter your password"
            />
          </View>
        </View>

        <View className="px-6 flex-row justify-between mt-3">
          <Text>Keep me logged in</Text>
          <Text style={{ fontWeight: 500, color: "#007FFF" }}>
            Forgot password
          </Text>
        </View>

        <Pressable
          onPress={() => handleLogin()}
          style={{ width: wp(50) }}
          className="bg-black self-center mt-20 py-3 rounded-lg"
        >
          <Text
            style={{
              color: "white",
              fontWeight: "bold",
              textAlign: "center",
              fontSize: wp(5),
            }}
          >
            Login
          </Text>
        </Pressable>

        <Pressable
          onPress={() => navigation.navigate("Register")}
          className="self-center mt-3"
        >
          <Text style={{ fontSize: wp(4), color: "gray" }}>
            Don't have an account?{" "}
            <Text style={{ color: "black" }}>Sign up</Text>
          </Text>
        </Pressable>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({});
