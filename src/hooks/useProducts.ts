import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useConvexAuth } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { Id } from '../../convex/_generated/dataModel';

// Hook for fetching featured products
export const useFeaturedProducts = (limit: number = 10) => {
  const { isAuthenticated } = useConvexAuth();
  
  return useQuery({
    queryKey: ['featured-products', limit],
    queryFn: async () => {
      // This would be replaced with actual Convex query
      // return await convex.query(api.products.getFeaturedProducts, { limit });
      return [];
    },
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Hook for fetching products by category
export const useProductsByCategory = (category: string, limit: number = 20) => {
  const { isAuthenticated } = useConvexAuth();
  
  return useQuery({
    queryKey: ['products-by-category', category, limit],
    queryFn: async () => {
      // This would be replaced with actual Convex query
      // return await convex.query(api.products.getProductsByCategory, { 
      //   category, 
      //   limit 
      // });
      return [];
    },
    enabled: isAuthenticated && !!category,
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
  });
};

// Hook for fetching a single product
export const useProduct = (productId: Id<'products'> | null) => {
  const { isAuthenticated } = useConvexAuth();
  
  return useQuery({
    queryKey: ['product', productId],
    queryFn: async () => {
      if (!productId) return null;
      // This would be replaced with actual Convex query
      // return await convex.query(api.products.getProduct, { id: productId });
      return null;
    },
    enabled: isAuthenticated && !!productId,
    staleTime: 10 * 60 * 1000, // 10 minutes for product details
    cacheTime: 30 * 60 * 1000, // 30 minutes
  });
};

// Hook for searching products
export const useSearchProducts = (
  searchTerm: string,
  category?: string,
  filters?: any,
  limit: number = 20
) => {
  const { isAuthenticated } = useConvexAuth();
  
  return useQuery({
    queryKey: ['search-products', searchTerm, category, filters, limit],
    queryFn: async () => {
      if (!searchTerm.trim()) return [];
      // This would be replaced with actual Convex query
      // return await convex.query(api.products.searchProducts, {
      //   searchTerm,
      //   category,
      //   filters,
      //   limit,
      // });
      return [];
    },
    enabled: isAuthenticated && !!searchTerm.trim(),
    staleTime: 2 * 60 * 1000, // 2 minutes for search results
    cacheTime: 5 * 60 * 1000,
  });
};

// Hook for getting product availability
export const useProductAvailability = (
  productId: Id<'products'> | null,
  userLocation?: { latitude: number; longitude: number }
) => {
  const { isAuthenticated } = useConvexAuth();
  
  return useQuery({
    queryKey: ['product-availability', productId, userLocation],
    queryFn: async () => {
      if (!productId) return [];
      // This would be replaced with actual Convex query
      // return await convex.query(api.products.getProductAvailability, {
      //   productId,
      //   userLocation,
      // });
      return [];
    },
    enabled: isAuthenticated && !!productId,
    staleTime: 1 * 60 * 1000, // 1 minute for availability data
    cacheTime: 5 * 60 * 1000,
  });
};

// Hook for barcode scanning
export const useBarcodeScan = (barcode: string | null) => {
  const { isAuthenticated } = useConvexAuth();
  
  return useQuery({
    queryKey: ['barcode-scan', barcode],
    queryFn: async () => {
      if (!barcode) return null;
      // This would be replaced with actual Convex query
      // return await convex.query(api.products.scanBarcode, { barcode });
      return null;
    },
    enabled: isAuthenticated && !!barcode,
    staleTime: 30 * 60 * 1000, // 30 minutes for barcode data
    cacheTime: 60 * 60 * 1000, // 1 hour
  });
};

// Hook for invalidating product queries
export const useInvalidateProducts = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async () => {
      await queryClient.invalidateQueries({ queryKey: ['featured-products'] });
      await queryClient.invalidateQueries({ queryKey: ['products-by-category'] });
      await queryClient.invalidateQueries({ queryKey: ['search-products'] });
    },
  });
};