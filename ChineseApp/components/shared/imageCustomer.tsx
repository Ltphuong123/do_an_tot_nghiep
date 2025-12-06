import React, { useEffect, useState } from "react";
import { Dimensions, Image } from "react-native";

const screenWidth = Dimensions.get("window").width;

export const AutoImage = ({
  source,
  maxWidthPercent = 0.95,
  borderRadius = 12,
}: {
  source: any;
  maxWidthPercent?: number;
  borderRadius?: number;
}) => {
  const [aspectRatio, setAspectRatio] = useState(1);

  useEffect(() => {
    if (typeof source === "number") return; // local asset thì bỏ qua
    if (!source?.uri) return;

    Image.getSize(
      source.uri,
      (w, h) => setAspectRatio(w / h),
      () => setAspectRatio(1)
    );
  }, [source]);

  return (
    <Image
      source={source}
      style={{
        width: screenWidth * maxWidthPercent,
        height: undefined,
        aspectRatio,
        borderRadius,
      }}
      resizeMode="contain"
    />
  );
};
