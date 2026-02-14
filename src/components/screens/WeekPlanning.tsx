import { View } from 'react-native';
import { useRecipes, WeekDay } from '../../providers/RecipeProvider';
import { useState } from 'react';
import { useTheme } from '../../providers/ThemeProvider';
import { Button } from '../parts/Button';
import { ListItem } from '../parts/ListItem';
import { useAlert } from '../../providers/AlertProvider';
import { ItemPicker } from '../parts/ItemPicker';
import { Text } from '../parts/Text';
import { useShoppingList } from '../../providers/ShoppingListProvider';
import { useSnackbar } from '../../providers/SnackbarProvider';

export const WeekPlanning = () => {
    const { cls } = useTheme();
    const { showAlert } = useAlert();
    const {
        weekPlanning,
        recipes,
        addRecipeToDay,
        removeRecipeFromDay,
        clearWeekPlanning,
        getRecipeForDay,
    } = useRecipes();
    const { generateShoppingList, shoppingList } = useShoppingList();
    const { showSnackbar } = useSnackbar();
    const [selectedDay, setSelectedDay] = useState<WeekDay | null>(null);
    const [selectedRecipeId, setSelectedRecipeId] = useState<string>('');

    const weekDays: WeekDay[] = [
        'monday',
        'tuesday',
        'wednesday',
        'thursday',
        'friday',
        'saturday',
        'sunday',
    ];

    const handleSetDish = (day: WeekDay) => {
        setSelectedDay(day);
        setSelectedRecipeId('');
    };

    const handleSelectRecipe = async (day: WeekDay, recipeId: string) => {
        const recipe = recipes.find(r => r.id === recipeId);
        if (recipe) {
            await addRecipeToDay(day, recipe);
            setSelectedDay(null);
            setSelectedRecipeId('');
        }
    };

    const handleClearDay = async (day: WeekDay) => {
        const assignedRecipe = getRecipeForDay(day);

        showAlert({
            title: 'Delete Recipe',
            message: `Are you sure you want to remove "${assignedRecipe?.name}" from ${day}?`,
            buttons: [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'Remove',
                    style: 'destructive',
                    onPress: async () => {
                        await removeRecipeFromDay(day);
                    },
                },
            ],
        });
    };

    const handleClearWeek = () => {
        showAlert({
            title: 'Clear Week Planning',
            message: 'Are you sure you want to clear the entire week planning?',
            buttons: [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'Clear',
                    style: 'destructive',
                    onPress: async () => {
                        await clearWeekPlanning();
                    },
                },
            ],
        });
    };

    const handleGenerateShoppingList = () => {
        if (shoppingList.length > 0) {
            showAlert({
                title: 'Generate Shopping List',
                message:
                    'Generating a new shopping list will overwrite your existing one. Do you want to continue?',
                buttons: [
                    {
                        text: 'Cancel',
                        style: 'cancel',
                    },
                    {
                        text: 'Generate',
                        style: 'default',
                        onPress: () => {
                            generateShoppingList();
                        },
                    },
                ],
            });
        } else {
            generateShoppingList();
        }
    };

    const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

    return (
        <>
            <View style={cls('header')}>
                <Text style={cls('title')}>Week Planning</Text>
                <View style={cls('rows')}>
                    <Button
                        variant="primary"
                        label="Generate List"
                        type="icon"
                        iconSource="fontAwesome"
                        iconName="shopping-cart"
                        onPress={handleGenerateShoppingList}
                    />
                    <Button
                        variant="secondary"
                        label="Clear All"
                        type="icon"
                        iconSource="materialIcons"
                        iconName="delete-sweep"
                        onPress={handleClearWeek}
                    />
                </View>
            </View>
            <>
                {weekDays.map(day => {
                    const assignedRecipe = getRecipeForDay(day);
                    const isSelectingForThisDay = selectedDay === day;

                    return (
                        <ListItem key={day}>
                            <View style={cls('columns')}>
                                <Text style={cls('subTitle')}>{capitalize(day)}</Text>
                                <>
                                    {assignedRecipe && (
                                        <Text style={cls('listItemText')}>
                                            {assignedRecipe.name}
                                        </Text>
                                    )}
                                </>
                                <>
                                    {isSelectingForThisDay && (
                                        <View style={cls('pickerContainer')}>
                                            <ItemPicker
                                                label={
                                                    'Select dish to assign to ' +
                                                    capitalize(day) +
                                                    '...'
                                                }
                                                items={recipes.map(recipe => ({
                                                    label: recipe.name,
                                                    value: recipe.id,
                                                }))}
                                                selectedValue={selectedRecipeId}
                                                onSelect={recipeId => {
                                                    if (recipeId) {
                                                        handleSelectRecipe(day, recipeId);
                                                    }
                                                }}
                                                emptyLabel={'Select a dish...'}
                                            />
                                            <Button
                                                variant={'secondary'}
                                                label={'Cancel'}
                                                onPress={() => setSelectedDay(null)}
                                            />
                                        </View>
                                    )}
                                </>
                            </View>

                            <>
                                {!isSelectingForThisDay && (
                                    <View>
                                        <>
                                            {assignedRecipe ? (
                                                <Button
                                                    label={'Clear Dish'}
                                                    variant={'secondary'}
                                                    type={'icon'}
                                                    iconSource={'materialIcons'}
                                                    iconName={'event-busy'}
                                                    onPress={() => handleClearDay(day)}
                                                />
                                            ) : (
                                                <Button
                                                    label={'Set Dish'}
                                                    variant={'primary'}
                                                    type={'icon'}
                                                    iconSource={'materialIcons'}
                                                    iconName={'add'}
                                                    onPress={() => handleSetDish(day)}
                                                />
                                            )}
                                        </>
                                    </View>
                                )}
                            </>
                        </ListItem>
                    );
                })}
            </>
        </>
    );
};
