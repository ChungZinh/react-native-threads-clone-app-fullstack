import {
  Button,
  Image,
  Platform,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useContext, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { UserType } from "../UserContext";
import axios from "axios";

const ThreadsScreen = () => {
  const platForm = Platform.OS === "android";
  const [content, setContent] = useState("");
  const { userId, setUserId } = useContext(UserType);

  const handlePost = () => {
    const postData = {
      userId,
    };

    if (content) {
      postData.content = content;
    }
 
    axios
      .post("http://10.0.2.2:3000/create-post", postData)
      .then((res) => setContent(""))
      .catch((err) => console.log(err));
  };

  return (
    <SafeAreaView style={{ marginTop: platForm ? 60 : 0 }}>
      <StatusBar />
      <View className="flex-row px-4 items-center space-x-4">
        <Image
          className="w-10 h-10 rounded-3xl"
          style={{ resizeMode: "contain" }}
          source={{
            uri: "https://cdn-icons-png.flaticon.com/128/149/149071.png",
          }}
        />
        <Text>Chung_Vinh</Text>
      </View>

      <View className=" flex-row px-4 mt-6">
        <TextInput
          value={content}
          onChangeText={(text) => setContent(text)}
          placeholderTextColor={"black"}
          placeholder="Type your message..."
        />
      </View>

      <TouchableOpacity
        onPress={() => handlePost()}
        className="self-center px-6 py-3 rounded-lg mt-6 bg-blue-500"
      >
        <Text className="text-white font-semibold">Share Post</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default ThreadsScreen;
