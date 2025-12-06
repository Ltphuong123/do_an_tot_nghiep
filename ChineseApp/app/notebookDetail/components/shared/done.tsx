import { CardCustom } from "@/components/shared/cardCustom";
import { ContainerCustom } from "@/components/shared/containerCustom";
import { getTextColor } from "@/constants/designSystem";
import { useLanguageContext } from "@/contexts/languageContext";
import { router } from "expo-router";
import { Button, Icon, Text } from "react-native-paper";

const Done = ({
  theme,
  score,
  restart,
  length,
}: {
  theme: "dark" | "light";
  score: number;
  restart: () => void;
  length: number;
}) => {
  const { t } = useLanguageContext();
  return (
    <ContainerCustom
      style={{
        alignItems: "center",
        justifyContent: "center",
        flex: 1,
        gap: 16,
      }}
    >
      <CardCustom
        variant="card"
        padding="xxxl"
        style={{ alignItems: "center", width: "90%", height: "50%" }}
      >
        <Icon source="trophy" size={64} color="#FFD700" />
        <Text
          style={{
            fontSize: 28,
            marginTop: 8,
            fontWeight: "700",
            color: getTextColor(theme),
          }}
        >
          {t("completed")}
        </Text>
        <Text
          style={{
            marginBottom: 16,
            color: getTextColor(theme, "secondary"),
          }}
        >
          {t("correctAnswers")}: {score} / {length}
        </Text>
        <Button
          mode="contained"
          icon="restart"
          onPress={restart}
          style={{ marginBottom: 12 }}
        >
          {t("tryAgainButton")}
        </Button>
        <Button icon="arrow-left" onPress={() => router.back()}>
          {t("goBackButton")}
        </Button>
      </CardCustom>
    </ContainerCustom>
  );
};

export default Done;
