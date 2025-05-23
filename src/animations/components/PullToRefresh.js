import React, {useState} from 'react';
import {View, StyleSheet, Dimensions} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedGestureHandler,
  withSpring,
  withTiming,
  runOnJS,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';
import {PanGestureHandler, State} from 'react-native-gesture-handler';
import LoadingSpinner from './LoadingSpinner';
import StyleManager from '../../styles/StyleManager';

const {height: screenHeight} = Dimensions.get('window');
const REFRESH_THRESHOLD = 80;
const MAX_PULL_DISTANCE = 120;

const PullToRefresh = ({
  children,
  onRefresh,
  refreshing = false,
  pullDistance = REFRESH_THRESHOLD,
  maxPullDistance = MAX_PULL_DISTANCE,
  spinnerColor = '#00623B',
  spinnerSize = 40,
}) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const translateY = useSharedValue(0);
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0);

  const styleManager = StyleManager;

  React.useEffect(() => {
    if (refreshing) {
      setIsRefreshing(true);
      translateY.value = withSpring(pullDistance);
      opacity.value = withTiming(1);
      scale.value = withSpring(1);
    } else {
      setIsRefreshing(false);
      translateY.value = withSpring(0);
      opacity.value = withTiming(0);
      scale.value = withSpring(0);
    }
  }, [refreshing]);

  const gestureHandler = useAnimatedGestureHandler({
    onStart: (_, context) => {
      context.startY = translateY.value;
    },
    onActive: (event, context) => {
      if (event.translationY > 0 && !isRefreshing) {
        const newTranslateY = Math.min(
          context.startY + event.translationY * 0.4,
          maxPullDistance,
        );
        translateY.value = newTranslateY;

        // Update opacity and scale based on pull distance
        const progress = interpolate(
          newTranslateY,
          [0, pullDistance],
          [0, 1],
          Extrapolate.CLAMP,
        );

        opacity.value = progress;
        scale.value = progress;
      }
    },
    onEnd: (event, context) => {
      if (translateY.value >= pullDistance && !isRefreshing) {
        // Trigger refresh
        translateY.value = withSpring(pullDistance);
        opacity.value = withTiming(1);
        scale.value = withSpring(1);

        if (onRefresh) {
          runOnJS(onRefresh)();
        }
      } else if (!isRefreshing) {
        // Reset to initial position
        translateY.value = withSpring(0);
        opacity.value = withTiming(0);
        scale.value = withSpring(0);
      }
    },
  });

  const containerAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{translateY: translateY.value}],
    };
  });

  const refreshIndicatorStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [{scale: scale.value}],
    };
  });

  const pullIndicatorStyle = useAnimatedStyle(() => {
    const rotation = interpolate(
      translateY.value,
      [0, pullDistance],
      [0, 180],
      Extrapolate.CLAMP,
    );

    return {
      transform: [{rotate: `${rotation}deg`}],
      opacity: isRefreshing ? 0 : opacity.value,
    };
  });

  return (
    <View style={styles.container}>
      {/* Refresh Indicator */}
      <View style={styles.refreshContainer}>
        <Animated.View style={[styles.refreshIndicator, refreshIndicatorStyle]}>
          {isRefreshing ? (
            <LoadingSpinner
              type="rotating"
              size={spinnerSize}
              color={spinnerColor}
              duration={1000}
            />
          ) : (
            <Animated.View style={[styles.pullIndicator, pullIndicatorStyle]}>
              {/* Pull Arrow Icon */}
              <View style={[styles.arrow, {borderTopColor: spinnerColor}]} />
            </Animated.View>
          )}
        </Animated.View>
      </View>

      {/* Content */}
      <PanGestureHandler onGestureEvent={gestureHandler}>
        <Animated.View style={[styles.content, containerAnimatedStyle]}>
          {children}
        </Animated.View>
      </PanGestureHandler>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  refreshContainer: {
    position: 'absolute',
    top: -60,
    left: 0,
    right: 0,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  refreshIndicator: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  pullIndicator: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrow: {
    width: 0,
    height: 0,
    borderLeftWidth: 10,
    borderRightWidth: 10,
    borderTopWidth: 15,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
  },
  content: {
    flex: 1,
  },
});

export default PullToRefresh;
