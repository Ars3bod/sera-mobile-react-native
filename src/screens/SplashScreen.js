import React, { useEffect } from 'react';
import { View, StyleSheet, Dimensions, StatusBar, Image } from 'react-native';
import Video from 'react-native-video';
import { useUser } from '../context/UserContext';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withSequence,
  Easing,
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

export default function SplashScreen({ navigation }) {
  const logoOpacity = useSharedValue(0);
  const logoScale = useSharedValue(0.8);
  const { isAuthenticated, isLoading } = useUser();

  useEffect(() => {
    // Animate logo appearance
    logoOpacity.value = withDelay(
      500, // Wait 500ms after video starts
      withTiming(1, {
        duration: 800,
        easing: Easing.out(Easing.cubic),
      }),
    );

    logoScale.value = withDelay(
      500,
      withTiming(1, {
        duration: 800,
        easing: Easing.out(Easing.back(1.1)),
      }),
    );

    // Check authentication and biometric status after splash animation
    const timer = setTimeout(async () => {
      // Fade out animation before navigation
      logoOpacity.value = withTiming(0, {
        duration: 200,
        easing: Easing.in(Easing.cubic),
      });

      setTimeout(async () => {
        await handleNavigation();
      }, 200);
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigation]);

  const handleNavigation = async (retryCount = 0) => {
    try {
      // Wait for user context to finish loading (max 2 seconds)
      if (isLoading && retryCount < 20) {
        setTimeout(() => handleNavigation(retryCount + 1), 100);
        return;
      }

      // Check if user is already authenticated
      if (isAuthenticated) {
        navigation.replace('Home');
      } else {
        // Navigate to login screen (biometric will be handled there)
        navigation.replace('Login');
      }
    } catch (error) {
      console.log('Error in navigation:', error);
      // Default to login screen on error
      navigation.replace('Login');
    }
  };

  const logoAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: logoOpacity.value,
      transform: [{ scale: logoScale.value }],
    };
  });

  return (
    <View style={styles.container}>
      <StatusBar hidden />

      {/* Background Video */}
      <Video
        source={require('../assets/videos/splash.mp4')}
        style={styles.backgroundVideo}
        muted={true}
        repeat={true}
        resizeMode="cover"
        rate={1.0}
        ignoreSilentSwitch="obey"
      />

      {/* Dark overlay for better logo visibility */}
      <View style={styles.overlay} />

      {/* SERA White Logo with Animation */}
      <View style={styles.logoContainer}>
        <Animated.View style={logoAnimatedStyle}>
          <Image
            source={require('../assets/images/sera-white-logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backgroundVideo: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    width: width,
    height: height,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.3)', // Semi-transparent dark overlay
  },
  logoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  logo: {
    width: width * 0.6,
    height: height * 0.25,
    maxWidth: 300,
    maxHeight: 200,
  },
});
