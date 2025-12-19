import { ResearchDesign, GlossaryTerm, ComparisonAttribute } from './types';

const causalWording = {
  suggested: ["causes", "leads to", "results in", "impacts", "affects", "the effect of X on Y was..."],
  caution: ["proves (use 'suggests' or 'indicates' instead)"],
  advice: "Clearly state the intervention and the outcome. Acknowledge limitations, especially in quasi-experiments where random assignment is absent or in RCTs regarding external validity."
};

const relationalWording = {
  suggested: ["is related to", "is associated with", "correlates with", "predicts"],
  caution: ["causes", "affects", "impacts", "leads to", "results in"],
  advice: "Explicitly state that correlation does not equal causation. Discuss the direction and strength of the relationship found. Avoid any language that implies causality."
};

const descriptiveQualitativeWording = {
  suggested: ["describes", "explores", "illustrates", "reports", "presents", "identifies themes of..."],
  caution: ["proves", "demonstrates cause", "is associated with (unless a correlational component was included and tested)"],
  advice: "Focus on providing a rich, detailed account of the findings. Use quotes and observations to support themes. Avoid making generalizations beyond the specific context studied."
};

const mixedMethodsWording = {
  suggested: ["explains", "describes", "illustrates", "demonstrates how/why", "provides a comprehensive understanding of..."],
  caution: ["predicts (unless a specific predictive model is a key quantitative component)", "causes", "proves"],
  advice: "Clearly articulate how the quantitative and qualitative findings were integrated. Use language that reflects the synergy of the two methods, explaining how one dataset enriches or clarifies the other. Emphasize the goal of achieving a more complete picture than either method could alone."
};


