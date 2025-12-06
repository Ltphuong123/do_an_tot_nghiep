import React from "react";
import Svg, { Path, SvgProps } from "react-native-svg";

export const LeaderboardIcon: React.FC<
  SvgProps & { size?: number; theme?: "dark" | "light" }
> = ({ size = 24, color, theme, ...props }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      // Ưu tiên màu truyền vào (color), nếu không thì tự động theo theme: Tối -> Trắng, Sáng -> Đen
      stroke={color || (theme === "dark" ? "#FFFFFF" : "#000000")}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
    />
  </Svg>
);
