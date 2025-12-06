import React from "react";
import Svg, { Circle, Ellipse, G, Path } from "react-native-svg";

interface CuteBlackCatIconProps {
  level: number;
}

// Helper function để xác định cấp độ
const getCatLevel = (count: number): number => {
  if (count >= 4000) return 12; // Mèo Toàn Trí
  if (count >= 3500) return 11; // Mèo Đại Trưởng Lão
  if (count >= 3000) return 10; // Mèo Bậc Thầy
  if (count >= 2500) return 9; // Mèo Tinh Thông
  if (count >= 2000) return 8; // Mèo Lĩnh Hội
  if (count >= 1500) return 7; // Mèo Uyên Bác
  if (count >= 1000) return 6; // Mèo Học Giả
  if (count >= 800) return 5; // Mèo Lão Luyện
  if (count >= 500) return 4; // Mèo Thông Thái
  if (count >= 200) return 3; // Mèo Cần Mẫn
  if (count >= 100) return 2; // Mèo Siêng Năng
  if (count >= 50) return 1; // Mèo Tân Binh
  return 0; // Mèo Tập Sự
};

// Component cho Mèo Tập Sự (0-49) - Mèo đen cơ bản
const CatNovice = () => (
  <G transform="translate(5, 5)">
    <Path
      d="M75 70 Q85 60 85 45 Q85 30 75 35"
      stroke="#1f2937"
      strokeWidth="6"
      strokeLinecap="round"
      fill="none"
    />
    <Ellipse cx="50" cy="75" rx="25" ry="18" fill="#1f2937" />
    <Circle cx="50" cy="50" r="22" fill="#1f2937" />
    <Path d="M32 38 L25 15 L45 32 Z" fill="#1f2937" />
    <Path d="M68 38 L75 15 L55 32 Z" fill="#1f2937" />
    <Path d="M34 35 L29 20 L42 32 Z" fill="#374151" />
    <Path d="M66 35 L71 20 L58 32 Z" fill="#374151" />
    <Ellipse cx="42" cy="50" rx="4" ry="5" fill="white" />
    <Circle cx="42" cy="50" r="2" fill="#000" />
    <Ellipse cx="58" cy="50" rx="4" ry="5" fill="white" />
    <Circle cx="58" cy="50" r="2" fill="#000" />
    <Ellipse cx="50" cy="58" rx="2.5" ry="1.5" fill="#f472b6" />
    <Path
      d="M35 70 Q50 75 65 70"
      stroke="#fbbf24"
      strokeWidth="2"
      strokeLinecap="round"
      fill="none"
    />
    <Circle cx="50" cy="75" r="3" fill="#fbbf24" />
  </G>
);

// Component cho Mèo Tân Binh (50-99) - Thêm dải màu
const CatRecruit = () => (
  <G transform="translate(5, 5)">
    <Path
      d="M75 70 Q85 60 85 45 Q85 30 75 35"
      stroke="#1f2937"
      strokeWidth="6"
      strokeLinecap="round"
      fill="none"
    />
    <Ellipse cx="50" cy="75" rx="25" ry="18" fill="#1f2937" />
    <Circle cx="50" cy="50" r="22" fill="#1f2937" />
    <Path d="M32 38 L25 15 L45 32 Z" fill="#1f2937" />
    <Path d="M68 38 L75 15 L55 32 Z" fill="#1f2937" />
    <Path d="M34 35 L29 20 L42 32 Z" fill="#60a5fa" />
    <Path d="M66 35 L71 20 L58 32 Z" fill="#60a5fa" />
    <Ellipse cx="42" cy="50" rx="4" ry="5" fill="white" />
    <Circle cx="42" cy="50" r="2" fill="#000" />
    <Ellipse cx="58" cy="50" rx="4" ry="5" fill="white" />
    <Circle cx="58" cy="50" r="2" fill="#000" />
    <Ellipse cx="50" cy="58" rx="2.5" ry="1.5" fill="#f472b6" />
    <Path
      d="M35 70 Q50 78 65 70"
      stroke="#fbbf24"
      strokeWidth="3"
      strokeLinecap="round"
      fill="none"
    />
    <Circle cx="50" cy="75" r="3" fill="#60a5fa" />
  </G>
);

