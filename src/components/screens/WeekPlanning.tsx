import { View } from 'react-native';
import { useRecipes, WeekDay } from '../../providers/RecipeProvider';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../providers/ThemeProvider';
import { Button } from '../parts/Button';
import { ListItem } from '../parts/ListItem';
import { useAlert } from '../../providers/AlertProvider';
import { ItemPicker } from '../parts/ItemPicker';
import { Text } from '../parts/Text';
import { useShoppingList } from '../../providers/ShoppingListProvider';
import { useSnackbar } from '../../providers/SnackbarProvider';

export const WeekPlanning = () => {
    const { t } = useTranslation();
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
            title: t('recipes.deleteRecipe'),
            message: t('planning.confirmRemoveRecipe', { 
                name: assignedRecipe?.name, 
                day: t(`planning.${day}`) 
            }),
            buttons: [
                {
                    text: t('common.cancel'),
                    style: 'cancel',
                },
                {
                    text: t('common.delete'),
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
            title: t('planning.clearWeek'),
            message: t('planning.confirmClearWeek'),
            buttons: [
                {
                    text: t('common.cancel'),
                    style: 'cancel',
                },
                {
                    text: t('common.delete'),
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
                title: t('planning.generateList'),
                message: t('planning.generateConfirm'),
                buttons: [
                    {
                        text: t('common.cancel'),
                        style: 'cancel',
                    },
                    {
                        text: t('shopping.generate'),
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

    return (
        <>
            <View style={cls('header')}>
                <Text style={cls('title')}>{t('planning.title')}</Text>
                <View style={cls('rows')}>
                    <Button
                        variant="primary"
                        label={t('planning.generateList')}
                        type="icon"
                        iconSource="fontAwesome"
                        iconName="shopping-cart"
                        onPress={handleGenerateShoppingList}
                    />
                    <Button
                        variant="secondary"
                        label={t('planning.clearAll')}
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
                                <Text style={cls('subTitle')}>{t(`planning.${day}`)}</Text>
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
                                                    t(`planning.${day}`) +
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
                                                emptyLabel={t('planning.selectDish')}
                                            />
                                            <Button
                                                variant={'secondary'}
                                                label={t('common.cancel')}
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
                                                    label={t('planning.clearDish')}
                                                    variant={'secondary'}
                                                    type={'icon'}
                                                    iconSource={'materialIcons'}
                                                    iconName={'event-busy'}
                                                    onPress={() => handleClearDay(day)}
                                                />
                                            ) : (
                                                <Button
                                                    label={t('planning.setDish')}
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