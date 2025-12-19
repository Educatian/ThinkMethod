import React, { useState, useEffect } from 'react';
import { ResearchDesignId } from '../types';
import { analyzeResearchQuestion } from '../services/geminiService';
import { ChevronRight, Wand2, Check } from './Icons';

interface WizardProps {
  onSelectDesign: (designId: ResearchDesignId) => void;
}

type Goal = 'Explore' | 'Relational' | 'Causal' | 'Develop' | 'Combine' | '';
type ExploreType = 'quantitative' | 'qualitative' | 'mixed' | '';
type Timing = 'single' | 'over_time' | '';
type Manipulation = 'yes' | 'no' | '';
type PopulationType = 'group' | 'single_subject' | '';
type MixedMethodType = 'concurrent' | 'explain' | 'explore' | '';

const Wizard: React.FC<WizardProps> = ({ onSelectDesign }) => {
  const [question, setQuestion] = useState<string>('');
  const [goal, setGoal] = useState<Goal>('');
  const [exploreType, setExploreType] = useState<ExploreType>('');
  const [timing, setTiming] = useState<Timing>('');
  const [manipulation, setManipulation] = useState<Manipulation>('');
  const [populationType, setPopulationType] = useState<PopulationType>('');
  const [mixedMethodType, setMixedMethodType] = useState<MixedMethodType>('');
  const [recommendations, setRecommendations] = useState<ResearchDesignId[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    // Reset subsequent answers if a previous answer changes
    setExploreType('');
    setTiming('');
    setManipulation('');
    setPopulationType('');
    setMixedMethodType('');
    setRecommendations([]);
  }, [goal]);

  useEffect(() => {
    setRecommendations([]);
  }, [timing, populationType, exploreType, manipulation, mixedMethodType]);

  useEffect(() => {
    // Determine recommendations based on answers
    if (goal === 'Explore') {
      if (exploreType === 'quantitative') {
        setRecommendations(['survey', 'observational']);
      } else if (exploreType === 'qualitative') {
        setRecommendations(['phenomenology', 'ethnography', 'grounded_theory', 'case_study']);
      } else if (exploreType === 'mixed') {
        setRecommendations(['exploratory_sequential', 'convergent_parallel']);
      }
    } else if (goal === 'Relational') {
      if (timing === 'single') {
        setRecommendations(['cross_sectional', 'correlational']);
      } else if (timing === 'over_time') {
        setRecommendations(['longitudinal']);
      }
    } else if (goal === 'Causal') {
      if (populationType === 'group') {
        if (manipulation === 'yes') {
          setRecommendations(['rct']);
        } else if (manipulation === 'no') {
          setRecommendations(['quasi_experiment']);
        }
      } else if (populationType === 'single_subject') {
        setRecommendations(['multiple_baseline', 'abab_reversal']);
      }
    } else if (goal === 'Develop') {
      setRecommendations(['dbr', 'ddr']);
    } else if (goal === 'Combine') {
      if (mixedMethodType === 'concurrent') {
        setRecommendations(['convergent_parallel']);
      } else if (mixedMethodType === 'explain') {
        setRecommendations(['explanatory_sequential']);
      } else if (mixedMethodType === 'explore') {
        setRecommendations(['exploratory_sequential']);
      }
    } else {
      setRecommendations([]);
    }
  }, [goal, exploreType, timing, manipulation, populationType, mixedMethodType]);

  const handleAnalyze = async () => {
    if (!question.trim()) {
      setError('Please enter a research question.');
      return;
    }
    setIsLoading(true);
    setError('');
    const result = await analyzeResearchQuestion(question);
    setIsLoading(false);
    if (result) {
      if (result === 'Descriptive') {
        setGoal('Explore');
      } else if (result === 'Mixed-Methods') {
        setGoal('Combine');
      }
      else {
        setGoal(result as Goal)
      }
    } else {
      setError('Could not analyze the question. Please select an option manually.');
    }
  };

  const resetWizard = () => {
    setQuestion('');
    setGoal('');
    setExploreType('');
    setTiming('');
    setManipulation('');
    setPopulationType('');
    setMixedMethodType('');
    setRecommendations([]);
    setError('');
  };

  const getDesignName = (id: ResearchDesignId) => {
    const names: Record<ResearchDesignId, string> = {
      survey: 'Survey Research',
      observational: 'Observational Study',
      case_study: 'Case Study',
      correlational: 'Correlational Study',
      cross_sectional: 'Cross-Sectional Study',
      longitudinal: 'Longitudinal Study',
      rct: 'Randomized Controlled Trial (RCT)',
      quasi_experiment: 'Quasi-Experiment',
      multiple_baseline: 'Multiple Baseline Design',
      abab_reversal: 'A-B-A-B Reversal Design',
      phenomenology: 'Phenomenology',
      ethnography: 'Ethnography',
      grounded_theory: 'Grounded Theory',
      dbr: 'Design-Based Research (DBR)',
      ddr: 'Design & Development Research (DDR)',
      convergent_parallel: 'Convergent Parallel Design',
      explanatory_sequential: 'Explanatory Sequential Design',
      exploratory_sequential: 'Exploratory Sequential Design',
    };
    return names[id];
  };

  // Calculate current step for progress indicator
  const getCurrentStep = () => {
    if (recommendations.length > 0) return 3;
    if (goal === 'Develop') return 3; // Develop goes straight to recommendations
    if (goal === 'Causal' && populationType === 'group' && manipulation) return 3;
    if (goal && (exploreType || timing || populationType || mixedMethodType)) return 2;
    if (goal) return 2;
    return 1;
  };

  const getTotalSteps = () => {
    if (goal === 'Develop') return 2;
    if (goal === 'Causal' && populationType === 'group') return 3;
    return 2;
  };

  const currentStep = getCurrentStep();
  const totalSteps = getTotalSteps();

  const QuestionCard: React.FC<{ title: string, children: React.ReactNode, isVisible: boolean, stepNum?: number }> = ({ title, children, isVisible, stepNum }) => {
    if (!isVisible) return null;
    return (
      <div className="glass-card p-6 rounded-xl mt-6 animate-fade-in-up">
        <div className="flex items-center gap-3 mb-4">
          {stepNum && (
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-sky-100 dark:bg-sky-900/50 text-sky-600 dark:text-sky-400 font-bold text-sm">
              {stepNum}
            </span>
          )}
          <h3 className="text-lg font-semibold text-slate-700 dark:text-white">{title}</h3>
        </div>
        {children}
      </div>
    );
  };

  const RadioButton: React.FC<{ name: string, value: string, label: string, checked: boolean, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }> = ({ name, value, label, checked, onChange }) => (
    <label className={`flex items-center space-x-4 p-4 rounded-lg border-2 transition-all cursor-pointer ${checked
      ? 'bg-sky-50 border-sky-500 dark:bg-sky-900/50 dark:border-sky-500'
      : 'bg-white border-slate-200 hover:border-slate-300 dark:bg-slate-800/80 dark:border-slate-600 dark:hover:border-slate-500'}`}>
      <input type="radio" name={name} value={value} checked={checked} onChange={onChange} className="sr-only" />
      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${checked ? 'border-sky-500 bg-sky-500' : 'border-slate-300 dark:border-slate-400'}`}>
        {checked && <Check className="w-4 h-4 text-white" />}
      </div>
      <span className={`text-slate-700 dark:text-slate-100 ${checked ? 'font-semibold' : ''}`}>{label}</span>
    </label>
  );

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold gradient-text">Research Design Wizard</h2>
        <p className="mt-3 text-slate-600 dark:text-slate-200">Answer a few questions to get a personalized research design recommendation.</p>

        {/* Progress Indicator */}
        {goal && (
          <div className="flex items-center justify-center mt-6 gap-2">
            {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step, index) => (
              <React.Fragment key={step}>
                <div
                  className={`progress-dot ${step < currentStep ? 'completed' : step === currentStep ? 'active' : 'inactive'
                    }`}
                >
                  {step < currentStep ? <Check className="w-4 h-4" /> : step}
                </div>
                {index < totalSteps - 1 && (
                  <div className={`progress-connector ${step < currentStep ? 'completed' : ''}`} />
                )}
              </React.Fragment>
            ))}
          </div>
        )}
      </div>

      {/* AI Question Input */}
      <div className="glass-card p-6 rounded-xl">
        <label htmlFor="research-question" className="block text-lg font-semibold text-slate-700 dark:text-white">
          Start here: What is your research question?
        </label>
        <p className="text-sm text-slate-500 mt-1 mb-3 dark:text-slate-300">
          Enter your research question below and let our AI suggest a starting point, or answer the questions manually.
        </p>
        <textarea
          id="research-question"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="e.g., How do teachers adapt to new technology in the classroom?"
          className="w-full p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all bg-white dark:bg-slate-700/80 dark:border-slate-500 dark:text-white dark:placeholder-slate-400 resize-none"
          rows={3}
        />
        <button
          onClick={handleAnalyze}
          disabled={isLoading}
          className="btn-primary mt-4 flex items-center justify-center gap-2 w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          {isLoading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Analyzing...
            </>
          ) : (
            <>
              <Wand2 className="h-5 w-5" />
              Analyze with AI
            </>
          )}
        </button>
        {error && <p className="text-red-500 mt-3 text-sm">{error}</p>}
      </div>

      <QuestionCard title="What is the primary goal of your research?" isVisible={true} stepNum={1}>
        <div className="space-y-3">
          <RadioButton name="goal" value="Explore" label="To describe or explore a phenomenon, situation, or experience in depth." checked={goal === 'Explore'} onChange={(e) => setGoal(e.target.value as Goal)} />
          <RadioButton name="goal" value="Relational" label="To explore the relationship or association between two or more variables." checked={goal === 'Relational'} onChange={(e) => setGoal(e.target.value as Goal)} />
          <RadioButton name="goal" value="Causal" label="To determine if a change in one variable causes a change in another." checked={goal === 'Causal'} onChange={(e) => setGoal(e.target.value as Goal)} />
          <RadioButton name="goal" value="Develop" label="To develop and test an intervention or product in a real-world setting." checked={goal === 'Develop'} onChange={(e) => setGoal(e.target.value as Goal)} />
          <RadioButton name="goal" value="Combine" label="To combine quantitative and qualitative data to get a fuller picture." checked={goal === 'Combine'} onChange={(e) => setGoal(e.target.value as Goal)} />
        </div>
      </QuestionCard>

      <QuestionCard title="What kind of data will you primarily use?" isVisible={goal === 'Explore'} stepNum={2}>
        <div className="space-y-3">
          <RadioButton name="exploreType" value="quantitative" label="Numerical data (e.g., surveys with scales, counts of behavior)." checked={exploreType === 'quantitative'} onChange={(e) => setExploreType(e.target.value as ExploreType)} />
          <RadioButton name="exploreType" value="qualitative" label="Non-numerical data (e.g., interviews, observations, texts)." checked={exploreType === 'qualitative'} onChange={(e) => setExploreType(e.target.value as ExploreType)} />
          <RadioButton name="exploreType" value="mixed" label="Both quantitative and qualitative data." checked={exploreType === 'mixed'} onChange={(e) => setExploreType(e.target.value as ExploreType)} />
        </div>
      </QuestionCard>

      <QuestionCard title="What is the timing of your data collection?" isVisible={goal === 'Relational'} stepNum={2}>
        <div className="space-y-3">
          <RadioButton name="timing" value="single" label="At a single point in time." checked={timing === 'single'} onChange={(e) => setTiming(e.target.value as Timing)} />
          <RadioButton name="timing" value="over_time" label="Over a period of time." checked={timing === 'over_time'} onChange={(e) => setTiming(e.target.value as Timing)} />
        </div>
      </QuestionCard>

      <QuestionCard title="What is the focus of your study?" isVisible={goal === 'Causal'} stepNum={2}>
        <div className="space-y-3">
          <RadioButton name="population" value="group" label="Group-level effects (comparing averages between groups)." checked={populationType === 'group'} onChange={(e) => setPopulationType(e.target.value as PopulationType)} />
          <RadioButton name="population" value="single_subject" label="Individual-level effects (intensive study of one or a few participants)." checked={populationType === 'single_subject'} onChange={(e) => setPopulationType(e.target.value as PopulationType)} />
        </div>
      </QuestionCard>

      <QuestionCard title="How do you plan to combine quantitative and qualitative data?" isVisible={goal === 'Combine'} stepNum={2}>
        <div className="space-y-3">
          <RadioButton name="mixedMethod" value="concurrent" label="Concurrently, to get different perspectives on the same topic." checked={mixedMethodType === 'concurrent'} onChange={(e) => setMixedMethodType(e.target.value as MixedMethodType)} />
          <RadioButton name="mixedMethod" value="explain" label="Sequentially, using qualitative data to help explain initial quantitative results." checked={mixedMethodType === 'explain'} onChange={(e) => setMixedMethodType(e.target.value as MixedMethodType)} />
          <RadioButton name="mixedMethod" value="explore" label="Sequentially, using initial qualitative findings to build a quantitative instrument or study." checked={mixedMethodType === 'explore'} onChange={(e) => setMixedMethodType(e.target.value as MixedMethodType)} />
        </div>
      </QuestionCard>

      <QuestionCard title="Will you manipulate the key variable and randomly assign participants?" isVisible={goal === 'Causal' && populationType === 'group'} stepNum={3}>
        <div className="space-y-3">
          <RadioButton name="manipulation" value="yes" label="Yes, I can manipulate the variable and randomly assign participants." checked={manipulation === 'yes'} onChange={(e) => setManipulation(e.target.value as Manipulation)} />
          <RadioButton name="manipulation" value="no" label="No, random assignment or manipulation is not possible." checked={manipulation === 'no'} onChange={(e) => setManipulation(e.target.value as Manipulation)} />
        </div>
      </QuestionCard>

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <div className="mt-8 p-6 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 animate-fade-in-up dark:from-emerald-900/30 dark:to-teal-900/30 dark:border-emerald-800">
          <div className="flex items-center gap-3 mb-4">
            <span className="flex items-center justify-center w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/50">
              <Check className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            </span>
            <div>
              <h3 className="text-xl font-bold text-emerald-800 dark:text-emerald-200">Our Recommendations</h3>
              <p className="text-emerald-700 text-sm dark:text-emerald-300">Based on your answers, consider these research designs:</p>
            </div>
          </div>
          <ul className="mt-4 space-y-3">
            {recommendations.map((id, index) => (
              <li key={id} className={`animate-fade-in-up stagger-${index + 1}`}>
                <button
                  onClick={() => onSelectDesign(id)}
                  className="w-full text-left flex items-center justify-between p-4 bg-white rounded-xl shadow-sm border border-slate-200 hover:shadow-lg hover:border-sky-400 transition-all group dark:bg-slate-800 dark:border-slate-700 dark:hover:border-sky-500 card-hover"
                >
                  <span className="font-semibold text-sky-700 text-lg dark:text-sky-400">{getDesignName(id)}</span>
                  <ChevronRight className="h-6 w-6 text-slate-400 group-hover:text-sky-600 transition-transform group-hover:translate-x-1 dark:text-slate-500 dark:group-hover:text-sky-400" />
                </button>
              </li>
            ))}
          </ul>
          <div className="text-center mt-6">
            <button
              onClick={resetWizard}
              className="text-sm text-slate-500 hover:text-emerald-700 transition-colors dark:text-slate-400 dark:hover:text-emerald-300"
            >
              ← Start Over
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Wizard;