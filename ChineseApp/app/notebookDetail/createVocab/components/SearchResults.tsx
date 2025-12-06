import { ButtonCustom } from "@/components/shared/buttonCustom";
import { CardCustom } from "@/components/shared/cardCustom";
import {
  DesignSystem,
  getColorAtived,
  getTextColor,
} from "@/constants/designSystem";
import { useLanguageContext } from "@/contexts/languageContext";
import { useThemeContext } from "@/contexts/themeContext";
import { IVocabulary } from "@/types/notebook.type";
import React from "react";
import {
  ActivityIndicator,
  Image,
  Keyboard,
  Modal,
  Pressable,
  ScrollView,
  View,
} from "react-native";
import { Icon, Text } from "react-native-paper";

interface VocabCardProps {
  vocab: IVocabulary;
  onPress: () => void;
  isAdding?: boolean;
}

export const VocabCard: React.FC<VocabCardProps> = ({
  vocab,
  onPress,
  isAdding = false,
}) => {
  const { theme } = useThemeContext();
  const textColor = getTextColor(theme, "primary");
  const secondaryTextColor = getTextColor(theme, "secondary");
  console.log("Rendering VocabCard for:", vocab);

  return (
    <Pressable onPress={onPress} disabled={isAdding}>
      <CardCustom
        variant="card"
        padding="md"
        style={{
          marginBottom: DesignSystem.spacing.sm,
          borderRadius: DesignSystem.borderRadius.lg,
          opacity: isAdding ? 0.6 : 1,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: DesignSystem.spacing.md,
          }}
        >
          {vocab.image_url && (
            <Image
              source={{ uri: vocab.image_url }}
              style={{
                width: 40,
                height: 40,
                borderRadius: DesignSystem.borderRadius.md,
              }}
              resizeMode="cover"
            />
          )}

          <View style={{ flex: 1 }}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: DesignSystem.spacing.sm,
              }}
            >
              <Text
                style={{
                  fontSize: DesignSystem.typography.fontSize.lg,
                  fontWeight: DesignSystem.typography.fontWeight.bold,
                  color: textColor,
                }}
              >
                {vocab.hanzi}
              </Text>
              <Text
                style={{
                  fontSize: DesignSystem.typography.fontSize.sm,
                  color: secondaryTextColor,
                }}
              >
                {vocab.pinyin}
              </Text>
            </View>

            <Text
              style={{
                fontSize: DesignSystem.typography.fontSize.base,
                color: textColor,
                marginTop: DesignSystem.spacing.xs,
              }}
              numberOfLines={1}
            >
              {vocab.meaning}
            </Text>
          </View>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: DesignSystem.spacing.sm,
            }}
          >
            {isAdding ? (
              <ActivityIndicator size="small" color={textColor} />
            ) : (
              <Icon
                source="chevron-right"
                size={20}
                color={secondaryTextColor}
              />
            )}
          </View>
        </View>
      </CardCustom>
    </Pressable>
  );
};

interface VocabDetailModalProps {
  visible: boolean;
  vocab: IVocabulary | null;
  onClose: () => void;
  onAddToNotebook: (vocabId: string) => void;
  isAddingVocab: string | null;
}

