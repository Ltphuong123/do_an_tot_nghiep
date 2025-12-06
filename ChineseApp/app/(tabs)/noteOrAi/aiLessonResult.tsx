import { ButtonCustom } from "@/components/shared/buttonCustom";
import { CardCustom } from "@/components/shared/cardCustom";
import {
  DesignSystem,
  getBackgroundColor,
  getColorAtived,
  getSolidColor,
  getTextColor,
} from "@/constants/designSystem";
import { useLanguageContext } from "@/contexts/languageContext";
import { useThemeContext } from "@/contexts/themeContext";
import { CreateLessonAiPayload } from "@/types/createLessonAi.types";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as Speech from "expo-speech";
import React, { useState } from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { Icon, Text } from "react-native-paper";

type TabType = "vocabularies" | "phrases" | "tips" | "dialogues";

export default function AILessonResultPage() {
  const router = useRouter();
  const params = useLocalSearchParams();

  // Parse lesson data from params
  const data: CreateLessonAiPayload = JSON.parse(params.data as string);

  const { theme } = useThemeContext();
  const { t } = useLanguageContext();
  const [activeTab, setActiveTab] = useState<TabType>("vocabularies");
  const [expandedItems, setExpandedItems] = useState<{
    vocabularies: Set<number>;
    phrases: Set<number>;
    tips: Set<number>;
    dialogues: Set<number>;
  }>({
    vocabularies: new Set(),
    phrases: new Set(),
    tips: new Set(),
    dialogues: new Set(),
  });
  const [speakingId, setSpeakingId] = useState<string | null>(null);

  const textColor = getTextColor(theme, "primary");
  const secondaryTextColor = getTextColor(theme, "secondary");
  const primaryBg = getBackgroundColor(theme, "primary");

  const tabs = [
    {
      key: "vocabularies",
      label: t("vocabularies"),
      icon: "book-open-outline",
      count: data.vocabularies.length,
    },
    {
      key: "phrases",
      label: t("phrases"),
      icon: "text-box-outline",
      count: data.phrases.length,
    },
    {
      key: "tips",
      label: t("tips"),
      icon: "lightbulb-outline",
      count: data.tips.length,
    },
    {
      key: "dialogues",
      label: t("dialogues"),
      icon: "chat-outline",
      count: data.dialogues.length,
    },
  ];

  const speakText = async (text: string, id: string) => {
    if (speakingId === id) return;

    setSpeakingId(id);
    Speech.speak(text, {
      language: "zh-CN",
      rate: 0.8,
      onDone: () => setSpeakingId(null),
      onError: () => setSpeakingId(null),
    });
  };

  const toggleExpanded = (index: number, tab: TabType = activeTab) => {
    setExpandedItems((prev) => {
      const newExpanded = { ...prev };
      const currentSet = new Set(prev[tab]);

      if (currentSet.has(index)) {
        currentSet.delete(index);
      } else {
        currentSet.add(index);
      }

      newExpanded[tab] = currentSet;
      return newExpanded;
    });
  };

  const handleStartRevision = () => {
    router.push({
      pathname: "/(tabs)/noteOrAi/aiLessonRevision",
      params: { data: JSON.stringify(data) },
    });
  };

  const handleBack = () => {
    router.back();
  };

  const renderVocabularies = () => (
    <View style={styles.contentContainer}>
      {data.vocabularies.map((item, index) => (
        <CardCustom
          key={index}
          variant="card"
          padding="md"
          style={styles.itemCard}
        >
          <View style={styles.itemHeader}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.chineseText, { color: textColor }]}>
                {item.hanzi}
              </Text>
              <Text style={[styles.pinyinText, { color: secondaryTextColor }]}>
                {item.pinyin}
              </Text>
            </View>
            <View style={styles.actionButtons}>
              <Pressable
                style={[
                  styles.actionButton,
                  {
                    backgroundColor:
                      speakingId === `vocab-${index}` ? "#4CAF50" : "#4A90E2",
                  },
                ]}
                onPress={() => speakText(item.hanzi, `vocab-${index}`)}
              >
                <Icon
                  source={
                    speakingId === `vocab-${index}` ? "stop" : "volume-high"
                  }
                  size={20}
                  color="#FFFFFF"
                />
              </Pressable>
              <Pressable
                style={[
                  styles.actionButton,
                  {
                    backgroundColor: expandedItems.vocabularies.has(index)
                      ? "#FF9800"
                      : "#9E9E9E",
                  },
                ]}
                onPress={() => toggleExpanded(index, "vocabularies")}
              >
                <Icon
                  source={
                    expandedItems.vocabularies.has(index) ? "eye-off" : "eye"
                  }
                  size={20}
                  color="#FFFFFF"
                />
              </Pressable>
            </View>
          </View>
          {expandedItems.vocabularies.has(index) && (
            <View style={styles.meaningContainer}>
              <Text style={[styles.meaningText, { color: textColor }]}>
                {item.meaning}
              </Text>
            </View>
          )}
        </CardCustom>
      ))}
    </View>
  );

  const renderPhrases = () => (
    <View style={styles.contentContainer}>
      {data.phrases.map((item, index) => (
        <CardCustom
          key={index}
          variant="card"
          padding="md"
          style={styles.itemCard}
        >
          <View style={styles.itemHeader}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.chineseText, { color: textColor }]}>
                {item.text}
              </Text>
              <Text style={[styles.pinyinText, { color: secondaryTextColor }]}>
                {item.pinyin}
              </Text>
            </View>
            <View style={styles.actionButtons}>
              <Pressable
                style={[
                  styles.actionButton,
                  {
                    backgroundColor:
                      speakingId === `phrase-${index}` ? "#4CAF50" : "#4A90E2",
                  },
                ]}
                onPress={() => speakText(item.text, `phrase-${index}`)}
              >
                <Icon
                  source={
                    speakingId === `phrase-${index}` ? "stop" : "volume-high"
                  }
                  size={20}
                  color="#FFFFFF"
                />
              </Pressable>
              <Pressable
                style={[
                  styles.actionButton,
                  {
                    backgroundColor: expandedItems.phrases.has(index)
                      ? "#FF9800"
                      : "#9E9E9E",
                  },
                ]}
                onPress={() => toggleExpanded(index, "phrases")}
              >
                <Icon
                  source={expandedItems.phrases.has(index) ? "eye-off" : "eye"}
                  size={20}
                  color="#FFFFFF"
                />
              </Pressable>
            </View>
          </View>
          {expandedItems.phrases.has(index) && (
            <View style={styles.meaningContainer}>
              <Text style={[styles.meaningText, { color: textColor }]}>
                {item.meaning}
              </Text>
            </View>
          )}
        </CardCustom>
      ))}
    </View>
  );

  const renderTips = () => (
    <View style={styles.contentContainer}>
      {data.tips.map((item, index) => (
        <CardCustom
          key={index}
          variant="card"
          padding="md"
          style={styles.itemCard}
        >
          <View style={styles.tipItem}>
            <Icon source="lightbulb" size={24} color="#FFC107" />
            <View style={{ flex: 1, marginLeft: DesignSystem.spacing.sm }}>
              <Text style={[styles.tipVietnamese, { color: textColor }]}>
                {item.vietnamese}
              </Text>
              <Text style={[styles.tipChinese, { color: secondaryTextColor }]}>
                {item.chinese}
              </Text>
            </View>
          </View>
        </CardCustom>
      ))}
    </View>
  );

  const renderDialogues = () => (
    <View style={styles.contentContainer}>
      {data.dialogues.map((dialogue, dialogueIndex) => (
        <CardCustom
          key={dialogueIndex}
          variant="card"
          padding="md"
          style={styles.itemCard}
        >
          <Text style={[styles.dialogueTitle, { color: textColor }]}>
            {t("conversation")} {dialogueIndex + 1}
          </Text>
          {dialogue.messages.map((message, messageIndex) => (
            <View
              key={messageIndex}
              style={[
                styles.messageContainer,
                message.speaker === "A" ? styles.speakerA : styles.speakerB,
              ]}
            >
              <View style={styles.messageHeader}>
                <Text style={[styles.speakerName, { color: textColor }]}>
                  {message.speaker === "A" ? t("seller") : t("buyer")}
                </Text>
                <Pressable
                  style={[
                    styles.actionButton,
                    {
                      backgroundColor:
                        speakingId ===
                        `dialogue-${dialogueIndex}-${messageIndex}`
                          ? "#4CAF50"
                          : "#4A90E2",
                      width: 32,
                      height: 32,
                    },
                  ]}
                  onPress={() =>
                    speakText(
                      message.text,
                      `dialogue-${dialogueIndex}-${messageIndex}`
                    )
                  }
                >
                  <Icon
                    source={
                      speakingId === `dialogue-${dialogueIndex}-${messageIndex}`
                        ? "stop"
                        : "volume-high"
                    }
                    size={16}
                    color="#FFFFFF"
                  />
                </Pressable>
              </View>
              <Text
                style={[
                  styles.chineseText,
                  {
                    color: textColor,
                    fontSize: DesignSystem.typography.fontSize.md,
                  },
                ]}
              >
                {message.text}
              </Text>
              <Text style={[styles.pinyinText, { color: secondaryTextColor }]}>
                {message.pinyin}
              </Text>
              {expandedItems.dialogues.has(
                dialogueIndex * 100 + messageIndex
              ) && (
                <Text style={[styles.vietnameseText, { color: textColor }]}>
                  {message.vietnamese}
                </Text>
              )}
              <Pressable
                style={styles.toggleMeaning}
                onPress={() =>
                  toggleExpanded(
                    dialogueIndex * 100 + messageIndex,
                    "dialogues"
                  )
                }
              >
                <Text
                  style={{
                    color: "#4A90E2",
                    fontSize: DesignSystem.typography.fontSize.sm,
                  }}
                >
                  {expandedItems.dialogues.has(
                    dialogueIndex * 100 + messageIndex
                  )
                    ? t("hideMeaning")
                    : t("showMeaning")}
                </Text>
              </Pressable>
            </View>
          ))}
        </CardCustom>
      ))}
    </View>
  );

  const renderContent = () => {
    switch (activeTab) {
      case "vocabularies":
        return renderVocabularies();
      case "phrases":
        return renderPhrases();
      case "tips":
        return renderTips();
      case "dialogues":
        return renderDialogues();
      default:
        return null;
    }
  };

  return (
    <View style={{ flex: 1 }}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: primaryBg }]}>
        <Pressable style={styles.backButton} onPress={handleBack}>
          <Icon source="arrow-left" size={24} color={textColor} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: textColor }]}>
          {t("aiLesson")}
        </Text>
      </View>

      {/* Tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.tabContainer}
      >
        {tabs.map((tab) => (
          <Pressable
            key={tab.key}
            style={[
              styles.tab,
              activeTab === tab.key && {
                backgroundColor: getSolidColor(theme, "primary"),
              },
            ]}
            onPress={() => setActiveTab(tab.key as TabType)}
          >
            <Icon
              source={tab.icon as any}
              size={20}
              color={activeTab === tab.key ? "#FFFFFF" : textColor}
            />
            <Text
              style={[
                styles.tabLabel,
                { color: activeTab === tab.key ? "#FFFFFF" : textColor },
              ]}
            >
              {tab.label} ({tab.count})
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      {/* Content */}
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        {renderContent()}
      </ScrollView>

      {/* Revision Button */}
      <View style={styles.revisionContainer}>
        <ButtonCustom
          title={t("startRevision")}
          onPress={handleStartRevision}
          startColors={getColorAtived(theme)}
          endColors={getColorAtived(theme)}
          textStyle={{ color: "#fff" }}
          size="lg"
          icon={<Icon source="brain" size={20} color="#FFFFFF" />}
          fullWidth
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: DesignSystem.spacing.md,
    gap: DesignSystem.spacing.sm,
    marginTop: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: DesignSystem.typography.fontSize.xl,
    fontWeight: "700",
  },
  tabContainer: {
    maxHeight: 60,
    paddingHorizontal: DesignSystem.spacing.md,
    paddingVertical: DesignSystem.spacing.sm,
  },
  tab: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: DesignSystem.spacing.md,
    paddingVertical: DesignSystem.spacing.sm,
    marginRight: DesignSystem.spacing.sm,
    borderRadius: DesignSystem.borderRadius.lg,
    gap: DesignSystem.spacing.xs,
  },
  tabLabel: {
    fontSize: DesignSystem.typography.fontSize.sm,
    fontWeight: "600",
  },
  contentContainer: {
    padding: DesignSystem.spacing.md,
    gap: DesignSystem.spacing.sm,
  },
  itemCard: {
    marginBottom: DesignSystem.spacing.sm,
  },
  itemHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  chineseText: {
    fontSize: DesignSystem.typography.fontSize.lg,
    fontWeight: "700",
    marginBottom: DesignSystem.spacing.xs,
  },
  pinyinText: {
    fontSize: DesignSystem.typography.fontSize.sm,
    fontStyle: "italic",
  },
  meaningContainer: {
    marginTop: DesignSystem.spacing.sm,
    paddingTop: DesignSystem.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.1)",
  },
  meaningText: {
    fontSize: DesignSystem.typography.fontSize.md,
  },
  actionButtons: {
    flexDirection: "row",
    gap: DesignSystem.spacing.xs,
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  tipItem: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  tipVietnamese: {
    fontSize: DesignSystem.typography.fontSize.md,
    fontWeight: "600",
    marginBottom: DesignSystem.spacing.xs,
  },
  tipChinese: {
    fontSize: DesignSystem.typography.fontSize.sm,
    fontStyle: "italic",
  },
  dialogueTitle: {
    fontSize: DesignSystem.typography.fontSize.lg,
    fontWeight: "700",
    marginBottom: DesignSystem.spacing.md,
  },
  messageContainer: {
    marginBottom: DesignSystem.spacing.md,
    padding: DesignSystem.spacing.sm,
    borderRadius: DesignSystem.borderRadius.md,
  },
  speakerA: {
    backgroundColor: "rgba(74, 144, 226, 0.1)",
  },
  speakerB: {
    backgroundColor: "rgba(156, 39, 176, 0.1)",
  },
  messageHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: DesignSystem.spacing.xs,
  },
  speakerName: {
    fontSize: DesignSystem.typography.fontSize.sm,
    fontWeight: "600",
  },
  vietnameseText: {
    fontSize: DesignSystem.typography.fontSize.sm,
    marginTop: DesignSystem.spacing.xs,
  },
  toggleMeaning: {
    alignSelf: "flex-start",
    marginTop: DesignSystem.spacing.xs,
  },
  revisionContainer: {
    padding: DesignSystem.spacing.md,
    backgroundColor: "transparent",
  },
});
