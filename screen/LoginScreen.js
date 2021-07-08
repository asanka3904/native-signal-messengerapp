import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Button, Input, Image } from "react-native-elements";
import { StatusBar } from "expo-status-bar";
import { auth } from "../firebase";

const LoginScreen = ({ navigation }) => {
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        navigation.replace("home");
      }
    });

    return unsubscribe;
  }, []);

  const signin = () => {
    auth.signInWithEmailAndPassword(email, password).catch((error) => {
      alert(error);
    });
  };

  return (
    <KeyboardAvoidingView behavior={"padding"} style={styles.main}>
      <StatusBar style="dark" />
      <Image
        source={{
          uri: "https://upload.wikimedia.org/wikipedia/commons/4/4f/Signal_Blue_Icon.png",
        }}
        style={{ width: 200, height: 200 }}
      />
      <View style={{ height: 20 }} />
      <View style={styles.inputContainer}>
        <Input
          placeholder="Email"
          autoFocus
          type="email"
          value={email}
          onChangeText={(text) => {
            setemail(text);
          }}
        />
        <Input
          placeholder="Pwd"
          autoFocus
          type="password"
          secureTextEntry={true}
          value={password}
          onChangeText={(text) => {
            setpassword(text);
          }}
          onSubmitEditing={signin}
        />
      </View>
      <Button title="login" containerStyle={styles.button} onPress={signin} />
      <Button
        title="register"
        type="outline"
        containerStyle={styles.button}
        onPress={() => {
          navigation.navigate("register");
        }}
      />
      <View style={{ height: 100 }} />
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  main: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
  },

  button: {
    width: 200,
    marginTop: 10,
  },

  inputContainer: {
    width: "80%",
  },
});
