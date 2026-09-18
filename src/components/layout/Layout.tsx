import { ScrollView, Text, View } from 'react-native';
import { ToolBar } from './ToolBar';
import { useEffect, useState } from 'react';
import { useTheme } from '../../providers/ThemeProvider';
import { RecipeList } from '../screens/RecipeList';
import { WeekPlanning } from '../screens/WeekPlanning';
import { TopBar } from './TopBar';
import { SwipeableScreen } from './SwipeableScreen';
import { ShoppingList } from '../screens/ShoppingList';
import { UpdateNotice } from '../parts/UpdateNotice';
import { ChangelogModal } from '../parts/ChangelogModal';
import { AutoUpdate } from '../parts/AutoUpdate';
import { useRecipes } from '../../providers/RecipeProvider';

const screens = ['planning', 'recipes', 'shopping'] as const;

export type Screen = (typeof screens)[number];

export const Layout = () => {
    const [activeView, setActiveView] = useState<Screen>('planning');
    const { cls } = useTheme();
    const { recipes, isLoading } = useRecipes();

    // First-time users have no recipes yet, so Week Planning (the default)
    // is a dead end - send them to the Recipe List instead. Only steers
    // navigation once, right after the initial load finishes.
    const [hasSteeredFirstTimeUser, setHasSteeredFirstTimeUser] = useState(false);
    useEffect(() => {
        if (!isLoading && !hasSteeredFirstTimeUser) {
            if (recipes.length === 0) {
                setActiveView('recipes');
            }
            setHasSteeredFirstTimeUser(true);
        }
    }, [isLoading, recipes.length, hasSteeredFirstTimeUser]);

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
            <AutoUpdate />
            <UpdateNotice />
            <ChangelogModal />
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
