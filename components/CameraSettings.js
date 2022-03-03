import * as React from 'react';
import { Animated, StyleSheet, View, Text, Button } from "react-native";

import RadioGroup from "./RadioGroup"

export default function CameraSettings(props) {
  const [pos, _setPos] = React.useState(new Animated.Value(800))
  const [cs, setCs] = React.useState({ whiteBalance: 0, flashMode: 0, ratio: 0, pictureSize: 0 })
  const [ps, setPs] = React.useState(props.settings.si[props.settings.ra[0]] ?? "a")
  React.useEffect(() => {
    if (ps === "a") setPs(props.settings.si[props.settings.ra[0]] ?? "a")
  })
  let toPos = 100;
  console.log("props.settings", props.settings)
  // console.log("props.settings.si[props.settings.ra[0]]", props.settings.si[props.settings.ra[0]])
  if (props.show) toPos = 0; else toPos = 800
  // console.log("props@CameraSettings", props)
  // console.log("state@CameraSettings", { pos, cs, ps })

  //animacja
  Animated.spring(pos, {
    toValue: toPos,
    velocity: 1,
    tension: 0,
    friction: 10,
    useNativeDriver: true,
  }).start();

  function onChange(n, v, i) {
    if (n === "ratio") setPs(props.settings.si[v])
    const ncs = {}
    ncs[n] = i
    setCs({ ...cs, ...ncs })
    props.onChange(n, v)
  }

  // console.log(`CameraSettings: bef_render: chosen={${cs['pictureSize']}} labels={${ps}}`)
  return (
    <Animated.ScrollView style={[styles.animatedView, { transform: [{ translateY: pos }] }]}>
      <Text style={styles.h1}>SETTINGS</Text>
      <RadioGroup onChange={(v, i) => onChange('whiteBalance', v, i)} chosen={cs['whiteBalance']} header={"WHITE BALANCE"} labels={props.settings.wb} key={Math.random() * 10e16} />
      <RadioGroup onChange={(v, i) => onChange('flashMode', v, i)} chosen={cs['flashMode']} header={"FLASH MODE"} labels={props.settings.fm} key={Math.random() * 10e16} />
      <RadioGroup onChange={(v, i) => onChange('ratio', v, i)} chosen={cs['ratio']} header={"RATIOS"} labels={props.settings.ra} key={Math.random() * 10e16} />
      <RadioGroup onChange={(v, i) => onChange('pictureSize', v, i)} chosen={cs['pictureSize']} header={"PICTURE SIZE"} labels={ps} key={Math.random() * 10e16} />
    </Animated.ScrollView>
  );
}



const styles = StyleSheet.create({
  animatedView: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    padding: 20,
    height: 765,
    width: 220,
    overflow: "scroll",
    paddingBottom: 150,
    // marginBottom: 30,
  },
  h1: {
    fontSize: 30,
    color: "white",
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "left",
  },
});

