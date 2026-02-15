import { Animated, View } from 'react-native';
import { useEffect, useRef, ReactNode } from 'react';
import { Button } from './Button';
import { useTheme } from '../../providers/ThemeProvider';

interface SlideMenuProps {
    open: boolean;
    children: ReactNode;
    setOpen: () => void;
    slideWidth?: number;
}

export const SlideMenu = ({ open, setOpen, children, slideWidth }: SlideMenuProps) => {
    const { cls } = useTheme();
    slideWidth = slideWidth ?? 195;
    const slideAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (open) {
            Animated.spring(slideAnim, {
                toValue: -slideWidth,
                useNativeDriver: true,
                tension: 65,
                friction: 11,
            }).start();
        } else {
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 200,
                useNativeDriver: true,
            }).start();
        }
    }, [open]);

    return (
        <View style={cls('slideMenu')}>
            <View
                style={cls(`slideMenuToggleWrapper ${open ? 'slideMenuToggleWrapperActive' : ''}`)}
            >
                <Button
                    label="Settings"
                    variant="transparent"
                    type="icon"
                    iconName="settings"
                    iconSource="materialIcons"
                    onPress={setOpen}
                />
            </View>
            <>
                {open && (
                    <Animated.View
                        style={[
                            cls('slideMenuContent'),
                            {
                                width: slideWidth,
                                transform: [{ translateX: slideAnim }],
                            },
                        ]}
                    >
                        {children}
                    </Animated.View>
                )}
            </>
        </View>
    );
};
