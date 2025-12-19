export type ResearchDesignId =
  'survey' | 'observational' | 'case_study' |
  'correlational' | 'cross_sectional' | 'longitudinal' |
  'rct' | 'quasi_experiment' |
  'multiple_baseline' | 'abab_reversal' |
  'phenomenology' | 'ethnography' | 'grounded_theory' |
  'dbr' | 'ddr' |
  'convergent_parallel' | 'explanatory_sequential' | 'exploratory_sequential';

export type ResearchCategory = 'Descriptive' | 'Relational' | 'Causal' | 'Single-Subject' | 'Qualitative' | 'Iterative' | 'Mixed-Methods';

export interface VisualizationNode {
  id: string;
  label: string;
  type?: 'start' | 'process' | 'decision' | 'end' | 'io';
}

export interface VisualizationLink {
  source: string;
  target: string;
  label?: string;
}

export interface VisualizationData {
  nodes: VisualizationNode[];
  links: VisualizationLink[];
}

export interface StudyExample {
  title: string;
  authors: string;
  year: number;
  journal: string;
  summary: string;
  link?: string;
}

export interface ResearchDesign {
  id: ResearchDesignId;
  name: string;
  category: ResearchCategory;
  bestFor: string;
  description: string;
  strengths: string[];
  weaknesses: string[];
  checklist: {
    sampling: string;
    dataCollection: string;
    analysis: string;
    ethics: string;
  };
  references: string[];
  wordingGuidance?: {
    suggested: string[];
    caution: string[];
    advice: string;
  };
  visualization: VisualizationData;
  // New fields for enhanced features
  examples?: StudyExample[];
  pitfalls?: string[];
  sampleSizeGuidance?: string;
  typicalDuration?: string;
  costLevel?: 'Low' | 'Medium' | 'High';
  expertiseRequired?: 'Beginner' | 'Intermediate' | 'Advanced';
}

export interface GlossaryTerm {
  term: string;
  definition: string;
}

export interface ComparisonAttribute {
  feature: string;
  rct: string;
  quasi: string;
  correlational: string;
}