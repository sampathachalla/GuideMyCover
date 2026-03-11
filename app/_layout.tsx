import { Stack, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { LogBox, Platform, View, StyleSheet } from 'react-native';
// Update the import path if ThemeContext is actually in 'guidemycover/context/ThemeContext'
import { ThemeProvider, useThemeContext } from '../context/ThemeContext';
import { Colors } from '../constants/Colors';
import AppHeader from '../components/AppHeader';

// Load Tailwind styles only on web (for NativeWind)
if (typeof window !== 'undefined') {
  require('../global.css');
}

LogBox.ignoreLogs([
  'SafeAreaView has been deprecated and will be removed in a future release.',
]);

// 🔄 Custom inner layout wrapper to apply dynamic dark mode class
function ThemedLayoutWrapper() {
  const { theme } = useThemeContext();
  const segments = useSegments();
  
  // Hide header on welcome screen
  const isWelcomeScreen = segments[0] === 'Welcome';
  const headerShown = !isWelcomeScreen;

  return (
    <SafeAreaProvider>
      {/* ⚠️ Apply dark mode class based on theme */}
      <View style={[styles.container, theme === 'dark' && styles.darkContainer]}>
        <SafeAreaView style={[styles.safeArea, theme === 'dark' && styles.darkSafeArea]} edges={['top', 'left', 'right']}>
          <Stack
            screenOptions={{
              headerShown: headerShown,
              header: () => <AppHeader />,
            }}
          />
          <StatusBar
            style={Platform.OS === 'android' ? 'light' : 'auto'}
            backgroundColor={Platform.OS === 'android' ? '#121212' : undefined}
          />
        </SafeAreaView>
      </View>
    </SafeAreaProvider>
  );
}

// ✅ Final Export
export default function Layout() {
  return (
    <ThemeProvider>
      <ThemedLayoutWrapper />
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.mainBackground,
  },
  darkContainer: {
    backgroundColor: '#151718',
  },
  safeArea: {
    flex: 1,
    backgroundColor: Colors.mainBackground,
  },
  darkSafeArea: {
    backgroundColor: '#151718',
  },
});
