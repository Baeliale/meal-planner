import { Image, View } from 'react-native';
import { useTheme } from '../../providers/ThemeProvider';
import { LanguageSwitcher } from '../parts/LanguageSwitcher';
import logo from '../../../assets/logo.png';

export const TopBar = () => {
    const { cls } = useTheme();

    return (
        <View style={cls('topBar')}>
            <Image
                style={cls('logo')}
                source={logo}
                accessibilityLargeContentTitle={'Meal Planner'}
            />
            <LanguageSwitcher />
        </View>
    );
};
