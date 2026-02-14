export interface Ingredient {
    name: string;
    amount?: number;
    unit?: string;
    excludeFromShopping?: boolean;
}

export interface Recipe {
    name: string;
    id: string;
    ingredients?: Ingredient[];
    instructions?: string;
    imageUrl?: string;
}

export interface Planning {
    monday: string | null; // Just the recipe ID
    tuesday: string | null;
    wednesday: string | null;
    thursday: string | null;
    friday: string | null;
    saturday: string | null;
    sunday: string | null;
}

export interface ShoppingListItem {
    id: string;
    name: string;
    amount?: number;
    unit?: string;
    checked: boolean;
}
