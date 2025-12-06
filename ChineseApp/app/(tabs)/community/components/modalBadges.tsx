import { CardCustom } from "@/components/shared/cardCustom";
import { ContainerCustom } from "@/components/shared/containerCustom";
import {
  DesignSystem,
  getBorderColor,
  getTextColor,
} from "@/constants/designSystem";
import { useThemeContext } from "@/contexts/themeContext";
import { useBadges } from "@/hooks/useHome";
import { IBadge } from "@/types/home.type";
import React from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Modal,
  Pressable,
  TouchableOpacity,
  View,
} from "react-native";
import { Icon, Text } from "react-native-paper";

interface ModalBadgesProps {
  visible: boolean;
  onClose: () => void;
}

const ModalBadges: React.FC<ModalBadgesProps> = ({ visible, onClose }) => {
  const { theme } = useThemeContext();

  // Use badges query hook
  const { data: badges, isLoading } = useBadges();

  // Colors
  const textPrimary = getTextColor(theme, "primary");
  const textSecondary = getTextColor(theme, "secondary");
  const borderColor = getBorderColor(theme, "light");

  const renderBadgeItem = ({ item }: { item: IBadge }) => {
    return (
      <CardCustom
        variant="card"
        padding="md"
        style={{
          flex: 1,
          margin: DesignSystem.spacing.xs,
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "row",
          gap: DesignSystem.spacing.sm,
        }}
      >
        <Image
          source={{ uri: item.icon }}
          style={{
            width: 20,
            height: 20,
            borderRadius: DesignSystem.borderRadius.md,
            marginBottom: DesignSystem.spacing.sm,
          }}
          resizeMode="contain"
        />
        <Text
          style={{
            fontSize: DesignSystem.typography.fontSize.sm,
            fontWeight: DesignSystem.typography.fontWeight.semibold,
            color: textPrimary,
            textAlign: "center",
          }}
          numberOfLines={2}
        >
          {item.name}
        </Text>
      </CardCustom>
    );
  };

  const renderHeader = () => (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingBottom: DesignSystem.spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: borderColor,
        marginBottom: DesignSystem.spacing.md,
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Icon source="medal" size={24} color="#FFD700" />
        <Text
          style={{
            fontSize: DesignSystem.typography.fontSize.lg,
            fontWeight: DesignSystem.typography.fontWeight.bold,
            color: textPrimary,
            marginLeft: DesignSystem.spacing.sm,
          }}
        >
          Danh sách huy hiệu
        </Text>
      </View>
      <TouchableOpacity onPress={onClose}>
        <Icon source="close" size={24} color={textSecondary} />
      </TouchableOpacity>
    </View>
  );

  const renderEmptyState = () => (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: DesignSystem.spacing.xl,
      }}
    >
      <Icon source="medal-outline" size={64} color={textSecondary} />
      <Text
        style={{
          fontSize: DesignSystem.typography.fontSize.md,
          color: textSecondary,
          marginTop: DesignSystem.spacing.md,
          textAlign: "center",
        }}
      >
        Không có huy hiệu nào
      </Text>
    </View>
  );

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      statusBarTranslucent={true}
    >
      <Pressable
        style={{
          flex: 1,
          height: "100%",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
        }}
        onPress={onClose}
      />
      <ContainerCustom
        scrollable={false}
        style={{
          paddingHorizontal: DesignSystem.spacing.md,
          borderRadius: DesignSystem.borderRadius.lg,
          height: "80%",
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
        }}
      >
        {renderHeader()}

        {isLoading ? (
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <ActivityIndicator size="large" color={textSecondary} />
            <Text
              style={{
                fontSize: DesignSystem.typography.fontSize.sm,
                color: textSecondary,
                marginTop: DesignSystem.spacing.sm,
              }}
            >
              Đang tải...
            </Text>
          </View>
        ) : !badges || badges.length === 0 ? (
          renderEmptyState()
        ) : (
          <FlatList
            data={badges as IBadge[]}
            keyExtractor={(item) => item.id}
            renderItem={renderBadgeItem}
            numColumns={2}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingBottom: DesignSystem.spacing.md,
            }}
            removeClippedSubviews={true}
            windowSize={10}
            maxToRenderPerBatch={10}
            initialNumToRender={10}
            updateCellsBatchingPeriod={100}
          />
        )}
      </ContainerCustom>
    </Modal>
  );
};

export default ModalBadges;
