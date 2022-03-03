import * as React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import * as MediaLibrary from "expo-media-library";
import * as ECamera from "expo-camera";

export default class Home extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  async componentDidMount() {
    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status !== 'granted') {
      alert('brak uprawnień do czytania image-ów z galerii')
    }
    const status2 = (await ECamera.requestCameraPermissionsAsync()).status;
    console.log(status2)
    if (status2 !== 'granted') {
      alert('brak uprawnień do wykonywania zdjec')
    }
  }

  render() {
    return (
      <View style={styles.cont}>
        <TouchableOpacity style={styles.btn} onPress={() => this.props.navigation.navigate("gallery")}><Text style={styles.h1}>CAMERA{"\n"}SETTINGS App</Text></TouchableOpacity>
        <Text style={styles.span}>Change camera white balance</Text>
        <Text style={styles.span}>Change camera flash mode</Text>
        <Text style={styles.span}>Change camera picture size</Text>
        <Text style={styles.span}>Change camera camera ratio</Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  cont: {
    flexDirection: "column",
    marginTop: 10,
    paddingTop: 10,
    backgroundColor: "#EB1F63",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
  },
  btn: {
    margin: 10,
  },
  h1: {
    color: "white",
    fontSize: 55,
    fontWeight: "bold",
    textAlign: "center",
  },
  span: {
    color: "white",
    fontSize: 22,
  }
})