// Component cho Mèo Siêng Năng (100-199) - Thêm vòng cổ
const CatDiligent = () => (
  <G transform="translate(5, 5)">
    <Path
      d="M75 70 Q85 60 85 45 Q85 30 75 35"
      stroke="#1f2937"
      strokeWidth="6"
      strokeLinecap="round"
      fill="none"
    />
    <Ellipse cx="50" cy="75" rx="25" ry="18" fill="#1f2937" />
    <Circle cx="50" cy="50" r="22" fill="#1f2937" />
    <Ellipse cx="50" cy="65" rx="18" ry="4" fill="#60a5fa" />
    <Circle cx="50" cy="65" r="2" fill="#fbbf24" />
    <Path d="M32 38 L25 15 L45 32 Z" fill="#1f2937" />
    <Path d="M68 38 L75 15 L55 32 Z" fill="#1f2937" />
    <Path d="M34 35 L29 20 L42 32 Z" fill="#60a5fa" />
    <Path d="M66 35 L71 20 L58 32 Z" fill="#60a5fa" />
    <Ellipse cx="42" cy="50" rx="4" ry="5" fill="white" />
    <Circle cx="42" cy="50" r="2" fill="#000" />
    <Ellipse cx="58" cy="50" rx="4" ry="5" fill="white" />
    <Circle cx="58" cy="50" r="2" fill="#000" />
    <Ellipse cx="50" cy="58" rx="2.5" ry="1.5" fill="#f472b6" />
    <Path
      d="M35 70 Q50 80 65 70"
      stroke="#fbbf24"
      strokeWidth="3"
      strokeLinecap="round"
      fill="none"
    />
    <Circle cx="50" cy="75" r="3" fill="#fbbf24" />
  </G>
);

// Component cho Mèo Cần Mẫn (200-499) - Thêm râu và nơ
const CatHardworking = () => (
  <G transform="translate(5, 5)">
    <Path
      d="M75 70 Q85 60 85 45 Q85 30 75 35"
      stroke="#1f2937"
      strokeWidth="6"
      strokeLinecap="round"
      fill="none"
    />
    <Ellipse cx="50" cy="75" rx="25" ry="18" fill="#1f2937" />
    <Circle cx="50" cy="50" r="22" fill="#1f2937" />
    <Path d="M20 55 L32 55" stroke="#374151" strokeWidth="2" />
    <Path d="M20 58 L32 58" stroke="#374151" strokeWidth="2" />
    <Path d="M68 55 L80 55" stroke="#374151" strokeWidth="2" />
    <Path d="M68 58 L80 58" stroke="#374151" strokeWidth="2" />
    <Ellipse cx="50" cy="65" rx="18" ry="4" fill="#60a5fa" />
    <Path d="M44 65 L50 60 L56 65 L50 68 Z" fill="#fbbf24" />
    <Path d="M32 38 L25 15 L45 32 Z" fill="#1f2937" />
    <Path d="M68 38 L75 15 L55 32 Z" fill="#1f2937" />
    <Path d="M34 35 L29 20 L42 32 Z" fill="#60a5fa" />
    <Path d="M66 35 L71 20 L58 32 Z" fill="#60a5fa" />
    <Ellipse cx="42" cy="50" rx="4" ry="5" fill="white" />
    <Circle cx="42" cy="50" r="2" fill="#000" />
    <Ellipse cx="58" cy="50" rx="4" ry="5" fill="white" />
    <Circle cx="58" cy="50" r="2" fill="#000" />
    <Ellipse cx="50" cy="58" rx="2.5" ry="1.5" fill="#f472b6" />
    <Path
      d="M35 70 Q50 80 65 70"
      stroke="#fbbf24"
      strokeWidth="3"
      strokeLinecap="round"
      fill="none"
    />
    <Circle cx="50" cy="75" r="3" fill="#fbbf24" />
  </G>
);

// Component cho Mèo Thông Thái (500-799) - Thêm kính
const CatWise = () => (
  <G transform="translate(5, 5)">
    <Path
      d="M75 70 Q85 60 85 45 Q85 30 75 35"
      stroke="#1f2937"
      strokeWidth="6"
      strokeLinecap="round"
      fill="none"
    />
    <Ellipse cx="50" cy="75" rx="25" ry="18" fill="#1f2937" />
    <Circle cx="50" cy="50" r="22" fill="#1f2937" />
    <Circle
      cx="42"
      cy="50"
      r="6"
      fill="none"
      stroke="#fbbf24"
      strokeWidth="2"
    />
    <Circle
      cx="58"
      cy="50"
      r="6"
      fill="none"
      stroke="#fbbf24"
      strokeWidth="2"
    />
    <Path d="M48 50 L52 50" stroke="#fbbf24" strokeWidth="2" />
    <Path d="M20 55 L32 55" stroke="#374151" strokeWidth="2" />
    <Path d="M20 58 L32 58" stroke="#374151" strokeWidth="2" />
    <Path d="M68 55 L80 55" stroke="#374151" strokeWidth="2" />
    <Path d="M68 58 L80 58" stroke="#374151" strokeWidth="2" />
    <Ellipse cx="50" cy="65" rx="18" ry="4" fill="#60a5fa" />
    <Path d="M44 65 L50 60 L56 65 L50 68 Z" fill="#fbbf24" />
    <Path d="M32 38 L25 15 L45 32 Z" fill="#1f2937" />
    <Path d="M68 38 L75 15 L55 32 Z" fill="#1f2937" />
    <Path d="M34 35 L29 20 L42 32 Z" fill="#60a5fa" />
    <Path d="M66 35 L71 20 L58 32 Z" fill="#60a5fa" />
    <Ellipse cx="42" cy="50" rx="3" ry="4" fill="white" />
    <Circle cx="42" cy="50" r="2" fill="#000" />
    <Ellipse cx="58" cy="50" rx="3" ry="4" fill="white" />
    <Circle cx="58" cy="50" r="2" fill="#000" />
    <Ellipse cx="50" cy="58" rx="2.5" ry="1.5" fill="#f472b6" />
    <Path
      d="M35 70 Q50 80 65 70"
      stroke="#fbbf24"
      strokeWidth="3"
      strokeLinecap="round"
      fill="none"
    />
    <Circle cx="50" cy="75" r="3" fill="#fbbf24" />
  </G>
);

