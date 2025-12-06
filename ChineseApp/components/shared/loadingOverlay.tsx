import {
  getBackgroundColor,
  getShadow,
  getTextColor,
} from "@/constants/designSystem";
import { useLoadingContext } from "@/contexts/loadingContext";
import { useThemeContext } from "@/contexts/themeContext";
import React from "react";
import {
  ActivityIndicator,
  Dimensions,
  Modal,
  StyleSheet,
  View,
} from "react-native";
import { Text } from "react-native-paper";

const { width } = Dimensions.get("window");

export const LoadingOverlay: React.FC = () => {
  const { theme } = useThemeContext();
  const { isLoading, loadingMessage } = useLoadingContext();

  if (!isLoading) return null;

  const backgroundColor = getBackgroundColor(theme, "elevated");
  const textColor = getTextColor(theme, "primary");
  const spinnerColor = theme === "light" ? "#667eea" : "#f093fb";

  return (
    <Modal transparent visible={isLoading} animationType="fade">
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <View
          style={[
            styles.loadingContainer,
            {
              backgroundColor,
            },
            getShadow(theme, "xl"),
          ]}
        >
          <ActivityIndicator
            size="large"
            color={spinnerColor}
            style={styles.spinner}
          />
          {loadingMessage && (
            <Text style={[styles.loadingText, { color: textColor }]}>
              {loadingMessage}{" "}
            </Text>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    padding: 30,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    minWidth: 120,
    maxWidth: width * 0.8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  spinner: {
    marginBottom: 15,
  },
  loadingText: {
    fontSize: 16,
    fontWeight: "500",
    textAlign: "center",
    lineHeight: 22,
  },
});
