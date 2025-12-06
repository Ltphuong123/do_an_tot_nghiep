import { ButtonCustom } from "@/components/shared/buttonCustom";
import { InputCustom } from "@/components/shared/inputCustom";
import {
  DesignSystem,
  getBackgroundColor,
  getColorCancel,
  getColorConfirm,
  getTextColor,
} from "@/constants/designSystem";
import { useLanguageContext } from "@/contexts/languageContext";
import { useThemeContext } from "@/contexts/themeContext";
import { changePassword } from "@/services/auth";
import { useState } from "react";
import {
  Dimensions,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { Icon, Text } from "react-native-paper";

type ChangePasswordProps = {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  startLoading: () => void;
  stopLoading: () => void;
  showSnackbar: (message: string, type: "success" | "error" | "info") => void;
};

const ChangePassword = ({
  visible,
  setVisible,
  startLoading,
  stopLoading,
  showSnackbar,
}: ChangePasswordProps) => {
  const { theme } = useThemeContext();
  const { t } = useLanguageContext();
  const textColor = getTextColor(theme, "primary");
  const secondaryTextColor = getTextColor(theme, "secondary");
  const backgroundColor = getBackgroundColor(theme, "primary");
  const [showOldPassword, setShowOldPassword] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [newPassword, setNewPassword] = useState<string>("");
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [oldPassword, setOldPassword] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string>("");
  const [confirmPasswordError, setConfirmPasswordError] = useState<string>("");

  const windowHeight = Dimensions.get("window").height;
  const maxModalHeight = Math.min(600, windowHeight * 0.85); // giới hạn chiều cao modal

  const handleReset = () => {
    setNewPassword("");
    setConfirmPassword("");
    setPasswordError("");
    setConfirmPasswordError("");
    setOldPassword("");
    setShowOldPassword(false);
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  const handleConfirm = async () => {
    Keyboard.dismiss();
    if (newPassword !== confirmPassword) {
      setConfirmPasswordError(t("passwordMismatch"));
      return;
    } else {
      try {
        startLoading();
        const res = await changePassword(oldPassword, newPassword);
        console.log(res);
        if (res.success) {
          showSnackbar(res.message || t("changePasswordSuccess"), "success");
          handleReset();
          setVisible(false);
        } else {
          setPasswordError(res.message || t("changePasswordFailed"));
        }
      } catch (error: any) {
        setPasswordError(error?.message || t("genericError"));
      } finally {
        stopLoading();
      }
    }
  };

  const handleClose = () => {
    setVisible(false);
    handleReset();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
      presentationStyle="overFullScreen"
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            justifyContent: "center",
            alignItems: "center",
            padding: DesignSystem.spacing.lg,
          }}
        >
          <KeyboardAvoidingView
            behavior="padding"
            keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}
            style={{ width: "100%", maxWidth: 400, alignItems: "center" }}
          >
            <ScrollView
              contentContainerStyle={{
                backgroundColor,
                borderRadius: DesignSystem.borderRadius.lg,
                padding: DesignSystem.spacing.lg,
                ...DesignSystem.shadows[theme].lg,
                width: "100%",
              }}
              style={{ maxHeight: maxModalHeight, width: "100%" }}
              keyboardShouldPersistTaps="handled"
            >
              <Text
                style={{
                  fontSize: DesignSystem.typography.fontSize.xl,
                  fontWeight: DesignSystem.typography.fontWeight.bold,
                  color: textColor,
                  marginBottom: DesignSystem.spacing.lg,
                  textAlign: "center",
                }}
              >
                {t("changePassword")}
              </Text>

              <View style={{ gap: DesignSystem.spacing.md }}>
                <InputCustom
                  label={t("oldPassword")}
                  value={oldPassword}
                  onChangeText={setOldPassword}
                  secureTextEntry={!showOldPassword}
                  onFocus={() => setPasswordError("")}
                  leftIcon={
                    <Icon source="lock" size={24} color={secondaryTextColor} />
                  }
                  rightIcon={
                    <Pressable
                      onPress={() => setShowOldPassword(!showOldPassword)}
                    >
                      <Icon
                        source={showOldPassword ? "eye" : "eye-off"}
                        size={24}
                        color={secondaryTextColor}
                      />
                    </Pressable>
                  }
                  error={passwordError}
                />

                <InputCustom
                  label={t("newPassword")}
                  value={newPassword}
                  onChangeText={setNewPassword}
                  secureTextEntry={!showPassword}
                  onFocus={() => setPasswordError("")}
                  leftIcon={
                    <Icon source="lock" size={24} color={secondaryTextColor} />
                  }
                  rightIcon={
                    <Pressable onPress={() => setShowPassword(!showPassword)}>
                      <Icon
                        source={showPassword ? "eye" : "eye-off"}
                        size={24}
                        color={secondaryTextColor}
                      />
                    </Pressable>
                  }
                />

                <InputCustom
                  label={t("confirmPassword")}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!showConfirmPassword}
                  onFocus={() => setConfirmPasswordError("")}
                  leftIcon={
                    <Icon
                      source="lock-check"
                      size={24}
                      color={secondaryTextColor}
                    />
                  }
                  rightIcon={
                    <Pressable
                      onPress={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                    >
                      <Icon
                        source={showConfirmPassword ? "eye" : "eye-off"}
                        size={24}
                        color={secondaryTextColor}
                      />
                    </Pressable>
                  }
                  error={confirmPasswordError}
                />
              </View>

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "flex-end",
                  gap: DesignSystem.spacing.md,
                  marginTop: DesignSystem.spacing.lg,
                }}
              >
                <ButtonCustom
                  size="sm"
                  title={t("close")}
                  onPress={handleClose}
                  startColors={getColorCancel(theme)}
                  endColors={getColorCancel(theme)}
                />
                <ButtonCustom
                  size="sm"
                  title={t("confirm")}
                  onPress={handleConfirm}
                  disabled={!(oldPassword && newPassword && confirmPassword)}
                  startColors={getColorConfirm(theme)}
                  endColors={getColorConfirm(theme)}
                  textStyle={{ color: "#fff" }}
                />
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default ChangePassword;
