import React, { useState, useCallback, useEffect } from 'react';
import { BookOpen, Scale, Wand2 } from './components/Icons';
import Wizard from './components/Wizard';
import Glossary from './components/Glossary';
import ComparisonTool from './components/ComparisonTool';
import { ResearchDesign, ResearchDesignId } from './types';
import { RESEARCH_DESIGNS } from './constants';
import ResearchDesignDetails from './components/ResearchDesignDetails';
import ChatAdvisor from './components/ChatAdvisor';
import LandingPage from './components/LandingPage';
import { loggingService } from './services/loggingService';

type View = 'wizard' | 'glossary' | 'comparison' | 'details';

const App: React.FC = () => {
  const [showLanding, setShowLanding] = useState(true);
  const [currentView, setCurrentView] = useState<View>('wizard');
  const [selectedDesign, setSelectedDesign] = useState<ResearchDesign | null>(null);
  const [comparisonItems, setComparisonItems] = useState<ResearchDesignId[]>([]);

  // Start session on mount
  useEffect(() => {
    loggingService.startSession();

    // End session on page unload
    const handleUnload = () => loggingService.endSession();
    window.addEventListener('beforeunload', handleUnload);
    return () => window.removeEventListener('beforeunload', handleUnload);
  }, []);

  const handleSelectDesign = useCallback((designId: ResearchDesignId) => {
    const design = RESEARCH_DESIGNS.find(d => d.id === designId);
    if (design) {
      setSelectedDesign(design);
      setCurrentView('details');
      // Log design view
      loggingService.logDesignView(design.name, designId);
    }
  }, []);

  const handleAddToComparison = useCallback((designId: ResearchDesignId) => {
    setComparisonItems(prev => {
      if (prev.includes(designId)) return prev;
      if (prev.length >= 3) {
        alert("You can only compare up to 3 designs at a time.");
        return prev;
      }
      // Log comparison add
      loggingService.logComparison('add', designId);
      return [...prev, designId];
    });
    setCurrentView('comparison');
  }, []);

  const handleRemoveFromComparison = useCallback((designId: ResearchDesignId) => {
    setComparisonItems(prev => prev.filter(id => id !== designId));
    // Log comparison remove
    loggingService.logComparison('remove', designId);
  }, []);

  const navigateToWizard = useCallback(() => {
    setCurrentView('wizard');
  }, []);

  const renderView = () => {
    switch (currentView) {
      case 'wizard':
        return <Wizard onSelectDesign={handleSelectDesign} />;
      case 'glossary':
        return <Glossary />;
      case 'comparison':
        return <ComparisonTool selectedIds={comparisonItems} onRemove={handleRemoveFromComparison} onSelectDesign={handleSelectDesign} onAddDesign={navigateToWizard} />;
      case 'details':
        return selectedDesign ? <ResearchDesignDetails design={selectedDesign} onAddToComparison={handleAddToComparison} /> : <Wizard onSelectDesign={handleSelectDesign} />;
      default:
        return <Wizard onSelectDesign={handleSelectDesign} />;
    }
  };

  const NavButton = ({ view, label, icon }: { view: View, label: string, icon: React.ReactNode }) => (
    <button
      onClick={() => {
        const previousView = currentView;
        setSelectedDesign(null);
        setCurrentView(view);
        // Log navigation
        loggingService.logNavigation(previousView, view);
      }}
      className={`relative flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-200 text-sm font-medium ${currentView === view
        ? 'text-sky-600 bg-sky-100 shadow-sm'
        : 'text-slate-600 hover:text-sky-600 hover:bg-slate-100'
        }`}
    >
      <span className={`transition-transform duration-200 ${currentView === view ? 'scale-110' : ''}`}>
        {icon}
      </span>
      <span className="hidden sm:inline">{label}</span>
    </button>
  );

  // Show landing page first
  if (showLanding) {
    return <LandingPage onEnterApp={() => {
      setShowLanding(false);
      loggingService.logClick('navigation', 'enter_app');
    }} />;
  }

  return (
    <div className="min-h-screen flex flex-col font-sans hero-gradient">
      <header className="glass-header sticky top-0 z-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => setShowLanding(true)}>
              <img src="/thinkmethod_logo.png" alt="ThinkMethod" className="w-8 h-8 rounded-lg" />
              <h1 className="text-xl sm:text-2xl font-bold gradient-text">
                ThinkMethod
              </h1>
            </div>
            <nav className="flex items-center gap-1 sm:gap-2">
              <NavButton view="wizard" label="Wizard" icon={<Wand2 className="h-5 w-5" />} />
              <NavButton view="comparison" label="Compare" icon={<Scale className="h-5 w-5" />} />
              <NavButton view="glossary" label="Glossary" icon={<BookOpen className="h-5 w-5" />} />
            </nav>
          </div>
        </div>
      </header>
      <main className="flex-grow container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="animate-fade-in-up">
          {renderView()}
        </div>
      </main>
      <footer className="mt-auto py-6 border-t border-slate-200 dark:border-white/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            &copy; {new Date().getFullYear()} ThinkMethod. For educational purposes only.
          </p>
          <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
            Content and structure advised by Dr. Jewoong Moon — The University of Alabama
          </p>
        </div>
      </footer>

      {/* AI Chat Advisor - Floating Widget */}
      <ChatAdvisor currentDesign={selectedDesign?.name} />
    </div>
  );
};

export default App;