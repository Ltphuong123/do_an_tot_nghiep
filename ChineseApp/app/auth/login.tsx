import { ButtonCustom } from "@/components/shared/buttonCustom";
import ConfirmModal from "@/components/shared/confirmModal";
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
import { clearTokens, setAccessToken, setRefreshToken } from "@/services";
import { login, loginWithGoogle } from "@/services/auth";
import { forgotPassword } from "@/services/profile";
import { getAppealsByViolation, getviolations } from "@/services/report";
import { useUserStore } from "@/store/useUserStore";
import {
  registerDeviceToken,
  setupTokenRefreshListener,
} from "@/utils/notificationHelper";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import Constants from "expo-constants";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import React, { useEffect, useState } from "react";
import {
  Alert,
  BackHandler,
  ImageBackground,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";
import { Icon, Text } from "react-native-paper";
export default function LoginScreen() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");
  const [forgotPasswordError, setForgotPasswordError] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isPasswordReset, setIsPasswordReset] = useState(false);
  const [isForgotPasswordLoading, setIsForgotPasswordLoading] = useState(false);
  const webClientId = Constants.expoConfig?.extra?.WEB_CLIENT_ID;

  const router = useRouter();
  const { theme } = useThemeContext();
  const { showSnackbar } = useSnackbar();
  const { startLoading, stopLoading } = useLoadingContext();

  const background = require("@/assets/images/background_login.jpg");

  const { t } = useLanguageContext();

  const textColor = getTextColor(theme, "primary");
  const secondaryTextColor = getTextColor(theme, "secondary");

  const { setUser, setBannedStatus, clearUser } = useUserStore();
  const [hasEverLoggedIn, setHasEverLoggedIn] = useState(false);

  // Configure Google Sign-In và kiểm tra hasEverLoggedIn
  useEffect(() => {
    GoogleSignin.configure({
      webClientId: webClientId,
      offlineAccess: true,
    });

    // Kiểm tra xem đã từng đăng nhập chưa
    const checkLoginHistory = async () => {
      const hasLoggedIn = await SecureStore.getItemAsync("hasEverLoggedIn");
      setHasEverLoggedIn(hasLoggedIn === "true");
    };
    checkLoginHistory();
  }, [webClientId]);

  // Xử lý back button của điện thoại
  useEffect(() => {
    if (!hasEverLoggedIn) return; // Nếu chưa từng login thì có thể back về intro

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        Alert.alert("Thoát ứng dụng", "Bạn có muốn thoát khỏi ứng dụng?", [
          { text: "Hủy", style: "cancel" },
          { text: "Thoát", onPress: () => BackHandler.exitApp() },
        ]);
        return true; // Ngăn chặn back mặc định
      }
    );

    return () => backHandler.remove();
  }, [hasEverLoggedIn]);

  const checkViolations = async () => {
    try {
      const violationsRes = await getviolations();
      const violations = violationsRes.data;

      // Find the most recent user ban violation
      const latestUserBan = violations
        .filter(
          (v) => v.target_type === "user" && v.resolution === "Cấm tài khoản"
        )
        .sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        )[0];

      if (!latestUserBan) {
        // No ban found, proceed to home
        router.replace("/(tabs)/home" as any);
        return;
      }

      // Check appeals for the ban
      const appealsRes = await getAppealsByViolation(latestUserBan.id);
      const appeals = appealsRes.data.sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );

      if (appeals.length === 0) {
        // No appeals, user is banned with no appeal
        setBannedStatus(true, "none", latestUserBan.id);
        router.replace("/home/profile" as any);
        return;
      }

      const latestAppeal = appeals[0];

      switch (latestAppeal.status) {
        case "accepted":
          // Appeal accepted, proceed to home
          router.replace("/(tabs)/home" as any);
          break;
        case "pending":
          // Appeal pending, show banned screen
          setBannedStatus(true, "pending", latestUserBan.id);
          router.replace("/home/profile" as any);
          break;
        case "rejected":
          // Appeal rejected, permanent ban
          await clearTokens();
          await clearUser();
          showSnackbar(t("accountPermanentlyBanned"), "error");
          break;
        default:
          // Unknown status, proceed to home as fallback
          router.replace("/(tabs)/home" as any);
      }
    } catch (error) {
      console.error("Error checking violations:", error);
      // On error, proceed to home as fallback
      router.replace("/(tabs)/home" as any);
    }
  };

  const handleLogin = async () => {
    let valid = true;
    setUsernameError("");
    setPasswordError("");

    if (!username) {
      setUsernameError(t("usernameRequired"));
      valid = false;
    }

    if (!password) {
      setPasswordError(t("passwordRequired"));
      valid = false;
    }

    if (valid) {
      Keyboard.dismiss(); // Dismiss keyboard before login attempt
      startLoading(t("loggingIn"));
      try {
        const res = await login(username, password);
        console.log("Login response:", res);
        if (res.token && res.token) {
          setAccessToken(res.token);
          setRefreshToken(res.refreshToken);
          setUser(res.user);

          // Đánh dấu đã từng đăng nhập
          await SecureStore.setItemAsync("hasEverLoggedIn", "true");

          // Register device token for push notification
          const token = await registerDeviceToken();
          console.log("Device token registered:", token);
          if (!token) {
            showSnackbar(
              "Không thể đăng ký thông báo push. Vui lòng kiểm tra quyền truy cập.",
              "warning"
            );
          }

          // Setup token refresh listener
          setupTokenRefreshListener();
          // Check violations before navigating
          await checkViolations();
        }
      } catch (error: any) {
        // Check error message to set specific field error
        if (error.message && error.message.includes("Tên đăng nhập")) {
          setUsernameError(error.message);
        } else if (error.message && error.message.includes("Mật khẩu")) {
          setPasswordError(error.message);
        } else {
          setUsernameError(error.message || t("loginFailed"));
        }
        showSnackbar(t("loginFailed"), "error");
      } finally {
        stopLoading();
      }
    }
  };

  const handleGoogleSignIn = async () => {
    Keyboard.dismiss(); // Dismiss keyboard before Google sign-in
    try {
      startLoading(t("loggingIn"));
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();

      if (userInfo.type === "success") {
        const { user } = userInfo.data;
        const res = await loginWithGoogle(
          user.email,
          user.name || "",
          user.photo || ""
        );
        console.log("Google login response:", res);
        if (res.user && res.token) {
          setUser(res.user);
          setAccessToken(res.token);
          setRefreshToken(res.refreshToken);

          // Đánh dấu đã từng đăng nhập
          await SecureStore.setItemAsync("hasEverLoggedIn", "true");

          // Register device token for push notification
          const token = await registerDeviceToken();
          console.log("Device token registered:", token);
          if (!token) {
            showSnackbar(
              "Không thể đăng ký thông báo push. Vui lòng kiểm tra quyền truy cập.",
              "warning"
            );
          }

          // Setup token refresh listener
          setupTokenRefreshListener();

          // Check violations before navigating
          await checkViolations();
        }
      }
    } catch (error: any) {
      if (error.code === "SIGN_IN_CANCELLED") {
        showSnackbar("Đã hủy đăng nhập", "info");
      } else if (error.code === "IN_PROGRESS") {
        showSnackbar(t("processing"), "info");
      } else if (error.code === "PLAY_SERVICES_NOT_AVAILABLE") {
        showSnackbar("Google Play Services không khả dụng", "error");
      } else {
        showSnackbar(error.message || "Đăng nhập Google thất bại", "error");
      }
    } finally {
      stopLoading();
    }
  };

  const handleBack = () => {
    setUsername("");
    setPassword("");
    setUsernameError("");
    setPasswordError("");

    // Chỉ cho phép back về intro nếu chưa từng đăng nhập
    if (!hasEverLoggedIn) {
      router.push("/intro?page=2" as any);
    }
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleForgotPassword = () => {
    setShowForgotPasswordModal(true);
    setForgotPasswordEmail("");
    setForgotPasswordError("");
    setNewPassword("");
    setIsPasswordReset(false);
  };

  const handleCloseForgotPasswordModal = () => {
    setShowForgotPasswordModal(false);
    setForgotPasswordEmail("");
    setForgotPasswordError("");
    setNewPassword("");
    setIsPasswordReset(false);
    setIsForgotPasswordLoading(false);
  };

  const handleSendForgotPassword = async () => {
    // Kiểm tra email
    if (!forgotPasswordEmail) {
      setForgotPasswordError("Vui lòng nhập email");
      return;
    }

    if (!validateEmail(forgotPasswordEmail)) {
      setForgotPasswordError("Email không đúng định dạng");
      return;
    }

    // Gọi API
    setIsForgotPasswordLoading(true);
    try {
      const res = await forgotPassword(forgotPasswordEmail);
      console.log("Forgot password response:", res);

      if (res.data && res.data.newPassword) {
        setNewPassword(res.data.newPassword);
        setIsPasswordReset(true);
      }
    } catch (error: any) {
      setForgotPasswordError(
        error.message || "Có lỗi xảy ra. Vui lòng thử lại."
      );
    } finally {
      setIsForgotPasswordLoading(false);
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
              zIndex: 1000,
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
            padding: DesignSystem.spacing.md,
          }}
        >
          {/* Logo or Title */}
          <View
            style={{
              marginBottom: DesignSystem.spacing.lg,
              alignItems: "center",
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
              {t("login")}
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
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Icon
                    source={showPassword ? "eye" : "eye-off"}
                    size={24}
                    color={secondaryTextColor}
                  />
                </TouchableOpacity>
              }
              error={passwordError}
              onFocus={() => setPasswordError("")}
            />

            {/* Login Button */}
            <ButtonCustom
              title={t("login")}
              onPress={handleLogin}
              startColors={getColorAtived(theme)}
              endColors={getColorAtived(theme)}
              size="lg"
              fullWidth
              style={{ marginTop: DesignSystem.spacing.sm }}
              textStyle={{ color: "#fff" }}
            />

            <Pressable
              style={{ alignItems: "center", marginTop: 8 }}
              onPress={handleForgotPassword}
            >
              <Text
                style={{
                  fontSize: DesignSystem.typography.fontSize.sm,
                  color: secondaryTextColor,
                  textAlign: "center",
                }}
              >
                {t("forgotPassword")}{" "}
              </Text>
            </Pressable>

            {/* Divider */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: DesignSystem.spacing.md,
                marginVertical: DesignSystem.spacing.md,
              }}
            >
              <View
                style={{
                  flex: 1,
                  height: 1,
                  backgroundColor:
                    theme === "dark"
                      ? "rgba(255,255,255,0.1)"
                      : "rgba(0,0,0,0.1)",
                }}
              />
              <Text
                style={{
                  fontSize: DesignSystem.typography.fontSize.sm,
                  color: secondaryTextColor,
                }}
              >
                {t("or")}
              </Text>
              <View
                style={{
                  flex: 1,
                  height: 1,
                  backgroundColor:
                    theme === "dark"
                      ? "rgba(255,255,255,0.1)"
                      : "rgba(0,0,0,0.1)",
                }}
              />
            </View>

            {/* Social Login */}
            <View
              style={{ flexDirection: "row", gap: DesignSystem.spacing.md }}
            >
              <Pressable
                style={{
                  flex: 1,
                  backgroundColor: "#fff",
                  borderWidth: 1,
                  borderColor: "#e5e7eb",
                  paddingVertical: DesignSystem.spacing.md,
                  borderRadius: DesignSystem.borderRadius.md,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: DesignSystem.spacing.sm,
                }}
                onPress={handleGoogleSignIn}
              >
                <Icon source="google" size={20} color="#DB4437" />
                <Text
                  style={{
                    fontSize: DesignSystem.typography.fontSize.sm,
                    color: "#DB4437",
                    fontWeight: DesignSystem.typography.fontWeight.medium,
                  }}
                >
                  {t("google")}
                </Text>
              </Pressable>
            </View>
          </View>

          {/* Register Link */}
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
              {t("noAccount")}{" "}
              <Text
                style={{
                  fontWeight: DesignSystem.typography.fontWeight.bold,
                  color: theme === "dark" ? "#f093fb" : "#667eea",
                }}
                onPress={() => router.replace("/auth/register" as any)}
              >
                {t("registerNow")} {""}
              </Text>
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Forgot Password Modal */}
      {!isPasswordReset ? (
        <ConfirmModal
          visible={showForgotPasswordModal}
          onRequestClose={handleCloseForgotPasswordModal}
          onConfirm={handleSendForgotPassword}
          onCancel={handleCloseForgotPasswordModal}
          title="Quên mật khẩu"
          confirmText="Gửi"
          cancelText="Hủy"
          icon="email"
          iconColor="#4A90E2"
          variant="form"
          inputValue={forgotPasswordEmail}
          onInputChange={(value: string) => {
            setForgotPasswordEmail(value);
            if (forgotPasswordError) setForgotPasswordError("");
          }}
          inputPlaceholder="Nhập địa chỉ email của bạn"
          inputError={forgotPasswordError}
          isLoading={isForgotPasswordLoading}
        />
      ) : (
        <ConfirmModal
          visible={showForgotPasswordModal}
          onRequestClose={handleCloseForgotPasswordModal}
          onConfirm={handleCloseForgotPasswordModal}
          title="Mật khẩu mới"
          message="Mật khẩu của bạn đã được cập nhật"
          confirmText="Đóng"
          icon="check-circle"
          iconColor="#4CAF50"
          variant="form"
          inputValue={newPassword}
          onInputChange={() => {}}
          inputPlaceholder=""
          hideCancel={true}
          isPasswordInput={true}
          inputEditable={false}
        />
      )}
    </ContainerCustom>
  );
}
