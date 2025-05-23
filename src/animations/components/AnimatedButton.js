import React from 'react';
import {Text, StyleSheet} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import StyleManager from '../../styles/StyleManager';

const AnimatedButton = ({
  onPress,
  children,
  style = {},
  textStyle = {},
  disabled = false,
  animationType = 'scale', // 'scale', 'bounce', 'glow'
  hapticFeedback = true,
  loading = false,
  loadingText = 'Loading...',
}) => {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);
  const backgroundColor = useSharedValue(0);

  const styleManager = StyleManager;

  // Gesture handling
  const tapGesture = Gesture.Tap()
    .enabled(!disabled && !loading)
    .onBegin(() => {
      'worklet';
      switch (animationType) {
        case 'scale':
          scale.value = withSpring(0.95, {
            damping: 15,
            stiffness: 300,
          });
          break;
        case 'bounce':
          scale.value = withSpring(1.05, {
            damping: 10,
            stiffness: 400,
          });
          break;
        case 'glow':
          backgroundColor.value = withTiming(1, {duration: 150});
          break;
      }
    })
    .onFinalize((event, success) => {
      'worklet';
      if (success) {
        switch (animationType) {
          case 'scale':
            scale.value = withSpring(1, {
              damping: 15,
              stiffness: 300,
            });
            break;
          case 'bounce':
            scale.value = withSpring(1, {
              damping: 12,
              stiffness: 200,
            });
            break;
          case 'glow':
            backgroundColor.value = withTiming(0, {duration: 200});
            break;
        }

        if (onPress) {
          runOnJS(onPress)();
        }
      } else {
        // Reset on cancel
        scale.value = withSpring(1);
        backgroundColor.value = withTiming(0, {duration: 100});
      }
    });

  // Animated styles
  const animatedButtonStyle = useAnimatedStyle(() => {
    return {
      transform: [{scale: scale.value}],
      opacity: disabled ? 0.6 : opacity.value,
      backgroundColor:
        animationType === 'glow'
          ? `rgba(255, 255, 255, ${backgroundColor.value * 0.2})`
          : 'transparent',
    };
  });

  const defaultButtonStyle = {
    backgroundColor: styleManager.colors.primary,
    paddingVertical: styleManager.spacing.md,
    paddingHorizontal: styleManager.spacing.xl,
    borderRadius: styleManager.borderRadius.base,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
    ...styleManager.shadows.medium,
  };

  const defaultTextStyle = {
    color: styleManager.colors.text.white,
    fontSize: styleManager.typography.sizes.lg,
    fontWeight: styleManager.typography.weights.bold,
  };

  return (
    <GestureDetector gesture={tapGesture}>
      <Animated.View style={[defaultButtonStyle, style, animatedButtonStyle]}>
        {loading ? (
          <Text style={[defaultTextStyle, textStyle]}>{loadingText}</Text>
        ) : (
          <Text style={[defaultTextStyle, textStyle]}>{children}</Text>
        )}
      </Animated.View>
    </GestureDetector>
  );
};

export default AnimatedButton;
