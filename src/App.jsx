import React, { useState } from 'react';
import OnboardingFlow from './components/Onboarding/OnboardingFlow';
import TripDashboard from './components/Dashboard/TripDashboard';

function App() {
    const [step, setStep] = useState('onboarding');
    const [tripData, setTripData] = useState(null);

    const handleOnboardingComplete = (data) => {
        setTripData(data);
        setStep('dashboard');
    };

    return (
        <div className="min-h-screen bg-tripfit-cream font-outfit text-slate-900">
            {/* Header */}
            <header className="fixed top-0 left-0 right-0 z-50 bg-white/70 backdrop-blur-md border-b border-india-saffron/10 px-6 py-4">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-india-saffron rounded-lg flex items-center justify-center shadow-lg">
                            <span className="text-white text-xl font-bold">TF</span>
                        </div>
                        <h1 className="text-2xl font-bold tracking-tight">
                            TripFit <span className="text-india-saffron">India</span>
                        </h1>
                    </div>
                    <div className="hidden md:block text-sm font-medium text-slate-500 italic">
                        "Your journey, perfectly fitted."
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="pt-24 pb-12 px-4">
                {step === 'onboarding' ? (
                    <OnboardingFlow onComplete={handleOnboardingComplete} />
                ) : (
                    <TripDashboard tripData={tripData} resetFlow={() => setStep('onboarding')} />
                )}
            </main>

            {/* Footer Branding */}
            <footer className="py-8 text-center border-t border-slate-200">
                <p className="text-sm text-slate-400">
                    Built for Hackathon 2025 • Solving for 1.4 Billion Travelers
                </p>
            </footer>
        </div>
    );
}

export default App;
