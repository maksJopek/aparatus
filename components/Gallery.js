import * as React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Dimensions, Alert } from 'react-native';
import * as MediaLibrary from "expo-media-library";

import PhotoSmall from "./PhotoSmall"
import { getIp } from "./Settings"

const w = Dimensions.get("window").width
// const h = Dimensions.get("window").height
const IMG_SQUARE_WIDTH = (w - 18) / 5;
const IMG_SQUARE_HEIGHT = IMG_SQUARE_WIDTH + 20;

export default class Gallery extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      imgs: [],
      cols: 5,
      imgWidth: IMG_SQUARE_WIDTH,
      imgHeight: IMG_SQUARE_HEIGHT,
      flatlistkey: 0,
      selectedImgs: [],
    }
    this.gridList = this.gridList.bind(this)
    this.addToSelection = this.addToSelection.bind(this)
    this.imgPress = this.imgPress.bind(this)
    this.getImgs = this.getImgs.bind(this)
    this.removeSelected = this.removeSelected.bind(this)
    this.uploadSelected = this.uploadSelected.bind(this)
  }

  async getImgs() {
    let photos = await MediaLibrary.getAssetsAsync({
      first: 40,              // ilość pobranych assetów
      mediaType: 'photo',     // typ pobieranych danych, photo jest domyślne
      sortBy: "creationTime",
    })
    console.log("ASSET", photos.assets[0])
    this.setState({ imgs: photos.assets, flatlistkey: this.state.flatlistkey + 1 })
  }
  componentDidMount() {
    this.props.navigation.addListener('focus', this.getImgs)
    this.getImgs()
  }

  gridList() {
    this.setState({
      cols: this.state.cols === 5 ? 1 : 5,
      imgWidth: this.state.imgWidth === IMG_SQUARE_WIDTH ? w - 18 : IMG_SQUARE_WIDTH,
      imgHeight: this.state.imgWidth === IMG_SQUARE_WIDTH ? IMG_SQUARE_HEIGHT + 30 : IMG_SQUARE_HEIGHT,
      flatlistkey: this.state.flatlistkey + 1,
    })
  }
  addToSelection(id) {
    if (this.state.selectedImgs.includes(id)) {
      this.setState({
        selectedImgs: this.state.selectedImgs.filter(i => i !== id)
      })
    } else {
      this.setState({
        selectedImgs: [...this.state.selectedImgs, id]
      })
    }
  }
  imgPress(uri, id) {
    if (this.state.selectedImgs.length)
      this.addToSelection(id)
    else
      this.props.navigation.navigate("photoBig", { source: { uri }, id })
  }
  async removeSelected() {
    await MediaLibrary.deleteAssetsAsync(this.state.selectedImgs);
    this.setState({ selectedImgs: [] })
    this.getImgs();
  }
  async uploadSelected() {
    if (this.state.selectedImgs.length === 0) return;
    const photos = this.state.imgs.filter(i => this.state.selectedImgs.includes(i.id));
    console.log(photos)
    const body = new FormData();
    for (const p of photos) {
      body.append('photo', {
        uri: p.uri,
        type: 'image/jpeg',
        name: p.uri.split('/').pop(),
      })
    }

    const url = await getIp() + "/upload"
    await fetch(url, {
      method: "POST",
      body
    })
    Alert.alert("Alert", "Galllery - files uploaded and saved!");
  }

  render() {
    return (
      <View style={styles.cont}>
        <View style={styles.nav}>
          <TouchableOpacity styles={styles.navBtn} onPress={this.gridList}><Text style={styles.navTxt}>GRID / LIST</Text></TouchableOpacity>
          <TouchableOpacity styles={styles.navBtn} onPress={() => this.props.navigation.navigate("camera", { albumId: this.state.imgs[0].albumId })}><Text style={styles.navTxt}>OPEN{'\n'}CAMERA</Text></TouchableOpacity>
          <TouchableOpacity styles={styles.navBtn} onPress={this.removeSelected}><Text style={styles.navTxt}>REMOVE{'\n'}SELECTED</Text></TouchableOpacity>
          <TouchableOpacity styles={styles.navBtn} onPress={this.uploadSelected}><Text style={styles.navTxt}>UPLOAD{'\n'}SELECTED</Text></TouchableOpacity>
          <TouchableOpacity styles={styles.navBtn} onPress={() => this.props.navigation.navigate("settings")}><Text style={styles.navTxt}>SETT</Text></TouchableOpacity>
        </View>
        <FlatList
          // ListHeaderComponent={
          // }
          data={this.state.imgs}
          renderItem={({ item }) => {
            // console.log(item.uri)
            return (
              <TouchableOpacity
                onPress={() => this.imgPress(item.uri, item.id)}
                onLongPress={() => this.addToSelection(item.id)}
              >
                <PhotoSmall source={{ uri: item.uri }} size={{
                  width: this.state.imgWidth,
                  height: this.state.imgHeight,
                }} style={{ opacity: this.state.selectedImgs.includes(item.id) ? 0.2 : 1 }} id={item.id} />
              </TouchableOpacity>
            )
          }}
          keyExtractor={p => p.id}
          contentContainerStyle={styles.list}
          numColumns={this.state.cols}
          key={this.state.flatlistkey}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  cont: {
  },
  nav: {
    flexDirection: "row",
    margin: 10,
  },
  navTxt: {
    fontSize: w / 26,
    margin: 5,
  },
  navBtn: {
    flex: 1
  },
  list: {
    margin: 9,
    paddingBottom: 110,
    // height: "100%",
    // marginBottom: -20,
  },
})
