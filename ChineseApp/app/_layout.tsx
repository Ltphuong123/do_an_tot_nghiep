import { LoadingInitializer } from "@/components/shared/loadingInitializer";
import { LoadingOverlay } from "@/components/shared/loadingOverlay";
import { NotificationPopup } from "@/components/shared/notificationPopup";
import { AnimationConfig } from "@/constants/animation";
import { getPaperTheme } from "@/constants/paperTheme";
import { Colors } from "@/constants/theme";
import { LanguageProvider } from "@/contexts/languageContext";
import { LoadingProvider } from "@/contexts/loadingContext";
import { NotificationProvider } from "@/contexts/notificationContext";

import { SnackbarProvider } from "@/contexts/snackbarContext";
import { SpeechRecognitionProvider } from "@/contexts/speechRecognitionContext";
import { TabRefreshProvider } from "@/contexts/tabRefreshContext";
import { ThemeProvider, useThemeContext } from "@/contexts/themeContext";
import { useLoadFonts } from "@/hooks/useLoadFonts";
import { useUserStore } from "@/store/useUserStore";
import {
  setupBackgroundHandler,
  setupForegroundListener,
  setupNotificationOpenedListener,
} from "@/utils/notificationHelper";
import {
  QueryClient,
  QueryClientProvider,
  useQueryClient,
} from "@tanstack/react-query";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { PaperProvider } from "react-native-paper";
import "react-native-reanimated";
// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10, // 10 minutes (formerly cacheTime)
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export const unstable_settings = {
  anchor: "(tabs)",
};

// Setup background handler (must be at top level)
setupBackgroundHandler();

// Component to handle notification listeners inside NotificationProvider
function NotificationSetup() {
  const [notificationPopup, setNotificationPopup] = useState<{
    visible: boolean;
    title: string;
    body?: string;
  }>({ visible: false, title: "" });

  // Function to strip HTML tags from text
  const stripHtmlTags = (html: string): string => {
    if (!html) return "";
    // Remove HTML tags but keep the text content
    return html
      .replace(/<[^>]*>/g, " ") // Remove HTML tags
      .replace(/\s+/g, " ") // Replace multiple spaces with single space
      .trim(); // Remove leading/trailing spaces
  };

  useEffect(() => {
    // Listen for foreground notifications
    const unsubscribeForeground = setupForegroundListener((payload) => {
      console.log("📩 Received foreground notification:", payload);

      // Show notification popup
      const title = payload.notification?.title || "Thông báo mới";
      let body = payload.notification?.body || "";

      // Check if body contains HTML tags and strip them for better display
      if (body.includes("<") && body.includes(">")) {
        const cleanBody = stripHtmlTags(body);
        // If the cleaned body is too long, truncate it
        body =
          cleanBody.length > 200
            ? cleanBody.substring(0, 200) + "..."
            : cleanBody;
      }

      setNotificationPopup({ visible: true, title, body });
    });

    const unsubscribeOpened = setupNotificationOpenedListener((payload) => {
      console.log("📩 User tapped notification:", payload);
    });

    return () => {
      unsubscribeForeground?.();
      unsubscribeOpened?.();
    };
  }, []);

  return (
    <NotificationPopup
      visible={notificationPopup.visible}
      title={notificationPopup.title}
      body={notificationPopup.body}
      onDismiss={() => setNotificationPopup({ visible: false, title: "" })}
      onPress={() => {
        // TODO: Navigate to notification screen
        setNotificationPopup({ visible: false, title: "" });
      }}
    />
  );
}

export default function RootLayout() {
  const { fontsLoaded, fontError } = useLoadFonts();
  const [appReady, setAppReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        // Đợi fonts load xong
        if (fontsLoaded || fontError) {
          // Thêm delay nhỏ để splash screen hiển thị đủ lâu
          await new Promise((resolve) => setTimeout(resolve, 500));
          setAppReady(true);
        }
      } catch (e) {
        console.warn(e);
      }
    }

    prepare();
  }, [fontsLoaded, fontError]);

  if (!appReady) {
    return null;
  }

  if (fontError) {
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <LoadingProvider>
          <ThemeProvider>
            <LanguageProvider>
              <TabRefreshProvider>
                {/** PaperProvider moved INSIDE LayoutContent */}
                <LayoutContent />
              </TabRefreshProvider>
            </LanguageProvider>
          </ThemeProvider>
        </LoadingProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}

function LayoutContent() {
  const { theme } = useThemeContext();
  const queryClient = useQueryClient();
  const { user } = useUserStore();

  useEffect(() => {
    if (user.id) {
      // Invalidate all queries when user changes to ensure fresh data for new user
      queryClient.invalidateQueries();
    }
  }, [user.id, queryClient]);

  return (
    <PaperProvider theme={getPaperTheme(theme)}>
      <SnackbarProvider>
        <SpeechRecognitionProvider>
          <NotificationProvider>
            <NotificationSetup />
            <LoadingInitializer>
              <Stack
                screenOptions={{
                  ...AnimationConfig.stack.slideFromRight,
                  contentStyle: {
                    backgroundColor: Colors[theme].background,
                  },
                  headerShown: false,
                }}
              >
                <Stack.Screen
                  name="auth/register"
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="auth/login"
                  options={{ headerShown: false }}
                />
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen
                  name="notebookDetail"
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="postDetail"
                  options={{ headerShown: false }}
                />
                <Stack.Screen name="tips" options={{ headerShown: false }} />
                <Stack.Screen
                  name="notification"
                  options={{ headerShown: false }}
                />
              </Stack>

              <LoadingOverlay />
            </LoadingInitializer>

            <StatusBar style={theme === "dark" ? "light" : "dark"} />
          </NotificationProvider>
        </SpeechRecognitionProvider>
      </SnackbarProvider>
    </PaperProvider>
  );
}
