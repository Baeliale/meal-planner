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
    const [theme, setTheme] = useState<Theme>('light');
    const [isLoading, setIsLoading] = useState(true);
    const preferredColorScheme = Appearance.getColorScheme();

    useEffect(() => {
        if (preferredColorScheme && !theme) {
            setTheme(preferredColorScheme === 'dark' ? 'dark' : 'light');
        }
    }, [theme, preferredColorScheme]);

    // Load initial data from AsyncStorage
    useEffect(() => {
        const loadData = async () => {
            try {
                const storedTheme = await AsyncStorage.getItem('@theme');

                if (storedTheme) {
                    setTheme(JSON.parse(storedTheme ?? 'light'));
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
