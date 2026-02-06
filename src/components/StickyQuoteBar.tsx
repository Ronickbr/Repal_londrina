import React, { useState, useEffect } from 'react';
import { ShoppingCart, MessageCircle, X, ChevronRight } from 'lucide-react';
import { useBudget } from '../contexts/BudgetContext';
import { useWhatsAppStore } from '../contexts/WhatsAppContext';

const StickyQuoteBar: React.FC = () => {
    const { state: budgetState } = useBudget();
    const { openStoreSelector } = useWhatsAppStore();
    const [isVisible, setIsVisible] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);

    useEffect(() => {
        // Só mostra a barra se houver itens no orçamento
        if (budgetState.totalItems > 0) {
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
    }, [budgetState.totalItems]);

    if (!isVisible) return null;

    const handleQuoteClick = () => {
        const itemCount = budgetState.items.length;
        const itemNames = budgetState.items.map(item => `${item.quantity}x ${item.name}`).join('\n');
        const message = `Olá! Gostaria de um orçamento para os seguintes itens (${itemCount} produtos):\n\n${itemNames}`;
        openStoreSelector(message);
    };

    return (
        <div
            className={`fixed bottom-0 left-0 right-0 z-[9999] transition-all duration-500 transform ${isVisible ? 'translate-y-0' : 'translate-y-full'
                } px-4 pb-4 pointer-events-none`}
        >
            <div className="max-w-5xl mx-auto pointer-events-auto">
                {isMinimized ? (
                    <button
                        onClick={() => setIsMinimized(false)}
                        className="ml-auto flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-t-xl shadow-2xl animate-bounce hover:animate-none group transition-all"
                    >
                        <ShoppingCart className="w-5 h-5" />
                        <span className="font-bold text-sm">Ver Orçamento ({budgetState.totalItems})</span>
                    </button>
                ) : (
                    <div className="bg-white border border-gray-200 rounded-2xl shadow-2xl-soft overflow-hidden animate-fade-in-up">
                        <div className="bg-gray-50 px-4 py-2 border-b flex justify-between items-center">
                            <div className="flex items-center gap-2 text-primary font-bold text-sm">
                                <ShoppingCart className="w-4 h-4" />
                                <span>Lista de Orçamento Automática</span>
                            </div>
                            <button
                                onClick={() => setIsMinimized(true)}
                                className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                            <div className="flex items-center gap-3 overflow-x-auto no-scrollbar max-w-full sm:max-w-[60%]">
                                <div className="flex -space-x-3 overflow-hidden">
                                    {budgetState.items.slice(0, 4).map((item, idx) => (
                                        <div
                                            key={item.id}
                                            className="inline-block h-10 w-10 rounded-full ring-2 ring-white bg-gray-100 border border-gray-200 overflow-hidden"
                                            style={{ zIndex: 40 - idx }}
                                        >
                                            {item.image ? (
                                                <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                                            ) : (
                                                <div className="h-full w-full flex items-center justify-center text-[10px] font-bold text-gray-400">
                                                    {item.name.charAt(0)}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                    {budgetState.items.length > 4 && (
                                        <div className="inline-block h-10 w-10 rounded-full ring-2 ring-white bg-gray-800 flex items-center justify-center text-white text-xs font-bold z-0">
                                            +{budgetState.items.length - 4}
                                        </div>
                                    )}
                                </div>
                                <div className="hidden md:block">
                                    <p className="text-sm font-medium text-gray-800">
                                        {budgetState.totalItems} {budgetState.totalItems === 1 ? 'item selecionado' : 'itens selecionados'}
                                    </p>
                                    <p className="text-xs text-gray-500">Prontos para solicitar orçamento no WhatsApp</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 w-full sm:w-auto">
                                <button
                                    onClick={handleQuoteClick}
                                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white px-6 py-3 rounded-xl font-bold text-sm shadow-lg shadow-green-200/50 transition-all active:scale-95 group"
                                >
                                    <MessageCircle className="w-5 h-5 group-hover:animate-pulse" />
                                    <span>Solicitar Orçamento agora</span>
                                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StickyQuoteBar;