// Component cho Mèo Lão Luyện (800-999) - Thêm sao trên đầu
const CatVeteran = () => (
  <G transform="translate(5, 5)">
    <Path
      d="M50 8 L53 18 L63 18 L55 24 L58 34 L50 28 L42 34 L45 24 L37 18 L47 18 Z"
      fill="#fbbf24"
    />
    <Path
      d="M75 70 Q85 60 85 45 Q85 30 75 35"
      stroke="#1f2937"
      strokeWidth="6"
      strokeLinecap="round"
      fill="none"
    />
    <Ellipse cx="50" cy="75" rx="25" ry="18" fill="#1f2937" />
    <Circle cx="50" cy="50" r="22" fill="#1f2937" />
    <Circle
      cx="42"
      cy="50"
      r="6"
      fill="none"
      stroke="#fbbf24"
      strokeWidth="2"
    />
    <Circle
      cx="58"
      cy="50"
      r="6"
      fill="none"
      stroke="#fbbf24"
      strokeWidth="2"
    />
    <Path d="M48 50 L52 50" stroke="#fbbf24" strokeWidth="2" />
    <Path d="M20 55 L32 55" stroke="#374151" strokeWidth="2" />
    <Path d="M20 58 L32 58" stroke="#374151" strokeWidth="2" />
    <Path d="M68 55 L80 55" stroke="#374151" strokeWidth="2" />
    <Path d="M68 58 L80 58" stroke="#374151" strokeWidth="2" />
    <Ellipse cx="50" cy="65" rx="18" ry="4" fill="#60a5fa" />
    <Path d="M44 65 L50 60 L56 65 L50 68 Z" fill="#fbbf24" />
    <Path d="M32 38 L25 15 L45 32 Z" fill="#1f2937" />
    <Path d="M68 38 L75 15 L55 32 Z" fill="#1f2937" />
    <Path d="M34 35 L29 20 L42 32 Z" fill="#60a5fa" />
    <Path d="M66 35 L71 20 L58 32 Z" fill="#60a5fa" />
    <Ellipse cx="42" cy="50" rx="3" ry="4" fill="white" />
    <Circle cx="42" cy="50" r="2" fill="#000" />
    <Ellipse cx="58" cy="50" rx="3" ry="4" fill="white" />
    <Circle cx="58" cy="50" r="2" fill="#000" />
    <Ellipse cx="50" cy="58" rx="2.5" ry="1.5" fill="#f472b6" />
    <Path
      d="M35 70 Q50 80 65 70"
      stroke="#fbbf24"
      strokeWidth="3"
      strokeLinecap="round"
      fill="none"
    />
    <Circle cx="50" cy="75" r="3" fill="#fbbf24" />
  </G>
);

