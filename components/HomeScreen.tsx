import React from 'react';
import { User, Plan, Recipe, DailyLog, Supplement, PlanItem, MealLog } from '../types';
import { FireIcon, CheckIcon } from './icons';

interface HomeScreenProps {
    user: User;
    plan: Plan | null;
    recipes: Recipe[];
    logs: DailyLog[];
    supplements: Supplement[];
    onViewRecipe: (recipeId: string) => void;
    onLogMeal: (planItem: PlanItem) => void;
}

const CalorieProgressRing: React.FC<{ consumed: number; target: number }> = ({ consumed, target }) => {
    const circumference = 2 * Math.PI * 52;
    const progress = target > 0 ? (consumed / target) : 0;
    const strokeDashoffset = circumference - Math.min(progress, 1) * circumference;

    return (
        <div className="relative w-40 h-40">
            <svg className="w-full h-full" viewBox="0 0 120 120">
                <circle className="text-gray-200" strokeWidth="12" stroke="currentColor" fill="transparent" r="52" cx="60" cy="60" />
                <circle
                    className="text-yellow-500"
                    strokeWidth="12"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                    r="52"
                    cx="60"
                    cy="60"
                    transform="rotate(-90 60 60)"
                />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold text-gray-800">{consumed}</span>
                <span className="text-sm text-gray-500">/ {target} kcal</span>
            </div>
        </div>
    );
};


const HomeScreen: React.FC<HomeScreenProps> = ({ user, plan, recipes, logs, supplements, onViewRecipe, onLogMeal }) => {
    const today = new Date().toISOString().split('T')[0];
    const todaysPlanItems = plan?.items.filter(item => item.date === today) || [];
    const todaysLog = logs.find(log => log.date === today) || { totals: { kcal: 0 }, entries: [] };

    const getRecipeById = (id: string) => recipes.find(r => r.id === id);

    return (
        <div className="p-4 space-y-6">
            <header>
                <h1 className="text-2xl font-bold text-gray-800">Good Morning!</h1>
                <p className="text-gray-600">Here's your plan for today.</p>
            </header>

            <div className="bg-white p-6 rounded-xl shadow-md flex flex-col items-center">
                <CalorieProgressRing consumed={todaysLog.totals.kcal} target={user.preferences.kcal_target} />
                <div className="flex justify-around w-full mt-4 text-center">
                    <div>
                        <p className="font-bold text-gray-700">2.5L</p>
                        <p className="text-sm text-gray-500">Water</p>
                    </div>
                    <div>
                        <p className="font-bold text-gray-700">1 day</p>
                        <p className="text-sm text-gray-500">Streak</p>
                    </div>
                    <div>
                        <p className="font-bold text-gray-700">85%</p>
                        <p className="text-sm text-gray-500">Compliance</p>
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-700">Today's Meals</h2>
                {todaysPlanItems.length > 0 ? (
                    todaysPlanItems.map(item => {
                        const recipe = getRecipeById(item.recipeId);
                        if (!recipe) return null;

                        const isLogged = todaysLog.entries.some(entry =>
                            entry.type === 'meal' &&
                            (entry.details as MealLog).recipeId === item.recipeId
                        );

                        return (
                            <div key={`${item.date}-${item.meal_slot}`} className="bg-white p-4 rounded-lg shadow-sm flex items-center justify-between">
                                <div onClick={() => onViewRecipe(recipe.id)} className="cursor-pointer flex-1 mr-4">
                                    <p className="font-semibold capitalize">{item.meal_slot}</p>
                                    <p className="text-gray-600">{recipe.title}</p>
                                    <p className="text-sm text-gray-500">{recipe.est_nutrition.kcal * item.servings} kcal</p>
                                </div>
                                {isLogged ? (
                                    <button className="bg-gray-200 text-gray-500 px-4 py-2 rounded-lg text-sm font-bold flex items-center space-x-2 flex-shrink-0" disabled>
                                        <CheckIcon className="w-4 h-4" />
                                        <span>Logged</span>
                                    </button>
                                ) : (
                                    <button onClick={() => onLogMeal(item)} className="bg-green-500 text-white px-4 py-2 rounded-lg text-sm font-bold flex-shrink-0">Log</button>
                                )}
                            </div>
                        );
                    })
                ) : (
                    <div className="bg-white p-4 rounded-lg shadow-sm text-center">
                        <p className="text-gray-600">No meals planned for today.</p>
                        <p className="text-sm text-gray-500">Go to the Coach to generate a plan!</p>
                    </div>
                )}
            </div>

            <div className="space-y-2">
                <h2 className="text-xl font-semibold text-gray-700">Supplement Checklist</h2>
                 <div className="bg-white p-4 rounded-lg shadow-sm space-y-3">
                    {supplements.slice(0, 3).map(supplement => (
                        <div key={supplement.id} className="flex items-center">
                            <input type="checkbox" id={`supp-${supplement.id}`} className="h-5 w-5 rounded text-yellow-600 focus:ring-yellow-500 border-gray-300" />
                            <label htmlFor={`supp-${supplement.id}`} className="ml-3 text-gray-700">{supplement.name}</label>
                        </div>
                    ))}
                 </div>
            </div>
        </div>
    );
};

export default HomeScreen;