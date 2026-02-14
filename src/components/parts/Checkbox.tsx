import { Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Text } from './Text';
import { useTheme } from '../../providers/ThemeProvider';

interface CheckboxProps {
    checked: boolean;
    onToggle: () => void;
    label?: string;
    style?: StyleSheet | StyleSheet[];
}

export const Checkbox = ({ checked, onToggle, label, style }: CheckboxProps) => {
    const { theme, cls } = useTheme();

    return (
        <Pressable onPress={onToggle} style={[cls('checkboxWrapper'), style]}>
            <MaterialIcons
                name={checked ? 'check-box' : 'check-box-outline-blank'}
                size={24}
                color={theme === 'dark' ? 'white' : 'coal'}
            />
            <>{label && <Text style={{ fontSize: 12 }}>{label}</Text>}</>
        </Pressable>
    );
};
