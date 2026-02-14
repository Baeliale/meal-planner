import { TextInput, TextInputProps, ViewStyle, View } from 'react-native';
import { useTheme } from '../../providers/ThemeProvider';
import { Text } from './Text';

interface InputProps extends Omit<TextInputProps, 'style' | 'children'> {
    type?: 'text' | 'textarea';
    style?: ViewStyle | ViewStyle[];
    label?: string;
    noMargin?: boolean;
}

export const Input = ({
    type = 'text',
    style,
    label,
    noMargin = false,
    multiline,
    numberOfLines,
    ...props
}: InputProps) => {
    const { cls } = useTheme();

    const baseStyle = type === 'textarea' ? 'textArea' : 'input';
    const marginStyle = noMargin ? '' : 'marginBottom';

    //@ts-ignore
    const input = (
        <TextInput
            style={[cls(`${baseStyle} ${marginStyle}`), style]}
            multiline={type === 'textarea' ? true : multiline}
            numberOfLines={type === 'textarea' ? numberOfLines || 4 : numberOfLines}
            placeholderTextColor={cls('text').color}
            {...props}
        />
    );

    if (label) {
        return (
            <View style={cls('columns')}>
                <Text style={cls('label')}>{label}</Text>
                <>{input}</>
            </View>
        );
    }

    return input;
};
