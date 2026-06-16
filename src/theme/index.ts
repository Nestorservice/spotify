export const COLORS = {
  surface: '#131313',
  surfaceDim: '#131313',
  surfaceBright: '#393939',
  surfaceContainerLowest: '#0e0e0e',
  surfaceContainerLow: '#1c1b1b',
  surfaceContainer: '#201f1f',
  surfaceContainerHigh: '#2a2a2a',
  surfaceContainerHighest: '#353534',
  onSurface: '#e5e2e1',
  onSurfaceVariant: '#b9cbb9',
  inverseSurface: '#e5e2e1',
  inverseOnSurface: '#313030',
  outline: '#849584',
  outlineVariant: '#3b4b3d',
  surfaceTint: '#00e476',
  primary: '#f0ffee',
  onPrimary: '#003919',
  primaryContainer: '#00ff85',
  onPrimaryContainer: '#007137',
  inversePrimary: '#006d35',
  secondary: '#ffb4a4',
  onSecondary: '#640d00',
  secondaryContainer: '#a71c00',
  onSecondaryContainer: '#ffb9aa',
  tertiary: '#fffaf7',
  onTertiary: '#3f2e00',
  tertiaryContainer: '#ffda89',
  onTertiaryContainer: '#7c5d00',
  error: '#ffb4ab',
  onError: '#690005',
  errorContainer: '#93000a',
  onErrorContainer: '#ffdad6',
  primaryFixed: '#61ff97',
  primaryFixedDim: '#00e476',
  onPrimaryFixed: '#00210c',
  onPrimaryFixedVariant: '#005227',
  secondaryFixed: '#ffdad3',
  secondaryFixedDim: '#ffb4a4',
  onSecondaryFixed: '#3e0500',
  onSecondaryFixedVariant: '#8d1600',
  tertiaryFixed: '#ffdf9a',
  tertiaryFixedDim: '#f7be1d',
  onTertiaryFixed: '#251a00',
  onTertiaryFixedVariant: '#5a4300',
  background: '#000000', // Design says #131313 but absolute black is requested for OLED
  onBackground: '#e5e2e1',
  surfaceVariant: '#353534',
  black: '#000000',
  white: '#ffffff',
  transparent: 'transparent',
};

export const TYPOGRAPHY = {
  displayLg: {
    fontFamily: 'PlusJakartaSans-Bold',
    fontSize: 48,
    lineHeight: 56,
    letterSpacing: -0.96, // -0.02em
  },
  headlineLg: {
    fontFamily: 'PlusJakartaSans-Bold',
    fontSize: 32,
    lineHeight: 40,
    letterSpacing: -0.32, // -0.01em
  },
  headlineLgMobile: {
    fontFamily: 'PlusJakartaSans-Bold',
    fontSize: 28,
    lineHeight: 36,
  },
  headlineMd: {
    fontFamily: 'PlusJakartaSans-SemiBold',
    fontSize: 24,
    lineHeight: 32,
  },
  bodyLg: {
    fontFamily: 'PlusJakartaSans-Regular',
    fontSize: 18,
    lineHeight: 28,
  },
  bodyMd: {
    fontFamily: 'PlusJakartaSans-Regular',
    fontSize: 16,
    lineHeight: 24,
  },
  labelLg: {
    fontFamily: 'PlusJakartaSans-SemiBold',
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 0.7, // 0.05em
  },
  labelSm: {
    fontFamily: 'PlusJakartaSans-Medium',
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.96, // 0.08em
  },
};

export const ROUNDED = {
  sm: 4,
  default: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
};

export const SPACING = {
  base: 8,
  xs: 4,
  sm: 12,
  md: 24,
  lg: 40,
  xl: 64,
  gutter: 16,
  marginMobile: 24,
  marginDesktop: 48,
};

export const THEME = {
  colors: COLORS,
  typography: TYPOGRAPHY,
  rounded: ROUNDED,
  spacing: SPACING,
};
