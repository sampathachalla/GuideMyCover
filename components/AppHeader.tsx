import { Image, StyleSheet, Text, View } from 'react-native';
import { Colors } from '../constants/Colors';

export default function AppHeader() {
  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/logo.png')}
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.title}>GuideMyCover</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 56,
    backgroundColor: Colors.mainBackground,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    position: 'absolute',
    left: 16,
    width: 40,
    height: 40,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textColor,
  },
});


