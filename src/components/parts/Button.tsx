import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text } from 'react-native';
import { useTheme } from '../../providers/ThemeProvider';
import { colors } from '../../styles';

interface ButtonProps {
    variant: 'primary' | 'secondary' | 'transparent' | 'iconOnly';
    type?: 'text' | 'icon';
    label: string; // On type 'icon', this will be used as accessibility label
    iconSource?: 'materialIcons' | 'fontAwesome';
    iconName?: string;
    iconSize?: number;
    onPress: (value: any) => void;
    style?: StyleSheet | StyleSheet[];
}

export const Button = ({
    variant,
    type = 'text',
    label,
    iconSource,
    iconName,
    iconSize,
    onPress,
    style,
}: ButtonProps) => {
    const { cls, theme } = useTheme();

    const buttonClass = () => {
        switch (variant) {
            case 'primary':
                return 'buttonPrimary';
            case 'secondary':
                return 'buttonSecondary';
            case 'transparent':
                return 'buttonTransparent';
            case 'iconOnly':
                return 'buttonIconOnly';
            default:
                return 'buttonBlue';
        }
    };

    const buttonTextClass = () => {
        switch (variant) {
            case 'primary':
                return 'buttonPrimaryText';
            case 'secondary':
                return 'buttonSecondaryText';
            case 'transparent':
                return '';
            case 'iconOnly':
                return '';
            default:
                return '';
        }
    };

    const iconColor =
        variant === 'transparent' || variant === 'iconOnly'
            ? theme === 'light'
                ? colors.textPrimary.light
                : colors.textPrimary.dark
            : variant === 'primary'
              ? colors.textPrimary.light
              : colors.textPrimary.dark;

    iconSize = iconSize ?? 24;

    const IconComponent = () => {
        switch (iconSource) {
            case 'materialIcons':
                return (
                    <MaterialIcons
                         // @ts-ignore
                        name={iconName ?? 'add'}
                        size={iconSize}
                        color={iconColor}
                        accessibilityLargeContentTitle={label}
                    />
                );
            case 'fontAwesome':
                return (
                    <FontAwesome
                        // @ts-ignore
                        name={iconName ?? 'plus'}
                        size={iconSize}
                        color={iconColor}
                        accessibilityLargeContentTitle={label}
                    />
                );
            default:
                return (
                    <FontAwesome
                        // @ts-ignore
                        name={iconName ?? 'plus'}
                        size={iconSize}
                        color={iconColor}
                        accessibilityLargeContentTitle={label}
                    />
                );
        }
    };

    return (
        <Pressable
            style={[cls(`button ${buttonClass()} ${type === 'icon' ? 'buttonIcon' : ''}`), style]}
            onPress={onPress}
        >
            <>
                {type === 'text' ? (
                    <Text style={cls(`buttonText ${buttonTextClass()}`)}>{label}</Text>
                ) : (
                    <IconComponent />
                )}
            </>
        </Pressable>
    );
};
