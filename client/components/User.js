import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import React, { useContext, useState } from "react";
import { UserType } from "../UserContext";

const User = ({ item }) => {
  const { userId, setUserId } = useContext(UserType);
  const [requestsSent, setRequestSent] = useState(false);
  const handleFollow = async (currentUserId, selectedUserId) => {
    try {
      const response = await fetch("http://10.0.2.2:3000/follow", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ currentUserId, selectedUserId }),
      });

      if (response.ok) {
        setRequestSent(true);
      }
    } catch (error) {
      console.log("Error: ", error);
    }
  };


  const handleUnfollow = async (targetID) => {
    try {
        const response = await fetch("http://10.0.2.2:3000/users/unfollow", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
            loggedInUserId: userId,
            targetUserId: targetID,
         }),
      });

      if (response.ok) {
        setRequestSent(false);
        console.log('unfollowed successfully!')
      }

    } catch (error) {
      console.log("Error: ", error);
    }
  }

  return (
    <View>
      <View className="flex-row justify-between items-center">
        <View className="flex-row items-center space-x-4">
          <Image
            className="w-10 h-10 rounded-3xl"
            source={{
              uri: "https://cdn-icons-png.flaticon.com/128/149/149071.png",
            }}
          />

          <Text>{item?.name}</Text>
        </View>

        {requestsSent || item?.followers?.includes(userId) ? (
          <Pressable 
          onPress={() => handleUnfollow(item?._id)}
          className="border px-6 py-2 rounded-md">
            <Text className='font-semibold'>Following</Text>
          </Pressable>
        ) : (
          <Pressable
            onPress={() => handleFollow(userId, item._id)}
            className="border px-6 py-2 rounded-md bg-black"
          >
            <Text className='font-semibold text-white' >Follow</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
};

export default User;

const styles = StyleSheet.create({});
