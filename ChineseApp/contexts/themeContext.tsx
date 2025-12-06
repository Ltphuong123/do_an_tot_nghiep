// contexts/ThemeContext.tsx
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  Animated,
  InteractionManager,
  Text,
  useColorScheme,
  View,
} from "react-native";
import { MD3DarkTheme, MD3LightTheme, PaperProvider } from "react-native-paper";

type ThemeMode = "light" | "dark" | "system";
type ActiveTheme = "light" | "dark";

type ThemeContextType = {
  toggleTheme: () => void;
  setThemeMode: (mode: ThemeMode) => void;
  theme: ActiveTheme;
  themeMode: ThemeMode;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = "app_theme";

export const useThemeContext = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useThemeContext must be used within ThemeProvider");
  }
  return context;
};

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const systemColorScheme = useColorScheme();
  const [themeMode, setThemeModeState] = useState<ThemeMode>("system");
  const [theme, setTheme] = useState<ActiveTheme>("light");
  const [isChangingTheme, setIsChangingTheme] = useState(false);

  useEffect(() => {
    loadTheme();
  }, []);

  // Update theme khi system color scheme thay đổi
  useEffect(() => {
    if (themeMode === "system") {
      setTheme(systemColorScheme === "dark" ? "dark" : "light");
    }
  }, [systemColorScheme, themeMode]);

  const loadTheme = async () => {
    try {
      const savedMode = await AsyncStorage.getItem(THEME_STORAGE_KEY);
      if (
        savedMode &&
        (savedMode === "light" ||
          savedMode === "dark" ||
          savedMode === "system")
      ) {
        setThemeModeState(savedMode as ThemeMode);
        if (savedMode === "system") {
          setTheme(systemColorScheme === "dark" ? "dark" : "light");
        } else {
          setTheme(savedMode as ActiveTheme);
        }
      } else {
        // Mặc định là system
        setThemeModeState("system");
        setTheme(systemColorScheme === "dark" ? "dark" : "light");
      }
    } catch (error) {
      console.log("Error loading theme:", error);
    }
  };

  const setThemeMode = useCallback(
    (mode: ThemeMode) => {
      // Tránh update nếu mode không thay đổi
      if (mode === themeMode) return;

      const newTheme =
        mode === "system"
          ? systemColorScheme === "dark"
            ? "dark"
            : "light"
          : (mode as ActiveTheme);

      // Update ngay lập tức trong 1 batch
      setThemeModeState(mode);
      if (newTheme !== theme) {
        setTheme(newTheme);
      }

      // Lưu sau khi animations hoàn tất
      InteractionManager.runAfterInteractions(() => {
        AsyncStorage.setItem(THEME_STORAGE_KEY, mode).catch((error) =>
          console.log("Error saving theme:", error)
        );
      });
    },
    [themeMode, theme, systemColorScheme]
  );

  const toggleTheme = useCallback(() => {
    const newMode: ThemeMode = theme === "light" ? "dark" : "light";
    setThemeMode(newMode);
  }, [theme, setThemeMode]);

  const paperTheme = useMemo(
    () => (theme === "dark" ? MD3DarkTheme : MD3LightTheme),
    [theme]
  );

  // Memoize context value để tránh re-render children
  const contextValue = useMemo(
    () => ({ theme, themeMode, toggleTheme, setThemeMode }),
    [theme, themeMode, toggleTheme, setThemeMode]
  );

  return (
    <ThemeContext.Provider value={contextValue}>
      <PaperProvider theme={paperTheme}>
        {children}
        {/* Loading Toast khi đổi theme */}
        {isChangingTheme && <ThemeLoadingToast />}
      </PaperProvider>
    </ThemeContext.Provider>
  );
};

// Component Toast loading khi đổi theme dạng viên thuốc với progress ring
const ThemeLoadingToast = () => {
  const slideAnim = React.useRef(new Animated.Value(100)).current;
  const progressAnim = React.useRef(new Animated.Value(0)).current;
  const DURATION = 500;

  React.useEffect(() => {
    // Slide vào từ phải sang trái
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start();

    // Chạy progress ring từ 0 đến 100% trong 500ms
    Animated.timing(progressAnim, {
      toValue: 1,
      duration: DURATION,
      useNativeDriver: false,
    }).start();
  }, []);

  // Tính toán stroke-dashoffset cho progress ring
  const circumference = 2 * Math.PI * 18; // radius = 18
  const strokeDashoffset = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [circumference, 0],
  });

  return (
    <Animated.View
      style={{
        position: "absolute",
        top: 50,
        alignSelf: "center",
        transform: [{ translateX: slideAnim }],
        borderRadius: 24,
        backgroundColor: "rgba(255, 255, 255, 0.95)",
        paddingHorizontal: 20,
        paddingVertical: 12,
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 8,
        zIndex: 9999,
      }}
    >
      {/* Progress Ring SVG */}
      <View
        style={{
          width: 40,
          height: 40,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Animated.View style={{ position: "absolute" }}>
          {/* Background circle */}
          <View
            style={{
              width: 36,
              height: 36,
              borderRadius: 18,
              borderWidth: 3,
              borderColor: "#E5E7EB",
            }}
          />
        </Animated.View>
        <Animated.View
          style={{
            position: "absolute",
            transform: [{ rotate: "-90deg" }],
          }}
        >
          {/* Progress stroke - Simulated with View */}
          <Animated.View
            style={{
              width: 36,
              height: 36,
              borderRadius: 18,
              borderWidth: 3,
              borderColor: "#3b82f6",
              borderRightColor: "transparent",
              borderBottomColor: "transparent",
              transform: [
                {
                  rotate: progressAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ["0deg", "360deg"],
                  }),
                },
              ],
            }}
          />
        </Animated.View>
        {/* Icon theme center */}
        <View style={{ position: "absolute" }}>
          <Text style={{ fontSize: 18 }}>🎨</Text>
        </View>
      </View>
      <Text style={{ color: "#1f2937", fontSize: 15, fontWeight: "600" }}>
        Đang chuyển theme...
      </Text>
    </Animated.View>
  );
};
