import api from "@/services";
import messaging from "@react-native-firebase/messaging";
import { PermissionsAndroid, Platform } from "react-native";

/**
 * Request notification permission from user
 * iOS: Uses Firebase messaging permission
 * Android: Uses POST_NOTIFICATIONS permission for Android 13+
 */
export async function requestNotificationPermission(): Promise<boolean> {
  try {
    if (Platform.OS === "ios") {
      const authStatus = await messaging().requestPermission();
      return (
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL
      );
    } else if (Platform.OS === "android" && Platform.Version >= 33) {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true; // Android < 13 không cần request permission
  } catch (error) {
    console.error("Error requesting notification permission:", error);
    return false;
  }
}

/**
 * Get FCM token from Firebase
 */
export async function getFCMToken(): Promise<string | null> {
  try {
    const fcmToken = await messaging().getToken();
    console.log("FCM Token:", fcmToken);
    return fcmToken;
  } catch (error) {
    console.error("Error getting FCM token:", error);
    return null;
  }
}

/**
 * Register device token to backend
 * Call this after user login successfully
 */
export async function registerDeviceToken(): Promise<string | null> {
  try {
    // Request permission first
    const hasPermission = await requestNotificationPermission();
    if (!hasPermission) {
      console.log("Notification permission denied");
      return null;
    }

    // Get FCM token
    const fcmToken = await getFCMToken();
    if (!fcmToken) {
      console.log("Failed to get FCM token");
      return null;
    }

    // Register to backend
    await api.post(
      "/users/device-token",
      {
        token: fcmToken,
        platform: Platform.OS,
      },
      { requireAuth: true }
    );

    console.log("Device token registered successfully");
    return fcmToken;
  } catch (error) {
    console.error("Error registering device token:", error);
    return null;
  }
}

/**
 * Unregister device token from backend
 * Call this when user logout
 */
export async function unregisterDeviceToken(): Promise<void> {
  try {
    const fcmToken = await messaging().getToken();
    if (fcmToken) {
      // Unregister from backend
      await api.delete("/users/device-token", {
        data: { token: fcmToken },
        requireAuth: true,
      });

      // Delete token from Firebase
      await messaging().deleteToken();
      console.log("Device token unregistered successfully");
    }
  } catch (error: any) {
    // If unauthorized (401), auth token is invalid (e.g., user logged out), just delete local token
    if (error.response?.status === 401) {
      try {
        await messaging().deleteToken();
        console.log(
          "Device token deleted locally (backend unregister skipped due to auth)"
        );
      } catch (deleteError) {
        console.error("Error deleting local FCM token:", deleteError);
      }
    } else {
      console.error("Error unregistering device token:", error);
    }
  }
}

/**
 * Setup foreground notification listener
 * This handles notifications when app is in foreground (app is open)
 */
export function setupForegroundListener(
  callback?: (payload: any) => void
): () => void {
  try {
    // @ts-ignore - Firebase v22 migration pending
    const unsubscribe = messaging().onMessage(async (remoteMessage) => {
      console.log("📩 Foreground Notification:", remoteMessage);

      // Parse body nếu là JSON string chứa {html: "..."}
      if (remoteMessage.notification?.body) {
        try {
          const parsed = JSON.parse(remoteMessage.notification.body);
          if (parsed && typeof parsed === "object" && parsed.html) {
            remoteMessage.notification.body = parsed.html;
          }
        } catch {
          // Không phải JSON, giữ nguyên body
        }
      }

      // You can show in-app notification or update UI here
      if (callback) {
        callback(remoteMessage);
      }
    });

    return unsubscribe;
  } catch (error) {
    console.warn(
      "Could not attach foreground message listener (Firebase not ready):",
      error
    );
    return () => {
      /* noop unsubscribe */
    };
  }
}

/**
 * Function to strip HTML tags from notification content
 */
const stripHtmlTags = (html: string): string => {
  if (!html) return "";
  // Remove HTML tags but keep the text content
  return html
    .replace(/<[^>]*>/g, " ") // Remove HTML tags
    .replace(/\s+/g, " ") // Replace multiple spaces with single space
    .trim(); // Remove leading/trailing spaces
};

/**
 * Setup background notification handler
 * This handles notifications when app is in background or quit state
 * Must be called OUTSIDE of React component (in index.js or App.tsx top level)
 */
export function setupBackgroundHandler(): void {
  try {
    // messaging() will throw if Firebase App isn't initialized (e.g. running in Expo Go
    // or before native setup). Guard against that so the app doesn't crash during
    // route initialization in dev environments.
    // @ts-ignore - Firebase v22 migration pending
    messaging().setBackgroundMessageHandler(async (remoteMessage) => {
      console.log("📩 Background Notification:", remoteMessage);

      // Process notification data to handle HTML content
      if (remoteMessage.notification?.body) {
        let body = remoteMessage.notification.body;

        // Check if body contains HTML tags and strip them
        if (body.includes("<") && body.includes(">")) {
          const cleanBody = stripHtmlTags(body);
          // Update the notification body with cleaned text
          remoteMessage.notification.body =
            cleanBody.length > 200
              ? cleanBody.substring(0, 200) + "..."
              : cleanBody;

          console.log(
            "📩 Cleaned notification body:",
            remoteMessage.notification.body
          );
        }
      }

      // You can perform other background tasks here
    });
  } catch (error) {
    // Log and continue — background handler is optional and should not break the app
    console.warn(
      "Could not set background message handler (Firebase not ready):",
      error
    );
  }
}

/**
 * Setup notification opened listener
 * This handles when user taps on notification
 */
export function setupNotificationOpenedListener(
  callback?: (payload: any) => void
): () => void {
  try {
    // Check if app was opened by notification (when app was quit)
    // @ts-ignore - Firebase v22 migration pending
    messaging()
      .getInitialNotification()
      .then((remoteMessage) => {
        if (remoteMessage) {
          console.log(
            "📩 Notification opened app from quit state:",
            remoteMessage
          );
          if (callback) {
            callback(remoteMessage);
          }
        }
      })
      .catch((error) => {
        console.warn("Error calling getInitialNotification:", error);
      });

    // Listen for notification opened (when app was in background)
    const unsubscribe = messaging().onNotificationOpenedApp((remoteMessage) => {
      console.log("📩 Notification opened app from background:", remoteMessage);
      if (callback) {
        callback(remoteMessage);
      }
    });

    return unsubscribe;
  } catch (error) {
    console.warn(
      "Could not attach notification-opened listeners (Firebase not ready):",
      error
    );
    return () => {
      /* noop unsubscribe */
    };
  }
}

/**
 * Listen for FCM token refresh
 * Token can change when:
 * - App is restored on a new device
 * - User uninstalls/reinstalls the app
 * - User clears app data
 */
export function setupTokenRefreshListener(): () => void {
  try {
    // @ts-ignore - Firebase v22 migration pending
    const unsubscribe = messaging().onTokenRefresh(async (fcmToken) => {
      console.log("🔄 FCM Token refreshed:", fcmToken);

      // Update token on backend
      try {
        await api.post(
          "/users/device-token",
          {
            token: fcmToken,
            platform: Platform.OS,
          },
          { requireAuth: true }
        );
        console.log("Updated token on backend");
      } catch (error) {
        console.error("Error updating token:", error);
      }
    });

    return unsubscribe;
  } catch (error) {
    console.warn(
      "Could not attach token refresh listener (Firebase not ready):",
      error
    );
    return () => {
      /* noop unsubscribe */
    };
  }
}
