import { ButtonCustom } from "@/components/shared/buttonCustom";
import {
  DesignSystem,
  getBackgroundColor,
  getColorAtived,
  getColorCancel,
  getTextColor,
} from "@/constants/designSystem";
import { useThemeContext } from "@/contexts/themeContext";
import { uploadCloudinary } from "@/hooks/useCloudinaryUpload";
import { TransferInfo } from "@/types/subscription.type";
import * as ImagePicker from "expo-image-picker";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Modal,
  Pressable,
  ScrollView,
  View,
} from "react-native";
import { Icon, Text } from "react-native-paper";

interface ModalPaymentProps {
  visible: boolean;
  transferInfo: TransferInfo | null;
  onClose: () => void;
  onConfirmTransfer: (manual_proof_url: string) => void;
  isLoading?: boolean;
}

export default function ModalPayment({
  visible,
  transferInfo,
  onClose,
  onConfirmTransfer,
  isLoading = false,
}: ModalPaymentProps) {
  const { theme } = useThemeContext();
  const textColor = getTextColor(theme, "primary");
  const backgroundColor = getBackgroundColor(theme, "elevated");
  const [selectedImageUri, setSelectedImageUri] = useState<string | null>(null);
  const [selectedImageUrl, setSelectedImageUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Reset state khi modal đóng
  useEffect(() => {
    if (!visible) {
      setSelectedImageUri(null);
      setSelectedImageUrl(null);
      setIsUploading(false);
    }
  }, [visible]);

  const pickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      alert("Permission to access camera roll is required!");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) {
      const image = result.assets[0];
      setSelectedImageUri(image.uri);
      setSelectedImageUrl(null); // Reset URL khi chọn ảnh mới
      setIsUploading(true);
      try {
        const url = await uploadCloudinary(image);
        setSelectedImageUrl(url);
        setSelectedImageUri(null); // Xóa URI local khi upload thành công
      } catch (error) {
        alert("Upload failed: " + (error as Error).message);
        // Giữ URI để hiển thị ảnh local nếu upload fail
      } finally {
        setIsUploading(false);
      }
    }
  };

  if (!transferInfo) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "rgba(0,0,0,0.5)",
        }}
      >
        {isLoading && (
          <View
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "rgba(0,0,0,0.5)",
              zIndex: 10,
            }}
          >
            <ActivityIndicator size="large" color="#fff" />
            <Text style={{ color: "#fff", marginTop: 10 }}>Đang xử lý...</Text>
          </View>
        )}
        <View
          style={{
            backgroundColor,
            borderRadius: DesignSystem.borderRadius.xl,
            padding: DesignSystem.spacing.lg,
            margin: DesignSystem.spacing.md,
            maxHeight: "80%",
            width: "90%",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: DesignSystem.spacing.md,
            }}
          >
            <Text
              style={{
                fontSize: DesignSystem.typography.fontSize.lg,
                fontWeight: DesignSystem.typography.fontWeight.bold,
                color: textColor,
              }}
            >
              Thông Tin Chuyển Khoản
            </Text>
            <Pressable onPress={onClose}>
              <Icon source="close" size={24} color={textColor} />
            </Pressable>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={{ gap: DesignSystem.spacing.md }}>
              <View>
                <Text style={{ fontWeight: "bold", color: textColor }}>
                  Ngân hàng:
                </Text>
                <Text style={{ color: textColor }}>
                  {transferInfo.bankName}
                </Text>
              </View>
              <View>
                <Text style={{ fontWeight: "bold", color: textColor }}>
                  Số tài khoản:
                </Text>
                <Text style={{ color: textColor, fontFamily: "monospace" }}>
                  {transferInfo.accountNumber}
                </Text>
              </View>
              <View>
                <Text style={{ fontWeight: "bold", color: textColor }}>
                  Tên tài khoản:
                </Text>
                <Text style={{ color: textColor }}>
                  {transferInfo.accountName}
                </Text>
              </View>
              <View>
                <Text style={{ fontWeight: "bold", color: textColor }}>
                  Chi nhánh:
                </Text>
                <Text style={{ color: textColor }}>{transferInfo.branch}</Text>
              </View>
              <View>
                <Text style={{ fontWeight: "bold", color: textColor }}>
                  Số tiền:
                </Text>
                <Text
                  style={{
                    color: textColor,
                    fontSize: DesignSystem.typography.fontSize.lg,
                    fontWeight: "bold",
                  }}
                >
                  {new Intl.NumberFormat("vi-VN").format(
                    parseFloat(transferInfo.amount)
                  )}{" "}
                  đ
                </Text>
              </View>
              <View>
                <Text style={{ fontWeight: "bold", color: textColor }}>
                  Nội dung chuyển khoản:
                </Text>
                <Text style={{ color: textColor }}>Thanh toán gói đăng ký</Text>
              </View>
            </View>
          </ScrollView>

          <View
            style={{
              gap: DesignSystem.spacing.md,
              marginTop: DesignSystem.spacing.md,
            }}
          >
            <ButtonCustom
              title="Chọn ảnh xác nhận"
              onPress={pickImage}
              startColors={getColorAtived(theme)}
              endColors={getColorAtived(theme)}
              textStyle={{ color: "#fff" }}
              disabled={isUploading}
            />
            {(selectedImageUri || selectedImageUrl) && (
              <View style={{ alignItems: "center" }}>
                <Text
                  style={{
                    color: textColor,
                    marginBottom: DesignSystem.spacing.sm,
                  }}
                >
                  Ảnh đã chọn:
                </Text>
                <Image
                  source={{ uri: (selectedImageUri || selectedImageUrl)! }}
                  style={{ width: 100, height: 100, borderRadius: 8 }}
                />
                {isUploading && (
                  <Text
                    style={{
                      color: textColor,
                      marginTop: DesignSystem.spacing.sm,
                    }}
                  >
                    Đang upload...
                  </Text>
                )}
              </View>
            )}
          </View>

          <View
            style={{
              flexDirection: "row",
              gap: DesignSystem.spacing.md,
              marginTop: DesignSystem.spacing.lg,
            }}
          >
            <ButtonCustom
              title={isLoading ? "Đang xử lý..." : "Đã chuyển khoản"}
              onPress={() => onConfirmTransfer(selectedImageUrl || "")}
              startColors={getColorAtived(theme)}
              endColors={getColorAtived(theme)}
              textStyle={{ color: "#fff" }}
              disabled={isLoading || isUploading || !selectedImageUrl}
            />
            <ButtonCustom
              title="Hủy"
              onPress={onClose}
              startColors={getColorCancel(theme)}
              endColors={getColorCancel(theme)}
              textStyle={{ color: textColor }}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}
