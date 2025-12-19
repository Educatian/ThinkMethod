import React from 'react';
import { ResearchDesignId } from '../types';
import { RESEARCH_DESIGNS, COMPARISON_ATTRIBUTES } from '../constants';
import { Trash2 } from './Icons';

interface ComparisonToolProps {
  selectedIds: ResearchDesignId[];
  onRemove: (id: ResearchDesignId) => void;
  onSelectDesign: (id: ResearchDesignId) => void;
  onAddDesign: () => void;
}

const ComparisonTool: React.FC<ComparisonToolProps> = ({ selectedIds, onRemove, onSelectDesign, onAddDesign }) => {
  const selectedDesigns = RESEARCH_DESIGNS.filter(d => selectedIds.includes(d.id));

  const designsForComparison = [
    RESEARCH_DESIGNS.find(d => d.id === 'rct')!,
    RESEARCH_DESIGNS.find(d => d.id === 'quasi_experiment')!,
    RESEARCH_DESIGNS.find(d => d.id === 'correlational')!,
  ];

  if (selectedIds.length === 0) {
    return (
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold gradient-text">Compare Research Designs</h2>
          <p className="mt-3 text-slate-600 dark:text-slate-300">
            Select designs from their detail pages to compare them here.
          </p>
          <p className="mt-2 text-slate-500 text-sm dark:text-slate-400">
            For a quick look, here is a default comparison of common causal and relational designs.
          </p>
        </div>

        {/* Default Comparison Table */}
        <div className="glass-card rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="table-professional w-full min-w-max">
              <thead>
                <tr>
                  <th className="p-4 font-semibold text-slate-700 bg-slate-50/80 dark:text-slate-200 dark:bg-slate-700/80">
                    Feature
                  </th>
                  {designsForComparison.map(design => (
                    <th key={design.id} className="p-4 font-semibold text-slate-700 bg-slate-50/80 dark:text-slate-200 dark:bg-slate-700/80">
                      <span className="text-sky-600 dark:text-sky-400">{design.name}</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-slate-800">
                {COMPARISON_ATTRIBUTES.map((attr, index) => (
                  <tr key={index}>
                    <td className="p-4 font-medium text-slate-700 dark:text-slate-300">{attr.feature}</td>
                    <td className="p-4 text-slate-600 dark:text-slate-400">{attr.rct}</td>
                    <td className="p-4 text-slate-600 dark:text-slate-400">{attr.quasi}</td>
                    <td className="p-4 text-slate-600 dark:text-slate-400">{attr.correlational}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto animate-fade-in-up">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold gradient-text">Comparison of Research Designs</h2>
        <p className="mt-3 text-slate-600 dark:text-slate-300">
          Comparing {selectedDesigns.length} design{selectedDesigns.length > 1 ? 's' : ''}
        </p>
      </div>

      {/* Comparison Table */}
      <div className="glass-card rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table-professional w-full min-w-max">
            <thead>
              <tr>
                <th className="p-4 font-semibold text-slate-700 bg-slate-50/80 dark:text-slate-200 dark:bg-slate-700/80 w-1/5">
                  Feature
                </th>
                {selectedDesigns.map(design => (
                  <th key={design.id} className="p-4 font-semibold text-slate-700 bg-slate-50/80 dark:text-slate-200 dark:bg-slate-700/80">
                    <div className="flex items-center justify-between gap-2">
                      <button
                        onClick={() => onSelectDesign(design.id)}
                        className="text-sky-600 dark:text-sky-400 hover:underline text-left font-semibold"
                      >
                        {design.name}
                      </button>
                      <button
                        onClick={() => onRemove(design.id)}
                        className="p-1.5 rounded-full text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
                        title="Remove from comparison"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </th>
                ))}
                {/* Add design placeholders */}
                {Array(3 - selectedDesigns.length).fill(0).map((_, i) => (
                  <th key={`placeholder-${i}`} className="p-3 bg-slate-50/80 dark:bg-slate-700/80">
                    <button
                      onClick={onAddDesign}
                      className="w-full flex items-center justify-center p-3 text-slate-500 font-semibold rounded-lg border-2 border-dashed border-slate-300 hover:border-sky-400 hover:bg-sky-50 hover:text-sky-600 transition-all dark:text-slate-400 dark:border-slate-600 dark:hover:border-sky-500 dark:hover:bg-slate-700 dark:hover:text-sky-400"
                      aria-label="Add another design to compare"
                    >
                      + Add Design
                    </button>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {['Category', 'Best For', 'Strengths', 'Weaknesses'].map((feature, index) => (
                <tr key={index}>
                  <td className="p-4 font-medium text-slate-700 dark:text-slate-300 align-top">
                    {feature}
                  </td>
                  {selectedDesigns.map(d => {
                    let content;
                    switch (feature) {
                      case 'Category':
                        const categoryClass = d.category.toLowerCase().replace(/\s+/g, '-');
                        content = (
                          <span className={`category-badge ${categoryClass}`}>
                            {d.category}
                          </span>
                        );
                        break;
                      case 'Best For':
                        content = d.bestFor;
                        break;
                      case 'Strengths':
                        content = (
                          <ul className="space-y-2">
                            {d.strengths.map((s, i) => (
                              <li key={i} className="flex items-start gap-2">
                                <span className="text-emerald-500 mt-1">✓</span>
                                <span>{s}</span>
                              </li>
                            ))}
                          </ul>
                        );
                        break;
                      case 'Weaknesses':
                        content = (
                          <ul className="space-y-2">
                            {d.weaknesses.map((w, i) => (
                              <li key={i} className="flex items-start gap-2">
                                <span className="text-red-400 mt-1">✗</span>
                                <span>{w}</span>
                              </li>
                            ))}
                          </ul>
                        );
                        break;
                    }
                    return (
                      <td key={d.id} className="p-4 text-slate-600 text-sm align-top dark:text-slate-400">
                        {content}
                      </td>
                    );
                  })}
                  {/* Empty cells for placeholders */}
                  {Array(3 - selectedDesigns.length).fill(0).map((_, i) => (
                    <td key={i} className="p-4"></td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ComparisonTool;