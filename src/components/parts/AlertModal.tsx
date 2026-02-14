import { Modal, View, Text, Pressable } from 'react-native';
import { useTheme } from '../../providers/ThemeProvider';
import { Button } from './Button';

export interface AlertButton {
    text: string;
    onPress?: () => void;
    style?: 'default' | 'cancel' | 'destructive';
}

export interface AlertModalProps {
    visible: boolean;
    title: string;
    message?: string;
    buttons?: AlertButton[];
    onClose: () => void;
}

export const AlertModal = ({
    visible,
    title,
    message,
    buttons = [{ text: 'OK', style: 'default' }],
    onClose,
}: AlertModalProps) => {
    const { cls } = useTheme();

    const handleButtonPress = (button: AlertButton) => {
        onClose();
        // Execute button callback after modal closes
        setTimeout(() => {
            button.onPress?.();
        }, 100);
    };

    return (
        <Modal visible={visible} animationType="fade" transparent={true} onRequestClose={onClose}>
            <View style={cls('modal')}>
                <Pressable style={cls('modalBackdrop')} onPress={onClose} />
                <View style={[cls('modalContent'), { maxWidth: '100%', maxHeight: 'auto' }]}>
                    {/* Title */}
                    <View style={cls('modalHeader')}>
                        <Text style={cls('title')}>{title}</Text>
                        <View style={cls('modalHeaderButtons')}>
                            <Button
                                variant="transparent"
                                type="icon"
                                label="Close Modal"
                                iconSource="materialIcons"
                                iconName="close"
                                onPress={onClose}
                            />
                        </View>
                    </View>

                    {/* Message */}
                    <>
                        {message && (
                            <View style={cls('modalBody')}>
                                <Text style={cls('modalText')}>{message}</Text>
                            </View>
                        )}
                    </>

                    {/* Buttons */}
                    <View style={{ padding: 20, paddingTop: 0 }}>
                        <View style={cls('rows')}>
                            <>
                                {buttons?.map((button, index) => {
                                    let variant: 'primary' | 'secondary' = 'primary';

                                    if (button.style === 'cancel') {
                                        variant = 'secondary';
                                    } else if (button.style === 'destructive') {
                                        variant = 'secondary';
                                    }

                                    return (
                                        <Button
                                            key={index}
                                            label={button.text}
                                            variant={variant}
                                            type="text"
                                            onPress={() => handleButtonPress(button)}
                                        />
                                    );
                                })}
                            </>
                        </View>
                    </View>
                </View>
            </View>
        </Modal>
    );
};
