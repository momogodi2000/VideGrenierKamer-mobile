import React, { useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native'
import { Colors } from '../constants/colors'
import { theme } from '../constants/theme'
import { AuthViewModel } from '../viewModels/AuthViewModel'

export const TermsConditionsScreen: React.FC<{ navigation: any }> = ({
  navigation,
}) => {
  const [accepted, setAccepted] = useState(false)
  const authViewModel = new AuthViewModel()

  const handleAccept = async () => {
    await authViewModel.setFirstLaunchComplete()
    navigation.replace('VisitorLanding')
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Terms and Conditions</Text>
      <ScrollView style={styles.scrollContainer}>
        <Text style={styles.content}>
          Welcome to Vidé-Grenier Kamer!
          {'\n\n'}
          By using this application, you agree to the following terms and conditions:
          {'\n\n'}
          1. User Agreement
          {'\n'}
          - You must be 18 years or older to use this service
          - You agree to provide accurate information
          - You are responsible for maintaining your account security
          {'\n\n'}
          2. Product Listings
          {'\n'}
          - All items must be accurately described
          - Prohibited items will not be allowed
          - Sellers are responsible for their listed items
          {'\n\n'}
          3. Transactions
          {'\n'}
          - All payments are processed securely
          - Refunds are subject to our refund policy
          - Shipping and pickup arrangements must be agreed upon
          {'\n\n'}
          4. Privacy
          {'\n'}
          - We collect and process data as described in our privacy policy
          - Your information is protected and secured
          - You control your data sharing preferences
        </Text>
      </ScrollView>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, accepted && styles.buttonAccepted]}
          onPress={() => setAccepted(!accepted)}
        >
          <Text style={styles.buttonText}>
            {accepted ? '✓ I Accept' : 'Accept Terms'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.continueButton, !accepted && styles.buttonDisabled]}
          onPress={handleAccept}
          disabled={!accepted}
        >
          <Text style={styles.continueButtonText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    padding: theme.spacing.medium,
  },
  title: {
    fontSize: theme.typography.fontSize.xxlarge,
    fontFamily: theme.typography.fontFamily.bold,
    marginBottom: theme.spacing.medium,
    color: Colors.primaryGreen,
  },
  scrollContainer: {
    flex: 1,
    marginBottom: theme.spacing.medium,
  },
  content: {
    fontSize: theme.typography.fontSize.medium,
    fontFamily: theme.typography.fontFamily.regular,
    lineHeight: 24,
    color: Colors.black,
  },
  buttonContainer: {
    gap: theme.spacing.medium,
  },
  button: {
    padding: theme.spacing.medium,
    borderRadius: theme.borderRadius.medium,
    backgroundColor: Colors.white,
    borderWidth: 2,
    borderColor: Colors.primaryOrange,
    alignItems: 'center',
  },
  buttonAccepted: {
    backgroundColor: Colors.primaryOrange,
  },
  buttonText: {
    fontSize: theme.typography.fontSize.large,
    fontFamily: theme.typography.fontFamily.medium,
    color: Colors.primaryOrange,
  },
  continueButton: {
    padding: theme.spacing.medium,
    borderRadius: theme.borderRadius.medium,
    backgroundColor: Colors.primaryGreen,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  continueButtonText: {
    fontSize: theme.typography.fontSize.large,
    fontFamily: theme.typography.fontFamily.medium,
    color: Colors.white,
  },
})
