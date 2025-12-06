/**
 * Test Overview Screen - Màn hình thống kê tổng quan bài thi
 * Hiển thị trước khi bắt đầu làm bài
 */

import { ButtonCustom } from "@/components/shared/buttonCustom";
import { ContainerCustom } from "@/components/shared/containerCustom";
import {
  DesignSystem,
  getBackgroundColor,
  getColorAtived,
  getTextColor,
} from "@/constants/designSystem";
import { useLanguageContext } from "@/contexts/languageContext";
import { useThemeContext } from "@/contexts/themeContext";
import { IExam } from "@/types/mockTest.type";
import { router } from "expo-router";
import React, { useState } from "react";
import { Dimensions, Pressable, ScrollView, View } from "react-native";
import { Icon, Text } from "react-native-paper";
import WebView from "react-native-webview";

interface TestOverviewProps {
  test: IExam;
  onStart: () => void;
}

const TestOverview = ({ test, onStart }: TestOverviewProps) => {
  const { theme } = useThemeContext();
  const { t } = useLanguageContext();
  const textColor = getTextColor(theme, "primary");
  const cardBg = theme === "dark" ? "#1a1a2e" : "#ffffff";

  const windowHeight = Dimensions.get("window").height;
  // adjust these offsets if your header/footer sizes differ
  const HEADER_HEIGHT = 80;
  const FOOTER_HEIGHT = 72;
  const availableHeight = Math.max(
    200,
    windowHeight - HEADER_HEIGHT - FOOTER_HEIGHT
  );

  // Log chỉ nội dung HTML để debug
  console.log(test);

  const [webHeight, setWebHeight] = useState<number>(availableHeight);

  const injectedJS = `
    (function() {
      // prevent WebView internal scrolling
      document.documentElement.style.overflow = 'hidden';
      document.body.style.overflow = 'hidden';
      // force viewport meta if not present
      var meta = document.querySelector('meta[name="viewport"]');
      if (!meta) {
        meta = document.createElement('meta');
        meta.name = 'viewport';
        meta.content = 'width=device-width, initial-scale=1, maximum-scale=1';
        document.head.appendChild(meta);
      } else {
        meta.content = 'width=device-width, initial-scale=1, maximum-scale=1';
      }

      function sendHeight() {
        var h = document.documentElement.scrollHeight || document.body.scrollHeight;
        window.ReactNativeWebView.postMessage(String(h));
      }
      sendHeight();
      setTimeout(sendHeight, 300);
      var ro = new MutationObserver(sendHeight);
      ro.observe(document.body, { childList: true, subtree: true, characterData: true });
    })();
    true;
  `;

  // theme-aware colors for WebView content
  const bodyText = theme === "dark" ? "#E6EEF8" : "#222222";
  const headerBg =
    theme === "dark" ? "rgba(40, 50, 70, 0.95)" : "rgb(227, 236, 246)";
  const thColor = theme === "dark" ? "#E6EEF8" : "#1F1F1F";
  const borderColor =
    theme === "dark" ? "rgba(255,255,255,0.06)" : "rgb(242,242,242)";
  const tableAccent =
    theme === "dark" ? "rgba(80,110,160,0.12)" : "transparent";
  const partItemBg =
    theme === "dark" ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)";
  const htmlContent = `
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1"/>
        <style>
          :root{
            --body-text: ${bodyText};
            --header-bg: ${headerBg};
            --th-color: ${thColor};
            --border-color: ${borderColor};
            --table-accent: ${tableAccent};
            --web-bg: ${cardBg};
            --part-bg: ${partItemBg};
          }

          /* base layout */
          html,body{
            margin:0;padding:0;box-sizing:border-box;height:100%;width:100%;
            font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial;
            overflow-x:hidden;background:var(--web-bg);
            color:var(--body-text);
          }

          /* center content horizontally and vertically */
          body { display: flex; align-items: center; justify-content: center; }
          .wrapper { width:100%; max-width: 960px; padding: 16px; box-sizing: border-box; display:flex; align-items:center; justify-content:center; min-height:100vh; }

          /* keep original markup/layout but ensure text/svg readable in dark mode */
          /* DO NOT force borders or widths -> show returned HTML as-is */
          /* Only override colors for readability and prevent overflow */
          :not(pre) * { color: var(--body-text) !important; }
          a, a * { color: var(--body-text) !important; text-decoration: underline !important; }
          svg, svg * { fill: var(--body-text) !important; stroke: var(--body-text) !important; }

          /* allow source widths but prevent overflow on small screens */
          img,svg,iframe{max-width:100% !important; height:auto !important; display:block;}
          [style*="width:"]{max-width:100% !important; width:auto !important;}

          /* do not add borders/rounding around table - show source table as provided */
          .table-wrap{ width:100%; background:transparent; border-radius:0; overflow:visible; box-shadow:none; display:block; }

          /* ensure table itself is centered inside wrapper and responsive */
          table { margin: 0 auto !important; max-width: 100% !important; width: auto !important; }

          table, thead, tbody, tfoot, tr, th, td {
            box-sizing: border-box !important;
            max-width:100% !important;
            width: auto !important;
            /* remove any forced borders we previously added */
            border: none !important;
            background: transparent !important;
            color: var(--body-text) !important;
          }

          /* only style the horizontal header row (th) */
          th {
            background: var(--header-bg) !important;
            color: var(--th-color) !important;
            font-weight: 600;
            padding: 8px 4px !important;
            font-size: 13px !important;
          }

          /* Table responsive styling */
          td {
            padding: 8px 4px !important;
            font-size: 14px !important;
            word-break: break-word !important;
          }

          /* Make .part-item stack vertically inside the question column */
          .part-item{
            display:block !important;
            margin:4px 0 !important;
            padding:4px 6px !important;
            border-radius:4px !important;
            background:var(--part-bg) !important;
            color:var(--body-text) !important;
            border: none !important;
            box-sizing: border-box !important;
            white-space:normal !important;
            text-align:center !important;
            min-width:0 !important;
            font-size: 12px !important;
          }

          /* Enable horizontal scroll for table on small screens */
          .table-wrap {
            overflow-x: auto;
            -webkit-overflow-scrolling: touch;
          }

          table {
            min-width: 100%;
            border-collapse: collapse !important;
          }

          /* ensure pre/code remain readable */
          pre, code { color: var(--body-text) !important; background: transparent !important; }

        </style>
      </head>
      <body>
        <div class="wrapper">
          <div class="table-wrap">
            ${test?.description?.html || `<div>${t("noContent")}</div>`}
          </div>
        </div>
      </body>
    </html>
  `;

  return (
    <ContainerCustom variant="background" scrollable={false}>
      {/* Header */}
      <View
        style={{
          padding: DesignSystem.spacing.md,
          flexDirection: "row",
          alignItems: "center",
          gap: DesignSystem.spacing.md,
          backgroundColor: getBackgroundColor(theme, "primary"),
          ...DesignSystem.shadows[theme].md,
        }}
      >
        <Pressable onPress={() => router.back()}>
          <Icon source="arrow-left" size={24} color={textColor} />
        </Pressable>
        <Text
          style={{
            flex: 1,
            fontSize: 20,
            fontWeight: "700",
            color: textColor,
            textAlign: "center",
            marginRight: 40,
          }}
        >
          {t("testInformation")}
        </Text>
        <Pressable
          onPress={() =>
            router.push({
              pathname: "/mockTest/history",
              params: {
                exam_type_id: test.exam_type_id,
                exam_level_id: test.exam_level_id,
                exam_name: test.name,
              },
            })
          }
        >
          <Icon source="history" size={24} color={textColor} />
        </Pressable>
      </View>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16 }}>
        {test.description && (
          <View
            style={{
              backgroundColor: cardBg,
            }}
          >
            <WebView
              originWhitelist={["*"]}
              source={{ html: htmlContent }}
              style={{
                height: webHeight || availableHeight,
                width: "100%",
                backgroundColor: "transparent",
              }} // <-- transparent để thấy background của HTML
              injectedJavaScript={injectedJS}
              javaScriptEnabled
              domStorageEnabled
              scrollEnabled={false}
              onMessage={(event) => {
                const h = Number(event.nativeEvent.data);
                if (!Number.isNaN(h) && h > 0) {
                  // cap height so it doesn't grow beyond available area
                  const finalH = Math.min(h + 8, availableHeight);
                  setWebHeight(finalH);
                }
              }}
            />
          </View>
        )}
        {test.instructions && (
          <View style={{ paddingLeft: 16 }}>
            <Text>
              {t("instructions")}: {test.instructions}
            </Text>
          </View>
        )}
      </ScrollView>
      <View
        style={{
          padding: 16,
          backgroundColor: cardBg,
          borderTopWidth: 1,
          borderTopColor: "rgba(0, 0, 0, 0.05)",
        }}
      >
        <ButtonCustom
          startColors={getColorAtived(theme)}
          endColors={getColorAtived(theme)}
          title={t("beginTest")}
          onPress={onStart}
          textStyle={{ color: "#fff" }}
        />
      </View>
    </ContainerCustom>
  );
};

export default TestOverview;
