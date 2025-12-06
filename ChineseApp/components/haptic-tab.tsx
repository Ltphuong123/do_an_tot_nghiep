import { BottomTabBarButtonProps } from '@react-navigation/bottom-tabs';
import { PlatformPressable } from '@react-navigation/elements';
import * as Haptics from 'expo-haptics';

export function HapticTab(props: BottomTabBarButtonProps) {
  const handlePress = (ev: any) => {
    // Haptic feedback
    if (process.env.EXPO_OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    // Navigate bình thường
    props.onPress?.(ev);
  };

  return (
    <PlatformPressable
      {...props}
      onPress={handlePress}
      onPressIn={(ev) => {
        props.onPressIn?.(ev);
      }}
      onPressOut={(ev) => {
        props.onPressOut?.(ev);
      }}
      style={typeof props.style === 'function' ? props.style({ pressed: false }) : props.style}
    />
  );
}
