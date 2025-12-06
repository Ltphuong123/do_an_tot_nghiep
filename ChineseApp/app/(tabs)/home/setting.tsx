import { CardCustom } from "@/components/shared/cardCustom";
import { ContainerCustom } from "@/components/shared/containerCustom";
import {
  DesignSystem,
  getBackgroundColor,
  getTextColor,
} from "@/constants/designSystem";
import { useThemeContext } from "@/contexts/themeContext";
import { useHomeLayoutStore } from "@/store/useHomeLayoutStore";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { InteractionManager, Pressable, View } from "react-native";
import DraggableFlatList, {
  ScaleDecorator,
} from "react-native-draggable-flatlist";
import { Icon, Text } from "react-native-paper";

export default function SettingsScreen() {
  const [isSaving, setIsSaving] = useState(false);

  const { theme } = useThemeContext();
  const { layout, setLayout, saveLayout, toggleVisibility } =
    useHomeLayoutStore();

  const textColor = getTextColor(theme, "primary");

  useEffect(() => {
    // Layout is loaded from store
  }, []);

  const handleBack = () => {
    InteractionManager.runAfterInteractions(() => {
      router.back();
    });
  };

  const handleDragEnd = ({ data }: any) => {
    setLayout(data);
  };

  const saveData = async () => {
    setIsSaving(true);
    try {
      saveLayout(layout);
      handleBack();
    } catch (e) {
      console.log("Error saving data", e);
    } finally {
      setIsSaving(false);
    }
  };

  const renderItem = ({ item, drag }: any) => (
    <ScaleDecorator>
      <CardCustom
        variant="card"
        padding="md"
        style={{
          marginBottom: DesignSystem.spacing.sm,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Pressable onLongPress={drag} style={{ flex: 1 }}>
            <Text
              style={{
                fontSize: DesignSystem.typography.fontSize.base,
                color: textColor,
                fontWeight: DesignSystem.typography.fontWeight.medium,
              }}
            >
              {item.title}
            </Text>
          </Pressable>
          <Pressable onPress={() => toggleVisibility(item.id)}>
            <Icon
              source={item.visible ? "eye" : "eye-off"}
              size={20}
              color={textColor}
            />
          </Pressable>
        </View>
      </CardCustom>
    </ScaleDecorator>
  );

  return (
    <ContainerCustom variant="background" scrollable={false}>
      {/* Custom Header */}
      <View
        style={{
          padding: DesignSystem.spacing.md,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          ...DesignSystem.shadows[theme].xl,
          backgroundColor: getBackgroundColor(theme, "primary"),
        }}
      >
        <Pressable
          onPress={handleBack}
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor:
              theme === "light"
                ? "rgba(0, 0, 0, 0.05)"
                : "rgba(255, 255, 255, 0.1)",
          }}
        >
          <Icon source="arrow-left" size={24} color={textColor} />
        </Pressable>

        <Text
          style={{
            fontSize: DesignSystem.typography.fontSize.xl,
            fontWeight: DesignSystem.typography.fontWeight.bold,
            color: textColor,
          }}
        >
          Cài đặt
        </Text>

        <Pressable
          onPress={saveData}
          style={{
            width: 40,
            height: 40,
            borderRadius: DesignSystem.borderRadius.md,
            backgroundColor:
              theme === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Icon
            source={isSaving ? "loading" : "check"}
            size={24}
            color={textColor}
          />
        </Pressable>
      </View>

      <View style={{ flex: 1, padding: DesignSystem.spacing.md }}>
        <Text
          style={{
            fontSize: DesignSystem.typography.fontSize.lg,
            fontWeight: DesignSystem.typography.fontWeight.bold,
            color: textColor,
            marginBottom: DesignSystem.spacing.md,
          }}
        >
          Bố cục
        </Text>
        <DraggableFlatList
          data={layout}
          onDragEnd={handleDragEnd}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          style={{ width: "100%" }}
        />
      </View>
    </ContainerCustom>
  );
}
