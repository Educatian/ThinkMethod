import React, { useState, useMemo } from 'react';
import { GLOSSARY_TERMS } from '../constants';

// Search icon component
const SearchIcon = () => (
  <svg className="w-5 h-5 text-slate-400 dark:text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const Glossary: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  // Filter terms based on search query (case-insensitive)
  const filteredTerms = useMemo(() => {
    if (!searchQuery.trim()) return GLOSSARY_TERMS;
    const query = searchQuery.toLowerCase();
    return GLOSSARY_TERMS.filter(
      item =>
        item.term.toLowerCase().includes(query) ||
        item.definition.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  // Calculate match count for display
  const matchCount = filteredTerms.length;
  const totalCount = GLOSSARY_TERMS.length;

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold gradient-text">Glossary of Research Terms</h2>
        <p className="mt-3 text-slate-600 dark:text-slate-300">
          Key definitions to help you understand research concepts.
        </p>
      </div>

      {/* Search Bar */}
      <div className="glass-card p-4 rounded-xl mb-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <SearchIcon />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search terms or definitions..."
            className="search-input pl-12"
          />
        </div>
        {searchQuery && (
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 pl-1">
            Showing {matchCount} of {totalCount} terms
            {matchCount === 0 && (
              <button
                onClick={() => setSearchQuery('')}
                className="ml-2 text-sky-600 hover:text-sky-700 dark:text-sky-400 dark:hover:text-sky-300"
              >
                Clear search
              </button>
            )}
          </p>
        )}
      </div>

      {/* Terms List */}
      <div className="space-y-4">
        {filteredTerms.length > 0 ? (
          filteredTerms.map((item, index) => (
            <div
              key={item.term}
              className={`glass-card p-5 rounded-xl card-hover animate-fade-in-up stagger-${Math.min(index + 1, 5)}`}
            >
              <h3 className="text-lg font-semibold text-sky-700 dark:text-sky-400 flex items-center gap-2">
                <span className="text-2xl font-bold text-sky-300 dark:text-sky-600">
                  {item.term.charAt(0)}
                </span>
                {item.term}
              </h3>
              <p className="mt-2 text-slate-600 dark:text-slate-400 leading-relaxed">
                {searchQuery ? (
                  // Highlight search matches
                  highlightMatches(item.definition, searchQuery)
                ) : (
                  item.definition
                )}
              </p>
            </div>
          ))
        ) : (
          <div className="text-center py-12 glass-card rounded-xl">
            <p className="text-slate-500 dark:text-slate-400 text-lg">
              No terms found matching "{searchQuery}"
            </p>
            <button
              onClick={() => setSearchQuery('')}
              className="mt-4 text-sky-600 hover:text-sky-700 dark:text-sky-400 font-medium"
            >
              Clear search
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// Helper function to highlight search matches in text
function highlightMatches(text: string, query: string): React.ReactNode {
  if (!query.trim()) return text;

  const parts = text.split(new RegExp(`(${query})`, 'gi'));
  return parts.map((part, i) =>
    part.toLowerCase() === query.toLowerCase() ? (
      <mark key={i} className="bg-yellow-200 dark:bg-yellow-900/50 text-inherit rounded px-0.5">
        {part}
      </mark>
    ) : part
  );
}

export default Glossary;