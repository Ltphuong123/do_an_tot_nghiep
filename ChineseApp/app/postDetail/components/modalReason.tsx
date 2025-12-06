import { ButtonCustom } from "@/components/shared/buttonCustom";
import { InputCustom } from "@/components/shared/inputCustom";
import {
  DesignSystem,
  getColorCancel,
  getColorConfirm,
  getTextColor,
} from "@/constants/designSystem";
import { useLanguageContext } from "@/contexts/languageContext";
import { useSnackbar } from "@/contexts/snackbarContext";
import { useThemeContext } from "@/contexts/themeContext";
import { reportReasons } from "@/services/report";
import { IReportRequest } from "@/types/report.type";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

interface ModalReasonProps {
  visible: boolean;
  onClose: () => void;
  targetId: string;
  targetType?: IReportRequest["target_type"];
}

const ModalReason: React.FC<ModalReasonProps> = ({
  visible,
  onClose,
  targetId,
  targetType = "comment",
}) => {
  const { theme } = useThemeContext();
  const { t } = useLanguageContext();
  const textColor = getTextColor(theme, "primary");

  const [reason, setReason] = useState("");
  const [details, setDetails] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { showSnackbar } = useSnackbar();

  const handleSubmit = async () => {
    if (!reason.trim()) {
      setErrorMessage(t("reportReasonRequired"));
      return;
    }

    try {
      setLoading(true);
      const res = await reportReasons(targetType, targetId, reason, details);
      if (res.success) {
        setErrorMessage(null);
        setReason("");
        setDetails("");
        onClose();
        showSnackbar(res.message || t("reportSentSuccess"), "success");
      } else {
        showSnackbar(res.message || t("reportError"), "error");
      }
    } catch (err: any) {
      showSnackbar(err?.message || t("reportError"), "error");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setReason("");
    setDetails("");
    setErrorMessage(null);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
        style={{ flex: 1 }}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.4)",
            justifyContent: "center",
            padding: 20,
          }}
        >
          {/* Backdrop */}
          <Pressable
            onPress={handleClose}
            style={StyleSheet.absoluteFillObject}
          />

          {/* Content */}
          <View
            onStartShouldSetResponder={() => true}
            style={{
              backgroundColor: theme === "light" ? "#fff" : "#111",
              padding: DesignSystem.spacing.md,
              borderRadius: DesignSystem.borderRadius.lg,
            }}
          >
            <Text
              style={{
                fontSize: DesignSystem.typography.fontSize.lg,
                color: textColor,
                marginBottom: 8,
                textAlign: "center",
              }}
            >
              {t("report")}
            </Text>

            <View style={{ flexDirection: "row", gap: 2 }}>
              <Text style={{ color: textColor, marginBottom: 6 }}>
                {t("reportReason")} {""}
              </Text>
              <Text style={{ color: "#e53935" }}>*</Text>
            </View>

            <InputCustom
              value={reason}
              onChangeText={(text) => {
                setReason(text);
                setErrorMessage(null);
              }}
              onFocus={() => setErrorMessage(null)}
              error={errorMessage || undefined}
              style={{ marginBottom: 30 }}
            />

            <Text style={{ color: textColor, marginBottom: 6 }}>
              {t("reportDetails")}
            </Text>
            <InputCustom
              value={details}
              onChangeText={setDetails}
              multiline
              numberOfLines={4}
              style={{ marginBottom: 20 }}
            />

            <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
              <ButtonCustom
                title={t("cancel")}
                onPress={handleClose}
                style={{ marginRight: 8 }}
                size="sm"
                startColors={getColorCancel(theme)}
                endColors={getColorCancel(theme)}
                textStyle={{ color: getTextColor(theme) }}
              />

              <ButtonCustom
                title={t("send")}
                loading={loading}
                disabled={loading}
                size="sm"
                startColors={getColorConfirm(theme)}
                endColors={getColorConfirm(theme)}
                textStyle={{ color: "#fff" }}
                onPress={handleSubmit}
              />
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default ModalReason;
