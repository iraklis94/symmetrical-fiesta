import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Dimensions,
  FlatList,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { IslandInfo } from './islands';
import { useIslands, useWinesByIsland } from '../../hooks/useIslands';

const { width } = Dimensions.get('window');

export default function WineStorytelling() {
  const [step, setStep] = useState<0 | 1 | 2 | 3>(0);
  const [selectedIsland, setSelectedIsland] = useState<IslandInfo | null>(null);
  const [recommendedWine, setRecommendedWine] = useState<any | null>(null);

  // Backend data
  const islands = useIslands();
  const wines = useWinesByIsland(selectedIsland ? selectedIsland.id : null);

  const goNext = () => setStep((prev) => (prev < 3 ? ((prev + 1) as any) : prev));
  const goBack = () => setStep((prev) => (prev > 0 ? ((prev - 1) as any) : prev));
  const restart = () => {
    setStep(0);
    setSelectedIsland(null);
    setRecommendedWine(null);
  };

  const handleSelectIsland = (island: IslandInfo) => {
    setSelectedIsland(island);
    setTimeout(() => setStep(1), 300); // small delay for UX
  };

  const randomSelectIsland = () => {
    if (!islands.length) return;
    const island = islands[Math.floor(Math.random() * islands.length)];
    handleSelectIsland(island);
  };

  const selectRecommendedWine = () => {
    if (!wines.length) return null;
    const sorted = [...wines].sort((a, b) => (b.avgRating ?? b.rating ?? 0) - (a.avgRating ?? a.rating ?? 0));
    return sorted[0] as any;
  };

  const renderProgress = () => (
    <View style={styles.progressContainer}>
      {[0, 1, 2, 3].map((i) => (
        <View
          key={i}
          style={[styles.progressDot, step >= i && styles.progressDotActive]}
        />
      ))}
    </View>
  );

  const IslandSelectionSlide = () => (
    <ScrollView contentContainerStyle={styles.slideContainer}>
      <Text style={styles.title}>Choose Your Wine Island</Text>
      <Image
        source={{
          uri: 'https://images.unsplash.com/photo-1533328012232-0f7a651f1b6d?auto=format&fit=crop&w=800&q=60',
        }}
        style={styles.mapImage}
      />
      <TouchableOpacity style={styles.spinButton} onPress={randomSelectIsland}>
        <Ionicons name="sync" size={20} color="white" />
        <Text style={styles.spinButtonText}>Spin the Wheel</Text>
      </TouchableOpacity>

      <Text style={[styles.subtitle, { marginTop: 20 }]}>Or tap an island:</Text>

      {islands.map((island) => (
        <TouchableOpacity
          key={island.id}
          style={styles.islandOption}
          onPress={() => handleSelectIsland(island)}
        >
          <Text style={styles.islandName}>{island.name}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  const IslandHistorySlide = () => (
    <View style={styles.slideContainer}>
      {selectedIsland && (
        <>
          <Text style={styles.title}>{selectedIsland.name}</Text>
          <Image source={{ uri: selectedIsland.image }} style={styles.coverImage} />
          <Text style={styles.historyText}>{selectedIsland.history}</Text>
          <TouchableOpacity style={styles.nextButton} onPress={goNext}>
            <Text style={styles.nextButtonText}>See Wines</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );

  const WineCard = ({ wine }: { wine: any }) => (
    <View style={styles.wineCard}>
      <Image
        source={{ uri: wine.image || (wine.images?.[0] ?? 'https://via.placeholder.com/80x110') }}
        style={styles.wineImage}
      />
      <View style={styles.wineInfo}>
        <Text style={styles.wineName}>{wine.name}</Text>
        {'price' in wine || wine.inventory?.price ? (
          <Text style={styles.winePrice}>€{(wine.price ?? wine.inventory?.price ?? 0).toFixed(2)}</Text>
        ) : null}
        <Text style={styles.wineRating}>{(wine.rating ?? wine.avgRating ?? 0).toFixed(1)}★</Text>
      </View>
    </View>
  );

  const IslandWinesSlide = () => (
    <View style={styles.slideContainer}>
      {selectedIsland && (
        <>
          <Text style={styles.title}>Wines from {selectedIsland.name}</Text>
          <FlatList
            data={wines}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <WineCard wine={item} />}
            style={{ width: '100%' }}
            contentContainerStyle={{ paddingVertical: 10, paddingHorizontal: 20 }}
          />
          <TouchableOpacity
            style={styles.nextButton}
            onPress={() => {
              const rec = selectRecommendedWine();
              setRecommendedWine(rec);
              goNext();
            }}
          >
            <Text style={styles.nextButtonText}>Recommend Me One</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );

  const RecommendationSlide = () => (
    <View style={styles.slideContainer}>
      {recommendedWine && selectedIsland && (
        <>
          <Text style={styles.title}>Your Wine Pick</Text>
          <Text style={styles.subtitle}>{selectedIsland.name}</Text>
          <Image
            source={{ uri: (recommendedWine as any).image || (recommendedWine as any).images?.[0] || 'https://via.placeholder.com/300x200' }}
            style={styles.coverImage}
          />
          <Text style={styles.wineName}>{(recommendedWine as any).name}</Text>
          {'price' in recommendedWine && (
            <Text style={styles.winePrice}>€{(recommendedWine as any).price?.toFixed(2)}</Text>
          )}
          {'avgRating' in recommendedWine && (
            <Text style={styles.wineRating}>{(recommendedWine as any).avgRating?.toFixed(1)}★</Text>
          )}

          <TouchableOpacity
            style={styles.addCartButton}
            onPress={() => Alert.alert('Added to Cart', `${recommendedWine.name} added to cart`)}
          >
            <Ionicons name="cart" size={20} color="white" />
            <Text style={styles.addCartText}>Add to Cart</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.restartButton} onPress={restart}>
            <Text style={styles.restartText}>Start Again</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );

  const renderSlide = () => {
    switch (step) {
      case 0:
        return <IslandSelectionSlide />;
      case 1:
        return <IslandHistorySlide />;
      case 2:
        return <IslandWinesSlide />;
      case 3:
        return <RecommendationSlide />;
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      {renderProgress()}
      {step > 0 && (
        <TouchableOpacity style={styles.backButton} onPress={goBack}>
          <Ionicons name="chevron-back" size={28} color="#4b5563" />
        </TouchableOpacity>
      )}
      {renderSlide()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#d1d5db',
    marginHorizontal: 4,
  },
  progressDotActive: {
    backgroundColor: '#7c3aed',
  },
  slideContainer: {
    flexGrow: 1,
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    marginBottom: 10,
    color: '#111827',
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#4b5563',
  },
  mapImage: {
    width: width * 0.9,
    height: width * 0.5,
    borderRadius: 12,
    marginVertical: 16,
  },
  spinButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#7c3aed',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 8,
  },
  spinButtonText: {
    color: 'white',
    marginLeft: 8,
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  islandOption: {
    width: width * 0.8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    marginVertical: 6,
  },
  islandName: {
    fontSize: 18,
    fontFamily: 'Inter-Medium',
    color: '#111827',
    textAlign: 'center',
  },
  coverImage: {
    width: width * 0.8,
    height: width * 0.5,
    borderRadius: 12,
    marginVertical: 20,
  },
  historyText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#374151',
    textAlign: 'center',
    paddingHorizontal: 24,
  },
  nextButton: {
    marginTop: 24,
    backgroundColor: '#7c3aed',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  nextButtonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  backButton: {
    position: 'absolute',
    top: 8,
    left: 8,
    padding: 4,
    zIndex: 10,
  },
  wineCard: {
    flexDirection: 'row',
    marginBottom: 12,
    backgroundColor: 'white',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  wineImage: {
    width: 80,
    height: 110,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
  },
  wineInfo: {
    flex: 1,
    padding: 10,
    justifyContent: 'center',
  },
  wineName: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    marginBottom: 4,
    color: '#111827',
    textAlign: 'center',
  },
  winePrice: {
    fontSize: 14,
    color: '#10b981',
    textAlign: 'center',
  },
  wineRating: {
    fontSize: 12,
    color: '#f59e0b',
    textAlign: 'center',
  },
  addCartButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e74c3c',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 20,
  },
  addCartText: {
    color: 'white',
    marginLeft: 6,
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  restartButton: {
    marginTop: 16,
  },
  restartText: {
    fontSize: 14,
    color: '#4b5563',
    textDecorationLine: 'underline',
  },
});