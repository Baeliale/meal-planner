import { Modal, View, ScrollView, Pressable } from 'react-native';
import { Recipe, Ingredient } from '../../types';
import { useTheme } from '../../providers/ThemeProvider';
import { Button } from '../parts/Button';
import { Input } from '../parts/Input';
import { useState, useEffect } from 'react';
import { useRecipes } from '../../providers/RecipeProvider';
import { Text } from '../parts/Text';
import { Checkbox } from '../parts/Checkbox';
import { useAlert } from '../../providers/AlertProvider';

interface RecipeModalProps {
    recipe: Recipe | null;
    visible: boolean;
    onClose: () => void;
}

export const RecipeModal = ({ recipe, visible, onClose }: RecipeModalProps) => {
    const { cls } = useTheme();
    const { showAlert } = useAlert();
    const { editRecipe, getRecipeById } = useRecipes();
    const [isEditing, setIsEditing] = useState(false);

    // Form state
    const [name, setName] = useState('');
    const [instructions, setInstructions] = useState('');
    const [ingredients, setIngredients] = useState<Ingredient[]>([
        { name: '', amount: undefined, unit: '', excludeFromShopping: false },
    ]);

    // Get the latest recipe data from the provider
    const currentRecipe = recipe ? getRecipeById(recipe.id) : null;

    // Load recipe data when modal opens or recipe changes
    useEffect(() => {
        if (currentRecipe) {
            setName(currentRecipe.name);
            setIngredients(
                currentRecipe.ingredients && currentRecipe.ingredients.length > 0
                    ? currentRecipe.ingredients
                    : [{ name: '', amount: undefined, unit: '' }]
            );
            setInstructions(currentRecipe.instructions || '');
            setIsEditing(false);
        }
    }, [currentRecipe?.id, visible]);

    const handleAddIngredient = () => {
        setIngredients([...ingredients, { name: '', amount: undefined, unit: '' }]);
    };

    const handleRemoveIngredient = (index: number) => {
        setIngredients(ingredients.filter((_, i) => i !== index));
    };

    const handleIngredientChange = (index: number, field: keyof Ingredient, value: string | number | boolean | undefined) => {
        const updated = [...ingredients];
        if (field === 'amount') {
            // Store as-is (string), don't parse yet
            updated[index][field] = value as any; // Temporarily allow string
        } else if (field === 'excludeFromShopping') {
            updated[index][field] = value as boolean;
        } else {
            updated[index][field] = value as string;
        }
        setIngredients(updated);
    };

    const handleSave = async () => {
        if (!name.trim()) {
            showAlert({
                title: 'Error',
                message: 'Recipe name is required',
            });
            return;
        }

        if (!currentRecipe) return;

        // Filter out empty ingredients and parse amounts
        const validIngredients = ingredients
            .filter(ing => ing.name.trim() !== '')
            .map(ing => ({
                ...ing,
                amount: ing.amount ? parseFloat(String(ing.amount).replace(',', '.')) : undefined
            }));

        await editRecipe({
            id: currentRecipe.id,
            name: name.trim(),
            ingredients: validIngredients.length > 0 ? validIngredients : undefined,
            instructions: instructions.trim() || undefined,
        });

        setIsEditing(false);
    };

    const handleCancel = () => {
        // Reset form to original values
        if (currentRecipe) {
            setName(currentRecipe.name);
            setIngredients(
                currentRecipe.ingredients && currentRecipe.ingredients.length > 0
                    ? currentRecipe.ingredients
                    : [{ name: '', amount: undefined, unit: '' }]
            );
            setInstructions(currentRecipe.instructions || '');
        }
        setIsEditing(false);
    };

    const handleClose = () => {
        setIsEditing(false);
        onClose();
    };

    const formatIngredient = (ingredient: Ingredient): string => {
        const parts: string[] = [];

        if (ingredient.amount !== undefined) {
            parts.push(ingredient.amount.toString());
        }

        if (ingredient.unit) {
            parts.push(ingredient.unit);
        }

        parts.push(ingredient.name);

        return parts.join(' ');
    };

    if (!currentRecipe) return null;

    return (
        <Modal
            visible={visible}
            animationType="fade"
            transparent={true}
            onRequestClose={handleClose}
        >
            <View style={cls('modal')}>
                <Pressable style={cls('modalBackdrop')} onPress={onClose} />
                <View style={cls('modalContent')}>
                    {/* Header */}
                    <View style={cls('modalHeader')}>
                        <Text style={cls('title')}>
                            {isEditing ? 'Edit Recipe' : currentRecipe.name}
                        </Text>
                        <View style={cls('modalHeaderButtons')}>
                            <>
                                {!isEditing && (
                                    <Button
                                        variant="transparent"
                                        type="icon"
                                        label="Edit Recipe"
                                        iconSource="materialIcons"
                                        iconName="edit"
                                        onPress={() => setIsEditing(true)}
                                    />
                                )}
                            </>
                            <Button
                                variant="transparent"
                                type="icon"
                                label="Close Modal"
                                iconSource="materialIcons"
                                iconName="close"
                                onPress={handleClose}
                            />
                        </View>
                    </View>

                    {/* Content */}
                    <ScrollView style={cls('modalBody')}>
                        <>
                            {isEditing ? (
                                /* Edit Form */
                                <View>
                                    <Text style={cls('label marginTop')}>Recipe Name</Text>
                                    <Input
                                        placeholder="Recipe Name *"
                                        value={name}
                                        onChangeText={setName}
                                    />

                                    <Text style={cls('label')}>Ingredients</Text>
                                    <>
                                        {ingredients.map((ingredient, index) => (
                                            <View key={`edit-ingredients-${index}`} style={cls('ingredientInputContainer')}>
                                                <View style={cls('ingredientInputRow')}>
                                                    {/* Left side - inputs and checkbox */}
                                                    <View style={{ flex: 1, gap: 8 }}>
                                                    {/* Row 1: Ingredient name (full width) */}
                                                    <Input
                                                        placeholder="Ingredient name *"
                                                        value={ingredient.name}
                                                        onChangeText={value =>
                                                        handleIngredientChange(index, 'name', value)
                                                        }
                                                        noMargin
                                                    />
                                                    
                                                    {/* Row 2: Amount and Unit side by side */}
                                                    <View style={{ flexDirection: 'row', gap: 8 }}>
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
                                                    </View>
                                                    
                                                    {/* Row 3: Checkbox */}
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
                                                    
                                                    {/* Right side - remove button */}
                                                    <>
                                                        {ingredients.length > 1 && (
                                                            <View style={{ position: 'relative', top: 27 }}>
                                                            <Button
                                                                variant="secondary"
                                                                type="icon"
                                                                label="Remove"
                                                                iconSource="materialIcons"
                                                                iconName="remove-circle"
                                                                iconSize={17}
                                                                onPress={() => handleRemoveIngredient(index)}
                                                            />
                                                            </View>
                                                        )}
                                                    </>
                                                </View>
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
                                            label="Save Changes"
                                            variant="primary"
                                            type="text"
                                            onPress={handleSave}
                                        />
                                    </View>
                                </View>
                            ) : (
                                /* View Mode */
                                <>
                                    {/* Ingredients */}
                                    <>
                                        {currentRecipe.ingredients &&
                                            currentRecipe.ingredients.length > 0 && (
                                                <View style={cls('modalSection')}>
                                                    <Text style={cls('subTitle')}>Ingredients</Text>
                                                    <>
                                                        {currentRecipe.ingredients.map(
                                                            (ingredient, index) => (
                                                                <Text
                                                                    key={index}
                                                                    style={cls('modalBullet')}
                                                                >
                                                                    • {formatIngredient(ingredient)}
                                                                </Text>
                                                            )
                                                        )}
                                                    </>
                                                </View>
                                            )}
                                    </>

                                    {/* Instructions */}
                                    <>
                                        {currentRecipe.instructions && (
                                            <View style={cls('modalSection')}>
                                                <Text style={cls('subTitle')}>Instructions</Text>
                                                <Text style={cls('modalText')}>
                                                    {currentRecipe.instructions}
                                                </Text>
                                            </View>
                                        )}
                                    </>
                                </>
                            )}
                        </>
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
};
