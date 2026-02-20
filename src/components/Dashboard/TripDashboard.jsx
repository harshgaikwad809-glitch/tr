import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Calendar, MapPin, Wallet, Utensils, Info,
    ChevronRight, Download, Share2, AlertTriangle,
    Map as MapIcon, Compass, CheckCircle2, Loader2, Sparkles, MapPin as Pin
} from 'lucide-react';
import BudgetChart from './BudgetChart';
import destinationData from '../../data/destinations.json';
import { generateItinerary } from '../../services/gemini';

const TripDashboard = ({ tripData, resetFlow }) => {
    const [activeTab, setActiveTab] = useState('itinerary');
    const [destination, setDestination] = useState(null);
    const [itinerary, setItinerary] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchItinerary = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await generateItinerary(tripData);
            setItinerary(data);
        } catch (err) {
            console.error("Dashboard Fetch Error:", err);
            setError("Failed to generate your personalized itinerary. Please check your API key or try again.");
        } finally {
            setLoading(false);
        }
    };

    const tabs = [
        { id: 'itinerary', label: 'Itinerary', icon: Calendar },
        { id: 'budget', label: 'Budget', icon: Wallet },
        { id: 'food', label: 'Food', icon: Utensils },
        { id: 'docs', label: 'Docs', icon: Info },
        { id: 'local', label: 'Hidden Gems', icon: Compass }
    ];

    useEffect(() => {
        // Basic destination matching
        const match = destinationData.find(d =>
            d.name.toLowerCase().includes(tripData.destination.toLowerCase()) ||
            d.cities.some(c => c.toLowerCase().includes(tripData.destination.toLowerCase()))
        );
        const bestMatch = match || destinationData[0];
        setDestination(bestMatch);

        fetchItinerary();
    }, [tripData]);

    if (!destination) return null;

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
                <div className="relative">
                    <Loader2 size={64} className="text-india-saffron animate-spin" />
                    <Sparkles className="absolute -top-2 -right-2 text-india-navy animate-pulse" size={24} />
                </div>
                <h2 className="text-3xl font-bold italic text-india-navy">Tailoring your journey...</h2>
                <p className="text-slate-500 max-w-md">Gemini AI is crafting a personalized itinerary that fits your taste, budget, and age group.</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center text-red-600">
                    <AlertTriangle size={32} />
                </div>
                <h2 className="text-2xl font-bold text-slate-800">Oops! Something went wrong.</h2>
                <p className="text-slate-500 max-w-md">{error}</p>
                <div className="flex gap-4">
                    <button onClick={fetchItinerary} className="btn-primary py-3 px-8">
                        Retry Generation
                    </button>
                    <button onClick={resetFlow} className="px-8 py-3 rounded-xl border-2 border-slate-200 font-bold hover:bg-slate-50">
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

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
                        {itinerary?.title || `Your ${destination.name} Odyssey`}
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
                    <button onClick={resetFlow} className="btn-primary py-3 px-6">
                        New Plan
                    </button>
                </div>
            </div>

            {/* Seasonal Advisory */}
            <div className="mb-8 p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-center gap-4">
                <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center text-amber-600 shrink-0">
                    <AlertTriangle size={24} />
                </div>
                <div>
                    <h4 className="font-bold text-amber-800">Travel Advisor</h4>
                    <p className="text-sm text-amber-700">
                        {itinerary?.seasonalAdvice || `You're visiting during a great time! Weather is typically pleasant.`}
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
                        {activeTab === 'itinerary' && itinerary && (
                            <div className="space-y-8">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-2xl font-bold">Personalized Itinerary</h3>
                                    <div className="flex items-center gap-1 px-3 py-1 bg-india-saffron/10 text-india-saffron text-xs font-bold rounded-full">
                                        <Sparkles size={12} />
                                        LIVE AI
                                    </div>
                                </div>
                                <div className="space-y-12 border-l-2 border-slate-100 ml-4 pl-8 relative">
                                    {itinerary.dailyPlan.map(day => (
                                        <div key={day.day} className="relative">
                                            <div className="absolute -left-[41px] top-0 w-4 h-4 rounded-full bg-india-saffron border-4 border-tripfit-cream" />
                                            <div className="mb-2 flex items-center gap-2">
                                                <span className="text-india-saffron font-bold text-sm uppercase tracking-widest">Day {day.day}</span>
                                                <span className="text-slate-300">•</span>
                                                <span className="text-slate-500 font-medium text-sm">{day.theme}</span>
                                            </div>

                                            <ul className="space-y-3 mb-6">
                                                {day.activities.map((activity, i) => (
                                                    <li key={i} className="flex items-start gap-3 group">
                                                        <Pin size={16} className="mt-1 text-india-navy/30 group-hover:text-india-navy transition-colors" />
                                                        <span className="text-slate-700 leading-relaxed">{activity}</span>
                                                    </li>
                                                ))}
                                            </ul>

                                            {day.hiddenGem && (
                                                <div className="p-4 rounded-xl bg-india-navy/5 border border-india-navy/10 flex items-center gap-3">
                                                    <Compass className="text-india-navy shrink-0" size={20} />
                                                    <div className="text-sm">
                                                        <span className="font-bold text-india-navy">Hidden Gem: </span>
                                                        <span className="text-slate-600 font-medium">{day.hiddenGem}</span>
                                                    </div>
                                                </div>
                                            )}
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
                                        <p className="text-xs text-slate-400 leading-relaxed">
                                            * This is a smart estimate adjusted for {tripData.travelerType} travel and the {tripData.ageGroup} age group.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'food' && (
                            <div className="space-y-6">
                                <h3 className="text-2xl font-bold">Local Flavors to Try</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {destination.local_food.map(food => (
                                        <div key={food} className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                                            <div className="w-12 h-12 bg-india-saffron/10 rounded-xl flex items-center justify-center text-india-saffron italic font-bold text-xl">
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
                                <h3 className="text-2xl font-bold">Checkpoint & Packing</h3>
                                <div className="space-y-3">
                                    {(itinerary?.packingList || ['Aadhar Card', 'Comfortable Shoes', 'Power Bank']).map(item => (
                                        <div key={item} className="flex items-center gap-3 p-4 rounded-xl border border-slate-100 hover:border-india-saffron/20 transition-all cursor-pointer group">
                                            <div className="w-5 h-5 rounded border-2 border-slate-200 group-hover:border-india-saffron transition-all flex items-center justify-center">
                                                <div className="w-2 h-2 rounded-full bg-india-saffron opacity-0 group-hover:opacity-100 transition-opacity" />
                                            </div>
                                            <span className="text-slate-700 font-medium">{item}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeTab === 'local' && (
                            <div className="space-y-6">
                                <h3 className="text-2xl font-bold">Surfaced for You</h3>
                                <div className="space-y-4">
                                    {destination.hidden_gems.map(gem => (
                                        <div key={gem} className="p-6 rounded-2xl bg-india-navy text-white relative overflow-hidden group transition-all hover:bg-india-navy/90">
                                            <MapIcon className="absolute -bottom-4 -right-4 w-24 h-24 opacity-10 group-hover:scale-110 transition-transform" />
                                            <h4 className="text-xl font-bold mb-2">{gem}</h4>
                                            <p className="text-india-white/70 text-sm leading-relaxed">
                                                An offbeat experience in {destination.name} discovered specifically for your interest in {tripData.interests[0] || 'history'}.
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
                                <span className="text-slate-500">Travel Type</span>
                                <span className="font-bold capitalize">{tripData.travelerType}</span>
                            </div>
                            <div className="flex flex-wrap gap-2 mt-4">
                                {destination.type.map(t => (
                                    <span key={t} className="px-3 py-1 bg-india-saffron/5 rounded-full text-[10px] font-bold uppercase text-india-saffron">{t}</span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TripDashboard;
