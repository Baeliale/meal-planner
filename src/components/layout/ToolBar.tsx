import { Pressable, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome } from '@expo/vector-icons';
import { useTheme } from '../../providers/ThemeProvider';
import { colors } from '../../styles';
import { Screen } from './Layout';

export const ToolBar = ({
    activeView,
    setActiveView,
}: {
    activeView: string;
    setActiveView: (value: ((prevState: Screen) => Screen) | Screen) => void;
}) => {
    const { cls, theme, toggleTheme } = useTheme();

    const toolBarStyles = view =>
        cls(`toolBarButton ${activeView === view ? 'toolBarButtonActive' : ''}`);

    const iconColor = colors.textPrimary.light

    return (
        <LinearGradient colors={[colors.primary, colors.primaryDark]} style={cls('toolBar')}>
            <Pressable onPress={() => setActiveView('planning')} style={toolBarStyles('planning')}>
                <FontAwesome
                    name={'calendar'}
                    size={24}
                    color={iconColor}
                    accessibilityLargeContentTitle={'Planning'}
                />
            </Pressable>
            <Pressable onPress={() => setActiveView('recipes')} style={toolBarStyles('recipes')}>
                <FontAwesome
                    name={'book'}
                    size={24}
                    color={iconColor}
                    accessibilityLargeContentTitle={'Recipes'}
                />
            </Pressable>
            <Pressable
                style={cls(
                    'toolBarButton' + (activeView === 'shopping' ? ' toolBarButtonActive' : '')
                )}
                onPress={() => setActiveView('shopping')}
            >
                <FontAwesome
                    name="shopping-cart"
                    size={24}
                    color={iconColor}
                    accessibilityLargeContentTitle={'Shopping list'}
                />
            </Pressable>
            <Pressable onPress={() => toggleTheme()} style={toolBarStyles('theme')}>
                <View style={cls('toolBarButtonBackground')}>
                    <FontAwesome
                        name={theme === 'light' ? 'moon-o' : 'sun-o'}
                        size={24}
                        color={iconColor}
                        accessibilityLargeContentTitle={'Toggle dark/light mode'}
                    />
                </View>
            </Pressable>
        </LinearGradient>
    );
};
