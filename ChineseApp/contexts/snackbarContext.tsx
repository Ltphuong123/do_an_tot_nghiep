import React, { createContext, ReactNode, useContext, useState } from "react";
import { Animated, Text, View } from "react-native";
import { Icon } from "react-native-paper";

type SnackbarContextType = {
  showSnackbar: (
    message: string,
    type: "success" | "error" | "info" | "warning"
  ) => void;
};

const SnackbarContext = createContext<SnackbarContextType | undefined>(
  undefined
);

export const useSnackbar = () => {
  const context = useContext(SnackbarContext);
  if (!context) {
    throw new Error("useSnackbar phải dùng bên trong SnackbarProvider");
  }
  return context;
};

export const SnackbarProvider = ({ children }: { children: ReactNode }) => {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState("");
  const [type, setType] = useState<"success" | "error" | "info" | "warning">(
    "info"
  );
  const slideAnim = React.useRef(new Animated.Value(-100)).current;
  const timeoutRef = React.useRef<NodeJS.Timeout | number | null>(null);

  const showSnackbar = (msg: string, snackbarType: typeof type) => {
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    setMessage(msg);
    setType(snackbarType);
    setVisible(true);
    // Slide in animation
    Animated.spring(slideAnim, {
      toValue: 0,
      tension: 100,
      friction: 8,
      useNativeDriver: true,
    }).start(() => {
      // Auto dismiss after 2 seconds
      timeoutRef.current = setTimeout(() => {
        handleDismiss();
      }, 2000);
    });
  };

  const handleDismiss = () => {
    // Clear timeout if exists
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    // Slide out animation
    Animated.timing(slideAnim, {
      toValue: -100,
      duration: 200,
      useNativeDriver: true,
    }).start(() => setVisible(false));
  };

  const getSnackbarStyle = () => {
    switch (type) {
      case "success":
        return { backgroundColor: "#4CAF50" }; // xanh lá
      case "error":
        return { backgroundColor: "#F44336" }; // đỏ
      case "warning":
        return { backgroundColor: "#FF9800" }; // cam
      case "info":
      default:
        return { backgroundColor: "#2196F3" }; // xanh dương
    }
  };

  const getIcon = () => {
    switch (type) {
      case "success":
        return "check-circle";
      case "error":
        return "alert-circle";
      case "warning":
        return "warning";
      case "info":
      default:
        return "information";
    }
  };

  return (
    <SnackbarContext.Provider value={{ showSnackbar }}>
      {children}
      {visible && (
        <Animated.View
          style={{
            position: "absolute",
            top: 50,
            left: 16,
            right: 16,
            zIndex: 1000,
            transform: [{ translateY: slideAnim }],
            borderRadius: 8,
            overflow: "hidden",
          }}
        >
          <View
            style={[
              {
                paddingHorizontal: 16,
                paddingVertical: 14,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              },
              getSnackbarStyle(),
            ]}
          >
            <View
              style={{ flexDirection: "row", alignItems: "center", flex: 1 }}
            >
              <Icon source={getIcon()} size={20} color="white" />
              <Text
                style={{
                  color: "white",
                  marginLeft: 8,
                  fontSize: 15,
                  fontWeight: "500",
                  flex: 1,
                }}
                numberOfLines={2}
              >
                {message}
              </Text>
            </View>
            <Text
              style={{ color: "white", fontWeight: "bold" }}
              onPress={handleDismiss}
            >
              Đóng
            </Text>
          </View>
        </Animated.View>
      )}
    </SnackbarContext.Provider>
  );
};
