import { ScrollView, Text, View } from 'react-native';
import { ToolBar } from './ToolBar';
import { useState } from 'react';
import { useTheme } from '../../providers/ThemeProvider';
import { RecipeList } from '../screens/RecipeList';
import { WeekPlanning } from '../screens/WeekPlanning';
import { TopBar } from './TopBar';
import { SwipeableScreen } from './SwipeableScreen';
import { ShoppingList } from '../screens/ShoppingList';

const screens = ['planning', 'recipes', 'shopping'] as const;

export type Screen = (typeof screens)[number];

export const Layout = () => {
    const [activeView, setActiveView] = useState<Screen>('planning');
    const { cls } = useTheme();

    const currentIndex = screens.indexOf(activeView);

    const handleSwipeLeft = () => {
        const nextIndex = currentIndex + 1;
        if (nextIndex < screens.length) {
            setActiveView(screens[nextIndex]);
        }
    };

    const handleSwipeRight = () => {
        const prevIndex = currentIndex - 1;
        if (prevIndex >= 0) {
            setActiveView(screens[prevIndex]);
        }
    };

    const ActiveComponent = () => {
        switch (activeView) {
            case 'recipes':
                return <RecipeList />;
            case 'planning':
                return <WeekPlanning />;
            case 'shopping':
                return <ShoppingList />;
            default:
                return null;
        }
    };

    return (
        <View style={cls('app')}>
            <TopBar />
            <SwipeableScreen
                onSwipeLeft={handleSwipeLeft}
                onSwipeRight={handleSwipeRight}
                canSwipeLeft={currentIndex < screens.length - 1}
                canSwipeRight={currentIndex > 0}
            >
                <ScrollView>
                    <View style={cls('mainArea')}>
                        <ActiveComponent />
                    </View>
                </ScrollView>
            </SwipeableScreen>
            <ToolBar activeView={activeView} setActiveView={setActiveView} />
        </View>
    );
};
