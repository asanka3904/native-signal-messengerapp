import React, { useState, useLayoutEffect } from "react";
import { StyleSheet, View, KeyboardAvoidingView, Platform } from "react-native";
import { StatusBar } from "expo-status-bar";

import { Button, Input, Image, Text } from "react-native-elements";

import { auth } from "../firebase";

const RegisterScreen = ({ navigation }) => {
  const [name, setname] = useState("");
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [profilepic, setprofilepic] = useState("");
  const [cpassword, setcpassword] = useState("");

  const register = () => {
    auth
      .createUserWithEmailAndPassword(email, password)
      .then((authUser) => {
        authUser.user.updateProfile({
          displayName: name,
          photoURL: profilepic,
        });
      })
      .catch((error) => alert(error));
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerBackTitle: "back to log",
    });
  }, [navigation.on]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <StatusBar style="light" />
      <Text h3 style={{ marginBottom: 50 }}>
        create new account
      </Text>

      <View style={styles.inputContainer}>
        <Input
          placeholder="full name"
          autofocus
          type="text"
          value={name}
          onChangeText={(text) => {
            setname(text);
          }}
        />
        <Input
          placeholder=" email"
          autofocus
          type="text"
          value={email}
          onChangeText={(text) => {
            setemail(text);
          }}
        />
        <Input
          placeholder=" password"
          autofocus
          type="text"
          value={password}
          onChangeText={(text) => {
            setpassword(text);
          }}
        />
        <Input
          placeholder="profilepic"
          autofocus
          type="text"
          value={profilepic}
          onChangeText={(text) => {
            setprofilepic(text);
          }}
          onSubmitEditing={register}
        />
      </View>

      <Button onPress={register} title="Register" />
      <View style={{ width: 50 }} />
    </KeyboardAvoidingView>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
  },
  inputContainer: {
    width: "80%",
  },
  button: {
    width: 200,
    marginTop: 10,
  },
});
