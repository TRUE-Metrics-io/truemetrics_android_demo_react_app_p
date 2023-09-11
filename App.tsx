/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useState, useEffect } from 'react';

import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  NativeEventEmitter,
  NativeModules,
  Button,
  TextInput,
  PermissionsAndroid,
  Alert
} from 'react-native';

import {
  Colors,
} from 'react-native/Libraries/NewAppScreen';

import { MMKVLoader, useMMKVStorage } from 'react-native-mmkv-storage';

const storage = new MMKVLoader().initialize();

const { TruemetricsSdkModule } = NativeModules;

function App(): JSX.Element {

  const [truemetricsApiKey, setTruemetricsApiKey] = useMMKVStorage('truemetricsApiKey', storage, '');
  const [sdkState, setSdkState] = useState('')
  const [inputApiKey, setInputApiKey] = useState('')

  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  useEffect(() => {
    const eventEmitter = new NativeEventEmitter(NativeModules.TruemetricsSdkModule);
    let sdkStateEventListener = eventEmitter.addListener('SDK_STATE', event => {
      console.log('SDK_STATE event: ' + event.newState)
      setSdkState(event.newState)
    });

    let sdkPermissionsListener = eventEmitter.addListener('SDK_PERMISSIONS', event => {
      console.log('SDK_PERMISSIONS event: ' + event.permissions)
      requestPermissions(event.permissions)
    });

    return () => {
      sdkStateEventListener.remove()
      sdkPermissionsListener.remove()
    };
  }, []);

  useEffect(() => {
    if (truemetricsApiKey != '') {
      TruemetricsSdkModule.initializeSdk(truemetricsApiKey)
    }
  })

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>

        <View style={styles.content}>

          <Text>{'SDK status: ' + sdkState}</Text>

          <View style={{ margin: 10 }} />
          {
            truemetricsApiKey
              ?
              <>
                {(sdkState == 'INITIALIZED' || sdkState == 'RECORDING_STOPPED') &&
                  <Button title="Start recording" onPress={() => TruemetricsSdkModule.startRecording()} />
                }

                {sdkState == 'RECORDING_IN_PROGRESS' &&
                  <Button title="Stop recording" onPress={() => TruemetricsSdkModule.stopRecording()} />
                }
              </>
              :
              <>
                <TextInput
                style={styles.input}
                  placeholder="Truemetrics SDK Api key"
                  onChangeText={setInputApiKey}
                  value={inputApiKey}
                />

                <Button title="Initialize SDK" onPress={() => {
                  if (inputApiKey.trim() !== '') {
                    setTruemetricsApiKey(inputApiKey)
                    TruemetricsSdkModule.initializeSdk(inputApiKey);
                  }
                }} />
              </>
          }
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const requestPermissions = async (permissions: String[]) => {

  var requestBackgroundLocation = permissions.includes('android.permission.ACCESS_BACKGROUND_LOCATION')

  var androidPermissions = permissions.map(p => {
    switch (p) {
      case 'android.permission.READ_PHONE_STATE': return PermissionsAndroid.PERMISSIONS.READ_PHONE_STATE
      case 'android.permission.ACTIVITY_RECOGNITION': return PermissionsAndroid.PERMISSIONS.ACTIVITY_RECOGNITION
      case 'android.permission.ACCESS_COARSE_LOCATION': return PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION
      case 'android.permission.ACCESS_FINE_LOCATION': return PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
    }
  }).flatMap(item => item ? [item] : []);

  PermissionsAndroid.requestMultiple(androidPermissions).then(result => {
    if (
      result['android.permission.ACCESS_FINE_LOCATION'] ||
      result['android.permission.ACCESS_COARSE_LOCATION'] === 'granted'
    ) {
      askBackgroundLocationPermission()
    }
  });
};

const askBackgroundLocationPermission = () => {
  Alert.alert(
    'Background location',
    'Application needs permission to access background location to work reliably when in background. Select "Allow all the time" on the settings screen.',
    [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Open Settings',
        onPress: () => PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION)
      },
    ],
    {
      cancelable: true,
    },
  );
}

const styles = StyleSheet.create({
  input: {
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  content: {
    justifyContent: 'center',
    alignItems: 'center',
  }
});

export default App;
