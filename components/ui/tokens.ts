export const colors = {
  background: '#f8fafc',
  surface: '#ffffff',
  text: '#0f172a',
  mutedText: '#475569',
  border: '#e2e8f0',
  primary: '#2563eb',
  destructive: '#ef4444',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
};

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
};

export const text = {
  title: {
    fontSize: 24,
    fontWeight: '700' as const,
  },
  body: {
    fontSize: 16,
    fontWeight: '500' as const,
  },
  caption: {
    fontSize: 13,
    fontWeight: '500' as const,
  },
};

export const shadow = {
  shadowColor: 'rgba(15, 23, 42, 0.08)',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 1,
  shadowRadius: 8,
  elevation: 3,
};
