import {useEffect} from 'react';
import {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  Easing,
} from 'react-native-reanimated';
import AnimationManager from '../AnimationManager';

const useAnimatedMount = (
  animationType = 'fadeIn',
  duration = 300,
  delay = 0,
  customConfig = {},
) => {
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.8);
  const translateY = useSharedValue(50);
  const translateX = useSharedValue(0);

  const animationManager = AnimationManager;

  useEffect(() => {
    const animate = () => {
      const config = {
        duration,
        easing: Easing.out(Easing.cubic),
        ...customConfig,
      };

      const springConfig = {
        damping: 15,
        stiffness: 120,
        mass: 1,
        ...customConfig.spring,
      };

      switch (animationType) {
        case 'fadeIn':
          opacity.value = withTiming(1, config);
          break;
        case 'scaleIn':
          opacity.value = withTiming(1, config);
          scale.value = withSpring(1, springConfig);
          break;
        case 'slideUp':
          opacity.value = withTiming(1, config);
          translateY.value = withTiming(0, config);
          break;
        case 'slideDown':
          opacity.value = withTiming(1, config);
          translateY.value = withTiming(0, config);
          break;
        case 'slideLeft':
          opacity.value = withTiming(1, config);
          translateX.value = withTiming(0, config);
          break;
        case 'slideRight':
          opacity.value = withTiming(1, config);
          translateX.value = withTiming(0, config);
          break;
        case 'combined':
          opacity.value = withTiming(1, config);
          scale.value = withSpring(1, springConfig);
          translateY.value = withTiming(0, config);
          break;
      }
    };

    // Set initial values
    switch (animationType) {
      case 'slideUp':
        translateY.value = 50;
        break;
      case 'slideDown':
        translateY.value = -50;
        break;
      case 'slideLeft':
        translateX.value = 50;
        break;
      case 'slideRight':
        translateX.value = -50;
        break;
      case 'combined':
        translateY.value = 30;
        scale.value = 0.9;
        break;
    }

    if (delay > 0) {
      setTimeout(animate, delay);
    } else {
      animate();
    }
  }, [animationType, duration, delay]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [
        {scale: scale.value},
        {translateY: translateY.value},
        {translateX: translateX.value},
      ],
    };
  });

  const unmount = callback => {
    const config = {
      duration: duration * 0.7,
      easing: Easing.in(Easing.cubic),
    };

    switch (animationType) {
      case 'fadeIn':
        opacity.value = withTiming(0, config, callback);
        break;
      case 'scaleIn':
        opacity.value = withTiming(0, config);
        scale.value = withTiming(0.8, config, callback);
        break;
      case 'slideUp':
        opacity.value = withTiming(0, config);
        translateY.value = withTiming(-50, config, callback);
        break;
      case 'slideDown':
        opacity.value = withTiming(0, config);
        translateY.value = withTiming(50, config, callback);
        break;
      case 'slideLeft':
        opacity.value = withTiming(0, config);
        translateX.value = withTiming(-50, config, callback);
        break;
      case 'slideRight':
        opacity.value = withTiming(0, config);
        translateX.value = withTiming(50, config, callback);
        break;
      case 'combined':
        opacity.value = withTiming(0, config);
        scale.value = withTiming(0.8, config);
        translateY.value = withTiming(30, config, callback);
        break;
    }
  };

  return {
    animatedStyle,
    unmount,
    values: {
      opacity,
      scale,
      translateY,
      translateX,
    },
  };
};

export default useAnimatedMount;
