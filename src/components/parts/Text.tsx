import { Text as RNText, TextProps } from 'react-native';
import { useTheme } from '../../providers/ThemeProvider';

export const Text = (props: TextProps) => {
    const { cls } = useTheme();

    //@ts-ignore
    return <RNText {...props} style={[cls('text'), props.style]} />;
};
