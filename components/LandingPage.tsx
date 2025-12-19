import React, { useState, useEffect } from 'react';
import AuthModal from './AuthModal';

interface LandingPageProps {
    onEnterApp: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onEnterApp }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [showAuthModal, setShowAuthModal] = useState(false);

    useEffect(() => {
        setIsVisible(true);
        const handleMouseMove = (e: MouseEvent) => {
            setMousePosition({ x: e.clientX, y: e.clientY });
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    const features = [
        { icon: '🎯', title: 'Smart Selection', desc: 'AI-powered wizard guides you to the perfect research design' },
        { icon: '📊', title: 'Visual Workflows', desc: 'Interactive D3.js diagrams show methodology step-by-step' },
        { icon: '⚖️', title: 'Compare Designs', desc: 'Side-by-side comparison of up to 3 methodologies' },
        { icon: '🤖', title: 'AI Chat Advisor', desc: 'Ask questions and get personalized recommendations' },
    ];

    const designs = [
        'RCT', 'Quasi-Experiment', 'Survey', 'Case Study', 'Phenomenology',
        'Grounded Theory', 'Mixed-Methods', 'DBR', 'Longitudinal'
    ];

    return (
        <div className="min-h-screen overflow-hidden relative hero-gradient">
            {/* Animated gradient background */}
            <div className="absolute inset-0 overflow-hidden">
                <div
                    className="absolute w-[800px] h-[800px] rounded-full opacity-20 blur-3xl transition-all duration-1000"
                    style={{
                        background: 'radial-gradient(circle, rgba(14, 165, 233, 0.5) 0%, transparent 70%)',
                        left: mousePosition.x - 400,
                        top: mousePosition.y - 400,
                    }}
                />
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-sky-400/10 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
                <div className="absolute top-1/2 left-1/2 w-[600px] h-[600px] -translate-x-1/2 -translate-y-1/2">
                    <div className="absolute inset-0 border border-sky-300/20 rounded-full animate-spin" style={{ animationDuration: '20s' }} />
                    <div className="absolute inset-8 border border-sky-300/20 rounded-full animate-spin" style={{ animationDuration: '25s', animationDirection: 'reverse' }} />
                    <div className="absolute inset-16 border border-sky-300/20 rounded-full animate-spin" style={{ animationDuration: '30s' }} />
                </div>
            </div>

            {/* Grid overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(14,165,233,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(14,165,233,0.05)_1px,transparent_1px)] bg-[size:50px_50px]" />

            {/* Content */}
            <div className="relative z-10 min-h-screen flex flex-col">
                {/* Nav */}
                <nav className={`p-6 flex justify-between items-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'}`}>
                    <div className="flex items-center gap-3">
                        <img src="/thinkmethod_logo.png" alt="ThinkMethod" className="w-10 h-10 rounded-xl shadow-lg" />
                        <span className="text-slate-800 font-bold text-xl">ThinkMethod</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <a href="#features" className="text-slate-600 hover:text-sky-600 text-sm transition-colors">Features</a>
                        <a href="#designs" className="text-slate-600 hover:text-sky-600 text-sm transition-colors">Designs</a>
                        <button
                            onClick={() => setShowAuthModal(true)}
                            className="px-4 py-2 text-slate-600 hover:text-sky-600 text-sm font-medium transition-all"
                        >
                            Sign In
                        </button>
                        <button
                            onClick={() => setShowAuthModal(true)}
                            className="px-4 py-2 bg-gradient-to-r from-sky-500 to-blue-600 rounded-full text-white text-sm font-medium hover:shadow-lg hover:shadow-sky-500/25 transition-all"
                        >
                            Get Started
                        </button>
                    </div>
                </nav>

                {/* Hero */}
                <main className="flex-1 flex items-center justify-center px-6">
                    <div className="max-w-5xl mx-auto text-center">
                        <div className={`transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-sky-100 border border-sky-200 rounded-full text-sky-600 text-sm mb-8">
                                <span className="w-2 h-2 bg-sky-500 rounded-full animate-pulse" />
                                Powered by Gemini AI + Google Search RAG
                            </div>
                        </div>

                        <h1 className={`text-5xl md:text-7xl font-bold text-slate-800 mb-6 leading-tight transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                            Think Smarter.
                            <span className="block bg-gradient-to-r from-sky-500 via-blue-500 to-cyan-500 bg-clip-text text-transparent">
                                Research Better.
                            </span>
                        </h1>

                        <p className={`text-xl text-slate-600 max-w-2xl mx-auto mb-10 transition-all duration-1000 delay-400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                            AI-powered advisor for educational and social science researchers.
                            18 research methodologies, interactive workflows, and personalized guidance.
                        </p>

                        <div className={`flex flex-col sm:flex-row gap-4 justify-center transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                            <button
                                onClick={onEnterApp}
                                className="group px-8 py-4 bg-gradient-to-r from-sky-500 to-blue-600 rounded-2xl text-white font-semibold text-lg shadow-xl shadow-sky-500/25 hover:shadow-sky-500/40 hover:scale-105 transition-all duration-300"
                            >
                                Start Research Wizard
                                <span className="inline-block ml-2 group-hover:translate-x-1 transition-transform">→</span>
                            </button>
                            <button
                                onClick={onEnterApp}
                                className="px-8 py-4 bg-white backdrop-blur-sm border border-slate-200 rounded-2xl text-slate-700 font-semibold text-lg hover:border-sky-300 hover:bg-sky-50 transition-all shadow-sm"
                            >
                                🤖 Chat with AI Advisor
                            </button>
                        </div>

                        {/* Floating design tags */}
                        <div className={`mt-16 flex flex-wrap justify-center gap-3 transition-all duration-1000 delay-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} id="designs">
                            {designs.map((design, i) => (
                                <span
                                    key={design}
                                    className="px-4 py-2 bg-white/80 border border-slate-200 rounded-full text-slate-600 text-sm hover:bg-sky-50 hover:border-sky-300 hover:text-sky-600 transition-all cursor-pointer shadow-sm"
                                    style={{ animationDelay: `${i * 100}ms` }}
                                >
                                    {design}
                                </span>
                            ))}
                        </div>
                    </div>
                </main>

                {/* Features */}
                <section id="features" className={`px-6 py-20 transition-all duration-1000 delay-700 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
                    <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {features.map((feature, i) => (
                            <div
                                key={feature.title}
                                className="group p-6 bg-white/80 backdrop-blur-sm border border-slate-200 rounded-2xl hover:bg-white hover:border-sky-300 hover:shadow-lg transition-all duration-300 hover:scale-105"
                                style={{ transitionDelay: `${i * 100}ms` }}
                            >
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-sky-100 to-blue-100 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">
                                    {feature.icon}
                                </div>
                                <h3 className="text-slate-800 font-semibold mb-2">{feature.title}</h3>
                                <p className="text-slate-500 text-sm">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Footer */}
                <footer className="px-6 py-8 border-t border-slate-200">
                    <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="flex items-center gap-2">
                            <img src="/thinkmethod_logo.png" alt="ThinkMethod" className="w-6 h-6 rounded" />
                            <p className="text-slate-500 text-sm">© 2024 ThinkMethod</p>
                        </div>
                        <p className="text-slate-400 text-xs">Content advised by Dr. Jewoong Moon — The University of Alabama</p>
                    </div>
                </footer>
            </div>

            {/* Auth Modal */}
            <AuthModal
                isOpen={showAuthModal}
                onClose={() => setShowAuthModal(false)}
                onAuthSuccess={() => {
                    setShowAuthModal(false);
                    onEnterApp();
                }}
            />
        </div>
    );
};

export default LandingPage;
