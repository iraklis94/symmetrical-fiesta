import React, { useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useConvexAuth } from 'convex/react';

const { width } = Dimensions.get('window');

const PROFILE_MENU_ITEMS = [
  {
    id: 'orders',
    title: 'My Orders',
    subtitle: 'View order history and track deliveries',
    icon: 'bag-outline',
    color: '#e74c3c',
  },
  {
    id: 'favorites',
    title: 'Favorites',
    subtitle: 'Your saved products and stores',
    icon: 'heart-outline',
    color: '#e74c3c',
  },
  {
    id: 'addresses',
    title: 'Delivery Addresses',
    subtitle: 'Manage your delivery locations',
    icon: 'location-outline',
    color: '#3498db',
  },
  {
    id: 'payment',
    title: 'Payment Methods',
    subtitle: 'Manage your payment options',
    icon: 'card-outline',
    color: '#27ae60',
  },
  {
    id: 'notifications',
    title: 'Notifications',
    subtitle: 'Configure your notification preferences',
    icon: 'notifications-outline',
    color: '#f39c12',
  },
  {
    id: 'language',
    title: 'Language & Region',
    subtitle: 'Change language and currency',
    icon: 'language-outline',
    color: '#9b59b6',
  },
  {
    id: 'help',
    title: 'Help & Support',
    subtitle: 'Get help and contact support',
    icon: 'help-circle-outline',
    color: '#34495e',
  },
  {
    id: 'about',
    title: 'About GreekMarket',
    subtitle: 'Learn more about our app',
    icon: 'information-circle-outline',
    color: '#7f8c8d',
  },
];

export default function ProfileScreen() {
  const { isAuthenticated, user } = useConvexAuth();

  const handleMenuItemPress = useCallback((itemId: string) => {
    switch (itemId) {
      case 'orders':
        router.push('/orders');
        break;
      case 'favorites':
        router.push('/favorites');
        break;
      case 'addresses':
        router.push('/addresses');
        break;
      case 'payment':
        router.push('/payment');
        break;
      case 'notifications':
        router.push('/notifications');
        break;
      case 'language':
        router.push('/language');
        break;
      case 'help':
        router.push('/help');
        break;
      case 'about':
        router.push('/about');
        break;
      default:
        Alert.alert('Coming Soon', 'This feature will be available soon!');
    }
  }, []);

  const handleSignIn = useCallback(() => {
    router.push('/auth/signin');
  }, []);

  const handleSignOut = useCallback(() => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Sign Out', style: 'destructive', onPress: () => {
          // Handle sign out logic here
          Alert.alert('Signed Out', 'You have been successfully signed out.');
        }},
      ]
    );
  }, []);

  const renderMenuItem = useCallback(({ item }: { item: typeof PROFILE_MENU_ITEMS[0] }) => (
    <TouchableOpacity
      key={item.id}
      style={styles.menuItem}
      onPress={() => handleMenuItemPress(item.id)}
      activeOpacity={0.7}
    >
      <View style={[styles.menuIcon, { backgroundColor: item.color + '20' }]}>
        <Ionicons name={item.icon as any} size={24} color={item.color} />
      </View>
      
      <View style={styles.menuContent}>
        <Text style={styles.menuTitle}>{item.title}</Text>
        <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
      </View>
      
      <Ionicons name="chevron-forward" size={20} color="#7f8c8d" />
    </TouchableOpacity>
  ), [handleMenuItemPress]);

  if (!isAuthenticated) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>My Profile</Text>
        </View>

        <View style={styles.authContainer}>
          <View style={styles.authIcon}>
            <Ionicons name="person-circle-outline" size={80} color="#7f8c8d" />
          </View>
          
          <Text style={styles.authTitle}>Welcome to GreekMarket</Text>
          <Text style={styles.authSubtitle}>
            Sign in to access your profile, orders, and favorites
          </Text>
          
          <TouchableOpacity 
            style={styles.signInButton}
            onPress={handleSignIn}
          >
            <Text style={styles.signInButtonText}>Sign In</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.guestButton}
            onPress={() => router.push('/(tabs)')}
          >
            <Text style={styles.guestButtonText}>Continue as Guest</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Profile</Text>
        <TouchableOpacity onPress={handleSignOut}>
          <Ionicons name="log-out-outline" size={24} color="#e74c3c" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* User Profile Section */}
        <View style={styles.profileSection}>
          <View style={styles.profileHeader}>
            <View style={styles.avatarContainer}>
              <Ionicons name="person" size={40} color="white" />
            </View>
            
            <View style={styles.profileInfo}>
              <Text style={styles.userName}>
                {user?.name || 'Greek Market User'}
              </Text>
              <Text style={styles.userEmail}>
                {user?.email || 'user@example.com'}
              </Text>
              <View style={styles.memberBadge}>
                <Ionicons name="star" size={12} color="#f39c12" />
                <Text style={styles.memberText}>Premium Member</Text>
              </View>
            </View>
            
            <TouchableOpacity style={styles.editButton}>
              <Ionicons name="pencil" size={16} color="#e74c3c" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Quick Stats */}
        <View style={styles.statsSection}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>12</Text>
            <Text style={styles.statLabel}>Orders</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>8</Text>
            <Text style={styles.statLabel}>Favorites</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>€156</Text>
            <Text style={styles.statLabel}>Spent</Text>
          </View>
        </View>

        {/* Menu Items */}
        <View style={styles.menuSection}>
          {PROFILE_MENU_ITEMS.map(renderMenuItem)}
        </View>

        {/* App Version */}
        <View style={styles.versionSection}>
          <Text style={styles.versionText}>GreekMarket v1.0.0</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#ecf0f1',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2c3e50',
  },
  content: {
    flex: 1,
  },
  authContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  authIcon: {
    marginBottom: 20,
  },
  authTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 10,
    textAlign: 'center',
  },
  authSubtitle: {
    fontSize: 16,
    color: '#7f8c8d',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 24,
  },
  signInButton: {
    backgroundColor: '#e74c3c',
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 10,
    marginBottom: 15,
    width: '100%',
    alignItems: 'center',
  },
  signInButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  guestButton: {
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e74c3c',
    width: '100%',
    alignItems: 'center',
  },
  guestButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#e74c3c',
  },
  profileSection: {
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 20,
    marginTop: 10,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#e74c3c',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  profileInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 8,
  },
  memberBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f39c1210',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  memberText: {
    fontSize: 12,
    color: '#f39c12',
    fontWeight: '500',
    marginLeft: 4,
  },
  editButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#e74c3c10',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsSection: {
    backgroundColor: 'white',
    flexDirection: 'row',
    marginTop: 10,
    paddingVertical: 20,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#7f8c8d',
  },
  statDivider: {
    width: 1,
    backgroundColor: '#ecf0f1',
  },
  menuSection: {
    backgroundColor: 'white',
    marginTop: 10,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f8f9fa',
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  menuContent: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2c3e50',
    marginBottom: 2,
  },
  menuSubtitle: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  versionSection: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  versionText: {
    fontSize: 12,
    color: '#7f8c8d',
  },
}); 