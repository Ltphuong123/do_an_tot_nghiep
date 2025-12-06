import { ButtonCustom } from "@/components/shared/buttonCustom";
import { InputCustom } from "@/components/shared/inputCustom";
import {
  DesignSystem,
  getBackgroundColor,
  getTextColor,
} from "@/constants/designSystem";
import { useLanguageContext } from "@/contexts/languageContext";
import { useThemeContext } from "@/contexts/themeContext";
import { editProfile } from "@/services/profile";
import { IUser } from "@/types/user.type";
import React, { useState } from "react";
import { Modal, Pressable, View } from "react-native";
import { Icon, Text } from "react-native-paper";

interface EmailVerificationModalProps {
  visible: boolean;
  onClose?: () => void; // Optional vì có thể không cho close khi bắt buộc
  user: IUser;
  onSuccess: (updatedUser: IUser) => void;
  isRequired?: boolean; // Có bắt buộc hay không
  startLoading: () => void;
  stopLoading: () => void;
  showSnackbar: (message: string, type: "success" | "error") => void;
}

const EmailVerificationModal: React.FC<EmailVerificationModalProps> = ({
  visible,
  onClose,
  user,
  onSuccess,
  isRequired = false,
  startLoading,
  stopLoading,
  showSnackbar,
}) => {
  const { theme } = useThemeContext();
  const { t } = useLanguageContext();
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");

  const textColor = getTextColor(theme, "primary");
  const backgroundColor = getBackgroundColor(theme, "primary");

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async () => {
    setEmailError("");

    if (!email.trim()) {
      setEmailError(t("emailRequired"));
      return;
    }

    if (!validateEmail(email.trim())) {
      setEmailError(t("emailInvalid"));
      return;
    }

    startLoading();
    try {
      const res = await editProfile({ email: email.trim(), isVerify: true });
      console.log("Response from email verification:", res.data);
      if (res.success) {
        onSuccess(res.data);
        showSnackbar(res.message || t("emailVerificationSuccess"), "success");
        setEmail("");
        if (onClose) onClose();
      }
    } catch (error: any) {
      showSnackbar(error.message || t("emailVerificationFailed"), "error");
    } finally {
      stopLoading();
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={isRequired ? undefined : onClose}
    >
      <View
        style={{
          flex: 1,
          backgroundColor: "rgba(0, 0, 0, 0.6)",
          justifyContent: "center",
          alignItems: "center",
          padding: DesignSystem.spacing.lg,
        }}
      >
        <View
          style={{
            width: "100%",
            maxWidth: 400,
            backgroundColor,
            borderRadius: DesignSystem.borderRadius.xl,
            padding: DesignSystem.spacing.xl,
            ...DesignSystem.shadows[theme].xl,
          }}
        >
          {/* Header */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: DesignSystem.spacing.lg,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 12,
                flex: 1,
              }}
            >
              <View
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 24,
                  backgroundColor:
                    theme === "light"
                      ? "rgba(74, 144, 226, 0.15)"
                      : "rgba(74, 144, 226, 0.25)",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Icon source="email-check" size={24} color="#4A90E2" />
              </View>
              <Text
                style={{
                  fontSize: DesignSystem.typography.fontSize.xl,
                  fontWeight: DesignSystem.typography.fontWeight.bold,
                  color: textColor,
                  flex: 1,
                }}
              >
                {isRequired ? t("emailRequired") : t("addEmail")}
              </Text>
            </View>
            {!isRequired && onClose && (
              <Pressable onPress={onClose}>
                <Icon source="close" size={24} color={textColor} />
              </Pressable>
            )}
          </View>

          {/* Warning nếu bắt buộc */}
          {isRequired && (
            <View
              style={{
                backgroundColor:
                  theme === "light"
                    ? "rgba(239, 68, 68, 0.1)"
                    : "rgba(239, 68, 68, 0.2)",
                padding: DesignSystem.spacing.md,
                borderRadius: DesignSystem.borderRadius.md,
                marginBottom: DesignSystem.spacing.lg,
                borderLeftWidth: 4,
                borderLeftColor: "#EF4444",
              }}
            >
              <Text
                style={{
                  fontSize: DesignSystem.typography.fontSize.sm,
                  color: "#EF4444",
                  fontWeight: DesignSystem.typography.fontWeight.semibold,
                  marginBottom: 4,
                }}
              >
                {t("emailVerificationRequired")}
              </Text>
              <Text
                style={{
                  fontSize: DesignSystem.typography.fontSize.xs,
                  color: theme === "light" ? "#991B1B" : "#FCA5A5",
                }}
              >
                {t("emailVerificationRequiredMessage")}
              </Text>
            </View>
          )}

          {/* Description */}
          <Text
            style={{
              fontSize: DesignSystem.typography.fontSize.sm,
              color: getTextColor(theme, "secondary"),
              marginBottom: DesignSystem.spacing.lg,
              lineHeight: 20,
            }}
          >
            {t("emailVerificationDescription")}
          </Text>

          {/* Email Input */}
          <InputCustom
            label={t("email")}
            placeholder={t("enterEmail")}
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              setEmailError("");
            }}
            error={emailError}
          />

          {/* Actions */}
          <View
            style={{
              flexDirection: "row",
              gap: DesignSystem.spacing.md,
              marginTop: DesignSystem.spacing.lg,
            }}
          >
            {!isRequired && onClose && (
              <View style={{ flex: 1 }}>
                <ButtonCustom
                  title={t("cancel")}
                  onPress={onClose}
                  startColors={
                    theme === "light" ? "#F3F4F6" : "rgba(255,255,255,0.1)"
                  }
                  endColors={
                    theme === "light" ? "#E5E7EB" : "rgba(255,255,255,0.05)"
                  }
                  textStyle={{
                    color: "#fff",
                  }}
                />
              </View>
            )}
            <View style={{ flex: 1 }}>
              <ButtonCustom
                title={t("confirm")}
                onPress={handleSubmit}
                startColors="#4A90E2"
                endColors="#2563EB"
                textStyle={{ color: "#fff" }}
              />
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default EmailVerificationModal;
