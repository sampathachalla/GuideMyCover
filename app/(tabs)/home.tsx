import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

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
type SelectionType = 'health' | 'medicare' | 'life' | 'contact' | 'more';
type ContactMethod = 'text' | 'email' | 'call';
type SubmitStatus = 'idle' | 'submitting' | 'success' | 'error';

const initialFormData: FormData = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  dateOfBirth: '',
  gender: '',
  zipCode: '',
  desiredPremium: '',
  smokingStatus: '',
};

const externalLinks: Record<Exclude<SelectionType, 'life' | 'contact'>, string> = {
  health: 'https://www.healthsherpa.com/?_agent_id=thomas-basey-ACA',
  medicare: 'https://www.planenroll.com/medicare/products?purl=dZZl56fi',
  more: 'https://brokers.insuranceforeveryone.com/?Portal=18875011',
};

export default function HomeScreen() {
  const [view, setView] = useState<ViewType>('menu');
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const openUrl = async (url: string) => {
    try {
      await Linking.openURL(url);
    } catch {
      Alert.alert('Unable to open link', 'Please try again in a moment.');
    }
  };

  const handleSelection = (type: SelectionType) => {
    if (type === 'life' || type === 'contact') {
      setView(type);
      setErrorMessage('');
      setSubmitStatus('idle');
      return;
    }

    void openUrl(externalLinks[type]);
  };

  const handleContact = (method: ContactMethod) => {
    if (method === 'text') {
      void openUrl('sms:9728919567');
      return;
    }

    if (method === 'email') {
      void openUrl('mailto:contact@basey-insurance.com');
      return;
    }

    void openUrl('tel:8176318312');
  };

  const handleInputChange = (name: keyof FormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    setErrorMessage('');
    setSubmitStatus('idle');

    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.dateOfBirth ||
      !formData.gender ||
      !formData.zipCode ||
      !formData.smokingStatus
    ) {
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

    const scriptURL =
      'https://script.google.com/macros/s/AKfycbzKZzc0RpGJOsZ_tjjmn1QNcSYVpPiTLzhLTdrFEGh8WAulDjLKs2TCwizwKD61fvQbvQ/exec';

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
      });

      setSubmitStatus('success');
      setFormData(initialFormData);

      setTimeout(() => {
        setView('menu');
        setSubmitStatus('idle');
      }, 2000);
    } catch {
      setSubmitStatus('error');
      setErrorMessage('There was an error submitting your information. Please try again.');
    }
  };

  const handleBack = () => {
    setView('menu');
    setSubmitStatus('idle');
    setErrorMessage('');
  };

  const renderBackground = () => (
    <View pointerEvents="none" style={styles.backgroundLayer}>
      <View style={[styles.orb, styles.orbPurple]} />
      <View style={[styles.orb, styles.orbEmerald]} />
      <View style={[styles.orb, styles.orbPink]} />
      <View style={styles.gridOverlay} />
    </View>
  );

  const renderBackButton = () => (
    <TouchableOpacity onPress={handleBack} style={styles.backButton} activeOpacity={0.8}>
      <Ionicons name="arrow-back" size={18} color="#6EE7B7" />
      <Text style={styles.backText}>Back</Text>
    </TouchableOpacity>
  );

  const renderMenuCard = (
    title: string,
    subtitle: string,
    icon: keyof typeof Ionicons.glyphMap,
    iconBackground: string,
    iconColor: string,
    sparkleColor: string,
    onPress: () => void
  ) => (
    <TouchableOpacity style={styles.glassCard} onPress={onPress} activeOpacity={0.88}>
      <View style={styles.cardRow}>
        <View style={[styles.cardIconWrap, { backgroundColor: iconBackground }]}>
          <Ionicons name={icon} size={28} color={iconColor} />
        </View>
        <View style={styles.cardTextBlock}>
          <Text style={styles.cardTitle}>{title}</Text>
          <Text style={styles.cardSubtitle}>{subtitle}</Text>
        </View>
        <Ionicons name="sparkles" size={18} color={sparkleColor} />
      </View>
    </TouchableOpacity>
  );

  const renderRadioOption = (
    label: string,
    value: string,
    field: keyof Pick<FormData, 'gender' | 'smokingStatus'>
  ) => {
    const isSelected = formData[field] === value;

    return (
      <TouchableOpacity
        key={value}
        style={[styles.radioPill, isSelected && styles.radioPillSelected]}
        activeOpacity={0.85}
        onPress={() => handleInputChange(field, value)}
      >
        <View style={[styles.radioOuter, isSelected && styles.radioOuterSelected]}>
          {isSelected ? <View style={styles.radioInner} /> : null}
        </View>
        <Text style={styles.radioText}>{label}</Text>
      </TouchableOpacity>
    );
  };

  const renderTextField = (
    label: string,
    name: keyof FormData,
    options?: {
      placeholder?: string;
      keyboardType?: 'default' | 'email-address' | 'phone-pad' | 'number-pad';
      autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
      maxLength?: number;
      helperText?: string;
    }
  ) => (
    <View style={styles.fieldBlock}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        style={styles.input}
        value={formData[name]}
        onChangeText={(value) => handleInputChange(name, value)}
        placeholder={options?.placeholder}
        placeholderTextColor="#94A3B8"
        keyboardType={options?.keyboardType ?? 'default'}
        autoCapitalize={options?.autoCapitalize ?? 'words'}
        maxLength={options?.maxLength}
      />
      {options?.helperText ? <Text style={styles.helperText}>{options.helperText}</Text> : null}
    </View>
  );

  const renderContactView = () => (
    <View style={styles.pageWrap}>
      {renderBackButton()}
      <View style={styles.centeredHeader}>
        <View style={styles.heroHalo} />
        <View style={[styles.heroIconShell, styles.heroIconContact]}>
          <Ionicons name="umbrella" size={44} color="#FFFFFF" />
        </View>
        <Text style={styles.sectionTitle}>Contact a Broker</Text>
        <Text style={styles.sectionSubtitle}>Choose your preferred contact method</Text>
      </View>

      <View style={styles.stack}>
        {renderMenuCard(
          'Send a Text',
          '(972) 891-9567',
          'chatbubble-ellipses',
          'rgba(37, 99, 235, 0.24)',
          '#60A5FA',
          '#60A5FA',
          () => handleContact('text')
        )}
        {renderMenuCard(
          'Send an Email',
          'contact@basey-insurance.com',
          'mail',
          'rgba(147, 51, 234, 0.24)',
          '#C084FC',
          '#C084FC',
          () => handleContact('email')
        )}
        {renderMenuCard(
          'Call Now',
          '(817) 631-8312',
          'call',
          'rgba(16, 185, 129, 0.24)',
          '#34D399',
          '#34D399',
          () => handleContact('call')
        )}
      </View>
    </View>
  );

  const renderLifeView = () => (
    <View style={styles.pageWrap}>
      {renderBackButton()}
      <View style={styles.formShell}>
        <View style={styles.formHeader}>
          <View style={styles.heroHaloSmall} />
          <View style={[styles.heroIconShell, styles.heroIconShield]}>
            <Ionicons name="shield-checkmark" size={32} color="#FFFFFF" />
          </View>
          <Text style={styles.formTitle}>Life Insurance Quote</Text>
          <Text style={styles.formSubtitle}>Fill out your information to get started</Text>
          <Text style={styles.requiredText}>* Required fields</Text>
        </View>

        <View style={styles.formFields}>
          <View style={styles.formRow}>
            <View style={styles.halfField}>{renderTextField('First Name *', 'firstName')}</View>
            <View style={styles.halfField}>{renderTextField('Last Name *', 'lastName')}</View>
          </View>

          {renderTextField('Email Address', 'email', {
            placeholder: 'your.email@example.com',
            keyboardType: 'email-address',
            autoCapitalize: 'none',
          })}

          {renderTextField('Phone Number', 'phone', {
            placeholder: '(555) 123-4567',
            keyboardType: 'phone-pad',
            autoCapitalize: 'none',
            helperText: '* Provide at least email or phone number',
          })}

          {renderTextField('Date of Birth *', 'dateOfBirth', {
            placeholder: 'YYYY-MM-DD',
            autoCapitalize: 'none',
          })}

          <View style={styles.fieldBlock}>
            <Text style={styles.fieldLabel}>Gender *</Text>
            <View style={styles.radioRow}>
              {renderRadioOption('Male', 'Male', 'gender')}
              {renderRadioOption('Female', 'Female', 'gender')}
            </View>
          </View>

          {renderTextField('Zip Code *', 'zipCode', {
            placeholder: '12345',
            keyboardType: 'number-pad',
            autoCapitalize: 'none',
            maxLength: 5,
          })}

          {renderTextField('Desired Monthly Premium', 'desiredPremium', {
            placeholder: '$100',
            keyboardType: 'default',
            autoCapitalize: 'none',
          })}

          <View style={styles.fieldBlock}>
            <Text style={styles.fieldLabel}>
              Have you used any tobacco products within the last 12 months? *
            </Text>
            <View style={styles.radioRow}>
              {renderRadioOption('Yes', 'Yes', 'smokingStatus')}
              {renderRadioOption('No', 'No', 'smokingStatus')}
            </View>
          </View>

          {errorMessage ? (
            <View style={styles.errorBanner}>
              <Text style={styles.bannerText}>Warning: {errorMessage}</Text>
            </View>
          ) : null}

          {submitStatus === 'success' ? (
            <View style={styles.successBanner}>
              <Text style={styles.bannerText}>Submitted successfully. Thank you.</Text>
            </View>
          ) : null}

          <TouchableOpacity
            style={[styles.submitButton, submitStatus === 'submitting' && styles.submitButtonDisabled]}
            activeOpacity={0.9}
            onPress={() => void handleSubmit()}
            disabled={submitStatus === 'submitting'}
          >
            <Text style={styles.submitButtonText}>
              {submitStatus === 'submitting' ? 'Submitting...' : 'Submit Quote Request'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const renderMenuView = () => (
    <View style={styles.pageWrap}>
      <View style={styles.menuHeader}>
        <View style={styles.brandHalo} />
        <View style={styles.brandBadge}>
          <Ionicons name="umbrella" size={52} color="#FFFFFF" />
        </View>
        <Text style={styles.brandTitle}>GuideMyCover</Text>
        <Text style={styles.brandSubtitle}>Your premium insurance companion</Text>
      </View>

      <View style={styles.stack}>
        {renderMenuCard(
          'Health Insurance',
          'Explore individual and family plan options',
          'cart',
          'rgba(37, 99, 235, 0.24)',
          '#60A5FA',
          '#60A5FA',
          () => handleSelection('health')
        )}
        {renderMenuCard(
          'Medicare',
          'Browse Medicare coverage options',
          'heart',
          'rgba(219, 39, 119, 0.24)',
          '#F472B6',
          '#F472B6',
          () => handleSelection('medicare')
        )}
        {renderMenuCard(
          'Life Insurance',
          'Get a personalized quote',
          'shield-checkmark',
          'rgba(16, 185, 129, 0.24)',
          '#34D399',
          '#34D399',
          () => handleSelection('life')
        )}
        {renderMenuCard(
          'More Insurance Options',
          'Dental, Vision, and more',
          'grid',
          'rgba(249, 115, 22, 0.24)',
          '#FB923C',
          '#FB923C',
          () => handleSelection('more')
        )}
        {renderMenuCard(
          'Contact a Broker',
          'Speak with an insurance expert',
          'call',
          'rgba(139, 92, 246, 0.24)',
          '#A78BFA',
          '#A78BFA',
          () => handleSelection('contact')
        )}
      </View>

      <Text style={styles.footerText}>
        Powered by{' '}
        <Text style={styles.footerLink} onPress={() => void openUrl('https://dojoga.io/')}>
          Dojoga.io
        </Text>
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {renderBackground()}
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          style={styles.flex}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {view === 'contact' ? renderContactView() : null}
          {view === 'life' ? renderLifeView() : null}
          {view === 'menu' ? renderMenuView() : null}
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
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
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 120,
  },
  pageWrap: {
    width: '100%',
    maxWidth: 680,
    alignSelf: 'center',
  },
  backButton: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 6,
    marginBottom: 20,
  },
  backText: {
    color: '#6EE7B7',
    fontSize: 14,
    fontWeight: '600',
  },
  centeredHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  heroHalo: {
    position: 'absolute',
    width: 110,
    height: 110,
    borderRadius: 999,
    backgroundColor: 'rgba(16, 185, 129, 0.32)',
    top: -12,
  },
  heroHaloSmall: {
    position: 'absolute',
    width: 88,
    height: 88,
    borderRadius: 999,
    backgroundColor: 'rgba(16, 185, 129, 0.28)',
    top: 0,
  },
  heroIconShell: {
    width: 82,
    height: 82,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
    shadowColor: '#10B981',
    shadowOpacity: 0.3,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 10,
  },
  heroIconContact: {
    backgroundColor: '#0F766E',
  },
  heroIconShield: {
    backgroundColor: '#059669',
  },
  sectionTitle: {
    fontSize: 34,
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 10,
  },
  sectionSubtitle: {
    fontSize: 16,
    lineHeight: 22,
    color: '#CBD5E1',
    textAlign: 'center',
  },
  stack: {
    gap: 14,
  },
  glassCard: {
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    backgroundColor: 'rgba(255,255,255,0.08)',
    padding: 20,
    shadowColor: '#000000',
    shadowOpacity: 0.18,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 12 },
    elevation: 8,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardIconWrap: {
    width: 64,
    height: 64,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  cardTextBlock: {
    flex: 1,
  },
  cardTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 4,
  },
  cardSubtitle: {
    color: '#CBD5E1',
    fontSize: 13,
    lineHeight: 18,
  },
  formShell: {
    borderRadius: 28,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    backgroundColor: 'rgba(255,255,255,0.08)',
    padding: 20,
    shadowColor: '#000000',
    shadowOpacity: 0.2,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 12 },
    elevation: 10,
  },
  formHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  formTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 8,
  },
  formSubtitle: {
    color: '#CBD5E1',
    fontSize: 14,
    marginBottom: 8,
    textAlign: 'center',
  },
  requiredText: {
    color: '#6EE7B7',
    fontSize: 12,
    fontWeight: '700',
  },
  formFields: {
    gap: 14,
  },
  formRow: {
    flexDirection: 'row',
    gap: 12,
  },
  halfField: {
    flex: 1,
  },
  fieldBlock: {
    gap: 8,
  },
  fieldLabel: {
    color: '#E2E8F0',
    fontSize: 14,
    fontWeight: '600',
  },
  input: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.14)',
    backgroundColor: 'rgba(255,255,255,0.07)',
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: '#FFFFFF',
    fontSize: 15,
  },
  helperText: {
    color: '#94A3B8',
    fontSize: 12,
  },
  radioRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  radioPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    minWidth: 112,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    backgroundColor: 'rgba(255,255,255,0.04)',
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  radioPillSelected: {
    borderColor: 'rgba(52, 211, 153, 0.55)',
    backgroundColor: 'rgba(16, 185, 129, 0.16)',
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#94A3B8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioOuterSelected: {
    borderColor: '#34D399',
  },
  radioInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#34D399',
  },
  radioText: {
    color: '#E2E8F0',
    fontSize: 14,
    fontWeight: '600',
  },
  errorBanner: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(248, 113, 113, 0.45)',
    backgroundColor: 'rgba(127, 29, 29, 0.35)',
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  successBanner: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(52, 211, 153, 0.45)',
    backgroundColor: 'rgba(6, 78, 59, 0.35)',
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  bannerText: {
    color: '#F8FAFC',
    fontSize: 14,
    lineHeight: 20,
  },
  submitButton: {
    borderRadius: 18,
    backgroundColor: '#0D9488',
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
    shadowColor: '#10B981',
    shadowOpacity: 0.32,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 10 },
    elevation: 10,
  },
  submitButtonDisabled: {
    opacity: 0.65,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
  menuHeader: {
    alignItems: 'center',
    marginBottom: 28,
    marginTop: 8,
  },
  brandHalo: {
    position: 'absolute',
    width: 132,
    height: 132,
    borderRadius: 999,
    backgroundColor: 'rgba(20, 184, 166, 0.25)',
    top: -6,
  },
  brandBadge: {
    width: 102,
    height: 102,
    borderRadius: 34,
    backgroundColor: '#0F766E',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 22,
    shadowColor: '#14B8A6',
    shadowOpacity: 0.35,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 12 },
    elevation: 12,
  },
  brandTitle: {
    fontSize: 38,
    fontWeight: '900',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 8,
  },
  brandSubtitle: {
    fontSize: 17,
    color: '#CBD5E1',
    textAlign: 'center',
  },
  footerText: {
    color: '#94A3B8',
    fontSize: 13,
    textAlign: 'center',
    marginTop: 28,
  },
  footerLink: {
    color: '#6EE7B7',
    fontWeight: '700',
  },
});
