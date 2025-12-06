import { ButtonCustom } from "@/components/shared/buttonCustom";
import { InputCustom } from "@/components/shared/inputCustom";
import {
  DesignSystem,
  getColorCancel,
  getColorConfirm,
  getSolidColor,
  getTextColor,
} from "@/constants/designSystem";
import { useLanguageContext } from "@/contexts/languageContext";
import { useSnackbar } from "@/contexts/snackbarContext";
import { useThemeContext } from "@/contexts/themeContext";
import { reportReasons } from "@/services/report";
import { uploadImage } from "@/services/upload";
import { IReportRequest } from "@/types/report.type";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { Text } from "react-native-paper";

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
  targetType = "post",
}) => {
  const { theme } = useThemeContext();
  const textColor = getTextColor(theme, "primary");

  const [reason, setReason] = useState("");
  const [details, setDetails] = useState("");
  const [attachments, setAttachments] = useState<string[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { showSnackbar } = useSnackbar();
  const { t } = useLanguageContext();

  const handleSubmit = async () => {
    if (!reason.trim()) {
      setErrorMessage(t("reportErrorMissingReason"));
      return;
    }

    try {
      setLoading(true);

      let attachmentUrls: string[] = [];
      if (attachments.length > 0) {
        for (const uri of attachments) {
          const url = await uploadImage(uri);
          attachmentUrls.push(url);
        }
      }

      const res = await reportReasons(
        targetType,
        targetId,
        reason,
        details,
        attachmentUrls.length > 0 ? attachmentUrls : undefined
      );
      // simple success handling based on mock service
      if (res.success) {
        // success: clear and close
        setErrorMessage(null);
        setReason("");
        setDetails("");
        setAttachments([]);
        onClose();
        showSnackbar(res.message || t("reportSuccess"), "success");
      } else {
        showSnackbar(
          res.message || "Đã có lỗi xảy ra. Vui lòng thử lại.",
          "error"
        );
      }
    } catch (err: any) {
      showSnackbar(
        err?.message || "Đã có lỗi xảy ra. Vui lòng thử lại.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setReason("");
    setDetails("");
    setAttachments([]);
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
        <TouchableWithoutFeedback onPress={onClose} accessible={false}>
          <View
            style={{
              flex: 1,
              backgroundColor: "rgba(0,0,0,0.4)",
              justifyContent: "center",
              padding: 20,
            }}
          >
            <TouchableWithoutFeedback onPress={() => {}}>
              <View
                style={{
                  backgroundColor: getSolidColor(theme, "card"),
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
                  {targetType === "post" ? t("reportPost") : t("reportUser")}
                </Text>

                <View
                  style={{
                    flexDirection: "row",
                    gap: 2,
                  }}
                >
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

                {attachments.length > 0 && (
                  <Text style={{ color: textColor, marginBottom: 10 }}>
                    {attachments.length} {t("imagesAttached")}
                  </Text>
                )}

                <View
                  style={{ flexDirection: "row", justifyContent: "flex-end" }}
                >
                  <ButtonCustom
                    title={t("cancel")}
                    onPress={handleClose}
                    style={{ marginRight: 8 }}
                    size="sm"
                    startColors={getColorCancel(theme)}
                    endColors={getColorCancel(theme)}
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
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default ModalReason;
