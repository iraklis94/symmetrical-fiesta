import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { ProductCard } from './ProductCard';

describe('ProductCard', () => {
  const mockProduct: any = {
    id: '1',
    name: 'Test Product',
    price: 9.99,
    image: 'test.jpg',
    category: 'Test',
  };

  it('renders correctly', () => {
    const { getByText } = render(<ProductCard product={mockProduct} onPress={() => {}} />);
    expect(getByText('Test Product')).toBeTruthy();
    expect(getByText('€9.99')).toBeTruthy();
  });

  it('calls onPress when pressed', () => {
    const onPressMock = jest.fn();
    const { getByTestId } = render(<ProductCard product={mockProduct} onPress={onPressMock} />);
    fireEvent.press(getByTestId('product-card'));
    expect(onPressMock).toHaveBeenCalledTimes(1);
  });
}); 