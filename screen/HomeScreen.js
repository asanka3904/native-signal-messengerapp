import React, { useLayoutEffect, useState, useEffect } from "react";
import {
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Text,
  View,
  SafeAreaView,
} from "react-native";
import CustomListitem from "../componets/CustomListitem";
import { Avatar } from "react-native-elements";
import { auth, db } from "../firebase";
import { AntDesign, SimpleLineIcons } from "@expo/vector-icons";

const HomeScreen = ({ navigation }) => {
  const [chat, setchat] = useState([]);

  useEffect(() => {
    const unsubscribe = db.collection("chats").onSnapshot((snapshot) =>
      setchat(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          data: doc.data(),
        }))
      )
    );

    return unsubscribe;
  }, []);

  const signOut = () => {
    auth
      .signOut()
      .then(() => {
        navigation.replace("login");
      })
      .catch((err) => {
        alert(err);
      });
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "signal",
      headerStyle: { backgroundColor: "white" },
      headerTitleStyle: { color: "black" },
      headerTintColor: "black",

      headerRight: () => (
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",

            width: 80,
            marginRight: 20,
          }}
        >
          <TouchableOpacity activeOpacity={0.5}>
            <AntDesign name="camerao" size="24" color="blue" />
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.5}
            onPress={() => navigation.navigate("addchat")}
          >
            <SimpleLineIcons name="pencil" size="24" color="blue" />
          </TouchableOpacity>
        </View>
      ),

      headerLeft: () => (
        <View style={{ marginLeft: 20 }}>
          <TouchableOpacity>
            <Avatar
              rounded
              source={{ uri: auth?.currentUser?.photoURL }}
              onPress={signOut}
            />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation]);

  const enterchat = (id, chatName) => {
    navigation.navigate("chat", {
      id,
      chatName,
    });
  };

  return (
    <SafeAreaView>
      <ScrollView style={styles.container}>
        {chat.map(({ id, data: { chatName } }) => (
          <CustomListitem
            key={id}
            id={id}
            chatName={chatName}
            enterchat={enterchat}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: { height: "100%" },
});
