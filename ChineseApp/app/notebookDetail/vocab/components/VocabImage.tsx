import { DesignSystem } from "@/constants/designSystem";
import React from "react";
import { Image, View } from "react-native";

interface VocabImageProps {
  imageUrl?: string;
}

export const VocabImage: React.FC<VocabImageProps> = ({ imageUrl }) => {
  if (!imageUrl) {
    return null;
  }

  console.log("Vocab Image URL:", imageUrl);

  return (
    <View
      style={{
        borderRadius: DesignSystem.borderRadius.lg,
        overflow: "hidden",
        marginBottom: DesignSystem.spacing.md,
        height: 200,
        backgroundColor: "rgba(0,0,0,0.05)",
      }}
    >
      <Image
        source={{ uri: imageUrl }}
        style={{ width: "100%", height: "100%" }}
        resizeMode="cover"
        defaultSource={undefined}
      />
    </View>
  );
};
