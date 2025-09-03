
import React, { useState, useMemo, useEffect } from 'react';
import { User, Profile, Preferences, DietWindow, Sex, ActivityLevel } from '../types';
import { APPLIANCES, ACTIVITY_LEVELS } from '../constants';
import { SparklesIcon, CalendarIcon } from './icons';

interface OnboardingWizardProps {
    onOnboardingComplete: (user: User) => void;
}

const OnboardingWizard: React.FC<OnboardingWizardProps> = ({ onOnboardingComplete }) => {
    const [step, setStep] = useState(1);
    const [profile, setProfile] = useState<Partial<Profile>>({ sex: Sex.Female, activity_level: ActivityLevel.Light });
    const [preferences, setPreferences] = useState<Partial<Preferences>>({ appliances: [], exclusions: [] });
    const [dietWindow, setDietWindow] = useState<Partial<DietWindow>>({
        start_date: new Date().toISOString().split('T')[0],
        end_date: new Date(new Date().setDate(new Date().getDate() + 30)).toISOString().split('T')[0],
    });

    const calculatedKcalTarget = useMemo(() => {
        if (!profile.weight_kg || !profile.height_cm || !profile.age || !profile.sex) return 2000;
        if (profile.sex === Sex.Male) {
            return 10 * profile.weight_kg + 6.25 * profile.height_cm - 5 * profile.age + 5;
        } else {
            return 10 * profile.weight_kg + 6.25 * profile.height_cm - 5 * profile.age - 161;
        }
    }, [profile]);

    const bmr = useMemo(() => {
        if (!profile.weight_kg || !profile.height_cm || !profile.age || !profile.sex) return 0;
        if (profile.sex === Sex.Male) {
            return 10 * profile.weight_kg + 6.25 * profile.height_cm - 5 * profile.age + 5;
        } else {
            return 10 * profile.weight_kg + 6.25 * profile.height_cm - 5 * profile.age - 161;
        }
    }, [profile]);

    const kcalTarget = useMemo(() => {
        if (bmr === 0 || !profile.activity_level) return 2000;
        const activityFactors = {
            [ActivityLevel.Sedentary]: 1.2,
            [ActivityLevel.Light]: 1.375,
            [ActivityLevel.Moderate]: 1.55,
            [ActivityLevel.High]: 1.725,
        };
        const calculated = Math.round(bmr * activityFactors[profile.activity_level]);
        // Round to nearest 50
        return Math.round(calculated / 50) * 50;
    }, [bmr, profile.activity_level]);

    const [adjustableKcalTarget, setAdjustableKcalTarget] = useState(kcalTarget);

    useEffect(() => {
        setAdjustableKcalTarget(kcalTarget);
    }, [kcalTarget]);


    const handleNext = () => setStep(s => s + 1);
    const handleBack = () => setStep(s => s - 1);

    const handleSubmit = () => {
        const finalUser: User = {
            profile: profile as Profile,
            preferences: {
                ...preferences,
                kcal_target: adjustableKcalTarget,
            } as Preferences,
            diet_window: dietWindow as DietWindow,
        };
        onOnboardingComplete(finalUser);
    };

    const renderStep = () => {
        switch (step) {
            case 1: return <Step1Welcome onNext={handleNext} />;
            case 2: return <Step2Profile profile={profile} setProfile={setProfile} onNext={handleNext} onBack={handleBack} />;
            case 3: return <Step3Preferences preferences={preferences} setPreferences={setPreferences} onNext={handleNext} onBack={handleBack} />;
            case 4: return <Step4Timeframe dietWindow={dietWindow} setDietWindow={setDietWindow} onBack={handleBack} kcalTarget={adjustableKcalTarget} onKcalTargetChange={setAdjustableKcalTarget} onSubmit={handleSubmit} />;
            default: return null;
        }
    };

    return (
        <div className="p-4 bg-gray-50 min-h-full">
            <div className="max-w-md mx-auto bg-white rounded-xl shadow-md p-6 mt-8">
                {renderStep()}
            </div>
        </div>
    );
};

const Step1Welcome: React.FC<{ onNext: () => void }> = ({ onNext }) => (
    <div className="text-center">
        <SparklesIcon className="w-16 h-16 mx-auto text-yellow-500" />
        <h1 className="text-2xl font-bold text-gray-800 mt-4">Welcome to Potato Diet Coach!</h1>
        <p className="text-gray-600 mt-2">Let's get you set up for success. We'll ask a few questions to personalize your plan.</p>
        <p className="text-sm text-gray-500 mt-6 p-2 bg-yellow-50 border border-yellow-200 rounded-md">
            <strong>Disclaimer:</strong> This is not medical advice. Consult a healthcare professional before starting any new diet.
        </p>
        <button onClick={onNext} className="mt-8 w-full bg-yellow-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-yellow-600 transition-colors">Let's Start</button>
    </div>
);

