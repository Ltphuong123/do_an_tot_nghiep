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
import { uploadCloudinary } from "@/hooks/useCloudinaryUpload";
import { reportReasons } from "@/services/report";
import { IReportRequest } from "@/types/report.type";
import * as ImagePicker from "expo-image-picker";
import React, { useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { Icon, Text } from "react-native-paper";

interface ReportModalProps {
  visible: boolean;
  onClose: () => void;
  targetId: string | null;
  targetType?: IReportRequest["target_type"];
}

const ReportModal: React.FC<ReportModalProps> = ({
  visible,
  onClose,
  targetId,
  targetType = "user",
}) => {
  const { theme } = useThemeContext();
  const textColor = getTextColor(theme, "primary");

  const [reason, setReason] = useState("");
  const [details, setDetails] = useState("");
  const [selectedImage, setSelectedImage] =
    useState<ImagePicker.ImagePickerAsset | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { showSnackbar } = useSnackbar();
  const { t } = useLanguageContext();

  const pickImage = async () => {
    try {
      // Request permissions
      const permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (permissionResult.granted === false) {
        showSnackbar(t("permissionDenied"), "error");
        return;
      }

      // Add a small delay to ensure the launcher is registered
      await new Promise((resolve) => setTimeout(resolve, 100));

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled) {
        setSelectedImage(result.assets[0]);
      }
    } catch (error) {
      console.error("Error picking image:", error);
      showSnackbar(t("imagePickError"), "error");
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
  };

  const handleSubmit = async () => {
    if (!reason.trim()) {
      setErrorMessage(t("reportErrorMissingReason"));
      return;
    }

    try {
      setLoading(true);

      let attachmentUrl: string | undefined;
      if (selectedImage) {
        attachmentUrl = await uploadCloudinary(selectedImage);
      }

      const res = await reportReasons(
        targetType,
        targetId,
        reason,
        details,
        attachmentUrl ? [attachmentUrl] : undefined
      );
      if (res.success) {
        console.log(res.data);
        setErrorMessage(null);
        setReason("");
        setDetails("");
        setSelectedImage(null);
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
    setSelectedImage(null);
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
        <TouchableWithoutFeedback onPress={handleClose} accessible={false}>
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
                  maxHeight: "80%",
                }}
              >
                <ScrollView showsVerticalScrollIndicator={false}>
                  <Text
                    style={{
                      fontSize: DesignSystem.typography.fontSize.lg,
                      color: textColor,
                      marginBottom: 16,
                      textAlign: "center",
                      fontWeight: "600",
                    }}
                  >
                    {t("report")}
                  </Text>

                  <View
                    style={{
                      flexDirection: "row",
                      gap: 2,
                      marginBottom: 6,
                    }}
                  >
                    <Text style={{ color: textColor }}>
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
                    placeholder={t("enterReportReason")}
                    style={{ marginBottom: 20 }}
                  />

                  <Text style={{ color: textColor, marginBottom: 6 }}>
                    {t("reportDetails")}
                  </Text>
                  <InputCustom
                    value={details}
                    onChangeText={setDetails}
                    multiline
                    numberOfLines={4}
                    placeholder={t("enterReportDetails")}
                    style={{ marginBottom: 20 }}
                  />

                  <Text style={{ color: textColor, marginBottom: 8 }}>
                    {t("attachImage")}
                  </Text>
                  {!selectedImage ? (
                    <Pressable
                      onPress={pickImage}
                      style={{
                        borderWidth: 2,
                        borderColor: getTextColor(theme, "secondary"),
                        borderStyle: "dashed",
                        borderRadius: DesignSystem.borderRadius.md,
                        padding: DesignSystem.spacing.lg,
                        alignItems: "center",
                        justifyContent: "center",
                        marginBottom: 20,
                      }}
                    >
                      <Icon
                        source="camera-plus"
                        size={32}
                        color={getTextColor(theme, "secondary")}
                      />
                      <Text
                        style={{
                          color: getTextColor(theme, "secondary"),
                          marginTop: 8,
                          textAlign: "center",
                        }}
                      >
                        {t("selectImage")}
                      </Text>
                    </Pressable>
                  ) : (
                    <View style={{ marginBottom: 20 }}>
                      <View
                        style={{
                          position: "relative",
                          borderRadius: DesignSystem.borderRadius.md,
                          overflow: "hidden",
                        }}
                      >
                        <Image
                          source={{ uri: selectedImage.uri }}
                          style={{
                            width: "100%",
                            height: 100,
                            borderRadius: DesignSystem.borderRadius.md,
                          }}
                          resizeMode="cover"
                        />
                        <Pressable
                          onPress={removeImage}
                          style={{
                            position: "absolute",
                            top: 8,
                            right: 8,
                            backgroundColor: "rgba(0,0,0,0.6)",
                            borderRadius: 16,
                            padding: 6,
                          }}
                        >
                          <Icon source="close" size={16} color="white" />
                        </Pressable>
                      </View>
                      <Pressable
                        onPress={pickImage}
                        style={{
                          marginTop: 8,
                          padding: DesignSystem.spacing.sm,
                          alignSelf: "center",
                        }}
                      >
                        <Text
                          style={{
                            color: getTextColor(theme, "primary"),
                            textDecorationLine: "underline",
                          }}
                        >
                          {t("changeImage")}
                        </Text>
                      </Pressable>
                    </View>
                  )}

                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "flex-end",
                      gap: DesignSystem.spacing.sm,
                    }}
                  >
                    <ButtonCustom
                      title={t("cancel")}
                      onPress={handleClose}
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
                </ScrollView>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default ReportModal;
