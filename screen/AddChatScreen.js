//import { create } from "jest-haste-map/node_modules/@types/istanbul-reports";
import React, { useLayoutEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Button, Input } from "react-native-elements";

import Icon from "react-native-vector-icons/FontAwesome";
import { auth, db } from "../firebase";

const AddChatScreen = ({ navigation }) => {
  const [chat, setchat] = useState("");

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "add chat",
      headerBackTitle: "back chat",
    });
  }, [navigation]);

  const createChat = async () => {
    await db
      .collection("chats")
      .add({
        chatName: chat,
      })
      .then(() => {
        navigation.goBack();
      })
      .catch((error) => {
        alert(error);
      });
  };

  return (
    <View style={styles.container}>
      <Text
        style={{
          marginBottom: 10,
          fontSize: 20,
        }}
      >
        add
      </Text>
      <Input
        placeholder="enter chat"
        onChangeText={(text) => setchat(text)}
        leftIcon={
          <Icon name="wechat" type="antdesign" size="24" color="blue" />
        }
        onSubmitEditing={createChat}
        style={styles.inputContainer}
      />
      <Button
        disabled={!chat}
        onPress={createChat}
        title="add chat"
        style={styles.button}
      />
    </View>
  );
};

export default AddChatScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    padding: 30,
    height: "100%",
    margin: "2%",
    alignItems: "center",
  },
  inputContainer: {
    padding: 5,
    marginTop: 20,
    marginBottom: 20,
  },
  button: {
    marginTop: 20,
  },
});
