import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Easing,
} from 'react-native';

interface Props {
  session: any;
}

export default function SpinScreen({ session }: Props) {
  const spinAnimation = useRef(new Animated.Value(0)).current;
  const scaleAnimation = useRef(new Animated.Value(1)).current;
  const opacityAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Start animations
    Animated.parallel([
      // Spin animation
      Animated.loop(
        Animated.timing(spinAnimation, {
          toValue: 1,
          duration: 2000,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      ),
      // Scale pulse animation
      Animated.loop(
        Animated.sequence([
          Animated.timing(scaleAnimation, {
            toValue: 1.2,
            duration: 1000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnimation, {
            toValue: 1,
            duration: 1000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      ),
      // Fade in
      Animated.timing(opacityAnimation, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const spin = spinAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const wineEmojis = ['🍷', '🍾', '🥂', '🍇'];

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.content,
          { opacity: opacityAnimation },
        ]}
      >
        <View style={styles.spinContainer}>
          <Animated.View
            style={[
              styles.wheelContainer,
              {
                transform: [
                  { rotate: spin },
                  { scale: scaleAnimation },
                ],
              },
            ]}
          >
            <View style={styles.wheel}>
              {wineEmojis.map((emoji, index) => (
                <View
                  key={index}
                  style={[
                    styles.wineItem,
                    {
                      transform: [
                        { rotate: `${(360 / wineEmojis.length) * index}deg` },
                      ],
                    },
                  ]}
                >
                  <Text style={styles.wineEmoji}>{emoji}</Text>
                </View>
              ))}
            </View>
          </Animated.View>
          
          <View style={styles.centerDot}>
            <Text style={styles.centerEmoji}>🎲</Text>
          </View>
        </View>

        <Text style={styles.title}>Spinning the Wine Wheel!</Text>
        <Text style={styles.subtitle}>
          Finding the perfect wines from {session.region}...
        </Text>

        <View style={styles.funFacts}>
          <Text style={styles.funFact}>
            🍷 Did you know? {session.region} is famous for its unique terroir!
          </Text>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    padding: 20,
  },
  spinContainer: {
    width: 250,
    height: 250,
    marginBottom: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  wheelContainer: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  wheel: {
    width: '100%',
    height: '100%',
    borderRadius: 125,
    borderWidth: 3,
    borderColor: '#e74c3c',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  wineItem: {
    position: 'absolute',
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  wineEmoji: {
    fontSize: 40,
  },
  centerDot: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#e74c3c',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  centerEmoji: {
    fontSize: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#7f8c8d',
    textAlign: 'center',
    marginBottom: 30,
  },
  funFacts: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    marginTop: 20,
    maxWidth: '100%',
  },
  funFact: {
    fontSize: 16,
    color: '#2c3e50',
    textAlign: 'center',
    lineHeight: 22,
  },
});