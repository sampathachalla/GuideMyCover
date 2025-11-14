import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  Alert,
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Colors } from '../../constants/Colors';

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: string;
  zipCode: string;
  desiredPremium: string;
  smokingStatus: string;
}

type ViewType = 'menu' | 'contact' | 'life';

export default function HomeScreen() {
  const [view, setView] = useState<ViewType>('menu');
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    zipCode: '',
    desiredPremium: '',
    smokingStatus: '',
  });
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSelection = (type: string) => {
    if (type === 'health') {
      const url = 'https://www.healthsherpa.com/?_agent_id=thomas-basey-ACA';
      if (Platform.OS === 'web') {
        if (typeof window !== 'undefined') {
          window.open(url, '_blank');
        }
      } else {
        Linking.openURL(url);
      }
    } else if (type === 'medicare') {
      const url = 'https://www.planenroll.com/medicare/products?purl=dZZl56fi';
      if (Platform.OS === 'web') {
        if (typeof window !== 'undefined') {
          window.open(url, '_blank');
        }
      } else {
        Linking.openURL(url);
      }
    } else if (type === 'life') {
      setView('life');
    } else if (type === 'contact') {
      setView('contact');
    } else if (type === 'more') {
      const url = 'https://brokers.insuranceforeveryone.com/?Portal=18875011';
      if (Platform.OS === 'web') {
        if (typeof window !== 'undefined') {
          window.open(url, '_blank');
        }
      } else {
        Linking.openURL(url);
      }
    }
  };

  const handleContact = (method: string) => {
    if (method === 'text') {
      Linking.openURL('sms:9728919567');
    } else if (method === 'email') {
      Linking.openURL('mailto:contact@basey-insurance.com');
    } else if (method === 'call') {
      Linking.openURL('tel:8176318312');
    }
  };

  const handleInputChange = (name: keyof FormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    setErrorMessage('');
    setSubmitStatus('idle');

    if (!formData.firstName || !formData.lastName || !formData.dateOfBirth || !formData.gender || !formData.zipCode || !formData.smokingStatus) {
      setErrorMessage('Please fill out all required fields.');
      return;
    }

    if (!formData.email && !formData.phone) {
      setErrorMessage('Please provide either an email address or phone number.');
      return;
    }

    if (!/^\d{5}$/.test(formData.zipCode)) {
      setErrorMessage('Please enter a valid 5-digit zip code.');
      return;
    }

    setSubmitStatus('submitting');

    const scriptURL = 'https://script.google.com/macros/s/AKfycbzKZzc0RpGJOsZ_tjjmn1QNcSYVpPiTLzhLTdrFEGh8WAulDjLKs2TCwizwKD61fvQbvQ/exec';
    
    const params = new URLSearchParams({
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      dateOfBirth: formData.dateOfBirth,
      gender: formData.gender,
      zipCode: formData.zipCode,
      desiredPremium: formData.desiredPremium,
      smokingStatus: formData.smokingStatus,
    });

    try {
      await fetch(`${scriptURL}?${params.toString()}`, {
        method: 'GET',
        mode: 'no-cors',
      });

      setTimeout(() => {
        setSubmitStatus('success');
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          dateOfBirth: '',
          gender: '',
          zipCode: '',
          desiredPremium: '',
          smokingStatus: '',
        });
        setTimeout(() => {
          setView('menu');
          setSubmitStatus('idle');
        }, 2000);
      }, 500);
    } catch (error) {
      setSubmitStatus('error');
      Alert.alert('Error', 'There was an error submitting your information. Please try again.');
    }
  };

  const handleBack = () => {
    setView('menu');
    setSubmitStatus('idle');
    setErrorMessage('');
  };

  if (view === 'contact') {
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
        <View style={styles.headerContainer}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <Ionicons name="arrow-back" size={20} color={Colors.barBackground} />
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>
        </View>

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
              onPress={() => handleContact('text')}
              activeOpacity={0.8}
            >
              <View style={styles.cardContent}>
                <View style={[styles.cardIcon, { backgroundColor: '#DBEAFE' }]}>
                  <Ionicons name="chatbubble" size={28} color="#2563EB" />
                </View>
                <View style={styles.cardText}>
                  <Text style={styles.cardTitle}>Send a Text</Text>
                  <Text style={styles.cardSubtitle}>(972) 891-9567</Text>
                </View>
                <Ionicons name="chevron-forward" size={24} color="#9CA3AF" />
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.contactCard}
              onPress={() => handleContact('email')}
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
              onPress={() => handleContact('call')}
              activeOpacity={0.8}
            >
              <View style={styles.cardContent}>
                <View style={[styles.cardIcon, { backgroundColor: '#D1FAE5' }]}>
                  <Ionicons name="call" size={28} color="#059669" />
                </View>
                <View style={styles.cardText}>
                  <Text style={styles.cardTitle}>Call Now</Text>
                  <Text style={styles.cardSubtitle}>(817) 631-8312</Text>
                </View>
                <Ionicons name="chevron-forward" size={24} color="#9CA3AF" />
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    );
  }

  if (view === 'life') {
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
        <View style={styles.headerContainer}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <Ionicons name="arrow-back" size={20} color={Colors.barBackground} />
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.formContainer}>
          <View style={styles.formHeader}>
            <View style={[styles.formIconCircle, { backgroundColor: '#D1FAE5' }]}>
              <Ionicons name="shield" size={32} color="#059669" />
            </View>
            <Text style={styles.formTitle}>Life Insurance Quote</Text>
            <Text style={styles.formSubtitle}>Fill out your information to get started</Text>
            <Text style={styles.requiredNote}>* Required fields</Text>
          </View>

          <View style={styles.formFields}>
            <View style={styles.row}>
              <View style={styles.halfWidth}>
                <Text style={styles.label}>First Name *</Text>
                <TextInput
                  style={styles.input}
                  value={formData.firstName}
                  onChangeText={(value) => handleInputChange('firstName', value)}
                  placeholder="First Name"
                />
              </View>
              <View style={styles.halfWidth}>
                <Text style={styles.label}>Last Name *</Text>
                <TextInput
                  style={styles.input}
                  value={formData.lastName}
                  onChangeText={(value) => handleInputChange('lastName', value)}
                  placeholder="Last Name"
                />
              </View>
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Email Address</Text>
              <TextInput
                style={styles.input}
                value={formData.email}
                onChangeText={(value) => handleInputChange('email', value)}
                placeholder="your.email@example.com"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Phone Number</Text>
              <TextInput
                style={styles.input}
                value={formData.phone}
                onChangeText={(value) => handleInputChange('phone', value)}
                placeholder="(555) 123-4567"
                keyboardType="phone-pad"
              />
              <Text style={styles.helperText}>* Provide at least email or phone number</Text>
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Date of Birth *</Text>
              <TextInput
                style={styles.input}
                value={formData.dateOfBirth}
                onChangeText={(value) => handleInputChange('dateOfBirth', value)}
                placeholder="YYYY-MM-DD"
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Gender *</Text>
              <View style={styles.radioGroup}>
                <TouchableOpacity
                  style={styles.radioOption}
                  onPress={() => handleInputChange('gender', 'Male')}
                >
                  <View style={styles.radio}>
                    {formData.gender === 'Male' && <View style={styles.radioSelected} />}
                  </View>
                  <Text style={styles.radioLabel}>Male</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.radioOption}
                  onPress={() => handleInputChange('gender', 'Female')}
                >
                  <View style={styles.radio}>
                    {formData.gender === 'Female' && <View style={styles.radioSelected} />}
                  </View>
                  <Text style={styles.radioLabel}>Female</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Zip Code *</Text>
              <TextInput
                style={styles.input}
                value={formData.zipCode}
                onChangeText={(value) => handleInputChange('zipCode', value)}
                placeholder="12345"
                keyboardType="numeric"
                maxLength={5}
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Desired Monthly Premium</Text>
              <TextInput
                style={styles.input}
                value={formData.desiredPremium}
                onChangeText={(value) => handleInputChange('desiredPremium', value)}
                placeholder="$100"
                keyboardType="numeric"
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Have you used any tobacco products within the last 12 months? *</Text>
              <View style={styles.radioGroup}>
                <TouchableOpacity
                  style={styles.radioOption}
                  onPress={() => handleInputChange('smokingStatus', 'Yes')}
                >
                  <View style={styles.radio}>
                    {formData.smokingStatus === 'Yes' && <View style={styles.radioSelected} />}
                  </View>
                  <Text style={styles.radioLabel}>Yes</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.radioOption}
                  onPress={() => handleInputChange('smokingStatus', 'No')}
                >
                  <View style={styles.radio}>
                    {formData.smokingStatus === 'No' && <View style={styles.radioSelected} />}
                  </View>
                  <Text style={styles.radioLabel}>No</Text>
                </TouchableOpacity>
              </View>
            </View>

            {errorMessage ? (
              <View style={styles.errorBox}>
                <Text style={styles.errorText}>⚠ {errorMessage}</Text>
              </View>
            ) : null}

            {submitStatus === 'success' ? (
              <View style={styles.successBox}>
                <Text style={styles.successText}>✓ Thank you! Your information has been submitted successfully.</Text>
              </View>
            ) : null}

            {submitStatus === 'error' ? (
              <View style={styles.errorBox}>
                <Text style={styles.errorText}>⚠ There was an error submitting your information. Please try again.</Text>
              </View>
            ) : null}

            <TouchableOpacity
              style={[styles.submitButton, submitStatus === 'submitting' && styles.submitButtonDisabled]}
              onPress={handleSubmit}
              disabled={submitStatus === 'submitting'}
              activeOpacity={0.8}
            >
              <Text style={styles.submitButtonText}>
                {submitStatus === 'submitting' ? 'Submitting...' : 'Submit Quote Request'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <View style={styles.menuContainer}>
        <View style={styles.menuHeader}>
          <View style={styles.menuIconCircle}>
            <Ionicons name="shield" size={40} color="#FFFFFF" />
          </View>
          <Text style={styles.menuTitle}>GuideMyCover</Text>
          <Text style={styles.menuSubtitle}>Choose the type of insurance you'd like to explore</Text>
        </View>

        <View style={styles.menuCards}>
          <TouchableOpacity
            style={styles.menuCard}
            onPress={() => handleSelection('health')}
            activeOpacity={0.8}
          >
            <View style={styles.cardContent}>
              <View style={[styles.cardIcon, { backgroundColor: '#DBEAFE' }]}>
                <Ionicons name="cart" size={28} color="#2563EB" />
              </View>
              <View style={styles.cardText}>
                <Text style={styles.cardTitle}>Health Insurance</Text>
                <Text style={styles.cardSubtitle}>Explore individual and family plan options</Text>
              </View>
              <Ionicons name="chevron-forward" size={24} color="#9CA3AF" />
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuCard}
            onPress={() => handleSelection('medicare')}
            activeOpacity={0.8}
          >
            <View style={styles.cardContent}>
              <View style={[styles.cardIcon, { backgroundColor: '#FCE7F3' }]}>
                <Ionicons name="heart" size={28} color="#DB2777" />
              </View>
              <View style={styles.cardText}>
                <Text style={styles.cardTitle}>Medicare</Text>
                <Text style={styles.cardSubtitle}>Browse Medicare coverage options</Text>
              </View>
              <Ionicons name="chevron-forward" size={24} color="#9CA3AF" />
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuCard}
            onPress={() => handleSelection('life')}
            activeOpacity={0.8}
          >
            <View style={styles.cardContent}>
              <View style={[styles.cardIcon, { backgroundColor: '#D1FAE5' }]}>
                <Ionicons name="shield" size={28} color="#059669" />
              </View>
              <View style={styles.cardText}>
                <Text style={styles.cardTitle}>Life Insurance</Text>
                <Text style={styles.cardSubtitle}>Get a personalized quote</Text>
              </View>
              <Ionicons name="chevron-forward" size={24} color="#9CA3AF" />
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuCard}
            onPress={() => handleSelection('more')}
            activeOpacity={0.8}
          >
            <View style={styles.cardContent}>
              <View style={[styles.cardIcon, { backgroundColor: '#FED7AA' }]}>
                <Ionicons name="grid" size={28} color="#EA580C" />
              </View>
              <View style={styles.cardText}>
                <Text style={styles.cardTitle}>More Insurance Options</Text>
                <Text style={styles.cardSubtitle}>Dental, Vision, and more</Text>
              </View>
              <Ionicons name="chevron-forward" size={24} color="#9CA3AF" />
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Powered by{' '}
            <Text
              style={styles.footerLink}
              onPress={() => {
                const url = 'https://dojoga.io/';
                if (Platform.OS === 'web') {
                  if (typeof window !== 'undefined') {
                    window.open(url, '_blank');
                  }
                } else {
                  Linking.openURL(url);
                }
              }}
            >
              Dojoga.io
            </Text>
          </Text>
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
  headerContainer: {
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 14,
    color: Colors.barBackground,
    fontWeight: '500',
    marginLeft: 4,
  },
  menuContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 20,
    alignItems: 'center',
  },
  menuHeader: {
    alignItems: 'center',
    marginBottom: 32,
  },
  menuIconCircle: {
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
  menuTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: Colors.textColor,
    marginBottom: 8,
  },
  menuSubtitle: {
    fontSize: 16,
    color: Colors.textColor,
    opacity: 0.7,
    textAlign: 'center',
  },
  menuCards: {
    width: '100%',
    gap: 16,
    marginBottom: 32,
  },
  menuCard: {
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
  contactContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
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
  formContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
  },
  formHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  formIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  formTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.textColor,
    marginBottom: 8,
    textAlign: 'center',
  },
  formSubtitle: {
    fontSize: 14,
    color: Colors.textColor,
    opacity: 0.7,
    textAlign: 'center',
    marginBottom: 4,
  },
  requiredNote: {
    fontSize: 12,
    color: Colors.textColor,
    opacity: 0.5,
    marginTop: 8,
  },
  formFields: {
    gap: 16,
  },
  field: {
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  halfWidth: {
    flex: 1,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textColor,
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: Colors.textColor,
  },
  helperText: {
    fontSize: 12,
    color: Colors.textColor,
    opacity: 0.5,
    marginTop: 4,
  },
  radioGroup: {
    flexDirection: 'row',
    gap: 24,
    marginTop: 8,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#10B981',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  radioSelected: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#10B981',
  },
  radioLabel: {
    fontSize: 16,
    color: Colors.textColor,
  },
  errorBox: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
  },
  errorText: {
    fontSize: 14,
    color: '#991B1B',
  },
  successBox: {
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#BBF7D0',
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
  },
  successText: {
    fontSize: 14,
    color: '#166534',
  },
  submitButton: {
    backgroundColor: '#10B981',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  submitButtonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  footer: {
    alignItems: 'center',
    marginTop: 32,
  },
  footerText: {
    fontSize: 14,
    color: Colors.textColor,
    opacity: 0.5,
  },
  footerLink: {
    color: '#2563EB',
    fontWeight: '500',
  },
});
