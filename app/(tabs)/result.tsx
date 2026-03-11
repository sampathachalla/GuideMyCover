import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function ResultScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Results</Text>
      <Text style={styles.subtitle}>This screen is ready for future quote results.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    backgroundColor: '#050816',
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 22,
    color: '#CBD5E1',
    textAlign: 'center',
  },
});
