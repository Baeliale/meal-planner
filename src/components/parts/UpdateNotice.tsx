import { useEffect, useState } from 'react';
import { Linking, Pressable, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Application from 'expo-application';
import { useTranslation } from 'react-i18next';
import { MaterialIcons } from '@expo/vector-icons';
import { Text } from './Text';
import { useTheme } from '../../providers/ThemeProvider';

const REPO = 'Baeliale/meal-planner';
const DISMISSED_KEY = '@dismissedUpdateVersion';

interface AvailableRelease {
    tagName: string;
    url: string;
}

const parseVersion = (version: string): number[] =>
    version
        .replace(/^v/, '')
        .split('.')
        .map(part => parseInt(part, 10) || 0);

// True if `latest` is a higher semantic version than `current`.
const isNewerVersion = (latest: string, current: string): boolean => {
    const latestParts = parseVersion(latest);
    const currentParts = parseVersion(current);

    for (let i = 0; i < Math.max(latestParts.length, currentParts.length); i++) {
        const diff = (latestParts[i] || 0) - (currentParts[i] || 0);
        if (diff !== 0) return diff > 0;
    }

    return false;
};

// Checks GitHub for a newer tagged release than the installed native build.
// This is unrelated to OTA (expo-updates) updates - it only fires when a
// new native release exists that requires downloading and installing a new
// APK, since that can't happen automatically.
export const UpdateNotice = () => {
    const { t } = useTranslation();
    const { cls } = useTheme();
    const [release, setRelease] = useState<AvailableRelease | null>(null);

    useEffect(() => {
        let cancelled = false;

        const checkForUpdate = async () => {
            try {
                const currentVersion = Application.nativeApplicationVersion;
                if (!currentVersion) return;

                const response = await fetch(
                    `https://api.github.com/repos/${REPO}/releases/latest`
                );
                if (!response.ok) return;

                const data = await response.json();
                const tagName: string | undefined = data.tag_name;
                const url: string | undefined = data.html_url;
                if (!tagName || !url) return;

                if (!isNewerVersion(tagName, currentVersion)) return;

                const dismissedVersion = await AsyncStorage.getItem(DISMISSED_KEY);
                if (dismissedVersion === tagName) return;

                if (!cancelled) {
                    setRelease({ tagName, url });
                }
            } catch {
                // Offline, rate-limited, etc. - fail silently, try again next launch.
            }
        };

        checkForUpdate();

        return () => {
            cancelled = true;
        };
    }, []);

    const handleDismiss = async () => {
        if (release) {
            await AsyncStorage.setItem(DISMISSED_KEY, release.tagName);
        }
        setRelease(null);
    };

    if (!release) return null;

    return (
        <View style={cls('updateNotice')}>
            <Pressable
                style={cls('updateNoticeContent')}
                onPress={() => Linking.openURL(release.url)}
            >
                <MaterialIcons name="system-update" size={20} color="#fff" />
                <Text style={cls('updateNoticeText')}>
                    {t('common.updateAvailable', {
                        version: release.tagName.replace(/^v/, ''),
                    })}
                </Text>
            </Pressable>
            <Pressable onPress={handleDismiss} accessibilityLabel={t('common.dismiss')}>
                <MaterialIcons name="close" size={20} color="#fff" />
            </Pressable>
        </View>
    );
};
