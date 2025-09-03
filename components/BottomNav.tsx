
import React from 'react';
import { Screen } from '../types';
import { HomeIcon, ChatIcon, CalendarIcon, BookOpenIcon, CogIcon } from './icons';

interface BottomNavProps {
    currentScreen: Screen;
    setCurrentScreen: (screen: Screen) => void;
}

const NavItem: React.FC<{
    icon: React.ReactNode;
    label: string;
    isActive: boolean;
    onClick: () => void;
}> = ({ icon, label, isActive, onClick }) => (
    <button
        onClick={onClick}
        className={`flex flex-col items-center justify-center w-full pt-2 pb-1 transition-colors duration-200 ${isActive ? 'text-yellow-600' : 'text-gray-500 hover:text-yellow-500'}`}
    >
        {icon}
        <span className="text-xs mt-1">{label}</span>
    </button>
);

const BottomNav: React.FC<BottomNavProps> = ({ currentScreen, setCurrentScreen }) => {
    const navItems = [
        { screen: Screen.Home, label: 'Today', icon: <HomeIcon className="w-6 h-6" /> },
        { screen: Screen.Chat, label: 'Coach', icon: <ChatIcon className="w-6 h-6" /> },
        { screen: Screen.Plans, label: 'Plans', icon: <CalendarIcon className="w-6 h-6" /> },
        { screen: Screen.Recipes, label: 'Recipes', icon: <BookOpenIcon className="w-6 h-6" /> },
        { screen: Screen.Settings, label: 'Settings', icon: <CogIcon className="w-6 h-6" /> },
    ];

    return (
        <div className="fixed bottom-0 left-0 right-0 max-w-lg mx-auto bg-white border-t border-gray-200 shadow-lg">
            <div className="flex justify-around items-center h-16">
                {navItems.map((item) => (
                    <NavItem
                        key={item.screen}
                        icon={item.icon}
                        label={item.label}
                        isActive={currentScreen === item.screen}
                        onClick={() => setCurrentScreen(item.screen)}
                    />
                ))}
            </div>
        </div>
    );
};

export default BottomNav;
