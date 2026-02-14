import { View } from 'react-native';
import { useState, useMemo } from 'react';
import { useRecipes, WeekDay } from '../../providers/RecipeProvider';
import { useTheme } from '../../providers/ThemeProvider';
import { Button } from '../parts/Button';
import { ListItem } from '../parts/ListItem';
import { Input } from '../parts/Input';
import { RecipeModal } from './RecipeModal';
import { Recipe, Ingredient } from '../../types';
import { SlideMenu } from '../parts/SlideMenu';
import { useAlert } from '../../providers/AlertProvider';
import { ItemPicker } from '../parts/ItemPicker';
import { Text } from '../parts/Text';
import { Checkbox } from '../parts/Checkbox';

export const RecipeList = () => {
    const { cls } = useTheme();
    const { showAlert } = useAlert();
    const { recipes, addRecipe, removeRecipe, addRecipeToDay } = useRecipes();
    const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [openMenus, setOpenMenus] = useState<string[]>([]);
    const [selectingDayForRecipe, setSelectingDayForRecipe] = useState<string | null>(null);
    const [selectedDay, setSelectedDay] = useState<WeekDay | ''>('');
    const [searchQuery, setSearchQuery] = useState('');

    const weekDays: WeekDay[] = [
        'monday',
        'tuesday',
        'wednesday',
        'thursday',
        'friday',
        'saturday',
        'sunday',
    ];

    // Form state
    const [name, setName] = useState('');
    const [instructions, setInstructions] = useState('');
    const [ingredients, setIngredients] = useState<Ingredient[]>([
        { name: '', amount: undefined, unit: '', excludeFromShopping: false },
    ]);

    // Search and filter recipes
    const filteredRecipes = useMemo(() => {
        if (!searchQuery.trim()) {
            return recipes;
        }

        const query = searchQuery.toLowerCase().trim();

        // Separate recipes into name matches and ingredient matches
        const nameMatches: Recipe[] = [];
        const ingredientMatches: Recipe[] = [];

        recipes.forEach(recipe => {
            const nameMatch = recipe.name.toLowerCase().includes(query);

            if (nameMatch) {
                nameMatches.push(recipe);
            } else {
                // Check ingredients
                const hasIngredientMatch = recipe.ingredients?.some(ingredient =>
                    ingredient.name.toLowerCase().includes(query)
                );

                if (hasIngredientMatch) {
                    ingredientMatches.push(recipe);
                }
            }
        });

        // Return name matches first, then ingredient matches
        return [...nameMatches, ...ingredientMatches];
    }, [recipes, searchQuery]);

    const handleAddIngredient = () => {
        setIngredients([
            ...ingredients,
            { name: '', amount: undefined, unit: '', excludeFromShopping: false },
        ]);
    };

    const handleRemoveIngredient = (index: number) => {
        setIngredients(ingredients.filter((_, i) => i !== index));
    };

    const handleIngredientChange = (
        index: number,
        field: keyof Ingredient,
        value: string | number | boolean | undefined
    ) => {
        const updated = [...ingredients];
        if (field === 'amount') {
            updated[index][field] = value === '' ? undefined : Number(value);
        } else if (field === 'excludeFromShopping') {
            updated[index][field] = value as boolean;
        } else {
            updated[index][field] = value as string;
        }
        setIngredients(updated);
    };

    const handleSubmit = async () => {
        if (!name.trim()) {
            showAlert({
                title: 'Error',
                message: 'Recipe name is required',
            });
            return;
        }

        // Filter out empty ingredients
        const validIngredients = ingredients.filter(ing => ing.name.trim() !== '');

        await addRecipe({
            name: name.trim(),
            ingredients: validIngredients.length > 0 ? validIngredients : undefined,
            instructions: instructions.trim() || undefined,
        });

        // Clear form
        setName('');
        setIngredients([{ name: '', amount: undefined, unit: '', excludeFromShopping: false }]);
        setInstructions('');
        setShowForm(false);
    };

    const handleCancel = () => {
        // Clear form and close
        setName('');
        setIngredients([{ name: '', amount: undefined, unit: '', excludeFromShopping: false }]);
        setInstructions('');
        setShowForm(false);
    };

    const handleViewRecipe = (recipe: Recipe) => {
        setSelectedRecipe(recipe);
        setModalVisible(true);
    };

    const handleCloseModal = () => {
        setModalVisible(false);
        setSelectedRecipe(null);
    };

    const handleDeleteRecipe = async (recipeId: string) => {
        const recipe = recipes.find(r => r.id === recipeId);
        const recipeName = recipe ? recipe.name : 'this recipe';

        showAlert({
            title: 'Delete Recipe',
            message: `Are you sure you want to delete "${recipeName}"?`,
            buttons: [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        await removeRecipe(recipeId);
                        setOpenMenus(prev => prev.filter(id => id !== recipeId));
                    },
                },
            ],
        });
    };

    const toggleItemMenu = (recipeId: string) => {
        setOpenMenus(prev => {
            if (prev.includes(recipeId)) {
                return prev.filter(id => id !== recipeId);
            } else {
                return [...prev, recipeId];
            }
        });
    };

    const handleShowDayPicker = (recipeId: string) => {
        setSelectingDayForRecipe(recipeId);
        setSelectedDay('');
    };

    const handleSelectDay = async (recipeId: string, day: WeekDay) => {
        const recipe = recipes.find(r => r.id === recipeId);
        if (recipe) {
            await addRecipeToDay(day, recipe);
            setSelectingDayForRecipe(null);
            setSelectedDay('');
        }
    };

    const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

    return (
        <View style={cls('container')}>
            <Text style={cls('title')}>Recipe List</Text>

            {/* Search Bar */}
            <Input
                placeholder="Search recipes..."
                value={searchQuery}
                onChangeText={setSearchQuery}
                style={{ marginBottom: 16 }}
            />

            {/* Recipe List */}
            <View>
                <>
                    {filteredRecipes.length === 0 ? (
                        <View style={cls('listEmpty')}>
                            <Text style={cls('listEmptyText')}>
                                {searchQuery
                                    ? 'No recipes found matching your search.'
                                    : 'No recipes yet. Add one to get started!'}
                            </Text>
                        </View>
                    ) : (
                        <>
                            {filteredRecipes.map(recipe => {
                                const isSelectingDay = selectingDayForRecipe === recipe.id;

                                return (
                                    <ListItem key={recipe.id}>
                                        <View style={cls('columns')}>
                                            <Text style={cls('subTitle')}>{recipe.name}</Text>

                                            {/* Day Picker */}
                                            <>
                                                {isSelectingDay && (
                                                    <View style={cls('pickerContainer')}>
                                                        <ItemPicker
                                                            label={
                                                                'Select a day to add this dish to:'
                                                            }
                                                            items={weekDays.map(day => ({
                                                                label: capitalize(day),
                                                                value: day,
                                                            }))}
                                                            emptyLabel={'Select a day...'}
                                                            selectedValue={selectedDay}
                                                            onSelect={day => {
                                                                if (day) {
                                                                    handleSelectDay(
                                                                        recipe.id,
                                                                        day as WeekDay
                                                                    );
                                                                }
                                                            }}
                                                        />
                                                        <Button
                                                            variant="secondary"
                                                            label="Cancel"
                                                            onPress={() =>
                                                                setSelectingDayForRecipe(null)
                                                            }
                                                        />
                                                    </View>
                                                )}
                                            </>
                                        </View>

                                        <>
                                            {!isSelectingDay && (
                                                <View style={cls('rows')}>
                                                    <SlideMenu
                                                        open={openMenus.includes(recipe.id)}
                                                        setOpen={() => toggleItemMenu(recipe.id)}
                                                    >
                                                        <Button
                                                            label="Add to weekday"
                                                            variant="primary"
                                                            type="icon"
                                                            iconName="edit-calendar"
                                                            iconSource="materialIcons"
                                                            onPress={() =>
                                                                handleShowDayPicker(recipe.id)
                                                            }
                                                        />
                                                        <Button
                                                            label="View Dish"
                                                            variant="primary"
                                                            type="icon"
                                                            iconName="visibility"
                                                            iconSource="materialIcons"
                                                            onPress={() => handleViewRecipe(recipe)}
                                                        />
                                                        <Button
                                                            label="Clear Dish"
                                                            variant="secondary"
                                                            type="icon"
                                                            iconName="delete"
                                                            iconSource="materialIcons"
                                                            onPress={() =>
                                                                handleDeleteRecipe(recipe.id)
                                                            }
                                                        />
                                                    </SlideMenu>
                                                </View>
                                            )}
                                        </>
                                    </ListItem>
                                );
                            })}
                        </>
                    )}
                </>
            </View>

            {/* Add Recipe Form */}
            <>
                {showForm && (
                    <View style={cls('form')}>
                        <Text style={cls('subTitle')}>Add New Recipe</Text>

                        <Input
                            label="Recipe Name"
                            placeholder="Recipe Name *"
                            value={name}
                            onChangeText={setName}
                            style={cls('marginTop')}
                        />

                        <Text style={cls('label')}>Ingredients</Text>
                        <>
                            {ingredients.map((ingredient, index) => (
                                <View key={`add-ingredients-${index}`} style={cls('ingredientInputContainer')}>
                                    <View style={cls('ingredientInputRow')}>
                                        <View style={{ flex: 2 }}>
                                            <Input
                                                placeholder="Ingredient name *"
                                                value={ingredient.name}
                                                onChangeText={value =>
                                                    handleIngredientChange(index, 'name', value)
                                                }
                                                noMargin
                                            />
                                        </View>
                                        <View style={{ flex: 1 }}>
                                            <Input
                                                placeholder="Amount"
                                                value={ingredient.amount?.toString() || ''}
                                                onChangeText={value =>
                                                    handleIngredientChange(index, 'amount', value)
                                                }
                                                keyboardType="numeric"
                                                noMargin
                                            />
                                        </View>
                                        <View style={{ flex: 1 }}>
                                            <Input
                                                placeholder="Unit"
                                                value={ingredient.unit || ''}
                                                onChangeText={value =>
                                                    handleIngredientChange(index, 'unit', value)
                                                }
                                                noMargin
                                            />
                                        </View>
                                        <>
                                            {ingredients.length > 1 && (
                                                <Button
                                                    variant="secondary"
                                                    type="icon"
                                                    label="Remove"
                                                    iconSource="materialIcons"
                                                    iconName="remove-circle"
                                                    iconSize={17}
                                                    onPress={() => handleRemoveIngredient(index)}
                                                />
                                            )}
                                        </>
                                    </View>
                                    <Checkbox
                                        checked={ingredient.excludeFromShopping || false}
                                        onToggle={() =>
                                            handleIngredientChange(
                                                index,
                                                'excludeFromShopping',
                                                !ingredient.excludeFromShopping
                                            )
                                        }
                                        label="Exclude from shopping list"
                                    />
                                </View>
                            ))}
                        </>
                        <Button
                            label="Add Ingredient"
                            variant="primary"
                            type="text"
                            onPress={handleAddIngredient}
                            style={cls('marginTop marginBottom')}
                        />

                        <Input
                            label="Instructions"
                            type="textarea"
                            placeholder="Instructions"
                            value={instructions}
                            onChangeText={setInstructions}
                        />

                        <View style={cls('rows')}>
                            <Button
                                label="Cancel"
                                variant="secondary"
                                type="text"
                                onPress={handleCancel}
                            />
                            <Button
                                label="Add Recipe"
                                variant="primary"
                                type="text"
                                onPress={handleSubmit}
                            />
                        </View>
                    </View>
                )}
            </>

            {/* Toggle Button */}
            <View>
                <Button
                    label={showForm ? 'Close Form' : 'Add Recipe'}
                    variant={showForm ? 'secondary' : 'primary'}
                    type="text"
                    onPress={() => setShowForm(!showForm)}
                />
            </View>

            {/* Modal */}
            <RecipeModal
                recipe={selectedRecipe}
                visible={modalVisible}
                onClose={handleCloseModal}
            />
        </View>
    );
};