// Component cho Mèo Học Giả (1000-1499) - Thêm mũ tốt nghiệp
const CatScholar = () => (
  <G transform="translate(5, 5)">
    <Path d="M30 25 L70 25 L68 20 L50 15 L32 20 Z" fill="#1f2937" />
    <Path
      d="M50 15 L55 10 L55 20"
      stroke="#fbbf24"
      strokeWidth="2"
      fill="none"
    />
    <Circle cx="55" cy="10" r="2" fill="#fbbf24" />
    <Path
      d="M75 70 Q85 60 85 45 Q85 30 75 35"
      stroke="#1f2937"
      strokeWidth="6"
      strokeLinecap="round"
      fill="none"
    />
    <Ellipse cx="50" cy="75" rx="25" ry="18" fill="#1f2937" />
    <Circle cx="50" cy="50" r="22" fill="#1f2937" />
    <Circle
      cx="42"
      cy="50"
      r="6"
      fill="none"
      stroke="#fbbf24"
      strokeWidth="2"
    />
    <Circle
      cx="58"
      cy="50"
      r="6"
      fill="none"
      stroke="#fbbf24"
      strokeWidth="2"
    />
    <Path d="M48 50 L52 50" stroke="#fbbf24" strokeWidth="2" />
    <Path d="M20 55 L32 55" stroke="#374151" strokeWidth="2" />
    <Path d="M20 58 L32 58" stroke="#374151" strokeWidth="2" />
    <Path d="M68 55 L80 55" stroke="#374151" strokeWidth="2" />
    <Path d="M68 58 L80 58" stroke="#374151" strokeWidth="2" />
    <Ellipse cx="50" cy="65" rx="18" ry="4" fill="#60a5fa" />
    <Path d="M44 65 L50 60 L56 65 L50 68 Z" fill="#fbbf24" />
    <Path d="M32 38 L25 15 L45 32 Z" fill="#1f2937" />
    <Path d="M68 38 L75 15 L55 32 Z" fill="#1f2937" />
    <Path d="M34 35 L29 20 L42 32 Z" fill="#60a5fa" />
    <Path d="M66 35 L71 20 L58 32 Z" fill="#60a5fa" />
    <Ellipse cx="42" cy="50" rx="3" ry="4" fill="white" />
    <Circle cx="42" cy="50" r="2" fill="#000" />
    <Ellipse cx="58" cy="50" rx="3" ry="4" fill="white" />
    <Circle cx="58" cy="50" r="2" fill="#000" />
    <Ellipse cx="50" cy="58" rx="2.5" ry="1.5" fill="#f472b6" />
    <Path
      d="M35 70 Q50 80 65 70"
      stroke="#fbbf24"
      strokeWidth="3"
      strokeLinecap="round"
      fill="none"
    />
    <Circle cx="50" cy="75" r="3" fill="#fbbf24" />
  </G>
);

// Component cho Mèo Uyên Bác (1500-1999) - Thêm sách
const CatErudite = () => (
  <G transform="translate(5, 5)">
    <Path d="M30 25 L70 25 L68 20 L50 15 L32 20 Z" fill="#1f2937" />
    <Path
      d="M50 15 L55 10 L55 20"
      stroke="#fbbf24"
      strokeWidth="2"
      fill="none"
    />
    <Circle cx="55" cy="10" r="2" fill="#fbbf24" />
    <Path d="M15 70 L25 65 L25 80 L15 85 Z" fill="#60a5fa" />
    <Path d="M25 65 L35 70 L35 85 L25 80 Z" fill="#3b82f6" />
    <Path
      d="M75 70 Q85 60 85 45 Q85 30 75 35"
      stroke="#1f2937"
      strokeWidth="6"
      strokeLinecap="round"
      fill="none"
    />
    <Ellipse cx="50" cy="75" rx="25" ry="18" fill="#1f2937" />
    <Circle cx="50" cy="50" r="22" fill="#1f2937" />
    <Circle
      cx="42"
      cy="50"
      r="6"
      fill="none"
      stroke="#fbbf24"
      strokeWidth="2"
    />
    <Circle
      cx="58"
      cy="50"
      r="6"
      fill="none"
      stroke="#fbbf24"
      strokeWidth="2"
    />
    <Path d="M48 50 L52 50" stroke="#fbbf24" strokeWidth="2" />
    <Path d="M20 55 L32 55" stroke="#374151" strokeWidth="2" />
    <Path d="M20 58 L32 58" stroke="#374151" strokeWidth="2" />
    <Path d="M68 55 L80 55" stroke="#374151" strokeWidth="2" />
    <Path d="M68 58 L80 58" stroke="#374151" strokeWidth="2" />
    <Ellipse cx="50" cy="65" rx="18" ry="4" fill="#60a5fa" />
    <Path d="M44 65 L50 60 L56 65 L50 68 Z" fill="#fbbf24" />
    <Path d="M32 38 L25 15 L45 32 Z" fill="#1f2937" />
    <Path d="M68 38 L75 15 L55 32 Z" fill="#1f2937" />
    <Path d="M34 35 L29 20 L42 32 Z" fill="#60a5fa" />
    <Path d="M66 35 L71 20 L58 32 Z" fill="#60a5fa" />
    <Ellipse cx="42" cy="50" rx="3" ry="4" fill="white" />
    <Circle cx="42" cy="50" r="2" fill="#000" />
    <Ellipse cx="58" cy="50" rx="3" ry="4" fill="white" />
    <Circle cx="58" cy="50" r="2" fill="#000" />
    <Ellipse cx="50" cy="58" rx="2.5" ry="1.5" fill="#f472b6" />
    <Path
      d="M35 70 Q50 80 65 70"
      stroke="#fbbf24"
      strokeWidth="3"
      strokeLinecap="round"
      fill="none"
    />
    <Circle cx="50" cy="75" r="3" fill="#fbbf24" />
  </G>
);

