import { Stack, useRouter, useSegments } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import HomeBar from '../HomeBar/homebar';

export default function TabsLayout() {
  const router = useRouter();
  const segments = useSegments();
  
  // Determine active tab based on current route
  const getActiveTab = () => {
    const currentPath = segments[segments.length - 1];
    const routeToTabMap: { [key: string]: string } = {
      home: 'home',
      chat: 'chat',
    };
    return routeToTabMap[currentPath] || 'home';
  };
  
  const [activeTab, setActiveTab] = useState(getActiveTab);

  useEffect(() => {
    setActiveTab(getActiveTab());
  }, [segments]);

  const handleTabPress = (tab: string) => {
    setActiveTab(tab);
    // Map tab IDs to routes
    const routeMap: { [key: string]: string } = {
      home: '/(tabs)/home',
      chat: '/(tabs)/chat',
    };
    const route = routeMap[tab];
    if (route) {
      router.push(route as any);
    }
  };

  return (
    <View style={styles.container}>
      {/* Page Content */}
      <View style={styles.content}>
        <Stack
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen
            name="home"
            options={{
              title: 'Home',
            }}
          />
          <Stack.Screen
            name="chat"
            options={{
              title: 'Chat',
            }}
          />
        </Stack>
      </View>
      
      {/* Bottom Navigation Bar - Fixed Position */}
      <View style={styles.bottomBar}>
        <SafeAreaView edges={['bottom']}>
          <HomeBar activeTab={activeTab} onTabPress={handleTabPress} />
        </SafeAreaView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
  },
});
