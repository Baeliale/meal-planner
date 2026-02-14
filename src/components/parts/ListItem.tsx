import { ReactNode } from 'react';
import { View, ViewStyle } from 'react-native';
import { useTheme } from '../../providers/ThemeProvider';

export const ListItem = ({
    direction = 'rows',
    style,
    children,
}: {
    direction?: 'rows' | 'columns';
    style?: ViewStyle | ViewStyle[];
    children: ReactNode;
}) => {
    const { cls } = useTheme();

    return <View style={[cls(`listItem ${direction}`), style]}>{children}</View>;
};
