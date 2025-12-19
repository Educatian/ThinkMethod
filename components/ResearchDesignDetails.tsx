import React, { useState } from 'react';
import { ResearchDesign, ResearchDesignId } from '../types';
import { AlertCircle, CheckCircle, Edit3, ThumbsDown, ThumbsUp, BookOpen, Scale } from './Icons';
import ResearchDesignVisualization from './ResearchDesignVisualization';

interface ResearchDesignDetailsProps {
  design: ResearchDesign;
  onAddToComparison: (designId: ResearchDesignId) => void;
}

type Tab = 'overview' | 'checklist' | 'workflow' | 'references';

const ResearchDesignDetails: React.FC<ResearchDesignDetailsProps> = ({ design, onAddToComparison }) => {
  const [activeTab, setActiveTab] = useState<Tab>('overview');

  // Get category class for badge styling
  const categoryClass = design.category.toLowerCase().replace(/\s+/g, '-');

  const InfoCard: React.FC<{ title: string, content: string | string[], icon: React.ReactNode, className?: string }> = ({ title, content, icon, className = '' }) => (
    <div className={`glass-card p-5 rounded-xl card-hover ${className}`}>
      <div className="flex items-center gap-3 mb-3">
        {icon}
        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">{title}</h3>
      </div>
      {Array.isArray(content) ? (
        <ul className="space-y-2">
          {content.map((item, index) => (
            <li key={index} className="flex items-start gap-2 text-slate-600 dark:text-slate-300">
              <span className="text-sky-400 mt-1">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{content}</p>
      )}
    </div>
  );

  const tabs: { id: Tab; label: string }[] = [
    { id: 'overview', label: 'Overview' },
    { id: 'checklist', label: 'Checklist' },
    { id: 'workflow', label: 'Visual Workflow' },
    { id: 'references', label: 'References & Wording' },
  ];

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header Card */}
      <div className="glass-card p-6 rounded-xl mb-6 animate-fade-in-up">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="flex-1">
            <span className={`category-badge ${categoryClass}`}>{design.category}</span>
            <h2 className="text-3xl font-bold text-slate-800 mt-3 dark:text-slate-100">{design.name}</h2>
            <p className="mt-3 text-slate-600 dark:text-slate-300 leading-relaxed">{design.description}</p>
          </div>
          <button
            onClick={() => onAddToComparison(design.id)}
            className="btn-primary flex-shrink-0 flex items-center gap-2"
          >
            <Scale className="h-4 w-4" />
            Add to Comparison
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="glass-card rounded-xl mb-6 p-1 flex items-center gap-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 px-4 py-2.5 text-sm font-medium rounded-lg transition-all ${activeTab === tab.id
              ? 'bg-white dark:bg-slate-700 text-sky-600 dark:text-sky-400 shadow-sm'
              : 'text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-700/50'
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="animate-fade-in-up">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <InfoCard
                title="Best For"
                content={design.bestFor}
                icon={<CheckCircle className="h-6 w-6 text-emerald-500" />}
                className="md:col-span-2"
              />
              <InfoCard
                title="Strengths"
                content={design.strengths}
                icon={<ThumbsUp className="h-6 w-6 text-green-500" />}
              />
              <InfoCard
                title="Weaknesses"
                content={design.weaknesses}
                icon={<ThumbsDown className="h-6 w-6 text-red-500" />}
              />
            </div>

            {/* Pitfalls Section */}
            {design.pitfalls && design.pitfalls.length > 0 && (
              <div className="glass-card p-5 rounded-xl border-l-4 border-amber-400">
                <div className="flex items-center gap-3 mb-4">
                  <AlertCircle className="h-6 w-6 text-amber-500" />
                  <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Common Pitfalls to Avoid</h3>
                </div>
                <ul className="space-y-3">
                  {design.pitfalls.map((pitfall, index) => (
                    <li key={index} className="flex items-start gap-3 text-slate-600 dark:text-slate-300">
                      <span className="text-amber-500 mt-0.5 font-bold">⚠</span>
                      <span>{pitfall}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Examples Section */}
            {design.examples && design.examples.length > 0 && (
              <div className="glass-card p-5 rounded-xl">
                <div className="flex items-center gap-3 mb-4">
                  <BookOpen className="h-6 w-6 text-sky-600" />
                  <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Real-World Study Examples</h3>
                </div>
                <div className="space-y-4">
                  {design.examples.map((example, index) => (
                    <div key={index} className="p-4 bg-sky-50/50 dark:bg-sky-900/20 rounded-lg border border-sky-100 dark:border-sky-800">
                      <h4 className="font-semibold text-slate-800 dark:text-slate-100">{example.title}</h4>
                      <p className="text-sm text-sky-700 dark:text-sky-400 mt-1">
                        {example.authors} ({example.year}) — <em>{example.journal}</em>
                      </p>
                      <p className="text-slate-600 dark:text-slate-300 mt-2 text-sm leading-relaxed">{example.summary}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Quick Stats */}
            {(design.sampleSizeGuidance || design.typicalDuration || design.costLevel || design.expertiseRequired) && (
              <div className="glass-card p-5 rounded-xl">
                <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-4">Quick Reference</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {design.sampleSizeGuidance && (
                    <div className="text-center p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                      <p className="text-2xl mb-1">👥</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 uppercase font-medium">Sample Size</p>
                      <p className="text-sm text-slate-700 dark:text-slate-300 mt-1">{design.sampleSizeGuidance.split(';')[0]}</p>
                    </div>
                  )}
                  {design.typicalDuration && (
                    <div className="text-center p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                      <p className="text-2xl mb-1">⏱️</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 uppercase font-medium">Duration</p>
                      <p className="text-sm text-slate-700 dark:text-slate-300 mt-1">{design.typicalDuration}</p>
                    </div>
                  )}
                  {design.costLevel && (
                    <div className="text-center p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                      <p className="text-2xl mb-1">💰</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 uppercase font-medium">Cost</p>
                      <p className={`text-sm mt-1 font-medium ${design.costLevel === 'Low' ? 'text-green-600' :
                        design.costLevel === 'Medium' ? 'text-amber-600' : 'text-red-600'
                        }`}>{design.costLevel}</p>
                    </div>
                  )}
                  {design.expertiseRequired && (
                    <div className="text-center p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                      <p className="text-2xl mb-1">🎓</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 uppercase font-medium">Expertise</p>
                      <p className={`text-sm mt-1 font-medium ${design.expertiseRequired === 'Beginner' ? 'text-green-600' :
                        design.expertiseRequired === 'Intermediate' ? 'text-amber-600' : 'text-purple-600'
                        }`}>{design.expertiseRequired}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'checklist' && (
          <div className="glass-card p-6 rounded-xl">
            <h3 className="text-xl font-bold text-slate-800 mb-6 dark:text-slate-100">Considerations Checklist</h3>
            <div className="space-y-6">
              {[
                { title: 'Sampling', content: design.checklist.sampling, icon: '🎯' },
                { title: 'Data Collection', content: design.checklist.dataCollection, icon: '📊' },
                { title: 'Common Statistical Analyses', content: design.checklist.analysis, icon: '📈' },
                { title: 'Ethical Issues', content: design.checklist.ethics, icon: '⚖️' },
              ].map((item, index) => (
                <div key={index} className={index > 0 ? 'pt-6 border-t border-slate-200 dark:border-slate-700' : ''}>
                  <h4 className="font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-2">
                    <span className="text-xl">{item.icon}</span>
                    {item.title}
                  </h4>
                  <p className="text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">{item.content}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'workflow' && (
          <div className="glass-card p-6 rounded-xl">
            <h3 className="text-xl font-bold text-slate-800 mb-4 dark:text-slate-100">Typical Workflow</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-4">
              Drag nodes to rearrange. Shapes indicate: ● Start/End, ◆ Decision, ◇ Data Collection
            </p>
            <div className="w-full h-96 min-h-[400px] bg-slate-50 dark:bg-slate-900/50 rounded-xl">
              <ResearchDesignVisualization data={design.visualization} />
            </div>
          </div>
        )}

        {activeTab === 'references' && (
          <div className="space-y-6">
            {design.wordingGuidance && (
              <div className="glass-card p-6 rounded-xl">
                <div className="flex items-center gap-3 mb-4">
                  <Edit3 className="h-6 w-6 text-sky-600" />
                  <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">Wording Guidance</h3>
                </div>
                <div className="space-y-5">
                  <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg border border-emerald-200 dark:border-emerald-800">
                    <h4 className="font-semibold text-emerald-700 dark:text-emerald-400 mb-2">✓ Suggested Language</h4>
                    <p className="text-emerald-800 dark:text-emerald-300 italic">
                      "{design.wordingGuidance.suggested.join('", "')}"
                    </p>
                  </div>
                  <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
                    <h4 className="font-semibold text-amber-700 dark:text-amber-400 mb-2">⚠ Language to Use with Caution</h4>
                    <p className="text-amber-800 dark:text-amber-300 italic">
                      "{design.wordingGuidance.caution.join('", "')}"
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-700 dark:text-slate-200 mb-2">General Reporting Advice</h4>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{design.wordingGuidance.advice}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="glass-card p-6 rounded-xl">
              <div className="flex items-center gap-3 mb-4">
                <BookOpen className="h-6 w-6 text-sky-600" />
                <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">References</h3>
              </div>
              <div className="space-y-4">
                {design.references.map((ref, index) => (
                  <blockquote key={index} className="pl-4 border-l-2 border-sky-300 dark:border-sky-700">
                    <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed italic">{ref}</p>
                  </blockquote>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResearchDesignDetails;