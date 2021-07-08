import React, { useLayoutEffect, useState, Fragment } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  ScrollView,
  TextInput,
  Keyboard,
  Platform,
} from "react-native";
import { Avatar } from "react-native-elements";

import { AntDesign, FontAwesome, Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import { auth, db } from "../firebase";
import firebase from "firebase/app";

const ChatScreen = ({ navigation, route }) => {
  const [input, setinput] = useState("");
  const [msg, setmsg] = useState([]);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "chat",
      headerTitleAlign: "left",
      headerTitle: () => (
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            padding: 10,
          }}
        >
          <Avatar
            rounded
            source={{ uri: msg[msg.length - 1]?.data.photoURL }}
          />
          <Text style={{ marginLeft: 10 }}>{route.params.chatName}</Text>
        </View>
      ),

      headerLeft: () => (
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}
        >
          <AntDesign name="arrowleft" size="24" color="white" />
        </TouchableOpacity>
      ),

      headerRight: () => (
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            width: 80,
            marginRight: 20,
          }}
        >
          <TouchableOpacity>
            <FontAwesome name="video-camera" size="24" color="white" />
          </TouchableOpacity>
          <TouchableOpacity>
            <Ionicons name="call" size="24" color="white" />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation, msg]);

  const sendmsg = () => {
    Keyboard.dismiss();
    db.collection("chats").doc(route.params.id).collection("messages").add({
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      message: input,
      displayName: auth.currentUser.displayName,
      email: auth.currentUser.email,
      photoURL: auth.currentUser.photoURL,
    });

    setinput("");
  };

  useLayoutEffect(() => {
    const unsubscribe = db
      .collection("chats")
      .doc(route.params.id)
      .collection("messages")
      .orderBy("timestamp", "asc")
      .onSnapshot((snapshot) => {
        setmsg(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            data: doc.data(),
          }))
        );
      });

    return unsubscribe;
  }, [route]);

  console.log(msg.map(({ id, data }) => data.message));
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar style="light" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
        keyboardVerticalOffset={90}
      >
        <TouchableWithoutFeedback
        //   onPress={() => {
        //     Keyboard.dismiss();
        //   }}
        >
          <Fragment>
            <ScrollView contentContainerStyle={{ paddingTop: 10 }}>
              {msg.map(({ id, data }) =>
                //console.log(data.message)
                data.email === auth.currentUser.email ? (
                  <View key={id} style={styles.reciever}>
                    <Avatar
                      source={{
                        uri: data.photoURL,
                      }}
                      rounded
                      size="small"
                      containerStyle={{
                        position: "absolute",
                        bottom: -15,
                        left: -5,
                        size: 35,
                      }}
                      position="absolute"
                      bottom={-15}
                      left={-5}
                      size={35}
                    />
                    <Text style={styles.recievedmsg}>{data.message}</Text>
                  </View>
                ) : (
                  <View style={styles.sender}>
                    <Avatar
                      source={{
                        uri: data.photoURL,
                      }}
                      rounded
                      size="small"
                      containerStyle={{
                        position: "absolute",
                        bottom: -15,
                        right: -5,
                        size: 35,
                      }}
                      position="absolute"
                      bottom={-15}
                      right={-5}
                      size={35}
                    />
                    <Text style={styles.sendermsg}>{data.message}</Text>
                    <Text style={styles.sendername}>{data.displayName}</Text>
                  </View>
                )
              )}
            </ScrollView>
            <View style={styles.footer}>
              <TextInput
                placeholder="msg here"
                style={styles.inputContainer}
                value={input}
                onChangeText={(text) => {
                  setinput(text);
                }}
                onSubmitEditing={sendmsg}
              />

              <TouchableOpacity onPress={sendmsg} activeOpacity={0.5}>
                <Ionicons name="send-outline" size="24" color="blue" />
              </TouchableOpacity>
            </View>
          </Fragment>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-end",
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    padding: 15,
  },
  inputContainer: {
    bottom: 0,
    height: 40,
    flex: 1,
    marginRight: 15,
    borderColor: "transparent",
    backgroundColor: "#ECECEC",
    borderEndWidth: 1,
    padding: 10,
    color: "darkGray",
    borderRadius: 25,
  },

  reciever: {
    padding: 15,
    backgroundColor: "#cfb5b4",
    alignSelf: "flex-end",
    borderRadius: 20,
    marginRight: 15,
    marginBottom: 20,
    maxWidth: "80%",
    position: "relative",
  },
  sender: {
    padding: 15,
    backgroundColor: "#2B68E6",
    alignSelf: "flex-start",
    borderRadius: 20,
    marginRight: 15,
    marginBottom: 20,
    maxWidth: "80%",
    position: "relative",
  },
  recievedmsg: {
    color: "balck",
    fontWeight: "400",
    marginLeft: 10,
  },
  sendermsg: {
    color: "black",
    fontWeight: "400",
    marginLeft: 10,
    marginBottom: 15,
  },
  sendername: {
    left: 10,
    paddingRight: 10,
    fontSize: 10,
    color: "white",
  },
});