// Component cho Mèo Lĩnh Hội (2000-2499) - Thêm hào quang nhỏ
const CatEnlightened = () => (
  <G transform="translate(5, 5)">
    <Circle
      cx="50"
      cy="30"
      r="28"
      fill="none"
      stroke="#fbbf24"
      strokeWidth="3"
      opacity="0.5"
    />
    <Path d="M30 25 L70 25 L68 20 L50 15 L32 20 Z" fill="#1f2937" />
    <Path
      d="M50 15 L55 10 L55 20"
      stroke="#fbbf24"
      strokeWidth="2"
      fill="none"
    />
    <Circle cx="55" cy="10" r="2" fill="#fbbf24" />
    <Path
      d="M75 70 Q85 60 85 45 Q85 30 75 35"
      stroke="#1f2937"
      strokeWidth="6"
      strokeLinecap="round"
      fill="none"
    />
    <Ellipse cx="50" cy="75" rx="25" ry="18" fill="#1f2937" />
    <Circle cx="50" cy="50" r="22" fill="#1f2937" />
    <Circle
      cx="42"
      cy="50"
      r="6"
      fill="none"
      stroke="#fbbf24"
      strokeWidth="2"
    />
    <Circle
      cx="58"
      cy="50"
      r="6"
      fill="none"
      stroke="#fbbf24"
      strokeWidth="2"
    />
    <Path d="M48 50 L52 50" stroke="#fbbf24" strokeWidth="2" />
    <Path d="M20 55 L32 55" stroke="#374151" strokeWidth="2" />
    <Path d="M20 58 L32 58" stroke="#374151" strokeWidth="2" />
    <Path d="M68 55 L80 55" stroke="#374151" strokeWidth="2" />
    <Path d="M68 58 L80 58" stroke="#374151" strokeWidth="2" />
    <Ellipse cx="50" cy="65" rx="18" ry="4" fill="#60a5fa" />
    <Path d="M44 65 L50 60 L56 65 L50 68 Z" fill="#fbbf24" />
    <Path d="M32 38 L25 15 L45 32 Z" fill="#1f2937" />
    <Path d="M68 38 L75 15 L55 32 Z" fill="#1f2937" />
    <Path d="M34 35 L29 20 L42 32 Z" fill="#60a5fa" />
    <Path d="M66 35 L71 20 L58 32 Z" fill="#60a5fa" />
    <Ellipse cx="42" cy="50" rx="3" ry="4" fill="white" />
    <Circle cx="42" cy="50" r="2" fill="#000" />
    <Ellipse cx="58" cy="50" rx="3" ry="4" fill="white" />
    <Circle cx="58" cy="50" r="2" fill="#000" />
    <Ellipse cx="50" cy="58" rx="2.5" ry="1.5" fill="#f472b6" />
    <Path
      d="M35 70 Q50 80 65 70"
      stroke="#fbbf24"
      strokeWidth="3"
      strokeLinecap="round"
      fill="none"
    />
    <Circle cx="50" cy="75" r="3" fill="#fbbf24" />
  </G>
);

