import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Calendar, Wallet, Users, Info, Sparkles, ChevronRight, ChevronLeft } from 'lucide-react';

const steps = [
    { id: 'destination', title: 'Where to?', icon: MapPin },
    { id: 'dates', title: 'When?', icon: Calendar },
    { id: 'budget', title: 'Budget', icon: Wallet },
    { id: 'traveler', title: 'Who?', icon: Users },
    { id: 'interests', title: 'Interests', icon: Info }
];

const OnboardingFlow = ({ onComplete }) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [formData, setFormData] = useState({
        destination: '',
        startDate: '',
        endDate: '',
        budget: '',
        travelerType: 'solo',
        ageGroup: '18-35',
        numTravelers: 1,
        interests: []
    });

    const nextStep = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(prev => prev + 1);
        } else {
            onComplete(formData);
        }
    };

    const prevStep = () => {
        if (currentStep > 0) {
            setCurrentStep(prev => prev - 1);
        }
    };

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const toggleInterest = (interest) => {
        setFormData(prev => {
            const interests = prev.interests.includes(interest)
                ? prev.interests.filter(i => i !== interest)
                : [...prev.interests, interest];
            return { ...prev, interests };
        });
    };

    const renderStepContent = () => {
        switch (steps[currentStep].id) {
            case 'destination':
                return (
                    <div className="space-y-4">
                        <h3 className="text-xl font-bold">What's your destination?</h3>
                        <input
                            type="text"
                            className="input-field"
                            placeholder="e.g. Jaipur, Kerala, Ladakh..."
                            value={formData.destination}
                            onChange={(e) => handleInputChange('destination', e.target.value)}
                        />
                    </div>
                );
            case 'dates':
                return (
                    <div className="space-y-4">
                        <h3 className="text-xl font-bold">Select travel dates</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Start Date</label>
                                <input
                                    type="date"
                                    className="input-field"
                                    value={formData.startDate}
                                    onChange={(e) => handleInputChange('startDate', e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">End Date</label>
                                <input
                                    type="date"
                                    className="input-field"
                                    value={formData.endDate}
                                    onChange={(e) => handleInputChange('endDate', e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                );
            case 'budget':
                return (
                    <div className="space-y-4">
                        <h3 className="text-xl font-bold">Planned Budget (₹)</h3>
                        <input
                            type="number"
                            className="input-field"
                            placeholder="e.g. 50000"
                            value={formData.budget}
                            onChange={(e) => handleInputChange('budget', e.target.value)}
                        />
                        <p className="text-sm text-slate-500">Total budget for the whole trip.</p>
                    </div>
                );
            case 'traveler':
                return (
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-xl font-bold mb-4">Traveler Type</h3>
                            <div className="grid grid-cols-2 gap-3">
                                {['Solo', 'Couple', 'Family', 'Group'].map(type => (
                                    <button
                                        key={type}
                                        onClick={() => handleInputChange('travelerType', type.toLowerCase())}
                                        className={`p-4 rounded-xl border-2 transition-all ${formData.travelerType === type.toLowerCase()
                                                ? 'border-india-saffron bg-india-saffron/10 text-india-saffron'
                                                : 'border-slate-200 hover:border-india-saffron/50'
                                            }`}
                                    >
                                        {type}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div>
                            <h3 className="text-xl font-bold mb-4">Age Group</h3>
                            <select
                                className="input-field"
                                value={formData.ageGroup}
                                onChange={(e) => handleInputChange('ageGroup', e.target.value)}
                            >
                                <option value="under-18">Under 18</option>
                                <option value="18-35">18–35</option>
                                <option value="36-60">36–60</option>
                                <option value="60+">60+</option>
                            </select>
                        </div>
                    </div>
                );
            case 'interests':
                const interestOptions = ['Adventure', 'Heritage', 'Spiritual', 'Coastal', 'Wildlife', 'Offbeat', 'Food'];
                return (
                    <div className="space-y-4">
                        <h3 className="text-xl font-bold">Pick your interests</h3>
                        <div className="flex flex-wrap gap-2">
                            {interestOptions.map(interest => (
                                <button
                                    key={interest}
                                    onClick={() => toggleInterest(interest)}
                                    className={`px-4 py-2 rounded-full border-2 transition-all ${formData.interests.includes(interest)
                                            ? 'border-india-saffron bg-india-saffron text-white'
                                            : 'border-slate-200 hover:border-india-saffron/50'
                                        }`}
                                >
                                    {interest}
                                </button>
                            ))}
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            <div className="card-glass p-8 md:p-12 relative overflow-hidden">
                {/* Progress Bar */}
                <div className="absolute top-0 left-0 h-2 bg-slate-100 w-full">
                    <motion.div
                        className="h-full bg-india-saffron"
                        initial={{ width: '0%' }}
                        animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                    />
                </div>

                {/* Step Indicator */}
                <div className="flex justify-between mb-12">
                    {steps.map((step, idx) => {
                        const Icon = step.icon;
                        return (
                            <div
                                key={step.id}
                                className={`flex flex-col items-center gap-2 ${idx <= currentStep ? 'text-india-saffron' : 'text-slate-300'
                                    }`}
                            >
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${idx <= currentStep ? 'border-india-saffron bg-india-saffron/10' : 'border-slate-200'
                                    }`}>
                                    <Icon size={20} />
                                </div>
                                <span className="text-xs font-bold uppercase tracking-wider hidden sm:block">
                                    {step.title}
                                </span>
                            </div>
                        );
                    })}
                </div>

                {/* Content Area */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentStep}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className="min-h-[300px]"
                    >
                        <div className="mb-2 flex items-center gap-1 text-india-saffron">
                            <Sparkles size={16} />
                            <span className="text-xs font-bold uppercase tracking-widest">Step {currentStep + 1} of 5</span>
                        </div>
                        {renderStepContent()}
                    </motion.div>
                </AnimatePresence>

                {/* Navigation Buttons */}
                <div className="flex justify-between mt-12 pt-8 border-t border-slate-100">
                    <button
                        onClick={prevStep}
                        disabled={currentStep === 0}
                        className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${currentStep === 0 ? 'text-slate-300 cursor-not-allowed' : 'text-slate-600 hover:bg-slate-100'
                            }`}
                    >
                        <ChevronLeft size={20} />
                        Back
                    </button>
                    <button
                        onClick={nextStep}
                        className="btn-primary flex items-center gap-2"
                    >
                        {currentStep === steps.length - 1 ? 'Build My Trip' : 'Next Step'}
                        <ChevronRight size={20} />
                    </button>
                </div>
            </div>

            <div className="mt-8 text-center">
                <p className="text-slate-400 text-sm max-w-sm mx-auto">
                    "Every traveler is different — TripFit builds a trip that fits your age, group, budget, taste, and timing."
                </p>
            </div>
        </div>
    );
};

export default OnboardingFlow;