export const RESEARCH_DESIGNS: ResearchDesign[] = [
  // Descriptive
  {
    id: 'survey',
    name: 'Survey Research',
    category: 'Descriptive',
    bestFor: 'Answering "what is" or "what are" questions, exploring characteristics of a phenomenon, or measuring the prevalence of a condition.',
    description: 'A method of gathering information from a sample of individuals through their responses to questions. Surveys can be administered online, via mail, in person, or over the phone.',
    strengths: [
      'Relatively inexpensive and can be administered to a large sample, allowing for generalizability.',
      'Can collect a wide range of data, including attitudes, behaviors, and demographic information.'
    ],
    weaknesses: [
      'Respondents may not be truthful, potentially giving socially desirable answers.',
      'The choice and wording of questions can significantly influence the results.',
      'Low response rates can introduce bias.'
    ],
    checklist: {
      sampling: 'Probability sampling (like simple random or stratified sampling) is ideal for generalizability. Non-probability sampling (like convenience sampling) can be used for exploratory research.',
      dataCollection: 'Primarily through questionnaires with closed-ended (e.g., multiple-choice, rating scales) and/or open-ended questions.',
      analysis: 'Descriptive statistics (frequencies, percentages, means, medians, modes), frequency distribution analysis.',
      ethics: 'Ensuring anonymity and confidentiality of responses, obtaining informed consent, and being transparent about the purpose of the survey.'
    },
    references: [
      'Fowler, F. J. (2013). *Survey research methods*. Sage publications.',
      'Dillman, D. A., Smyth, J. D., & Christian, L. M. (2014). *Internet, phone, mail, and mixed-mode surveys: The tailored design method*. John Wiley & Sons.'
    ],
    wordingGuidance: descriptiveQualitativeWording,
    visualization: {
      nodes: [
        { id: 'start', label: 'Define Research Question', type: 'start' },
        { id: 'population', label: 'Identify Population & Sample', type: 'process' },
        { id: 'instrument', label: 'Design Survey Instrument', type: 'process' },
        { id: 'administer', label: 'Administer Survey', type: 'process' },
        { id: 'analyze', label: 'Analyze Data', type: 'process' },
        { id: 'report', label: 'Report Findings', type: 'end' },
      ],
      links: [
        { source: 'start', target: 'population' },
        { source: 'population', target: 'instrument' },
        { source: 'instrument', target: 'administer' },
        { source: 'administer', target: 'analyze' },
        { source: 'analyze', target: 'report' },
      ]
    },
    examples: [
      {
        title: 'Student Engagement in Online Learning during COVID-19',
        authors: 'Kahn, P., Everington, L., et al.',
        year: 2017,
        journal: 'Higher Education',
        summary: 'A large-scale survey (n=2,500) examining factors that contribute to student engagement in university settings, using Likert-scale questions and open-ended responses.',
      },
      {
        title: 'Teacher Technology Integration Survey',
        authors: 'Ertmer, P. A., & Ottenbreit-Leftwich, A. T.',
        year: 2010,
        journal: 'Journal of Research on Technology in Education',
        summary: 'Surveyed 1,000+ K-12 teachers about their beliefs and practices regarding technology integration, revealing key barriers and enablers.',
      }
    ],
    pitfalls: [
      'Using leading or loaded questions that bias responses',
      'Having too many items, causing survey fatigue and incomplete responses',
      'Relying on convenience sampling and claiming generalizability',
      'Not pilot testing the survey instrument before deployment',
      'Ignoring non-response bias in the analysis'
    ],
    sampleSizeGuidance: 'Typically 100+ for basic descriptive analysis; 300+ for factor analysis; use power analysis for hypothesis testing',
    typicalDuration: '1-3 months for design, deployment, and analysis',
    costLevel: 'Low',
    expertiseRequired: 'Beginner'
  },
  {
    id: 'observational',
    name: 'Observational Study',
    category: 'Descriptive',
    bestFor: 'Observing behaviors in a natural setting and gaining insights that might be missed in controlled environments.',
    description: 'Researchers observe and record behavior in a natural setting without manipulating any variables.',
    strengths: [
      'Provides a realistic view of behaviors as they occur naturally.',
      'Can reveal insights that might be missed in a controlled setting.'
    ],
    weaknesses: [
      'Can be time-consuming.',
      'The presence of an observer might influence the behavior of those being observed (the Hawthorne effect).',
      'Cannot be used to determine cause-and-effect relationships.'
    ],
    checklist: {
      sampling: 'Depends on the context; may involve observing all individuals in a specific setting or a sample of settings/individuals.',
      dataCollection: 'Taking detailed field notes, using checklists, video or audio recordings.',
      analysis: 'Descriptive statistics, coding of observed behaviors into categories for frequency counts.',
      ethics: 'Obtaining consent for observation (especially in non-public settings), ensuring the privacy of participants.'
    },
    references: [
      'Creswell, J. W., & Poth, C. N. (2016). *Qualitative inquiry and research design: Choosing among five approaches*. Sage publications.'
    ],
    wordingGuidance: descriptiveQualitativeWording,
    visualization: {
      nodes: [
        { id: 'start', label: 'Define Observation Goals', type: 'start' },
        { id: 'setting', label: 'Select Setting & Participants', type: 'process' },
        { id: 'protocol', label: 'Develop Observation Protocol', type: 'process' },
        { id: 'observe', label: 'Conduct Observations & Record Data', type: 'process' },
        { id: 'analyze', label: 'Analyze Field Notes/Recordings', type: 'process' },
        { id: 'report', label: 'Report Descriptive Findings', type: 'end' },
      ],
      links: [
        { source: 'start', target: 'setting' },
        { source: 'setting', target: 'protocol' },
        { source: 'protocol', target: 'observe' },
        { source: 'observe', target: 'analyze' },
        { source: 'analyze', target: 'report' },
      ]
    }
  },
  {
    id: 'case_study',
    name: 'Case Study',
    category: 'Qualitative',
    bestFor: 'In-depth investigation of a single individual, group, or event to gain a rich, detailed understanding.',
    description: 'An in-depth investigation of a single individual, group, event, or community. It can be quantitative, qualitative, or mixed-methods.',
    strengths: [
      'Provides a rich, detailed understanding of a complex issue in a real-life context.',
      'Can be used to test theoretical models in real-world situations.'
    ],
    weaknesses: [
      'Findings are not generalizable to a larger population.',
      'The researcher\'s interpretation may be subjective.'
    ],
    checklist: {
      sampling: 'Purposive sampling is often used to select a case that is particularly informative.',
      dataCollection: 'Multiple data sources are typically used, including interviews, observations, documents, and archival records (a process called data triangulation).',
      analysis: 'Primarily qualitative analysis (thematic analysis, narrative analysis), but descriptive statistics may be used for any quantitative data collected.',
      ethics: 'Ensuring the anonymity of the case (individual or group), obtaining informed consent, and handling sensitive information responsibly.'
    },
    references: [
      'Yin, R. K. (2017). *Case study research and applications: Design and methods*. Sage publications.',
      'Stake, R. E. (1995). *The art of case study research*. Sage.'
    ],
    wordingGuidance: descriptiveQualitativeWording,
    visualization: {
      nodes: [
        { id: 'start', label: 'Define the Case', type: 'start' },
        { id: 'select', label: 'Select the Case(s)', type: 'process' },
        { id: 'collect', label: 'Collect Data (Multiple Sources)', type: 'io' },
        { id: 'analyze', label: 'Analyze Data within Case', type: 'process' },
        { id: 'cross', label: 'Analyze Data across Cases (if multiple)', type: 'decision' },
        { id: 'report', label: 'Write Case Report', type: 'end' },
      ],
      links: [
        { source: 'start', target: 'select' },
        { source: 'select', target: 'collect' },
        { source: 'collect', target: 'analyze' },
        { source: 'analyze', target: 'cross' },
        { source: 'cross', target: 'report' },
      ]
    }
  },
  // Relational
  {
    id: 'correlational',
    name: 'Correlational Study',
    category: 'Relational',
    bestFor: 'Exploring the relationship between two or more variables and answering questions about association or prediction.',
    description: 'Measures two or more variables and assesses the statistical relationship (i.e., the correlation) between them with little or no effort to control extraneous variables.',
    strengths: [
      'Allows for the study of variables that cannot be manipulated for ethical or practical reasons.',
      'Can indicate areas for future experimental research.'
    ],
    weaknesses: [
      'Correlation does not equal causation.',
      'It\'s impossible to claim that a change in one variable causes a change in another, as a third, unmeasured variable could be influencing both.'
    ],
    checklist: {
      sampling: 'A representative sample is important for making accurate statements about the relationship between variables in the population.',
      dataCollection: 'Surveys, existing datasets, or observational data can be used to collect information on the variables of interest.',
      analysis: 'Pearson\'s correlation coefficient, Spearman\'s rank correlation, Chi-square test. Regression analysis can be used to model and predict relationships.',
      ethics: 'Similar to survey research, with a focus on data privacy and informed consent.'
    },
    references: [
      'Creswell, J. W. (2012). *Educational research: Planning, conducting, and evaluating quantitative and qualitative research*. Pearson.'
    ],
    wordingGuidance: relationalWording,
    visualization: {
      nodes: [
        { id: 'start', label: 'Define Variables of Interest', type: 'start' },
        { id: 'sample', label: 'Select Representative Sample', type: 'process' },
        { id: 'measure_v1', label: 'Measure Variable 1', type: 'io' },
        { id: 'measure_v2', label: 'Measure Variable 2', type: 'io' },
        { id: 'analyze', label: 'Analyze Statistical Relationship', type: 'process' },
        { id: 'report', label: 'Report Correlation (Not Causation!)', type: 'end' },
      ],
      links: [
        { source: 'start', target: 'sample' },
        { source: 'sample', target: 'measure_v1' },
        { source: 'sample', target: 'measure_v2' },
        { source: 'measure_v1', target: 'analyze' },
        { source: 'measure_v2', target: 'analyze' },
        { source: 'analyze', target: 'report' },
      ]
    }
  },
  {
    id: 'cross_sectional',
    name: 'Cross-Sectional Study',
    category: 'Relational',
    bestFor: 'Getting a snapshot of a population at a single point in time to measure prevalence or relationships.',
    description: 'Data is collected from a population, or a representative subset, at a single, specific point in time.',
    strengths: [
      'Relatively inexpensive and less time-consuming than longitudinal studies.',
      'Provides a snapshot of the prevalence of an outcome or characteristic.'
    ],
    weaknesses: [
      'Cannot establish a cause-and-effect relationship.',
      'The timing of the "snapshot" may not be representative of other time periods.'
    ],
    checklist: {
      sampling: 'A representative sample of the population of interest is crucial.',
      dataCollection: 'Surveys are a common method for data collection in cross-sectional studies.',
      analysis: 'Descriptive statistics, correlational analyses, regression analysis.',
      ethics: 'As with survey and correlational research.'
    },
    references: [
      'Carlson, M. D., & Morrison, R. S. (2009). Study design, precision, and validity in observational studies. *Journal of Palliative Medicine, 12*(1), 77-82.'
    ],
    wordingGuidance: relationalWording,
    visualization: {
      nodes: [
        { id: 'start', label: 'Define Population and Time Point', type: 'start' },
        { id: 'sample', label: 'Select Representative Sample', type: 'process' },
        { id: 'collect', label: 'Collect Data at One Specific Time', type: 'io' },
        { id: 'analyze', label: 'Analyze Data for Prevalence/Relationships', type: 'process' },
        { id: 'report', label: 'Report Findings', type: 'end' },
      ],
      links: [
        { source: 'start', target: 'sample' },
        { source: 'sample', target: 'collect' },
        { source: 'collect', target: 'analyze' },
        { source: 'analyze', target: 'report' },
      ]
    }
  },
  {
    id: 'longitudinal',
    name: 'Longitudinal Study',
    category: 'Relational',
    bestFor: 'Tracking changes and developments over a period of time.',
    description: 'Involves repeated observations of the same variables over a period of time.',
    strengths: [
      'Can track changes and developments over time.',
      'More likely to suggest a causal relationship than a cross-sectional study because the timing of events can be established.'
    ],
    weaknesses: [
      'Can be expensive and time-consuming.',
      'Participant attrition (dropping out of the study) can be a significant problem and may bias the results.'
    ],
    checklist: {
      sampling: 'Requires careful planning for sample retention over time.',
      dataCollection: 'The same data collection methods (e.g., surveys, interviews, observations) are used at multiple points in time.',
      analysis: 'Techniques like regression analysis to model changes over time. Multilevel modeling is often used for analyzing repeated measures within individuals.',
      ethics: 'Maintaining contact with participants over time, ensuring confidentiality of long-term data, and obtaining ongoing informed consent.'
    },
    references: [
      'Caruana, E. J., Roman, M., Hernández-Sánchez, J., & Solli, P. (2015). Longitudinal studies. *Journal of Thoracic Disease, 7*(11), E537.'
    ],
    wordingGuidance: relationalWording,
    visualization: {
      nodes: [
        { id: 'start', label: 'Define Cohort & Variables', type: 'start' },
        { id: 'sample', label: 'Recruit Sample', type: 'process' },
        { id: 'collect1', label: 'Data Collection (Time 1)', type: 'io' },
        { id: 'collect2', label: 'Data Collection (Time 2)', type: 'io' },
        { id: 'collectN', label: 'Data Collection (Time N)', type: 'io' },
        { id: 'analyze', label: 'Analyze Change Over Time', type: 'process' },
        { id: 'report', label: 'Report Findings', type: 'end' },
      ],
      links: [
        { source: 'start', target: 'sample' },
        { source: 'sample', target: 'collect1' },
        { source: 'collect1', target: 'collect2' },
        { source: 'collect2', target: 'collectN' },
        { source: 'collectN', target: 'analyze' },
        { source: 'analyze', target: 'report' },
      ]
    }
  },
  // Causal
  {
    id: 'rct',
    name: 'Randomized Controlled Trial (RCT)',
    category: 'Causal',
    bestFor: 'Determining if one variable causes a change in another; the "gold standard" for establishing cause-and-effect.',
    description: 'An experiment where participants are randomly assigned to either a treatment group (which receives the intervention) or a control group (which does not). The outcomes of the two groups are then compared.',
    strengths: [
      'Considered the "gold standard" for establishing cause-and-effect relationships because random assignment minimizes pre-existing differences between groups.'
    ],
    weaknesses: [
      'Can be expensive and complex to implement.',
      'May not be ethical or practical in all situations.',
      'The controlled environment may not reflect real-world conditions, potentially limiting external validity.'
    ],
    checklist: {
      sampling: 'A sufficiently large and representative sample is needed for statistical power.',
      dataCollection: 'Often involves pre-test and post-test measurements of the outcome variable for both groups.',
      analysis: 'T-tests (to compare the means of two groups) and Analysis of Variance (ANOVA) (to compare the means of more than two groups).',
      ethics: 'Informed consent is crucial; participants must understand they will be randomly assigned to a group. The potential risks and benefits must be clearly explained. Deception should be avoided unless absolutely necessary and justified.'
    },
    references: [
      'Friedman, L. M., Furberg, C. D., DeMets, D. L., Reboussin, D. M., & Granger, C. B. (2015). *Fundamentals of clinical trials*. Springer.'
    ],
    wordingGuidance: causalWording,
    visualization: {
      nodes: [
        { id: 'start', label: 'Define Population', type: 'start' },
        { id: 'random', label: 'Random Assignment', type: 'decision' },
        { id: 'treat', label: 'Treatment Group', type: 'process' },
        { id: 'control', label: 'Control Group', type: 'process' },
        { id: 'measureT', label: 'Measure Outcome', type: 'io' },
        { id: 'measureC', label: 'Measure Outcome', type: 'io' },
        { id: 'compare', label: 'Compare Group Outcomes', type: 'process' },
        { id: 'report', label: 'Report Causal Effect', type: 'end' },
      ],
      links: [
        { source: 'start', target: 'random' },
        { source: 'random', target: 'treat', label: 'Assign' },
        { source: 'random', target: 'control', label: 'Assign' },
        { source: 'treat', target: 'measureT' },
        { source: 'control', target: 'measureC' },
        { source: 'measureT', target: 'compare' },
        { source: 'measureC', target: 'compare' },
        { source: 'compare', target: 'report' },
      ]
    },
    examples: [
      {
        title: 'Effects of Gamification on Student Motivation',
        authors: 'Hamari, J., Koivisto, J., & Sarsa, H.',
        year: 2014,
        journal: 'Computers in Human Behavior',
        summary: 'RCT with 200 students randomly assigned to gamified vs. traditional learning environments, measuring motivation and engagement outcomes.',
      },
      {
        title: 'Impact of Formative Assessment on Math Achievement',
        authors: 'Black, P., & Wiliam, D.',
        year: 1998,
        journal: 'Assessment in Education',
        summary: 'Landmark RCT demonstrating significant learning gains when teachers used formative assessment strategies, with random assignment of classrooms.',
      }
    ],
    pitfalls: [
      'Insufficient randomization leading to selection bias',
      'High attrition rates that unbalance groups',
      'Contamination between treatment and control groups',
      'Hawthorne effect: participants change behavior because they know they are being observed',
      'Overgeneralizing findings beyond the specific population studied'
    ],
    sampleSizeGuidance: 'Use power analysis; typically 30+ per group minimum, 50-100+ for detecting moderate effects',
    typicalDuration: '3-12 months depending on intervention length',
    costLevel: 'High',
    expertiseRequired: 'Advanced'
  },
  {
    id: 'quasi_experiment',
    name: 'Quasi-Experiment',
    category: 'Causal',
    bestFor: 'Estimating a causal relationship when random assignment is not possible or practical.',
    description: 'Similar to a true experiment, but participants are not randomly assigned to groups.',
    strengths: [
      'More feasible than RCTs in real-world settings where random assignment is not possible.'
    ],
    weaknesses: [
      'Lower internal validity than RCTs because the groups may not be comparable at the start of the study, making it harder to establish a causal relationship.'
    ],
    checklist: {
      sampling: 'Uses pre-existing groups (e.g., two different classrooms, two different clinics).',
      dataCollection: 'Typically involves pre-test and post-test measures to assess the impact of the intervention.',
      analysis: 'Similar to RCTs (t-tests, ANOVA), but with a greater need to statistically control for pre-existing differences. Multilevel modeling is useful when data is nested (e.g., students in classrooms).',
      ethics: 'Similar to RCTs, but with added consideration for the fairness of not randomly assigning the intervention if it is believed to be beneficial.'
    },
    references: [
      'Shadish, W. R., Cook, T. D., & Campbell, D. T. (2002). *Experimental and quasi-experimental designs for generalized causal inference*. Wadsworth Cengage learning.'
    ],
    wordingGuidance: causalWording,
    visualization: {
      nodes: [
        { id: 'start', label: 'Select Pre-existing Groups', type: 'start' },
        { id: 'assign', label: 'Non-Random Assignment', type: 'process' },
        { id: 'treat', label: 'Treatment Group', type: 'process' },
        { id: 'control', label: 'Comparison Group', type: 'process' },
        { id: 'pretestT', label: 'Pre-test', type: 'io' },
        { id: 'pretestC', label: 'Pre-test', type: 'io' },
        { id: 'posttestT', label: 'Post-test', type: 'io' },
        { id: 'posttestC', label: 'Post-test', type: 'io' },
        { id: 'compare', label: 'Compare Outcomes (Control for Diffs)', type: 'process' },
        { id: 'report', label: 'Report Estimated Effect', type: 'end' },
      ],
      links: [
        { source: 'start', target: 'assign' },
        { source: 'assign', target: 'treat' },
        { source: 'assign', target: 'control' },
        { source: 'treat', target: 'pretestT' },
        { source: 'control', target: 'pretestC' },
        { source: 'pretestT', target: 'posttestT' },
        { source: 'pretestC', target: 'posttestC' },
        { source: 'posttestT', target: 'compare' },
        { source: 'posttestC', target: 'compare' },
        { source: 'compare', target: 'report' },
      ]
    }
  },
  // Single-Subject
  {
    id: 'multiple_baseline',
    name: 'Multiple Baseline Design',
    category: 'Single-Subject',
    bestFor: 'Evaluating interventions when it is not ethical or practical to withdraw the treatment. Ideal for showing an intervention\'s effect across multiple participants, settings, or behaviors.',
    description: 'A single-case experimental design where an intervention is introduced sequentially across two or more independent baselines. A causal relationship is demonstrated if the behavior changes only when the intervention is applied to that specific baseline.',
    strengths: [
      'Avoids the ethical issue of withdrawing a successful treatment.',
      'Provides strong evidence for a causal link between intervention and behavior (high internal validity).',
      'Highly practical for many applied clinical and educational settings, especially in special education.'
    ],
    weaknesses: [
      'Requires careful selection of independent baselines (behaviors, settings, or participants) to avoid generalization of effects before intervention.',
      'Can be time-consuming if baseline phases need to be long to establish stability.',
      'Findings are not easily generalizable to a wider population (low external validity).'
    ],
    checklist: {
      sampling: 'Purposive sampling of a small number of participants (typically 3-5), or selection of distinct behaviors or settings for one individual.',
      dataCollection: 'Repeated, systematic measurement of a dependent variable during baseline (A) and intervention (B) phases. Data is graphed for visual analysis.',
      analysis: 'Primarily visual analysis of graphed data to identify immediate changes in level, trend, and variability upon intervention introduction for each baseline.',
      ethics: 'Informed consent is critical. The staggered introduction of the intervention must be managed ethically, ensuring participants are not deprived of a beneficial treatment for too long.'
    },
    references: [
      'Cooper, J. O., Heron, T. E., & Heward, W. L. (2020). *Applied behavior analysis* (3rd ed.). Pearson.'
    ],
    wordingGuidance: causalWording,
    visualization: {
      nodes: [
        { id: 'start', label: 'Select 3+ Baselines (Participants/Settings)', type: 'start' },
        { id: 'base1', label: 'Baseline 1: Measure Behavior', type: 'process' },
        { id: 'treat1', label: 'Intervention', type: 'process' },
        { id: 'base2', label: 'Baseline 2: Measure Behavior', type: 'process' },
        { id: 'treat2', label: 'Intervention', type: 'process' },
        { id: 'base3', label: 'Baseline 3: Measure Behavior', type: 'process' },
        { id: 'treat3', label: 'Intervention', type: 'process' },
        { id: 'analyze', label: 'Visually Analyze Change', type: 'end' },
      ],
      links: [
        { source: 'start', target: 'base1' },
        { source: 'start', target: 'base2' },
        { source: 'start', target: 'base3' },
        { source: 'base1', target: 'treat1' },
        { source: 'base2', target: 'treat2' },
        { source: 'base3', target: 'treat3' },
        { source: 'treat1', target: 'analyze' },
        { source: 'treat2', target: 'analyze' },
        { source: 'treat3', target: 'analyze' },
      ]
    }
  },
  {
    id: 'abab_reversal',
    name: 'A-B-A-B Reversal Design',
    category: 'Single-Subject',
    bestFor: 'Demonstrating a strong causal relationship for a single participant when the intervention\'s effects are reversible and it can be ethically withdrawn.',
    description: 'A single-case design involving a sequence of phases: a baseline period (A), an intervention period (B), a return to baseline (A - withdrawal of intervention), and a reintroduction of the intervention (B).',
    strengths: [
      'Provides very strong evidence of a functional relationship (high internal validity).',
      'Clearly demonstrates the effect of the independent variable on the dependent variable through replication.'
    ],
    weaknesses: [
      'Poses ethical concerns about withdrawing an effective treatment.',
      'Not suitable for behaviors that are not reversible (e.g., learning a new skill like reading).',
      'The second baseline phase can be frustrating for the participant if the intervention was working.'
    ],
    checklist: {
      sampling: 'Purposive sampling of a single participant, or a small group where each individual serves as their own control.',
      dataCollection: 'Repeated and reliable measurement of the target behavior across all four phases until stability is achieved in each.',
      analysis: 'Visual analysis of graphed data, comparing behavior levels between adjacent A and B phases to see if the behavior systematically changes with the presence or absence of the intervention.',
      ethics: 'The primary ethical concern is the withdrawal of a beneficial treatment. This design should only be used if the risks are minimal and fully justified, and with explicit informed consent about the withdrawal phase.'
    },
    references: [
      'Cooper, J. O., Heron, T. E., & Heward, W. L. (2020). *Applied behavior analysis* (3rd ed.). Pearson.'
    ],
    wordingGuidance: causalWording,
    visualization: {
      nodes: [
        { id: 'start', label: 'Select Participant', type: 'start' },
        { id: 'a1', label: 'Phase A: Baseline', type: 'process' },
        { id: 'b1', label: 'Phase B: Intervention', type: 'process' },
        { id: 'a2', label: 'Phase A: Withdrawal', type: 'process' },
        { id: 'b2', label: 'Phase B: Intervention', type: 'process' },
        { id: 'analyze', label: 'Analyze Functional Relationship', type: 'end' },
      ],
      links: [
        { source: 'start', target: 'a1' },
        { source: 'a1', target: 'b1' },
        { source: 'b1', target: 'a2' },
        { source: 'a2', target: 'b2' },
        { source: 'b2', target: 'analyze' },
      ]
    }
  },
  // Qualitative
  {
    id: 'phenomenology',
    name: 'Phenomenology',
    category: 'Qualitative',
    bestFor: 'Understanding the essence of a lived experience from the perspective of those who have experienced it.',
    description: 'Focuses on describing the common meaning for several individuals of their lived experiences of a concept or a phenomenon. The goal is to describe what was experienced and how it was experienced.',
    strengths: [
      'Provides a deep, rich understanding of a human experience.',
      'Gives a voice to participants and their perspectives.'
    ],
    weaknesses: [
      'Requires participants to be able to articulate their thoughts and feelings.',
      'The researcher\'s own experiences can influence the interpretation of data (bracketing is needed).',
      'Findings are not generalizable in the statistical sense.'
    ],
    checklist: {
      sampling: 'Purposive sampling to find individuals who have experienced the phenomenon of interest.',
      dataCollection: 'In-depth, often unstructured interviews are the primary method.',
      analysis: 'Involves identifying significant statements, generating meaning units, and developing a composite description of the essence of the experience.',
      ethics: 'Requires careful attention to building rapport and trust, ensuring confidentiality, and handling potentially emotional and sensitive topics with care.'
    },
    references: [
      'Moustakas, C. (1994). *Phenomenological research methods*. Sage publications.'
    ],
    wordingGuidance: descriptiveQualitativeWording,
    visualization: {
      nodes: [
        { id: 'start', label: 'Identify Phenomenon', type: 'start' },
        { id: 'bracket', label: 'Bracketing Researcher Assumptions', type: 'process' },
        { id: 'collect', label: 'In-depth Interviews', type: 'io' },
        { id: 'analyze', label: 'Analyze for Significant Statements & Meanings', type: 'process' },
        { id: 'essence', label: 'Describe Essence of the Experience', type: 'end' },
      ],
      links: [
        { source: 'start', target: 'bracket' },
        { source: 'bracket', target: 'collect' },
        { source: 'collect', target: 'analyze' },
        { source: 'analyze', target: 'essence' },
      ]
    }
  },
  {
    id: 'ethnography',
    name: 'Ethnography',
    category: 'Qualitative',
    bestFor: 'Describing and interpreting the shared patterns of culture, values, behaviors, and language of an intact cultural group in its natural setting.',
    description: 'A qualitative design in which the researcher describes and interprets the shared and learned patterns of values, behaviors, beliefs, and language of a culture-sharing group.',
    strengths: [
      'Provides a very detailed, holistic picture of a group\'s culture.',
      'Captures behavior in a natural context, leading to high ecological validity.'
    ],
    weaknesses: [
      'Extremely time-consuming, often requiring prolonged immersion in the field.',
      'The researcher can become so immersed that they lose objectivity ("going native").',
      'Can be culturally sensitive and requires deep respect for the group being studied.'
    ],
    checklist: {
      sampling: 'The researcher typically studies a single, intact culture-sharing group.',
      dataCollection: 'Prolonged participant observation, field notes, formal and informal interviews with "key informants," and collection of artifacts.',
      analysis: 'Holistic analysis involving identifying cultural themes and patterns to build a comprehensive cultural portrait.',
      ethics: 'Gaining access and building trust with the community is paramount. Researchers must be transparent about their role, protect informant identities, and ensure their work does not harm the community.'
    },
    references: [
      'Fetterman, D. M. (2019). *Ethnography: Step-by-step*. Sage publications.'
    ],
    wordingGuidance: descriptiveQualitativeWording,
    visualization: {
      nodes: [
        { id: 'start', label: 'Identify Culture-Sharing Group', type: 'start' },
        { id: 'access', label: 'Gain Access & Build Rapport', type: 'process' },
        { id: 'immersion', label: 'Prolonged Field Immersion (Participant Observation)', type: 'process' },
        { id: 'collect', label: 'Collect Data (Interviews, Artifacts)', type: 'io' },
        { id: 'analyze', label: 'Analyze for Cultural Themes & Patterns', type: 'process' },
        { id: 'portrait', label: 'Write Cultural Portrait', type: 'end' },
      ],
      links: [
        { source: 'start', target: 'access' },
        { source: 'access', target: 'immersion' },
        { source: 'immersion', target: 'collect' },
        { source: 'collect', target: 'analyze' },
        { source: 'analyze', target: 'portrait' },
      ]
    }
  },
  {
    id: 'grounded_theory',
    name: 'Grounded Theory',
    category: 'Qualitative',
    bestFor: 'Generating or discovering a theory that is "grounded" in data from the field, especially when existing theories are inadequate or non-existent.',
    description: 'A systematic qualitative procedure used to generate a theory that explains, at a broad conceptual level, a process, action, or interaction about a substantive topic.',
    strengths: [
      'Produces a theory that is directly derived from and relevant to the data.',
      'Provides a rigorous and systematic process for qualitative analysis.'
    ],
    weaknesses: [
      'Can be a complex and challenging methodology for novice researchers.',
      'Requires the researcher to set aside pre-existing theoretical ideas, which can be difficult.',
      'Data collection and analysis are time-intensive.'
    ],
    checklist: {
      sampling: 'Theoretical sampling, where the researcher collects data, codes it, and then decides where to collect data next in order to develop the emerging theory.',
      dataCollection: 'Primarily in-depth interviews, but can also include observations and documents.',
      analysis: 'A cyclical process of open coding (identifying concepts), axial coding (relating categories), and selective coding (building the theoretical storyline). The constant comparative method is used throughout.',
      ethics: 'Informed consent is key. Given the emergent nature of the research, researchers may need to revisit consent as the study\'s focus sharpens.'
    },
    references: [
      'Charmaz, K. (2014). *Constructing grounded theory*. Sage publications.',
      'Glaser, B. G., & Strauss, A. L. (1967). *The discovery of grounded theory: Strategies for qualitative research*. Aldine.'
    ],
    wordingGuidance: descriptiveQualitativeWording,
    visualization: {
      nodes: [
        { id: 'start', label: 'Start with Broad Area of Interest', type: 'start' },
        { id: 'collect', label: 'Theoretical Sampling & Data Collection', type: 'io' },
        { id: 'code', label: 'Open, Axial, Selective Coding', type: 'process' },
        { id: 'compare', label: 'Constant Comparative Method', type: 'process' },
        { id: 'saturate', label: 'Theoretical Saturation?', type: 'decision' },
        { id: 'theory', label: 'Generate Substantive Theory', type: 'end' },
      ],
      links: [
        { source: 'start', target: 'collect' },
        { source: 'collect', target: 'code' },
        { source: 'code', target: 'compare' },
        { source: 'compare', target: 'saturate' },
        { source: 'saturate', target: 'collect', label: 'No' },
        { source: 'saturate', target: 'theory', label: 'Yes' },
      ]
    }
  },
  // Iterative
  {
    id: 'dbr',
    name: 'Design-Based Research (DBR)',
    category: 'Iterative',
    bestFor: 'Developing theories about learning and instruction by designing, testing, and refining interventions in authentic classroom settings.',
    description: 'A research approach focused on engineering innovative learning environments and simultaneously developing theories of learning. It involves continuous cycles of design, enactment, analysis, and redesign within a real-world context.',
    strengths: [
      'Generates contextually-sensitive theories and practical design principles.',
      'Bridges the gap between research and practice by involving practitioners.',
      'Allows for flexibility and refinement based on emergent data.'
    ],
    weaknesses: [
      'Can be difficult to document and report the complex, iterative process.',
      'Findings may have limited generalizability to other contexts.',
      'Requires significant time and resources for long-term engagement in the field.'
    ],
    checklist: {
      sampling: 'Purposive selection of a specific educational setting or context that allows for the testing of the design.',
      dataCollection: 'Mixed-methods are common, including video/audio recordings of interactions, student artifacts, interviews, observations, and performance data.',
      analysis: 'Retrospective analysis across iterative cycles to identify patterns, refine the intervention, and generate theoretical principles.',
      ethics: 'Building a collaborative and equitable partnership with teachers and students is essential. Researchers must be transparent about the goals and flexible in the implementation.'
    },
    references: [
      'The Design-Based Research Collective. (2003). Design-based research: An emerging paradigm for educational inquiry. *Educational Researcher, 32*(1), 5-8.',
      'Sandoval, W. A. (2014). Conjecture mapping: A framework for developing and evaluating educational designs. *Educational Psychologist, 49*(4), 225-239.'
    ],
    wordingGuidance: descriptiveQualitativeWording,
    visualization: {
      nodes: [
        { id: 'start', label: 'Problem Analysis & Lit Review', type: 'start' },
        { id: 'design', label: 'Design Initial Intervention', type: 'process' },
        { id: 'test', label: 'Test in Real Context', type: 'process' },
        { id: 'analyze', label: 'Analyze Data & Reflect', type: 'process' },
        { id: 'redesign', label: 'Refine Design / Theory', type: 'process' },
        { id: 'end', label: 'Produce Design Principles', type: 'end' },
      ],
      links: [
        { source: 'start', target: 'design' },
        { source: 'design', target: 'test' },
        { source: 'test', target: 'analyze' },
        { source: 'analyze', target: 'redesign' },
        { source: 'redesign', target: 'test', label: 'Iterate' },
        { source: 'redesign', target: 'end', label: 'Finalize' },
      ]
    }
  },
  {
    id: 'ddr',
    name: 'Design & Development Research (DDR)',
    category: 'Iterative',
    bestFor: 'The systematic study of designing, developing, and evaluating instructional programs, processes, and products that must meet criteria of internal consistency and effectiveness.',
    description: 'A pragmatic and solution-oriented methodology focused on the entire lifecycle of creating an effective educational product or process. It moves through phases of analysis, design, development, implementation, and evaluation.',
    strengths: [
      'Highly relevant to practice and directly addresses real-world problems.',
      'Produces tangible and usable products, tools, or processes.',
      'Follows a systematic, goal-oriented process that can be managed effectively.'
    ],
    weaknesses: [
      'May prioritize product effectiveness over deep theoretical development.',
      'The final product may be context-specific and not easily transferable.',
      'Can be resource-intensive, requiring skills in both design and research.'
    ],
    checklist: {
      sampling: 'Purposive sampling of target users and learning environments for needs analysis, usability testing, and field testing.',
      dataCollection: 'Varies by phase: needs analysis (surveys, interviews), formative evaluation (expert reviews, user testing), and summative evaluation (performance tests, satisfaction surveys).',
      analysis: 'Analysis is phase-specific: descriptive analysis for needs, qualitative feedback for formative revisions, and effectiveness testing (quasi-experimental or pre-post) for summative evaluation.',
      ethics: 'Requires clear communication with participants about the development process, managing intellectual property, and ensuring the product does not have unintended negative consequences.'
    },
    references: [
      'Richey, R. C., & Klein, J. D. (2007). *Design and development research: Methods, strategies, and issues*. Lawrence Erlbaum Associates.',
      'Reeves, T. C., & McKenney, S. (2012). *Conducting educational design research*. Routledge.'
    ],
    wordingGuidance: descriptiveQualitativeWording,
    visualization: {
      nodes: [
        { id: 'analyze', label: 'Analysis (Needs, Content)', type: 'start' },
        { id: 'design', label: 'Design (Blueprints, Prototypes)', type: 'process' },
        { id: 'develop', label: 'Development (Create Product)', type: 'process' },
        { id: 'implement', label: 'Implementation (Roll-out)', type: 'process' },
        { id: 'evaluate', label: 'Evaluation (Formative & Summative)', type: 'end' },
      ],
      links: [
        { source: 'analyze', target: 'design' },
        { source: 'design', target: 'develop' },
        { source: 'develop', target: 'implement' },
        { source: 'implement', target: 'evaluate' },
        { source: 'evaluate', target: 'design', label: 'Revise' },
      ]
    }
  },
  // Mixed-Methods
  {
    id: 'convergent_parallel',
    name: 'Convergent Parallel Design',
    category: 'Mixed-Methods',
    bestFor: 'Obtaining a more comprehensive understanding of a topic by collecting and analyzing quantitative and qualitative data separately but concurrently, and then merging the results.',
    description: 'In this design, a researcher collects and analyzes both quantitative and qualitative data during the same phase of the research, and then integrates the information in the interpretation of the overall results. It is also called triangulation.',
    strengths: [
      'Efficient, as both data types are collected at the same time.',
      'Provides a more complete picture of the phenomenon by comparing and contrasting different but complementary data.',
      'The strengths of one method can offset the weaknesses of the other.'
    ],
    weaknesses: [
      'Can be challenging to integrate two different datasets and their results, especially if they are contradictory.',
      'Requires significant effort and expertise in both quantitative and qualitative methods.',
      'The two datasets might not be easily comparable.'
    ],
    checklist: {
      sampling: 'May involve different sampling strategies for the quantitative (often probability) and qualitative (often purposive) strands of the study.',
      dataCollection: 'Concurrent collection of quantitative (e.g., surveys) and qualitative (e.g., interviews) data.',
      analysis: 'Separate analysis of quantitative and qualitative data, followed by a data integration step where the two sets of results are compared, related, and synthesized.',
      ethics: 'Ensure informed consent covers both quantitative and qualitative data collection procedures and that confidentiality is maintained across datasets.'
    },
    references: [
      'Creswell, J. W., & Plano Clark, V. L. (2017). *Designing and conducting mixed methods research* (3rd ed.). Sage publications.'
    ],
    wordingGuidance: mixedMethodsWording,
    visualization: {
      nodes: [
        { id: 'start', label: 'Research Question', type: 'start' },
        { id: 'quan_collect', label: 'Collect Quantitative Data', type: 'io' },
        { id: 'qual_collect', label: 'Collect Qualitative Data', type: 'io' },
        { id: 'quan_analyze', label: 'Analyze Quantitative Data', type: 'process' },
        { id: 'qual_analyze', label: 'Analyze Qualitative Data', type: 'process' },
        { id: 'merge', label: 'Merge & Interpret Results', type: 'process' },
        { id: 'end', label: 'Comprehensive Findings', type: 'end' },
      ],
      links: [
        { source: 'start', target: 'quan_collect' },
        { source: 'start', target: 'qual_collect' },
        { source: 'quan_collect', target: 'quan_analyze' },
        { source: 'qual_collect', target: 'qual_analyze' },
        { source: 'quan_analyze', target: 'merge' },
        { source: 'qual_analyze', target: 'merge' },
        { source: 'merge', target: 'end' },
      ]
    }
  },
  {
    id: 'explanatory_sequential',
    name: 'Explanatory Sequential Design',
    category: 'Mixed-Methods',
    bestFor: 'Using qualitative findings to explain, interpret, or elaborate on initial quantitative results, especially when those results are surprising or complex.',
    description: 'A two-phase design where the researcher first collects and analyzes quantitative data. In the second phase, qualitative data is collected and analyzed to help explain the quantitative results.',
    strengths: [
      'The two-phase structure makes it straightforward to implement.',
      'The qualitative data can provide a deeper understanding and context for the initial quantitative findings.',
      'Ideal for exploring unexpected quantitative results in more detail.'
    ],
    weaknesses: [
      'Can be time-consuming due to its sequential nature.',
      'Requires careful selection of participants for the qualitative phase based on the results of the quantitative phase.',
      'The researcher may face challenges in deciding which quantitative results to follow up on.'
    ],
    checklist: {
      sampling: 'The first phase typically involves a quantitative sample. The second, qualitative phase involves purposive sampling from the initial sample to select participants who can best explain the quantitative results.',
      dataCollection: 'Phase 1: Quantitative data collection (e.g., surveys, tests). Phase 2: Qualitative data collection (e.g., interviews, focus groups).',
      analysis: 'Quantitative data is analyzed first. The results inform the development of the qualitative research questions and data collection. Qualitative data is then analyzed, and the findings from both phases are integrated in the final interpretation.',
      ethics: 'Informed consent should ideally be obtained for both phases at the start, or re-established before the second phase begins.'
    },
    references: [
      'Creswell, J. W., & Plano Clark, V. L. (2017). *Designing and conducting mixed methods research* (3rd ed.). Sage publications.'
    ],
    wordingGuidance: mixedMethodsWording,
    visualization: {
      nodes: [
        { id: 'start', label: 'QUAN Data Collection & Analysis', type: 'start' },
        { id: 'results', label: 'Identify QUAN Results to Explain', type: 'process' },
        { id: 'qual', label: 'qual Data Collection & Analysis', type: 'process' },
        { id: 'interpret', label: 'Interpret How qual Explains QUAN', type: 'end' },
      ],
      links: [
        { source: 'start', target: 'results' },
        { source: 'results', target: 'qual', label: 'Informs' },
        { source: 'qual', target: 'interpret' },
      ]
    }
  },
  {
    id: 'exploratory_sequential',
    name: 'Exploratory Sequential Design',
    category: 'Mixed-Methods',
    bestFor: 'Exploring a topic when the variables are unknown, a suitable theory is not available, or when developing and testing a new instrument.',
    description: 'A two-phase design where the researcher first explores a topic by collecting and analyzing qualitative data. The findings from this phase are then used to build a new instrument, intervention, or theory that is subsequently tested in a quantitative phase.',
    strengths: [
      'The initial qualitative exploration ensures that the subsequent quantitative phase is well-grounded in the participants\' perspectives.',
      'Excellent for developing new measurement instruments or taxonomies.',
      'The two phases are distinct and can be conducted by different researchers.'
    ],
    weaknesses: [
      'The sequential nature means the research can take a long time to complete.',
      'The development of the quantitative component based on the qualitative findings can be challenging.',
      'It can be difficult to secure funding for the second phase until the first is complete.'
    ],
    checklist: {
      sampling: 'Phase 1 involves purposive sampling for in-depth qualitative exploration. Phase 2 involves a different, often larger sample selected to be representative for quantitative testing.',
      dataCollection: 'Phase 1: Qualitative data collection (e.g., interviews). Phase 2: Quantitative data collection using an instrument or variables developed from the qualitative findings.',
      analysis: 'Qualitative data is analyzed to identify themes, which then inform the development of quantitative instruments or variables. The quantitative data is then analyzed, and results from both phases are integrated.',
      ethics: 'Separate informed consent may be needed for each phase due to the different samples and procedures.'
    },
    references: [
      'Creswell, J. W., & Plano Clark, V. L. (2017). *Designing and conducting mixed methods research* (3rd ed.). Sage publications.'
    ],
    wordingGuidance: mixedMethodsWording,
    visualization: {
      nodes: [
        { id: 'start', label: 'qual Data Collection & Analysis', type: 'start' },
        { id: 'build', label: 'Use qual Findings to Build Instrument/Theory', type: 'process' },
        { id: 'quan', label: 'QUAN Data Collection & Analysis', type: 'process' },
        { id: 'interpret', label: 'Interpret QUAN Results', type: 'end' },
      ],
      links: [
        { source: 'start', target: 'build' },
        { source: 'build', target: 'quan', label: 'Informs' },
        { source: 'quan', target: 'interpret' },
      ]
    }
  }
];


