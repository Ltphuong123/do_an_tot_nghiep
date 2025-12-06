import { DesignSystem } from "@/constants/designSystem";
// loading/snackbar handled elsewhere when needed
import { ContainerCustom } from "@/components/shared/containerCustom";
import { useLanguageContext } from "@/contexts/languageContext";
import { useSnackbar } from "@/contexts/snackbarContext";
import { useThemeContext } from "@/contexts/themeContext";
import { uploadCloudinary } from "@/hooks/useCloudinaryUpload";
import { useCreatePost, useEditPost } from "@/hooks/usePost";
import { IPost } from "@/types/post.type";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import GuidelinesCard from "./components/GuidelinesCard";
import Header from "./components/Header";
import MediaUpload from "./components/MediaUpload";
import RichEditorSection from "./components/RichEditorSection";
import TitleInput from "./components/TitleInput";
import TopicSelector from "./components/TopicSelector";

const CreatePostScreen = () => {
  const { theme } = useThemeContext();
  const { t } = useLanguageContext();
  const { data } = useLocalSearchParams();
  const postEditData: IPost | null =
    typeof data === "string" && data ? JSON.parse(data) : null;
  const router = useRouter();

  const topics = [
    { key: "Cơ khí", label: t("topic_mechanics") },
    { key: "CNTT", label: t("topic_it") },
    { key: "Dịch", label: t("topic_translation") },
    { key: "Du học", label: t("topic_study_abroad") },
    { key: "Du lịch", label: t("topic_travel") },
    { key: "Góc chia sẻ", label: t("topic_sharing") },
    { key: "Tìm bạn học chung", label: t("topic_find_study_buddy") },
    { key: "Học tiếng Trung", label: t("topic_study_chinese") },
    { key: "Tìm gia sư", label: t("topic_find_tutor") },
    { key: "Việc làm", label: t("topic_jobs") },
    { key: "Văn hóa", label: t("topic_culture") },
    { key: "Thể thao", label: t("topic_sports") },
    { key: "Xây dựng", label: t("topic_construction") },
    { key: "Y tế", label: t("topic_health") },
    { key: "Tâm sự", label: t("topic_confessions") },
    { key: "Khác", label: t("topic_other") },
  ];

  const [title, setTitle] = useState<string>(
    postEditData ? postEditData.title : ""
  );
  const [content, setContent] = useState(
    postEditData ? postEditData.content.html : ""
  );
  const [selectedTopic, setSelectedTopic] = useState<string>(
    postEditData
      ? topics.find((t) => t.label === postEditData.topic)?.key || ""
      : ""
  );
  const [images, setImages] = useState<string[]>(
    postEditData ? postEditData.content.images : []
  );
  const richText = React.useRef<any>(null);
  const scrollRef = React.useRef<ScrollView>(null);
  // Thêm hàm xử lý cuộn theo vị trí con trỏ
  const handleCursorPosition = (scrollY: number) => {
    // scrollY là vị trí Y của con trỏ trong RichEditor
    // Cuộn ScrollView sao cho con trỏ luôn hiển thị
    scrollRef.current?.scrollTo({
      y: scrollY - 30, // 30 là offset để không bị che bởi toolbar hoặc header
      animated: true,
    });
  };

  const { showSnackbar } = useSnackbar();

  // React Query mutations
  const createPostMutation = useCreatePost();
  const editPostMutation = useEditPost();

  const pickImage = async (replaceIndex?: number) => {
    if (images.length >= 4 && typeof replaceIndex !== "number") {
      showSnackbar("Chỉ được tải lên tối đa 4 ảnh", "error");
      return;
    }

    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      alert(t("galleryPermissionRequired"));
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      try {
        const url = await uploadCloudinary(result.assets[0]);
        if (typeof replaceIndex === "number") {
          // replace existing image
          setImages((prev) =>
            prev.map((v, i) => (i === replaceIndex ? url : v))
          );
        } else {
          setImages((prev) => [...prev, url]);
        }
      } catch (error) {
        showSnackbar(
          "Upload ảnh thất bại: " + (error as Error).message,
          "error"
        );
      }
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    // Ensure rich editor is blurred first — some editors (webview-based) can keep
    // the keyboard active or refocus during navigation. Blurring prevents that.
    richText.current?.blurContentEditor?.();
    Keyboard.dismiss();

    if (postEditData != null) {
      editPostMutation.mutate(
        {
          postId: postEditData.id,
          title,
          topic: selectedTopic,
          html: content,
          images,
        },
        {
          onSuccess: (data) => {
            if (data.success) {
              showSnackbar(data.message || t("createPostSuccess"), "success");
              // showSnackbar("Sửa bài thành công", "success");
              // small delay to avoid editor/webview re-focusing during navigation
              setTimeout(() => router.replace("/(tabs)/community"), 120);
            }
          },
          onError: (error: any) => {
            showSnackbar(error.message || t("createPostFailed"), "error");
          },
        }
      );
    } else {
      createPostMutation.mutate(
        {
          title,
          topic: selectedTopic,
          html: content,
          images,
        },
        {
          onSuccess: (data) => {
            if (data.success) {
              showSnackbar(data.message || t("createPostSuccess"), "success");
              // small delay to avoid editor/webview re-focusing during navigation
              setTimeout(() => router.replace("/(tabs)/community"), 120);
            }
          },
          onError: (error: any) => {
            showSnackbar(error.message || t("createPostFailed"), "error");
          },
        }
      );
    }
  };

  const canSubmit = content.trim().length > 0;
  const isLoading = createPostMutation.isPending || editPostMutation.isPending;

  return (
    <ContainerCustom variant="background" scrollable={false}>
      <Header
        theme={theme}
        onBack={() => {
          richText.current?.blurContentEditor?.();
          Keyboard.dismiss();
          setTimeout(() => router.replace("/(tabs)/community"), 120);
        }}
        onSubmit={handleSubmit}
        canSubmit={!!canSubmit}
        loading={isLoading}
      />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          ref={scrollRef}
          style={{ flex: 1 }}
          contentContainerStyle={{
            padding: DesignSystem.spacing.md,
            gap: DesignSystem.spacing.lg,
          }}
          showsVerticalScrollIndicator={true}
          keyboardShouldPersistTaps="handled"
        >
          <TitleInput theme={theme} title={title} setTitle={setTitle} />

          <RichEditorSection
            theme={theme}
            content={content}
            setContent={setContent}
            richText={richText}
            onCursorPosition={handleCursorPosition}
          />

          <TopicSelector
            theme={theme}
            topics={topics}
            selectedTopic={selectedTopic}
            setSelectedTopic={setSelectedTopic}
          />

          <MediaUpload
            theme={theme}
            images={images}
            onPickImage={() => pickImage()}
            onEditImage={(index: number) => pickImage(index)}
            onRemoveImage={(index: number) => removeImage(index)}
          />

          <GuidelinesCard theme={theme} />
        </ScrollView>
      </KeyboardAvoidingView>
    </ContainerCustom>
  );
};

export default CreatePostScreen;
