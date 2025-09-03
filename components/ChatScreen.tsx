
import React, { useState, useRef, useEffect } from 'react';
import { User, ChatMessage, Plan, Recipe } from '../types';
import { getCoachResponse } from '../services/geminiService';
import { SendIcon, SparklesIcon } from './icons';

interface ChatScreenProps {
    user: User;
    addGeneratedRecipes: (recipes: Recipe[]) => void;
    saveGeneratedPlan: (plan: Plan) => void;
}

const ChatScreen: React.FC<ChatScreenProps> = ({ user, addGeneratedRecipes, saveGeneratedPlan }) => {
    const [messages, setMessages] = useState<ChatMessage[]>([
        { id: 'init', sender: 'ai', text: "Hello! I'm your Potato Diet Coach. What can I help you plan today?" }
    ]);
    const [userInput, setUserInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);

    const handleSendMessage = async () => {
        if (!userInput.trim()) return;

        const newUserMessage: ChatMessage = {
            id: `user_${Date.now()}`,
            sender: 'user',
            text: userInput,
        };
        setMessages(prev => [...prev, newUserMessage]);
        setUserInput('');
        setIsLoading(true);
        
        const aiResponse = await getCoachResponse(userInput, user, messages);
        setMessages(prev => [...prev, aiResponse]);
        setIsLoading(false);

        if (aiResponse.recipes) {
            addGeneratedRecipes(aiResponse.recipes);
        }
        if (aiResponse.plan) {
            // In a real app, you might want to confirm with the user before saving
            saveGeneratedPlan(aiResponse.plan);
        }
    };

    const handleQuickAction = (text: string) => {
        setUserInput(text);
    };

    const quickActions = [
        "Plan my day",
        "Suggest a quick snack",
        "I need a high-protein dinner",
        "Swap my lunch for something from the oven",
    ];

    return (
        <div className="flex flex-col h-full">
            <header className="p-4 bg-white border-b">
                <h1 className="text-xl font-bold text-gray-800 text-center">Your AI Coach</h1>
            </header>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map(msg => (
                    <MessageBubble key={msg.id} message={msg} />
                ))}
                {isLoading && <LoadingBubble />}
                <div ref={messagesEndRef} />
            </div>

            {messages.length <= 2 && (
                <div className="px-4 pb-2">
                    <div className="grid grid-cols-2 gap-2">
                        {quickActions.map(action => (
                            <button key={action} onClick={() => handleQuickAction(action)} className="bg-gray-200 text-gray-700 text-sm p-2 rounded-lg text-left">
                                {action}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            <div className="p-4 bg-white border-t">
                <div className="flex items-center space-x-2">
                    <input
                        type="text"
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleSendMessage()}
                        placeholder="Ask your coach..."
                        className="flex-1 p-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-yellow-500"
                        disabled={isLoading}
                    />
                    <button
                        onClick={handleSendMessage}
                        disabled={isLoading}
                        className="bg-yellow-500 text-white p-3 rounded-full disabled:bg-gray-300"
                    >
                        <SendIcon className="w-6 h-6" />
                    </button>
                </div>
            </div>
        </div>
    );
};


const MessageBubble: React.FC<{ message: ChatMessage }> = ({ message }) => {
    const isUser = message.sender === 'user';
    return (
        <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
            <div className={`p-3 rounded-2xl max-w-sm ${isUser ? 'bg-yellow-500 text-white rounded-br-none' : 'bg-gray-200 text-gray-800 rounded-bl-none'}`}>
                <p>{message.text}</p>
                {message.recipes && message.recipes.map(recipe => (
                    <div key={recipe.id} className="mt-2 p-3 bg-white rounded-lg border">
                        <p className="font-bold text-gray-800">{recipe.title}</p>
                        <p className="text-sm text-gray-600">{recipe.est_nutrition.kcal} kcal</p>
                    </div>
                ))}
                 {message.cta && (
                    <div className="mt-3 flex flex-wrap gap-2">
                        {message.cta.map(action => (
                            <button key={action} className="text-xs bg-white text-yellow-700 font-semibold py-1 px-3 rounded-full border border-yellow-300">
                                {action}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

const LoadingBubble: React.FC = () => (
    <div className="flex justify-start">
        <div className="p-3 rounded-2xl bg-gray-200 text-gray-500 rounded-bl-none">
            <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-75"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-150"></div>
            </div>
        </div>
    </div>
);

export default ChatScreen;
