/**
 * HtmlRenderer - Component để hiển thị HTML content từ backend với đúng style
 *
 * Features:
 * - Giữ nguyên tất cả inline styles từ backend
 * - Hỗ trợ đầy đủ các HTML tags (h1-h6, p, strong, em, ul, ol, table, etc.)
 * - Responsive với theme light/dark
 * - Có thể tùy chỉnh fontSize và textAlign
 * - Không làm thay đổi content từ backend
 *
 * Usage:
 * <HtmlRenderer
 *   htmlContent={htmlFromBackend}
 *   theme={currentTheme}
 *   fontSize={16}
 *   textAlign="justify"
 * />
 */

import { getTextColor } from "@/constants/designSystem";
import React, { useMemo } from "react";
import { Dimensions, View } from "react-native";
import RenderHtml from "react-native-render-html";

interface HtmlRendererProps {
  htmlContent?: string | null;
  theme: "light" | "dark";
  fontSize?: number;
  textAlign?: "left" | "center" | "right" | "justify";
  baseStyle?: any; // Cho phép override base style nếu cần
  forceThemeColors?: boolean; // Force override inline styles với theme colors
}

const HtmlRenderer: React.FC<HtmlRendererProps> = React.memo(
  ({
    htmlContent,
    theme,
    fontSize = 15,
    textAlign = "justify",
    baseStyle,
    forceThemeColors = true,
  }) => {
    const { width } = Dimensions.get("window");
    const contentWidth = width - 64; // Account for padding

    const textColor = getTextColor(theme, "secondary");
    const primaryTextColor = getTextColor(theme, "primary");

    // Pre-process HTML để override inline styles có thể conflict với dark theme
    const processedHtml = useMemo(() => {
      const safeHtml = htmlContent ?? "";

      if (theme === "dark" && forceThemeColors) {
        // Thêm CSS để force override tất cả text color
        const cssOverride = `<style>
          * { color: ${textColor} !important; }
          strong, b { color: ${primaryTextColor} !important; }
          h1, h2, h3, h4, h5, h6 { color: ${primaryTextColor} !important; }
        </style>`;

        // Override các inline styles màu đen khi ở dark mode
        const cleanedHtml = safeHtml
          .replace(
            /style="[^"]*color:\s*#000000?[^"]*"/gi,
            `style="color: ${textColor};"`
          )
          .replace(
            /style="[^"]*color:\s*black[^"]*"/gi,
            `style="color: ${textColor};"`
          )
          .replace(
            /style="[^"]*color:\s*rgb\(0,\s*0,\s*0\)[^"]*"/gi,
            `style="color: ${textColor};"`
          )
          .replace(/color:\s*#000000?/gi, `color: ${textColor}`)
          .replace(/color:\s*black/gi, `color: ${textColor}`)
          .replace(/color:\s*rgb\(0,\s*0,\s*0\)/gi, `color: ${textColor}`);

        return cssOverride + cleanedHtml;
      }
      return safeHtml;
    }, [htmlContent, theme, textColor, primaryTextColor, forceThemeColors]);

    const tagsStyles = useMemo(
      () => ({
        body: {
          fontSize,
          color: textColor,
          fontFamily: "System",
        },
        p: {
          fontSize,
          color: textColor,
          lineHeight: fontSize * 1.4,
          textAlign,
          marginBottom: 8,
        },
        span: {
          fontSize,
          color: textColor,
        },
        // Force override cho dark theme
        ...(theme === "dark" &&
          forceThemeColors && {
            "*": {
              color: `${textColor} !important`,
            },
          }),
        strong: {
          fontWeight: "bold" as const,
          color: primaryTextColor,
        },
        b: {
          fontWeight: "bold" as const,
          color: primaryTextColor,
        },
        em: {
          color: textColor,
          fontStyle: "italic" as const,
        },
        i: {
          color: textColor,
          fontStyle: "italic" as const,
        },
        u: {
          textDecorationLine: "underline" as const,
          color: textColor,
        },
        h1: {
          fontSize: fontSize * 1.8,
          fontWeight: "bold" as const,
          color: primaryTextColor,
          marginBottom: 12,
          lineHeight: fontSize * 2.2,
        },
        h2: {
          fontSize: fontSize * 1.6,
          fontWeight: "bold" as const,
          color: primaryTextColor,
          marginBottom: 10,
          lineHeight: fontSize * 2.0,
        },
        h3: {
          fontSize: fontSize * 1.4,
          fontWeight: "bold" as const,
          color: primaryTextColor,
          marginBottom: 8,
          lineHeight: fontSize * 1.8,
        },
        h4: {
          fontSize: fontSize * 1.2,
          fontWeight: "bold" as const,
          color: primaryTextColor,
          marginBottom: 6,
          lineHeight: fontSize * 1.6,
        },
        h5: {
          fontSize: fontSize * 1.1,
          fontWeight: "bold" as const,
          color: primaryTextColor,
          marginBottom: 4,
          lineHeight: fontSize * 1.4,
        },
        h6: {
          fontSize,
          fontWeight: "bold" as const,
          color: primaryTextColor,
          marginBottom: 4,
          lineHeight: fontSize * 1.4,
        },
        li: {
          fontSize,
          color: textColor,
          lineHeight: fontSize * 1.4,
          marginBottom: 4,
        },
        ul: {
          marginBottom: 8,
          paddingLeft: 16,
        },
        ol: {
          marginBottom: 8,
          paddingLeft: 16,
        },
        div: {
          fontSize,
          color: textColor,
        },
        blockquote: {
          backgroundColor:
            theme === "light"
              ? "rgba(74, 144, 226, 0.05)"
              : "rgba(74, 144, 226, 0.1)",
          borderLeftWidth: 4,
          borderLeftColor: "#4A90E2",
          paddingLeft: 12,
          paddingVertical: 8,
          marginVertical: 8,
          borderRadius: 4,
        },
        table: {
          marginVertical: 8,
          borderWidth: 1,
          borderColor: theme === "light" ? "#e0e0e0" : "#444",
          borderRadius: 4,
        },
        td: {
          fontSize: fontSize - 1,
          color: textColor,
          padding: 8,
          borderWidth: 0.5,
          borderColor: theme === "light" ? "#e0e0e0" : "#444",
        },
        th: {
          fontSize: fontSize - 1,
          color: primaryTextColor,
          fontWeight: "bold" as const,
          padding: 8,
          backgroundColor: theme === "light" ? "#f5f5f5" : "#333",
          borderWidth: 0.5,
          borderColor: theme === "light" ? "#e0e0e0" : "#444",
        },
        a: {
          color: "#4A90E2",
          textDecorationLine: "underline" as const,
        },
        code: {
          backgroundColor: theme === "light" ? "#f5f5f5" : "#2d2d2d",
          color: theme === "light" ? "#e53e3e" : "#ff6b6b",
          paddingHorizontal: 4,
          paddingVertical: 2,
          borderRadius: 3,
          fontSize: fontSize * 0.9,
          fontFamily: "monospace",
        },
        pre: {
          backgroundColor: theme === "light" ? "#f5f5f5" : "#2d2d2d",
          padding: 12,
          borderRadius: 6,
          marginVertical: 8,
        },
      }),
      [
        theme,
        fontSize,
        textAlign,
        textColor,
        primaryTextColor,
        forceThemeColors,
      ]
    );

    const systemFonts = useMemo(() => ["System"], []);

    const renderersProps = useMemo(
      () => ({
        // Cho phép inline styles được áp dụng
        img: {
          enableExperimentalPercentWidth: true,
        },
      }),
      []
    );

    // Base style cho toàn bộ HTML content
    const defaultBaseStyle = useMemo(
      () => ({
        fontSize,
        color: textColor,
        fontFamily: "System",
        ...baseStyle, // Cho phép override từ props
      }),
      [fontSize, textColor, baseStyle]
    );

    return (
      <View>
        <RenderHtml
          contentWidth={contentWidth}
          source={{ html: processedHtml }}
          tagsStyles={tagsStyles}
          systemFonts={systemFonts}
          renderersProps={renderersProps}
          baseStyle={defaultBaseStyle}
          // Cho phép tất cả CSS properties được parse và áp dụng
          enableCSSInlineProcessing={true}
          // Không bỏ qua bất kỳ style nào từ backend
          ignoredStyles={[]}
          // Giữ nguyên tất cả DOM nodes
          ignoreDomNode={() => false}
          // Cho phép experimental features để hỗ trợ tốt hơn
          enableExperimentalBRCollapsing={false}
          enableExperimentalMarginCollapsing={false}
          // Đảm bảo inline styles có priority cao nhất
          computeEmbeddedMaxWidth={(contentWidth) => contentWidth}
        />
      </View>
    );
  }
);

HtmlRenderer.displayName = "HtmlRenderer";

export default HtmlRenderer;
