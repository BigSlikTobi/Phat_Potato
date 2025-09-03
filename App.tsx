import React, { useState, useCallback, useEffect } from 'react';
// FIX: Removed 'Budget' from import as it is not defined in types.ts
import { Screen, User, Recipe, Plan, DailyLog, Sex, ActivityLevel, ChatMessage, MealSlot, PlanItem, LogEntry, MealLog } from './types';
import { SYSTEM_RECIPES, MOCK_PLAN, SUPPLEMENTS_CATALOG } from './constants';
import OnboardingWizard from './components/OnboardingWizard';
import HomeScreen from './components/HomeScreen';
import ChatScreen from './components/ChatScreen';
import PlansScreen from './components/PlansScreen';
import RecipesScreen from './components/RecipesScreen';
import SettingsScreen from './components/SettingsScreen';
import BottomNav from './components/BottomNav';
import RecipeDetailView from './components/RecipeDetailView';

const App: React.FC = () => {
    const [hasOnboarded, setHasOnboarded] = useState(false);
    const [currentScreen, setCurrentScreen] = useState<Screen>(Screen.Home);
    const [user, setUser] = useState<User | null>(null);
    const [recipes, setRecipes] = useState<Recipe[]>(SYSTEM_RECIPES);
    const [plan, setPlan] = useState<Plan | null>(null);
    const [logs, setLogs] = useState<DailyLog[]>([]);
    const [viewingRecipe, setViewingRecipe] = useState<Recipe | null>(null);

    const checkAndAugmentPlan = useCallback((planToCheck: Plan, currentUser: User): Plan => {
        if (!currentUser?.profile?.weight_kg) return planToCheck;

        const proteinTarget = currentUser.profile.weight_kg * 0.8;
        const datesInPlan = [...new Set(planToCheck.items.map(item => item.date))];
        const augmentedItems = [...planToCheck.items];
        let planWasModified = false;

        const mealSlotOrder = [MealSlot.Breakfast, MealSlot.Lunch, MealSlot.Dinner, MealSlot.Snack];

        for (const date of datesInPlan) {
            const itemsForDate = planToCheck.items.filter(item => item.date === date);
            
            const hasProteinShake = itemsForDate.some(item => item.recipeId === 'sys_recipe_protein_shake');
            if (hasProteinShake) continue;

            let totalProtein = 0;
            for (const item of itemsForDate) {
                const recipe = recipes.find(r => r.id === item.recipeId);
                if (recipe) {
                    totalProtein += (recipe.est_nutrition.protein_g || 0) * item.servings;
                }
            }
            
            if (totalProtein < proteinTarget) {
                planWasModified = true;
                augmentedItems.push({
                    date: date,
                    meal_slot: MealSlot.Snack,
                    recipeId: 'sys_recipe_protein_shake',
                    servings: 1,
                    lock: false,
                });
            }
        }

        if (!planWasModified) {
            return planToCheck;
        }
        
        augmentedItems.sort((a, b) => {
            if (a.date < b.date) return -1;
            if (a.date > b.date) return 1;
            return mealSlotOrder.indexOf(a.meal_slot) - mealSlotOrder.indexOf(b.meal_slot);
        });

        return { ...planToCheck, items: augmentedItems };
    }, [recipes]);


    const handleOnboardingComplete = useCallback((userData: User) => {
        setUser(userData);
        setHasOnboarded(true);
        setCurrentScreen(Screen.Home);
        
        const startDate = userData.diet_window.start_date || new Date().toISOString().split('T')[0];
        const planForUser = {
            ...MOCK_PLAN,
            date_start: startDate,
            date_end: startDate,
            items: MOCK_PLAN.items.map(item => ({...item, date: startDate}))
        };
        const augmentedPlan = checkAndAugmentPlan(planForUser, userData);
        setPlan(augmentedPlan);

    }, [checkAndAugmentPlan]);

    const addGeneratedRecipes = (newRecipes: Recipe[]) => {
        setRecipes(prev => [...prev, ...newRecipes.filter(nr => !prev.some(r => r.id === nr.id))]);
    }
    
    const saveGeneratedPlan = useCallback((newPlan: Plan) => {
        if (user) {
            const augmentedPlan = checkAndAugmentPlan(newPlan, user);
            setPlan(augmentedPlan);
        } else {
            setPlan(newPlan);
        }
    }, [user, checkAndAugmentPlan]);

    const handleAddRecipe = (newRecipe: Recipe) => {
        setRecipes(prev => [newRecipe, ...prev]);
    };

    const handleViewRecipe = (recipeId: string) => {
        const recipe = recipes.find(r => r.id === recipeId);
        if (recipe) {
            setViewingRecipe(recipe);
        }
    };

    const handleCloseRecipeView = () => {
        setViewingRecipe(null);
    };

    const handleLogMeal = (planItem: PlanItem) => {
        const today = new Date().toISOString().split('T')[0];
        const recipe = recipes.find(r => r.id === planItem.recipeId);
        if (!recipe) return;

        const mealDetails: MealLog = {
            recipeId: planItem.recipeId,
            servings: planItem.servings,
            est_kcal: recipe.est_nutrition.kcal * planItem.servings,
        };

        const newLogEntry: LogEntry = {
            id: `log_${Date.now()}`,
            type: 'meal',
            timestamp: Date.now(),
            details: mealDetails,
        };

        setLogs(prevLogs => {
            const newLogs = [...prevLogs];
            let todaysLogIndex = newLogs.findIndex(log => log.date === today);

            // If no log for today, create one
            if (todaysLogIndex === -1) {
                newLogs.push({
                    date: today,
                    entries: [newLogEntry],
                    totals: {
                        kcal: mealDetails.est_kcal,
                        protein_g: (recipe.est_nutrition.protein_g || 0) * planItem.servings,
                        carbs_g: (recipe.est_nutrition.carbs_g || 0) * planItem.servings,
                        fat_g: (recipe.est_nutrition.fat_g || 0) * planItem.servings,
                        fiber_g: (recipe.est_nutrition.fiber_g || 0) * planItem.servings,
                    }
                });
                return newLogs;
            }

            const todaysLog = newLogs[todaysLogIndex];

            // Avoid duplicate logging
            const alreadyLogged = todaysLog.entries.some(entry =>
                entry.type === 'meal' && (entry.details as MealLog).recipeId === planItem.recipeId
            );
            if (alreadyLogged) return prevLogs;

            const updatedEntries = [...todaysLog.entries, newLogEntry];
            const updatedTotals = {
                kcal: todaysLog.totals.kcal + mealDetails.est_kcal,
                protein_g: todaysLog.totals.protein_g + (recipe.est_nutrition.protein_g || 0) * planItem.servings,
                carbs_g: todaysLog.totals.carbs_g + (recipe.est_nutrition.carbs_g || 0) * planItem.servings,
                fat_g: todaysLog.totals.fat_g + (recipe.est_nutrition.fat_g || 0) * planItem.servings,
                fiber_g: todaysLog.totals.fiber_g + (recipe.est_nutrition.fiber_g || 0) * planItem.servings,
            };

            newLogs[todaysLogIndex] = { ...todaysLog, entries: updatedEntries, totals: updatedTotals };
            return newLogs;
        });
    };

    const renderScreen = () => {
        if (!hasOnboarded || !user) {
            return <OnboardingWizard onOnboardingComplete={handleOnboardingComplete} />;
        }
        switch (currentScreen) {
            case Screen.Home:
                return <HomeScreen user={user} plan={plan} recipes={recipes} logs={logs} supplements={SUPPLEMENTS_CATALOG} onViewRecipe={handleViewRecipe} onLogMeal={handleLogMeal} />;
            case Screen.Chat:
                return <ChatScreen user={user} addGeneratedRecipes={addGeneratedRecipes} saveGeneratedPlan={saveGeneratedPlan} />;
            case Screen.Plans:
                return <PlansScreen plan={plan} recipes={recipes} />;
            case Screen.Recipes:
                return <RecipesScreen recipes={recipes} onAddRecipe={handleAddRecipe} />;
            case Screen.Settings:
                return <SettingsScreen user={user} onUpdateUser={setUser} />;
            default:
                return <HomeScreen user={user} plan={plan} recipes={recipes} logs={logs} supplements={SUPPLEMENTS_CATALOG} onViewRecipe={handleViewRecipe} onLogMeal={handleLogMeal} />;
        }
    };
    
    const today = new Date().toISOString().split('T')[0];
    useEffect(() => {
        if (hasOnboarded && !logs.find(l => l.date === today)) {
             setLogs(prev => [...prev, { date: today, entries: [], totals: { kcal: 0, protein_g: 0, carbs_g: 0, fat_g: 0, fiber_g: 0 }}]);
        }
    }, [hasOnboarded, logs, today]);


    return (
        <div className="h-screen w-screen bg-gray-100 font-sans flex flex-col max-w-lg mx-auto shadow-2xl relative">
            <main className="flex-1 overflow-y-auto pb-20">
                {renderScreen()}
            </main>
            {hasOnboarded && (
                <BottomNav currentScreen={currentScreen} setCurrentScreen={setCurrentScreen} />
            )}
            {viewingRecipe && (
                <div className="absolute inset-0 bg-gray-50 z-50 overflow-y-auto">
                    <RecipeDetailView recipe={viewingRecipe} onBack={handleCloseRecipeView} />
                </div>
            )}
        </div>
    );
};

export default App;