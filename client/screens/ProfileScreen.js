import { Image, Platform, Pressable, SafeAreaView, StyleSheet, Text, View } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { UserType } from "../UserContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

const ProfileScreen = () => {
  const { userId, setUserId } = useContext(UserType);
  const platForm = Platform.OS === "android";
  const [user, setUser] = useState("");
  const navigation = useNavigation();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`http://10.0.2.2:3000/profile/${userId}`);
        const { user } = res.data;
        setUser(user);
      } catch (error) {
        console.log("error: ", error);
      }
    };

    fetchProfile();
  }, []);

  const handleLogout = () => {
    clearAuthToken();
  }

  const clearAuthToken = async () => {
    await AsyncStorage.removeItem('authToken');
    console.log('Cleared auth token');
    navigation.navigate('Login');
  }

  return (
    <SafeAreaView style={{ marginTop: platForm ? 50 : "" }}>
      <View className="px-4">
        <View className="flex-row mb-4 space-x-10 items-center ">
          <Text className="text-lg font-semibold">{user?.name}</Text>
          <View className="px-3 py-1 self-center rounded-lg  font-medium bg-gray-300">
            <Text>Threads.net</Text>
          </View>
        </View>

        <View className='flex-row space-x-4'>
          <Image
            className="w-14 h-14 rounded-3xl"
            style={{ resizeMode: "contain" }}
            source={{
              uri: "https://cdn-icons-png.flaticon.com/128/149/149071.png",
            }}
          />

          <View>
              <Text>Basic</Text>
              <Text>Mobile App Developer</Text>
              <Text>No Pain No Gain</Text>
          </View>
        </View>


        <Text className='mt-4 text-gray-600'>{user?.followers?.length} followers</Text>
          

        
        <View className='flex-row justify-around mt-6'>
          <Pressable
            onPress={() => handleEdit()}
           className='w-40 py-3 items-center border shadow shadow-gray-400'>
            <Text>Edit profile</Text>
          </Pressable>

          <Pressable
            onPress={() => handleLogout()}
           className='w-40 py-2 items-center border'>
            <Text>Logout</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({});
