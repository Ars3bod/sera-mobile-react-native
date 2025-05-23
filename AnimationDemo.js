import React, {useState} from 'react';
import {View, Text, ScrollView, StyleSheet, SafeAreaView} from 'react-native';
import {
  LoadingSpinner,
  AnimatedButton,
  PageTransition,
  PullToRefresh,
  FadeIn,
  ScaleIn,
  SlideFromRight,
} from './src/animations';

const AnimationDemo = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [buttonPressed, setButtonPressed] = useState(false);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 2000);
  };

  return (
    <SafeAreaView style={styles.container}>
      <PageTransition transitionType="fadeIn" duration={500}>
        <ScrollView contentContainerStyle={styles.content}>
          <FadeIn delay={300}>
            <Text style={styles.title}>🎨 SERA Animation System</Text>
          </FadeIn>

          <ScaleIn delay={500}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Loading Spinners</Text>
              <View style={styles.spinnerRow}>
                <LoadingSpinner type="rotating" size={40} color="#00623B" />
                <LoadingSpinner type="pulsing" size={40} color="#ff9500" />
                <LoadingSpinner type="dots" size={40} color="#00623B" />
                <LoadingSpinner type="bars" size={40} color="#ff9500" />
              </View>
            </View>
          </ScaleIn>

          <SlideFromRight delay={700}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Animated Buttons</Text>
              <AnimatedButton
                onPress={() => setButtonPressed(!buttonPressed)}
                animationType="scale"
                style={styles.primaryButton}>
                Scale Animation
              </AnimatedButton>

              <AnimatedButton
                onPress={() => setButtonPressed(!buttonPressed)}
                animationType="bounce"
                style={[styles.primaryButton, {backgroundColor: '#ff9500'}]}>
                Bounce Animation
              </AnimatedButton>

              <AnimatedButton
                onPress={() => setButtonPressed(!buttonPressed)}
                animationType="glow"
                style={[styles.primaryButton, {backgroundColor: '#007AFF'}]}>
                Glow Animation
              </AnimatedButton>
            </View>
          </SlideFromRight>

          <FadeIn delay={900}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Pull to Refresh</Text>
              <Text style={styles.instruction}>
                اسحب للأسفل لاختبار حركة التحديث
              </Text>
              <PullToRefresh
                onRefresh={handleRefresh}
                refreshing={refreshing}
                pullDistance={80}
                spinnerColor="#00623B">
                <View style={styles.refreshContent}>
                  <Text style={styles.refreshText}>
                    {refreshing ? 'جاري التحديث...' : 'اسحب للتحديث'}
                  </Text>
                </View>
              </PullToRefresh>
            </View>
          </FadeIn>

          <ScaleIn delay={1100}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Status Indicator</Text>
              <Text style={styles.statusText}>
                {buttonPressed ? '✅ تم الضغط!' : '⏳ في انتظار التفاعل'}
              </Text>
            </View>
          </ScaleIn>
        </ScrollView>
      </PageTransition>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#00623B',
    marginBottom: 30,
  },
  section: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    textAlign: 'right',
  },
  spinnerRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 20,
  },
  primaryButton: {
    backgroundColor: '#00623B',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginBottom: 10,
  },
  instruction: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 10,
  },
  refreshContent: {
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
  },
  refreshText: {
    fontSize: 16,
    color: '#333',
  },
  statusText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#00623B',
    fontWeight: 'bold',
  },
});

export default AnimationDemo;
