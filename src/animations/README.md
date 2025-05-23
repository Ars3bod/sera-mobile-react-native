# SERA Animation System

نظام الحركة المتقدم لتطبيق SERA يوفر مجموعة شاملة من الحركات والتفاعلات المرئية.

## Components الكونوبنت

### LoadingSpinner

مكونات حركة التحميل بأنماط متعددة:

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

أزرار متحركة مع تفاعلات لمسية:

```jsx
import {AnimatedButton} from '../animations';

<AnimatedButton
  onPress={handlePress}
  animationType="scale" // 'scale', 'bounce', 'glow'
  disabled={loading}
  style={customButtonStyle}
  textStyle={customTextStyle}>
  اضغط هنا
</AnimatedButton>;
```

### PageTransition

تحولات صفحات سلسة:

```jsx
import { SlideFromRight, FadeIn, ScaleIn } from '../animations';

// من اليمين
<SlideFromRight duration={300}>
  <YourScreen />
</SlideFromRight>

// تلاشي
<FadeIn duration={500} delay={200}>
  <YourContent />
</FadeIn>

// تكبير
<ScaleIn duration={400}>
  <YourModal />
</ScaleIn>
```

### PullToRefresh

حركة السحب للتحديث:

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

## Animation Manager مدير الحركات

### Basic Usage استخدام أساسي

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

### Animation Sequences تسلسل الحركات

```jsx
// Sequential animations
const sequence = AnimationManager.sequence(
  AnimationManager.timing(0.8, {duration: 200}),
  AnimationManager.timing(1, {duration: 300}),
);

// Staggered animations
const staggered = AnimationManager.stagger(
  [animation1, animation2, animation3],
  100,
); // 100ms delay between each
```

### Custom Animations حركات مخصصة

```jsx
// Shake animation for errors
const shakeAnimation = AnimationManager.createShake(10, 400);

// Bounce animation for success
const bounceAnimation = AnimationManager.createBounce(1.2, 500);

// Pulse animation for loading
const pulseAnimation = AnimationManager.createPulse(1.05, 800);
```

## Hooks الخطافات

### useAnimatedMount

حركة ظهور العناصر:

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

## Configuration التكوين

### Durations المدد الزمنية

- `instant`: 0ms
- `fastest`: 100ms
- `fast`: 200ms
- `medium`: 300ms
- `slow`: 500ms
- `slowest`: 800ms

### Easing Curves منحنيات التسارع

- `linear`: خطي
- `easeIn`: تسارع في البداية
- `easeOut`: تباطؤ في النهاية
- `easeInOut`: تسارع وتباطؤ
- `spring`: نابضي
- `bounce`: مرتد

### Spring Configurations تكوينات النابض

- `gentle`: ناعم ومرن
- `wobbly`: متذبذب
- `bouncy`: مرتد
- `soft`: ناعم

## Performance Tips نصائح الأداء

1. **استخدم `runOnUI` للحركات المعقدة**
2. **تجنب إعادة إنشاء الحركات في كل render**
3. **استخدم `useSharedValue` للقيم المتغيرة**
4. **فعل Hermes engine للأداء الأفضل**

## Examples أمثلة

### قائمة متحركة

```jsx
const AnimatedList = ({items}) => {
  return (
    <View>
      {items.map((item, index) => (
        <FadeIn key={item.id} delay={index * 100}>
          <ListItem item={item} />
        </FadeIn>
      ))}
    </View>
  );
};
```

### نموذج متحرك

```jsx
const AnimatedModal = ({visible, onClose}) => {
  return (
    <Modal visible={visible}>
      <ScaleIn duration={300}>
        <View style={styles.modalContent}>
          <AnimatedButton onPress={onClose}>إغلاق</AnimatedButton>
        </View>
      </ScaleIn>
    </Modal>
  );
};
```

## Best Practices أفضل الممارسات

1. **اختر النوع المناسب من الحركة لكل حالة استخدام**
2. **حافظ على الحركات سريعة ومرئية (200-500ms)**
3. **استخدم حركات متسقة عبر التطبيق**
4. **اختبر الحركات على أجهزة مختلفة**
5. **وفر خيار إيقاف الحركات للمستخدمين حسب الحاجة**
