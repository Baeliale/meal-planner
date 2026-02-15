import './src/i18n';
import { ThemeProvider } from './src/providers/ThemeProvider';
import { RecipeProvider, useRecipes } from './src/providers/RecipeProvider';
import { ShoppingListProvider, useShoppingList } from './src/providers/ShoppingListProvider';
import { AlertProvider } from './src/providers/AlertProvider';
import { Layout } from './src/components/layout/Layout';
import { SnackbarProvider, useSnackbar } from "./src/providers/SnackbarProvider";
import { useEffect } from "react";

function ProviderConnector() {
  const { showSnackbar } = useSnackbar();
  const { setSnackbarCallback: setRecipeSnackbar } = useRecipes();
  const { setSnackbarCallback: setShoppingSnackbar } = useShoppingList();

  useEffect(() => {
    setRecipeSnackbar(showSnackbar);
    setShoppingSnackbar(showSnackbar);
  }, [showSnackbar, setRecipeSnackbar, setShoppingSnackbar]);

  return <Layout />;
}

export default function App() {
  return (
      <ThemeProvider>
        <AlertProvider>
          <SnackbarProvider>
            <RecipeProvider>
              <ShoppingListProvider>
                <ProviderConnector />
              </ShoppingListProvider>
            </RecipeProvider>
          </SnackbarProvider>
        </AlertProvider>
      </ThemeProvider>
  );
}