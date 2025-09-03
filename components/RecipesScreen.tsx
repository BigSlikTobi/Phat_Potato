import React, { useState } from 'react';
import { Recipe, Ingredient, Nutrition } from '../types';
import { APPLIANCES } from '../constants';
import { PlusIcon, ArrowLeftIcon } from './icons';
import RecipeDetailView from './RecipeDetailView';

interface RecipesScreenProps {
    recipes: Recipe[];
    onAddRecipe: (recipe: Recipe) => void;
}

const RecipeCard: React.FC<{ recipe: Recipe; onSelect: () => void }> = ({ recipe, onSelect }) => (
    <button onClick={onSelect} className="bg-white p-4 rounded-lg shadow-sm w-full text-left hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start">
            <div>
                <h3 className="font-bold text-lg text-gray-800">{recipe.title}</h3>
                <p className="text-sm text-gray-500">{recipe.est_nutrition.kcal} kcal &middot; {recipe.time_minutes} min</p>
            </div>
            {recipe.is_system && <span className="text-xs bg-yellow-100 text-yellow-800 font-medium px-2 py-1 rounded-full">System</span>}
        </div>
        <p className="text-gray-600 mt-2 text-sm line-clamp-2">{recipe.description}</p>
        <div className="mt-3 flex flex-wrap gap-2">
            {recipe.appliances.map(app => (
                <span key={app} className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded-full">{app}</span>
            ))}
        </div>
    </button>
);

const RecipeForm: React.FC<{ onSave: (recipe: Recipe) => void; onBack: () => void }> = ({ onSave, onBack }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [time, setTime] = useState(30);
    const [servings, setServings] = useState(2);
    const [appliances, setAppliances] = useState<string[]>([]);
    const [ingredients, setIngredients] = useState<Ingredient[]>([{ name: '', qty: 1, unit: '' }]);
    const [steps, setSteps] = useState<string[]>(['']);

    const handleIngredientChange = (index: number, field: keyof Ingredient, value: string | number) => {
        const newIngredients = [...ingredients];
        (newIngredients[index] as any)[field] = value;
        setIngredients(newIngredients);
    };

    const addIngredient = () => setIngredients([...ingredients, { name: '', qty: 1, unit: '' }]);
    const removeIngredient = (index: number) => setIngredients(ingredients.filter((_, i) => i !== index));

    const handleStepChange = (index: number, value: string) => {
        const newSteps = [...steps];
        newSteps[index] = value;
        setSteps(newSteps);
    };

    const addStep = () => setSteps([...steps, '']);
    const removeStep = (index: number) => setSteps(steps.filter((_, i) => i !== index));
    
    const handleApplianceToggle = (appliance: string) => {
        setAppliances(prev => prev.includes(appliance) ? prev.filter(a => a !== appliance) : [...prev, appliance]);
    };

    const handleSubmit = () => {
        const newRecipe: Recipe = {
            id: `user_${Date.now()}`,
            title,
            description,
            time_minutes: Number(time),
            servings_default: Number(servings),
            appliances,
            ingredients: ingredients.filter(i => i.name),
            steps: steps.filter(s => s),
            est_nutrition: { kcal: 0, protein_g: 0, carbs_g: 0, fat_g: 0, fiber_g: 0 }, // Should be calculated
            tags: [],
            is_system: false,
        };
        onSave(newRecipe);
    };

    return (
        <div className="p-4">
             <header className="flex items-center mb-4">
                <button onClick={onBack} className="p-2 mr-2 rounded-full hover:bg-gray-200">
                    <ArrowLeftIcon className="w-6 h-6 text-gray-700" />
                </button>
                <h1 className="text-2xl font-bold text-gray-800">Add New Recipe</h1>
            </header>
            <div className="space-y-4 bg-white p-4 rounded-lg shadow-sm">
                <input type="text" placeholder="Recipe Title" value={title} onChange={e => setTitle(e.target.value)} className="w-full p-2 border rounded" />
                <textarea placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} className="w-full p-2 border rounded" />
                <div className="grid grid-cols-2 gap-4">
                    <input type="number" placeholder="Time (min)" value={time} onChange={e => setTime(Number(e.target.value))} className="w-full p-2 border rounded" />
                    <input type="number" placeholder="Servings" value={servings} onChange={e => setServings(Number(e.target.value))} className="w-full p-2 border rounded" />
                </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Appliances</label>
                    <div className="flex flex-wrap gap-2">
                        {APPLIANCES.map(app => <button key={app} onClick={() => handleApplianceToggle(app)} className={`px-3 py-1 text-sm rounded-full ${appliances.includes(app) ? 'bg-yellow-500 text-white' : 'bg-gray-200'}`}>{app}</button>)}
                    </div>
                </div>

                <div>
                    <h3 className="font-bold">Ingredients</h3>
                    {ingredients.map((ing, i) => (
                        <div key={i} className="flex items-center gap-2 mt-2">
                            <input type="number" value={ing.qty} onChange={e => handleIngredientChange(i, 'qty', Number(e.target.value))} className="w-16 p-2 border rounded" />
                            <input type="text" placeholder="Unit" value={ing.unit} onChange={e => handleIngredientChange(i, 'unit', e.target.value)} className="w-24 p-2 border rounded" />
                            <input type="text" placeholder="Name" value={ing.name} onChange={e => handleIngredientChange(i, 'name', e.target.value)} className="flex-1 p-2 border rounded" />
                            <button onClick={() => removeIngredient(i)} className="text-red-500 p-1">&times;</button>
                        </div>
                    ))}
                    <button onClick={addIngredient} className="text-sm text-yellow-600 mt-2">+ Add Ingredient</button>
                </div>
                
                <div>
                    <h3 className="font-bold">Steps</h3>
                    {steps.map((step, i) => (
                         <div key={i} className="flex items-center gap-2 mt-2">
                            <span className="font-bold">{i + 1}.</span>
                            <input type="text" value={step} onChange={e => handleStepChange(i, e.target.value)} className="flex-1 p-2 border rounded" />
                            <button onClick={() => removeStep(i)} className="text-red-500 p-1">&times;</button>
                        </div>
                    ))}
                     <button onClick={addStep} className="text-sm text-yellow-600 mt-2">+ Add Step</button>
                </div>

                <button onClick={handleSubmit} className="w-full bg-green-500 text-white font-bold py-3 rounded-lg">Save Recipe</button>
            </div>
        </div>
    );
};