// Component cho Mèo Tinh Thông (2500-2999) - Thêm nhiều sao
const CatMaster = () => (
  <G transform="translate(5, 5)">
    <Circle
      cx="50"
      cy="30"
      r="28"
      fill="none"
      stroke="#fbbf24"
      strokeWidth="3"
      opacity="0.5"
    />
    <Path
      d="M50 8 L53 18 L63 18 L55 24 L58 34 L50 28 L42 34 L45 24 L37 18 L47 18 Z"
      fill="#fbbf24"
    />
    <Path
      d="M25 35 L27 40 L32 40 L28 43 L30 48 L25 45 L20 48 L22 43 L18 40 L23 40 Z"
      fill="#fbbf24"
    />
    <Path
      d="M75 35 L77 40 L82 40 L78 43 L80 48 L75 45 L70 48 L72 43 L68 40 L73 40 Z"
      fill="#fbbf24"
    />
    <Path d="M30 25 L70 25 L68 20 L50 15 L32 20 Z" fill="#1f2937" />
    <Path
      d="M50 15 L55 10 L55 20"
      stroke="#fbbf24"
      strokeWidth="2"
      fill="none"
    />
    <Circle cx="55" cy="10" r="2" fill="#fbbf24" />
    <Path
      d="M75 70 Q85 60 85 45 Q85 30 75 35"
      stroke="#1f2937"
      strokeWidth="6"
      strokeLinecap="round"
      fill="none"
    />
    <Ellipse cx="50" cy="75" rx="25" ry="18" fill="#1f2937" />
    <Circle cx="50" cy="50" r="22" fill="#1f2937" />
    <Circle
      cx="42"
      cy="50"
      r="6"
      fill="none"
      stroke="#fbbf24"
      strokeWidth="2"
    />
    <Circle
      cx="58"
      cy="50"
      r="6"
      fill="none"
      stroke="#fbbf24"
      strokeWidth="2"
    />
    <Path d="M48 50 L52 50" stroke="#fbbf24" strokeWidth="2" />
    <Path d="M20 55 L32 55" stroke="#374151" strokeWidth="2" />
    <Path d="M20 58 L32 58" stroke="#374151" strokeWidth="2" />
    <Path d="M68 55 L80 55" stroke="#374151" strokeWidth="2" />
    <Path d="M68 58 L80 58" stroke="#374151" strokeWidth="2" />
    <Ellipse cx="50" cy="65" rx="18" ry="4" fill="#60a5fa" />
    <Path d="M44 65 L50 60 L56 65 L50 68 Z" fill="#fbbf24" />
    <Path d="M32 38 L25 15 L45 32 Z" fill="#1f2937" />
    <Path d="M68 38 L75 15 L55 32 Z" fill="#1f2937" />
    <Path d="M34 35 L29 20 L42 32 Z" fill="#60a5fa" />
    <Path d="M66 35 L71 20 L58 32 Z" fill="#60a5fa" />
    <Ellipse cx="42" cy="50" rx="3" ry="4" fill="white" />
    <Circle cx="42" cy="50" r="2" fill="#000" />
    <Ellipse cx="58" cy="50" rx="3" ry="4" fill="white" />
    <Circle cx="58" cy="50" r="2" fill="#000" />
    <Ellipse cx="50" cy="58" rx="2.5" ry="1.5" fill="#f472b6" />
    <Path
      d="M35 70 Q50 80 65 70"
      stroke="#fbbf24"
      strokeWidth="3"
      strokeLinecap="round"
      fill="none"
    />
    <Circle cx="50" cy="75" r="3" fill="#fbbf24" />
  </G>
);

// Component cho Mèo Bậc Thầy (3000-3499) - Thêm vương miện
const CatGrandmaster = () => (
  <G transform="translate(5, 5)">
    <Path
      d="M35 18 L40 12 L43 18 L50 10 L57 18 L60 12 L65 18 L62 25 L38 25 Z"
      fill="#fbbf24"
    />
    <Circle cx="40" cy="15" r="2" fill="#ff6b9d" />
    <Circle cx="50" cy="13" r="2" fill="#ff6b9d" />
    <Circle cx="60" cy="15" r="2" fill="#ff6b9d" />
    <Circle
      cx="50"
      cy="30"
      r="28"
      fill="none"
      stroke="#fbbf24"
      strokeWidth="3"
      opacity="0.5"
    />
    <Path
      d="M75 70 Q85 60 85 45 Q85 30 75 35"
      stroke="#1f2937"
      strokeWidth="6"
      strokeLinecap="round"
      fill="none"
    />
    <Ellipse cx="50" cy="75" rx="25" ry="18" fill="#1f2937" />
    <Circle cx="50" cy="50" r="22" fill="#1f2937" />
    <Circle
      cx="42"
      cy="50"
      r="6"
      fill="none"
      stroke="#fbbf24"
      strokeWidth="2"
    />
    <Circle
      cx="58"
      cy="50"
      r="6"
      fill="none"
      stroke="#fbbf24"
      strokeWidth="2"
    />
    <Path d="M48 50 L52 50" stroke="#fbbf24" strokeWidth="2" />
    <Path d="M20 55 L32 55" stroke="#374151" strokeWidth="2" />
    <Path d="M20 58 L32 58" stroke="#374151" strokeWidth="2" />
    <Path d="M68 55 L80 55" stroke="#374151" strokeWidth="2" />
    <Path d="M68 58 L80 58" stroke="#374151" strokeWidth="2" />
    <Ellipse cx="50" cy="65" rx="18" ry="4" fill="#60a5fa" />
    <Path d="M44 65 L50 60 L56 65 L50 68 Z" fill="#fbbf24" />
    <Path d="M32 38 L25 15 L45 32 Z" fill="#1f2937" />
    <Path d="M68 38 L75 15 L55 32 Z" fill="#1f2937" />
    <Path d="M34 35 L29 20 L42 32 Z" fill="#60a5fa" />
    <Path d="M66 35 L71 20 L58 32 Z" fill="#60a5fa" />
    <Ellipse cx="42" cy="50" rx="3" ry="4" fill="white" />
    <Circle cx="42" cy="50" r="2" fill="#000" />
    <Ellipse cx="58" cy="50" rx="3" ry="4" fill="white" />
    <Circle cx="58" cy="50" r="2" fill="#000" />
    <Ellipse cx="50" cy="58" rx="2.5" ry="1.5" fill="#f472b6" />
    <Path
      d="M35 70 Q50 80 65 70"
      stroke="#fbbf24"
      strokeWidth="3"
      strokeLinecap="round"
      fill="none"
    />
    <Circle cx="50" cy="75" r="3" fill="#fbbf24" />
  </G>
);

