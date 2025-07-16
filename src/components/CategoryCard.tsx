import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';

const { width } = Dimensions.get('window');
const CARD_SIZE = (width - 60) / 3;

interface CategoryCardProps {
  category: {
    id: string;
    name: string;
    nameGr: string;
    icon: string;
    color: string;
  };
  onPress: () => void;
}

export function CategoryCard({ category, onPress }: CategoryCardProps) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <View style={[styles.container, { backgroundColor: category.color + '15' }]}>
        <Text style={styles.icon}>{category.icon}</Text>
        <Text style={styles.name}>{category.nameGr}</Text>
        <Text style={styles.nameEn}>{category.name}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: CARD_SIZE,
    height: CARD_SIZE,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  icon: {
    fontSize: 36,
    marginBottom: 8,
  },
  name: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#2c3e50',
    textAlign: 'center',
  },
  nameEn: {
    fontSize: 11,
    fontFamily: 'Inter-Regular',
    color: '#7f8c8d',
    textAlign: 'center',
    marginTop: 2,
  },
}); 