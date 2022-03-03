import * as React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
// import * as MediaLibrary from "expo-media-library";

const MARGIN = 3;

export default class PhotoSmall extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  async componentDidMount() {
  }

  render() {
    return (
      <View style={styles.cont}>
        <Image source={this.props.source} style={[this.props.style, styles.img, { width: this.props.size.width - MARGIN * 2, height: this.props.size.height }]} />
        <Text style={[this.props.style, styles.txt]}>{this.props.id}</Text>
        <Text style={[{ opacity: this.props.style.opacity === 1 ? 0 : 1 }, styles.plus]}>+</Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  cont: {
    flex: 1,
    flexDirection: "column",
    margin: MARGIN,
    justifyContent: "center",
    alignItems: "center",
  },
  img: {
    borderRadius: 15,
    flex: 1,
  },
  txt: {
    position: "absolute",
    bottom: 10,
    right: 10,
    color: "white",
    fontWeight: "bold",
  },
  plus: {
    position: "absolute",
    alignSelf: "center",
    fontWeight: "100",
    fontSize: 100,
    color: "#EB1F63",
  },
})