// Component cho Mèo Đại Trưởng Lão (3500-3999) - Vương miện lớn hơn với nhiều chi tiết
const CatGrandElder = () => (
  <G transform="translate(5, 5)">
    <Path
      d="M32 18 L38 8 L42 18 L50 5 L58 18 L62 8 L68 18 L65 28 L35 28 Z"
      fill="#fbbf24"
    />
    <Circle cx="38" cy="13" r="3" fill="#ff6b9d" />
    <Circle cx="50" cy="10" r="3" fill="#ff6b9d" />
    <Circle cx="62" cy="13" r="3" fill="#ff6b9d" />
    <Path
      d="M50 8 L53 18 L63 18 L55 24 L58 34 L50 28 L42 34 L45 24 L37 18 L47 18 Z"
      fill="#fbbf24"
      opacity="0.7"
    />
    <Circle
      cx="50"
      cy="30"
      r="30"
      fill="none"
      stroke="#fbbf24"
      strokeWidth="4"
      opacity="0.6"
    />
    <Path
      d="M75 70 Q85 60 85 45 Q85 30 75 35"
      stroke="#1f2937"
      strokeWidth="6"
      strokeLinecap="round"
      fill="none"
    />
    <Ellipse cx="50" cy="75" rx="25" ry="18" fill="#1f2937" />
    <Circle cx="50" cy="50" r="22" fill="#1f2937" />
    <Circle
      cx="42"
      cy="50"
      r="6"
      fill="none"
      stroke="#fbbf24"
      strokeWidth="2"
    />
    <Circle
      cx="58"
      cy="50"
      r="6"
      fill="none"
      stroke="#fbbf24"
      strokeWidth="2"
    />
    <Path d="M48 50 L52 50" stroke="#fbbf24" strokeWidth="2" />
    <Path d="M20 55 L32 55" stroke="#374151" strokeWidth="2" />
    <Path d="M20 58 L32 58" stroke="#374151" strokeWidth="2" />
    <Path d="M68 55 L80 55" stroke="#374151" strokeWidth="2" />
    <Path d="M68 58 L80 58" stroke="#374151" strokeWidth="2" />
    <Ellipse cx="50" cy="65" rx="18" ry="4" fill="#60a5fa" />
    <Path d="M44 65 L50 60 L56 65 L50 68 Z" fill="#fbbf24" />
    <Path d="M32 38 L25 15 L45 32 Z" fill="#1f2937" />
    <Path d="M68 38 L75 15 L55 32 Z" fill="#1f2937" />
    <Path d="M34 35 L29 20 L42 32 Z" fill="#60a5fa" />
    <Path d="M66 35 L71 20 L58 32 Z" fill="#60a5fa" />
    <Ellipse cx="42" cy="50" rx="3" ry="4" fill="white" />
    <Circle cx="42" cy="50" r="2" fill="#000" />
    <Ellipse cx="58" cy="50" rx="3" ry="4" fill="white" />
    <Circle cx="58" cy="50" r="2" fill="#000" />
    <Ellipse cx="50" cy="58" rx="2.5" ry="1.5" fill="#f472b6" />
    <Path
      d="M35 70 Q50 80 65 70"
      stroke="#fbbf24"
      strokeWidth="3"
      strokeLinecap="round"
      fill="none"
    />
    <Circle cx="50" cy="75" r="3" fill="#fbbf24" />
  </G>
);

