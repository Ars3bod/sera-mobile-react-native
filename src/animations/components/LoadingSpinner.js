import React, {useEffect} from 'react';
import {View, StyleSheet} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import StyleManager from '../../styles/StyleManager';

const LoadingSpinner = ({
  size = 40,
  color = '#00623B',
  type = 'rotating', // 'rotating', 'pulsing', 'dots', 'bars'
  duration = 1000,
}) => {
  const rotation = useSharedValue(0);
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  useEffect(() => {
    switch (type) {
      case 'rotating':
        rotation.value = withRepeat(
          withTiming(360, {
            duration,
            easing: Easing.linear,
          }),
          -1,
        );
        break;
      case 'pulsing':
        scale.value = withRepeat(
          withTiming(1.2, {
            duration: duration / 2,
            easing: Easing.inOut(Easing.ease),
          }),
          -1,
          true,
        );
        break;
      case 'fading':
        opacity.value = withRepeat(
          withTiming(0.3, {
            duration: duration / 2,
            easing: Easing.inOut(Easing.ease),
          }),
          -1,
          true,
        );
        break;
    }
  }, [type, duration]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{rotate: `${rotation.value}deg`}, {scale: scale.value}],
      opacity: opacity.value,
    };
  });

  const renderSpinner = () => {
    switch (type) {
      case 'rotating':
        return (
          <Animated.View style={[animatedStyle, {width: size, height: size}]}>
            <View
              style={[
                styles.rotatingSpinner,
                {
                  borderColor: color,
                  borderTopColor: 'transparent',
                  width: size,
                  height: size,
                },
              ]}
            />
          </Animated.View>
        );

      case 'pulsing':
        return (
          <Animated.View
            style={[
              animatedStyle,
              styles.pulsingSpinner,
              {backgroundColor: color, width: size, height: size},
            ]}
          />
        );

      case 'fading':
        return (
          <Animated.View
            style={[
              animatedStyle,
              styles.fadingSpinner,
              {backgroundColor: color, width: size, height: size},
            ]}
          />
        );

      case 'dots':
        return <DotsSpinner size={size} color={color} duration={duration} />;

      case 'bars':
        return <BarsSpinner size={size} color={color} duration={duration} />;

      default:
        return (
          <Animated.View style={[animatedStyle, {width: size, height: size}]}>
            <View
              style={[
                styles.rotatingSpinner,
                {
                  borderColor: color,
                  borderTopColor: 'transparent',
                  width: size,
                  height: size,
                },
              ]}
            />
          </Animated.View>
        );
    }
  };

  return <View style={styles.container}>{renderSpinner()}</View>;
};

// Dots Spinner Component
const DotsSpinner = ({size, color, duration}) => {
  const dot1 = useSharedValue(1);
  const dot2 = useSharedValue(1);
  const dot3 = useSharedValue(1);

  useEffect(() => {
    const animateDot = (dotValue, delay) => {
      dotValue.value = withRepeat(
        withTiming(0.3, {
          duration: duration / 3,
          easing: Easing.inOut(Easing.ease),
        }),
        -1,
        true,
      );
    };

    setTimeout(() => animateDot(dot1, 0), 0);
    setTimeout(() => animateDot(dot2, 0), duration / 6);
    setTimeout(() => animateDot(dot3, 0), duration / 3);
  }, [duration]);

  const dot1Style = useAnimatedStyle(() => ({opacity: dot1.value}));
  const dot2Style = useAnimatedStyle(() => ({opacity: dot2.value}));
  const dot3Style = useAnimatedStyle(() => ({opacity: dot3.value}));

  const dotSize = size / 4;

  return (
    <View style={styles.dotsContainer}>
      <Animated.View
        style={[
          styles.dot,
          dot1Style,
          {backgroundColor: color, width: dotSize, height: dotSize},
        ]}
      />
      <Animated.View
        style={[
          styles.dot,
          dot2Style,
          {backgroundColor: color, width: dotSize, height: dotSize},
        ]}
      />
      <Animated.View
        style={[
          styles.dot,
          dot3Style,
          {backgroundColor: color, width: dotSize, height: dotSize},
        ]}
      />
    </View>
  );
};

// Bars Spinner Component
const BarsSpinner = ({size, color, duration}) => {
  const bar1 = useSharedValue(1);
  const bar2 = useSharedValue(1);
  const bar3 = useSharedValue(1);
  const bar4 = useSharedValue(1);

  useEffect(() => {
    const animateBar = (barValue, delay) => {
      setTimeout(() => {
        barValue.value = withRepeat(
          withTiming(0.3, {
            duration: duration / 4,
            easing: Easing.inOut(Easing.ease),
          }),
          -1,
          true,
        );
      }, delay);
    };

    animateBar(bar1, 0);
    animateBar(bar2, duration / 8);
    animateBar(bar3, duration / 4);
    animateBar(bar4, (duration * 3) / 8);
  }, [duration]);

  const bar1Style = useAnimatedStyle(() => ({
    transform: [{scaleY: bar1.value}],
  }));
  const bar2Style = useAnimatedStyle(() => ({
    transform: [{scaleY: bar2.value}],
  }));
  const bar3Style = useAnimatedStyle(() => ({
    transform: [{scaleY: bar3.value}],
  }));
  const bar4Style = useAnimatedStyle(() => ({
    transform: [{scaleY: bar4.value}],
  }));

  const barWidth = size / 6;
  const barHeight = size;

  return (
    <View style={styles.barsContainer}>
      <Animated.View
        style={[
          styles.bar,
          bar1Style,
          {backgroundColor: color, width: barWidth, height: barHeight},
        ]}
      />
      <Animated.View
        style={[
          styles.bar,
          bar2Style,
          {backgroundColor: color, width: barWidth, height: barHeight},
        ]}
      />
      <Animated.View
        style={[
          styles.bar,
          bar3Style,
          {backgroundColor: color, width: barWidth, height: barHeight},
        ]}
      />
      <Animated.View
        style={[
          styles.bar,
          bar4Style,
          {backgroundColor: color, width: barWidth, height: barHeight},
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  rotatingSpinner: {
    borderRadius: 100,
    borderWidth: 3,
  },
  pulsingSpinner: {
    borderRadius: 100,
  },
  fadingSpinner: {
    borderRadius: 100,
  },
  dotsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: 60,
  },
  dot: {
    borderRadius: 100,
    marginHorizontal: 2,
  },
  barsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 40,
  },
  bar: {
    marginHorizontal: 1,
    borderRadius: 2,
  },
});

export default LoadingSpinner;
