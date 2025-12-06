import { useEffect, useRef } from "react";
import { Animated } from "react-native";

export function useScaleAnimation(
  length: number,
  options?: { pressedScale?: number }
) {
  const { pressedScale = 0.95 } = options || {};

  const scaleValues = useRef<Animated.Value[]>([]);

  useEffect(() => {
    // Update the scale values array when length changes
    if (scaleValues.current.length !== length) {
      scaleValues.current = new Array(length)
        .fill(null)
        .map(() => new Animated.Value(1));
    }
  }, [length]);

  const handlePressIn = (index: number) => {
    if (scaleValues.current[index]) {
      Animated.spring(scaleValues.current[index], {
        toValue: pressedScale,
        useNativeDriver: true,
      }).start();
    }
  };

  const handlePressOut = (index: number) => {
    if (scaleValues.current[index]) {
      Animated.spring(scaleValues.current[index], {
        toValue: 1,
        friction: 3,
        useNativeDriver: true,
      }).start();
    }
  };

  return { scaleValues: scaleValues.current, handlePressIn, handlePressOut };
}
