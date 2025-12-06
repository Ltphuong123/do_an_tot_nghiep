import { ButtonCustom } from "@/components/shared/buttonCustom";
import { ContainerCustom } from "@/components/shared/containerCustom";
import { InputCustom } from "@/components/shared/inputCustom";
import {
    DesignSystem,
    getColorAtived,
    getTextColor,
} from "@/constants/designSystem";
import { useLanguageContext } from "@/contexts/languageContext";
import { useLoadingContext } from "@/contexts/loadingContext";
import { useSnackbar } from "@/contexts/snackbarContext";
import { useThemeContext } from "@/contexts/themeContext";
import { register } from "@/services/auth";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useEffect, useState } from "react";
import {
    Alert,
    BackHandler,
    ImageBackground,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    View,
} from "react-native";
import { Icon, Text } from "react-native-paper";

export default function RegisterScreen() {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [nameError, setNameError] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const background = require("@/assets/images/background_register.jpg");

  const router = useRouter();
  const { theme } = useThemeContext();
  const { startLoading, stopLoading, isLoading } = useLoadingContext();
  const { showSnackbar } = useSnackbar();

  const { t } = useLanguageContext();

  const textColor = getTextColor(theme, "primary");
  const secondaryTextColor = getTextColor(theme, "secondary");
  const [hasEverLoggedIn, setHasEverLoggedIn] = useState(false);

  // Kiểm tra hasEverLoggedIn
  useEffect(() => {
    const checkLoginHistory = async () => {
      const hasLoggedIn = await SecureStore.getItemAsync("hasEverLoggedIn");
      setHasEverLoggedIn(hasLoggedIn === "true");
    };
    checkLoginHistory();
  }, []);

  // Xử lý back button của điện thoại
  useEffect(() => {
    if (!hasEverLoggedIn) return;

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        Alert.alert(
          "Thoát ứng dụng",
          "Bạn có muốn thoát khỏi ứng dụng?",
          [
            { text: "Hủy", style: "cancel" },
            { text: "Thoát", onPress: () => BackHandler.exitApp() },
          ]
        );
        return true;
      }
    );

    return () => backHandler.remove();
  }, [hasEverLoggedIn]);

  const resetForm = () => {
    setName("");
    setUsername("");
    setPassword("");
    setEmail("");
    setConfirmPassword("");
    setUsernameError("");
    setPasswordError("");
    setConfirmPasswordError("");
    setNameError("");
  };

  const handleRegister = async () => {
    let valid = true;

    // Reset lỗi
    setUsernameError("");
    setPasswordError("");
    setConfirmPasswordError("");
    setNameError("");

    //kiem tra name
    if (!name) {
      setNameError(t("nameRequired"));
      valid = false;
    }

    // Kiểm tra username
    if (!username) {
      setUsernameError(t("usernameRequired"));
      valid = false;
    }

    // Kiểm tra password
    if (!password) {
      setPasswordError(t("passwordRequired"));
      valid = false;
    }

    // Kiểm tra confirm password
    if (confirmPassword !== password) {
      setConfirmPasswordError(t("passwordsDoNotMatch"));
      valid = false;
    }

    if (valid) {
      startLoading(t("creatingAccount"));

      try {
        const res = await register(name, username, password, email || null);

        if (res.success) {
          showSnackbar(t("registrationSuccess"), "success");
          resetForm();
          router.push("/auth/login" as any);
        } else {
          showSnackbar(t("registrationFailed"), "error");
        }
      } catch (error: any) {
        showSnackbar(error.message || t("registrationFailed"), "error");
      } finally {
        stopLoading();
      }
    }
  };

  const handleBack = () => {
    resetForm();
    // Chỉ cho phép back về intro nếu chưa từng đăng nhập
    if (!hasEverLoggedIn) {
      router.push("/intro?page=2" as any);
    }
  };

  return (
    <ContainerCustom variant="background" scrollable={false}>
      <ImageBackground
        source={background}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }}
        imageStyle={{ opacity: 0.1 }}
      />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}
      >
        {/* Back button - chỉ hiển nếu chưa từng đăng nhập */}
        {!hasEverLoggedIn && (
          <Pressable
            onPress={handleBack}
            style={{
              position: "absolute",
              top: Platform.OS === "ios" ? 14 : 14,
            left: DesignSystem.spacing.md,
            zIndex: 20,
            padding: DesignSystem.spacing.sm,
            borderRadius: 20,
            backgroundColor:
              theme === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)",
          }}
        >
          <Icon source="arrow-left" size={26} color={textColor} />
        </Pressable>
        )}

        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: "center",
            alignItems: "center",
            paddingVertical: DesignSystem.spacing.xxxl,
            paddingHorizontal: DesignSystem.spacing.md,
          }}
        >
          {/* Logo or Title */}
          <View
            style={{
              alignItems: "center",
              marginBottom: DesignSystem.spacing.lg,
            }}
          >
            <Text
              style={{
                fontSize: DesignSystem.typography.fontSize.xxxl,
                fontWeight: DesignSystem.typography.fontWeight.bold,
                color: textColor,
                marginBottom: DesignSystem.spacing.xs,
              }}
            >
              {t("register")}
            </Text>
          </View>

          {/* Input Fields */}
          <View
            style={{
              gap: DesignSystem.spacing.md,
              width: "90%",
            }}
          >
            <InputCustom
              value={name}
              onChangeText={(text: string) => {
                setName(text);
                nameError && setNameError("");
              }}
              placeholder={t("fullName")}
              leftIcon={
                <Icon
                  source="account-outline"
                  size={20}
                  color={secondaryTextColor}
                />
              }
              error={nameError}
              onFocus={() => setNameError("")}
            />

            <InputCustom
              value={username}
              onChangeText={(text: string) => {
                setUsername(text);
                usernameError && setUsernameError("");
              }}
              placeholder={t("username")}
              leftIcon={
                <Icon
                  source="account-circle"
                  size={20}
                  color={secondaryTextColor}
                />
              }
              error={usernameError}
              onFocus={() => setUsernameError("")}
            />

            <InputCustom
              value={email}
              onChangeText={(text: string) => {
                setEmail(text);
              }}
              placeholder={t("emailOptional")}
              leftIcon={
                <Icon
                  source="email-outline"
                  size={20}
                  color={secondaryTextColor}
                />
              }
            />

            <InputCustom
              value={password}
              onChangeText={(text: string) => {
                setPassword(text);
                passwordError && setPasswordError("");
              }}
              placeholder={t("password")}
              secureTextEntry={!showPassword}
              leftIcon={
                <Icon
                  source="lock-outline"
                  size={20}
                  color={secondaryTextColor}
                />
              }
              rightIcon={
                <Pressable onPress={() => setShowPassword(!showPassword)}>
                  <Icon
                    source={showPassword ? "eye" : "eye-off"}
                    size={24}
                    color={secondaryTextColor}
                  />
                </Pressable>
              }
              error={passwordError}
              onFocus={() => setPasswordError("")}
            />

            <InputCustom
              value={confirmPassword}
              onChangeText={(text: string) => {
                setConfirmPassword(text);
                confirmPasswordError && setConfirmPasswordError("");
              }}
              placeholder={t("confirmPassword")}
              secureTextEntry={!showConfirmPassword}
              leftIcon={
                <Icon
                  source="lock-check-outline"
                  size={20}
                  color={secondaryTextColor}
                />
              }
              rightIcon={
                <Pressable
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  <Icon
                    source={showConfirmPassword ? "eye" : "eye-off"}
                    size={24}
                    color={secondaryTextColor}
                  />
                </Pressable>
              }
              error={confirmPasswordError}
              onFocus={() => setConfirmPasswordError("")}
            />

            {/* Register Button */}
            <ButtonCustom
              title={isLoading ? t("processing") : t("register")}
              onPress={handleRegister}
              startColors={getColorAtived(theme)}
              endColors={getColorAtived(theme)}
              size="lg"
              fullWidth
              disabled={isLoading}
              loading={isLoading}
              style={{ marginTop: DesignSystem.spacing.sm }}
              textStyle={{ color: "#fff" }}
            />
          </View>

          {/* Login Link */}
          <View
            style={{
              marginTop: DesignSystem.spacing.lg,
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontSize: DesignSystem.typography.fontSize.base,
                color: secondaryTextColor,
              }}
            >
              {t("alreadyHaveAccount")}{" "}
              <Text
                style={{
                  fontWeight: DesignSystem.typography.fontWeight.bold,
                  color: theme === "dark" ? "#f093fb" : "#667eea",
                }}
                onPress={() => router.replace("/auth/login" as any)}
              >
                {t("loginNow")} {""}
              </Text>
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ContainerCustom>
  );
}