export const VocabDetailModal: React.FC<VocabDetailModalProps> = ({
  visible,
  vocab,
  onClose,
  onAddToNotebook,
  isAddingVocab,
}) => {
  const { theme } = useThemeContext();
  const { t } = useLanguageContext();
  const textColor = getTextColor(theme, "primary");
  const secondaryTextColor = getTextColor(theme, "secondary");
  const scrollViewRef = React.useRef<ScrollView>(null);

  if (!vocab) return null;

  const handleClose = () => {
    if (!isAddingVocab) {
      // Reset scroll position before closing
      scrollViewRef.current?.scrollTo({ y: 0, animated: false });
      onClose();
    }
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={handleClose}
      presentationStyle="overFullScreen"
      hardwareAccelerated={true}
    >
      <View
        style={{
          flex: 1,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          justifyContent: "flex-end",
        }}
      >
        {/* Background overlay - only tappable at top */}
        <Pressable style={{ flex: 1 }} onPress={handleClose} />

        {/* Modal content - stops propagation */}
        <View
          style={{
            backgroundColor: theme === "light" ? "#FFF" : "#1E1E1E",
            borderTopLeftRadius: DesignSystem.borderRadius.xl,
            borderTopRightRadius: DesignSystem.borderRadius.xl,
            minHeight: "60%",
            maxHeight: "90%",
            width: "100%",
            paddingBottom: 20,
          }}
        >
          {/* Drag handle */}
          <View
            style={{
              alignItems: "center",
              paddingVertical: DesignSystem.spacing.sm,
            }}
          >
            <View
              style={{
                width: 40,
                height: 4,
                backgroundColor: theme === "light" ? "#E5E5E5" : "#404040",
                borderRadius: 2,
              }}
            />
          </View>

          {/* Header */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              paddingHorizontal: DesignSystem.spacing.lg,
              paddingBottom: DesignSystem.spacing.md,
            }}
          >
            <Text
              style={{
                fontSize: DesignSystem.typography.fontSize.xl,
                fontWeight: DesignSystem.typography.fontWeight.bold,
                color: textColor,
              }}
            >
              {t("vocabDetails")}
            </Text>
            <Pressable
              onPress={handleClose}
              disabled={!!isAddingVocab}
              style={{
                padding: DesignSystem.spacing.sm,
                borderRadius: DesignSystem.borderRadius.md,
                opacity: isAddingVocab ? 0.5 : 1,
              }}
            >
              <Icon source="close" size={24} color={secondaryTextColor} />
            </Pressable>
          </View>

          {/* Scrollable content */}
          <ScrollView
            ref={scrollViewRef}
            style={{ flex: 1 }}
            contentContainerStyle={{
              paddingHorizontal: DesignSystem.spacing.lg,
              paddingBottom: DesignSystem.spacing.xxl,
            }}
            showsVerticalScrollIndicator={false}
            bounces={true}
            scrollEventThrottle={16}
            nestedScrollEnabled={true}
          >
            {vocab.image_url && (
              <View style={{ marginBottom: DesignSystem.spacing.lg }}>
                <Image
                  source={{ uri: vocab.image_url }}
                  style={{
                    width: "100%",
                    height: 200,
                    borderRadius: DesignSystem.borderRadius.md,
                  }}
                  resizeMode="cover"
                />
              </View>
            )}

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: DesignSystem.spacing.sm,
                marginBottom: DesignSystem.spacing.md,
              }}
            >
              <Text
                style={{
                  fontSize: DesignSystem.typography.fontSize.xxxl,
                  fontWeight: DesignSystem.typography.fontWeight.bold,
                  color: textColor,
                }}
              >
                {vocab.hanzi}
              </Text>
              <Text
                style={{
                  fontSize: DesignSystem.typography.fontSize.lg,
                  color: secondaryTextColor,
                }}
              >
                {vocab.pinyin}
              </Text>
            </View>

            <Text
              style={{
                fontSize: DesignSystem.typography.fontSize.lg,
                color: textColor,
                marginBottom: DesignSystem.spacing.lg,
              }}
            >
              {vocab.meaning}
            </Text>

            {vocab.word_types && vocab.word_types.length > 0 && (
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: DesignSystem.spacing.xs,
                  marginBottom: DesignSystem.spacing.lg,
                }}
              >
                <Text
                  style={{
                    fontSize: DesignSystem.typography.fontSize.sm,
                    color: secondaryTextColor,
                    fontWeight: DesignSystem.typography.fontWeight.medium,
                  }}
                >
                  {t("wordType")}:
                </Text>
                {vocab.word_types.map((type) => (
                  <View
                    key={type}
                    style={{
                      backgroundColor:
                        theme === "light" ? "#f3f4f6" : "#374151",
                      paddingHorizontal: DesignSystem.spacing.sm,
                      paddingVertical: DesignSystem.spacing.xs,
                      borderRadius: DesignSystem.borderRadius.sm,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: DesignSystem.typography.fontSize.sm,
                        color: textColor,
                        fontWeight: DesignSystem.typography.fontWeight.medium,
                      }}
                    >
                      {type}
                    </Text>
                  </View>
                ))}
              </View>
            )}

            {vocab.notes && (
              <View
                style={{
                  gap: DesignSystem.spacing.xs,
                  marginBottom: DesignSystem.spacing.lg,
                }}
              >
                <Text
                  style={{
                    fontSize: DesignSystem.typography.fontSize.base,
                    color: secondaryTextColor,
                    fontWeight: DesignSystem.typography.fontWeight.medium,
                  }}
                >
                  {t("note")}:
                </Text>
                <Text
                  style={{
                    fontSize: DesignSystem.typography.fontSize.base,
                    color: secondaryTextColor,
                    fontStyle: "italic",
                    lineHeight: DesignSystem.typography.fontSize.base * 1.4,
                  }}
                >
                  {vocab.notes.split("\r\n").map((line, index) => (
                    <Text key={index}>
                      {line}
                      {index < vocab.notes!.split("\r\n").length - 1 && "\n"}
                    </Text>
                  ))}
                </Text>
              </View>
            )}

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: DesignSystem.spacing.xs,
                marginBottom: DesignSystem.spacing.xl,
              }}
            >
              {vocab.level.map((level) => (
                <View
                  key={level}
                  style={{
                    backgroundColor: theme === "light" ? "#e3f2fd" : "#1e3a8a",
                    paddingHorizontal: DesignSystem.spacing.sm,
                    paddingVertical: DesignSystem.spacing.xs,
                    borderRadius: DesignSystem.borderRadius.sm,
                  }}
                >
                  <Text
                    style={{
                      fontSize: DesignSystem.typography.fontSize.sm,
                      color: theme === "light" ? "#1565c0" : "#93c5fd",
                      fontWeight: DesignSystem.typography.fontWeight.medium,
                    }}
                  >
                    {level}
                  </Text>
                </View>
              ))}
            </View>

            <ButtonCustom
              title={isAddingVocab === vocab.id ? t("searching") : t("add")}
              onPress={() => {
                onAddToNotebook(vocab.id);
                handleClose();
              }}
              startColors={getColorAtived(theme)}
              endColors={getColorAtived(theme)}
              size="md"
              fullWidth
              disabled={isAddingVocab === vocab.id}
              icon={
                isAddingVocab === vocab.id ? (
                  <ActivityIndicator size="small" color="#FFF" />
                ) : (
                  <Icon source="plus" size={16} color="#FFF" />
                )
              }
              textStyle={{ color: "#fff" }}
              style={{
                marginTop: DesignSystem.spacing.md,
                opacity: isAddingVocab === vocab.id ? 0.7 : 1,
              }}
            />
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

