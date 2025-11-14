import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Colors } from '../../constants/Colors';

interface HomeBarProps {
  activeTab?: string;
  onTabPress?: (tab: string) => void;
}

export default function HomeBar({ activeTab = 'home', onTabPress }: HomeBarProps) {
  const tabs = [
    {
      id: 'home',
      icon: 'home-outline',
      activeIcon: 'home',
      iconLib: 'ion',
    },
    {
      id: 'chat',
      icon: 'chatbubble-outline',
      activeIcon: 'chatbubble',
      iconLib: 'ion',
    },
  ];

  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <TouchableOpacity
              key={tab.id}
              style={styles.tabButton}
              onPress={() => onTabPress?.(tab.id)}
              activeOpacity={0.7}
            >
              {tab.iconLib === 'mci' ? (
                <MaterialCommunityIcons
                  name={(isActive ? tab.activeIcon : tab.icon) as any}
                  size={24}
                  color={isActive ? Colors.theme1 : '#FFFFFF'}
                />
              ) : (
                <Ionicons
                  name={(isActive ? tab.activeIcon : tab.icon) as any}
                  size={24}
                  color={isActive ? Colors.theme1 : '#FFFFFF'}
                />
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 8,
    paddingBottom: 8,
    alignItems: 'center',
  },
  container: {
    flexDirection: 'row',
    backgroundColor: Colors.textColor, // Slate Blue Gray
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 30, // Pill-shaped
    justifyContent: 'space-around',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    width: '95%',
  },
  tabButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
  },
});
