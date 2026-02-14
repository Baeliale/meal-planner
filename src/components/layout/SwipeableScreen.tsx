import React, { useRef, useEffect } from 'react';
import { Animated, PanResponder, Dimensions } from 'react-native';

interface SwipeableScreenProps {
    children: React.ReactNode;
    onSwipeLeft?: () => void;
    onSwipeRight?: () => void;
    canSwipeLeft?: boolean;
    canSwipeRight?: boolean;
}

export const SwipeableScreen = ({
    children,
    onSwipeLeft,
    onSwipeRight,
    canSwipeLeft = true,
    canSwipeRight = true,
}: SwipeableScreenProps) => {
    const pan = useRef(new Animated.ValueXY()).current;
    const screenWidth = Dimensions.get('window').width;

    // Store the latest values in refs so panResponder can access them
    const canSwipeLeftRef = useRef(canSwipeLeft);
    const canSwipeRightRef = useRef(canSwipeRight);
    const onSwipeLeftRef = useRef(onSwipeLeft);
    const onSwipeRightRef = useRef(onSwipeRight);

    // Update refs when props change
    useEffect(() => {
        canSwipeLeftRef.current = canSwipeLeft;
        canSwipeRightRef.current = canSwipeRight;
        onSwipeLeftRef.current = onSwipeLeft;
        onSwipeRightRef.current = onSwipeRight;
    }, [canSwipeLeft, canSwipeRight, onSwipeLeft, onSwipeRight]);

    const panResponder = useRef(
        PanResponder.create({
            onMoveShouldSetPanResponder: (_, gestureState) => {
                // Only respond to horizontal swipes (not vertical scrolling)
                return (
                    Math.abs(gestureState.dx) > Math.abs(gestureState.dy) &&
                    Math.abs(gestureState.dx) > 10
                );
            },
            onPanResponderMove: (_, gestureState) => {
                // Limit pan movement if swipe is not allowed
                let dx = gestureState.dx;

                // If swiping right but can't, limit to small bounce
                if (dx > 0 && !canSwipeRightRef.current) {
                    dx = Math.min(dx, 50); // Max 50px bounce
                }
                // If swiping left but can't, limit to small bounce
                if (dx < 0 && !canSwipeLeftRef.current) {
                    dx = Math.max(dx, -50); // Max 50px bounce
                }

                pan.setValue({ x: dx, y: 0 });
            },
            onPanResponderRelease: (_, gestureState) => {
                const swipeThreshold = screenWidth * 0.2; // 20% of screen width
                const swipeVelocity = Math.abs(gestureState.vx);

                // Swipe right (go to previous screen)
                if (
                    gestureState.dx > swipeThreshold &&
                    canSwipeRightRef.current &&
                    swipeVelocity > 0.3
                ) {
                    Animated.timing(pan, {
                        toValue: { x: screenWidth, y: 0 },
                        duration: 200,
                        useNativeDriver: false,
                    }).start(() => {
                        pan.setValue({ x: 0, y: 0 });
                        onSwipeRightRef.current?.();
                    });
                }
                // Swipe left (go to next screen)
                else if (
                    gestureState.dx < -swipeThreshold &&
                    canSwipeLeftRef.current &&
                    swipeVelocity > 0.3
                ) {
                    Animated.timing(pan, {
                        toValue: { x: -screenWidth, y: 0 },
                        duration: 200,
                        useNativeDriver: false,
                    }).start(() => {
                        pan.setValue({ x: 0, y: 0 });
                        onSwipeLeftRef.current?.();
                    });
                }
                // Reset with bounce (swipe not allowed or not far enough)
                else {
                    Animated.spring(pan, {
                        toValue: { x: 0, y: 0 },
                        friction: 7,
                        tension: 40,
                        useNativeDriver: false,
                    }).start();
                }
            },
        })
    ).current;

    //@ts-ignore
    return (
        <Animated.View
            style={{
                flex: 1,
                transform: [{ translateX: pan.x }],
            }}
            {...panResponder.panHandlers}
        >
            {children}
        </Animated.View>
    );
};
