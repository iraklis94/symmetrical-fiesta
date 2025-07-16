import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

export default function SignInScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = useCallback(async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      Alert.alert(
        'Welcome!',
        'You have been successfully signed in.',
        [
          {
            text: 'OK',
            onPress: () => router.replace('/(tabs)'),
          },
        ]
      );
    }, 1500);
  }, [email, password]);

  const handleSignUp = useCallback(() => {
    router.push('/auth/signup');
  }, []);

  const handleForgotPassword = useCallback(() => {
    Alert.alert('Forgot Password', 'This feature will be available soon!');
  }, []);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <KeyboardAvoidingView 
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={24} color="#2c3e50" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Sign In</Text>
            <View style={{ width: 24 }} />
          </View>

          <View style={styles.content}>
            <View style={styles.logoContainer}>
              <Text style={styles.logo}>🍷</Text>
              <Text style={styles.appName}>GreekMarket</Text>
              <Text style={styles.tagline}>Discover authentic Greek products</Text>
            </View>

            <View style={styles.form}>
              <View style={styles.inputContainer}>
                <Ionicons name="mail-outline" size={20} color="#7f8c8d" />
                <TextInput
                  style={styles.input}
                  placeholder="Email address"
                  placeholderTextColor="#7f8c8d"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>

              <View style={styles.inputContainer}>
                <Ionicons name="lock-closed-outline" size={20} color="#7f8c8d" />
                <TextInput
                  style={styles.input}
                  placeholder="Password"
                  placeholderTextColor="#7f8c8d"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeButton}
                >
                  <Ionicons 
                    name={showPassword ? "eye-off-outline" : "eye-outline"} 
                    size={20} 
                    color="#7f8c8d" 
                  />
                </TouchableOpacity>
              </View>

              <TouchableOpacity 
                style={styles.forgotPassword}
                onPress={handleForgotPassword}
              >
                <Text style={styles.forgotPasswordText}>Forgot password?</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.signInButton, isLoading && styles.signInButtonDisabled]}
                onPress={handleSignIn}
                disabled={isLoading}
              >
                {isLoading ? (
                  <Text style={styles.signInButtonText}>Signing in...</Text>
                ) : (
                  <Text style={styles.signInButtonText}>Sign In</Text>
                )}
              </TouchableOpacity>

              <View style={styles.divider}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>or</Text>
                <View style={styles.dividerLine} />
              </View>

              <TouchableOpacity style={styles.googleButton}>
                <Ionicons name="logo-google" size={20} color="#2c3e50" />
                <Text style={styles.googleButtonText}>Continue with Google</Text>
              </TouchableOpacity>

              <View style={styles.signUpContainer}>
                <Text style={styles.signUpText}>Don't have an account? </Text>
                <TouchableOpacity onPress={handleSignUp}>
                  <Text style={styles.signUpLink}>Sign up</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#ecf0f1',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    fontSize: 64,
    marginBottom: 10,
  },
  appName: {
    fontSize: 28,
    fontWeight: '700',
    color: '#2c3e50',
    marginBottom: 5,
  },
  tagline: {
    fontSize: 16,
    color: '#7f8c8d',
    textAlign: 'center',
  },
  form: {
    flex: 1,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  input: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: '#2c3e50',
  },
  eyeButton: {
    padding: 5,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 25,
  },
  forgotPasswordText: {
    fontSize: 14,
    color: '#e74c3c',
    fontWeight: '500',
  },
  signInButton: {
    backgroundColor: '#e74c3c',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#e74c3c',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  signInButtonDisabled: {
    backgroundColor: '#bdc3c7',
    shadowOpacity: 0.1,
  },
  signInButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#ecf0f1',
  },
  dividerText: {
    marginHorizontal: 15,
    fontSize: 14,
    color: '#7f8c8d',
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    paddingVertical: 16,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: '#ecf0f1',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  googleButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2c3e50',
    marginLeft: 10,
  },
  signUpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signUpText: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  signUpLink: {
    fontSize: 14,
    color: '#e74c3c',
    fontWeight: '600',
  },
});