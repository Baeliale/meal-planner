import { Animated, View } from 'react-native';
import { useEffect, useRef, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from './Button';
import { useTheme } from '../../providers/ThemeProvider';

interface SlideMenuProps {
    open: boolean;
    children: ReactNode;
    setOpen: () => void;
    slideWidth?: number;
}

export const SlideMenu = ({ open, setOpen, children, slideWidth }: SlideMenuProps) => {
    const { t } = useTranslation();
    const { cls } = useTheme();
    slideWidth = slideWidth ?? 195;
    const slideAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (open) {
            // Critically damped so the menu settles into its final position
            // almost immediately, instead of visibly drifting under a tap
            // for the better part of a second like an underdamped spring would.
            Animated.spring(slideAnim, {
                toValue: -slideWidth,
                useNativeDriver: true,
                tension: 120,
                friction: 20,
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
                    label={t('common.moreActions')}
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
