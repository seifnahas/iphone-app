import { StyleSheet } from 'react-native';

export const colors = {
  background: '#f6f8fb',
  surface: '#ffffff',
  surfaceMuted: '#f1f5f9',
  surfaceSubtle: '#eef2f6',
  text: '#0f172a',
  mutedText: '#475569',
  border: '#e2e8f0',
  primary: '#2563eb',
  primaryForeground: '#eef2ff',
  accent: '#0ea5e9',
  danger: '#e11d48',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
};

export const radius = {
  sm: 10,
  md: 12,
  lg: 16,
  xl: 20,
  pill: 999,
};

export const text = {
  display: {
    fontSize: 28,
    fontWeight: '700' as const,
    letterSpacing: -0.6,
  },
  title: {
    fontSize: 22,
    fontWeight: '700' as const,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600' as const,
  },
  body: {
    fontSize: 16,
    fontWeight: '500' as const,
  },
  caption: {
    fontSize: 13,
    fontWeight: '500' as const,
  },
  overline: {
    fontSize: 12,
    fontWeight: '700' as const,
    letterSpacing: 0.6,
    textTransform: 'uppercase' as const,
  },
};

export const shadow = {
  soft: {
    shadowColor: 'rgba(15, 23, 42, 0.12)',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 1,
    shadowRadius: 24,
    elevation: 6,
  },
  subtle: {
    shadowColor: 'rgba(15, 23, 42, 0.06)',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 1,
    shadowRadius: 18,
    elevation: 3,
  },
};

export const hairlineWidth = StyleSheet.hairlineWidth;
