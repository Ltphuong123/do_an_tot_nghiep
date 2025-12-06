/* eslint-disable @typescript-eslint/no-unused-vars */
import AvatarCustom from "@/components/shared/avatarCustom";
import { ContainerCustom } from "@/components/shared/containerCustom";
import { HomeCardsSkeletonList } from "@/components/shared/homeCardSkeleton";
import {
  DesignSystem,
  getBackgroundColor,
  getTextColor,
} from "@/constants/designSystem";
import { COMPONENT_MAP } from "@/constants/homeCards";
import { useLanguageContext } from "@/contexts/languageContext";
import { useThemeContext } from "@/contexts/themeContext";
import { useUser } from "@/hooks/useUser";
import { useHomeLayoutStore } from "@/store/useHomeLayoutStore";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useEffect } from "react";
import {
  ImageBackground,
  InteractionManager,
  Pressable,
  RefreshControl,
  ScrollView,
  View,
} from "react-native";
import { Icon, Text } from "react-native-paper";

export default React.memo(function HomeScreen() {
  const router = useRouter();
  const Background = require("../../../assets/images/background_avatar.jpg");
  const { theme } = useThemeContext();
  const { t } = useLanguageContext();

  useFocusEffect(() => {
    // console.log("HomeScreen rendered");
  });

  const { user, isLoggedIn } = useUser();
  const { layout, reloadLayout, migrateFromOldStorage } = useHomeLayoutStore();

  const textColor = getTextColor(theme, "primary");
  const secondaryTextColor = getTextColor(theme, "secondary");

  const handleProfilePress = () => {
    router.push({ pathname: "/home/profile" as any });
  };

  // State để track đã load layout chưa
  const [layoutLoaded, setLayoutLoaded] = React.useState(false);
  const [isRefreshing, setIsRefreshing] = React.useState(false);

  const loadLayout = useCallback(
    async (forceRefresh = false) => {
      if (forceRefresh) {
        setIsRefreshing(true);
      }

      try {
        await migrateFromOldStorage();
        await reloadLayout();
        setLayoutLoaded(true);
      } catch (error) {
        setLayoutLoaded(true);
      } finally {
        if (forceRefresh) {
          setIsRefreshing(false);
        }
      }
    },
    [migrateFromOldStorage, reloadLayout]
  );

  // Chỉ load 1 lần khi mount với InteractionManager
  useEffect(() => {
    if (!layoutLoaded) {
      // Defer loading sau khi navigation animation xong
      const task = InteractionManager.runAfterInteractions(() => {
        loadLayout();
      });
      return () => task.cancel();
    }
  }, [layoutLoaded, loadLayout]);

  return (
    <ContainerCustom variant="background" scrollable={false}>
      {isRefreshing || !layoutLoaded ? (
        <ScrollView
          contentContainerStyle={{
            padding: DesignSystem.spacing.md,
          }}
          showsVerticalScrollIndicator={false}
        >
          {/* Header skeleton */}
          <View
            style={{
              height: 100,
              borderRadius: DesignSystem.borderRadius.xl,
              backgroundColor: getBackgroundColor(theme, "primary"),
              marginBottom: DesignSystem.spacing.md,
            }}
          />
          {/* Cards skeleton */}
          <HomeCardsSkeletonList count={6} />
        </ScrollView>
      ) : isLoggedIn ? (
        <ScrollView
          contentContainerStyle={{}}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={() => loadLayout(true)}
              colors={["#4A90E2"]}
              tintColor="#4A90E2"
            />
          }
        >
          {/* Custom Header - Scrollable */}
          <View
            style={{
              padding: DesignSystem.spacing.md,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              backgroundColor: getBackgroundColor(theme, "primary"),
              ...DesignSystem.shadows[theme].xl,
              borderBottomRightRadius: DesignSystem.borderRadius.xl,
              borderBottomLeftRadius: DesignSystem.borderRadius.xl,
              minHeight: 100,
              overflow: "hidden",
              marginBottom: DesignSystem.spacing.md,
            }}
          >
            <ImageBackground
              source={Background}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
              }}
              imageStyle={{ opacity: 0.3 }}
            />
            <Pressable
              onPress={handleProfilePress}
              style={{
                flexDirection: "row",
                alignItems: "center",
                flex: 1,
              }}
            >
              <AvatarCustom avatar={user.avatar_url} size={50} />
              <View style={{ flex: 1, marginLeft: DesignSystem.spacing.md }}>
                <Text
                  style={{
                    fontWeight: DesignSystem.typography.fontWeight.bold,
                    fontSize: DesignSystem.typography.fontSize.xl,
                    color: textColor,
                  }}
                >
                  {user.name ? `${t("welcome")} ${user.name}` : t("login")}
                </Text>
              </View>
            </Pressable>

            <Pressable onPress={() => router.push("/home/setting")}>
              <Icon source="cog-outline" size={24} color={textColor} />
            </Pressable>
          </View>

          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
              gap: DesignSystem.spacing.md,
              paddingHorizontal: DesignSystem.spacing.md,
              paddingBottom: DesignSystem.spacing.md,
            }}
          >
            {layout
              .filter((card) => card.visible)
              .map((card) => {
                const Component = COMPONENT_MAP[card.id];
                if (!Component) return null;
                return <Component key={card.id} />;
              })}
          </View>
        </ScrollView>
      ) : (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            padding: DesignSystem.spacing.md,
          }}
        >
          <Text
            style={{
              fontSize: DesignSystem.typography.fontSize.lg,
              color: secondaryTextColor,
              textAlign: "center",
            }}
          >
            {t("loginRequired")}
          </Text>
        </View>
      )}
    </ContainerCustom>
  );
});
