import React from 'react';
import { View, Text, Modal, ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native';

export default function LocationErrorModal({ visible, searching, onRetry }) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.box}>
          {searching ? (
            <>
              <ActivityIndicator size="large" />
              <Text style={styles.text}>Fetching location…</Text>
            </>
          ) : (
            <TouchableOpacity onPress={onRetry}>
              <Text style={styles.retry}>Retry</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  box: {
    backgroundColor: '#fff',
    padding: 25,
    borderRadius: 15,
    alignItems: 'center',
  },
  text: { marginTop: 10 },
  retry: { color: '#ff3b30', fontWeight: '700' },
});
