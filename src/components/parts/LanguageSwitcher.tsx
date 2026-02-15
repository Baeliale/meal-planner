import { View, Pressable } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Text } from './Text';
import { useTheme } from '../../providers/ThemeProvider';

export const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const { cls } = useTheme();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <View style={[cls('languageSwitcher'), { flexDirection: 'row', gap: 8 }]}>
      <Pressable
        onPress={() => changeLanguage('en')}
        style={[
            cls('languageButton'),
            { opacity: i18n.language === 'en' ? 1 : 0.5 },
        ]}
      >
        <Text style={cls('buttonText buttonPrimaryText')}>EN</Text>
      </Pressable>
      <Pressable
        onPress={() => changeLanguage('nl')}
        style={[
            cls('languageButton'),
            { opacity: i18n.language === 'nl' ? 1 : 0.5 },
        ]}
      >
        <Text style={cls('buttonText buttonPrimaryText')}>NL</Text>
      </Pressable>
    </View>
  );
};