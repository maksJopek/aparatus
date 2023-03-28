import * as React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import Dialog from "react-native-dialog";
import * as WebBrowser from 'expo-web-browser';

// import * as ImageManipulator from "expo-image-manipulator";

export default class Settings extends React.Component {
  constructor(props) {
    super(props)
    this.state = { ip: ":", dialogVisible: false }

    this.toggleDialog = this.toggleDialog.bind(this)
  }

  async componentDidMount() {
    this.setState({ ip: await getIp(true) })
  }

  toggleDialog() {
    this.setState({ dialogVisible: !this.state.dialogVisible })
  }

  render() {
    const [ip, port] = this.state.ip.split(":");
    let [cip, cpo] = [ip, port]
    const saveIP = async () => {
      const ip = cip + ":" + cpo
      await setIp(ip)
      this.setState({ ip })
      this.toggleDialog()
    }
    return (
      <View style={styles.cont}>
        <View><Text style={styles.h1}>Current IP: {ip}{"\n"}Current port: {port}</Text></View>
        <TouchableOpacity onPress={this.toggleDialog}><Text style={styles.h1b}>New IP & PORT</Text></TouchableOpacity>
        <TouchableOpacity onPress={() => WebBrowser.openBrowserAsync("http://" + this.state.ip)}><Text style={styles.h1b}>Open web app</Text></TouchableOpacity>
        <Dialog.Container visible={this.state.dialogVisible}>
          <Dialog.Title>New IP & PORT</Dialog.Title>
          <Dialog.Input onChangeText={c => cip = c} label="IP" defaultValue={ip} />
          <Dialog.Input onChangeText={c => cpo = c} label="PORT" defaultValue={port} />
          <Dialog.Button label="Cancel" onPress={this.toggleDialog} />
          <Dialog.Button label="Save" onPress={saveIP} />
        </Dialog.Container>
      </View >
    )
  }
}

export async function getIp(skipProtocol = false) {
  return (skipProtocol ? "" : "http://") + (await SecureStore.getItemAsync("ip") ?? "192.168.0.118:8000")
}
export async function setIp(ip) {
  await SecureStore.setItemAsync("ip", ip)
}

const styles = StyleSheet.create({
  cont: {
    flexDirection: "column",
    backgroundColor: "black",
    justifyContent: "space-evenly",
    alignItems: "center",
    height: "100%",
  },
  h1: {
    color: "white",
    fontSize: 23,
    // height: 60,
  },
  h1b: {
    color: "white",
    fontSize: 25,
    fontWeight: "bold",
    // height: 32,
  },
  span: {
    color: "white",
    fontSize: 22,
  },
})
