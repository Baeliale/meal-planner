import { View, ScrollView } from 'react-native';
import { useTheme } from '../../providers/ThemeProvider';
import { useShoppingList } from '../../providers/ShoppingListProvider';
import { useAlert } from '../../providers/AlertProvider';
import { Button } from '../parts/Button';
import { ListItem } from '../parts/ListItem';
import { Input } from '../parts/Input';
import { Text } from '../parts/Text';
import { Checkbox } from '../parts/Checkbox';
import { useState } from 'react';
import { ShoppingListItem } from '../../types';
import { SlideMenu } from '../parts/SlideMenu';

export const ShoppingList = () => {
    const { cls } = useTheme();
    const { showAlert } = useAlert();
    const {
        shoppingList,
        generateShoppingList,
        addShoppingListItem,
        removeShoppingListItem,
        toggleShoppingListItem,
        editShoppingListItem,
        clearShoppingList,
    } = useShoppingList();
    const [openMenus, setOpenMenus] = useState<string[]>([]);
    const [showAddForm, setShowAddForm] = useState(false);
    const [editingItem, setEditingItem] = useState<string | null>(null);

    // Add form state
    const [newItemName, setNewItemName] = useState('');
    const [newItemAmount, setNewItemAmount] = useState('');
    const [newItemUnit, setNewItemUnit] = useState('');

    // Edit form state
    const [editName, setEditName] = useState('');
    const [editAmount, setEditAmount] = useState('');
    const [editUnit, setEditUnit] = useState('');

    const handleAddItem = async () => {
        if (!newItemName.trim()) {
            showAlert({
                title: 'Error',
                message: 'Item name is required',
            });
            return;
        }

        await addShoppingListItem({
            name: newItemName.trim(),
            amount: newItemAmount ? Number(newItemAmount) : undefined,
            unit: newItemUnit.trim() || undefined,
            checked: false,
        });

        // Clear form
        setNewItemName('');
        setNewItemAmount('');
        setNewItemUnit('');
        setShowAddForm(false);
    };

    const handleCancelAdd = () => {
        setNewItemName('');
        setNewItemAmount('');
        setNewItemUnit('');
        setShowAddForm(false);
    };

    const handleStartEdit = (item: ShoppingListItem) => {
        setEditingItem(item.id);
        setEditName(item.name);
        setEditAmount(item.amount?.toString() || '');
        setEditUnit(item.unit || '');
    };

    const handleSaveEdit = async (itemId: string) => {
        if (!editName.trim()) {
            showAlert({
                title: 'Error',
                message: 'Item name is required',
            });
            return;
        }

        const item = shoppingList.find(i => i.id === itemId);
        if (item) {
            await editShoppingListItem({
                ...item,
                name: editName.trim(),
                amount: editAmount ? Number(editAmount) : undefined,
                unit: editUnit.trim() || undefined,
            });
        }

        setEditingItem(null);
    };

    const handleCancelEdit = () => {
        setEditingItem(null);
        setEditName('');
        setEditAmount('');
        setEditUnit('');
    };

    const handleDeleteItem = (itemId: string, itemName: string) => {
        showAlert({
            title: 'Delete Item',
            message: `Remove "${itemName}" from shopping list?`,
            buttons: [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: () => removeShoppingListItem(itemId),
                },
            ],
        });
    };

    const handleClearList = () => {
        showAlert({
            title: 'Clear Shopping List',
            message: 'Are you sure you want to clear the entire shopping list?',
            buttons: [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Clear',
                    style: 'destructive',
                    onPress: clearShoppingList,
                },
            ],
        });
    };

    const handleGenerateList = () => {
        if (shoppingList.length > 0) {
            showAlert({
                title: 'Generate Shopping List',
                message: 'This will replace your current shopping list. Continue?',
                buttons: [
                    { text: 'Cancel', style: 'cancel' },
                    {
                        text: 'Generate',
                        style: 'default',
                        onPress: generateShoppingList,
                    },
                ],
            });
        } else {
            generateShoppingList();
        }
    };

    const formatItemDisplay = (item: ShoppingListItem): string => {
        const parts: string[] = [];

        parts.push(item.name);

        if (item.amount !== undefined) {
            parts.push(item.amount.toString());
        }

        if (item.unit) {
            parts.push(item.unit);
        }

        return parts.join(' ');
    };

    const uncheckedItems = shoppingList.filter(item => !item.checked);
    const checkedItems = shoppingList.filter(item => item.checked);

    const toggleItemMenu = (recipeId: string) => {
        setOpenMenus(prev => {
            if (prev.includes(recipeId)) {
                return prev.filter(id => id !== recipeId);
            } else {
                return [...prev, recipeId];
            }
        });
    };

    return (
        <View style={cls('container')}>
            <View style={cls('header')}>
                <Text style={cls('title')}>Shopping List</Text>
                <View style={cls('rows')}>
                    <Button
                        variant="primary"
                        label="Generate"
                        type="icon"
                        iconSource="materialIcons"
                        iconName="auto-awesome"
                        onPress={handleGenerateList}
                    />
                    <>
                        {shoppingList.length > 0 && (
                            <Button
                                variant="secondary"
                                label="Clear All"
                                type="icon"
                                iconSource="materialIcons"
                                iconName="delete-sweep"
                                onPress={handleClearList}
                            />
                        )}
                    </>
                </View>
            </View>

            <ScrollView>
                {/* Empty State */}
                <>
                    {shoppingList.length === 0 && !showAddForm && (
                        <View style={cls('listEmpty')}>
                            <Text style={cls('listEmptyText')}>
                                No items in your shopping list. Generate from your week planning or
                                add items manually.
                            </Text>
                        </View>
                    )}
                </>

                {/* Unchecked Items */}
                <>
                    {uncheckedItems.map(item => {
                        const isEditing = editingItem === item.id;

                        return (
                            <ListItem key={item.id}>
                                <>
                                    {isEditing ? (
                                        <View style={cls('columns')}>
                                            <View style={cls('ingredientInputRow')}>
                                                <View style={{ flex: 2 }}>
                                                    <Input
                                                        placeholder="Item name *"
                                                        value={editName}
                                                        onChangeText={setEditName}
                                                    />
                                                </View>
                                                <View style={{ flex: 1 }}>
                                                    <Input
                                                        placeholder="Amount"
                                                        value={editAmount}
                                                        onChangeText={setEditAmount}
                                                        keyboardType="numeric"
                                                    />
                                                </View>
                                                <View style={{ flex: 1 }}>
                                                    <Input
                                                        placeholder="Unit"
                                                        value={editUnit}
                                                        onChangeText={setEditUnit}
                                                    />
                                                </View>
                                            </View>
                                            <View style={cls('rows')}>
                                                <Button
                                                    label="Cancel"
                                                    variant="secondary"
                                                    type="text"
                                                    onPress={handleCancelEdit}
                                                />
                                                <Button
                                                    label="Save"
                                                    variant="primary"
                                                    type="text"
                                                    onPress={() => handleSaveEdit(item.id)}
                                                />
                                            </View>
                                        </View>
                                    ) : (
                                        <View style={cls('ingredientListItemInner')}>
                                            <Checkbox
                                                checked={item.checked}
                                                onToggle={() => toggleShoppingListItem(item.id)}
                                            />
                                            <Text
                                                style={[
                                                    cls('subTitle'),
                                                    { flex: 1, marginBlockEnd: 0 },
                                                ]}
                                            >
                                                {formatItemDisplay(item)}
                                            </Text>
                                            <SlideMenu
                                                open={openMenus.includes(item.id)}
                                                setOpen={() => toggleItemMenu(item.id)}
                                                slideWidth={130}
                                            >
                                                <Button
                                                    variant="primary"
                                                    type="icon"
                                                    label="Edit"
                                                    iconSource="materialIcons"
                                                    iconName="edit"
                                                    onPress={() => handleStartEdit(item)}
                                                />
                                                <Button
                                                    variant="secondary"
                                                    type="icon"
                                                    label="Delete"
                                                    iconSource="materialIcons"
                                                    iconName="delete"
                                                    onPress={() =>
                                                        handleDeleteItem(item.id, item.name)
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

                {/* Checked Items */}
                <>
                    {checkedItems.length > 0 && (
                        <View style={{ marginTop: 20 }}>
                            <Text style={cls('subTitle')}>Checked Items</Text>
                            <>
                                {checkedItems.map(item => (
                                    <ListItem key={item.id} style={{ opacity: 0.5 }}>
                                        <View style={cls('ingredientListItemInner')}>
                                            <Checkbox
                                                checked={item.checked}
                                                onToggle={() => toggleShoppingListItem(item.id)}
                                            />
                                            <Text style={cls('subTitle')}>
                                                {formatItemDisplay(item)}
                                            </Text>
                                        </View>
                                    </ListItem>
                                ))}
                            </>
                        </View>
                    )}
                </>

                {/* Add Item Form */}
                <>
                    {showAddForm && (
                        <View style={cls('form')}>
                            <Text style={cls('subTitle')}>Add Item</Text>

                            <View style={cls('ingredientInputRow')}>
                                <View style={{ flex: 2 }}>
                                    <Input
                                        placeholder="Item name *"
                                        value={newItemName}
                                        onChangeText={setNewItemName}
                                    />
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Input
                                        placeholder="Amount"
                                        value={newItemAmount}
                                        onChangeText={setNewItemAmount}
                                        keyboardType="numeric"
                                    />
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Input
                                        placeholder="Unit"
                                        value={newItemUnit}
                                        onChangeText={setNewItemUnit}
                                    />
                                </View>
                            </View>

                            <View style={cls('rows')}>
                                <Button
                                    label="Cancel"
                                    variant="secondary"
                                    type="text"
                                    onPress={handleCancelAdd}
                                />
                                <Button
                                    label="Add Item"
                                    variant="primary"
                                    type="text"
                                    onPress={handleAddItem}
                                />
                            </View>
                        </View>
                    )}
                </>
            </ScrollView>

            {/* Add Item Button */}
            <View>
                <Button
                    label={showAddForm ? 'Close Form' : 'Add Item'}
                    variant={showAddForm ? 'secondary' : 'primary'}
                    type="text"
                    onPress={() => setShowAddForm(!showAddForm)}
                />
            </View>
        </View>
    );
};
