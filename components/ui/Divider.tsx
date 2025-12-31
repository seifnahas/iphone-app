import React from 'react';
import { StyleSheet, View, ViewProps } from 'react-native';

import { colors, hairlineWidth } from './tokens';

export function Divider(props: ViewProps) {
  return <View {...props} style={[styles.divider, props.style]} />;
}

const styles = StyleSheet.create({
  divider: {
    height: hairlineWidth,
    backgroundColor: colors.border,
    width: '100%',
  },
});

export default Divider;