interface SearchResultsProps {
  searchQuery: string;
  isSearching: boolean;
  searchResults: IVocabulary[];
  onAddToNotebook: (vocabId: string) => void;
  isAddingVocab: string | null;
}

export const SearchResults: React.FC<SearchResultsProps> = ({
  searchQuery,
  isSearching,
  searchResults,
  onAddToNotebook,
  isAddingVocab,
}) => {
  const [selectedVocab, setSelectedVocab] = React.useState<IVocabulary | null>(
    null
  );
  const [showModal, setShowModal] = React.useState(false);

  const { theme } = useThemeContext();
  const textColor = getTextColor(theme, "primary");
  const secondaryTextColor = getTextColor(theme, "secondary");
  const { t } = useLanguageContext();

  const handleOpenModal = (vocab: IVocabulary) => {
    // Dismiss keyboard before opening modal
    Keyboard.dismiss();
    setSelectedVocab(vocab);
    // Small delay to ensure keyboard is dismissed
    setTimeout(() => {
      setShowModal(true);
    }, 100);
  };

  if (searchQuery.trim().length === 0) {
    return null;
  }

  if (isSearching) {
    return (
      <CardCustom
        variant="card"
        padding="lg"
        style={{
          marginBottom: DesignSystem.spacing.md,
          borderRadius: DesignSystem.borderRadius.lg,
          alignItems: "center",
        }}
      >
        <ActivityIndicator size="large" color={textColor} />
        <Text
          style={{
            marginTop: DesignSystem.spacing.sm,
            color: secondaryTextColor,
            fontSize: DesignSystem.typography.fontSize.sm,
          }}
        >
          {t("searching")}
        </Text>
      </CardCustom>
    );
  }

  if (searchResults.length === 0) {
    return (
      <CardCustom
        variant="card"
        padding="lg"
        style={{
          marginBottom: DesignSystem.spacing.md,
          borderRadius: DesignSystem.borderRadius.lg,
          alignItems: "center",
        }}
      >
        <Icon source="magnify-close" size={48} color={secondaryTextColor} />
        <Text
          style={{
            marginTop: DesignSystem.spacing.sm,
            color: secondaryTextColor,
            fontSize: DesignSystem.typography.fontSize.sm,
            textAlign: "center",
          }}
        >
          {t("noVocabFound")}
          {"\n"}
        </Text>
      </CardCustom>
    );
  }

  return (
    <>
      <View style={{ marginBottom: DesignSystem.spacing.md }}>
        <Text
          style={{
            fontSize: DesignSystem.typography.fontSize.lg,
            fontWeight: DesignSystem.typography.fontWeight.bold,
            color: textColor,
            marginBottom: DesignSystem.spacing.md,
          }}
        >
          {t("searchResultsLabel")} ({searchResults.length})
        </Text>
        {searchResults.map((vocab) => (
          <VocabCard
            key={vocab.id}
            vocab={vocab}
            isAdding={isAddingVocab === vocab.id}
            onPress={() => handleOpenModal(vocab)}
          />
        ))}
      </View>
      <VocabDetailModal
        visible={showModal}
        vocab={selectedVocab}
        onClose={() => setShowModal(false)}
        onAddToNotebook={onAddToNotebook}
        isAddingVocab={isAddingVocab}
      />
    </>
  );
};
