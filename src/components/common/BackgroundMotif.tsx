import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Svg, { Path } from 'react-native-svg';

const { width, height } = Dimensions.get('window');

const BackgroundMotif = () => {
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <View style={styles.overlay} />
      <Svg height={height} width={width} style={styles.svg}>
        {/* Simple geometric tribal motif representation */}
        {[...Array(10)].map((_, i) => (
          <Path
            key={i}
            d={`M${i * 100} 50 L${i * 100 + 25} 25 L${i * 100 + 50} 50 L${i * 100 + 75} 75 L${i * 100 + 100} 50`}
            stroke="white"
            strokeWidth="0.5"
            strokeOpacity="0.05"
            fill="none"
          />
        ))}
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: '#000000',
    opacity: 0.95,
  },
  svg: {
    opacity: 0.2,
  },
});

export default BackgroundMotif;
