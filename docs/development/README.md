# SERA Mobile - Development Documentation

## 🎯 Cursor AI Developer Roles

When working with Cursor AI, use these specialized roles for targeted assistance:

### 👨‍💻 React Native Developer

**Usage:** `@react-native-dev`

**Responsibilities:**

- Develop components using React Native 0.79.2
- Support RTL for Arabic
- Compatibility with iOS and Android
- Use Expo SDK
- Apply best practices

**Example:**

```
@react-native-dev I need a component to display complaints list with RTL support
```

### 🌍 Arabic Localization Expert

**Usage:** `@arabic-i18n`

**Responsibilities:**

- Setup react-i18next
- Translate content to Arabic
- Support RTL layout
- Use correct government terminology

**Example:**

```
@arabic-i18n I want to add new translations for the settings screen
```

### 🏛️ Government App Developer

**Usage:** `@gov-app-dev`

**Responsibilities:**

- Apply Saudi government digital standards
- Ensure security and privacy
- Citizen-first user experience
- Compliance with government standards

### 🎨 UI/UX Designer

**Usage:** `@ui-ux-designer`

**Responsibilities:**

- Responsive design
- Color system and themes
- Accessibility
- Smooth user experience

### 🧪 Quality Tester

**Usage:** `@qa-tester`

**Responsibilities:**

- Test Arabic and English
- Verify RTL support
- Test accessibility
- Code review

### 📱 Performance Expert

**Usage:** `@performance-expert`

**Responsibilities:**

- Improve app speed
- Reduce bundle size
- Memory management
- Optimize rendering

## 🎬 SERA Animation System

Advanced animation system providing comprehensive collection of animations and visual interactions.

### LoadingSpinner Components

```jsx
import { LoadingSpinner } from '../animations';

// Rotating spinner
<LoadingSpinner type="rotating" size={40} color="#00623B" />

// Pulsing animation
<LoadingSpinner type="pulsing" size={50} color="#00623B" />

// Dots animation
<LoadingSpinner type="dots" size={60} color="#00623B" />

// Bars animation
<LoadingSpinner type="bars" size={40} color="#00623B" />
```

### AnimatedButton

```jsx
import {AnimatedButton} from '../animations';

<AnimatedButton
  onPress={handlePress}
  animationType="scale" // 'scale', 'bounce', 'glow'
  disabled={loading}
  style={customButtonStyle}
  textStyle={customTextStyle}>
  Press Here
</AnimatedButton>;
```

### PageTransition

```jsx
import { SlideFromRight, FadeIn, ScaleIn } from '../animations';

// From right
<SlideFromRight duration={300}>
  <YourScreen />
</SlideFromRight>

// Fade in
<FadeIn duration={500} delay={200}>
  <YourContent />
</FadeIn>

// Scale in
<ScaleIn duration={400}>
  <YourModal />
</ScaleIn>
```

### PullToRefresh

```jsx
import {PullToRefresh} from '../animations';

<PullToRefresh
  onRefresh={handleRefresh}
  refreshing={isRefreshing}
  pullDistance={80}
  spinnerColor="#00623B">
  <ScrollView>{/* Your content */}</ScrollView>
</PullToRefresh>;
```

## Animation Manager

### Basic Usage

```jsx
import {AnimationManager} from '../animations';

// Timing animation
const fadeAnimation = AnimationManager.timing(1, {
  duration: 300,
  easing: AnimationManager.easings.easeOut,
});

// Spring animation
const scaleAnimation = AnimationManager.spring(1.1, {
  spring: AnimationManager.springs.bouncy,
});

// Preset animations
const preset = AnimationManager.getPreset('fadeIn');
```

### Animation Sequences

```jsx
// Sequential animations
const sequence = AnimationManager.sequence(
  AnimationManager.timing(0.8, {duration: 200}),
  AnimationManager.timing(1, {duration: 300}),
);

// Staggered animations
const staggered = AnimationManager.stagger(
  [animation1, animation2, animation3],
  100, // 100ms delay between each
);
```

### Custom Animations

```jsx
// Shake animation for errors
const shakeAnimation = AnimationManager.createShake(10, 400);

// Bounce animation for success
const bounceAnimation = AnimationManager.createBounce(1.2, 500);

// Pulse animation for loading
const pulseAnimation = AnimationManager.createPulse(1.05, 800);
```

## Animation Hooks

### useAnimatedMount

```jsx
import {useAnimatedMount} from '../animations/hooks/useAnimatedMount';

const Component = () => {
  const {animatedStyle, unmount} = useAnimatedMount(
    'fadeIn', // animation type
    300, // duration
    500, // delay
  );

  return (
    <Animated.View style={animatedStyle}>{/* Your content */}</Animated.View>
  );
};
```

## Performance Tips

1. **Use `runOnUI` for complex animations**
2. **Avoid recreating animations on every render**
3. **Use `useSharedValue` for changing values**
4. **Enable Hermes engine for better performance**

## Best Practices

1. **Choose appropriate animation type for each use case**
2. **Keep animations fast and visible (200-500ms)**
3. **Use consistent animations throughout the app**
4. **Test animations on different devices**
5. **Provide option to disable animations for users as needed**
