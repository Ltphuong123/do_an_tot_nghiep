import { DesignSystem, getTextColor } from "@/constants/designSystem";
import { useLanguageContext } from "@/contexts/languageContext";
import React, { useState } from "react";
import { Image, Modal, Pressable, ScrollView, View } from "react-native";
import { Icon, Text } from "react-native-paper";
// Removed duplicate React import

type Props = {
  theme: "light" | "dark";
  images?: string[];
  onPickImage: () => Promise<void> | void;
  onEditImage?: (index: number) => Promise<void> | void;
  onRemoveImage?: (index: number) => void;
};

const THUMB_SIZE = 90;

const MediaUpload: React.FC<Props> = ({
  theme,
  images = [],
  onPickImage,
  onEditImage,
  onRemoveImage,
}) => {
  const subTextColor = getTextColor(theme, "secondary");
  const { t } = useLanguageContext();
  const [viewerVisible, setViewerVisible] = useState(false);
  const [viewerIndex, setViewerIndex] = useState<number | null>(null);

  // If there are images, show thumbnails + an add button below
  if (images.length > 0) {
    return (
      <View style={{ gap: DesignSystem.spacing.sm }}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            alignItems: "center",
            gap: DesignSystem.spacing.sm,
          }}
        >
          {images.map((uri, idx) => (
            <Pressable
              key={uri + idx}
              onPress={() => {
                setViewerIndex(idx);
                setViewerVisible(true);
              }}
              style={{
                width: THUMB_SIZE,
                height: THUMB_SIZE,
                borderRadius: 8,
                overflow: "hidden",
                position: "relative",
              }}
            >
              <Image
                source={{ uri }}
                style={{ width: THUMB_SIZE, height: THUMB_SIZE }}
                resizeMode="cover"
              />

              <Pressable
                onPress={() => onRemoveImage && onRemoveImage(idx)}
                style={{
                  position: "absolute",
                  top: 6,
                  right: 6,
                  backgroundColor: "rgba(0,0,0,0.45)",
                  borderRadius: 12,
                  padding: 4,
                }}
              >
                <Icon source="close" size={14} color="#fff" />
              </Pressable>
            </Pressable>
          ))}
        </ScrollView>

        <Pressable
          style={{
            borderWidth: 1,
            borderStyle: "dashed",
            borderColor:
              theme === "light"
                ? "rgba(0, 0, 0, 0.1)"
                : "rgba(255, 255, 255, 0.1)",
            borderRadius: DesignSystem.borderRadius.md,
            padding: DesignSystem.spacing.md,
            alignItems: "center",
            gap: DesignSystem.spacing.xs,
          }}
          onPress={() => onPickImage()}
        >
          <Icon source="image-plus" size={24} color="#4A90E2" />
          <Text
            style={{
              fontSize: DesignSystem.typography.fontSize.sm,
              color: subTextColor,
            }}
          >
            {t("addImage")}
          </Text>
        </Pressable>

        {/* Fullscreen viewer modal */}
        <Modal
          visible={viewerVisible}
          animationType="slide"
          onRequestClose={() => setViewerVisible(false)}
        >
          <View style={{ flex: 1, backgroundColor: "#000", paddingTop: 40 }}>
            <View
              style={{
                height: 56,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                paddingHorizontal: DesignSystem.spacing.md,
                paddingTop: 8,
              }}
            >
              <Pressable onPress={() => setViewerVisible(false)}>
                <Icon source="close" size={26} color="#fff" />
              </Pressable>

              <View
                style={{ flexDirection: "row", gap: DesignSystem.spacing.sm }}
              >
                <Pressable
                  onPress={async () => {
                    if (viewerIndex !== null && onEditImage) {
                      await onEditImage(viewerIndex);
                      setViewerVisible(false);
                    }
                  }}
                  style={{ marginRight: 12 }}
                >
                  <Icon source="pencil" size={24} color="#fff" />
                </Pressable>

                <Pressable
                  onPress={() => {
                    if (viewerIndex !== null && onRemoveImage) {
                      onRemoveImage(viewerIndex);
                      setViewerVisible(false);
                    }
                  }}
                >
                  <Icon source="delete" size={24} color="#fff" />
                </Pressable>
              </View>
            </View>

            <ScrollView
              style={{ flex: 1 }}
              contentContainerStyle={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
              maximumZoomScale={3}
              minimumZoomScale={1}
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}
            >
              {viewerIndex !== null && (
                <Image
                  source={{ uri: images[viewerIndex] }}
                  style={{
                    width: "100%",
                    height: "100%",
                    resizeMode: "contain",
                  }}
                />
              )}
            </ScrollView>
          </View>
        </Modal>
      </View>
    );
  }

  // No images yet: big dashed box to add
  return (
    <Pressable
      style={{
        borderWidth: 1,
        borderStyle: "dashed",
        borderColor:
          theme === "light" ? "rgba(0, 0, 0, 0.1)" : "rgba(255, 255, 255, 0.1)",
        borderRadius: DesignSystem.borderRadius.md,
        padding: DesignSystem.spacing.xl,
        alignItems: "center",
        gap: DesignSystem.spacing.xs,
      }}
      onPress={() => onPickImage()}
    >
      <Icon source="image-plus" size={28} color="#4A90E2" />
      <Text
        style={{
          fontSize: DesignSystem.typography.fontSize.sm,
          color: subTextColor,
        }}
      >
        {t("addImage")}
      </Text>
    </Pressable>
  );
};

export default MediaUpload;