const RecipesScreen: React.FC<RecipesScreenProps> = ({ recipes, onAddRecipe }) => {
    const [view, setView] = useState<'list' | 'detail' | 'add'>('list');
    const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedAppliance, setSelectedAppliance] = useState('All');

    const handleSelectRecipe = (recipe: Recipe) => {
        setSelectedRecipe(recipe);
        setView('detail');
    };

    const handleBack = () => {
        setView('list');
        setSelectedRecipe(null);
    };

    const handleSaveRecipe = (recipe: Recipe) => {
        onAddRecipe(recipe);
        setView('list');
    };

    if (view === 'detail' && selectedRecipe) {
        return <RecipeDetailView recipe={selectedRecipe} onBack={handleBack} />;
    }

    if (view === 'add') {
        return <RecipeForm onSave={handleSaveRecipe} onBack={handleBack} />;
    }

    const filteredRecipes = recipes.filter(recipe => {
        const matchesSearch = recipe.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesAppliance = selectedAppliance === 'All' || recipe.appliances.includes(selectedAppliance);
        return matchesSearch && matchesAppliance;
    });

    return (
        <div className="p-4 space-y-4">
            <header>
                <h1 className="text-2xl font-bold text-gray-800">Your Recipes</h1>
                <p className="text-gray-600">Find your next favorite potato dish.</p>
            </header>

            <div>
                <input
                    type="text"
                    placeholder="Search recipes..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                />
            </div>
            <div className="flex space-x-2 overflow-x-auto pb-2">
                <button
                    onClick={() => setSelectedAppliance('All')}
                    className={`px-4 py-1 text-sm rounded-full whitespace-nowrap ${selectedAppliance === 'All' ? 'bg-yellow-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                >
                    All
                </button>
                {APPLIANCES.map(app => (
                    <button
                        key={app}
                        onClick={() => setSelectedAppliance(app)}
                        className={`px-4 py-1 text-sm rounded-full whitespace-nowrap ${selectedAppliance === app ? 'bg-yellow-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                    >
                        {app}
                    </button>
                ))}
            </div>

            <div className="space-y-3">
                {filteredRecipes.length > 0 ? (
                    filteredRecipes.map(recipe => <RecipeCard key={recipe.id} recipe={recipe} onSelect={() => handleSelectRecipe(recipe)} />)
                ) : (
                    <p className="text-center text-gray-500 pt-8">No recipes found. Try adjusting your filters!</p>
                )}
            </div>
            
            <button onClick={() => setView('add')} className="fixed bottom-20 right-5 bg-yellow-500 hover:bg-yellow-600 text-white p-4 rounded-full shadow-lg transition-transform hover:scale-110" aria-label="Add new recipe">
                <PlusIcon className="w-6 h-6" />
            </button>
        </div>
    );
};

export default RecipesScreen;