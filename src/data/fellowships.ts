import { FellowshipProgram } from '../types';

export const FELLOWSHIP_DISCLAIMER_TEXT =
  'UNSP International Research Fellowship is a privately administered research fellowship programme open to eligible applicants worldwide. It is not, by itself, a university degree, government qualification or government-accredited academic award. Applicants should independently verify recognition requirements applicable in their country, institution or profession.';

export const FELLOWSHIPS: FellowshipProgram[] = [
  {
    id: 'fel-1',
    slug: 'human-rights-international-law',
    title: 'Human Rights & International Law',
    tagline: 'Advancing Universal Legal Protections, Treaty Frameworks & Humanitarian Jurisprudence',
    overview:
      'The UNSP International Research Fellowship in Human Rights & International Law provides a rigorous academic platform for scholars, legal professionals, and policy analysts to investigate contemporary international law, transnational human rights enforcement, and evolving treaty obligations.',
    researchAreas: [
      'International Humanitarian Law and Armed Conflict Protocols',
      'Transnational Judicial Enforcement & Regional Human Rights Courts',
      'Digital Rights, Algorithmic Surveillance, and Privacy Jurisprudence',
      'Indigenous Rights, Self-Determination, and Customary International Law',
      'State Responsibility and Corporate Accountability in Global Supply Chains'
    ],
    learningOutcomes: [
      'Master comparative legal analysis of international human rights conventions and regional protocols.',
      'Formulate original peer-grade legal research on cross-border enforcement deficits.',
      'Develop evidence-based policy papers and judicial brief frameworks suitable for transnational circulation.'
    ],
    eligibility: [
      'Bachelor’s degree or equivalent in Law, International Relations, Political Science, or related humanities disciplines.',
      'Demonstrated academic or professional background in human rights research or legal advocacy.',
      'Proficiency in academic English for scholarly reading and monograph drafting.'
    ],
    duration: '24 Weeks (6 Months structured international research fellowship)',
    researchMethodology: [
      'Doctrinal and Non-Doctrinal Comparative Legal Research',
      'Case Jurisprudence Analysis across ICC, ICJ, and Regional Human Rights Tribunals',
      'Normative Treaty Evaluation & State Compliance Tracking'
    ],
    programmeStructure: [
      { phase: 'Phase 1: Foundations & Proposal', duration: 'Weeks 1–4', focus: 'Epistemology of International Law & Proposal Formalization' },
      { phase: 'Phase 2: Jurisprudential Deep-Dive', duration: 'Weeks 5–12', focus: 'Comparative Legal Mapping & Case-Law Synthesis' },
      { phase: 'Phase 3: Empirical Draft & Review', duration: 'Weeks 13–18', focus: 'Working Paper Drafting & Mentor Milestone Review' },
      { phase: 'Phase 4: Defense & Submission', duration: 'Weeks 19–24', focus: 'Final Monograph Revision, Peer Review & Evaluation' }
    ],
    coreModules: [
      'Foundations of Public International Law & Treaty Interpretation',
      'Universal Declaration & Core International Human Rights Instruments',
      'Transnational Dispute Resolution & International Courts Procedure',
      'Research Ethics & Legal Scholarly Methodology'
    ],
    specialisedResearchModule:
      'Advanced Seminar in Contemporary International Law: Digital Surveillance, Statelessness & International Humanitarian Norms',
    researchProject: {
      description: 'An independent, supervised research monograph addressing a pressing legal or human rights challenge with policy recommendations.',
      deliverables: ['Formal Research Proposal', 'Comparative Literature & Case Review', 'Final Research Monograph (8,000–12,000 words)', 'Executive Policy Summary'],
      wordCountTarget: '8,000 – 12,000 words'
    },
    mentorship: 'Supervised milestone consultations with international legal scholars and human rights practitioners.',
    evaluation: {
      criteria: [
        'Methodological Rigor & Doctrinal Soundness (35%)',
        'Originality of Legal Argument & Problem Solving (30%)',
        'Clarity, Structure & Academic Referencing (20%)',
        'Milestone Adherence & Supervised Feedback Integration (15%)'
      ],
      passingGrade: 'Satisfactory completion of all deliverables with 70% aggregate evaluation score.'
    },
    certificateDetails: 'Fellowship Completion Certificate verifying individual research monograph completion under UNSP University International Research Fellowship guidelines.',
    fee: '₹1,50,000',
    faq: [
      {
        question: 'Is this fellowship equivalent to an LL.M. or university degree?',
        answer: 'No. UNSP International Research Fellowship is a privately administered research fellowship programme. It is not an LL.M., Ph.D., or government-accredited university degree.'
      },
      {
        question: 'Can legal practitioners use this fellowship for continuing academic research?',
        answer: 'Yes. The fellowship is designed to support independent scholarly research, publication drafting, and professional policy development.'
      }
    ],
    disclaimer: FELLOWSHIP_DISCLAIMER_TEXT
  },
  {
    id: 'fel-2',
    slug: 'artificial-intelligence-data-science',
    title: 'Artificial Intelligence & Data Science',
    tagline: 'Investigating Foundational Models, Algorithmic Fairness, Scalable Architectures & Data Governance',
    overview:
      'The UNSP International Research Fellowship in Artificial Intelligence & Data Science offers an intensive environment for researchers exploring generative architectures, algorithmic accountability, ethical AI safety frameworks, and scalable machine learning workflows.',
    researchAreas: [
      'Generative Foundation Models & Multimodal Reasoning Systems',
      'Algorithmic Fairness, Bias Mitigation, and Explainable AI (XAI)',
      'Data Privacy, Federated Learning, and Differential Privacy',
      'AI Governance, Regulatory Sandboxes, and International Compliance',
      'Domain-Specific AI Applications in Healthcare, Agriculture & Scientific Discovery'
    ],
    learningOutcomes: [
      'Evaluate cutting-edge machine learning model architectures and statistical validation protocols.',
      'Design reproducible empirical experiments addressing algorithmic transparency or architectural performance.',
      'Produce an academic-standard research paper complete with methodology, ablation studies, and ethics disclosures.'
    ],
    eligibility: [
      'Degree in Computer Science, Data Science, Mathematics, Statistics, Engineering, or demonstrable research background in quantitative computing.',
      'Working knowledge of statistical modeling, machine learning concepts, or data architectures.',
      'Commitment to research ethics and reproducible methodology.'
    ],
    duration: '24 Weeks (6 Months structured international research fellowship)',
    researchMethodology: [
      'Empirical Quantitative Benchmarking & Model Ablation Testing',
      'Statistical Rigor and Cross-Validation Frameworks',
      'Computational Ethics & Algorithmic Audit Frameworks'
    ],
    programmeStructure: [
      { phase: 'Phase 1: Architecture & Hypothesis', duration: 'Weeks 1–4', focus: 'Mathematical Foundations, Literature Gap Analysis & Hypothesis Design' },
      { phase: 'Phase 2: Data Pipeline & Modeling', duration: 'Weeks 5–12', focus: 'Experimental Setup, Data Validation & Computational Modeling' },
      { phase: 'Phase 3: Validation & Synthesis', duration: 'Weeks 13–18', focus: 'Benchmarking, Statistical Analysis & First Draft Synthesis' },
      { phase: 'Phase 4: Peer Review & Final Defense', duration: 'Weeks 19–24', focus: 'Methodological Audit, Code/Data Documentation & Final Monograph' }
    ],
    coreModules: [
      'Mathematical Foundations of Deep Learning & Statistical Inference',
      'Modern Transformer & Neural Architectures',
      'Algorithmic Ethics, Responsible AI & Data Governance',
      'Advanced Research Methodology & Computational Reproducibility'
    ],
    specialisedResearchModule:
      'Advanced Seminar in AI Frontiers: Safety Alignments, Federated Systems & Neuro-Symbolic Computing',
    researchProject: {
      description: 'Supervised empirical or theoretical research project on a defined problem in machine intelligence or data governance.',
      deliverables: ['Research Hypothesis & Methodological Plan', 'Reproducibility & Dataset Documentation', 'Research Manuscript (8,000–12,000 words)', 'Code/Data Repository Archive'],
      wordCountTarget: '8,000 – 12,000 words'
    },
    mentorship: 'Guidance and structured reviews from senior research scientists and computational methodologists.',
    evaluation: {
      criteria: [
        'Scientific Rigor, Experimental Validity & Mathematical Soundness (35%)',
        'Innovation & Contribution to the Field (30%)',
        'Reproducibility, Documentation & Code Integrity (20%)',
        'Academic Presentation & Scholarly Writing (15%)'
      ],
      passingGrade: 'Satisfactory completion with 70% aggregate score.'
    },
    certificateDetails: 'Official Certificate of Research Fellowship in Artificial Intelligence & Data Science.',
    fee: '₹1,50,000',
    faq: [
      {
        question: 'Do I need access to supercomputing clusters?',
        answer: 'Fellows may pursue theoretical, algorithmic, or experimental research calibrated to accessible compute or open-source research platforms.'
      },
      {
        question: 'Is this an introductory programming course?',
        answer: 'No. This is an advanced international research fellowship for independent investigation, not a coding bootcamp.'
      }
    ],
    disclaimer: FELLOWSHIP_DISCLAIMER_TEXT
  },
  {
    id: 'fel-3',
    slug: 'quantum-computing-technologies',
    title: 'Quantum Computing & Technologies',
    tagline: 'Exploring Quantum Algorithms, Qubit Physics, Post-Quantum Cryptography & Quantum Information',
    overview:
      'The UNSP International Research Fellowship in Quantum Computing & Technologies prepares fellows to undertake high-level investigation into quantum circuits, NISQ-era algorithms, topological qubits, and quantum communication protocols.',
    researchAreas: [
      'Quantum Algorithms (VQE, QAOA, Shor & Grover Variants)',
      'Post-Quantum Cryptography & Lattice-Based Security Protocols',
      'Quantum Sensing, Metrology, and Diamond Nitrogen-Vacancy Centers',
      'Quantum Information Theory and Entanglement Characterization',
      'Fault-Tolerant Quantum Architecture & Error Correction Codes'
    ],
    learningOutcomes: [
      'Understand mathematical formulations of Hilbert spaces, quantum gates, and error mitigation.',
      'Formulate research into quantum circuit optimization and algorithmic complexity bounds.',
      'Produce comprehensive research addressing post-quantum transition or quantum simulation.'
    ],
    eligibility: [
      'Background in Physics, Mathematics, Computer Science, Electrical Engineering, or related quantum sciences.',
      'Familiarity with linear algebra and basic quantum mechanics or quantum circuit theory.'
    ],
    duration: '24 Weeks (6 Months structured international research fellowship)',
    researchMethodology: [
      'Analytical Quantum Formalism & Operator Mechanics',
      'Open-Source Quantum Circuit Simulation (Qiskit/Cirq/PennyLane)',
      'Mathematical Verification of Quantum Error Thresholds'
    ],
    programmeStructure: [
      { phase: 'Phase 1: Quantum Foundations', duration: 'Weeks 1–4', focus: 'Quantum States, Tensor Products & Problem Formalization' },
      { phase: 'Phase 2: Algorithmic Modeling', duration: 'Weeks 5–12', focus: 'Circuit Simulation, Complexity Bounds & Noise Modeling' },
      { phase: 'Phase 3: Formal Analysis', duration: 'Weeks 13–18', focus: 'Error Mitigation Proofs & Draft Manuscript Preparation' },
      { phase: 'Phase 4: Synthesis & Submission', duration: 'Weeks 19–24', focus: 'Final Research Paper Review, Code Validation & Evaluation' }
    ],
    coreModules: [
      'Mathematical Principles of Quantum Information Theory',
      'Quantum Circuit Design, Gates & Decoherence Mechanisms',
      'Post-Quantum Cryptographic Protocols & Standards',
      'Quantum Research Methodologies & Theoretical Proofs'
    ],
    specialisedResearchModule:
      'Advanced Seminar in Quantum Hardware Paradigms: Superconducting Circuits, Trapped Ions & Neutral Atoms',
    researchProject: {
      description: 'Independent research study focusing on quantum algorithm design, post-quantum protocols, or error mitigation modeling.',
      deliverables: ['Problem Formulation & Quantum Circuit Design', 'Simulation Scripts / Mathematical Proofs', 'Final Monograph (8,000–12,000 words)'],
      wordCountTarget: '8,000 – 12,000 words'
    },
    mentorship: 'Regular review from researchers in quantum physics, applied mathematics, and cryptography.',
    evaluation: {
      criteria: [
        'Theoretical Rigor & Mathematical Accuracy (35%)',
        'Methodological Soundness of Simulations/Proofs (30%)',
        'Clarity of Scientific Exposition (20%)',
        'Milestone Delivery & Feedback Execution (15%)'
      ],
      passingGrade: 'Satisfactory completion with 70% threshold.'
    },
    certificateDetails: 'Official Certificate of Research Fellowship in Quantum Computing & Technologies.',
    fee: '₹1,50,000',
    faq: [
      {
        question: 'Can theoretical papers without hardware runs be submitted?',
        answer: 'Yes. Theoretical proofs, algorithmic analyses, and noise simulations on quantum simulators are standard deliverables.'
      }
    ],
    disclaimer: FELLOWSHIP_DISCLAIMER_TEXT
  },
  {
    id: 'fel-4',
    slug: 'sustainable-development-goals',
    title: 'Sustainable Development Goals',
    tagline: 'Analyzing Multilateral Agendas, Systemic Interventions & Socio-Ecological Metrics',
    overview:
      'The UNSP International Research Fellowship in Sustainable Development Goals focuses on cross-sectoral analysis of the 2030 Agenda, circular economy transitions, equitable resource allocation, and empirical monitoring of sustainability targets.',
    researchAreas: [
      'Interlinkages and Trade-Offs Across the 17 SDG Indicators',
      'Circular Economy Paradigms and Industrial Ecology',
      'Renewable Energy Transition in Emerging Economies',
      'Sustainable Urban Planning, Clean Water, and Resilient Infrastructure',
      'Financing the Transition: ESG Frameworks and Green Bonds'
    ],
    learningOutcomes: [
      'Apply systemic methodologies to assess SDG implementation challenges.',
      'Evaluate localized empirical datasets against international sustainability indices.',
      'Produce policy recommendations tailored to multilateral and municipal governance.'
    ],
    eligibility: [
      'Background in Sustainability Studies, Economics, Environmental Science, Public Policy, Development Studies, or Social Sciences.',
      'Commitment to rigorous interdisciplinary research.'
    ],
    duration: '24 Weeks (6 Months structured international research fellowship)',
    researchMethodology: [
      'Mixed-Methods Socio-Ecological Impact Assessment',
      'Cross-Indicator Matrix Modeling & Policy Coherence Analysis',
      'Quantitative Indicator Tracking & Geospatial Analysis'
    ],
    programmeStructure: [
      { phase: 'Phase 1: Conceptual Framing', duration: 'Weeks 1–4', focus: 'Systems Thinking, SDG Frameworks & Topic Definition' },
      { phase: 'Phase 2: Empirical Data Collection', duration: 'Weeks 5–12', focus: 'Policy Analysis, Dataset Compilation & Case Mapping' },
      { phase: 'Phase 3: Impact Assessment', duration: 'Weeks 13–18', focus: 'Cross-Indicator Synthesis & Monograph Drafting' },
      { phase: 'Phase 4: Synthesis & Submission', duration: 'Weeks 19–24', focus: 'Actionable Framework Finalization & Final Submission' }
    ],
    coreModules: [
      'History and Philosophy of Global Development Frameworks',
      'Quantitative Metrics, Indicators & SDG Tracking Systems',
      'Policy Coherence, Trade-Offs & Institutional Governance',
      'Interdisciplinary Research Design for Sustainability'
    ],
    specialisedResearchModule:
      'Advanced Seminar in Socio-Ecological Resilience, Circular Economics & Global Resource Governance',
    researchProject: {
      description: 'An empirical or policy-oriented research study examining a specific SDG challenge with validated metrics and scalable recommendations.',
      deliverables: ['Research Scope Document', 'Indicator & Data Synthesis Matrix', 'Final Research Monograph (8,000–12,000 words)', 'Policy Brief'],
      wordCountTarget: '8,000 – 12,000 words'
    },
    mentorship: 'Advisory guidance from development economists and environmental policy researchers.',
    evaluation: {
      criteria: [
        'Methodological Integrity & Systems Approach (35%)',
        'Depth of Evidence & Policy Relevance (30%)',
        'Academic Structure & Scholarly Prose (20%)',
        'Review Iterations & Advisory Responsiveness (15%)'
      ],
      passingGrade: 'Satisfactory completion with 70% aggregate score.'
    },
    certificateDetails: 'Official Certificate of Research Fellowship in Sustainable Development Goals.',
    fee: '₹1,50,000',
    faq: [
      {
        question: 'Does this programme claim official UN affiliation?',
        answer: 'No. UNSP International Research Fellowship is an independent, privately administered research programme studying the Sustainable Development Goals academic discipline.'
      }
    ],
    disclaimer: FELLOWSHIP_DISCLAIMER_TEXT
  },
  {
    id: 'fel-5',
    slug: 'climate-change-environmental-science',
    title: 'Climate Change & Environmental Science',
    tagline: 'Investigating Atmospheric Dynamics, Decarbonisation Models & Ecological Resilience',
    overview:
      'The UNSP International Research Fellowship in Climate Change & Environmental Science brings together researchers studying climate feedback loops, atmospheric modeling, biodiversity conservation, and technical decarbonization pathways.',
    researchAreas: [
      'Climate Attribution Science, Modeling, and Extreme Event Projections',
      'Ocean Acidification, Coastal Ecosystems, and Coral Bleaching',
      'Carbon Capture, Storage & Direct Air Capture Technology Assessments',
      'Deforestation, Land-Use Transition, and Terrestrial Carbon Sinks',
      'Environmental Risk Assessment, Climate Adaptation & Urban Heat Islands'
    ],
    learningOutcomes: [
      'Synthesize peer-reviewed climate data from IPCC databases and meteorological observational records.',
      'Conduct rigorous environmental impact and carbon balance modeling.',
      'Produce an authoritative scientific research report with actionable ecological insights.'
    ],
    eligibility: [
      'Degree in Environmental Science, Meteorology, Climatology, Chemistry, Biology, Civil/Environmental Engineering, or related sciences.',
      'Analytical mindset and foundation in scientific methodology.'
    ],
    duration: '24 Weeks (6 Months structured international research fellowship)',
    researchMethodology: [
      'Geospatial Remote Sensing Analysis & Satellite Data Verification',
      'Statistical Time-Series Analysis of Meteorological and Ecological Data',
      'Life Cycle Assessment (LCA) & Carbon Footprint Methodologies'
    ],
    programmeStructure: [
      { phase: 'Phase 1: Problem Definition', duration: 'Weeks 1–4', focus: 'Climate Drivers, Data Sources & Research Scope' },
      { phase: 'Phase 2: Empirical Modeling', duration: 'Weeks 5–12', focus: 'Dataset Processing, Environmental Modeling & Parameter Testing' },
      { phase: 'Phase 3: Scientific Synthesis', duration: 'Weeks 13–18', focus: 'Uncertainty Quantification & Monograph First Draft' },
      { phase: 'Phase 4: Scientific Review', duration: 'Weeks 19–24', focus: 'Peer Feedback Integration & Final Monograph Submission' }
    ],
    coreModules: [
      'Atmospheric Physics & Planetary Climate Dynamics',
      'Environmental Data Analytics & Remote Sensing Methods',
      'Carbon Budgets, Decarbonization Pathways & Energy Transition',
      'Scientific Research Writing, Peer Review & Dissemination'
    ],
    specialisedResearchModule:
      'Advanced Seminar in Planetary Boundaries, Ecological Tipping Points & Climate Mitigation Modeling',
    researchProject: {
      description: 'Comprehensive research monograph analyzing an urgent climate science question with empirical or modeled data.',
      deliverables: ['Scientific Proposal & Data Source Plan', 'Analytical Model/Data Synthesis', 'Research Monograph (8,000–12,000 words)', 'Graphical Summary'],
      wordCountTarget: '8,000 – 12,000 words'
    },
    mentorship: 'Structured supervision by environmental scientists and climate researchers.',
    evaluation: {
      criteria: [
        'Scientific Precision & Methodological Validity (35%)',
        'Data Quality & Uncertainty Analysis (30%)',
        'Scholarly Composition & Referencing (20%)',
        'Milestone Completion (15%)'
      ],
      passingGrade: '70% overall pass threshold.'
    },
    certificateDetails: 'Official Certificate of Research Fellowship in Climate Change & Environmental Science.',
    fee: '₹1,50,000',
    faq: [
      {
        question: 'Can fellows study regional or localized climate challenges?',
        answer: 'Yes. Localized watershed, urban heat island, and regional agricultural climate vulnerability analyses are encouraged.'
      }
    ],
    disclaimer: FELLOWSHIP_DISCLAIMER_TEXT
  },
  {
    id: 'fel-6',
    slug: 'global-public-health',
    title: 'Global Public Health',
    tagline: 'Analyzing Epidemiology, Pandemic Preparedness, Health Equity & Biosecurity',
    overview:
      'The UNSP International Research Fellowship in Global Public Health equips scholars and healthcare practitioners to conduct deep epidemiological analysis, examine health systems resilience, and model interventions for non-communicable and infectious diseases.',
    researchAreas: [
      'Infectious Disease Surveillance and Global Pandemic Preparedness',
      'Social Determinants of Health and Structural Health Inequities',
      'Antimicrobial Resistance (AMR) Pathways and One Health Protocols',
      'Health Informatics, Digital Health Interventions, and Telemedicine',
      'Health Economics, Universal Health Coverage, and Supply Chain Resilience'
    ],
    learningOutcomes: [
      'Apply epidemiological methods and health systems frameworks to systemic disease burdens.',
      'Analyze multinational health data and clinical policy interventions.',
      'Draft an evidence-based public health research monograph and policy memorandum.'
    ],
    eligibility: [
      'Background in Public Health, Medicine, Nursing, Pharmacy, Epidemiology, Biology, Health Policy, or Social Sciences.',
      'Interest in scientific health research and global epidemiology.'
    ],
    duration: '24 Weeks (6 Months structured international research fellowship)',
    researchMethodology: [
      'Systematic Literature Reviews & Meta-Analytic Synthesis',
      'Epidemiological Risk Ratio Modeling & Cohort Data Analysis',
      'Qualitative Health Policy Evaluation'
    ],
    programmeStructure: [
      { phase: 'Phase 1: Epidemiological Scope', duration: 'Weeks 1–4', focus: 'Burden of Disease Analysis & Proposal Protocol' },
      { phase: 'Phase 2: Systematic Synthesis', duration: 'Weeks 5–12', focus: 'Epidemiological Data Extraction & Comparative Analysis' },
      { phase: 'Phase 3: Policy Translation', duration: 'Weeks 13–18', focus: 'Intervention Modeling & Research Draft' },
      { phase: 'Phase 4: Final Evaluation', duration: 'Weeks 19–24', focus: 'Peer Critique, Revisions & Final Submission' }
    ],
    coreModules: [
      'Principles of Global Epidemiology & Biostatistics',
      'Health Systems Architecture, Governance & Financing',
      'One Health, Biosecurity & Emerging Zoonotic Threats',
      'Public Health Research Ethics & Systematic Review Protocols'
    ],
    specialisedResearchModule:
      'Advanced Seminar in Pandemic Resilience, AMR Mitigation & Cross-Border Health Security',
    researchProject: {
      description: 'Supervised public health study examining an epidemiological burden or systemic healthcare delivery challenge.',
      deliverables: ['Study Protocol & Ethical Clearance Declaration', 'Systematic Literature & Data Synthesis', 'Research Monograph (8,000–12,000 words)', 'Executive Health Brief'],
      wordCountTarget: '8,000 – 12,000 words'
    },
    mentorship: 'Mentorship by epidemiologists, public health scholars, and clinical researchers.',
    evaluation: {
      criteria: [
        'Methodological Soundness & Evidence Strength (35%)',
        'Epidemiological Argument & Public Health Impact (30%)',
        'Academic Writing, Accuracy & Citation (20%)',
        'Milestone Adherence (15%)'
      ],
      passingGrade: '70% aggregate grade.'
    },
    certificateDetails: 'Official Certificate of Research Fellowship in Global Public Health.',
    fee: '₹1,50,000',
    faq: [
      {
        question: 'Is this a clinical medical license or clinical credential?',
        answer: 'No. This is a non-clinical academic research fellowship focusing on public health policy, epidemiology, and health systems research.'
      }
    ],
    disclaimer: FELLOWSHIP_DISCLAIMER_TEXT
  },
  {
    id: 'fel-7',
    slug: 'space-science-technology-policy',
    title: 'Space Science, Technology & Policy',
    tagline: 'Researching Orbital Mechanics, Space Law, Planetary Exploration & Commercial Spaceflight',
    overview:
      'The UNSP International Research Fellowship in Space Science, Technology & Policy explores the convergence of aerospace engineering, lunar/Mars exploration missions, orbital space debris mitigation, and international space governance treaties.',
    researchAreas: [
      'Orbital Debris Mitigation, Active Debris Removal, and Space Situational Awareness (SSA)',
      'The Artemis Accords, Outer Space Treaty Jurisprudence, and Resource Rights',
      'SmallSat Constellations, CubeSats, and Low Earth Orbit (LEO) Megaconstellations',
      'In-Situ Resource Utilization (ISRU) for Lunar and Deep Space Missions',
      'Commercial Space Station Architecture and Space Tourism Regulation'
    ],
    learningOutcomes: [
      'Evaluate orbital mechanics principles and space policy frameworks.',
      'Analyze the interplay between commercial aerospace innovation and multilateral space treaties.',
      'Produce an authoritative space science or space policy research paper.'
    ],
    eligibility: [
      'Background in Aerospace/Mechanical/Electrical Engineering, Physics, International Law, Public Policy, Astronomy, or related fields.',
      'Strong analytical interest in the space economy and scientific exploration.'
    ],
    duration: '24 Weeks (6 Months structured international research fellowship)',
    researchMethodology: [
      'Trajectory & Orbital Mechanics Modeling',
      'Treaty Textual Analysis & Comparative Outer Space Jurisprudence',
      'Aerospace Systems Engineering Trade Studies'
    ],
    programmeStructure: [
      { phase: 'Phase 1: Mission / Policy Framing', duration: 'Weeks 1–4', focus: 'Problem Definition in Space Tech or International Space Law' },
      { phase: 'Phase 2: Technical & Legal Analysis', duration: 'Weeks 5–12', focus: 'Analytical Modeling & Space Governance Mapping' },
      { phase: 'Phase 3: Synthesis & Draft', duration: 'Weeks 13–18', focus: 'Comprehensive Monograph Drafting & Advisory Feedback' },
      { phase: 'Phase 4: Final Review & Submission', duration: 'Weeks 19–24', focus: 'Methodological Polish & Final Research Monograph' }
    ],
    coreModules: [
      'Astrodynamics & Space Mission Architecture Fundamentals',
      'International Space Law, The 1967 Outer Space Treaty & Emerging Accords',
      'The New Space Economy: Commercial Launch, Satellites & Spaceports',
      'Research Methodologies in Space Science and Space Policy'
    ],
    specialisedResearchModule:
      'Advanced Seminar in Planetary Defense, LEO Traffic Management & Deep Space Resource Governance',
    researchProject: {
      description: 'An independent research monograph on a technical or regulatory issue facing space exploration or commercial aerospace.',
      deliverables: ['Mission/Policy Concept Note', 'Analytical Trade Study / Legal Evaluation', 'Final Research Monograph (8,000–12,000 words)'],
      wordCountTarget: '8,000 – 12,000 words'
    },
    mentorship: 'Mentorship by space policy analysts, aerospace researchers, and astrophysicists.',
    evaluation: {
      criteria: [
        'Technical Accuracy / Legal Soundness (35%)',
        'Novelty & Strategic Relevance (30%)',
        'Academic Rigor & Structure (20%)',
        'Milestone Completion (15%)'
      ],
      passingGrade: '70% passing threshold.'
    },
    certificateDetails: 'Official Certificate of Research Fellowship in Space Science, Technology & Policy.',
    fee: '₹1,50,000',
    faq: [
      {
        question: 'Can fellows choose either technical engineering or space policy tracks?',
        answer: 'Yes. Fellows may tailor their research monograph toward technical aerospace solutions, space policy, or hybrid regulatory-technical frameworks.'
      }
    ],
    disclaimer: FELLOWSHIP_DISCLAIMER_TEXT
  },
  {
    id: 'fel-8',
    slug: 'blockchain-fintech-digital-economy',
    title: 'Blockchain, FinTech & Digital Economy',
    tagline: 'Investigating Distributed Ledgers, Central Bank Digital Currencies, DeFi & Digital Assets',
    overview:
      'The UNSP International Research Fellowship in Blockchain, FinTech & Digital Economy investigates distributed ledger consensus mechanisms, smart contract security, tokenomics, CBDC rollout models, and financial market infrastructure modernization.',
    researchAreas: [
      'Central Bank Digital Currencies (CBDCs) and Cross-Border Wholesale Settlement',
      'Decentralized Finance (DeFi) Protocols, Liquidity Pools, and Systemic Risk',
      'Smart Contract Formal Verification and Cryptographic Audit Paradigms',
      'Digital Asset Taxation, Regulatory Sandboxes, and Anti-Money Laundering (AML)',
      'Zero-Knowledge Proofs (ZKPs) and Scalability Solutions (Rollups & Layer-2)'
    ],
    learningOutcomes: [
      'Understand cryptographic foundations of distributed consensus and smart contract architectures.',
      'Analyze financial inclusion, monetary sovereignty, and systemic stability implications of digital assets.',
      'Author a high-standard research monograph containing rigorous market or protocol analysis.'
    ],
    eligibility: [
      'Degree or experience in Economics, Finance, Computer Science, Information Systems, Law, or Business.',
      'Familiarity with distributed ledger fundamentals or contemporary financial systems.'
    ],
    duration: '24 Weeks (6 Months structured international research fellowship)',
    researchMethodology: [
      'On-Chain Data Analytics & Transaction Graph Modeling',
      'Formal Smart Contract Verification & Risk Auditing',
      'Comparative Monetary Policy & Financial Regulation Analysis'
    ],
    programmeStructure: [
      { phase: 'Phase 1: Economic / Technical Scoping', duration: 'Weeks 1–4', focus: 'Protocol Scoping & Research Question Formulation' },
      { phase: 'Phase 2: Protocol / Market Analysis', duration: 'Weeks 5–12', focus: 'On-Chain Data Extraction & Regulatory Mapping' },
      { phase: 'Phase 3: Synthesis & Manuscript', duration: 'Weeks 13–18', focus: 'Empirical Findings & Working Paper Writing' },
      { phase: 'Phase 4: Revision & Completion', duration: 'Weeks 19–24', focus: 'Peer Review Iteration & Final Monograph' }
    ],
    coreModules: [
      'Distributed Systems & Cryptographic Consensus Mechanisms',
      'FinTech Disruption: Payment Rails, Neo-Banking & Open Finance',
      'CBDC Architectures, Monetary Sovereignty & Global Settlement',
      'Methodology for Empirical FinTech & Blockchain Research'
    ],
    specialisedResearchModule:
      'Advanced Seminar in DeFi Governance, Zero-Knowledge Architectures & Digital Asset Regulation',
    researchProject: {
      description: 'Supervised research study analyzing a core technological, economic, or regulatory challenge in blockchain and the digital economy.',
      deliverables: ['Research Hypothesis & Protocol Scope', 'Empirical On-Chain / Market Data Synthesis', 'Final Research Monograph (8,000–12,000 words)'],
      wordCountTarget: '8,000 – 12,000 words'
    },
    mentorship: 'Guidance from FinTech researchers, cryptographic auditors, and monetary economists.',
    evaluation: {
      criteria: [
        'Methodological Soundness & Technical / Economic Accuracy (35%)',
        'Insightful Contribution to Digital Economy Scholarship (30%)',
        'Academic Quality & Citation Integrity (20%)',
        'Milestone Delivery (15%)'
      ],
      passingGrade: '70% passing grade.'
    },
    certificateDetails: 'Official Certificate of Research Fellowship in Blockchain, FinTech & Digital Economy.',
    fee: '₹1,50,000',
    faq: [
      {
        question: 'Does this programme provide financial or investment advice?',
        answer: 'No. UNSP University fellowships are strictly academic research programmes and do not provide trading or investment advice.'
      }
    ],
    disclaimer: FELLOWSHIP_DISCLAIMER_TEXT
  },
  {
    id: 'fel-9',
    slug: 'cybersecurity-digital-governance',
    title: 'Cybersecurity & Digital Governance',
    tagline: 'Analyzing Cyber Sovereignty, Critical Infrastructure Defense & Digital Policy',
    overview:
      'The UNSP International Research Fellowship in Cybersecurity & Digital Governance focuses on threat intelligence frameworks, international cyber warfare norms, zero-trust architectures, and data sovereignty regulations.',
    researchAreas: [
      'Critical National Infrastructure (CNI) Protection & SCADA Vulnerabilities',
      'State-Sponsored Cyber Warfare & The Tallinn Manual Cyber Norms',
      'Zero-Trust Architecture Implementation & Identity Governance',
      'Supply Chain Attack Vectors and Hardware Micro-architectural Flaws',
      'Global Data Governance, Cross-Border Data Flows, and GDPR Enforcement'
    ],
    learningOutcomes: [
      'Analyze threat landscapes, threat modeling taxonomies (MITRE ATT&CK), and attack surfaces.',
      'Critique multi-stakeholder digital governance and cyber diplomacy accords.',
      'Produce an authoritative cybersecurity monograph with technical recommendations.'
    ],
    eligibility: [
      'Background in Cybersecurity, Information Security, Computer Science, Law, Defense Studies, or Public Policy.',
      'Demonstrated interest in cyber defense or digital governance.'
    ],
    duration: '24 Weeks (6 Months structured international research fellowship)',
    researchMethodology: [
      'Threat Modeling & Vulnerability Surface Analysis',
      'Comparative Cyber Law & International Norm Mapping',
      'Incident Post-Mortem & Attack Vector Deconstruction'
    ],
    programmeStructure: [
      { phase: 'Phase 1: Threat Landscape & Scope', duration: 'Weeks 1–4', focus: 'Problem Framing in Cyber Defense or Policy' },
      { phase: 'Phase 2: Technical & Policy Mapping', duration: 'Weeks 5–12', focus: 'Threat Deconstruction & Governance Analysis' },
      { phase: 'Phase 3: Synthesis & First Draft', duration: 'Weeks 13–18', focus: 'Monograph Writing & Mentor Review' },
      { phase: 'Phase 4: Refinement & Submission', duration: 'Weeks 19–24', focus: 'Security Policy Review & Final Submission' }
    ],
    coreModules: [
      'Foundations of Information Security & Cryptographic Controls',
      'International Cyber Law, Attribution & Sovereignty in Cyberspace',
      'Enterprise Cyber Risk Management & Incident Resilience',
      'Cybersecurity Research Methodologies & Responsible Disclosure'
    ],
    specialisedResearchModule:
      'Advanced Seminar in Cyber Warfare, Autonomous Cyber Defense & AI-Driven Threat Vectors',
    researchProject: {
      description: 'Independent research monograph analyzing a strategic cybersecurity threat or governance dilemma.',
      deliverables: ['Research Scope & Threat Assessment Protocol', 'Technical/Policy Analysis Document', 'Final Research Monograph (8,000–12,000 words)'],
      wordCountTarget: '8,000 – 12,000 words'
    },
    mentorship: 'Guidance from security researchers and cyber governance policy analysts.',
    evaluation: {
      criteria: [
        'Technical Rigor & Governance Feasibility (35%)',
        'Critical Analysis & Threat Realism (30%)',
        'Academic Structure & Professional Formatting (20%)',
        'Advisory Progress (15%)'
      ],
      passingGrade: '70% overall pass threshold.'
    },
    certificateDetails: 'Official Certificate of Research Fellowship in Cybersecurity & Digital Governance.',
    fee: '₹1,50,000',
    faq: [
      {
        question: 'Does the fellowship involve offensive hacking or red-team exercises?',
        answer: 'The fellowship focuses on defensive architectural analysis, policy, threat modeling, and defensive research.'
      }
    ],
    disclaimer: FELLOWSHIP_DISCLAIMER_TEXT
  },
  {
    id: 'fel-10',
    slug: 'peace-conflict-international-relations',
    title: 'Peace, Conflict & International Relations',
    tagline: 'Investigating Geopolitics, Disarmament, Mediation & Transnational Diplomacy',
    overview:
      'The UNSP International Research Fellowship in Peace, Conflict & International Relations enables scholars to analyze multi-polar geopolitical friction, peace accords, mediation strategies, and multilateral diplomacy.',
    researchAreas: [
      'Multipolar Geopolitics, Great Power Rivalry, and Regional Alignments',
      'Track-I and Track-II Mediation in Asymmetric Conflicts',
      'Nuclear Non-Proliferation and Strategic Arms Control Treaties',
      'Post-Conflict Reconstruction, Transitional Justice, and Reconciliation',
      'Climate-Induced Migration and Resource Scarcity as Conflict Catalysts'
    ],
    learningOutcomes: [
      'Apply international relations theories (realism, constructivism, liberalism) to contemporary crises.',
      'Critique mediation protocols and peace treaty longevity.',
      'Produce an in-depth geopolitical research monograph and policy briefing.'
    ],
    eligibility: [
      'Degree in International Relations, Political Science, History, Peace & Conflict Studies, Sociology, or related fields.',
      'Strong analytical and scholarly writing capability.'
    ],
    duration: '24 Weeks (6 Months structured international research fellowship)',
    researchMethodology: [
      'Qualitative Case-Study Comparison & Process Tracing',
      'Diplomatic Archival & Treaty Textual Analysis',
      'Conflict Scenario Modeling & Stakeholder Matrix Mapping'
    ],
    programmeStructure: [
      { phase: 'Phase 1: Conflict Analysis & Scoping', duration: 'Weeks 1–4', focus: 'Theoretical Grounding & Proposal Formalization' },
      { phase: 'Phase 2: Case Studies & Empirical Review', duration: 'Weeks 5–12', focus: 'Diplomatic Mapping & Historical Tracing' },
      { phase: 'Phase 3: Strategic Synthesis', duration: 'Weeks 13–18', focus: 'Draft Monograph & Policy Formulation' },
      { phase: 'Phase 4: Revision & Final Defense', duration: 'Weeks 19–24', focus: 'Peer Review, Polish & Final Monograph' }
    ],
    coreModules: [
      'Classical and Contemporary Theories of International Relations',
      'Conflict De-escalation, Negotiation & Multilateral Mediation',
      'International Security, Nuclear Disarmament & Arms Control',
      'Qualitative Methodologies in International Studies'
    ],
    specialisedResearchModule:
      'Advanced Seminar in Emerging Geopolitical Fault Lines, Hybrid Warfare & Transnational Alliances',
    researchProject: {
      description: 'An extensive research monograph examining a contemporary conflict or strategic international diplomatic initiative.',
      deliverables: ['Research Scope & Analytical Framework', 'Comparative Conflict Case Study', 'Final Research Monograph (8,000–12,000 words)', 'Diplomatic Policy Brief'],
      wordCountTarget: '8,000 – 12,000 words'
    },
    mentorship: 'Guidance by researchers in international affairs and peace studies.',
    evaluation: {
      criteria: [
        'Theoretical Nuance & Empirical Evidence (35%)',
        'Strategic Insight & Policy Viability (30%)',
        'Scholarly Composition & Citation (20%)',
        'Milestone Completion (15%)'
      ],
      passingGrade: '70% overall pass threshold.'
    },
    certificateDetails: 'Official Certificate of Research Fellowship in Peace, Conflict & International Relations.',
    fee: '₹1,50,000',
    faq: [
      {
        question: 'Does this programme represent any diplomatic mission or government?',
        answer: 'No. UNSP University is an independent institution offering academic research fellowships without governmental representation.'
      }
    ],
    disclaimer: FELLOWSHIP_DISCLAIMER_TEXT
  },
  {
    id: 'fel-11',
    slug: 'education-innovation-edtech',
    title: 'Education, Innovation & EdTech',
    tagline: 'Evaluating Pedagogical Paradigm Shifts, Learning Analytics & Educational Technologies',
    overview:
      'The UNSP International Research Fellowship in Education, Innovation & EdTech examines cognitive science in digital learning, adaptive educational platforms, curriculum decolonization, and equitable access to educational technologies.',
    researchAreas: [
      'Adaptive AI Tutors and Algorithmic Feedback in Pedagogy',
      'Learning Analytics, Student Retention Modeling, and Privacy in EdTech',
      'Digital Divide, Rural Connectivity, and Low-Bandwidth Educational Tools',
      'Competency-Based Learning Models vs. Traditional Standardized Testing',
      'Decolonizing Higher Education Curricula and Inclusive Open Educational Resources (OER)'
    ],
    learningOutcomes: [
      'Evaluate educational methodologies and modern cognitive science frameworks.',
      'Analyze empirical learning analytics datasets and educational technology interventions.',
      'Formulate a comprehensive research monograph on educational transformation.'
    ],
    eligibility: [
      'Degree in Education, Pedagogy, Instructional Design, Psychology, EdTech, or Social Sciences.',
      'Interest in pedagogical research and education systems improvement.'
    ],
    duration: '24 Weeks (6 Months structured international research fellowship)',
    researchMethodology: [
      'Instructional Design & Educational Action Research',
      'Quantitative Learning Analytics & Cohort Comparison',
      'Comparative Curricular Analysis'
    ],
    programmeStructure: [
      { phase: 'Phase 1: Pedagogical Framework', duration: 'Weeks 1–4', focus: 'Epistemology of Learning & Research Design' },
      { phase: 'Phase 2: EdTech Intervention Mapping', duration: 'Weeks 5–12', focus: 'Curricular Data & Learner Analytics Review' },
      { phase: 'Phase 3: Synthesis & Manuscript', duration: 'Weeks 13–18', focus: 'Evidence-Based Drafting & Mentor Review' },
      { phase: 'Phase 4: Evaluation & Submission', duration: 'Weeks 19–24', focus: 'Final Monograph Polish & Deliverable Review' }
    ],
    coreModules: [
      'Cognitive Psychology & Principles of Modern Learning Science',
      'Emerging Technologies in Education: AI, AR/VR & Adaptive Systems',
      'Curriculum Design, Assessment Theory & Equity in Education',
      'Methodologies in Educational Research & Learning Analytics'
    ],
    specialisedResearchModule:
      'Advanced Seminar in Global Educational Equity, Scalable Learning Ecosystems & Future of Academic Credentials',
    researchProject: {
      description: 'Supervised research monograph investigating a systemic pedagogical question or technological intervention in education.',
      deliverables: ['Educational Research Proposal', 'Literature & Analytical Synthesis', 'Final Research Monograph (8,000–12,000 words)', 'Curricular Recommendations Guide'],
      wordCountTarget: '8,000 – 12,000 words'
    },
    mentorship: 'Consultation with educational researchers and pedagogical specialists.',
    evaluation: {
      criteria: [
        'Pedagogical Rigor & Evidence of Learning Impact (35%)',
        'Innovative Contribution to Educational Theory/Practice (30%)',
        'Academic Style, Documentation & Referencing (20%)',
        'Advisory Progress (15%)'
      ],
      passingGrade: '70% overall pass threshold.'
    },
    certificateDetails: 'Official Certificate of Research Fellowship in Education, Innovation & EdTech.',
    fee: '₹1,50,000',
    faq: [
      {
        question: 'Is this a teacher certification or government teaching license?',
        answer: 'No. This is an advanced international research fellowship for pedagogical scholarship and academic publication, not a teaching license.'
      }
    ],
    disclaimer: FELLOWSHIP_DISCLAIMER_TEXT
  },
  {
    id: 'fel-12',
    slug: 'gender-equality-social-inclusion',
    title: 'Gender Equality & Social Inclusion',
    tagline: 'Researching Intersectional Equity, Institutional Inclusion & Human Rights',
    overview:
      'The UNSP International Research Fellowship in Gender Equality & Social Inclusion provides a scholarly platform to analyze intersectional dynamics, institutional equity policies, disability rights, and socio-economic inclusion mechanisms.',
    researchAreas: [
      'Intersectional Feminist Legal Theory and Institutional Policymaking',
      'Gender-Based Violence Prevention: Comparative Legislative Frameworks',
      'Disability Justice, Universal Design, and Social Protection Floors',
      'Workplace Diversity Metrics, Pay Equity Audits, and Corporate Governance',
      'Marginalized Community Representation in Digital Spaces & Democratic Institutions'
    ],
    learningOutcomes: [
      'Master qualitative and quantitative intersectional research methods.',
      'Critique international conventions on discrimination and inclusion policies.',
      'Draft an academic research monograph offering concrete inclusion frameworks.'
    ],
    eligibility: [
      'Degree in Gender Studies, Sociology, Anthropology, Law, Development Studies, or related fields.',
      'Dedication to rigorous scholarly investigation of social inclusion.'
    ],
    duration: '24 Weeks (6 Months structured international research fellowship)',
    researchMethodology: [
      'Intersectional Qualitative Inquiry & Lived-Experience Synthesis',
      'Comparative Policy & Institutional Audit Analysis',
      'Socio-Economic Inclusion Indicator Mapping'
    ],
    programmeStructure: [
      { phase: 'Phase 1: Conceptual Framework', duration: 'Weeks 1–4', focus: 'Intersectional Epistemology & Proposal Formalization' },
      { phase: 'Phase 2: Policy & Field Review', duration: 'Weeks 5–12', focus: 'Legislative Mapping & Empirical Synthesis' },
      { phase: 'Phase 3: Monograph Drafting', duration: 'Weeks 13–18', focus: 'Writing, Argumentative Rigor & Advisory Reviews' },
      { phase: 'Phase 4: Final Submission', duration: 'Weeks 19–24', focus: 'Monograph Finalization & Deliverable Submission' }
    ],
    coreModules: [
      'Theoretical Foundations of Gender & Intersectional Studies',
      'International Conventions on Elimination of All Forms of Discrimination',
      'Social Inclusion Policies, Disability Justice & Affirmative Frameworks',
      'Ethical Research Methods in Social Inclusion & Human Dignity'
    ],
    specialisedResearchModule:
      'Advanced Seminar in Institutional Inclusion Audits, Digital Equity & Grassroots Community Resilience',
    researchProject: {
      description: 'Supervised research monograph examining a systemic exclusion challenge with validated recommendations.',
      deliverables: ['Research Scope Document', 'Intersectional Literature & Policy Matrix', 'Final Research Monograph (8,000–12,000 words)', 'Executive Policy Recommendations'],
      wordCountTarget: '8,000 – 12,000 words'
    },
    mentorship: 'Guidance from scholars in gender studies, sociology, and social policy.',
    evaluation: {
      criteria: [
        'Intersectional Methodological Rigor (35%)',
        'Depth of Analysis & Real-World Applicability (30%)',
        'Academic Writing Quality & Scholarly Sources (20%)',
        'Milestone Completion (15%)'
      ],
      passingGrade: '70% overall pass threshold.'
    },
    certificateDetails: 'Official Certificate of Research Fellowship in Gender Equality & Social Inclusion.',
    fee: '₹1,50,000',
    faq: [
      {
        question: 'Can fellows study regional community initiatives?',
        answer: 'Yes. Empirical and theoretical research on regional, national, or transnational inclusion programs is encouraged.'
      }
    ],
    disclaimer: FELLOWSHIP_DISCLAIMER_TEXT
  },
  {
    id: 'fel-13',
    slug: 'business-entrepreneurship-sustainable-management',
    title: 'Business, Entrepreneurship & Sustainable Management',
    tagline: 'Analyzing Responsible Corporate Governance, ESG Frameworks & Sustainable Business Models',
    overview:
      'The UNSP International Research Fellowship in Business, Entrepreneurship & Sustainable Management investigates circular business models, corporate sustainability governance, impact venture capital, and ESG reporting standards.',
    researchAreas: [
      'Corporate Sustainability Reporting Directives (CSRD) & Global ESG Audits',
      'Circular Economy Business Models and Closed-Loop Supply Chains',
      'Impact Investing, Social Venture Capital, and Blended Finance Architectures',
      'Ethical Corporate Governance, Stakeholder Capitalism, and Board Accountability',
      'Sustainable Innovation, CleanTech Commercialization, and Scalability'
    ],
    learningOutcomes: [
      'Synthesize empirical corporate financial and sustainability reporting data.',
      'Critique modern strategic management paradigms through an ESG lens.',
      'Produce an authoritative business research monograph suitable for academic or strategic publication.'
    ],
    eligibility: [
      'Degree in Business Administration, Management, Economics, Finance, Commerce, or related disciplines.',
      'Demonstrated interest in sustainable business models or corporate governance.'
    ],
    duration: '24 Weeks (6 Months structured international research fellowship)',
    researchMethodology: [
      'Empirical Financial & Non-Financial Disclosure Analysis',
      'Comparative Strategic Management Case Studies',
      'Econometric Modeling of Corporate Governance Metrics'
    ],
    programmeStructure: [
      { phase: 'Phase 1: Strategic Framing', duration: 'Weeks 1–4', focus: 'Hypothesis Formulation & Proposal Refinement' },
      { phase: 'Phase 2: Corporate & ESG Review', duration: 'Weeks 5–12', focus: 'Financial & Sustainability Disclosure Analysis' },
      { phase: 'Phase 3: Empirical Synthesis', duration: 'Weeks 13–18', focus: 'Monograph Drafting & Advisory Milestone Feedback' },
      { phase: 'Phase 4: Final Monograph Defense', duration: 'Weeks 19–24', focus: 'Peer Review Revisions & Deliverable Submission' }
    ],
    coreModules: [
      'Strategic Management & Sustainable Business Ecosystems',
      'ESG Metrics, Corporate Governance & Non-Financial Disclosures',
      'Impact Entrepreneurship, Venture Incubation & Ethical Finance',
      'Methodologies for Quantitative & Qualitative Business Research'
    ],
    specialisedResearchModule:
      'Advanced Seminar in Decarbonizing Value Chains, Stakeholder Governance & Global Sustainable Finance',
    researchProject: {
      description: 'Supervised research monograph analyzing a strategic sustainable management, venture finance, or corporate governance challenge.',
      deliverables: ['Research Scope & Analytical Model', 'Empirical Case Study & Data Matrix', 'Final Research Monograph (8,000–12,000 words)', 'Strategic Executive Summary'],
      wordCountTarget: '8,000 – 12,000 words'
    },
    mentorship: 'Guidance from professors of management, sustainable finance researchers, and corporate governance scholars.',
    evaluation: {
      criteria: [
        'Methodological Validity & Financial/Strategic Depth (35%)',
        'Originality & Strategic Contribution (30%)',
        'Academic Rigor & Scholarly Composition (20%)',
        'Milestone Delivery (15%)'
      ],
      passingGrade: '70% overall pass threshold.'
    },
    certificateDetails: 'Official Certificate of Research Fellowship in Business, Entrepreneurship & Sustainable Management.',
    fee: '₹1,50,000',
    faq: [
      {
        question: 'Is this an MBA or university management degree?',
        answer: 'No. UNSP International Research Fellowship is a privately administered research fellowship programme focused on advanced scholarly research and publication.'
      }
    ],
    disclaimer: FELLOWSHIP_DISCLAIMER_TEXT
  }
];

export function getFellowshipBySlug(slug: string): FellowshipProgram | undefined {
  return FELLOWSHIPS.find((f) => f.slug === slug);
}

export function getFellowshipById(id: string): FellowshipProgram | undefined {
  return FELLOWSHIPS.find((f) => f.id === id);
}
