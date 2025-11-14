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
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../constants/Colors';

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
    bodyText: 'Welcome to GuideMyCover. Finding the right insurance can be complex and overwhelming. We make it simple.',
  },
  {
    image: require('../../assets/logo.png'),
    headline: 'Your Personal Insurance Navigator',
    bodyText: 'Answer a few simple questions, and our smart technology scans, compares, and recommends the best policies for your unique needs.',
  },
  {
    image: require('../../assets/logo.png'),
    headline: 'Choose with Total Confidence.',
    bodyText: 'Get clear, unbiased comparisons in minutes. No jargon, no hidden fees—just the perfect coverage at the best price.',
  },
];

export default function WelcomeScreen() {
  const router = useRouter();
  const scrollViewRef = useRef<ScrollView>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const insets = useSafeAreaInsets();

  const handleScroll = useCallback((event: any) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / SCREEN_WIDTH);
    // Only update if index actually changed to prevent infinite loops
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
    }
  }, [currentIndex]);

  const handleSkip = () => {
    // Navigate to main app - adjust route as needed
    router.replace('/(tabs)/home');
  };

  const handleGetStarted = () => {
    // Navigate to signup or main app - adjust route as needed
    router.replace('/(tabs)/home');
  };


  const renderScreen = (screen: OnboardingScreen, index: number) => {
    return (
      <View key={index} style={styles.screen}>
        <View style={styles.contentWrapper}>
          <View style={styles.imageContainer}>
            <Image source={screen.image} style={styles.image} resizeMode="contain" />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.headline}>{screen.headline}</Text>
            <Text style={styles.bodyText}>{screen.bodyText}</Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Skip Button */}
      <TouchableOpacity 
        style={[styles.skipButton, { top: insets.top + 8 }]} 
        onPress={handleSkip}
      >
        <Text style={styles.skipText}>Skip</Text>
      </TouchableOpacity>

      {/* Carousel */}
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
        style={styles.scrollView}
        scrollEnabled={true}
        bounces={false}
      >
        {onboardingScreens.map((screen, index) => renderScreen(screen, index))}
      </ScrollView>

      {/* Page Indicators */}
      <View style={styles.indicatorsContainer}>
        {onboardingScreens.map((_, index) => (
          <View
            key={index}
            style={[
              styles.indicator,
              currentIndex === index && styles.indicatorActive,
            ]}
          />
        ))}
      </View>

      {/* Action Buttons */}
      <View style={styles.buttonContainer} pointerEvents="box-none">
        {currentIndex < onboardingScreens.length - 1 ? (
          <TouchableOpacity 
            style={styles.nextButton} 
            onPress={handleNext}
            activeOpacity={0.8}
          >
            <Text style={styles.nextButtonText}>Next</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity 
            style={styles.getStartedButton} 
            onPress={handleGetStarted}
            activeOpacity={0.8}
          >
            <Text style={styles.getStartedButtonText}>Get Started</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.mainBackground,
  },
  skipButton: {
    position: 'absolute',
    left: 20,
    zIndex: 1000,
    padding: 10,
    paddingTop: 8,
    paddingBottom: 8,
  },
  skipText: {
    fontSize: 16,
    color: Colors.barBackground,
    fontWeight: '500',
  },
  scrollView: {
    flex: 1,
    zIndex: 1,
  },
  screen: {
    width: SCREEN_WIDTH,
    flex: 1,
    paddingHorizontal: 32,
    paddingTop: 80,
    paddingBottom: 20,
  },
  contentWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
    flexShrink: 1,
  },
  image: {
    width: 280,
    height: 280,
    maxWidth: '85%',
  },
  textContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: 20,
    flexShrink: 1,
  },
  headline: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.textColor,
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 32,
    paddingHorizontal: 10,
  },
  bodyText: {
    fontSize: 15,
    color: Colors.textColor,
    textAlign: 'center',
    lineHeight: 22,
    opacity: 0.8,
    paddingHorizontal: 10,
  },
  indicatorsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
    gap: 8,
    zIndex: 10,
    backgroundColor: Colors.mainBackground,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.barBackground,
    opacity: 0.3,
  },
  indicatorActive: {
    opacity: 1,
    width: 24,
    backgroundColor: Colors.barBackground,
  },
  buttonContainer: {
    paddingHorizontal: 32,
    paddingBottom: 30,
    paddingTop: 10,
    zIndex: 100,
    backgroundColor: Colors.mainBackground,
  },
  nextButton: {
    backgroundColor: Colors.barBackground,
    paddingVertical: 16,
    paddingHorizontal: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  getStartedButton: {
    backgroundColor: Colors.barBackground,
    paddingVertical: 16,
    paddingHorizontal: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  getStartedButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
});

