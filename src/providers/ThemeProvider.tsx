import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { styles as lightStyles, darkStyles } from '../styles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Appearance } from 'react-native';

type Theme = 'light' | 'dark';

interface ThemeContextType {
    theme: Theme;
    toggleTheme: () => void;
    styles: typeof lightStyles;
    cls: (classes: string) => any;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
    children: ReactNode;
}

export const useTheme = (): ThemeContextType => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
    const preferredColorScheme = Appearance.getColorScheme();
    const [theme, setTheme] = useState<Theme>(preferredColorScheme === 'dark' ? 'dark' : 'light');
    const [isLoading, setIsLoading] = useState(true);

    // Load initial data from AsyncStorage, falling back to the OS preference
    // (already set as the initial state) when nothing has been saved yet.
    useEffect(() => {
        const loadData = async () => {
            try {
                const storedTheme = await AsyncStorage.getItem('@theme');

                if (storedTheme) {
                    setTheme(JSON.parse(storedTheme));
                }
            } catch (error) {
                console.error('Error loading data from AsyncStorage:', error);
            } finally {
                setIsLoading(false);
            }
        };

        loadData();
    }, []);

    const saveTheme = async (theme: string) => {
        try {
            await AsyncStorage.setItem('@theme', JSON.stringify(theme));
        } catch (error) {
            console.error('Error saving theme to AsyncStorage:', error);
        }
    };

    const toggleTheme = async () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        await saveTheme(newTheme);
        setTheme(newTheme);
    };

    const styles = theme === 'light' ? lightStyles : darkStyles;

    const cls = (classes: string) => {
        return classes
            .split(' ')
            .map(c => styles[c as keyof typeof styles])
            .reduce((acc, style) => ({ ...acc, ...style }), {});
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme, styles, cls }}>
            {children}
        </ThemeContext.Provider>
    );
};
