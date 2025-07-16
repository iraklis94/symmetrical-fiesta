import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  Dimensions,
} from 'react-native';
import MapboxGL from '@rnmapbox/maps';
import { Ionicons } from '@expo/vector-icons';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { useLocation } from '../../src/hooks/useLocation';
import { router } from 'expo-router';
import { Doc } from '../../convex/_generated/dataModel';
import BottomSheet from '@gorhom/bottom-sheet';

const { height } = Dimensions.get('window');

// Initialize Mapbox
MapboxGL.setAccessToken(process.env.EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN!);

export default function MapScreen() {
  const { location, loading: locationLoading } = useLocation();
  const [selectedStore, setSelectedStore] = useState<Doc<'stores'> | null>(null);
  const [followUser, setFollowUser] = useState(true);
  const cameraRef = useRef<MapboxGL.Camera>(null);
  const bottomSheetRef = useRef<BottomSheet>(null);

  // Query nearby stores
  const stores = useQuery(api.stores.getNearbyStores, 
    location ? {
      location: {
        latitude: location.latitude,
        longitude: location.longitude,
      },
      radius: 10, // 10km radius
    } : undefined
  );

  useEffect(() => {
    if (location && cameraRef.current && followUser) {
      cameraRef.current.setCamera({
        centerCoordinate: [location.longitude, location.latitude],
        zoomLevel: 14,
        animationDuration: 1000,
      });
    }
  }, [location, followUser]);

  const handleStorePress = (store: Doc<'stores'>) => {
    setSelectedStore(store);
    setFollowUser(false);
    
    if (cameraRef.current) {
      cameraRef.current.setCamera({
        centerCoordinate: [store.location.longitude, store.location.latitude],
        zoomLevel: 16,
        animationDuration: 500,
      });
    }
    
    bottomSheetRef.current?.expand();
  };

  const renderStoreMarker = (store: Doc<'stores'>) => {
    const isSelected = selectedStore?._id === store._id;
    
    return (
      <MapboxGL.MarkerView
        key={store._id}
        coordinate={[store.location.longitude, store.location.latitude]}
      >
        <TouchableOpacity
          onPress={() => handleStorePress(store)}
          style={[styles.marker, isSelected && styles.selectedMarker]}
        >
          <Ionicons 
            name={store.type === 'supermarket' ? 'cart' : 'storefront'} 
            size={20} 
            color="white" 
          />
        </TouchableOpacity>
      </MapboxGL.MarkerView>
    );
  };

  if (locationLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#e74c3c" />
        <Text style={styles.loadingText}>Getting your location...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapboxGL.MapView 
        style={styles.map}
        styleURL={MapboxGL.StyleURL.Street}
        logoEnabled={false}
        attributionEnabled={false}
      >
        <MapboxGL.Camera
          ref={cameraRef}
          centerCoordinate={
            location 
              ? [location.longitude, location.latitude]
              : [23.7275, 37.9838] // Default to Athens
          }
          zoomLevel={14}
        />
        
        {/* User location */}
        {location && (
          <MapboxGL.UserLocation
            visible={true}
            showsUserHeadingIndicator={true}
          />
        )}
        
        {/* Store markers */}
        {stores?.map((store) => renderStoreMarker(store))}
      </MapboxGL.MapView>

      {/* Map controls */}
      <View style={styles.mapControls}>
        <TouchableOpacity 
          style={styles.controlButton}
          onPress={() => {
            setFollowUser(true);
            if (location && cameraRef.current) {
              cameraRef.current.setCamera({
                centerCoordinate: [location.longitude, location.latitude],
                zoomLevel: 14,
                animationDuration: 500,
              });
            }
          }}
        >
          <Ionicons 
            name="locate" 
            size={24} 
            color={followUser ? '#e74c3c' : '#2c3e50'} 
          />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.controlButton}
          onPress={() => router.push('/search?mode=stores')}
        >
          <Ionicons name="search" size={24} color="#2c3e50" />
        </TouchableOpacity>
      </View>

      {/* Store details bottom sheet */}
      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={['25%', '50%']}
        enablePanDownToClose={true}
        backgroundStyle={styles.bottomSheet}
      >
        {selectedStore && (
          <View style={styles.storeDetails}>
            <View style={styles.storeHeader}>
              <View style={styles.storeInfo}>
                <Text style={styles.storeName}>{selectedStore.name}</Text>
                <Text style={styles.storeAddress}>{selectedStore.location.address}</Text>
                <View style={styles.storeStats}>
                  <View style={styles.statItem}>
                    <Ionicons name="star" size={16} color="#f39c12" />
                    <Text style={styles.statText}>{selectedStore.rating.toFixed(1)}</Text>
                  </View>
                  <View style={styles.statItem}>
                    <Ionicons name="time-outline" size={16} color="#7f8c8d" />
                    <Text style={styles.statText}>
                      {selectedStore.estimatedDeliveryTime} min
                    </Text>
                  </View>
                  <View style={styles.statItem}>
                    <Ionicons name="bicycle-outline" size={16} color="#7f8c8d" />
                    <Text style={styles.statText}>
                      €{selectedStore.deliveryFee.toFixed(2)}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
            
            <TouchableOpacity
              style={styles.viewStoreButton}
              onPress={() => router.push(`/store/${selectedStore._id}`)}
            >
              <Text style={styles.viewStoreButtonText}>View Store</Text>
              <Ionicons name="arrow-forward" size={20} color="white" />
            </TouchableOpacity>
          </View>
        )}
      </BottomSheet>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#7f8c8d',
  },
  marker: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#e74c3c',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  selectedMarker: {
    backgroundColor: '#c0392b',
    transform: [{ scale: 1.2 }],
  },
  mapControls: {
    position: 'absolute',
    right: 20,
    top: 60,
    gap: 10,
  },
  controlButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  bottomSheet: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  storeDetails: {
    padding: 20,
  },
  storeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  storeInfo: {
    flex: 1,
  },
  storeName: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: '#2c3e50',
    marginBottom: 5,
  },
  storeAddress: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#7f8c8d',
    marginBottom: 10,
  },
  storeStats: {
    flexDirection: 'row',
    gap: 15,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#2c3e50',
  },
  viewStoreButton: {
    backgroundColor: '#e74c3c',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    borderRadius: 10,
    gap: 8,
  },
  viewStoreButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: 'white',
  },
}); 