import {
  DesignSystem,
  getColorCancel,
  getColorConfirm,
  getTextColor,
} from "@/constants/designSystem";
import { useThemeContext } from "@/contexts/themeContext";
import React from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  TouchableOpacity,
  View,
} from "react-native";
import { Icon, Text } from "react-native-paper";
import { ButtonCustom } from "./buttonCustom";
import { CardCustom } from "./cardCustom";
import { InputCustom } from "./inputCustom";

interface ConfirmModalProps {
  visible: boolean;
  onRequestClose: () => void;
  onConfirm: () => void;
  onCancel?: () => void;
  title: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  icon?: string;
  iconColor?: string;
  variant?: "confirm" | "form";
  // Form specific props
  inputValue?: string;
  onInputChange?: (value: string) => void;
  inputPlaceholder?: string;
  inputError?: string;
  inputMaxLength?: number;
  inputMultiline?: boolean;
  inputNumberOfLines?: number;
  isLoading?: boolean;
  confirmDisabled?: boolean;
  confirmIcon?: React.ReactNode;
  hideCancel?: boolean;
  disableClose?: boolean;
  isPasswordInput?: boolean;
  inputEditable?: boolean;
}

function ConfirmModal({
  visible,
  onRequestClose,
  onConfirm,
  onCancel,
  title,
  message,
  confirmText = "Xác nhận",
  cancelText = "Hủy",
  icon = "help-circle",
  iconColor = "#4A90E2",
  variant = "confirm",
  inputValue = "",
  onInputChange,
  inputPlaceholder = "",
  inputError = "",
  inputMaxLength = 50,
  inputMultiline = false,
  inputNumberOfLines = 1,
  isLoading = false,
  confirmDisabled = false,
  confirmIcon,
  hideCancel = false,
  disableClose = false,
  isPasswordInput = false,
  inputEditable = true,
}: ConfirmModalProps) {
  const { theme } = useThemeContext();
  const textColor = getTextColor(theme, "primary");
  const secondaryTextColor = getTextColor(theme, "secondary");
  const [showPassword, setShowPassword] = React.useState(false);

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      onRequestClose();
    }
  };

  return (
    <Modal
      visible={visible}
      onRequestClose={disableClose ? () => {} : onRequestClose}
      transparent
      animationType="fade"
    >
      <View
        style={{
          flex: 1,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          justifyContent: "center",
          alignItems: "center",
          padding: DesignSystem.spacing.sm,
        }}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ width: "100%", maxWidth: 500 }}
        >
          <CardCustom variant="card" borderRadius="xl" shadow="lg">
            {/* Header */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                paddingHorizontal: DesignSystem.spacing.md,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: DesignSystem.spacing.sm,
                  flex: 1,
                }}
              >
                <View
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor:
                      theme === "light" ? `${iconColor}15` : `${iconColor}25`,
                  }}
                >
                  <Icon source={icon as any} size={20} color={iconColor} />
                </View>
                <Text
                  style={{
                    fontSize: DesignSystem.typography.fontSize.xl,
                    fontWeight: DesignSystem.typography.fontWeight.bold,
                    color: textColor,
                    flex: 1,
                  }}
                >
                  {title}
                </Text>
              </View>
              <Pressable
                onPress={disableClose ? undefined : onRequestClose}
                disabled={isLoading || disableClose}
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 18,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Icon source="close" size={20} color={secondaryTextColor} />
              </Pressable>
            </View>

            {/* Content */}
            <View
              style={{
                paddingHorizontal: DesignSystem.spacing.md,
                paddingTop: DesignSystem.spacing.sm,
              }}
            >
              {/* Message for confirm variant */}
              {variant === "confirm" && message && (
                <Text
                  style={{
                    fontSize: DesignSystem.typography.fontSize.md,
                    color: textColor,
                    lineHeight: 24,
                    marginBottom: DesignSystem.spacing.md,
                  }}
                >
                  {message}
                </Text>
              )}

              {/* Input for form variant */}
              {variant === "form" && onInputChange && (
                <>
                  <InputCustom
                    value={inputValue}
                    onChangeText={onInputChange}
                    placeholder={inputPlaceholder}
                    multiline={inputMultiline}
                    numberOfLines={inputNumberOfLines}
                    secureTextEntry={isPasswordInput && !showPassword}
                    editable={inputEditable}
                    rightIcon={
                      isPasswordInput ? (
                        <TouchableOpacity
                          onPress={() => setShowPassword(!showPassword)}
                        >
                          <Icon
                            source={showPassword ? "eye" : "eye-off"}
                            size={24}
                            color={secondaryTextColor}
                          />
                        </TouchableOpacity>
                      ) : undefined
                    }
                  />

                  {inputError && (
                    <Text
                      style={{
                        fontSize: DesignSystem.typography.fontSize.xs,
                        color: "#ff5252",
                        marginTop: DesignSystem.spacing.xs,
                      }}
                    >
                      {inputError}
                    </Text>
                  )}

                  {inputMaxLength && inputEditable && (
                    <Text
                      style={{
                        fontSize: DesignSystem.typography.fontSize.xs,
                        color: secondaryTextColor,
                        textAlign: "right",
                        marginTop: DesignSystem.spacing.xs,
                        marginBottom: DesignSystem.spacing.sm,
                      }}
                    >
                      {inputValue?.length || 0}/{inputMaxLength} ký tự
                    </Text>
                  )}
                </>
              )}
            </View>

            {/* Actions */}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "flex-end",
                gap: DesignSystem.spacing.sm,
                paddingHorizontal: DesignSystem.spacing.md,
              }}
            >
              {hideCancel ? (
                <ButtonCustom
                  title={confirmText}
                  startColors={getColorConfirm(theme)}
                  endColors={getColorConfirm(theme)}
                  size="sm"
                  onPress={onConfirm}
                  loading={isLoading}
                  disabled={isLoading || confirmDisabled}
                  icon={confirmIcon}
                  style={{ flex: 1, marginTop: DesignSystem.spacing.sm }}
                  textStyle={{ color: "#fff" }}
                />
              ) : (
                <>
                  <ButtonCustom
                    title={cancelText}
                    startColors={getColorCancel(theme)}
                    endColors={getColorCancel(theme)}
                    size="sm"
                    onPress={handleCancel}
                    disabled={isLoading}
                    style={{ flex: 1 }}
                  />
                  <ButtonCustom
                    title={confirmText}
                    startColors={getColorConfirm(theme)}
                    endColors={getColorConfirm(theme)}
                    size="sm"
                    onPress={onConfirm}
                    loading={isLoading}
                    disabled={isLoading || confirmDisabled}
                    icon={confirmIcon}
                    style={{ flex: 1 }}
                    textStyle={{ color: "#fff" }}
                  />
                </>
              )}
            </View>
          </CardCustom>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}

export default ConfirmModal;
