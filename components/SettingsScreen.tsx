
import React, { useState } from 'react';
import { User, Sex, ActivityLevel } from '../types';
import { ACTIVITY_LEVELS } from '../constants';

interface SettingsScreenProps {
    user: User;
    onUpdateUser: (user: User) => void;
}

const SettingsScreen: React.FC<SettingsScreenProps> = ({ user, onUpdateUser }) => {
    const [editableUser, setEditableUser] = useState<User>(user);
    const [activeSection, setActiveSection] = useState<string | null>(null);

    const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setEditableUser({
            ...editableUser,
            profile: { ...editableUser.profile, [e.target.name]: e.target.value }
        });
    };

    const handleDietWindowChange = (e: React.ChangeEvent<HTMLInputElement>) => {
         setEditableUser({
            ...editableUser,
            diet_window: { ...editableUser.diet_window, [e.target.name]: e.target.value }
        });
    }

    const handleSave = (section: string) => {
        onUpdateUser(editableUser);
        setActiveSection(null);
    };

    const Section: React.FC<{ title: string; sectionKey: string; children: React.ReactNode }> = ({ title, sectionKey, children }) => {
        const isOpen = activeSection === sectionKey;
        return (
            <div className="bg-white p-4 rounded-lg shadow-sm">
                <button
                    className="w-full text-left flex justify-between items-center"
                    onClick={() => setActiveSection(isOpen ? null : sectionKey)}
                >
                    <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
                    <span className={`transform transition-transform ${isOpen ? 'rotate-180' : ''}`}>▼</span>
                </button>
                {isOpen && (
                    <div className="mt-4 border-t pt-4">
                        {children}
                        <button onClick={() => handleSave(sectionKey)} className="mt-4 w-full bg-yellow-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-yellow-600">Save Changes</button>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="p-4 space-y-4">
            <header className="mb-4">
                <h1 className="text-2xl font-bold text-gray-800">Settings</h1>
                <p className="text-gray-600">Manage your profile and preferences.</p>
            </header>

            <Section title="Your Profile" sectionKey="profile">
                <div className="space-y-3 text-sm">
                    <div className="grid grid-cols-2 gap-4">
                         <div>
                            <label className="block font-medium text-gray-700">Age</label>
                            <input type="number" name="age" value={editableUser.profile.age} onChange={handleProfileChange} className="mt-1 w-full p-2 border rounded" />
                        </div>
                        <div>
                            <label className="block font-medium text-gray-700">Sex</label>
                            <select name="sex" value={editableUser.profile.sex} onChange={handleProfileChange} className="mt-1 w-full p-2 border rounded capitalize">
                                <option value={Sex.Female}>Female</option>
                                <option value={Sex.Male}>Male</option>
                            </select>
                        </div>
                    </div>
                     <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block font-medium text-gray-700">Height (cm)</label>
                            <input type="number" name="height_cm" value={editableUser.profile.height_cm} onChange={handleProfileChange} className="mt-1 w-full p-2 border rounded" />
                        </div>
                        <div>
                            <label className="block font-medium text-gray-700">Weight (kg)</label>
                            <input type="number" name="weight_kg" value={editableUser.profile.weight_kg} onChange={handleProfileChange} className="mt-1 w-full p-2 border rounded" />
                        </div>
                    </div>
                     <div>
                        <label className="block font-medium text-gray-700">Activity Level</label>
                         <select name="activity_level" value={editableUser.profile.activity_level} onChange={handleProfileChange} className="mt-1 w-full p-2 border rounded capitalize">
                           {ACTIVITY_LEVELS.map(level => <option key={level} value={level}>{level}</option>)}
                        </select>
                    </div>
                </div>
            </Section>

            <Section title="Diet Preferences" sectionKey="preferences">
                 <div className="space-y-3 text-sm">
                    <div>
                        <label className="block font-medium text-gray-700">Calorie Target (kcal)</label>
                        <div className="flex items-center space-x-4 mt-2">
                             <input 
                                type="range" 
                                name="kcal_target" 
                                min="1000" 
                                max="4000" 
                                step="50"
                                value={editableUser.preferences.kcal_target} 
                                onChange={e => setEditableUser({...editableUser, preferences: {...editableUser.preferences, kcal_target: parseInt(e.target.value) || 0}})} 
                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-yellow-500" 
                            />
                            <span className="font-bold text-yellow-600 w-16 text-center">{editableUser.preferences.kcal_target}</span>
                        </div>
                    </div>
                 </div>
            </Section>

            <Section title="Diet Timeframe" sectionKey="timeframe">
                <div className="space-y-3 text-sm">
                    <div>
                        <label className="block font-medium text-gray-700">Start Date</label>
                        <input type="date" name="start_date" value={editableUser.diet_window.start_date} onChange={handleDietWindowChange} className="mt-1 w-full p-2 border rounded" />
                    </div>
                     <div>
                        <label className="block font-medium text-gray-700">End Date</label>
                        <input type="date" name="end_date" value={editableUser.diet_window.end_date} onChange={handleDietWindowChange} className="mt-1 w-full p-2 border rounded" />
                    </div>
                </div>
            </Section>

             <div className="text-center text-xs text-gray-400 pt-4">
                <p>Potato Diet Coach v1.0</p>
                <p>Disclaimer: Not medical advice.</p>
            </div>
        </div>
    );
};

export default SettingsScreen;
