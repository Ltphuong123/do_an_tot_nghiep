import { DesignSystem, getTextColor } from "@/constants/designSystem";
import { useThemeContext } from "@/contexts/themeContext";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Pressable,
  ScrollView,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";
import { Icon, Text } from "react-native-paper";

export interface SelectTab<T = string> {
  value: T;
  label: string;
  // icon name as string (previously keyed from MaterialCommunityIcons.glyphMap)
  icon?: string;
  disabled?: boolean;
}

export interface SelectTabsProps<T = string> {
  tabs: SelectTab<T>[];
  selectedValue: T;
  onSelect: (value: T) => void;

  // Styling props
  activeBackgroundColor?: string;
  inactiveBackgroundColor?: string;
  activeTextColor?: string;
  inactiveTextColor?: string;
  activeBorderColor?: string;
  inactiveBorderColor?: string;

  // Icon props
  iconSize?: number;
  iconPosition?: "left" | "right" | "top" | "bottom";
  showIcon?: boolean;

  // Layout props
  containerPadding?: number;
  tabPaddingHorizontal?: number;
  tabPaddingVertical?: number;
  tabGap?: number;
  tabMinWidth?: number;
  tabBorderRadius?: number;
  tabBorderWidth?: number;

  // Font props
  fontSize?: number;
  fontWeight?: TextStyle["fontWeight"];
  activeFontWeight?: TextStyle["fontWeight"];

  // Behavior props
  scrollToCenter?: boolean;
  scrollDelay?: number;
  fullWidthTabs?: boolean;

  // Container style
  containerStyle?: ViewStyle;
  tabStyle?: ViewStyle;
  activeTabStyle?: ViewStyle;
  textStyle?: TextStyle;
  activeTextStyle?: TextStyle;
}