const Step2Profile: React.FC<{ profile: Partial<Profile>, setProfile: Function, onNext: () => void, onBack: () => void }> = ({ profile, setProfile, onNext, onBack }) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setProfile({ ...profile, [e.target.name]: e.target.value });
    };

    return (
        <div>
            <h2 className="text-xl font-bold mb-4">About You</h2>
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Sex</label>
                    <select name="sex" value={profile.sex} onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md">
                        <option value={Sex.Female}>Female</option>
                        <option value={Sex.Male}>Male</option>
                    </select>
                </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Age</label>
                        <input type="number" name="age" value={profile.age || ''} onChange={handleChange} placeholder="e.g., 30" className="mt-1 block w-full p-2 border border-gray-300 rounded-md" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Height (cm)</label>
                        <input type="number" name="height_cm" value={profile.height_cm || ''} onChange={handleChange} placeholder="e.g., 170" className="mt-1 block w-full p-2 border border-gray-300 rounded-md" />
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                     <div>
                        <label className="block text-sm font-medium text-gray-700">Weight (kg)</label>
                        <input type="number" name="weight_kg" value={profile.weight_kg || ''} onChange={handleChange} placeholder="e.g., 65" className="mt-1 block w-full p-2 border border-gray-300 rounded-md" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Target Weight (kg)</label>
                        <input type="number" name="target_weight_kg" value={profile.target_weight_kg || ''} onChange={handleChange} placeholder="Optional" className="mt-1 block w-full p-2 border border-gray-300 rounded-md" />
                    </div>
                </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700">Activity Level</label>
                    <select name="activity_level" value={profile.activity_level} onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md capitalize">
                        {ACTIVITY_LEVELS.map(level => <option key={level} value={level}>{level}</option>)}
                    </select>
                </div>
            </div>
            <div className="mt-6 flex justify-between">
                <button onClick={onBack} className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg">Back</button>
                <button onClick={onNext} className="bg-yellow-500 text-white font-bold py-2 px-4 rounded-lg">Next</button>
            </div>
        </div>
    );
};

const Step3Preferences: React.FC<{ preferences: Partial<Preferences>, setPreferences: Function, onNext: () => void, onBack: () => void }> = ({ preferences, setPreferences, onNext, onBack }) => {
    const handleApplianceToggle = (appliance: string) => {
        const current = preferences.appliances || [];
        const updated = current.includes(appliance) ? current.filter(a => a !== appliance) : [...current, appliance];
        setPreferences({ ...preferences, appliances: updated });
    };

    return (
        <div>
            <h2 className="text-xl font-bold mb-4">Your Preferences</h2>
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Available Appliances</label>
                    <div className="mt-2 grid grid-cols-2 gap-2">
                        {APPLIANCES.map(appliance => (
                            <button key={appliance} onClick={() => handleApplianceToggle(appliance)} className={`p-2 rounded-md border text-sm ${preferences.appliances?.includes(appliance) ? 'bg-yellow-500 text-white border-yellow-500' : 'bg-gray-100'}`}>
                                {appliance}
                            </button>
                        ))}
                    </div>
                </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700">Dietary Exclusions (comma separated)</label>
                    <input type="text" placeholder="e.g., dairy, oil" onChange={e => setPreferences({...preferences, exclusions: e.target.value.split(',').map(s => s.trim())})} className="mt-1 block w-full p-2 border border-gray-300 rounded-md"/>
                </div>
            </div>
             <div className="mt-6 flex justify-between">
                <button onClick={onBack} className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg">Back</button>
                <button onClick={onNext} className="bg-yellow-500 text-white font-bold py-2 px-4 rounded-lg">Next</button>
            </div>
        </div>
    );
};


const DateInput: React.FC<{ label: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; name: string; }> = ({ label, value, onChange, name }) => {
    return (
        <div className="relative">
            <input
                type="date"
                name={name}
                value={value}
                onChange={onChange}
                className="w-full p-2 pl-3 border border-gray-300 rounded-md appearance-none"
            />
        </div>
    );
};

const Step4Timeframe: React.FC<{ dietWindow: Partial<DietWindow>, setDietWindow: Function, onBack: () => void, onSubmit: () => void, kcalTarget: number, onKcalTargetChange: (value: number) => void }> = ({ dietWindow, setDietWindow, onBack, onSubmit, kcalTarget, onKcalTargetChange }) => (
    <div>
        <h2 className="text-xl font-bold mb-4">Diet Timeframe</h2>
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-center mb-6">
            <p className="text-gray-700">Your estimated daily target is:</p>
            <p className="text-3xl font-bold text-yellow-600">{kcalTarget} kcal</p>
            <p className="text-xs text-gray-500 mt-1">You can adjust this below.</p>
        </div>
        <div className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Calorie Target</label>
                <div className="flex items-center space-x-4">
                    <input 
                        type="range" 
                        name="kcal_target" 
                        min="1000" 
                        max="4000" 
                        step="50"
                        value={kcalTarget} 
                        onChange={e => onKcalTargetChange(parseInt(e.target.value) || 1000)} 
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-yellow-500" 
                    />
                    <span className="font-bold text-yellow-600 w-16 text-center">{kcalTarget}</span>
                </div>
            </div>
             <hr className="my-4" />
            <div>
                <label className="block text-sm font-medium text-gray-700">Start Date</label>
                <DateInput name="start_date" value={dietWindow.start_date || ''} onChange={(e) => setDietWindow({...dietWindow, start_date: e.target.value})} label="Start Date" />
            </div>
             <div>
                <label className="block text-sm font-medium text-gray-700">End Date</label>
                <DateInput name="end_date" value={dietWindow.end_date || ''} onChange={(e) => setDietWindow({...dietWindow, end_date: e.target.value})} label="End Date" />
            </div>
        </div>
        <div className="mt-8 flex justify-between">
            <button onClick={onBack} className="bg-gray-200 text-gray-800 font-bold py-3 px-6 rounded-lg">Back</button>
            <button onClick={onSubmit} className="bg-green-500 text-white font-bold py-3 px-6 rounded-lg">Finish Setup</button>
        </div>
    </div>
);


export default OnboardingWizard;
