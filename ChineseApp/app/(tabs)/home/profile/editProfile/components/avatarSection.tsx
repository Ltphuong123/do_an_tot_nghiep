import AvatarCustom from "@/components/shared/avatarCustom";
import { DesignSystem } from "@/constants/designSystem";
import { uploadCloudinary } from "@/hooks/useCloudinaryUpload";
import { editProfile } from "@/services/profile";
import { IUser } from "@/types/user.type";
import * as ImagePicker from "expo-image-picker";
import React from "react";
import { Alert, Animated, Pressable, View } from "react-native";
import { Icon, Text } from "react-native-paper";

interface AvatarSectionProps {
  profile: IUser;
  scaleAnim: Animated.Value;
  theme: "light" | "dark";
  startLoading: () => void;
  stopLoading: () => void;
  showSnackbar: (message: string, type: "success" | "error") => void;
  setUser: (user: IUser) => void;
}

const AvatarSection: React.FC<AvatarSectionProps> = ({
  profile,
  scaleAnim,
  theme,
  startLoading,
  stopLoading,
  showSnackbar,
  setUser,
}) => {
  const handleChangeAvatar = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      Alert.alert(
        "Quyền truy cập",
        "Ứng dụng cần quyền truy cập thư viện ảnh để thay đổi avatar"
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      try {
        startLoading();
        const imageUrl = await uploadCloudinary(result.assets[0]);
        const res = await editProfile({ avatar_url: imageUrl });
        if (res.success) {
          showSnackbar(res.message || "Cập nhật avatar thành công", "success");
          setUser(res.data);
        } else {
          showSnackbar(res.message || "Cập nhật avatar thất bại", "error");
        }
      } catch (error: any) {
        showSnackbar(error.message, "error");
      } finally {
        stopLoading();
      }
    }
  };

  return (
    <Animated.View
      style={{
        alignItems: "center",
        marginBottom: DesignSystem.spacing.xl,
        transform: [{ scale: scaleAnim }],
      }}
    >
      <Pressable onPress={handleChangeAvatar}>
        <View style={{ position: "relative" }}>
          <AvatarCustom size={120} avatar={profile.avatar_url} />
          <View
            style={{
              position: "absolute",
              bottom: 0,
              right: 0,
              width: 40,
              height: 40,
              borderRadius: 20,
              justifyContent: "center",
              alignItems: "center",
              borderWidth: 3,
              borderColor: "#FFFFFF",
              backgroundColor: "#4A90E2",
              ...DesignSystem.shadows[theme].md,
            }}
          >
            <Icon source="camera" size={20} color="#FFFFFF" />
          </View>
        </View>
      </Pressable>

      {profile.isVerify ? (
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 6,
            marginTop: DesignSystem.spacing.md,
            paddingHorizontal: DesignSystem.spacing.lg,
            paddingVertical: 6,
            borderRadius: DesignSystem.borderRadius.full,
            backgroundColor:
              theme === "light"
                ? "rgba(76, 175, 80, 0.1)"
                : "rgba(76, 175, 80, 0.2)",
          }}
        >
          <Icon source="check-decagram" size={16} color="#4CAF50" />
          <Text
            style={{
              fontSize: DesignSystem.typography.fontSize.sm,
              color: "#4CAF50",
              fontWeight: DesignSystem.typography.fontWeight.semibold,
            }}
          >
            Đã xác thực
          </Text>
        </View>
      ) : (
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 6,
            marginTop: DesignSystem.spacing.md,
            paddingHorizontal: DesignSystem.spacing.lg,
            paddingVertical: 6,
            borderRadius: DesignSystem.borderRadius.full,
            backgroundColor:
              theme === "light"
                ? "rgba(255, 167, 38, 0.08)"
                : "rgba(255, 167, 38, 0.12)",
          }}
        >
          <Icon source="alert-circle-outline" size={16} color="#FF9800" />
          <Text
            style={{
              fontSize: DesignSystem.typography.fontSize.sm,
              color: "#FF9800",
              fontWeight: DesignSystem.typography.fontWeight.semibold,
            }}
          >
            Chưa xác thực
          </Text>
        </View>
      )}
    </Animated.View>
  );
};

export default AvatarSection;
