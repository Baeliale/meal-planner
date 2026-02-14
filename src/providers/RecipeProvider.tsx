import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Recipe, Planning } from '../types';

export type WeekDay = keyof Planning;

// Add this import at the top - we'll need to access the snackbar
// We'll use a callback pattern to avoid circular dependencies
type SnackbarCallback = (options: {
    message: string;
    type: 'success' | 'error' | 'notification';
}) => void;

interface RecipeContextType {
    recipes: Recipe[];
    weekPlanning: Planning;
    addRecipe: (recipe: Omit<Recipe, 'id'> & { id?: string }) => Promise<Recipe>;
    editRecipe: (recipe: Recipe) => Promise<Recipe>;
    removeRecipe: (recipeId: string) => Promise<void>;
    addRecipeToDay: (day: WeekDay, recipe: Recipe) => Promise<void>;
    removeRecipeFromDay: (day: WeekDay) => Promise<void>;
    clearWeekPlanning: () => Promise<void>;
    getRecipeById: (recipeId: string) => Recipe | undefined;
    getRecipeForDay: (day: WeekDay) => Recipe | null;
    isLoading: boolean;
    setSnackbarCallback: (callback: SnackbarCallback) => void;
}

const RecipeContext = createContext<RecipeContextType | undefined>(undefined);

interface RecipeProviderProps {
    children: ReactNode;
}

const STORAGE_KEYS = {
    RECIPES: '@recipes',
    WEEK_PLANNING: '@weekPlanning',
};

const defaultPlanning: Planning = {
    monday: null,
    tuesday: null,
    wednesday: null,
    thursday: null,
    friday: null,
    saturday: null,
    sunday: null,
};

export const useRecipes = (): RecipeContextType => {
    const context = useContext(RecipeContext);
    if (context === undefined) {
        throw new Error('useRecipes must be used within a RecipeProvider');
    }
    return context;
};

