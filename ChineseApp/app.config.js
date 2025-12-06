import "dotenv/config";

export default {
  expo: {
    name: "EChinese",
    slug: "EChinese",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "chineseapp",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    notification: {
      icon: "./assets/images/notification_icon.png",
      color: "#0099FF",
      largeIcon: "./assets/images/notification_icon.png",
    },

    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.tan157.ChineseApp",
    },

    android: {
      adaptiveIcon: {
        backgroundColor: "#E6F4FE",
        foregroundImage: "./assets/images/icon.png",
        backgroundImage: "./assets/images/android-icon-background.png",
        monochromeImage: "./assets/images/icon.png",
      },
      notification: {
        icon: "./assets/images/notification_icon.png",
        color: "#0099FF",
        largeIcon: "./assets/images/notification_icon.png",
      },
      edgeToEdgeEnabled: true,
      predictiveBackGestureEnabled: false,
      package: "com.tan157.ChineseApp",
    },

    web: {
      output: "static",
      favicon: "./assets/images/icon.png",
    },

    plugins: [
      "expo-router",
      [
        "expo-splash-screen",
        {
          image: "./assets/images/icon.png",
          imageWidth: 150,
          resizeMode: "contain",
          backgroundColor: "#E6F4FE",
          dark: {
            image: "./assets/images/icon.png",
            backgroundColor: "#1a1a1a",
          },
        },
      ],
      "expo-web-browser",
      "expo-speech-recognition",
      [
        "expo-speech-recognition",
        {
          microphonePermission: "Allow $(PRODUCT_NAME) to use the microphone.",
          speechRecognitionPermission:
            "Allow $(PRODUCT_NAME) to use speech recognition.",
          androidSpeechServicePackages: [
            "com.google.android.googlequicksearchbox",
          ],
        },
      ],
    ],

    experiments: {
      typedRoutes: true,
      reactCompiler: true,
    },

    /** 👇 Extra config including EAS projectId 👇 */
    extra: {
      WEB_CLIENT_ID: process.env.WEB_CLIENT_ID,
      API_URL: process.env.API_URL,
      eas: {
        projectId: "673d05e6-7329-4a9b-9de5-30f8be4e16ab",
      },
    },
  },
};
