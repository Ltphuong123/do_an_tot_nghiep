import { CardCustom } from "@/components/shared/cardCustom";
import { useLanguageContext } from "@/contexts/languageContext";
import { router } from "expo-router";
import { Pressable, View } from "react-native";
import { Icon, Text } from "react-native-paper";

const Action = ({
  noteId,
  isFromAdminBool,
  newNoteId,
}: {
  noteId: string;
  isFromAdminBool: boolean;
  newNoteId?: string;
}) => {
  const { t } = useLanguageContext();
  return (
    <View style={{ paddingHorizontal: 16, paddingVertical: 16, gap: 12 }}>
      <View style={{ flexDirection: "row", gap: 12 }}>
        <CardCustom variant="card" style={{ flex: 1 }}>
          <Pressable
            onPress={() =>
              router.push({
                pathname: "/notebookDetail/revision",
                params: {
                  notebookId: noteId,
                  isFromAdmin: isFromAdminBool.toString(),
                  newNoteId: newNoteId ? newNoteId : undefined,
                },
              })
            }
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Text>{t("reviewVocab")}</Text>
            <Icon source="book-open-variant" size={20} />
          </Pressable>
        </CardCustom>
        <CardCustom variant="card" style={{ flex: 1 }}>
          <Pressable
            onPress={() =>
              router.push({
                pathname: "/notebookDetail/wordFill",
                params: {
                  notebookId: noteId,
                  isFromAdmin: isFromAdminBool.toString(),
                  newNoteId: newNoteId ? newNoteId : undefined,
                },
              })
            }
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Text>{t("practiceNow")}</Text>
            <Icon source="pencil" size={20} />
          </Pressable>
        </CardCustom>
      </View>
      <View style={{ flexDirection: "row", gap: 12 }}>
        <CardCustom variant="card" style={{ flex: 1 }}>
          <Pressable
            onPress={() =>
              router.push({
                pathname: "/notebookDetail/pronunciation",
                params: {
                  notebookId: noteId,
                  isFromAdmin: isFromAdminBool.toString(),
                  newNoteId: newNoteId ? newNoteId : undefined,
                },
              })
            }
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Text>{t("pronunciation")}</Text>
            <Icon source="microphone" size={20} />
          </Pressable>
        </CardCustom>
        <CardCustom variant="card" style={{ flex: 1 }}>
          <Pressable
            onPress={() =>
              router.push({
                pathname: "/notebookDetail/flashcard",
                params: {
                  notebookId: noteId,
                  isFromAdmin: isFromAdminBool.toString(),
                  newNoteId: newNoteId ? newNoteId : undefined,
                },
              })
            }
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Text>{t("flashcard")}</Text>
            <Icon source="cards-playing-outline" size={20} />
          </Pressable>
        </CardCustom>
      </View>
    </View>
  );
};

export default Action;
