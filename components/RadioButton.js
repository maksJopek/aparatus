import * as React from 'react';
import { StyleSheet, View, TouchableOpacity, Text } from "react-native";

export default class RadioButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: props.value ?? true,
      contStyle: props.style ?? {},
      onClick: props.onClick,
      label: props.label,
    }
  }

  render() {
    return (
      <View style={[this.state.contStyle, styles.contStyle]}>
        <TouchableOpacity style={styles.outer} onPress={this.state.onClick}>
          <View style={this.state.value ? styles.inner : {}}></View>
        </TouchableOpacity>
        <Text style={styles.label}>{this.state.label}</Text>
      </View >
    )
  }
}

const styles = StyleSheet.create({
  contStyle: {
    flexDirection: "row",
    marginTop: 10,
  },
  label: {
    marginLeft: 15,
    marginTop: 3,
    fontSize: 17,
    fontWeight: "bold",
    color: "white",
  },
  outer: {
    borderColor: "#EB1F63",
    borderWidth: 2,
    borderRadius: 20,
    width: 30,
    height: 30,
  },
  inner: {
    borderColor: "#EB1F63",
    borderWidth: 10,
    borderRadius: 20,
    width: 20,
    height: 20,
    top: 3,
    left: 3,
  },
})

