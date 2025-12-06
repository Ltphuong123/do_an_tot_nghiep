/**
 * Cấu hình animation cho toàn bộ ứng dụng
 * Giúp đảm bảo animation nhất quán và mượt mà
 */

export const AnimationConfig = {
  // Thời gian animation chuẩn - tối ưu cho cảm giác mượt mà
  duration: {
    instant: 0, // Temporarily set to 0 to test if animations cause lag
    fast: 0,
    normal: 0,
    slow: 0,
    verySlow: 0,
  },

  // Spring animation config - tạo cảm giác tự nhiên
  spring: {
    speed: {
      veryFast: 60,
      fast: 45,
      normal: 20,
      slow: 12,
    },
    bounciness: {
      none: 0,
      minimal: 4,
      subtle: 8,
      normal: 12,
      bouncy: 18,
    },
    tension: {
      low: 40,
      medium: 65,
      high: 100,
    },
    friction: {
      low: 3,
      medium: 7,
      high: 10,
    },
  },

  // Easing curves - mượt mà và tự nhiên
  easing: {
    // Cubic bezier curves giống iOS
    easeOut: (t: number) => 1 - Math.pow(1 - t, 3),
    easeIn: (t: number) => Math.pow(t, 3),
    easeInOut: (t: number) =>
      t < 0.5 ? 4 * Math.pow(t, 3) : 1 - Math.pow(-2 * t + 2, 3) / 2,

    // Smooth curves
    smooth: (t: number) => t * t * (3 - 2 * t),

    // iOS-like curves
    iosEaseOut: (t: number) => {
      return 1 - Math.pow(1 - t, 4);
    },

    // Material Design curves
    materialStandard: (t: number) => {
      return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
    },
  },

  // Tab transition config - cực mượt
  tab: {
    animation: "shift" as const,
    duration: 0, // Temporarily disable tab animation to test lag
    lazy: true,
    // Thêm lazy preload để cải thiện UX
    detachInactiveScreens: true,
  },

  // Stack navigation config - mượt và đẹp
  stack: {
    slideFromRight: {
      animation: "slide_from_right" as const,
      duration: 0, // Temporarily disable stack animation
      gestureEnabled: true,
      gestureDirection: "horizontal" as const,
      fullScreenGestureEnabled: true,
    },
    slideFromBottom: {
      animation: "slide_from_bottom" as const,
      duration: 0,
      gestureEnabled: true,
      gestureDirection: "vertical" as const,
      fullScreenGestureEnabled: true,
    },

    fade: {
      animation: "fade" as const,
      duration: 0,
      gestureEnabled: true,
    },
    // Thêm iOS-like transition
    iosSlide: {
      animation: "ios" as const,
      duration: 0,
      gestureEnabled: true,
      gestureDirection: "horizontal" as const,
      fullScreenGestureEnabled: true,
    },
  },

  // Scale values cho tap effects - mượt hơn
  scale: {
    pressed: 0.96, // Nhẹ hơn để mượt
    pressedStrong: 0.92, // Cho button quan trọng
    active: 1.08, // Giảm để tránh quá bounce
    activeStrong: 1.12,
    normal: 1,
    hover: 1.02, // Cho web/tablet
  },

  // Opacity values cho fade effects
  opacity: {
    hidden: 0,
    transparent: 0.3,
    translucent: 0.6,
    semiVisible: 0.8,
    visible: 1,
  },

  // Blur values cho glassmorphism
  blur: {
    none: 0,
    light: 10,
    medium: 20,
    strong: 40,
  },

  // Shadow cho depth - phù hợp cả light/dark mode
  shadow: {
    light: {
      small: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.08,
        shadowRadius: 2,
        elevation: 2,
      },
      medium: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.12,
        shadowRadius: 4,
        elevation: 4,
      },
      large: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.16,
        shadowRadius: 8,
        elevation: 8,
      },
    },
    dark: {
      small: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.3,
        shadowRadius: 2,
        elevation: 2,
      },
      medium: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.4,
        shadowRadius: 4,
        elevation: 4,
      },
      large: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.5,
        shadowRadius: 8,
        elevation: 8,
      },
    },
  },
} as const;

export type AnimationConfigType = typeof AnimationConfig;
