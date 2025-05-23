import {
  Easing,
  withTiming,
  withSpring,
  withSequence,
  withDelay,
  withRepeat,
  runOnJS,
} from 'react-native-reanimated';

class AnimationManager {
  static instance = null;

  constructor() {
    if (AnimationManager.instance) {
      return AnimationManager.instance;
    }

    // Animation durations
    this.durations = {
      instant: 0,
      fastest: 100,
      fast: 200,
      medium: 300,
      slow: 500,
      slowest: 800,
      splash: 3000,
    };

    // Easing curves
    this.easings = {
      linear: Easing.linear,
      ease: Easing.ease,
      easeIn: Easing.in(Easing.quad),
      easeOut: Easing.out(Easing.quad),
      easeInOut: Easing.inOut(Easing.quad),
      spring: Easing.elastic(1),
      bounce: Easing.bounce,
      bezier: Easing.bezier(0.25, 0.1, 0.25, 1),
    };

    // Spring configurations
    this.springs = {
      gentle: {
        damping: 15,
        stiffness: 120,
        mass: 1,
      },
      wobbly: {
        damping: 8,
        stiffness: 100,
        mass: 1,
      },
      bouncy: {
        damping: 10,
        stiffness: 180,
        mass: 1,
      },
      soft: {
        damping: 20,
        stiffness: 100,
        mass: 1,
      },
    };

    // Animation presets
    this.presets = {
      // Fade animations
      fadeIn: {
        from: {opacity: 0},
        to: {opacity: 1},
        duration: this.durations.medium,
        easing: this.easings.easeOut,
      },
      fadeOut: {
        from: {opacity: 1},
        to: {opacity: 0},
        duration: this.durations.medium,
        easing: this.easings.easeIn,
      },

      // Scale animations
      scaleIn: {
        from: {transform: [{scale: 0.8}], opacity: 0},
        to: {transform: [{scale: 1}], opacity: 1},
        duration: this.durations.medium,
        easing: this.easings.easeOut,
      },
      scaleOut: {
        from: {transform: [{scale: 1}], opacity: 1},
        to: {transform: [{scale: 0.8}], opacity: 0},
        duration: this.durations.fast,
        easing: this.easings.easeIn,
      },

      // Slide animations
      slideInFromRight: {
        from: {transform: [{translateX: 300}], opacity: 0},
        to: {transform: [{translateX: 0}], opacity: 1},
        duration: this.durations.medium,
        easing: this.easings.easeOut,
      },
      slideInFromLeft: {
        from: {transform: [{translateX: -300}], opacity: 0},
        to: {transform: [{translateX: 0}], opacity: 1},
        duration: this.durations.medium,
        easing: this.easings.easeOut,
      },
      slideOutToRight: {
        from: {transform: [{translateX: 0}], opacity: 1},
        to: {transform: [{translateX: 300}], opacity: 0},
        duration: this.durations.fast,
        easing: this.easings.easeIn,
      },

      // Button animations
      buttonPress: {
        from: {transform: [{scale: 1}]},
        to: {transform: [{scale: 0.95}]},
        duration: this.durations.fastest,
        easing: this.easings.easeInOut,
      },
      buttonRelease: {
        from: {transform: [{scale: 0.95}]},
        to: {transform: [{scale: 1}]},
        duration: this.durations.fast,
        easing: this.easings.easeOut,
      },

      // Loading animations
      pulse: {
        from: {opacity: 0.5, transform: [{scale: 1}]},
        to: {opacity: 1, transform: [{scale: 1.05}]},
        duration: this.durations.slow,
        easing: this.easings.easeInOut,
        repeat: -1,
        reverse: true,
      },
      rotate: {
        from: {transform: [{rotate: '0deg'}]},
        to: {transform: [{rotate: '360deg'}]},
        duration: this.durations.slowest,
        easing: this.easings.linear,
        repeat: -1,
      },

      // Page transitions
      pageSlideIn: {
        from: {transform: [{translateX: 300}]},
        to: {transform: [{translateX: 0}]},
        duration: this.durations.medium,
        easing: this.easings.bezier,
      },
      pageSlideOut: {
        from: {transform: [{translateX: 0}]},
        to: {transform: [{translateX: -300}]},
        duration: this.durations.medium,
        easing: this.easings.bezier,
      },
    };

    AnimationManager.instance = this;
  }

  static getInstance() {
    if (!AnimationManager.instance) {
      AnimationManager.instance = new AnimationManager();
    }
    return AnimationManager.instance;
  }

  // Create timing animation
  timing(value, config = {}) {
    return withTiming(
      value,
      {
        duration: config.duration || this.durations.medium,
        easing: config.easing || this.easings.easeOut,
      },
      config.callback,
    );
  }

  // Create spring animation
  spring(value, config = {}) {
    const springConfig = config.spring || this.springs.gentle;
    return withSpring(value, springConfig, config.callback);
  }

  // Create sequence animation
  sequence(...animations) {
    return withSequence(...animations);
  }

  // Create delayed animation
  delay(animation, delayMs = 0) {
    return withDelay(delayMs, animation);
  }

  // Create repeating animation
  repeat(animation, numberOfReps = -1, reverse = false) {
    return withRepeat(animation, numberOfReps, reverse);
  }

  // Get preset animation
  getPreset(presetName, customConfig = {}) {
    const preset = this.presets[presetName];
    if (!preset) {
      console.warn(`Animation preset "${presetName}" not found`);
      return null;
    }

    return {
      ...preset,
      ...customConfig,
    };
  }

  // Stagger animation for multiple elements
  stagger(animations, staggerDelay = 100) {
    return animations.map((animation, index) =>
      withDelay(index * staggerDelay, animation),
    );
  }

  // Pulse animation (commonly used for loading)
  createPulse(scale = 1.05, duration = this.durations.slow) {
    return this.repeat(
      this.sequence(
        this.timing(scale, {duration: duration / 2}),
        this.timing(1, {duration: duration / 2}),
      ),
      -1,
    );
  }

  // Shake animation (for errors)
  createShake(intensity = 10, duration = this.durations.fast) {
    return this.sequence(
      this.timing(intensity, {duration: duration / 8}),
      this.timing(-intensity, {duration: duration / 4}),
      this.timing(intensity, {duration: duration / 4}),
      this.timing(-intensity, {duration: duration / 4}),
      this.timing(0, {duration: duration / 8}),
    );
  }

  // Bounce animation (for success feedback)
  createBounce(scale = 1.1, duration = this.durations.medium) {
    return this.sequence(
      this.timing(scale, {
        duration: duration / 3,
        easing: this.easings.easeOut,
      }),
      this.timing(1, {
        duration: (duration * 2) / 3,
        easing: this.easings.bounce,
      }),
    );
  }

  // Chain animations with callbacks
  chain(animations, onComplete) {
    const lastAnimation = animations[animations.length - 1];
    const chainedAnimations = animations.slice(0, -1);

    if (onComplete) {
      return this.sequence(
        ...chainedAnimations,
        withTiming(lastAnimation, {}, runOnJS(onComplete)),
      );
    }

    return this.sequence(...animations);
  }
}

export default AnimationManager.getInstance();