export default function SelectTabs<T = string>({
  tabs,
  selectedValue,
  onSelect,

  // Default styling
  activeBackgroundColor = "#4A90E2",
  inactiveBackgroundColor,
  activeTextColor = "#FFFFFF",
  inactiveTextColor,
  activeBorderColor,
  inactiveBorderColor,

  // Icon defaults
  iconSize = 18,
  iconPosition = "left",
  showIcon = true,

  // Layout defaults
  containerPadding = DesignSystem.spacing.xs,
  tabPaddingHorizontal = DesignSystem.spacing.lg,
  tabPaddingVertical = DesignSystem.spacing.sm,
  tabGap = DesignSystem.spacing.sm,
  tabMinWidth = 92,
  tabBorderRadius = DesignSystem.borderRadius.full,
  tabBorderWidth = 1,

  // Font defaults
  fontSize = DesignSystem.typography.fontSize.xs,
  fontWeight = DesignSystem.typography.fontWeight.semibold,
  activeFontWeight = DesignSystem.typography.fontWeight.extrabold,

  // Behavior defaults
  scrollToCenter = true,
  scrollDelay = 100,
  fullWidthTabs = false,

  // Custom styles
  containerStyle,
  tabStyle,
  activeTabStyle,
  textStyle,
  activeTextStyle,
}: SelectTabsProps<T>) {
  const { theme } = useThemeContext();
  const scrollRef = useRef<ScrollView | null>(null);
  const tabRefs = useRef<{ [key: string]: View | null }>({});
  const [containerWidth, setContainerWidth] = useState<number>(0);

  // Get default colors based on theme
  const defaultInactiveBackground =
    theme === "dark" ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)";
  const defaultTextColor = getTextColor(theme, "primary");
  const defaultBorderColor = getTextColor(theme, "secondary");

  const scrollToSelected = useCallback(
    (value: T) => {
      if (!scrollToCenter || !scrollRef.current || !containerWidth) return;

      const buttonRef = tabRefs.current[String(value)];
      if (buttonRef) {
        buttonRef.measureLayout(
          scrollRef.current as any,
          (x, y, width, height) => {
            const scrollX = x - containerWidth / 2 + width / 2;
            scrollRef.current?.scrollTo({
              x: Math.max(0, scrollX),
              animated: true,
            });
          },
          () => {
            // ignore error
          }
        );
      }
    },
    [containerWidth, scrollToCenter]
  );

  useEffect(() => {
    if (scrollToCenter && selectedValue && containerWidth > 0) {
      const timer = setTimeout(() => {
        scrollToSelected(selectedValue);
      }, scrollDelay);
      return () => clearTimeout(timer);
    }
  }, [
    selectedValue,
    containerWidth,
    scrollToCenter,
    scrollDelay,
    scrollToSelected,
  ]);

  const renderIcon = (tab: SelectTab<T>, isActive: boolean) => {
    if (!showIcon || !tab.icon) return null;

    const iconColor = isActive
      ? activeTextColor
      : inactiveTextColor || defaultTextColor;

    const iconElement = (
      <Icon source={tab.icon as any} size={iconSize} color={iconColor} />
    );

    if (iconPosition === "top" || iconPosition === "bottom") {
      return iconElement;
    }

    return iconElement;
  };

  const renderTabContent = (tab: SelectTab<T>, isActive: boolean) => {
    const textColor = isActive
      ? activeTextColor
      : inactiveTextColor || defaultTextColor;

    const combinedTextStyle: TextStyle = {
      fontSize,
      fontWeight: isActive ? activeFontWeight : fontWeight,
      color: textColor,
      letterSpacing: 0.2,
      ...textStyle,
      ...(isActive ? activeTextStyle : {}),
    };

    const isVertical = iconPosition === "top" || iconPosition === "bottom";
    const isReverse = iconPosition === "right" || iconPosition === "bottom";

    if (isVertical) {
      return (
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            gap: DesignSystem.spacing.xs,
            flexDirection: isReverse ? "column-reverse" : "column",
          }}
        >
          {renderIcon(tab, isActive)}
          <Text style={combinedTextStyle}>{tab.label}</Text>
        </View>
      );
    }

    return (
      <View
        style={{
          flexDirection: isReverse ? "row-reverse" : "row",
          alignItems: "center",
          gap: DesignSystem.spacing.xs,
        }}
      >
        {renderIcon(tab, isActive)}
        <Text style={combinedTextStyle}>{tab.label}</Text>
      </View>
    );
  };

  if (tabs.length === 0) return null;

  return (
    <ScrollView
      ref={scrollRef}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={[
        {
          paddingHorizontal: containerPadding,
          gap: tabGap,
        },
        containerStyle,
      ]}
      onLayout={(e) => setContainerWidth(e.nativeEvent.layout.width)}
    >
      {tabs.map((tab) => {
        const isActive = selectedValue === tab.value;
        const isDisabled = tab.disabled || false;

        const backgroundColor = isActive
          ? activeBackgroundColor
          : inactiveBackgroundColor || defaultInactiveBackground;

        const borderColor = isActive
          ? activeBorderColor || "transparent"
          : inactiveBorderColor || defaultBorderColor;

        const combinedTabStyle: ViewStyle = {
          paddingHorizontal: tabPaddingHorizontal,
          paddingVertical: tabPaddingVertical,
          borderRadius: tabBorderRadius,
          backgroundColor,
          borderWidth: isActive && !activeBorderColor ? 0 : tabBorderWidth,
          borderColor,
          minWidth: fullWidthTabs
            ? containerWidth - containerPadding * 2
            : tabMinWidth,
          alignItems: "center",
          justifyContent: "center",
          opacity: isDisabled ? 0.5 : 1,
          ...tabStyle,
          ...(isActive ? activeTabStyle : {}),
        };

        return (
          <Pressable
            key={String(tab.value)}
            ref={(ref) => {
              tabRefs.current[String(tab.value)] = ref as any;
            }}
            onPress={() => !isDisabled && onSelect(tab.value)}
            disabled={isDisabled}
            style={combinedTabStyle}
          >
            {renderTabContent(tab, isActive)}
          </Pressable>
        );
      })}
    </ScrollView>
  );
}
