import { ThemedText } from "@/components/themed-text";
import { useThemeContext } from "@/contexts/themeContext";
import { useDownloadExam } from "@/hooks/useDownloadExam";
import { IExam } from "@/types/mockTest.type";
import React, { useMemo } from "react";
import { ActivityIndicator, Pressable, View } from "react-native";
import { Icon } from "react-native-paper";

interface DownloadButtonProps {
  exam: IExam;
  size?: number;
  showText?: boolean;
  onDownloadStart?: () => void;
  onDownloadSuccess?: () => void;
  onDownloadError?: (error: string) => void;
}

export const DownloadButton: React.FC<DownloadButtonProps> = ({
  exam,
  size = 24,
  showText = false,
  onDownloadStart,
  onDownloadSuccess,
  onDownloadError,
}) => {
  const { theme } = useThemeContext();
  const { downloadExam, getDownloadStatus } = useDownloadExam();

  const downloadStatus = getDownloadStatus(exam.id);

  const { iconName, iconColor, backgroundColor, isDisabled } = useMemo(() => {
    if (downloadStatus.isDownloading) {
      return {
        iconName: "download",
        iconColor: "#4A90E2",
        backgroundColor:
          theme === "light"
            ? "rgba(74, 144, 226, 0.1)"
            : "rgba(74, 144, 226, 0.2)",
        isDisabled: true,
      };
    } else if (downloadStatus.isDownloaded) {
      return {
        iconName: "check-circle",
        iconColor: "#4CAF50",
        backgroundColor:
          theme === "light"
            ? "rgba(76, 175, 80, 0.1)"
            : "rgba(76, 175, 80, 0.2)",
        isDisabled: false,
      };
    } else {
      return {
        iconName: "download",
        iconColor: theme === "light" ? "#666" : "#999",
        backgroundColor:
          theme === "light"
            ? "rgba(0, 0, 0, 0.05)"
            : "rgba(255, 255, 255, 0.1)",
        isDisabled: false,
      };
    }
  }, [downloadStatus, theme]);

  const handlePress = async () => {
    if (isDisabled) return;

    if (downloadStatus.isDownloaded) {
      onDownloadSuccess?.();
    } else {
      onDownloadStart?.();
      const success = await downloadExam(exam);
      if (success) {
        onDownloadSuccess?.();
      } else {
        onDownloadError?.("Lỗi khi tải bài thi");
      }
    }
  };

  const getDisplayText = () => {
    if (downloadStatus.isDownloading) {
      if (downloadStatus.progress > 0) {
        return `${Math.round(downloadStatus.progress)}%`;
      }
      return "Đang tải...";
    } else if (downloadStatus.isDownloaded) {
      return "Đã tải";
    } else {
      return "Tải về";
    }
  };

  return (
    <View style={{ alignItems: "center", gap: 4 }}>
      <Pressable
        onPress={handlePress}
        disabled={isDisabled}
        style={{
          width: size + 12,
          height: size + 12,
          borderRadius: (size + 12) / 2,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor,
          opacity: isDisabled ? 0.6 : 1,
        }}
      >
        {downloadStatus.isDownloading ? (
          <ActivityIndicator size={size * 0.7} color={iconColor} />
        ) : (
          <Icon source={iconName} size={size} color={iconColor} />
        )}
      </Pressable>

      {showText && (
        <ThemedText
          style={{
            fontSize: 10,
            textAlign: "center",
            maxWidth: 80,
          }}
        >
          {getDisplayText()}
        </ThemedText>
      )}

      {downloadStatus.isDownloading && downloadStatus.message && showText && (
        <ThemedText
          style={{
            fontSize: 8,
            textAlign: "center",
            maxWidth: 120,
            opacity: 0.7,
          }}
        >
          {downloadStatus.message}
        </ThemedText>
      )}
    </View>
  );
};
