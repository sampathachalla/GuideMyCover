import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useCallback, useRef, useState } from 'react';
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface OnboardingScreen {
  image: any;
  headline: string;
  bodyText: string;
}

const onboardingScreens: OnboardingScreen[] = [
  {
    image: require('../../assets/logo.png'),
    headline: 'Stop Guessing. Start Saving.',
    bodyText:
      'Welcome to GuideMyCover. Finding the right insurance can be complex and overwhelming. We make it simple.',
  },
  {
    image: require('../../assets/logo.png'),
    headline: 'Your Personal Insurance Navigator',
    bodyText:
      'Answer a few simple questions, and our smart technology scans, compares, and recommends the best policies for your unique needs.',
  },
  {
    image: require('../../assets/logo.png'),
    headline: 'Choose with Total Confidence.',
    bodyText:
      'Get clear, unbiased comparisons in minutes. No jargon, no hidden fees, just the perfect coverage at the best price.',
  },
];

export default function WelcomeScreen() {
  const router = useRouter();
  const scrollViewRef = useRef<ScrollView>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleScroll = useCallback((event: any) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / SCREEN_WIDTH);

    setCurrentIndex((prevIndex) => {
      if (prevIndex !== index && index >= 0 && index < onboardingScreens.length) {
        return index;
      }
      return prevIndex;
    });
  }, []);

  const handleNext = useCallback(() => {
    if (currentIndex < onboardingScreens.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      scrollViewRef.current?.scrollTo({
        x: nextIndex * SCREEN_WIDTH,
        animated: true,
      });
      return;
    }

    router.replace('/(tabs)/home');
  }, [currentIndex, router]);

  const handleSkip = () => {
    router.replace('/(tabs)/home');
  };

  const renderBackground = () => (
    <View pointerEvents="none" style={styles.backgroundLayer}>
      <View style={[styles.orb, styles.orbPurple]} />
      <View style={[styles.orb, styles.orbEmerald]} />
      <View style={[styles.orb, styles.orbPink]} />
      <View style={styles.gridOverlay} />
    </View>
  );

  const renderScreen = (screen: OnboardingScreen, index: number) => (
    <View key={index} style={styles.screen}>
      <View style={styles.contentWrapper}>
        <View style={styles.imageGlow} />
        <View style={styles.imageCard}>
          <Image source={screen.image} style={styles.image} resizeMode="contain" />
        </View>

        <View style={styles.textBlock}>
          <Text style={styles.kicker}>GuideMyCover</Text>
          <Text style={styles.headline}>{screen.headline}</Text>
          <Text style={styles.bodyText}>{screen.bodyText}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {renderBackground()}

      <TouchableOpacity style={styles.skipButton} onPress={handleSkip} activeOpacity={0.85}>
        <Text style={styles.skipText}>Skip</Text>
      </TouchableOpacity>

      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
        style={styles.scrollView}
        bounces={false}
      >
        {onboardingScreens.map((screen, index) => renderScreen(screen, index))}
      </ScrollView>

      <View style={styles.indicatorsContainer}>
        {onboardingScreens.map((_, index) => (
          <View
            key={index}
            style={[styles.indicator, currentIndex === index && styles.indicatorActive]}
          />
        ))}
      </View>

      <View style={styles.buttonContainer} pointerEvents="box-none">
        <TouchableOpacity style={styles.primaryButton} onPress={handleNext} activeOpacity={0.9}>
          <Text style={styles.primaryButtonText}>
            {currentIndex < onboardingScreens.length - 1 ? 'Next' : 'Get Started'}
          </Text>
          <Ionicons
            name={currentIndex < onboardingScreens.length - 1 ? 'arrow-forward' : 'sparkles'}
            size={18}
            color="#FFFFFF"
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#050816',
  },
  backgroundLayer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#050816',
  },
  gridOverlay: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.18,
    backgroundColor: 'transparent',
    borderWidth: 0.5,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  orb: {
    position: 'absolute',
    width: 240,
    height: 240,
    borderRadius: 999,
    opacity: 0.28,
  },
  orbPurple: {
    top: 72,
    left: -30,
    backgroundColor: '#7C3AED',
  },
  orbEmerald: {
    top: 180,
    right: -40,
    backgroundColor: '#10B981',
  },
  orbPink: {
    bottom: 24,
    left: 32,
    backgroundColor: '#EC4899',
  },
  skipButton: {
    position: 'absolute',
    top: 10,
    right: 16,
    zIndex: 1000,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  skipText: {
    fontSize: 14,
    color: '#E2E8F0',
    fontWeight: '700',
  },
  scrollView: {
    flex: 1,
    zIndex: 1,
  },
  screen: {
    width: SCREEN_WIDTH,
    flex: 1,
    paddingHorizontal: 28,
    paddingTop: 76,
    paddingBottom: 12,
  },
  contentWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageGlow: {
    position: 'absolute',
    top: '18%',
    width: 180,
    height: 180,
    borderRadius: 999,
    backgroundColor: 'rgba(20, 184, 166, 0.22)',
  },
  imageCard: {
    width: 240,
    height: 240,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 34,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    backgroundColor: 'rgba(255,255,255,0.08)',
    shadowColor: '#000000',
    shadowOpacity: 0.22,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 12 },
    elevation: 10,
  },
  image: {
    width: 170,
    height: 170,
  },
  textBlock: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  kicker: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 1.4,
    textTransform: 'uppercase',
    color: '#6EE7B7',
    marginBottom: 14,
  },
  headline: {
    fontSize: 34,
    fontWeight: '900',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 40,
  },
  bodyText: {
    fontSize: 16,
    color: '#CBD5E1',
    textAlign: 'center',
    lineHeight: 26,
    maxWidth: 320,
  },
  indicatorsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 18,
    gap: 8,
    zIndex: 10,
  },
  indicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'rgba(255,255,255,0.25)',
  },
  indicatorActive: {
    width: 28,
    backgroundColor: '#6EE7B7',
  },
  buttonContainer: {
    paddingHorizontal: 24,
    paddingBottom: 28,
    paddingTop: 6,
    zIndex: 100,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: '#0D9488',
    paddingVertical: 17,
    borderRadius: 18,
    shadowColor: '#10B981',
    shadowOpacity: 0.32,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 10 },
    elevation: 10,
  },
  primaryButtonText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});
