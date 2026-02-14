import { Pressable, ScrollView, View } from 'react-native';
import { useTheme } from '../../providers/ThemeProvider';
import { useState } from 'react';
import { FontAwesome } from '@expo/vector-icons';
import { Text } from './Text';

interface ItemPickerProps {
    items: { label: string; value: string }[];
    onSelect: (value: string) => void;
    selectedValue: string;
    emptyLabel?: string;
    label?: string;
}

export const ItemPicker = ({
    items,
    onSelect,
    selectedValue,
    emptyLabel,
    label,
}: ItemPickerProps) => {
    const { cls, theme } = useTheme();
    const [showDropdown, setShowDropdown] = useState(false);

    return (
        <View style={cls('picker')}>
            <>{label && <Text>{label}</Text>}</>
            <Pressable
                style={cls('pickerButton input marginTop')}
                onPress={() => setShowDropdown(prevState => !prevState)}
            >
                <Text>{emptyLabel ?? 'Select an item...'}</Text>
                <FontAwesome
                    name={showDropdown ? 'chevron-up' : 'chevron-down'}
                    size={12}
                    color={theme === 'light' ? 'coal' : 'white'}
                />
            </Pressable>
            <>
                {showDropdown && (
                    <ScrollView style={cls('pickerDropdown')} nestedScrollEnabled>
                        <>
                            {items.map(item => (
                                <Pressable
                                    key={item.value}
                                    style={cls(
                                        'pickerItem',
                                        item.value === selectedValue && 'pickerItemSelected'
                                    )}
                                    onPress={() => onSelect(item.value)}
                                >
                                    <Text>{item.label}</Text>
                                </Pressable>
                            ))}
                        </>
                    </ScrollView>
                )}
            </>
        </View>
    );
};
