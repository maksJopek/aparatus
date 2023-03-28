import * as React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ToastAndroid, Alert } from 'react-native';
import * as MediaLibrary from "expo-media-library";
import * as ECamera from "expo-camera";
import * as ImagePicker from 'expo-image-picker';

import RevPng from "../assets/reverse.png";
import PickPng from "../assets/img-picker.png";
import SettPng from "../assets/settings-icon.png";
import { getIp } from "./Settings"
import CameraSettings from "./CameraSettings"

export default class Camera extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      hasCameraPermission: null,
      type: ECamera.Constants.Type.front,
      camera: null,
      img: <></>,
      show: false,
      wb: null,
      fm: null,
      ra: null,
      si: null,
      whiteBalance: null,
      flashMode: null,
      ratio: null,
      pictureSize: null,
      settings: {
        wb: [],
        fm: [],
        ra: [],
        si: [],
      },
    }
    this.changeCamera = this.changeCamera.bind(this)
    this.settChange = this.settChange.bind(this)
  }

  async componentDidMount() {
    let { status } = await ECamera.getCameraPermissionsAsync();
    this.setState({ hasCameraPermission: status == 'granted' });
  }
  changeCamera() {
    this.setState({
      type: this.state.type === ECamera.Constants.Type.back
        ? ECamera.Constants.Type.front
        : ECamera.Constants.Type.back,
    });
  }
  async cameraRdy(camera) {
    if (this.state.wb) return;
    const ratios = await camera.getSupportedRatiosAsync()
    const sizes = {}
    for (const r of ratios) {
      sizes[r] = await camera.getAvailablePictureSizesAsync(r)
    }
    this.setState({
      wb: ECamera.Constants.WhiteBalance,
      fm: ECamera.Constants.FlashMode,
      ra: ratios,
      si: sizes,
      whiteBalance: ECamera.Constants.WhiteBalance[0],
      flashMode: ECamera.Constants.FlashMode[0],
      ratio: ratios[0],
      pictureSize: sizes[ratios[0]][0],
      settings: {
        wb: Object.keys(ECamera.Constants.WhiteBalance),
        fm: Object.keys(ECamera.Constants.FlashMode),
        ra: ratios,
        si: sizes,
      },
    })
    console.log("settings", { ratios, sizes })
  }
  async settChange(which, nVal) {
    console.log("Camera@settChange: ", { which, nVal })
    const ns = {}
    ns[which] = nVal
    this.setState(ns)
  }

  render() {
    let camera = null;
    async function takePhoto() {
      if (camera) {
        let foto = await camera.takePictureAsync();
        let asset = await MediaLibrary.createAssetAsync(foto.uri); // domyślnie zapisuje w folderze DCIM
        this.setState({ img: <Image style={styles.img} source={asset} /> })
        setTimeout(() => this.setState({ img: <></> }), 4000);
        ToastAndroid.showWithGravity(
          'The photo has been taken',
          ToastAndroid.SHORT,
          ToastAndroid.CENTER
        );
      }
    }
    async function editPhoto() {
      if (camera) {
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.All,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 1,
        });
        if (!result.cancelled) {
          const uri = result.uri;
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
      }
    }
    function toggleSettings() {
      this.setState({ show: !this.state.show })
    }
    const { hasCameraPermission } = this.state; // podstawienie zmiennej ze state

    if (hasCameraPermission == null) {
      return <View />;
    } else if (hasCameraPermission === false) {
      return <Text>brak dostępu do kamery</Text>;
    } else {
      return (
        <View style={styles.cont}>
          <ECamera.Camera
            ref={ref => { camera = ref }}
            style={{ flex: 1 }}
            type={this.state.type}
            onCameraReady={() => this.cameraRdy(camera)}
            ratio={this.state.ratio}
            whiteBalance={this.state.whiteBalance}
            pictureSize={this.state.pictureSize}
            flashMode={this.state.flashMode}
            key={this.state.flashMode}
          >
            <View style={{ flex: 1 }}>
              <TouchableOpacity style={[styles.btn, styles.btn1]} onPress={this.changeCamera}><Image style={styles.btnIco} source={RevPng} /></TouchableOpacity>
              <TouchableOpacity style={[styles.btn, styles.btn2]} onPress={takePhoto.bind(this)}><Text style={styles.btnTxt}>+</Text></TouchableOpacity>
              <TouchableOpacity style={[styles.btn, styles.btn3]} onPress={editPhoto.bind(this)}><Image style={styles.btnIco2} source={PickPng} /></TouchableOpacity>
              <TouchableOpacity style={[styles.btn, styles.btn4]} onPress={toggleSettings.bind(this)}><Image style={styles.btnIco2} source={SettPng} /></TouchableOpacity>
              {this.state.img}
            </View>
          </ECamera.Camera>
          <CameraSettings show={this.state.show} onChange={this.settChange} settings={this.state.settings} ratio={this.state.ratio} />
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  cont: {
    flex: 1,
  },
  btn: {
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    borderRadius: 100,
    position: "absolute",
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    bottom: 20,
  },
  btn1: {
    left: 30,
    width: 70,
    height: 70,
  },
  btn2: {
    left: "37%",
    width: 120,
    height: 120,
  },
  btn3: {
    right: 60,
    width: 70,
    height: 70,
  },
  btn4: {
    bottom: 80,
    right: 20,
    width: 70,
    height: 70,
  },
  btnIco: {
    width: 50,
    height: 50,
  },
  btnIco2: {
    width: 42,
    height: 42,
  },
  btnTxt: {
    fontSize: 160,
    marginTop: -55,
    color: "#EB1F63",
  },
  img: {
    position: "absolute",
    top: "15%",
    left: "40%",
    width: 90,
    height: 160,
    borderColor: "#EB1F63",
    borderWidth: 5,
  },
  nav: {
    flexDirection: "row",
    margin: 10,
  },
  navTxt: {
    fontSize: 26,
    margin: 5,
  },
  navBtn: {
    flex: 1
  },
  list: {
    margin: 9,
    paddingBottom: 10,
    // height: "100%",
  },
})
