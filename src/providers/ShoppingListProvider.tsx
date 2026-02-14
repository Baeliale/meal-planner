import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ShoppingListItem } from '../types';
import { useRecipes } from './RecipeProvider';

type SnackbarCallback = (options: {
    message: string;
    type: 'success' | 'error' | 'notification';
}) => void;

interface ShoppingListContextType {
    shoppingList: ShoppingListItem[];
    generateShoppingList: () => void;
    addShoppingListItem: (item: Omit<ShoppingListItem, 'id'>) => Promise<void>;
    removeShoppingListItem: (itemId: string) => Promise<void>;
    toggleShoppingListItem: (itemId: string) => Promise<void>;
    editShoppingListItem: (item: ShoppingListItem) => Promise<void>;
    clearShoppingList: () => Promise<void>;
    isLoading: boolean;
    setSnackbarCallback: (callback: SnackbarCallback) => void;
}

const ShoppingListContext = createContext<ShoppingListContextType | undefined>(undefined);

interface ShoppingListProviderProps {
    children: ReactNode;
}

const STORAGE_KEY = '@shoppingList';

export const useShoppingList = (): ShoppingListContextType => {
    const context = useContext(ShoppingListContext);
    if (context === undefined) {
        throw new Error('useShoppingList must be used within a ShoppingListProvider');
    }
    return context;
};

export const ShoppingListProvider: React.FC<ShoppingListProviderProps> = ({ children }) => {
    const { weekPlanning, getRecipeById } = useRecipes();
    const [shoppingList, setShoppingList] = useState<ShoppingListItem[]>([]);
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

    // Load shopping list from AsyncStorage
    useEffect(() => {
        const loadData = async () => {
            try {
                const storedShoppingList = await AsyncStorage.getItem(STORAGE_KEY);
                if (storedShoppingList) {
                    setShoppingList(JSON.parse(storedShoppingList));
                }
            } catch (error) {
                console.error('Error loading shopping list from AsyncStorage:', error);
                showSnackbar({
                    message: 'Failed to load shopping list',
                    type: 'error',
                });
            } finally {
                setIsLoading(false);
            }
        };

        loadData();
    }, []);

    // Save shopping list to AsyncStorage
    const saveShoppingList = async (updatedShoppingList: ShoppingListItem[]) => {
        try {
            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedShoppingList));
        } catch (error) {
            console.error('Error saving shopping list to AsyncStorage:', error);
            throw error;
        }
    };

    const generateShoppingList = () => {
        try {
            const ingredientMap = new Map<
                string,
                { amount: number; unit?: string; count: number }
            >();

            // Collect all ingredients from the week
            (Object.values(weekPlanning) as (string | null)[]).forEach(recipeId => {
                if (!recipeId) return;

                const recipe = getRecipeById(recipeId);
                if (recipe?.ingredients) {
                    recipe.ingredients.forEach(ingredient => {
                        // Skip if excluded from shopping
                        if (ingredient.excludeFromShopping) {
                            return;
                        }

                        const key = `${ingredient.name.toLowerCase()}${ingredient.unit ? `-${ingredient.unit}` : ''}`;

                        if (ingredientMap.has(key)) {
                            const existing = ingredientMap.get(key)!;
                            if (ingredient.amount !== undefined) {
                                existing.amount += ingredient.amount;
                            } else {
                                existing.count += 1;
                            }
                        } else {
                            ingredientMap.set(key, {
                                amount: ingredient.amount || 0,
                                unit: ingredient.unit,
                                count: ingredient.amount !== undefined ? 0 : 1,
                            });
                        }
                    });
                }
            });

            // Convert to shopping list items
            const newShoppingList: ShoppingListItem[] = Array.from(ingredientMap.entries()).map(
                ([key, data]) => {
                    const name = key.split('-')[0];
                    let displayAmount: number | undefined = undefined;

                    if (data.count > 0) {
                        displayAmount = data.count;
                    } else if (data.amount > 0) {
                        displayAmount = data.amount;
                    }

                    return {
                        id: `shopping-${Date.now()}-${Math.random()}`,
                        name,
                        amount: displayAmount,
                        unit: data.unit,
                        checked: false,
                    };
                }
            );

            setShoppingList(newShoppingList);
            saveShoppingList(newShoppingList);

            showSnackbar({
                message: 'Shopping list generated from week planning!',
                type: 'success',
            });
        } catch (error) {
            showSnackbar({
                message: 'Failed to generate shopping list',
                type: 'error',
            });
        }
    };

    // Add item to shopping list
    const addShoppingListItem = async (item: Omit<ShoppingListItem, 'id'>): Promise<void> => {
        try {
            const newItem: ShoppingListItem = {
                ...item,
                id: `shopping-${Date.now()}-${Math.random()}`,
            };
            const updatedList = [...shoppingList, newItem];
            setShoppingList(updatedList);
            await saveShoppingList(updatedList);

            showSnackbar({
                message: `"${item.name}" added to shopping list`,
                type: 'success',
            });
        } catch (error) {
            showSnackbar({
                message: 'Failed to add item',
                type: 'error',
            });
            throw error;
        }
    };

    // Remove item from shopping list
    const removeShoppingListItem = async (itemId: string): Promise<void> => {
        try {
            const item = shoppingList.find(i => i.id === itemId);
            const updatedList = shoppingList.filter(item => item.id !== itemId);
            setShoppingList(updatedList);
            await saveShoppingList(updatedList);

            showSnackbar({
                message: `"${item?.name}" removed`,
                type: 'success',
            });
        } catch (error) {
            showSnackbar({
                message: 'Failed to remove item',
                type: 'error',
            });
            throw error;
        }
    };

    // Toggle item checked status
    const toggleShoppingListItem = async (itemId: string): Promise<void> => {
        try {
            const updatedList = shoppingList.map(item =>
                item.id === itemId ? { ...item, checked: !item.checked } : item
            );
            setShoppingList(updatedList);
            await saveShoppingList(updatedList);

            // No snackbar for toggle - too noisy for frequent action
        } catch (error) {
            showSnackbar({
                message: 'Failed to update item',
                type: 'error',
            });
            throw error;
        }
    };

    // Edit shopping list item
    const editShoppingListItem = async (editedItem: ShoppingListItem): Promise<void> => {
        try {
            const updatedList = shoppingList.map(item =>
                item.id === editedItem.id ? editedItem : item
            );
            setShoppingList(updatedList);
            await saveShoppingList(updatedList);

            showSnackbar({
                message: `"${editedItem.name}" updated`,
                type: 'success',
            });
        } catch (error) {
            showSnackbar({
                message: 'Failed to update item',
                type: 'error',
            });
            throw error;
        }
    };

    // Clear shopping list
    const clearShoppingList = async (): Promise<void> => {
        try {
            setShoppingList([]);
            await saveShoppingList([]);

            showSnackbar({
                message: 'Shopping list cleared',
                type: 'success',
            });
        } catch (error) {
            showSnackbar({
                message: 'Failed to clear shopping list',
                type: 'error',
            });
            throw error;
        }
    };

    const value: ShoppingListContextType = {
        shoppingList,
        generateShoppingList,
        addShoppingListItem,
        removeShoppingListItem,
        toggleShoppingListItem,
        editShoppingListItem,
        clearShoppingList,
        isLoading,
        setSnackbarCallback: (callback: SnackbarCallback) => setSnackbarCallback(() => callback),
    };

    return <ShoppingListContext.Provider value={value}>{children}</ShoppingListContext.Provider>;
};
