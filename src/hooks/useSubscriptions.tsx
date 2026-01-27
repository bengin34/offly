import { useState, useEffect, useContext, createContext, useRef, useCallback } from 'react';
import { Alert, Platform } from 'react-native';
import Purchases, {
  CustomerInfo,
  LOG_LEVEL,
  PurchasesOfferings,
} from 'react-native-purchases';
import { PAYWALL_RESULT } from "react-native-purchases-ui";
import { TimedPaywall } from '../components/TimedPaywall';

const REVENUECAT_API_KEY = Platform.select({
  ios: process.env.EXPO_PUBLIC_REVENUECAT_API_KEY_IOS,
  android: process.env.EXPO_PUBLIC_REVENUECAT_API_KEY_ANDROID,
});
const ENTITLEMENT_ID = process.env.EXPO_PUBLIC_RC_ENTITLEMENT_ID ?? "VoyageLog Pro";
interface SubscriptionContextType {
    isPro: boolean;
    isLoading: boolean;
    presentPaywall: () => Promise<boolean>; 
    restorePurchases: () => Promise<void>;
    purchasesReady: boolean;
}

const SubscriptionContext = createContext<SubscriptionContextType>({} as SubscriptionContextType);

// 2. PROVIDER BİLEŞENİ
export const SubscriptionProvider = ({ children }: { children: React.ReactNode }) => {
  const [isPro, setIsPro] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isConfigured, setIsConfigured] = useState(false);
  const [configError, setConfigError] = useState<string | null>(null);
  const [paywallVisible, setPaywallVisible] = useState(false);
  const configuredRef = useRef(false);
  const offeringsRef = useRef<PurchasesOfferings | null>(null);
  const customerInfoListenerRef = useRef<ReturnType<typeof Purchases.addCustomerInfoUpdateListener> | null>(null);
  const paywallResolveRef = useRef<((purchased: boolean) => void) | null>(null);
  
  // 3. BAĞLANTI VE ABONELİK DURUMU KONTROLÜ
  useEffect(() => {
    const configure = async () => {
      if (configuredRef.current) return;
      if (!REVENUECAT_API_KEY) {
        console.error("RC configure error: missing API key");
        setConfigError("Missing RevenueCat API key.");
        setIsConfigured(false);
        setIsLoading(false);
        return;
      }
      configuredRef.current = true;
      try {
        Purchases.setLogLevel(__DEV__ ? LOG_LEVEL.VERBOSE : LOG_LEVEL.ERROR); 
        await Purchases.configure({ 
            apiKey: REVENUECAT_API_KEY,
            appUserID: null, 
        });
        setIsConfigured(true);
        setConfigError(null);
        const offerings = await Purchases.getOfferings();
        offeringsRef.current = offerings;

        await fetchCustomerInfo();
        customerInfoListenerRef.current = Purchases.addCustomerInfoUpdateListener(updateCustomerStatus);
      } catch (e) {
        console.error("RC configure error:", e);
        configuredRef.current = false; // allow retry on next mount if needed
        setIsConfigured(false);
        setConfigError("RevenueCat could not be configured.");
        setIsLoading(false);
      }
    };

    configure();

    return () => {
      const listener = customerInfoListenerRef.current;
      if (listener) {
        // @ts-ignore
        listener?.remove?.();
        // @ts-ignore
        Purchases.removeCustomerInfoUpdateListener?.(listener);
      }
    };
  }, []);

  const updateCustomerStatus = async (customerInfo: CustomerInfo) => {
    const isUserPro = Boolean(customerInfo.entitlements.active?.[ENTITLEMENT_ID]);
    setIsPro(isUserPro);
    setIsLoading(false);
  };
  
  const fetchCustomerInfo = async () => {
      if (!configuredRef.current) return;
      try {
          const customerInfo = await Purchases.getCustomerInfo();
          updateCustomerStatus(customerInfo);
      } catch (e) {
          console.error("RC Customer Info Error:", e);
          setIsLoading(false);
      }
  }

  // 4. PAYWALL CLOSE HANDLER
  const handlePaywallClose = useCallback(async (result: PAYWALL_RESULT) => {
    setPaywallVisible(false);

    let purchased = false;
    if (result === PAYWALL_RESULT.PURCHASED || result === PAYWALL_RESULT.RESTORED) {
      await fetchCustomerInfo();
      purchased = true;
    }

    if (paywallResolveRef.current) {
      paywallResolveRef.current(purchased);
      paywallResolveRef.current = null;
    }
  }, []);

  // 5. PAYWALL'U SUNMA FONKSİYONU
  const presentPaywall = async (): Promise<boolean> => {
    if (!REVENUECAT_API_KEY) {
        Alert.alert("Purchases unavailable", "RevenueCat API key is missing in this build.");
        return false;
    }
    if (configError) {
        Alert.alert("Purchases unavailable", configError);
        return false;
    }
    if (!isConfigured) {
        Alert.alert("Purchases not ready", "Please try again in a moment.");
        return false;
    }
    const configured = await Purchases.isConfigured();
    if (!configured) {
        Alert.alert("Purchases unavailable", "RevenueCat is not configured yet.");
        return false;
    }
    if (!offeringsRef.current) {
        try {
          offeringsRef.current = await Purchases.getOfferings();
        } catch (error) {
          console.error("RC offerings load failed:", error)
        }
    }

    // Show the timed paywall and wait for result
    return new Promise<boolean>((resolve) => {
      paywallResolveRef.current = resolve;
      setPaywallVisible(true);
    });
  }

  // 5. SATIN ALIMLARI GERİ YÜKLEME FONKSİYONU (Aynı kalır)
  const restorePurchases = async () => {
      if (!configuredRef.current) {
          return;
      }
      try {
          setIsLoading(true);
          const customerInfo = await Purchases.restorePurchases();
          updateCustomerStatus(customerInfo);
          if (typeof customerInfo.entitlements.active[ENTITLEMENT_ID] !== "undefined") {
             Alert.alert("Restore", "Your purchases were restored successfully.");
          } else {
             Alert.alert("Restore", "No active subscriptions to restore.");
          }
      } catch (e) {
           Alert.alert("Error", "Restore failed. Please try again.");
      } finally {
        setIsLoading(false);
      }
  }

  const purchasesReady = configuredRef.current && !isLoading;

  const contextValue: SubscriptionContextType = { 
    isPro,
    isLoading,
    presentPaywall,
    restorePurchases,
    purchasesReady,
  };

  return (
    <SubscriptionContext.Provider value={contextValue}>
      {children}
      <TimedPaywall
        visible={paywallVisible}
        onClose={handlePaywallClose}
      />
    </SubscriptionContext.Provider>
  );
};

// 6. Hook'u Dışa Aktarma
export const useSubscription = () => useContext(SubscriptionContext);
