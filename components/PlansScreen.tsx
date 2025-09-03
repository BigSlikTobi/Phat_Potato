import React, { useState, useEffect } from 'react';
import { Plan, Recipe, MealSlot } from '../types';

interface PlansScreenProps {
    plan: Plan | null;
    recipes: Recipe[];
}

const PlansScreen: React.FC<PlansScreenProps> = ({ plan, recipes }) => {
    const getRecipeById = (id: string) => recipes.find(r => r.id === id);

    const getWeekDays = (startDateString?: string) => {
        // Handle YYYY-MM-DD which can be interpreted as UTC midnight, causing off-by-one day errors.
        // Replacing dashes with slashes makes the browser parse it as local time.
        const referenceDate = startDateString
            ? new Date(startDateString.replace(/-/g, '/'))
            : new Date();
            
        const dayOfWeek = referenceDate.getDay(); // 0 = Sunday
        // Set the date to the Sunday of that week.
        const startOfWeek = new Date(referenceDate);
        startOfWeek.setDate(referenceDate.getDate() - dayOfWeek);

        return Array.from({ length: 7 }).map((_, i) => {
            const date = new Date(startOfWeek);
            date.setDate(startOfWeek.getDate() + i);
            return date;
        });
    };

    const [week, setWeek] = useState(() => getWeekDays(plan?.date_start));

    useEffect(() => {
        setWeek(getWeekDays(plan?.date_start));
    }, [plan?.date_start]);


    const MealCard: React.FC<{ recipe: Recipe, mealSlot: MealSlot }> = ({ recipe, mealSlot }) => (
        <div className="bg-white p-3 rounded-lg mt-2 shadow-sm border-l-4 border-yellow-400">
            <p className="text-xs font-bold capitalize text-yellow-700">{mealSlot}</p>
            <p className="font-semibold text-gray-800">{recipe.title}</p>
            <p className="text-sm text-gray-500">{recipe.est_nutrition.kcal} kcal</p>
        </div>
    );

    return (
        <div className="p-4">
            <header className="mb-4">
                <h1 className="text-2xl font-bold text-gray-800">Your Plan</h1>
                <p className="text-gray-600">This week's potato-powered meals.</p>
            </header>

            <div className="space-y-4">
                {week.map(date => {
                    const dateString = date.toISOString().split('T')[0];
                    const dayItems = plan?.items.filter(item => item.date === dateString) || [];
                    
                    return (
                        <div key={dateString}>
                            <h2 className="font-bold text-lg text-gray-700">
                                {date.toLocaleDateString('en-US', { weekday: 'long' })}
                                <span className="text-sm font-normal text-gray-500 ml-2">
                                    {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                </span>
                            </h2>
                            {dayItems.length > 0 ? (
                                dayItems.map(item => {
                                    const recipe = getRecipeById(item.recipeId);
                                    return recipe ? <MealCard key={item.meal_slot} recipe={recipe} mealSlot={item.meal_slot} /> : null;
                                })
                            ) : (
                                <div className="bg-gray-100 p-3 rounded-lg mt-2 text-center text-gray-500 text-sm">
                                    No meals planned.
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            <div className="mt-6 text-center">
                <button className="bg-yellow-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-yellow-600 transition-colors">
                    Regenerate Week
                </button>
            </div>
        </div>
    );
};

export default PlansScreen;