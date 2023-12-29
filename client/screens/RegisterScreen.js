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
import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { MaterialIcons } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
const RegisterScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const navigation = useNavigation();

  const handleRegister = () => {
    const user = {
      name: name,
      email: email,
      password: password,
    };

    axios
      .post("http://10.0.2.2:3000/register", user)
      .then((res) => {
        console.log(res);
        Alert.alert(
          "Registration successful",
          "you have been registered successfully"
        );
        setName("");
        setEmail("");
        setPassword("");
      })
      .catch((err) => {
        Alert.alert(
          "Registration failer",
          "An error occurred during registrantion"
      );
      console.log("error", err);
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
            Register to Your Account
          </Text>
        </View>

        <View className="mt-6 space-y-8">
          <View className="flex-row border rounded-xl py-3 px-3 space-x-4 mx-6 border-gray-300">
            <Ionicons name="person" size={24} color="gray" />
            <TextInput
              value={name}
              onChangeText={(text) => setName(text)}
              className="pr-10"
              style={{ color: "gray", fontSize: name ? 16 : 16 }}
              placeholder="Enter your name"
            />
          </View>

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

        {/* <View className="px-6 flex-row justify-between mt-3">
          <Text>Keep me logged in</Text>
          <Text style={{ fontWeight: 500, color: "#007FFF" }}>
            Forgot password
          </Text>
        </View> */}

        <Pressable
          onPress={() => handleRegister()}
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
            Register
          </Text>
        </Pressable>

        <Pressable
          onPress={() => navigation.navigate("Login")}
          className="self-center mt-3"
        >
          <Text style={{ fontSize: wp(4), color: "gray" }}>
            Already have an account?{" "}
            <Text style={{ color: "black" }}>Sign up</Text>
          </Text>
        </Pressable>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({});
