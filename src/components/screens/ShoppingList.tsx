import { View, ScrollView } from 'react-native';
import { useTheme } from '../../providers/ThemeProvider';
import { useTranslation } from 'react-i18next';
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
    const { t } = useTranslation();
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
                title: t('alerts.error'),
                message: t('alerts.itemNameRequired'),
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
                title: t('alerts.error'),
                message: t('alerts.itemNameRequired'),
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
            title: t('common.delete'),
            message: t('shopping.confirmDelete', { name: itemName }),
            buttons: [
                { text: t('common.cancel'), style: 'cancel' },
                {
                    text: t('common.delete'),
                    style: 'destructive',
                    onPress: () => removeShoppingListItem(itemId),
                },
            ],
        });
    };

    const handleClearList = () => {
        showAlert({
            title: t('shopping.clearAll'),
            message: t('shopping.confirmClear'),
            buttons: [
                { text: t('common.cancel'), style: 'cancel' },
                {
                    text: t('common.delete'),
                    style: 'destructive',
                    onPress: clearShoppingList,
                },
            ],
        });
    };

    const handleGenerateList = () => {
        if (shoppingList.length > 0) {
            showAlert({
                title: t('shopping.generate'),
                message: t('shopping.confirmGenerate'),
                buttons: [
                    { text: t('common.cancel'), style: 'cancel' },
                    {
                        text: t('shopping.generate'),
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
                <Text style={cls('title')}>{t('shopping.title')}</Text>
                <View style={cls('rows')}>
                    <Button
                        variant="primary"
                        label={t('shopping.generate')}
                        type="icon"
                        iconSource="materialIcons"
                        iconName="auto-awesome"
                        onPress={handleGenerateList}
                    />
                    <>
                        {shoppingList.length > 0 && (
                            <Button
                                variant="secondary"
                                label={t('shopping.clearAll')}
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
                            <Text style={cls('listEmptyText')}>{t('shopping.noItems')}</Text>
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
                                                        placeholder={`${t('shopping.itemName')} *`}
                                                        value={editName}
                                                        onChangeText={setEditName}
                                                    />
                                                </View>
                                                <View style={{ flex: 1 }}>
                                                    <Input
                                                        placeholder={t('recipes.amount')}
                                                        value={editAmount}
                                                        onChangeText={setEditAmount}
                                                        keyboardType="numeric"
                                                    />
                                                </View>
                                                <View style={{ flex: 1 }}>
                                                    <Input
                                                        placeholder={t('recipes.unit')}
                                                        value={editUnit}
                                                        onChangeText={setEditUnit}
                                                    />
                                                </View>
                                            </View>
                                            <View style={cls('rows')}>
                                                <Button
                                                    label={t('common.cancel')}
                                                    variant="secondary"
                                                    type="text"
                                                    onPress={handleCancelEdit}
                                                />
                                                <Button
                                                    label={t('common.save')}
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
                                                    label={t('common.edit')}
                                                    iconSource="materialIcons"
                                                    iconName="edit"
                                                    onPress={() => handleStartEdit(item)}
                                                />
                                                <Button
                                                    variant="secondary"
                                                    type="icon"
                                                    label={t('common.delete')}
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
                            <Text style={cls('subTitle')}>{t('shopping.checkedItems')}</Text>
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
                            <Text style={cls('subTitle')}>{t('shopping.addItem')}</Text>

                            <View style={cls('ingredientInputRow')}>
                                <View style={{ flex: 2 }}>
                                    <Input
                                        placeholder={`${t('shopping.itemName')} *`}
                                        value={newItemName}
                                        onChangeText={setNewItemName}
                                    />
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Input
                                        placeholder={t('recipes.amount')}
                                        value={newItemAmount}
                                        onChangeText={setNewItemAmount}
                                        keyboardType="numeric"
                                    />
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Input
                                        placeholder={t('recipes.unit')}
                                        value={newItemUnit}
                                        onChangeText={setNewItemUnit}
                                    />
                                </View>
                            </View>

                            <View style={cls('rows')}>
                                <Button
                                    label={t('common.cancel')}
                                    variant="secondary"
                                    type="text"
                                    onPress={handleCancelAdd}
                                />
                                <Button
                                    label={t('shopping.addItem')}
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
                    label={showAddForm ? t('shopping.closeForm') : t('shopping.addItem')}
                    variant={showAddForm ? 'secondary' : 'primary'}
                    type="text"
                    onPress={() => setShowAddForm(!showAddForm)}
                />
            </View>
        </View>
    );
};