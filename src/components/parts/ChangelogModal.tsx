import { useEffect, useState } from 'react';
import { Modal, View, ScrollView, Pressable } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../providers/ThemeProvider';
import { Button } from './Button';
import { Text } from './Text';
import { changelog, ChangelogEntry } from '../../changelog';

const LAST_SEEN_KEY = '@lastSeenChangelogId';

// Shows what changed since the user last opened the app, whether that
// arrived as a full app update or a silent OTA update. Compares the
// bundled changelog's newest entry id against the last one the user
// saw; any entries newer than that (including "never seen before",
// which naturally falls out of the same lookup) get shown once.
export const ChangelogModal = () => {
    const { t } = useTranslation();
    const { cls } = useTheme();
    const [entriesToShow, setEntriesToShow] = useState<ChangelogEntry[]>([]);

    useEffect(() => {
        const checkChangelog = async () => {
            try {
                const latestId = changelog[0]?.id;
                if (!latestId) return;

                const lastSeenId = await AsyncStorage.getItem(LAST_SEEN_KEY);
                if (lastSeenId === latestId) return;

                const lastSeenIndex = lastSeenId
                    ? changelog.findIndex(entry => entry.id === lastSeenId)
                    : -1;

                // Unknown or never-seen id: fall back to just the latest entry
                // rather than potentially dumping a long, stale backlog.
                const unseen = lastSeenIndex === -1 ? [changelog[0]] : changelog.slice(0, lastSeenIndex);

                if (unseen.length > 0) {
                    setEntriesToShow(unseen);
                }
            } catch {
                // Ignore - worst case the modal just doesn't show this launch.
            }
        };

        checkChangelog();
    }, []);

    const handleClose = async () => {
        const latestId = changelog[0]?.id;
        try {
            if (latestId) {
                await AsyncStorage.setItem(LAST_SEEN_KEY, latestId);
            }
        } catch {
            // Ignore - worst case the modal shows again next launch.
        }
        setEntriesToShow([]);
    };

    if (entriesToShow.length === 0) return null;

    return (
        <Modal visible animationType="fade" transparent onRequestClose={handleClose}>
            <View style={cls('modal')}>
                <Pressable style={cls('modalBackdrop')} onPress={handleClose} />
                <View style={cls('modalContent')}>
                    <View style={cls('modalHeader')}>
                        <Text style={[cls('title'), { flex: 1, marginInlineEnd: 10 }]}>
                            {t('changelog.title')}
                        </Text>
                        <View style={cls('modalHeaderButtons')}>
                            <Button
                                variant="transparent"
                                type="icon"
                                label={t('common.close')}
                                iconSource="materialIcons"
                                iconName="close"
                                onPress={handleClose}
                            />
                        </View>
                    </View>

                    <ScrollView style={cls('modalBody')}>
                        <>
                            {entriesToShow.map(entry => (
                                <View key={entry.id} style={cls('modalSection')}>
                                    <Text style={cls('subTitle')}>
                                        {entry.version} · {entry.date}
                                    </Text>
                                    <>
                                        {entry.items.map((item, index) => (
                                            <Text key={index} style={cls('modalBullet')}>
                                                • {item}
                                            </Text>
                                        ))}
                                    </>
                                </View>
                            ))}
                        </>
                    </ScrollView>

                    <View style={{ padding: 20, paddingTop: 0 }}>
                        <Button
                            variant="primary"
                            type="text"
                            label={t('common.close')}
                            onPress={handleClose}
                        />
                    </View>
                </View>
            </View>
        </Modal>
    );
};
