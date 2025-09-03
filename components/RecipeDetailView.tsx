import React from 'react';
import { Recipe } from '../types';
import { ArrowLeftIcon } from './icons';

interface RecipeDetailViewProps {
    recipe: Recipe;
    onBack: () => void;
}

const RecipeDetailView: React.FC<RecipeDetailViewProps> = ({ recipe, onBack }) => (
    <div className="p-4">
        <header className="flex items-center mb-4">
            <button onClick={onBack} className="p-2 mr-2 rounded-full hover:bg-gray-200">
                <ArrowLeftIcon className="w-6 h-6 text-gray-700" />
            </button>
            <h1 className="text-2xl font-bold text-gray-800">{recipe.title}</h1>
        </header>
        <div className="bg-white p-4 rounded-lg shadow-sm">
            <p className="text-gray-600 mb-4">{recipe.description}</p>
            <div className="grid grid-cols-3 gap-2 text-center mb-4 border-t border-b py-3">
                <div>
                    <p className="font-bold text-lg">{recipe.time_minutes}</p>
                    <p className="text-xs text-gray-500">Minutes</p>
                </div>
                <div>
                    <p className="font-bold text-lg">{recipe.servings_default}</p>
                    <p className="text-xs text-gray-500">Servings</p>
                </div>
                 <div>
                    <p className="font-bold text-lg">{recipe.est_nutrition.kcal}</p>
                    <p className="text-xs text-gray-500">Kcal</p>
                </div>
            </div>

            <div className="mb-4">
                <h2 className="font-bold text-lg mb-2">Ingredients</h2>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                    {recipe.ingredients.map((ing, index) => (
                        <li key={index}>{ing.qty} {ing.unit} {ing.name}</li>
                    ))}
                </ul>
            </div>
            <div>
                <h2 className="font-bold text-lg mb-2">Steps</h2>
                <ol className="list-decimal list-inside space-y-2 text-gray-700">
                    {recipe.steps.map((step, index) => (
                        <li key={index}>{step}</li>
                    ))}
                </ol>
            </div>
        </div>
    </div>
);

export default RecipeDetailView;
