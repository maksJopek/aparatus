import * as React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions, Alert } from 'react-native';
// import * as ImageManipulator from "expo-image-manipulator";
import * as MediaLibrary from "expo-media-library";
import * as FileSystem from "expo-file-system";
import { shareAsync } from 'expo-sharing';

import { getIp } from "./Settings"

const w = Dimensions.get("window").width
const h = Dimensions.get("window").height

export default class PhotoBig extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  async componentDidMount() {
  }

  render() {
    const src = this.props.route.params.source;
    // (async () => console.log(await isAvailableAsync(), src.uri.replace(/storage\/.*?\//, '')))()
    const share = async () => {
      let assetUriParts = src.uri.split("/");
      let assetName = assetUriParts[assetUriParts.length - 1];
      let uri = `${FileSystem.documentDirectory}/${assetName}`;
      console.log('uri', uri)
      await FileSystem.copyAsync({
        from: src.uri,
        to: uri,
      });

      // Share the image from the uri that you copied it to
      await shareAsync(uri);
      await FileSystem.deleteAsync(uri)
      // shareAsync(src.uri, {})
    }
    const remove = async () => {
      await MediaLibrary.deleteAssetsAsync(this.props.route.params.id);
      this.props.navigation.goBack();
    }

    const upload = async () => {
      const uri = this.props.route.params.source.uri;
      const body = new FormData();
      body.append('photo', {
        uri: uri,
        type: 'image/jpeg',
        name: uri.split('/').pop(),
      });

      console.log(body)
      const url = await getIp() + "/upload"
      await fetch(url, {
        method: "POST",
        body
      }).catch(e => console.log(e, url))
      Alert.alert("Alert", "Galllery - file uploaded and saved!");
    }
    return (
      <View style={[this.props.style, styles.cont]}>
        <Image source={src} style={styles.img} />
        <View style={styles.txts}>
          {/* <TouchableOpacity onPress={() => } style={{ flex: 1 }}><Text style={styles.h1}>SHARE</Text></TouchableOpacity> */}
          <TouchableOpacity onPress={share} style={{ flex: 1 }}><Text style={styles.h1}>SHARE</Text></TouchableOpacity>
          <TouchableOpacity onPress={remove} style={{ flex: 1 }}><Text style={styles.h1}>DELETE</Text></TouchableOpacity>
          <TouchableOpacity onPress={upload} style={{ flex: 1 }}><Text style={styles.h1}>UPLOAD</Text></TouchableOpacity>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  cont: {
    flexDirection: "column",
    paddingTop: 20,
    backgroundColor: "black",
    // backgroundColor: "#EB1F63",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
  },
  img: {
    width: w * 0.9,
    height: h * 0.65,
    borderRadius: 15,
  },
  h1: {
    color: "white",
    fontSize: w / 15,
    fontWeight: "bold",
  },
  txts: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: w / 15,
  },
})
