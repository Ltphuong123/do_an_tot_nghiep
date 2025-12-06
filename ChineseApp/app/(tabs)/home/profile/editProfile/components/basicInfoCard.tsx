import { CardCustom } from "@/components/shared/cardCustom";
import {
  DesignSystem,
  getBorderColor,
  getTextColor,
} from "@/constants/designSystem";
import { useLanguageContext } from "@/contexts/languageContext";
import { editProfile } from "@/services/profile";
import { IUser } from "@/types/user.type";
import React, { useEffect, useState } from "react";
import { Pressable, TextInput, View } from "react-native";
import { Icon, Text } from "react-native-paper";
import InfoRow from "./infoRow";

interface BasicInfoCardProps {
  profile: IUser;
  theme: "light" | "dark";
  onLevelChange?: (level: string) => void;
  onOpenModelChangePassWord?: () => void;
  startLoading: () => void;
  stopLoading: () => void;
  showSnackbar: (message: string, type: "success" | "error") => void;
  setUser: (user: IUser) => void;
}

const BasicInfoCard: React.FC<BasicInfoCardProps> = ({
  profile,
  theme,
  onLevelChange,
  onOpenModelChangePassWord,
  startLoading,
  stopLoading,
  showSnackbar,
  setUser,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(profile.name);
  const { t } = useLanguageContext();

  // Đồng bộ editedUsername khi profile thay đổi
  useEffect(() => {
    setEditedName(profile.name);
  }, [profile.name]);

  const handleEditName = async () => {
    if (isEditing) {
      if (editedName.trim()) {
        startLoading();
        try {
          const res = await editProfile({ name: editedName.trim() });
          console.log("Response from changeName:", res);
          if (res.success === true) {
            setUser({
              ...profile,
              name: editedName.trim(),
            });
            showSnackbar(res.message || t("updateNameSuccess"), "success");
            setIsEditing(false);
          }
        } catch (error: any) {
          showSnackbar(error.message || t("updateNameFailed"), "error");
        } finally {
          stopLoading();
        }
      } else {
        setIsEditing(false);
      }
    } else {
      setIsEditing(true);
    }
  };

  const textColor = getTextColor(theme, "primary");
  const secondaryTextColor = getTextColor(theme, "secondary");
  const borderColor = getBorderColor(theme, "medium");

  return (
    <CardCustom
      variant="card"
      style={{ marginBottom: DesignSystem.spacing.lg }}
    >
      <Text
        style={{
          fontSize: DesignSystem.typography.fontSize.lg,
          fontWeight: DesignSystem.typography.fontWeight.bold,
          color: textColor,
          marginBottom: DesignSystem.spacing.md,
        }}
      >
        {t("basicInfo")}
      </Text>

      <View
        style={{
          height: 1,
          backgroundColor: borderColor,
          marginVertical: DesignSystem.spacing.md,
        }}
      />

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingVertical: DesignSystem.spacing.sm,
          paddingHorizontal: DesignSystem.spacing.xs,
          borderRadius: DesignSystem.borderRadius.md,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: DesignSystem.spacing.md,
            flex: 1,
          }}
        >
          <View
            style={{
              width: 36,
              height: 36,
              borderRadius: DesignSystem.borderRadius.md,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor:
                theme === "light"
                  ? "rgba(74, 144, 226, 0.15)"
                  : "rgba(74, 144, 226, 0.25)",
            }}
          >
            <Icon source="account-key" size={20} color="#4A90E2" />
          </View>
          <Text
            style={{
              fontSize: DesignSystem.typography.fontSize.sm,
              fontWeight: DesignSystem.typography.fontWeight.medium,
              color: secondaryTextColor,
            }}
          >
            {t("username")}
          </Text>
        </View>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: DesignSystem.spacing.sm,
            maxWidth: "50%",
          }}
        >
          <Text
            style={{
              fontSize: DesignSystem.typography.fontSize.sm,
              fontWeight: DesignSystem.typography.fontWeight.semibold,
              color: textColor,
            }}
          >
            {profile.provider === "google" ? profile.name : profile.username}
          </Text>
        </View>
      </View>

      <View
        style={{
          height: 1,
          backgroundColor: borderColor,
          marginVertical: DesignSystem.spacing.md,
        }}
      />

      {/* Username */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingVertical: DesignSystem.spacing.sm,
          paddingHorizontal: DesignSystem.spacing.xs,
          borderRadius: DesignSystem.borderRadius.md,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: DesignSystem.spacing.md,
            flex: 1,
          }}
        >
          <View
            style={{
              width: 36,
              height: 36,
              borderRadius: DesignSystem.borderRadius.md,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor:
                theme === "light"
                  ? "rgba(74, 144, 226, 0.15)"
                  : "rgba(74, 144, 226, 0.25)",
            }}
          >
            <Icon source="account" size={20} color="#4A90E2" />
          </View>
          <Text
            style={{
              fontSize: DesignSystem.typography.fontSize.sm,
              fontWeight: DesignSystem.typography.fontWeight.medium,
              color: secondaryTextColor,
            }}
          >
            {t("userAccount")}
          </Text>
        </View>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: DesignSystem.spacing.sm,
            maxWidth: "50%",
          }}
        >
          {isEditing ? (
            <TextInput
              value={editedName}
              onChangeText={setEditedName}
              style={{
                width: 150,
                height: 36,
                borderWidth: 1,
                borderColor: borderColor,
                borderRadius: DesignSystem.borderRadius.sm,
                paddingHorizontal: DesignSystem.spacing.sm,
                fontSize: DesignSystem.typography.fontSize.sm,
                color: textColor,
              }}
              autoFocus
            />
          ) : (
            <Text
              style={{
                fontSize: DesignSystem.typography.fontSize.sm,
                fontWeight: DesignSystem.typography.fontWeight.semibold,
                color: textColor,
              }}
            >
              {profile.name}
            </Text>
          )}
          <Pressable onPress={handleEditName}>
            <Icon
              source={isEditing ? "check" : "pencil"}
              size={18}
              color={isEditing ? "#4CAF50" : secondaryTextColor}
            />
          </Pressable>
        </View>
      </View>

      <View
        style={{
          height: 1,
          backgroundColor: borderColor,
          marginVertical: DesignSystem.spacing.md,
        }}
      />

      {/* role */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingVertical: DesignSystem.spacing.sm,
          paddingHorizontal: DesignSystem.spacing.xs,
          borderRadius: DesignSystem.borderRadius.md,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: DesignSystem.spacing.md,
            flex: 1,
          }}
        >
          <View
            style={{
              width: 36,
              height: 36,
              borderRadius: DesignSystem.borderRadius.md,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor:
                theme === "light"
                  ? "rgba(74, 144, 226, 0.15)"
                  : "rgba(74, 144, 226, 0.25)",
            }}
          >
            <Icon source="shield-account" size={20} color="#4A90E2" />
          </View>
          <Text
            style={{
              fontSize: DesignSystem.typography.fontSize.sm,
              fontWeight: DesignSystem.typography.fontWeight.medium,
              color: secondaryTextColor,
            }}
          >
            {t("role")}
          </Text>
        </View>

        <Text
          style={{
            fontSize: DesignSystem.typography.fontSize.sm,
            fontWeight: DesignSystem.typography.fontWeight.semibold,
            color: textColor,
          }}
        >
          {profile.role}
        </Text>
      </View>

      <View
        style={{
          height: 1,
          backgroundColor: borderColor,
          marginVertical: DesignSystem.spacing.md,
        }}
      />

      {/* huy hiệu */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingVertical: DesignSystem.spacing.sm,
          paddingHorizontal: DesignSystem.spacing.xs,
          borderRadius: DesignSystem.borderRadius.md,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: DesignSystem.spacing.md,
            flex: 1,
          }}
        >
          <View
            style={{
              width: 36,
              height: 36,
              borderRadius: DesignSystem.borderRadius.md,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor:
                theme === "light"
                  ? "rgba(74, 144, 226, 0.15)"
                  : "rgba(74, 144, 226, 0.25)",
            }}
          >
            <Icon source="medal" size={20} color="#FFD700" />
          </View>
          <Text
            style={{
              fontSize: DesignSystem.typography.fontSize.sm,
              fontWeight: DesignSystem.typography.fontWeight.medium,
              color: secondaryTextColor,
            }}
          >
            {t("badge")}
          </Text>
        </View>

        <Text
          style={{
            fontSize: DesignSystem.typography.fontSize.sm,
            fontWeight: DesignSystem.typography.fontWeight.semibold,
            color: textColor,
          }}
        >
          {profile.badge.name}
        </Text>
      </View>

      <View
        style={{
          height: 1,
          backgroundColor: borderColor,
          marginVertical: DesignSystem.spacing.md,
        }}
      />

      {/* điểm cộng đồng */}

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingVertical: DesignSystem.spacing.sm,
          paddingHorizontal: DesignSystem.spacing.xs,
          borderRadius: DesignSystem.borderRadius.md,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: DesignSystem.spacing.md,
            flex: 1,
          }}
        >
          <View
            style={{
              width: 36,
              height: 36,
              borderRadius: DesignSystem.borderRadius.md,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor:
                theme === "light"
                  ? "rgba(74, 144, 226, 0.15)"
                  : "rgba(74, 144, 226, 0.25)",
            }}
          >
            <Icon source="shield-account" size={20} color="#c043d9ff" />
          </View>
          <Text
            style={{
              fontSize: DesignSystem.typography.fontSize.sm,
              fontWeight: DesignSystem.typography.fontWeight.medium,
              color: secondaryTextColor,
            }}
          >
            {t("communityPoints")}
          </Text>
        </View>

        <Text
          style={{
            fontSize: DesignSystem.typography.fontSize.sm,
            fontWeight: DesignSystem.typography.fontWeight.semibold,
            color: textColor,
          }}
        >
          {profile.community_points}
        </Text>
      </View>

      <View
        style={{
          height: 1,
          backgroundColor: borderColor,
          marginVertical: DesignSystem.spacing.md,
        }}
      />

      {/* Level */}

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingVertical: DesignSystem.spacing.sm,
          paddingHorizontal: DesignSystem.spacing.xs,
          borderRadius: DesignSystem.borderRadius.md,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: DesignSystem.spacing.md,
            flex: 1,
          }}
        >
          <View
            style={{
              width: 36,
              height: 36,
              borderRadius: DesignSystem.borderRadius.md,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor:
                theme === "light"
                  ? "rgba(74, 144, 226, 0.15)"
                  : "rgba(74, 144, 226, 0.25)",
            }}
          >
            <Icon source="school" size={20} color="#21d949ff" />
          </View>
          <Text
            style={{
              fontSize: DesignSystem.typography.fontSize.sm,
              fontWeight: DesignSystem.typography.fontWeight.medium,
              color: secondaryTextColor,
            }}
          >
            {t("level")}
          </Text>
        </View>

        <Text
          style={{
            fontSize: DesignSystem.typography.fontSize.sm,
            fontWeight: DesignSystem.typography.fontWeight.semibold,
            color: textColor,
          }}
        >
          {profile.level}
        </Text>
      </View>

      <View
        style={{
          height: 1,
          backgroundColor: borderColor,
          marginVertical: DesignSystem.spacing.md,
        }}
      />

      {/* Password */}
      <InfoRow
        icon="lock"
        label={t("password")}
        value={t("changePassword")}
        iconColor="#F44336"
        theme={theme}
        onPress={onOpenModelChangePassWord}
        showChevron
      />
    </CardCustom>
  );
};

export default BasicInfoCard;
