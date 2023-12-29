import { Image, Platform, SafeAreaView, ScrollView, Text, View } from "react-native";
import React, { useCallback, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import jwt_decode from "jwt-decode";
import { UserType } from "../UserContext";
import axios from "axios";
import { AntDesign } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
const HomeScreen = () => {
  const { userId, setUserId } = useContext(UserType);
  const [posts, setPosts] = useState([]);
  const platForm = Platform.OS === "android";

  useEffect(() => {
    const fetchUser = async () => {
      const token = await AsyncStorage.getItem("authToken");
      const decodedToken = jwt_decode(token);
      const userId = decodedToken.userId;
      setUserId(userId);
    };

    fetchUser();
  }, []);

  useEffect(() => {
    fetchPost();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchPost();
    }, [])
  );

  const handleLike = async (postId) => {
    try {
      const res = await axios.put(
        `http://10.0.2.2:3000/post/${postId}/${userId}/like`
      );
      const updatePost = res.data;

      const updatePosts = posts?.map((post) =>
        post?._id === updatePost._id ? updatePost : post
      );

      setPosts(updatePosts);
    } catch (error) {
      console.log("error: ", error);
    }
  };

  const fetchPost = async () => {
    try {
      const res = await axios.get("http://10.0.2.2:3000/get-posts");
      setPosts(res.data);
    } catch (error) {
      console.log("err: ", error);
    }
  };
  return (
    <SafeAreaView style={{ marginTop: platForm ? 50 : "" }}>
      <View className="border-b border-gray-400 pb-3 shadow mb">
        <Image
          className="w-16 h-10 self-center"
          style={{ resizeMode: "contain" }}
          source={{
            uri: "https://freelogopng.com/images/all_img/1688663386threads-logo-transparent.png",
          }}
        />
      </View>

      <ScrollView>
        <View className=" px-2 ">
          {posts.map((post, index) => (
            <View className="border-b border-gray-400 shadow shadow-gray-400 px-4 mb-2">
              <View className="flex-row pt-4  space-x-3 " key={post._id}>
                <Image
                  className="w-12 h-12 rounded-3xl"
                  style={{ resizeMode: "contain" }}
                  source={{
                    uri: "https://cdn-icons-png.flaticon.com/128/149/149071.png",
                  }}
                />

                <View>
                  <View>
                    <Text className="font-bold text-lg">
                      {post?.user?.name}
                    </Text>
                    <Text>{post?.content}</Text>
                  </View>

                  <View className="flex-row  space-x-6 mt-2">
                    {post?.likes?.includes(userId) ? (
                      <AntDesign
                        onPress={() => handleLike(post?._id)}
                        name="heart"
                        size={18}
                        color="black"
                      />
                    ) : (
                      <AntDesign
                        onPress={() => handleLike(post?._id)}
                        name="hearto"
                        size={18}
                        color="black"
                      />
                    )}

                    <FontAwesome name="comment-o" size={18} color="black" />
                    <AntDesign name="sharealt" size={18} color="black" />
                  </View>

                  <Text className=" text-gray-400 py-2  text-xs ">
                    {post?.likes?.length} likes • {post?.replies?.length} reply
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;
