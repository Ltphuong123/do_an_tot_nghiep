import { ButtonCustom } from "@/components/shared/buttonCustom";
import { ContainerCustom } from "@/components/shared/containerCustom";
import HtmlRenderer from "@/components/shared/htmlRenderer";
import { getColorAtived } from "@/constants/designSystem";
import { useLanguageContext } from "@/contexts/languageContext";
import { useSnackbar } from "@/contexts/snackbarContext";
import { useThemeContext } from "@/contexts/themeContext";
import { getPostDetail } from "@/services/post";
import { INotification } from "@/types/notification.type";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import { View } from "react-native";
import NotificationHeader from "./components/notificationHeader";

export default function NotificationDetailScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { theme } = useThemeContext();
  const { showSnackbar } = useSnackbar();
  const { t } = useLanguageContext();

  const notification: INotification = params?.notifi
    ? JSON.parse(params.notifi as string)
    : null;

  const handleViewPress = async () => {
    if (
      notification?.redirect_type === "post" ||
      notification?.redirect_type === "post_comment"
    ) {
      setLoading(true);
      try {
        let postId: string | undefined;
        let commentId: string | undefined;

        if (notification.redirect_type === "post_comment") {
          // For comment notifications, data should have post_id and comment_id
          postId = notification.data.id;
          commentId = notification.data.comment_id;
        } else if (notification.redirect_type === "post") {
          // For post notifications, data has post_id or id
          postId = notification.data.id || notification.data.post_id;
          commentId = undefined;
        }

        if (postId) {
          // Fetch post detail to pass to postDetail screen
          const postResponse = await getPostDetail(postId);

          router.push({
            pathname: "/postDetail" as any,
            params: {
              id: postResponse.id,
              ...(commentId && { commentId }),
              post: JSON.stringify(postResponse),
            },
          });
        } else {
          // Fallback if no postId
        }
      } catch {
        showSnackbar(t("postNotFound"), "error");
        // Do not navigate if post not found
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <ContainerCustom variant="background" scrollable={true}>
      <NotificationHeader title={t("notificationDetail")} />
      <View style={{ padding: 16 }}>
        <HtmlRenderer
          htmlContent={notification?.content.html || ""}
          theme={theme}
        />
        {(notification?.redirect_type === "post" ||
          notification?.redirect_type === "post_comment") && (
          <ButtonCustom
            title="Xem"
            onPress={handleViewPress}
            style={{ marginTop: 16 }}
            disabled={loading}
            startColors={getColorAtived(theme)}
            endColors={getColorAtived(theme)}
            textStyle={{ color: "#fff" }}
          />
        )}
      </View>
    </ContainerCustom>
  );
}
