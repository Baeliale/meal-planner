import { useEffect } from 'react';
import { Platform } from 'react-native';
import * as Updates from 'expo-updates';

// By default expo-updates only downloads a newly published OTA update in
// the background - it doesn't take effect until the app is fully closed
// and reopened a second time. That makes updates look like they "didn't
// come through" even though they did. This checks once on launch and, if
// an update is available, downloads and applies it immediately via a
// reload, so a single reopen is enough.
export const AutoUpdate = () => {
    useEffect(() => {
        if (Platform.OS === 'web' || __DEV__ || !Updates.isEnabled) {
            return;
        }

        const applyUpdateIfAvailable = async () => {
            try {
                const check = await Updates.checkForUpdateAsync();
                if (!check.isAvailable) return;

                await Updates.fetchUpdateAsync();
                await Updates.reloadAsync();
            } catch {
                // Offline, rate-limited, etc. - falls back to the default
                // background check, which will pick it up on a later launch.
            }
        };

        applyUpdateIfAvailable();
    }, []);

    return null;
};
