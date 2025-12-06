import DesignSystem from "@/constants/designSystem";
import { useEffect, useState } from "react";
import { Image, useWindowDimensions, View } from "react-native";

type AutoImageProps = {
  uri: string;
};

const AutoSizedImage = ({ uri }: AutoImageProps) => {
  const { width: windowWidth } = useWindowDimensions();
  const [size, setSize] = useState<{ width: number; height: number } | null>(
    null
  );

  useEffect(() => {
    let mounted = true;

    // Get intrinsic image size
    Image.getSize(
      uri,
      (w, h) => {
        if (!mounted) return;
        // allow padding from design system; cap to available window width
        const horizontalPadding = DesignSystem.spacing.md * 2; // left + right
        const maxWidth = Math.max(0, windowWidth - horizontalPadding);
        const displayWidth = Math.min(w, maxWidth);
        const displayHeight = (displayWidth / w) * h;
        setSize({ width: displayWidth, height: displayHeight });
      },
      () => {
        // fallback if getSize fails
        if (!mounted) return;
        const fallbackWidth = Math.max(
          0,
          windowWidth - DesignSystem.spacing.md * 2
        );
        setSize({ width: fallbackWidth, height: fallbackWidth * (9 / 16) });
      }
    );

    return () => {
      mounted = false;
    };
  }, [uri, windowWidth]);

  if (!size) {
    // lightweight placeholder while size is determined
    return <View style={{ height: 24 }} />;
  }

  return (
    <Image
      source={{ uri }}
      style={{
        width: size.width,
        height: size.height,
        borderRadius: DesignSystem.borderRadius.md,
        alignSelf: "center",
      }}
      resizeMode="cover"
    />
  );
};

export default AutoSizedImage;
