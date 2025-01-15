# Truemetrics SDK React Native Demo

Demo app for integration and usage of the Truemetrics SDK for Android. The app showcases core SDK functionality including initialization, recording management, and metadata logging.

Getting started [documentation](https://docu.truemetrics.cloud/introduction)

## Features

- SDK initialization with API key
- Start/Stop recording functionality
- Metadata logging
- Permission handling for required Android permissions
- Error handling and display

## Prerequisites

- Node.js (v18 or later)
- Java Development Kit (JDK) 17
- Android Studio
- Android SDK Platform Tools
- React Native CLI

## Setup

1. Clone the repository:
```bash
git clone https://github.com/TRUE-Metrics-io/truemetrics_android_demo_react_app_p
cd truemetrics_android_demo_react_app_p
```

2. Install dependencies:
```bash
npm install
```

3. If needed, configure Android SDK path in your environment:
```bash
# Add to your ~/.bashrc or ~/.zshrc
export ANDROID_HOME=$HOME/Android/Sdk
export PATH=$PATH:$ANDROID_HOME/platform-tools
export PATH=$PATH:$ANDROID_HOME/tools
export PATH=$PATH:$ANDROID_HOME/tools/bin
```

4. Run the application:
```bash
npm run android
```
or
```
npx react-native start
```

## Usage

### SDK Initialization

1. Launch the app and enter your Truemetrics SDK API key in the input field

### Recording Management

Once initialized, you can:
- Start recording by tapping "Start recording"
- Stop recording by tapping "Stop recording"
- View current SDK state at the top of the screen
- Monitor any SDK errors that appear below the state

### Metadata Logging

When the SDK is initialized:
1. Tap "Log metadata"
2. Enter key and value in the respective fields
3. Tap "Log metadata" to save

### Permissions

The app will request the following permissions as needed:
- Phone state
- Activity recognition
- Location (both foreground and background)

## Project Structure

- `App.tsx`: Main application component
- `HomeScreen`: Primary screen for SDK control
- `LogMetadataScreen`: Screen for metadata management
- Android native module integration for Truemetrics SDK

## SDK States

The application handles the following SDK states:
- `UNINITIALIZED`: Uninitialized state
- `INITIALIZED`: SDK is ready for use
- `RECORDING_IN_PROGRESS`: Currently recording
- `RECORDING_STOPPED`: Recording has been stopped

## Error Handling

- SDK errors are displayed in red below the status
- Errors include both error codes and messages from the SDK

## Dependencies

- React Native
- @react-navigation/native
- @react-navigation/native-stack
- Truemetrics SDK for Android