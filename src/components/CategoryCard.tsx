import React, { useMemo } from 'react';
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
  onPress: (category: CategoryCardProps['category']) => void;
  style?: any;
}

export const CategoryCard = React.memo(({ category, onPress, style }: CategoryCardProps) => {
  const backgroundColor = useMemo(() => category.color + '20', [category.color]);

  const handlePress = () => {
    onPress(category);
  };

  return (
    <TouchableOpacity
      style={[styles.categoryCard, { backgroundColor }, style]}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <Text style={styles.categoryIcon}>{category.icon}</Text>
      <Text style={styles.categoryName}>{category.nameGr}</Text>
      <Text style={styles.categoryNameEn}>{category.name}</Text>
    </TouchableOpacity>
  );
});

CategoryCard.displayName = 'CategoryCard';

const styles = StyleSheet.create({
  categoryCard: {
    width: CARD_SIZE,
    height: CARD_SIZE,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  categoryIcon: {
    fontSize: 36,
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#2c3e50',
    textAlign: 'center',
  },
  categoryNameEn: {
    fontSize: 11,
    fontFamily: 'Inter-Regular',
    color: '#7f8c8d',
    textAlign: 'center',
    marginTop: 2,
  },
}); 