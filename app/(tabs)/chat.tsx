import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
    Linking,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { Colors } from '../../constants/Colors';

export default function ChatScreen() {
  const handlePhoneCall = (phoneNumber: string) => {
    const url = `tel:${phoneNumber}`;
    Linking.canOpenURL(url)
      .then((supported) => {
        if (supported) {
          Linking.openURL(url);
        } else {
          console.log("Phone calls are not supported on this device");
        }
      })
      .catch((err) => console.error('An error occurred', err));
  };

  const handleMessage = (phoneNumber: string) => {
    const url = `sms:${phoneNumber}`;
    Linking.canOpenURL(url)
      .then((supported) => {
        if (supported) {
          Linking.openURL(url);
        } else {
          console.log("SMS is not supported on this device");
        }
      })
      .catch((err) => console.error('An error occurred', err));
  };

  const handleEmail = () => {
    const email = 'contact@basey-insurance.com';
    const url = `mailto:${email}`;
    Linking.canOpenURL(url)
      .then((supported) => {
        if (supported) {
          Linking.openURL(url);
        } else {
          console.log("Email is not supported on this device");
        }
      })
      .catch((err) => console.error('An error occurred', err));
  };

  const handleScheduleMeeting = () => {
    const url = 'https://calendly.com/basey-calendar/basey-virtual-discussion';
    if (Platform.OS === 'web') {
      if (typeof window !== 'undefined') {
        window.open(url, '_blank');
      }
    } else {
      Linking.canOpenURL(url)
        .then((supported) => {
          if (supported) {
            Linking.openURL(url);
          } else {
            console.log("Cannot open URL");
          }
        })
        .catch((err) => console.error('An error occurred', err));
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <View style={styles.contactContainer}>
        <View style={styles.contactHeader}>
          <View style={styles.contactIconCircle}>
            <Ionicons name="call" size={32} color="#FFFFFF" />
          </View>
          <Text style={styles.contactTitle}>Contact a Broker</Text>
          <Text style={styles.contactSubtitle}>Choose how you'd like to reach out</Text>
        </View>

        <View style={styles.contactCards}>
          <TouchableOpacity
            style={styles.contactCard}
            onPress={() => handlePhoneCall('9728919567')}
            activeOpacity={0.8}
          >
            <View style={styles.cardContent}>
              <View style={[styles.cardIcon, { backgroundColor: '#D1FAE5' }]}>
                <Ionicons name="call" size={28} color="#059669" />
              </View>
              <View style={styles.cardText}>
                <Text style={styles.cardTitle}>Call Now</Text>
                <Text style={styles.cardSubtitle}>One call away</Text>
              </View>
              <Ionicons name="chevron-forward" size={24} color="#9CA3AF" />
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.contactCard}
            onPress={() => handleMessage('9728919567')}
            activeOpacity={0.8}
          >
            <View style={styles.cardContent}>
              <View style={[styles.cardIcon, { backgroundColor: '#DBEAFE' }]}>
                <Ionicons name="chatbubble" size={28} color="#2563EB" />
              </View>
              <View style={styles.cardText}>
                <Text style={styles.cardTitle}>Send a Text</Text>
                <Text style={styles.cardSubtitle}>Send us a text message</Text>
              </View>
              <Ionicons name="chevron-forward" size={24} color="#9CA3AF" />
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.contactCard}
            onPress={handleEmail}
            activeOpacity={0.8}
          >
            <View style={styles.cardContent}>
              <View style={[styles.cardIcon, { backgroundColor: '#F3E8FF' }]}>
                <Ionicons name="mail" size={28} color="#9333EA" />
              </View>
              <View style={styles.cardText}>
                <Text style={styles.cardTitle}>Send an Email</Text>
                <Text style={styles.cardSubtitle}>contact@basey-insurance.com</Text>
              </View>
              <Ionicons name="chevron-forward" size={24} color="#9CA3AF" />
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.contactCard}
            onPress={handleScheduleMeeting}
            activeOpacity={0.8}
          >
            <View style={styles.cardContent}>
              <View style={[styles.cardIcon, { backgroundColor: '#FED7AA' }]}>
                <Ionicons name="calendar" size={28} color="#EA580C" />
              </View>
              <View style={styles.cardText}>
                <Text style={styles.cardTitle}>Schedule a Meeting</Text>
                <Text style={styles.cardSubtitle}>Book a virtual discussion</Text>
              </View>
              <Ionicons name="chevron-forward" size={24} color="#9CA3AF" />
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EFF6FF',
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  contactContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 20,
  },
  contactHeader: {
    alignItems: 'center',
    marginBottom: 32,
  },
  contactIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#10B981',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  contactTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.textColor,
    marginBottom: 8,
    textAlign: 'center',
  },
  contactSubtitle: {
    fontSize: 16,
    color: Colors.textColor,
    opacity: 0.7,
    textAlign: 'center',
  },
  contactCards: {
    width: '100%',
    gap: 16,
  },
  contactCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardIcon: {
    width: 56,
    height: 56,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  cardText: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textColor,
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 14,
    color: Colors.textColor,
    opacity: 0.6,
  },
});
