import { Pressable, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
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
    const { t } = useTranslation();
    const { cls, theme, toggleTheme } = useTheme();
    
    const toolBarStyles = (view: Screen | string) =>
        cls(`toolBarButton ${activeView === view ? 'toolBarButtonActive' : ''}`);
    
    const iconColor = colors.textPrimary.light;
    
    return (
        <LinearGradient colors={[colors.primary, colors.primaryDark]} style={cls('toolBar')}>
            <Pressable onPress={() => setActiveView('planning')} style={toolBarStyles('planning')}>
                <FontAwesome
                    name={'calendar'}
                    size={24}
                    color={iconColor}
                    accessibilityLabel={t('screens.weekPlanning')}
                />
            </Pressable>
            <Pressable onPress={() => setActiveView('recipes')} style={toolBarStyles('recipes')}>
                <FontAwesome
                    name={'book'}
                    size={24}
                    color={iconColor}
                    accessibilityLabel={t('screens.recipeList')}
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
                    accessibilityLabel={t('screens.shoppingList')}
                />
            </Pressable>
            <Pressable onPress={() => toggleTheme()} style={toolBarStyles('theme')}>
                <View style={cls('toolBarButtonBackground')}>
                    <FontAwesome
                        name={theme === 'light' ? 'moon-o' : 'sun-o'}
                        size={24}
                        color={iconColor}
                        accessibilityLabel={theme === 'light' ? t('common.darkMode') : t('common.lightMode')}
                    />
                </View>
            </Pressable>
        </LinearGradient>
    );
};