export const RecipeProvider: React.FC<RecipeProviderProps> = ({ children }) => {
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [weekPlanning, setWeekPlanning] = useState<Planning>(defaultPlanning);
    const [isLoading, setIsLoading] = useState(true);
    const [snackbarCallback, setSnackbarCallback] = useState<SnackbarCallback | null>(null);

    const showSnackbar = (options: {
        message: string;
        type: 'success' | 'error' | 'notification';
    }) => {
        if (snackbarCallback) {
            snackbarCallback(options);
        }
    };

    // Load initial data from AsyncStorage
    useEffect(() => {
        const loadData = async () => {
            try {
                const [storedRecipes, storedPlanning] = await Promise.all([
                    AsyncStorage.getItem(STORAGE_KEYS.RECIPES),
                    AsyncStorage.getItem(STORAGE_KEYS.WEEK_PLANNING),
                ]);

                if (storedRecipes) {
                    setRecipes(JSON.parse(storedRecipes));
                }

                if (storedPlanning) {
                    setWeekPlanning(JSON.parse(storedPlanning));
                }
            } catch (error) {
                console.error('Error loading data from AsyncStorage:', error);
                showSnackbar({
                    message: 'Failed to load recipes',
                    type: 'error',
                });
            } finally {
                setIsLoading(false);
            }
        };

        loadData();
    }, []);

    // Save recipes to AsyncStorage
    const saveRecipes = async (updatedRecipes: Recipe[]) => {
        try {
            await AsyncStorage.setItem(STORAGE_KEYS.RECIPES, JSON.stringify(updatedRecipes));
        } catch (error) {
            console.error('Error saving recipes to AsyncStorage:', error);
            throw error;
        }
    };

    // Save planning to AsyncStorage
    const savePlanning = async (updatedPlanning: Planning) => {
        try {
            await AsyncStorage.setItem(STORAGE_KEYS.WEEK_PLANNING, JSON.stringify(updatedPlanning));
        } catch (error) {
            console.error('Error saving planning to AsyncStorage:', error);
            throw error;
        }
    };

    // Add a new recipe
    const addRecipe = async (recipe: Omit<Recipe, 'id'> & { id?: string }): Promise<Recipe> => {
        try {
            const newRecipe: Recipe = {
                ...recipe,
                id: recipe.id || `recipe-${Date.now()}`,
            };
            const updatedRecipes = [...recipes, newRecipe];
            setRecipes(updatedRecipes);
            await saveRecipes(updatedRecipes);

            showSnackbar({
                message: `"${newRecipe.name}" added successfully!`,
                type: 'success',
            });

            return newRecipe;
        } catch (error) {
            showSnackbar({
                message: 'Failed to add recipe',
                type: 'error',
            });
            throw error;
        }
    };

    // Edit a recipe
    const editRecipe = async (recipe: Recipe): Promise<Recipe> => {
        try {
            const recipeIndex = recipes.findIndex(r => r.id === recipe.id);

            if (recipeIndex === -1) {
                throw new Error('Recipe not found');
            }

            const updatedRecipes = [...recipes];
            updatedRecipes[recipeIndex] = recipe;

            setRecipes(updatedRecipes);
            await saveRecipes(updatedRecipes);

            showSnackbar({
                message: `"${recipe.name}" updated successfully!`,
                type: 'success',
            });

            return recipe;
        } catch (error) {
            showSnackbar({
                message: 'Failed to update recipe',
                type: 'error',
            });
            throw error;
        }
    };

    // Remove a recipe
    const removeRecipe = async (recipeId: string): Promise<void> => {
        try {
            const recipe = recipes.find(r => r.id === recipeId);
            const recipeName = recipe?.name || 'Recipe';

            const updatedRecipes = recipes.filter(recipe => recipe.id !== recipeId);
            setRecipes(updatedRecipes);
            await saveRecipes(updatedRecipes);

            const updatedPlanning = { ...weekPlanning };
            let planningChanged = false;

            (Object.keys(updatedPlanning) as WeekDay[]).forEach(day => {
                if (updatedPlanning[day] === recipeId) {
                    updatedPlanning[day] = null;
                    planningChanged = true;
                }
            });

            if (planningChanged) {
                setWeekPlanning(updatedPlanning);
                await savePlanning(updatedPlanning);
            }

            showSnackbar({
                message: `"${recipeName}" deleted`,
                type: 'success',
            });
        } catch (error) {
            showSnackbar({
                message: 'Failed to delete recipe',
                type: 'error',
            });
            throw error;
        }
    };

    const addRecipeToDay = async (day: WeekDay, recipe: Recipe): Promise<void> => {
        try {
            const updatedPlanning = {
                ...weekPlanning,
                [day]: recipe.id,
            };
            setWeekPlanning(updatedPlanning);
            await savePlanning(updatedPlanning);

            showSnackbar({
                message: `"${recipe.name}" added to ${day}`,
                type: 'success',
            });
        } catch (error) {
            showSnackbar({
                message: 'Failed to add recipe to day',
                type: 'error',
            });
            throw error;
        }
    };

    const removeRecipeFromDay = async (day: WeekDay): Promise<void> => {
        try {
            const updatedPlanning = {
                ...weekPlanning,
                [day]: null,
            };
            setWeekPlanning(updatedPlanning);
            await savePlanning(updatedPlanning);

            showSnackbar({
                message: `Removed from ${day}`,
                type: 'success',
            });
        } catch (error) {
            showSnackbar({
                message: 'Failed to remove recipe',
                type: 'error',
            });
            throw error;
        }
    };

    // Clear entire week planning
    const clearWeekPlanning = async (): Promise<void> => {
        try {
            setWeekPlanning(defaultPlanning);
            await savePlanning(defaultPlanning);

            showSnackbar({
                message: 'Week planning cleared',
                type: 'success',
            });
        } catch (error) {
            showSnackbar({
                message: 'Failed to clear week planning',
                type: 'error',
            });
            throw error;
        }
    };

    // Get recipe by ID
    const getRecipeById = (recipeId: string): Recipe | undefined => {
        return recipes.find(recipe => recipe.id === recipeId);
    };

    const getRecipeForDay = (day: WeekDay): Recipe | null => {
        const recipeId = weekPlanning[day];
        if (!recipeId) return null;
        return getRecipeById(recipeId) || null;
    };

    const value: RecipeContextType = {
        recipes,
        weekPlanning,
        addRecipe,
        editRecipe,
        removeRecipe,
        addRecipeToDay,
        removeRecipeFromDay,
        clearWeekPlanning,
        getRecipeById,
        getRecipeForDay,
        isLoading,
        setSnackbarCallback: (callback: SnackbarCallback) => setSnackbarCallback(() => callback),
    };

    return <RecipeContext.Provider value={value}>{children}</RecipeContext.Provider>;
};
