import { ButtonCustom } from "@/components/shared/buttonCustom";
import DesignSystem, {
  getColorCancel,
  getColorConfirm,
  getColorModalBackground,
} from "@/constants/designSystem";
import { Modal, View } from "react-native";
import { Text } from "react-native-paper";

const ModalLogout = ({
  visibleLogout,
  setVisibleLogout,
  handleLogout,
  t,
  theme,
  textColor,
  secondaryTextColor,
}: {
  visibleLogout: boolean;
  setVisibleLogout: (visible: boolean) => void;
  handleLogout: () => Promise<void>;
  t: (key: string) => string;
  theme: "light" | "dark";
  textColor: string;
  secondaryTextColor: string;
}) => {
  return (
    <Modal
      visible={visibleLogout}
      transparent
      animationType="fade"
      onRequestClose={() => setVisibleLogout(false)}
    >
      <View
        style={{
          flex: 1,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          justifyContent: "center",
          alignItems: "center",
          padding: DesignSystem.spacing.lg,
        }}
      >
        <View
          style={{
            backgroundColor: getColorModalBackground(theme),
            borderRadius: DesignSystem.borderRadius.xl,
            padding: DesignSystem.spacing.lg,
            width: "100%",
            maxWidth: 400,
            ...DesignSystem.shadows[theme].lg,
          }}
        >
          <Text
            style={{
              fontSize: DesignSystem.typography.fontSize.xl,
              fontWeight: DesignSystem.typography.fontWeight.bold,
              color: textColor,
              marginBottom: DesignSystem.spacing.md,
            }}
          >
            {t("confirmLogout")}
          </Text>
          <Text
            style={{
              fontSize: DesignSystem.typography.fontSize.md,
              color: secondaryTextColor,
              marginBottom: DesignSystem.spacing.lg,
            }}
          >
            {t("logoutConfirmMessage")}
          </Text>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "flex-end",
              gap: DesignSystem.spacing.md,
            }}
          >
            <ButtonCustom
              startColors={getColorCancel(theme)}
              endColors={getColorCancel(theme)}
              size="md"
              title={t("cancel")}
              onPress={() => setVisibleLogout(false)}
            />
            <ButtonCustom
              startColors={getColorConfirm(theme)}
              endColors={getColorConfirm(theme)}
              size="md"
              title={t("logout")}
              onPress={handleLogout}
              textStyle={{ color: "#fff" }}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ModalLogout;
