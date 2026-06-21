import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Svg, { Path, G, Circle, Defs, RadialGradient, Stop } from 'react-native-svg';

const { width, height } = Dimensions.get('window');

const BackgroundMotif = () => {
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <View style={styles.overlay} />
      <Svg height={height} width={width} style={styles.svg}>
        <Defs>
          {/* Radial Gradient for the central African Sun glow */}
          <RadialGradient id="sunGlow" cx="50%" cy="50%" rx="50%" ry="50%">
            <Stop offset="0%" stopColor="#FF7A00" stopOpacity="0.12" />
            <Stop offset="50%" stopColor="#FF3D00" stopOpacity="0.04" />
            <Stop offset="100%" stopColor="#000000" stopOpacity="0" />
          </RadialGradient>
        </Defs>

        {/* Central Sun Glow */}
        <Circle cx={width / 2} cy={height / 3} r="250" fill="url(#sunGlow)" />

        {/* Traditional Zig-Zag Triangular Border - TOP */}
        <G opacity="0.18">
          {[...Array(Math.ceil(width / 30))].map((_, i) => (
            <G key={`top-${i}`} transform={`translate(${i * 30}, 10)`}>
              {/* Outer Triangle (Green) */}
              <Path d="M0 15 L15 0 L30 15 Z" fill="#00E476" />
              {/* Inner Triangle (Yellow) */}
              <Path d="M4 15 L15 4 L26 15 Z" fill="#FFC700" />
              {/* Core Triangle (Red) */}
              <Path d="M8 15 L15 8 L22 15 Z" fill="#FF3D00" />
            </G>
          ))}
        </G>

        {/* Traditional Zig-Zag Triangular Border - BOTTOM */}
        <G opacity="0.18" transform={`translate(0, ${height - 110})`}>
          {[...Array(Math.ceil(width / 30))].map((_, i) => (
            <G key={`bot-${i}`} transform={`translate(${i * 30}, 0)`}>
              {/* Downward Triangles */}
              <Path d="M0 0 L15 15 L30 0 Z" fill="#00E476" />
              <Path d="M4 0 L15 11 L26 0 Z" fill="#FFC700" />
              <Path d="M8 0 L15 7 L22 0 Z" fill="#FF3D00" />
            </G>
          ))}
        </G>

        {/* LEFT SIDE: Stylized Traditional African Mask Outline */}
        <G transform="translate(15, 140)" opacity="0.04" stroke="#FFFFFF" strokeWidth="1.5" fill="none">
          {/* Main Face Contour */}
          <Path d="M20,0 C50,0 55,30 55,70 C55,110 38,150 20,150 C2,150 -15,110 -15,70 C-15,30 -10,0 20,0 Z" />
          {/* Traditional forehead line patterns */}
          <Path d="M20,0 L20,35 M5,10 L12,38 M35,10 L28,38" />
          {/* Eyes (Narrow slits) */}
          <Path d="M-2,60 L12,63 M42,60 L28,63" />
          {/* Long thin nose */}
          <Path d="M20,60 L20,105 M15,105 L25,105" />
          {/* Small rounded mouth */}
          <Path d="M20,125 A 6,6 0 1 0 20,137 A 6,6 0 1 0 20,125" />
        </G>

        {/* RIGHT SIDE: Stylized Djembe Drums Outline */}
        <G transform={`translate(${width - 65}, ${height / 2 - 80})`} opacity="0.04" stroke="#FFFFFF" strokeWidth="1.5" fill="none">
          {/* Drum Head */}
          <Path d="M 5,20 A 20,6 0 1 0 45,20 A 20,6 0 1 0 5,20" />
          {/* Drum Body / Goblet Shape */}
          <Path d="M 5,20 C 8,50 5,70 12,100 L 38,100 C 45,70 42,50 45,20" />
          {/* Drum Base */}
          <Path d="M 12,100 L 2,135 L 48,135 L 38,100 Z" />
          {/* Tension Ropes */}
          <Path d="M 7,23 L 15,100 M 17,25 L 25,100 M 27,26 L 25,100 M 37,25 L 35,100 M 43,23 L 35,100" />
        </G>

        {/* CENTER BOTTOM: Traditional Shield / Sun Emblem */}
        <G transform={`translate(${width / 2 - 30}, ${height - 230})`} opacity="0.05" stroke="#FFFFFF" strokeWidth="1.5" fill="none">
          {/* Shield Outline */}
          <Path d="M 30,0 C 55,15 55,65 30,95 C 5,65 5,15 30,0 Z" />
          {/* Center Vertical spear line */}
          <Path d="M 30,-15 L 30,110" />
          {/* Cross lines */}
          <Path d="M 10,25 L 50,70 M 50,25 L 10,70" />
          {/* Small Sun rays inside */}
          <Circle cx="30" cy="48" r="8" />
        </G>
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#0F0E0E', // Sleek premium dark background
  },
  svg: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});

export default BackgroundMotif;
