import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import RevenueCatUI, { PAYWALL_RESULT } from 'react-native-purchases-ui';
import { colors, spacing, fontSize, fonts, borderRadius } from '../constants';

const COUNTDOWN_SECONDS = 5;

interface TimedPaywallProps {
  visible: boolean;
  onClose: (result: PAYWALL_RESULT) => void;
}

export function TimedPaywall({ visible, onClose }: TimedPaywallProps) {
  const insets = useSafeAreaInsets();
  const [countdown, setCountdown] = useState(COUNTDOWN_SECONDS);
  const [canDismiss, setCanDismiss] = useState(false);
  const [paywallResult, setPaywallResult] = useState<PAYWALL_RESULT | null>(null);

  // Reset countdown when modal becomes visible
  useEffect(() => {
    if (visible) {
      setCountdown(COUNTDOWN_SECONDS);
      setCanDismiss(false);
      setPaywallResult(null);
    }
  }, [visible]);

  // Countdown timer
  useEffect(() => {
    if (!visible || canDismiss) return;

    if (countdown <= 0) {
      setCanDismiss(true);
      return;
    }

    const timer = setTimeout(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [visible, countdown, canDismiss]);

  const handleDismiss = useCallback(() => {
    if (canDismiss) {
      onClose(paywallResult ?? PAYWALL_RESULT.CANCELLED);
    }
  }, [canDismiss, onClose, paywallResult]);

  const handlePaywallResult = useCallback((result: PAYWALL_RESULT) => {
    setPaywallResult(result);
    // If purchased or restored, allow immediate close
    if (result === PAYWALL_RESULT.PURCHASED || result === PAYWALL_RESULT.RESTORED) {
      onClose(result);
    }
  }, [onClose]);

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={handleDismiss}
    >
      <View style={styles.container}>
        {/* Timer badge in top right */}
        <View style={[styles.timerContainer, { top: insets.top + spacing.sm }]}>
          {!canDismiss ? (
            <View style={styles.timerBadge}>
              <Text style={styles.timerText}>{countdown}</Text>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.closeButton}
              onPress={handleDismiss}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* RevenueCat Paywall */}
        <RevenueCatUI.Paywall
          style={styles.paywall}
          onPurchaseCompleted={({ customerInfo }) => handlePaywallResult(PAYWALL_RESULT.PURCHASED)}
          onRestoreCompleted={({ customerInfo }) => handlePaywallResult(PAYWALL_RESULT.RESTORED)}
          onDismiss={() => {
            // Only allow dismiss if countdown is done
            if (canDismiss) {
              handleDismiss();
            }
          }}
        />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  timerContainer: {
    position: 'absolute',
    right: spacing.md,
    zIndex: 100,
  },
  timerBadge: {
    width: 36,
    height: 36,
    borderRadius: borderRadius.full,
    backgroundColor: colors.overlay,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timerText: {
    color: colors.white,
    fontSize: fontSize.lg,
    fontFamily: fonts.ui,
    fontWeight: '600',
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: borderRadius.full,
    backgroundColor: colors.overlay,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeText: {
    color: colors.white,
    fontSize: fontSize.lg,
    fontWeight: '600',
  },
  paywall: {
    flex: 1,
  },
});