// Component cho Mèo Toàn Trí (4000+) - Hào quang và hiệu ứng tối thượng
const CatOmniscient = () => (
  <G transform="translate(5, 5)">
    <Circle
      cx="50"
      cy="50"
      r="40"
      fill="none"
      stroke="#fbbf24"
      strokeWidth="5"
      opacity="0.3"
    />
    <Circle
      cx="50"
      cy="50"
      r="35"
      fill="none"
      stroke="#ff6b9d"
      strokeWidth="3"
      opacity="0.4"
    />
    <Path
      d="M50 5 L53 15 L63 15 L55 21 L58 31 L50 25 L42 31 L45 21 L37 15 L47 15 Z"
      fill="#fbbf24"
    />
    <Path
      d="M20 50 L23 55 L28 55 L24 58 L26 63 L20 60 L14 63 L16 58 L12 55 L17 55 Z"
      fill="#fbbf24"
      opacity="0.7"
    />
    <Path
      d="M80 50 L83 55 L88 55 L84 58 L86 63 L80 60 L74 63 L76 58 L72 55 L77 55 Z"
      fill="#fbbf24"
      opacity="0.7"
    />
    <Path
      d="M50 85 L53 90 L58 90 L54 93 L56 98 L50 95 L44 98 L46 93 L42 90 L47 90 Z"
      fill="#fbbf24"
      opacity="0.7"
    />
    <Path
      d="M32 18 L38 8 L42 18 L50 5 L58 18 L62 8 L68 18 L65 28 L35 28 Z"
      fill="#fbbf24"
    />
    <Circle cx="38" cy="13" r="3" fill="#ff6b9d" />
    <Circle cx="50" cy="10" r="4" fill="#ff6b9d" />
    <Circle cx="62" cy="13" r="3" fill="#ff6b9d" />
    <Path
      d="M75 70 Q85 60 85 45 Q85 30 75 35"
      stroke="#1f2937"
      strokeWidth="6"
      strokeLinecap="round"
      fill="none"
    />
    <Ellipse cx="50" cy="75" rx="25" ry="18" fill="#1f2937" />
    <Circle cx="50" cy="50" r="22" fill="#1f2937" />
    <Circle
      cx="42"
      cy="50"
      r="7"
      fill="none"
      stroke="#fbbf24"
      strokeWidth="2.5"
    />
    <Circle
      cx="58"
      cy="50"
      r="7"
      fill="none"
      stroke="#fbbf24"
      strokeWidth="2.5"
    />
    <Path d="M48 50 L52 50" stroke="#fbbf24" strokeWidth="2.5" />
    <Path d="M20 55 L32 55" stroke="#fbbf24" strokeWidth="2" />
    <Path d="M20 58 L32 58" stroke="#fbbf24" strokeWidth="2" />
    <Path d="M68 55 L80 55" stroke="#fbbf24" strokeWidth="2" />
    <Path d="M68 58 L80 58" stroke="#fbbf24" strokeWidth="2" />
    <Ellipse cx="50" cy="65" rx="18" ry="4" fill="#fbbf24" />
    <Path d="M44 65 L50 60 L56 65 L50 68 Z" fill="#ff6b9d" />
    <Path d="M32 38 L25 15 L45 32 Z" fill="#1f2937" />
    <Path d="M68 38 L75 15 L55 32 Z" fill="#1f2937" />
    <Path d="M34 35 L29 20 L42 32 Z" fill="#fbbf24" />
    <Path d="M66 35 L71 20 L58 32 Z" fill="#fbbf24" />
    <Ellipse cx="42" cy="50" rx="4" ry="5" fill="white" />
    <Circle cx="42" cy="50" r="2" fill="#000" />
    <Ellipse cx="58" cy="50" rx="4" ry="5" fill="white" />
    <Circle cx="58" cy="50" r="2" fill="#000" />
    <Ellipse cx="50" cy="58" rx="2.5" ry="1.5" fill="#ff6b9d" />
    <Path
      d="M35 70 Q50 82 65 70"
      stroke="#fbbf24"
      strokeWidth="4"
      strokeLinecap="round"
      fill="none"
    />
    <Circle cx="50" cy="75" r="4" fill="#fbbf24" />
  </G>
);

export const CuteBlackCatIcon: React.FC<CuteBlackCatIconProps> = ({
  level,
}) => {
  const catLevel = getCatLevel(level);

  const renderCat = () => {
    switch (catLevel) {
      case 0:
        return <CatNovice />;
      case 1:
        return <CatRecruit />;
      case 2:
        return <CatDiligent />;
      case 3:
        return <CatHardworking />;
      case 4:
        return <CatWise />;
      case 5:
        return <CatVeteran />;
      case 6:
        return <CatScholar />;
      case 7:
        return <CatErudite />;
      case 8:
        return <CatEnlightened />;
      case 9:
        return <CatMaster />;
      case 10:
        return <CatGrandmaster />;
      case 11:
        return <CatGrandElder />;
      case 12:
        return <CatOmniscient />;
      default:
        return <CatNovice />;
    }
  };

  return (
    <Svg width="60" height="60" viewBox="0 0 100 100">
      {renderCat()}
    </Svg>
  );
};
