import React, {useEffect} from 'react';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withSequence,
  Easing,
  runOnJS,
} from 'react-native-reanimated';
import {Dimensions} from 'react-native';

const {width: screenWidth, height: screenHeight} = Dimensions.get('window');

const PageTransition = ({
  children,
  transitionType = 'slideFromRight', // 'slideFromRight', 'slideFromLeft', 'fadeIn', 'scaleIn', 'slideUp', 'slideDown'
  duration = 300,
  delay = 0,
  onAnimationComplete,
  style = {},
}) => {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const opacity = useSharedValue(1);
  const scale = useSharedValue(1);

  useEffect(() => {
    // Set initial values based on transition type
    switch (transitionType) {
      case 'slideFromRight':
        translateX.value = screenWidth;
        opacity.value = 1;
        break;
      case 'slideFromLeft':
        translateX.value = -screenWidth;
        opacity.value = 1;
        break;
      case 'slideUp':
        translateY.value = screenHeight;
        opacity.value = 1;
        break;
      case 'slideDown':
        translateY.value = -screenHeight;
        opacity.value = 1;
        break;
      case 'fadeIn':
        opacity.value = 0;
        break;
      case 'scaleIn':
        scale.value = 0.8;
        opacity.value = 0;
        break;
    }

    // Animate to final position
    const animateToPosition = () => {
      const config = {
        duration,
        easing: Easing.out(Easing.cubic),
      };

      const springConfig = {
        damping: 20,
        stiffness: 100,
        mass: 1,
      };

      switch (transitionType) {
        case 'slideFromRight':
        case 'slideFromLeft':
          translateX.value = withTiming(0, config, finished => {
            if (finished && onAnimationComplete) {
              runOnJS(onAnimationComplete)();
            }
          });
          break;
        case 'slideUp':
        case 'slideDown':
          translateY.value = withTiming(0, config, finished => {
            if (finished && onAnimationComplete) {
              runOnJS(onAnimationComplete)();
            }
          });
          break;
        case 'fadeIn':
          opacity.value = withTiming(1, config, finished => {
            if (finished && onAnimationComplete) {
              runOnJS(onAnimationComplete)();
            }
          });
          break;
        case 'scaleIn':
          scale.value = withSpring(1, springConfig);
          opacity.value = withTiming(1, config, finished => {
            if (finished && onAnimationComplete) {
              runOnJS(onAnimationComplete)();
            }
          });
          break;
      }
    };

    if (delay > 0) {
      setTimeout(animateToPosition, delay);
    } else {
      animateToPosition();
    }
  }, [transitionType, duration, delay]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {translateX: translateX.value},
        {translateY: translateY.value},
        {scale: scale.value},
      ],
      opacity: opacity.value,
    };
  });

  return (
    <Animated.View style={[{flex: 1}, style, animatedStyle]}>
      {children}
    </Animated.View>
  );
};

// Pre-configured transition components
export const SlideFromRight = ({children, ...props}) => (
  <PageTransition {...props} transitionType="slideFromRight">
    {children}
  </PageTransition>
);

export const SlideFromLeft = ({children, ...props}) => (
  <PageTransition {...props} transitionType="slideFromLeft">
    {children}
  </PageTransition>
);

export const FadeIn = ({children, ...props}) => (
  <PageTransition {...props} transitionType="fadeIn">
    {children}
  </PageTransition>
);

export const ScaleIn = ({children, ...props}) => (
  <PageTransition {...props} transitionType="scaleIn">
    {children}
  </PageTransition>
);

export const SlideUp = ({children, ...props}) => (
  <PageTransition {...props} transitionType="slideUp">
    {children}
  </PageTransition>
);

export const SlideDown = ({children, ...props}) => (
  <PageTransition {...props} transitionType="slideDown">
    {children}
  </PageTransition>
);

export default PageTransition;
