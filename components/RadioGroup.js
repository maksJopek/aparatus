import * as React from 'react';
import { StyleSheet, View, Text } from "react-native";

import RadioButton from "./RadioButton"

export default class RadioGroup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      count: props.labels.length,
      labels: props.labels,
      default: props.default ?? 0,
      header: props.header,
      // radios,
      values: [],
      baseKey: Number.MIN_SAFE_INTEGER,
      chosen: props.chosen,
    }
    const values = []
    for (let j = 0; j < this.state.count; j++) {
      values.push(j === this.state.chosen)
    }
    this.state = {
      ...this.state,
      baseKey: this.state.baseKey + this.state.count + 1,
      values,
    }
  }

  componentDidMount() {
    // this.onClick(this.state.default)
  }

  onClick(i) {
    const values = []
    for (let j = 0; j < this.state.count; j++) {
      values.push(j === i)
    }
    // console.log("RadioGroup@onClick", { values })
    this.setState({
      baseKey: this.state.baseKey + this.state.count + 1,
      values,
      // chosen: i,
    }, () => this.props.onChange(this.state.labels[i], i)
    )
  }

  render() {
    // if (this.state.header === "PICTURE SIZE") console.log("Radio Group, Picture size: ", this.state)
    const radios = []
    for (const [i, v] of this.state.values.entries()) {
      radios.push(
        <RadioButton key={Math.random() * 10e16} label={this.state.labels[i]} value={v} onClick={() => this.onClick(i)} />
      )
    }
    // console.log("RadioGroup@render:", { state: this.state })
    // <RadioButton key={this.state.baseKey + i} label={this.state.labels[i]} value={v} onClick={() => this.onClick(i)} />
    return (
      <View style={{ paddingBottom: this.state.header === "PICTURE SIZE" ? 30 : 10, }}>
        <Text style={styles.h2y}>{this.state.header}</Text>
        {radios}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  h2y: {
    fontSize: 20,
    color: "yellow",
    fontWeight: "bold",
    textAlign: "right",
  },
})
