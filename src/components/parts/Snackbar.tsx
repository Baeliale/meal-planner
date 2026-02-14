import { Animated, Pressable } from 'react-native';
import { useEffect, useRef } from 'react';
import { Text } from './Text';
import { useTheme } from '../../providers/ThemeProvider';
import { MaterialIcons } from '@expo/vector-icons';

export type SnackbarType = 'notification' | 'success' | 'error';

interface SnackbarProps {
    visible: boolean;
    message: string;
    type?: SnackbarType;
    onDismiss: () => void;
    duration?: number;
    action?: {
        label: string;
        onPress: () => void;
    };
}

export const Snackbar = ({
    visible,
    message,
    type = 'notification',
    onDismiss,
    duration = 3000,
    action,
}: SnackbarProps) => {
    const { cls } = useTheme();
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (visible) {
            // Fade in
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }).start();

            // Auto-dismiss after duration
            // @ts-ignore
            timeoutRef.current = setTimeout(() => {
                handleDismiss();
            }, duration);
        } else {
            // Fade out
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 200,
                useNativeDriver: true,
            }).start();
        }

        return () => {
            if (timeoutRef.current) {
                // @ts-ignore
                clearTimeout(timeoutRef.current);
            }
        };
    }, [visible]);

    const handleDismiss = () => {
        Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
        }).start(() => {
            onDismiss();
        });
    };

    const getIcon = () => {
        switch (type) {
            case 'success':
                return 'check-circle';
            case 'error':
                return 'error';
            case 'notification':
            default:
                return 'info';
        }
    };

    const getTypeStyle = () => {
        switch (type) {
            case 'success':
                return 'snackbarSuccess';
            case 'error':
                return 'snackbarError';
            case 'notification':
            default:
                return '';
        }
    };

    // @ts-ignore
    if (!visible && fadeAnim._value === 0) {
        return null;
    }

    const styleClasses = `snackbar ${getTypeStyle()}`.trim();

    return (
        <Animated.View style={[cls(styleClasses), { opacity: fadeAnim }]}>
            <Animated.View style={cls('snackbarContent')}>
                <MaterialIcons name={getIcon()} size={24} color="#fff" />
                <Text style={cls('snackbarText')}>{message}</Text>
            </Animated.View>

            <Animated.View style={cls('snackbarActions')}>
                <>
                    {action && (
                        <Pressable onPress={action.onPress}>
                            <Text style={cls('snackbarActionText')}>{action.label}</Text>
                        </Pressable>
                    )}
                </>
                <Pressable onPress={handleDismiss}>
                    <MaterialIcons name="close" size={20} color="#fff" />
                </Pressable>
            </Animated.View>
        </Animated.View>
    );
};
