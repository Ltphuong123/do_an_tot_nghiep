# 📱 Push Notification Setup - Complete Guide

## ✅ COMPLETED SETUP

### 1. **Firebase Packages** ✓

```json
"@react-native-firebase/app": "^23.5.0"
"@react-native-firebase/messaging": "^23.5.0"
```

### 2. **Android Configuration** ✓

**File: `android/app/build.gradle`**

```gradle
apply plugin: "com.google.gms.google-services"
```

**File: `android/app/src/main/AndroidManifest.xml`**

```xml
<uses-permission android:name="android.permission.POST_NOTIFICATIONS"/>
```

### 3. **Google Services** ✓

**File: `android/app/google-services.json`** - Already configured with both packages:

- `app.notification` (Firebase test)
- `com.tan157.ChineseApp` (Your app)

### 4. **Notification Helper Functions** ✓

**File: `utils/notificationHelper.ts`**

- `requestNotificationPermission()` - Requests user permission
- `getFCMToken()` - Gets FCM token
- `registerDeviceToken()` - Registers token to backend
- `unregisterDeviceToken()` - Unregisters token on logout
- `setupForegroundListener()` - Handles foreground notifications
- `setupBackgroundHandler()` - Handles background notifications
- `setupNotificationOpenedListener()` - Handles notification tap
- `setupTokenRefreshListener()` - Listens for token refresh

### 5. **Login Integration** ✓

**File: `app/auth/login.tsx`**

- Calls `registerDeviceToken()` after successful login
- Calls `setupTokenRefreshListener()` to auto-refresh token
- Works for both email/password and Google Sign-in

### 6. **Logout Integration** ✓

**File: `app/(tabs)/home/profile/components/orther.tsx`**

- Calls `unregisterDeviceToken()` before logout
- Clears all tokens from backend

### 7. **App-Wide Setup** ✓

**File: `app/_layout.tsx`**

- `setupBackgroundHandler()` - Called at top level
- `setupForegroundListener()` - Shows notification popup
- `setupNotificationOpenedListener()` - Navigates based on notification
- `setupTokenRefreshListener()` - Auto-refreshes token

---

## 🚀 BUILD & TEST

### Step 1: Clean Install

```bash
npm install
```

### Step 2: Build Android

```bash
npm run android
```

### Step 3: Check FCM Token

Open Chrome DevTools and check console for:

```
📩 Foreground: ...
🔄 FCM Token refreshed: ...
Device token registered: ...
```

### Step 4: Get Token for Testing

Add this to any component to print token:

```typescript
import { getFCMToken } from "@/utils/notificationHelper";

useEffect(() => {
  getFCMToken().then((token) => {
    console.log("📌 FCM Token:", token);
  });
}, []);
```

### Step 5: Test Notification from Firebase Console

1. Go to **Firebase Console** → **Cloud Messaging**
2. Click **Send your first message**
3. Enter:
   - **Title**: "Test Notification"
   - **Body**: "This is a test"
4. Click **Send test message**
5. Paste your FCM token
6. Click **Test**

### Step 6: Verify Flow

**When App is Open (Foreground):**

```
✅ Notification shows in popup
✅ Console shows: 📩 Foreground Notification
```

**When App is Closed (Background):**

```
✅ Notification shows in notification tray
✅ Console shows: 📩 Background Notification
```

**When User Taps Notification:**

```
✅ App opens
✅ Console shows: 📩 Notification opened app
✅ App navigates based on redirect_type
```

---

## 📋 BACKEND API INTEGRATION

### Register Device Token

```
POST /users/device-token
Headers: Authorization: Bearer <token>
Body: {
  "token": "fcm_token_here",
  "platform": "android" | "ios"
}
```

### Unregister Device Token

```
DELETE /users/device-token
Headers: Authorization: Bearer <token>
Body: {
  "token": "fcm_token_here"
}
```

### Send Notification Payload

```json
{
  "recipient_id": "user_id",
  "audience": "user",
  "type": "community",
  "title": "❤️ John liked your post",
  "content": {
    "message": "John liked your post about learning Chinese"
  },
  "redirect_type": "post",
  "data": {
    "post_id": "660e8400-e29b-41d4-a716-446655440001",
    "post_title": "Learning Chinese Effectively"
  },
  "priority": 1
}
```

---

## 🔄 NOTIFICATION FLOW DIAGRAM

```
Login → registerDeviceToken() → Backend stores token
                             ↓
                      setupTokenRefreshListener()
                             ↓
App Receives Notification → Firebase Messaging
                             ↓
                    ┌────────┴────────┐
                    ↓                  ↓
            Foreground (App Open)   Background (App Closed)
            Show Popup              System Tray
            Console Log             Wake App
                    ↓                  ↓
                User Taps Notification
                    ↓
          setupNotificationOpenedListener()
                    ↓
            Navigate based on redirect_type
                    ↓
                Logout → unregisterDeviceToken() → Token deleted
```

---

## 🐛 TROUBLESHOOTING

### Token Not Registered

```
❌ Check: Are you calling registerDeviceToken() after login?
❌ Check: Is backend /users/device-token endpoint working?
✅ Fix: Check console logs for error messages
```

### Notification Not Showing

```
❌ Check: Did you request notification permission?
❌ Check: Is notification permission granted in phone settings?
❌ Check: Is the token still valid (hasn't expired)?
✅ Fix: Re-login to get new token
```

### Permission Denied

```
❌ For Android 13+: Open app → Settings → Allow notifications
❌ For iOS: Open app → Settings → Allow notifications
```

### Token Not Updating

```
❌ Check: Is setupTokenRefreshListener() being called?
❌ Check: Is backend receiving token refresh requests?
✅ Fix: Reinstall app to get fresh token
```

---

## 📝 CHECKLIST - FINAL

- [x] Firebase packages installed
- [x] google-services.json configured
- [x] Google Services plugin added to build.gradle
- [x] POST_NOTIFICATIONS permission added
- [x] notificationHelper.ts created with all functions
- [x] Login calls registerDeviceToken()
- [x] Login calls setupTokenRefreshListener()
- [x] Google Sign-in also registers device token
- [x] Logout calls unregisterDeviceToken()
- [x] App.\_layout.tsx sets up listeners
- [x] Notification popup component created
- [x] Background handler configured

**READY TO DEPLOY! 🚀**

---

## 🎯 NEXT STEPS

1. **Build APK/AAB** for production
2. **Upload to Play Store**
3. **Monitor notification delivery** in Firebase Console
4. **Analyze notification metrics** (delivery, open rate)
5. **A/B test** notification titles/content
