import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Calendar, MapPin, Wallet, Utensils, Info,
    ChevronRight, Download, Share2, AlertTriangle,
    Map as MapIcon, Compass, CheckCircle2
} from 'lucide-react';
import BudgetChart from './BudgetChart';
import destinationData from '../../data/destinations.json';

const TripDashboard = ({ tripData, resetFlow }) => {
    const [activeTab, setActiveTab] = useState('itinerary');
    const [destination, setDestination] = useState(null);

    useEffect(() => {
        // Basic destination matching
        const match = destinationData.find(d =>
            d.name.toLowerCase().includes(tripData.destination.toLowerCase()) ||
            d.cities.some(c => c.toLowerCase().includes(tripData.destination.toLowerCase()))
        );
        setDestination(match || destinationData[0]); // Fallback to first if no match
    }, [tripData.destination]);

    if (!destination) return null;

    const tabs = [
        { id: 'itinerary', label: 'Itinerary', icon: Calendar },
        { id: 'budget', label: 'Budget', icon: Wallet },
        { id: 'food', label: 'Food', icon: Utensils },
        { id: 'docs', label: 'Docs', icon: Info },
        { id: 'local', label: 'Hidden Gems', icon: Compass }
    ];

    return (
        <div className="max-w-6xl mx-auto px-4">
            {/* Welcome & Stats Header */}
            <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div>
                    <div className="flex items-center gap-2 text-india-saffron mb-2">
                        <CheckCircle2 size={16} />
                        <span className="text-xs font-bold uppercase tracking-widest">Plan Ready for {tripData.travelerType}</span>
                    </div>
                    <h2 className="text-4xl font-bold mb-2">
                        Your {destination.name} <span className="text-india-saffron">Odyssey</span>
                    </h2>
                    <p className="text-slate-500">
                        {tripData.startDate} to {tripData.endDate} • {tripData.numTravelers} Travelers
                    </p>
                </div>
                <div className="flex gap-3">
                    <button className="p-3 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 transition-all shadow-sm">
                        <Download size={20} className="text-slate-600" />
                    </button>
                    <button className="p-3 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 transition-all shadow-sm">
                        <Share2 size={20} className="text-slate-600" />
                    </button>
                    <button onClick={resetFlow} className="btn-primary py-3">
                        New Plan
                    </button>
                </div>
            </div>

            {/* Seasonal Warning (if applicable) */}
            <div className="mb-8 p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-center gap-4">
                <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center text-amber-600 shrink-0">
                    <AlertTriangle size={24} />
                </div>
                <div>
                    <h4 className="font-bold text-amber-800">Seasonal Advisory</h4>
                    <p className="text-sm text-amber-700">
                        You're visiting {destination.name} during a great time! Weather is typically {destination.best_months.includes('October') ? 'pleasant' : 'variable'}.
                    </p>
                </div>
            </div>

            {/* Tabs Navigation */}
            <div className="flex overflow-x-auto pb-4 gap-2 mb-8 no-scrollbar">
                {tabs.map(tab => {
                    const Icon = tab.icon;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-all shrink-0 ${activeTab === tab.id
                                    ? 'bg-india-navy text-white shadow-lg shadow-india-navy/20'
                                    : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
                                }`}
                        >
                            <Icon size={18} />
                            {tab.label}
                        </button>
                    );
                })}
            </div>

            {/* Tab Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="card-glass p-8"
                    >
                        {activeTab === 'itinerary' && (
                            <div className="space-y-8">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-2xl font-bold">Day-by-Day Plan</h3>
                                    <div className="px-3 py-1 bg-india-saffron/10 text-india-saffron text-xs font-bold rounded-full">
                                        AI GENERATED
                                    </div>
                                </div>
                                <div className="space-y-6 border-l-2 border-slate-100 ml-4 pl-8 relative">
                                    {[1, 2, 3].map(day => (
                                        <div key={day} className="relative">
                                            <div className="absolute -left-[41px] top-0 w-4 h-4 rounded-full bg-india-saffron border-4 border-tripfit-cream" />
                                            <h4 className="font-bold text-lg mb-2">Day {day}: Explore {destination.cities[day - 1] || destination.cities[0]}</h4>
                                            <p className="text-slate-600 text-sm leading-relaxed mb-4">
                                                Visit the major landmarks including {destination.name === 'Rajasthan' ? 'Amber Fort and Hawa Mahal' : 'the local market and scenic viewpoints'}.
                                                Lunch at a recommended local eatery to try {destination.local_food[0]}.
                                            </p>
                                            <div className="flex gap-2">
                                                <span className="px-3 py-1 bg-slate-100 rounded-md text-xs text-slate-500 font-medium">History</span>
                                                <span className="px-3 py-1 bg-slate-100 rounded-md text-xs text-slate-500 font-medium">Sightseeing</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeTab === 'budget' && (
                            <div className="space-y-8">
                                <h3 className="text-2xl font-bold">Budget Breakdown</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                                    <BudgetChart
                                        budget={tripData.budget}
                                        travelerType={tripData.travelerType}
                                        numTravelers={tripData.numTravelers}
                                    />
                                    <div className="space-y-4">
                                        <div className="p-4 bg-slate-50 rounded-xl">
                                            <span className="text-sm text-slate-500 block">Total Budget</span>
                                            <span className="text-2xl font-bold text-india-navy">₹{parseFloat(tripData.budget).toLocaleString()}</span>
                                        </div>
                                        <div className="p-4 bg-india-saffron/5 rounded-xl">
                                            <span className="text-sm text-slate-500 block">Per Person</span>
                                            <span className="text-xl font-bold text-india-saffron">₹{(parseFloat(tripData.budget) / tripData.numTravelers).toLocaleString()}</span>
                                        </div>
                                        <p className="text-xs text-slate-400">
                                            * This is a smart estimate based on your traveler type ({tripData.travelerType}) and age group ({tripData.ageGroup}).
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'food' && (
                            <div className="space-y-6">
                                <h3 className="text-2xl font-bold">Taste of {destination.name}</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {destination.local_food.map(food => (
                                        <div key={food} className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                                            <div className="w-12 h-12 bg-india-saffron/10 rounded-xl flex items-center justify-center text-india-saffron italic font-bold">
                                                {food[0]}
                                            </div>
                                            <span className="font-bold text-slate-700">{food}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeTab === 'docs' && (
                            <div className="space-y-6">
                                <h3 className="text-2xl font-bold">Packing & Docs Checklist</h3>
                                <div className="space-y-3">
                                    {['Government ID (Aadhar/Voter ID)', 'Comfortable walking shoes', 'Sunscreen & Sunglasses', ...(destination.permits_required.length > 0 ? destination.permits_required : [])].map(item => (
                                        <div key={item} className="flex items-center gap-3 p-4 rounded-xl border border-slate-100 hover:border-india-saffron/20 transition-all cursor-pointer group">
                                            <div className="w-5 h-5 rounded border-2 border-slate-200 group-hover:border-india-saffron transition-all" />
                                            <span className="text-slate-700 font-medium">{item}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeTab === 'local' && (
                            <div className="space-y-6">
                                <h3 className="text-2xl font-bold">Beyond the Tourist Spots</h3>
                                <div className="space-y-4">
                                    {destination.hidden_gems.map(gem => (
                                        <div key={gem} className="p-6 rounded-2xl bg-india-navy text-white relative overflow-hidden group">
                                            <MapIcon className="absolute -bottom-4 -right-4 w-24 h-24 opacity-10 group-hover:scale-110 transition-transform" />
                                            <h4 className="text-xl font-bold mb-2">{gem}</h4>
                                            <p className="text-india-white/70 text-sm">
                                                A local favorite that offers a more authentic experience of the {destination.name} lifestyle and culture.
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </motion.div>
                </div>

                <div className="space-y-6">
                    <div className="card-glass p-6">
                        <h4 className="font-bold mb-4 flex items-center gap-2">
                            <Compass className="text-india-navy" size={18} />
                            Destination Profile
                        </h4>
                        <p className="text-slate-600 text-sm leading-relaxed mb-4">
                            {destination.description}
                        </p>
                        <div className="space-y-3">
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-500">State</span>
                                <span className="font-bold">{destination.state}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-500">Region</span>
                                <span className="font-bold">{destination.region}</span>
                            </div>
                            <div className="flex flex-wrap gap-2 mt-4">
                                {destination.type.map(t => (
                                    <span key={t} className="px-3 py-1 bg-slate-100 rounded-full text-[10px] font-bold uppercase text-slate-500">{t}</span>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="p-6 rounded-2xl bg-gradient-to-br from-india-saffron to-orange-600 text-white shadow-xl shadow-orange-500/20">
                        <h4 className="font-bold mb-2">Hackathon Prototype</h4>
                        <p className="text-xs text-white/80 leading-relaxed">
                            This portal demonstrates 12 key features for the 2025 Smart Travel challenge. Using Gemini AI for dynamic personalization.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TripDashboard;
