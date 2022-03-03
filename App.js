//import { StatusBar } from 'expo-status-bar';
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
const Stack = createNativeStackNavigator();

import Home from "./components/Home";
import Gallery from "./components/Gallery";
import PhotoBig from "./components/PhotoBig";
import Camera from "./components/Camera";
import Setting from "./components/Settings";

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="home" component={Home} options={{ headerShown: false }} />
        <Stack.Screen name="gallery" component={Gallery} options={{
          title: 'Gallery of phtos from DCIM/',
          headerStyle: {
            backgroundColor: '#EB1F63',
          },
          headerTintColor: '#ffffff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }} />
        <Stack.Screen name="photoBig" component={PhotoBig} options={{
          title: 'Chosen photo',
          headerStyle: {
            backgroundColor: '#EB1F63',
          },
          headerTintColor: '#ffffff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }} />
        <Stack.Screen name="camera" component={Camera} options={{
          title: 'Camera',
          headerStyle: {
            backgroundColor: '#EB1F63',
          },
          headerTintColor: '#ffffff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }} />
        <Stack.Screen name="settings" component={Setting} options={{
          title: 'Settings',
          headerStyle: {
            backgroundColor: '#EB1F63',
          },
          headerTintColor: '#ffffff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
// });