export const GLOSSARY_TERMS: GlossaryTerm[] = [
  { term: 'Attrition', definition: 'The loss of participants during the course of a study. This can be a significant threat to the validity of research, especially in longitudinal studies.' },
  { term: 'Bracketing', definition: 'A process used in phenomenological research where the researcher attempts to set aside their own pre-suppositions, biases, and experiences to see the phenomenon from the perspective of the participants.' },
  { term: 'Confounding Variable', definition: 'An "extra" variable that you didn’t account for that can skew your results by being related to both the independent and dependent variables.' },
  { term: 'Dependent Variable', definition: 'The variable being tested and measured in a scientific experiment.' },
  { term: 'Design & Development Research (DDR)', definition: 'A pragmatic research methodology focused on the systematic creation and evaluation of educational products and processes, moving through phases like analysis, design, development, and evaluation.' },
  { term: 'Design-Based Research (DBR)', definition: 'A research methodology focused on developing theory through iterative cycles of designing, testing, and redesigning educational interventions in real-world settings.' },
  { term: 'External Validity', definition: 'The extent to which the results of a study can be generalized to other situations and to other people.' },
  { term: 'Generalizability', definition: 'The extent to which findings and conclusions from a study conducted on a sample population can be applied to the population at large. Closely related to external validity.' },
  { term: 'Independent Variable', definition: 'The variable that is changed or controlled in a scientific experiment to test the effects on the dependent variable.' },
  { term: 'Internal Validity', definition: 'The degree of confidence that the causal relationship being tested is trustworthy and not influenced by other factors or variables.' },
  { term: 'Mixed-Methods Research', definition: 'An approach that combines or associates both qualitative and quantitative forms of research. It involves philosophical assumptions, the use of qualitative and quantitative approaches, and the mixing of both approaches in a study.' },
  { term: 'Multilevel Modeling', definition: 'A statistical technique used for data that has a hierarchical or nested structure (e.g., students nested within classrooms, which are nested within schools). It allows researchers to account for the dependencies in the data.' },
  { term: 'Non-probability Sampling', definition: 'A sampling technique where individuals are selected based on non-random criteria, and not every individual has a chance of being included. Examples include convenience and purposive sampling.' },
  { term: 'Participant Observation', definition: 'A qualitative data collection method, common in ethnography, where the researcher becomes an active participant in the cultural group they are studying to gain a deeper understanding of their routines and rituals.' },
  { term: 'Probability Sampling', definition: 'A sampling technique where every member of the population has a known, non-zero chance of being selected. This method is crucial for ensuring the sample is representative of the population.' },
  { term: 'Purposive Sampling', definition: 'A non-probability sampling technique where researchers select participants based on specific characteristics that are relevant to the research question. Common in qualitative research.' },
  { term: 'Qualitative Research', definition: 'An approach for exploring and understanding the meaning individuals or groups ascribe to a social or human problem. It involves emerging questions and procedures, data typically collected in the participant\'s setting, and the researcher making interpretations of the meaning of the data.' },
  { term: 'Random Assignment', definition: 'The use of chance procedures in experiments to ensure that each participant has the same opportunity to be assigned to any given group. Crucial for establishing causality.' },
  { term: 'Regression Analysis', definition: 'A statistical method used to model the relationship between a dependent variable and one or more independent variables. It is often used for prediction and forecasting.' },
  { term: 'Reliability', definition: 'The degree to which a research method produces stable and consistent results over time.' },
  { term: 'Sampling', definition: 'The process of selecting a representative group from the population under study. The target population is the total group of individuals from which the sample might be drawn.' },
  { term: 'Statistical Significance', definition: 'A determination that a relationship between two or more variables is caused by something other than chance.' },
  { term: 'Theoretical Saturation', definition: 'A concept in grounded theory where researchers continue to collect and analyze data until no new themes or concepts emerge from the data.' },
  { term: 'Triangulation', definition: 'The use of multiple methods, data sources, theories, or investigators to address a research question. It is used to increase the credibility and validity of the research findings.' },
  { term: 'Validity', definition: 'The extent to which a test or measurement tool accurately measures what it is intended to measure.' },
];


export const COMPARISON_ATTRIBUTES: ComparisonAttribute[] = [
  { feature: 'Primary Goal', rct: 'Establish cause-and-effect', quasi: 'Estimate a causal relationship', correlational: 'Identify relationships between variables' },
  { feature: 'Random Assignment', rct: 'Yes', quasi: 'No', correlational: 'No' },
  { feature: 'Internal Validity', rct: 'High', quasi: 'Moderate', correlational: 'Low' },
  { feature: 'External Validity', rct: 'Can be low', quasi: 'Often higher than RCTs', correlational: 'Varies' },
  { feature: 'Control over Variables', rct: 'High', quasi: 'Moderate', correlational: 'Low' },
  { feature: 'Cost & Complexity', rct: 'Often high', quasi: 'Moderate', correlational: 'Often lower' }
];