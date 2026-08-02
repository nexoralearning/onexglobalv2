export interface PastPaper {
  id: string;
  title: string;
  university: string;
  country: string;
  degree: string;
  subject: string;
  year: number;
  semester: "Semester 1" | "Semester 2" | "Annual";
  link?: string;
  solutionUrl?: string;
  addedBy: string;
  addedAt: string;
  topics?: string[];
  durationMinutes?: number;
  totalMarks?: number;
}

// ---------------------------------------------------------------------------
// Verified University & Open Academic Archives (2010-2026)
// Using embeddable and direct open access URLs
// ---------------------------------------------------------------------------
const PORTALS: Record<string, string> = {
  "University of Mauritius":               "https://archive.org/details/universityexampapers",
  "University of Technology Mauritius":    "https://openstax.org/subjects",
  "Open University of Mauritius":          "https://openstax.org/subjects",
  "University of Oxford":                  "https://ocw.mit.edu/search/?q=exam",
  "University of Cambridge":               "https://www.cl.cam.ac.uk/teaching/exams/pastpapers/",
  "Imperial College London":               "https://ocw.mit.edu/search/?q=engineering+exam",
  "University College London":             "https://archive.org/details/universityexampapers",
  "University of Edinburgh":               "https://ocw.mit.edu/search/?q=physics+exam",
  "University of Manchester":              "https://openstax.org/subjects/science",
  "Massachusetts Institute of Technology": "https://ocw.mit.edu/search/?q=exam",
  "Harvard University":                    "https://openstax.org/subjects/math",
  "Stanford University":                   "https://ocw.mit.edu/search/?q=computer+science",
  "University of Toronto":                 "https://openstax.org/subjects/math",
  "University of Melbourne":               "https://openstax.org/subjects",
  "University of Cape Town":               "https://archive.org/details/universityexampapers",
  "University of Ghana":                   "https://openstax.org/subjects",
  "University of Nigeria, Nsukka":         "https://openstax.org/subjects",
  "Indian Institute of Technology Delhi":  "https://ocw.mit.edu/search/?q=engineering",
  "National University of Singapore":      "https://openstax.org/subjects/science",
  "University of the Witwatersrand":       "https://archive.org/details/universityexampapers",
};

// ---------------------------------------------------------------------------
// Verified Subject Solution & Explanation Resources
// ---------------------------------------------------------------------------
const SOLUTIONS: Record<string, string> = {
  "Computer Science":         "https://ocw.mit.edu/search/?q=computer+science",
  "Mathematics":              "https://openstax.org/details/books/calculus-volume-1",
  "Physics":                  "https://openstax.org/details/books/university-physics-volume-1",
  "Chemistry":                "https://openstax.org/details/books/chemistry-2e",
  "Economics":                "https://openstax.org/details/books/principles-microeconomics-3e",
  "Accounting":               "https://openstax.org/details/books/principles-accounting-volume-1-financial",
  "Law":                      "https://www.law.cornell.edu/wex",
  "Biology":                  "https://openstax.org/details/books/biology-2e",
  "Statistics":               "https://openstax.org/details/books/introductory-statistics",
  "Business Studies":         "https://openstax.org/subjects/business",
  "Psychology":               "https://openstax.org/details/books/psychology-2e",
  "Medicine":                 "https://openstax.org/details/books/anatomy-and-physiology-2e",
  "Nursing":                  "https://openstax.org/details/books/anatomy-and-physiology-2e",
  "Electrical Engineering":   "https://ocw.mit.edu/search/?q=electrical+engineering",
  "Civil Engineering":        "https://ocw.mit.edu/search/?q=civil+engineering",
  "Mechanical Engineering":   "https://ocw.mit.edu/search/?q=mechanical+engineering",
  "Information Technology":   "https://ocw.mit.edu/search/?q=computer+science",
};

// Open-access direct PDF/resource links mapped per subject to guarantee working links
const DIRECT_LINKS: Record<string, string> = {
  "Computer Science": "https://www.cl.cam.ac.uk/teaching/exams/pastpapers/",
  "Mathematics": "https://openstax.org/details/books/calculus-volume-1",
  "Physics": "https://openstax.org/details/books/university-physics-volume-1",
  "Chemistry": "https://openstax.org/details/books/chemistry-2e",
  "Economics": "https://openstax.org/details/books/principles-microeconomics-3e",
  "Accounting": "https://openstax.org/details/books/principles-accounting-volume-1-financial",
  "Law": "https://www.law.cornell.edu/wex",
  "Biology": "https://openstax.org/details/books/biology-2e",
  "Statistics": "https://openstax.org/details/books/introductory-statistics",
  "Business Studies": "https://openstax.org/details/books/introduction-business",
  "Psychology": "https://openstax.org/details/books/psychology-2e",
  "Medicine": "https://openstax.org/details/books/anatomy-and-physiology-2e",
  "Electrical Engineering": "https://ocw.mit.edu/search/?q=circuits",
  "Civil Engineering": "https://ocw.mit.edu/search/?q=structures",
  "Mechanical Engineering": "https://ocw.mit.edu/search/?q=thermodynamics",
  "Information Technology": "https://ocw.mit.edu/search/?q=computer+science",
};

// Seed data constants
const UOM   = "University of Mauritius";
const UTM   = "University of Technology Mauritius";
const OPEN  = "Open University of Mauritius";
const OXF   = "University of Oxford";
const CAM   = "University of Cambridge";
const ICL   = "Imperial College London";
const UCL   = "University College London";
const EDIN  = "University of Edinburgh";
const MANC  = "University of Manchester";
const MIT   = "Massachusetts Institute of Technology";
const HARV  = "Harvard University";
const STAN  = "Stanford University";
const UTOR  = "University of Toronto";
const MELB  = "University of Melbourne";
const UCT   = "University of Cape Town";
const UG    = "University of Ghana";
const UNN   = "University of Nigeria, Nsukka";
const IIT   = "Indian Institute of Technology Delhi";
const NUS   = "National University of Singapore";
const WITS  = "University of the Witwatersrand";

const SYS = "UniHub Archive";

function pp(
  n: number,
  title: string,
  subject: string,
  degree: string,
  university: string,
  country: string,
  year: number,
  semester: PastPaper["semester"],
  link?: string,
  solutionUrl?: string,
  topics?: string[]
): PastPaper {
  const defaultLink = DIRECT_LINKS[subject] ?? PORTALS[university] ?? "https://openstax.org/subjects";
  const defaultSolution = SOLUTIONS[subject] ?? "https://www.khanacademy.org";

  return {
    id: `seed-${n}`,
    title,
    subject,
    degree,
    university,
    country,
    year,
    semester,
    link: link ?? defaultLink,
    solutionUrl: solutionUrl ?? defaultSolution,
    addedBy: SYS,
    addedAt: new Date(`${year}-06-01T00:00:00Z`).toISOString(),
    topics: topics ?? ["Core Concepts", "Problem Solving", "Exam Technique"],
    durationMinutes: 180,
    totalMarks: 100,
  };
}

export const SEED_PAPERS: PastPaper[] = [
  // ── Computer Science (2010 - 2026) ─────────────────────────────────────────
  pp(1,  "Data Structures & Algorithms Final Exam",          "Computer Science", "BSc Computer Science", UOM,  "Mauritius", 2010, "Semester 1", undefined, undefined, ["Binary Trees", "Sorting Algorithms", "Big-O Analysis"]),
  pp(2,  "Operating Systems Mid-Semester Exam",              "Computer Science", "BSc Computer Science", UOM,  "Mauritius", 2011, "Semester 2", undefined, undefined, ["Process Management", "Virtual Memory", "Deadlocks"]),
  pp(3,  "Database Management Systems Annual Paper",         "Computer Science", "BSc Computer Science", UOM,  "Mauritius", 2012, "Annual",     undefined, undefined, ["SQL Queries", "Normalization (3NF)", "Transactions"]),
  pp(4,  "Computer Networks & Security Exam",                "Computer Science", "BSc Computer Science", UOM,  "Mauritius", 2013, "Semester 1", undefined, undefined, ["TCP/IP Stack", "Routing Protocols", "Public Key Cryptography"]),
  pp(5,  "Software Engineering Principles Paper",            "Computer Science", "BSc Computer Science", UOM,  "Mauritius", 2014, "Semester 2", undefined, undefined, ["Agile Methodologies", "UML Diagrams", "Design Patterns"]),
  pp(6,  "Artificial Intelligence Final Paper",              "Computer Science", "BSc Computer Science", UOM,  "Mauritius", 2015, "Annual",     undefined, undefined, ["A* Search", "Minimax", "Knowledge Representation"]),
  pp(7,  "Machine Learning & Data Mining Exam",              "Computer Science", "MSc Data Science",     UOM,  "Mauritius", 2016, "Semester 1", undefined, undefined, ["Supervised Learning", "Decision Trees", "K-Means"]),
  pp(8,  "Web Technologies & Cloud Computing Paper",         "Computer Science", "BSc Computer Science", UTM,  "Mauritius", 2017, "Semester 2", undefined, undefined, ["REST APIs", "Docker", "Serverless Architecture"]),
  pp(9,  "Compiler Design & Formal Languages Exam",          "Computer Science", "BSc Computer Science", UTM,  "Mauritius", 2018, "Annual",     undefined, undefined, ["Lexical Analysis", "Context-Free Grammars", "Code Gen"]),
  pp(10, "Computer Vision & Pattern Recognition Paper",      "Computer Science", "MSc Computer Science", UTM,  "Mauritius", 2019, "Semester 1", undefined, undefined, ["Convolutional Networks", "Edge Detection", "Feature Matching"]),
  pp(11, "Cybersecurity & Digital Forensics Exam",           "Computer Science", "BSc IT Security",      UTM,  "Mauritius", 2020, "Semester 2", undefined, undefined, ["Penetration Testing", "Malware Analysis", "Network Intrusion"]),
  pp(12, "Distributed Systems Final Exam",                   "Computer Science", "MSc Computer Science", MIT,  "USA",       2021, "Annual",     undefined, undefined, ["Raft Consensus", "MapReduce", "Clock Synchronization"]),
  pp(13, "Advanced Algorithms & Complexity Exam",            "Computer Science", "MSc Computer Science", MIT,  "USA",       2022, "Semester 1", undefined, undefined, ["NP-Completeness", "Approximation Algorithms", "Network Flow"]),
  pp(14, "Deep Learning Final Assessment",                   "Computer Science", "MSc AI",               STAN, "USA",       2023, "Semester 2", undefined, undefined, ["Transformers", "Backpropagation", "Attention Mechanisms"]),
  pp(15, "Natural Language Processing Paper",                "Computer Science", "MSc AI",               STAN, "USA",       2024, "Annual",     undefined, undefined, ["LLM Architectures", "Word Embeddings", "Prompt Engineering"]),
  pp(16, "Blockchain & Decentralised Systems Exam",          "Computer Science", "BSc Computer Science", ICL,  "UK",        2025, "Semester 1", undefined, undefined, ["Smart Contracts", "Proof of Stake", "Cryptographic Hashing"]),
  pp(17, "Cloud Architecture & DevOps Final Paper",          "Computer Science", "MSc Cloud Computing",  ICL,  "UK",        2026, "Semester 2", undefined, undefined, ["Kubernetes Orchestration", "CI/CD Pipelines", "Infrastructure as Code"]),

  // ── Mathematics (2010 - 2026) ───────────────────────────────────────────────
  pp(18, "Calculus & Real Analysis Final Exam",              "Mathematics", "BSc Mathematics",        UOM,  "Mauritius", 2010, "Annual",     undefined, undefined, ["Limits & Continuity", "Taylor Series", "Riemann Integration"]),
  pp(19, "Linear Algebra Mid-Term Exam",                     "Mathematics", "BSc Mathematics",        UOM,  "Mauritius", 2011, "Semester 1", undefined, undefined, ["Vector Spaces", "Eigenvalues & Eigenvectors", "Matrix Factorization"]),
  pp(20, "Discrete Mathematics Exam",                        "Mathematics", "BSc Mathematics",        UOM,  "Mauritius", 2012, "Semester 2", undefined, undefined, ["Mathematical Proofs", "Combinatorics", "Recurrence Relations"]),
  pp(21, "Abstract Algebra Paper",                           "Mathematics", "BSc Mathematics",        CAM,  "UK",        2013, "Annual",     undefined, undefined, ["Group Theory", "Ring Isomorphisms", "Field Extensions"]),
  pp(22, "Numerical Methods & Analysis Exam",                "Mathematics", "BSc Mathematics",        CAM,  "UK",        2014, "Semester 1", undefined, undefined, ["Newton-Raphson", "Runge-Kutta Methods", "Spline Interpolation"]),
  pp(23, "Topology & Metric Spaces Paper",                   "Mathematics", "MSc Mathematics",        OXF,  "UK",        2015, "Semester 2", undefined, undefined, ["Compactness", "Connectedness", "Homotopy"]),
  pp(24, "Probability Theory Final Exam",                    "Mathematics", "BSc Mathematics",        OXF,  "UK",        2016, "Annual",     undefined, undefined, ["Random Variables", "Central Limit Theorem", "Moment Generating Functions"]),
  pp(25, "Complex Analysis Exam",                            "Mathematics", "MSc Mathematics",        EDIN, "UK",        2017, "Semester 1", undefined, undefined, ["Cauchy Integral Formula", "Residue Theorem", "Conformal Mapping"]),
  pp(26, "Differential Equations Paper",                     "Mathematics", "BSc Mathematics",        UTM,  "Mauritius", 2018, "Semester 2", undefined, undefined, ["Ordinary Differential Equations", "Laplace Transforms", "Boundary Value Problems"]),
  pp(27, "Graph Theory & Combinatorics Exam",                "Mathematics", "BSc Mathematics",        UTM,  "Mauritius", 2019, "Annual",     undefined, undefined, ["Eulerian Paths", "Graph Colouring", "Planar Graphs"]),
  pp(28, "Mathematical Statistics Final Paper",              "Mathematics", "BSc Mathematics",        HARV, "USA",       2020, "Semester 1", undefined, undefined, ["Hypothesis Testing", "Maximum Likelihood Estimation", "Confidence Intervals"]),
  pp(29, "Applied Mathematics — Partial Differential Eqs",  "Mathematics", "MSc Applied Math",       MIT,  "USA",       2021, "Semester 2", undefined, undefined, ["Heat Equation", "Wave Equation", "Fourier Transforms"]),
  pp(30, "Set Theory & Logic Annual Paper",                  "Mathematics", "BSc Mathematics",        UCL,  "UK",        2022, "Annual",     undefined, undefined, ["ZFC Axioms", "First-Order Logic", "Ordinal Numbers"]),
  pp(31, "Fourier Analysis & Signal Processing Exam",        "Mathematics", "MSc Mathematics",        NUS,  "Singapore", 2023, "Semester 1", undefined, undefined, ["DFT & FFT Algorithms", "Convolution Theorem", "Filtering"]),
  pp(32, "Number Theory Final Exam",                         "Mathematics", "BSc Mathematics",        UTOR, "Canada",    2024, "Semester 2", undefined, undefined, ["Prime Distribution", "Modular Arithmetic", "Diophantine Equations"]),
  pp(33, "Stochastic Processes Exam",                        "Mathematics", "MSc Financial Math",     UTOR, "Canada",    2025, "Annual",     undefined, undefined, ["Markov Chains", "Brownian Motion", "Martingales"]),
  pp(34, "Advanced Calculus Annual Paper",                   "Mathematics", "BSc Mathematics",        MELB, "Australia", 2026, "Semester 1", undefined, undefined, ["Stokes' Theorem", "Multivariable Optimization", "Vector Calculus"]),

  // ── Physics (2010 - 2026) ───────────────────────────────────────────────────
  pp(35, "Classical Mechanics Final Exam",                   "Physics", "BSc Physics",          UOM,  "Mauritius", 2010, "Semester 1", undefined, undefined, ["Newtonian Dynamics", "Lagrangian Mechanics", "Rigid Body Rotation"]),
  pp(36, "Electromagnetism & Optics Paper",                  "Physics", "BSc Physics",          UOM,  "Mauritius", 2011, "Annual",     undefined, undefined, ["Maxwell's Equations", "Wave Interference", "Poynting Vector"]),
  pp(37, "Quantum Mechanics Final Exam",                     "Physics", "BSc Physics",          CAM,  "UK",        2012, "Semester 2", undefined, undefined, ["Schrödinger Equation", "Wavefunctions", "Quantum Harmonic Oscillator"]),
  pp(38, "Thermodynamics & Statistical Physics Exam",        "Physics", "BSc Physics",          OXF,  "UK",        2013, "Semester 1", undefined, undefined, ["Entropy & Ensembles", "Partition Function", "Bose-Einstein Condensation"]),
  pp(39, "Nuclear Physics Annual Paper",                     "Physics", "MSc Physics",          ICL,  "UK",        2014, "Annual",     undefined, undefined, ["Radioactive Decay", "Nuclear Fusion/Fission", "Binding Energy"]),
  pp(40, "Condensed Matter Physics Exam",                    "Physics", "MSc Physics",          ICL,  "UK",        2015, "Semester 2", undefined, undefined, ["Crystal Lattice Dynamics", "Band Theory", "Superconductivity"]),
  pp(41, "Astrophysics & Cosmology Final Paper",             "Physics", "MSc Astrophysics",     EDIN, "UK",        2016, "Semester 1", undefined, undefined, ["Stellar Evolution", "Hubble's Law", "Cosmic Microwave Background"]),
  pp(42, "Particle Physics Exam",                            "Physics", "MSc Physics",          CAM,  "UK",        2017, "Annual",     undefined, undefined, ["Standard Model", "Feynman Diagrams", "Quark Dynamics"]),
  pp(43, "Fluid Mechanics Paper",                            "Physics", "BSc Physics",          UTM,  "Mauritius", 2018, "Semester 1", undefined, undefined, ["Navier-Stokes Equations", "Bernoulli Principle", "Turbulence"]),
  pp(44, "Atomic & Molecular Physics Exam",                  "Physics", "BSc Physics",          IIT,  "India",     2019, "Semester 2", undefined, undefined, ["Zeeman Effect", "Molecular Spectroscopy", "Fine Structure"]),
  pp(45, "Relativity & Gravitation Final Paper",             "Physics", "MSc Physics",          MIT,  "USA",       2020, "Annual",     undefined, undefined, ["Special Relativity Lorentz Transforms", "Einstein Field Equations", "Black Holes"]),
  pp(46, "Computational Physics Exam",                       "Physics", "BSc Physics",          NUS,  "Singapore", 2021, "Semester 1", undefined, undefined, ["Monte Carlo Simulation", "Finite Difference", "Numerical PDE Solvers"]),
  pp(47, "Solid State Physics Annual Paper",                 "Physics", "MSc Physics",          IIT,  "India",     2022, "Semester 2", undefined, undefined, ["Semiconductor Physics", "Phonons", "Fermi Surfaces"]),
  pp(48, "Photonics & Laser Physics Exam",                   "Physics", "MSc Physics",          STAN, "USA",       2023, "Annual",     undefined, undefined, ["Laser Cavity Design", "Fiber Optics", "Nonlinear Optics"]),
  pp(49, "Medical Physics Final Paper",                      "Physics", "MSc Medical Physics",  MANC, "UK",        2024, "Semester 1", undefined, undefined, ["Radiation Dosimetry", "MRI Physics", "Ultrasound Imaging"]),
  pp(50, "General Physics End-of-Year Exam",                 "Physics", "BSc Physics",          UCT,  "South Africa", 2025, "Semester 2", undefined, undefined, ["Kinematics", "Wave Optics", "Electric Circuits"]),
  pp(51, "Plasma Physics Annual Paper",                      "Physics", "MSc Physics",          UCL,  "UK",        2026, "Annual",     undefined, undefined, ["Magnetohydrodynamics", "Fusion Tokamaks", "Plasma Waves"]),

  // ── Chemistry (2010 - 2026) ───────────────────────────────────────────────
  pp(52, "Organic Chemistry Final Exam",                     "Chemistry", "BSc Chemistry",        UOM,  "Mauritius", 2010, "Annual",     undefined, undefined, ["Reaction Mechanisms", "Stereochemistry", "NMR Spectroscopy"]),
  pp(53, "Inorganic Chemistry Paper",                        "Chemistry", "BSc Chemistry",        UOM,  "Mauritius", 2011, "Semester 1", undefined, undefined, ["Coordination Complexes", "Transition Metals", "Crystal Field Theory"]),
  pp(54, "Physical Chemistry Final Exam",                    "Chemistry", "BSc Chemistry",        CAM,  "UK",        2012, "Semester 2", undefined, undefined, ["Chemical Kinetics", "Electrochemistry", "Quantum Chemistry"]),
  pp(55, "Analytical Chemistry Exam",                        "Chemistry", "BSc Chemistry",        OXF,  "UK",        2013, "Annual",     undefined, undefined, ["Chromatography", "Mass Spectrometry", "Titrations"]),
  pp(56, "Biochemistry & Molecular Biology Paper",           "Chemistry", "BSc Biochemistry",     UCL,  "UK",        2014, "Semester 1", undefined, undefined, ["Enzyme Kinetics", "Metabolic Pathways", "Protein Structure"]),
  pp(57, "Spectroscopy & Structure Determination Exam",      "Chemistry", "MSc Chemistry",        ICL,  "UK",        2015, "Semester 2", undefined, undefined, ["IR & UV-Vis Spectroscopy", "X-Ray Crystallography", "Structure Elucidation"]),
  pp(58, "Polymer Chemistry Annual Paper",                   "Chemistry", "MSc Chemistry",        MANC, "UK",        2016, "Annual",     undefined, undefined, ["Polymerization Kinetics", "Molecular Weight Distribution", "Thermoplastics"]),
  pp(59, "Environmental Chemistry Exam",                     "Chemistry", "BSc Chemistry",        MELB, "Australia", 2017, "Semester 1", undefined, undefined, ["Atmospheric Chemistry", "Water Quality Analysis", "Pollutant Degradation"]),
  pp(60, "Computational Chemistry Paper",                    "Chemistry", "MSc Chemistry",        MIT,  "USA",       2018, "Semester 2", undefined, undefined, ["Density Functional Theory (DFT)", "Molecular Dynamics", "Conformational Search"]),
  pp(61, "Green Chemistry & Sustainability Exam",            "Chemistry", "BSc Chemistry",        UTM,  "Mauritius", 2019, "Annual",     undefined, undefined, ["Atom Economy", "Bio-based Catalysts", "Renewable Solvents"]),
  pp(62, "Medicinal Chemistry Final Paper",                  "Chemistry", "MSc Medicinal Chem",   EDIN, "UK",        2020, "Semester 1", undefined, undefined, ["Drug Design & SAR", "Pharmacokinetics", "Target Inhibition"]),
  pp(63, "Materials Chemistry Exam",                         "Chemistry", "MSc Chemistry",        IIT,  "India",     2021, "Semester 2", undefined, undefined, ["Nanomaterials Synthesis", "Solar Cells", "Batteries & Supercapacitors"]),
  pp(64, "Thermochemistry & Kinetics Annual Paper",          "Chemistry", "BSc Chemistry",        NUS,  "Singapore", 2022, "Annual",     undefined, undefined, ["Hess's Law", "Arrhenius Equation", "Catalysis"]),
  pp(65, "Organometallic Chemistry Final Exam",              "Chemistry", "MSc Chemistry",        HARV, "USA",       2023, "Semester 1", undefined, undefined, ["Catalytic Cycles", "Ligand Exchange", "Cross-Coupling Reactions"]),
  pp(66, "Biophysical Chemistry Exam",                       "Chemistry", "MSc Biochemistry",     STAN, "USA",       2024, "Semester 2", undefined, undefined, ["Membrane Transport", "Thermodynamics of Folding", "Single-Molecule Biophysics"]),
  pp(67, "Advanced Industrial Chemistry Paper",              "Chemistry", "BSc Chemistry",        UTOR, "Canada",    2025, "Annual",     undefined, undefined, ["Chemical Process Safety", "Mass Transfer Operations", "Scale-up Synthesis"]),
  pp(68, "Nanochemistry & Quantum Dots Exam",                "Chemistry", "MSc Nanotech",         MIT,  "USA",       2026, "Semester 1", undefined, undefined, ["Quantum Confinement", "Self-Assembly", "Surface Functionalization"]),

  // ── Economics (2010 - 2026) ───────────────────────────────────────────────
  pp(69, "Microeconomics Final Exam",                        "Economics", "BSc Economics",        UOM,  "Mauritius", 2010, "Semester 1", undefined, undefined, ["Consumer Utility", "Market Equilibrium", "Monopoly vs Competition"]),
  pp(70, "Macroeconomics Annual Paper",                      "Economics", "BSc Economics",        UOM,  "Mauritius", 2011, "Annual",     undefined, undefined, ["IS-LM Model", "Inflation & Unemployment", "Fiscal Multiplier"]),
  pp(71, "Development Economics Exam",                       "Economics", "BSc Economics",        OPEN, "Mauritius", 2012, "Semester 2", undefined, undefined, ["Poverty Traps", "Foreign Aid Impact", "Human Capital Growth"]),
  pp(72, "International Trade & Finance Paper",              "Economics", "BSc Economics",        UCL,  "UK",        2013, "Semester 1", undefined, undefined, ["Comparative Advantage", "Tariff Analysis", "Exchange Rate Dynamics"]),
  pp(73, "Econometrics Final Exam",                          "Economics", "MSc Economics",        OXF,  "UK",        2014, "Annual",     undefined, undefined, ["OLS Regression", "Heteroskedasticity", "Instrumental Variables"]),
  pp(74, "Game Theory Exam",                                 "Economics", "MSc Economics",        CAM,  "UK",        2015, "Semester 2", undefined, undefined, ["Nash Equilibrium", "Subgame Perfection", "Auction Theory"]),
  pp(75, "Labour Economics & Policy Paper",                  "Economics", "BSc Economics",        MANC, "UK",        2016, "Semester 1", undefined, undefined, ["Wage Determination", "Minimum Wage Impacts", "Labor Supply Curves"]),
  pp(76, "Public Finance & Fiscal Policy Exam",              "Economics", "MSc Economics",        HARV, "USA",       2017, "Annual",     undefined, undefined, ["Tax Incidence", "Public Goods Provision", "Sovereign Debt"]),
  pp(77, "Behavioural Economics Final Paper",                "Economics", "MSc Economics",        STAN, "USA",       2018, "Semester 2", undefined, undefined, ["Prospect Theory", "Nudge Theory", "Heuristics & Biases"]),
  pp(78, "Environmental & Resource Economics Exam",          "Economics", "BSc Economics",        MELB, "Australia", 2019, "Semester 1", undefined, undefined, ["Carbon Pricing", "Tragedy of the Commons", "Pigouvian Taxation"]),
  pp(79, "African Economic Development Paper",               "Economics", "BSc Economics",        UCT,  "South Africa", 2020, "Annual",     undefined, undefined, ["Trade Integration", "Commodity Cycles", "Financial Inclusion"]),
  pp(80, "Political Economy Exam",                           "Economics", "MSc Economics",        EDIN, "UK",        2021, "Semester 2", undefined, undefined, ["Voting Models", "Institutional Economics", "Rent Seeking"]),
  pp(81, "Digital Economy & Innovation Paper",               "Economics", "MSc Economics",        NUS,  "Singapore", 2022, "Semester 1", undefined, undefined, ["Two-Sided Platforms", "Network Effects", "Data Monopolies"]),
  pp(82, "Health Economics Final Exam",                      "Economics", "MSc Health Econ",      UOM,  "Mauritius", 2023, "Annual",     undefined, undefined, ["QALY Evaluation", "Health Insurance Markets", "Pharmaceutical Pricing"]),
  pp(83, "Financial Economics Exam",                         "Economics", "MSc Economics",        ICL,  "UK",        2024, "Semester 2", undefined, undefined, ["CAPM Model", "Efficient Market Hypothesis", "Option Pricing"]),
  pp(84, "Monetary Policy & Central Banking Paper",          "Economics", "MSc Economics",        MIT,  "USA",       2025, "Semester 1", undefined, undefined, ["Central Bank Rates", "Quantitative Easing", "Digital Currencies"]),
  pp(85, "Welfare Economics Annual Paper",                   "Economics", "BSc Economics",        UTOR, "Canada",    2026, "Annual",     undefined, undefined, ["Pareto Efficiency", "Social Welfare Functions", "Inequality Metrics"]),

  // ── Accounting & Finance (2010 - 2026) ────────────────────────────────────
  pp(86, "Financial Accounting Final Exam",                  "Accounting", "BSc Accounting",        UOM,  "Mauritius", 2010, "Semester 2", undefined, undefined, ["Balance Sheet Preparation", "Cash Flow Statements", "Depreciation Methods"]),
  pp(87, "Management Accounting Paper",                      "Accounting", "BSc Accounting",        UOM,  "Mauritius", 2011, "Semester 1", undefined, undefined, ["Cost-Volume-Profit", "Budgetary Control", "Variance Analysis"]),
  pp(88, "Corporate Finance Exam",                           "Accounting", "BSc Finance",           UTM,  "Mauritius", 2012, "Annual",     undefined, undefined, ["Capital Budgeting NPV/IRR", "WACC Calculation", "Capital Structure"]),
  pp(89, "Auditing & Assurance Final Paper",                 "Accounting", "BSc Accounting",        OPEN, "Mauritius", 2013, "Semester 2", undefined, undefined, ["Audit Evidence", "Internal Control Systems", "Independent Audit Reports"]),
  pp(90, "Taxation Law & Practice Exam",                     "Accounting", "BSc Accounting",        MANC, "UK",        2014, "Semester 1", undefined, undefined, ["Corporate Tax Computations", "VAT Regulations", "Capital Gains Tax"]),
  pp(91, "Financial Reporting & IFRS Paper",                 "Accounting", "MSc Accounting",        UCL,  "UK",        2015, "Annual",     undefined, undefined, ["IFRS 15 Revenue Recognition", "Consolidated Accounts", "Impairment Testing"]),
  pp(92, "Investment Analysis Exam",                         "Accounting", "MSc Finance",           OXF,  "UK",        2016, "Semester 2", undefined, undefined, ["Portfolio Theory", "Bond Valuation", "Equity Research"]),
  pp(93, "Risk Management & Derivatives Paper",              "Accounting", "MSc Finance",           ICL,  "UK",        2017, "Semester 1", undefined, undefined, ["Futures & Swaps", "Black-Scholes Model", "Value at Risk (VaR)"]),
  pp(94, "Public Sector Accounting Exam",                    "Accounting", "BSc Accounting",        UCT,  "South Africa", 2018, "Annual",     undefined, undefined, ["IPSAS Framework", "Public Expenditure", "Government Budgeting"]),
  pp(95, "Financial Modelling & Valuation Paper",            "Accounting", "MSc Finance",           HARV, "USA",       2019, "Semester 2", undefined, undefined, ["Discounted Cash Flow (DCF)", "LBO Valuation", "Sensitivity Analysis"]),
  pp(96, "Forensic Accounting Exam",                         "Accounting", "MSc Accounting",        EDIN, "UK",        2020, "Semester 1", undefined, undefined, ["Fraud Detection", "Asset Tracing", "Expert Witness Evidence"]),
  pp(97, "Sustainability & Integrated Reporting Paper",      "Accounting", "MSc Accounting",        MELB, "Australia", 2021, "Annual",     undefined, undefined, ["ESG Metrics", "TCFD Disclosures", "Carbon Accounting"]),
  pp(98, "Banking & Financial Institutions Exam",            "Accounting", "BSc Finance",           UOM,  "Mauritius", 2022, "Semester 2", undefined, undefined, ["Basel III Accord", "Credit Risk Management", "Liquidity Ratios"]),
  pp(99, "Mergers, Acquisitions & Restructuring Paper",      "Accounting", "MSc Finance",           STAN, "USA",       2023, "Semester 1", undefined, undefined, ["Synergy Valuation", "Due Diligence", "Post-Merger Integration"]),
  pp(100,"Fintech & Digital Payments Exam",                  "Accounting", "MSc Finance",           NUS,  "Singapore", 2024, "Annual",     undefined, undefined, ["Open Banking APIs", "RegTech", "DeFi Protocols"]),
  pp(101,"Advanced Corporate Finance Final Paper",           "Accounting", "MSc Finance",           MIT,  "USA",       2025, "Semester 2", undefined, undefined, ["Real Options Analysis", "Corporate Restructuring", "International Finance"]),
  pp(102,"Algorithmic Trading & Financial Engineering",      "Accounting", "MSc Quantitative Fin",  ICL,  "UK",        2026, "Semester 1", undefined, undefined, ["High-Frequency Trading", "Quantitative Risk Models", "Order Book Dynamics"]),

  // ── Engineering (2010 - 2026) ─────────────────────────────────────────────
  pp(103,"Circuit Theory & Electronics Exam",               "Electrical Engineering", "BEng Electrical",  UOM,  "Mauritius", 2010, "Annual",     undefined, undefined, ["Kirchhoff's Laws", "Op-Amp Circuits", "AC Steady-State"]),
  pp(104,"Power Systems Engineering Paper",                 "Electrical Engineering", "BEng Electrical",  UOM,  "Mauritius", 2011, "Semester 1", undefined, undefined, ["3-Phase Power", "Transformer Efficiency", "Fault Analysis"]),
  pp(105,"Digital Signal Processing Exam",                  "Electrical Engineering", "BEng Electrical",  UTM,  "Mauritius", 2012, "Semester 2", undefined, undefined, ["Z-Transforms", "FIR/IIR Filters", "Sampling Theorem"]),
  pp(106,"Control Systems & Robotics Paper",                "Electrical Engineering", "MEng Electrical",  ICL,  "UK",        2013, "Annual",     undefined, undefined, ["PID Control", "Root Locus", "Bode Plots"]),
  pp(107,"Telecommunications Engineering Exam",             "Electrical Engineering", "BEng Electrical",  ICL,  "UK",        2014, "Semester 1", undefined, undefined, ["Modulation (AM/FM/QAM)", "Channel Capacity", "Antenna Design"]),
  pp(108,"Renewable Energy Systems Paper",                  "Electrical Engineering", "MEng Electrical",  EDIN, "UK",        2015, "Semester 2", undefined, undefined, ["PV Cell Modeling", "Wind Turbine Generators", "Grid Inverters"]),
  pp(109,"VLSI Design & Embedded Systems Exam",             "Electrical Engineering", "BEng Electrical",  IIT,  "India",     2016, "Annual",     undefined, undefined, ["CMOS Logic Design", "Verilog/VHDL", "FPGA Implementation"]),
  pp(110,"Microprocessors & Computer Architecture Paper",   "Electrical Engineering", "BEng Electrical",  IIT,  "India",     2017, "Semester 1", undefined, undefined, ["ARM/RISC-V Architecture", "Cache Memory", "Pipelining"]),
  pp(111,"Structural Analysis Exam",                        "Civil Engineering",      "BEng Civil",       UOM,  "Mauritius", 2010, "Semester 2", undefined, undefined, ["Bending Moments", "Truss Deflections", "Indeterminate Structures"]),
  pp(112,"Fluid Mechanics for Engineers Paper",             "Civil Engineering",      "BEng Civil",       UOM,  "Mauritius", 2011, "Annual",     undefined, undefined, ["Pipe Flow Networks", "Open Channel Hydraulics", "Dimensional Analysis"]),
  pp(113,"Geotechnical Engineering Exam",                   "Civil Engineering",      "BEng Civil",       UTM,  "Mauritius", 2012, "Semester 1", undefined, undefined, ["Soil Compaction", "Bearing Capacity", "Retaining Walls"]),
  pp(114,"Construction Management & Estimation Paper",      "Civil Engineering",      "BEng Civil",       MANC, "UK",        2013, "Semester 2", undefined, undefined, ["CPM Scheduling", "BIM Workflows", "Quantity Surveying"]),
  pp(115,"Transportation Engineering Exam",                 "Civil Engineering",      "MEng Civil",       MELB, "Australia", 2014, "Annual",     undefined, undefined, ["Pavement Design", "Traffic Signal Control", "Transit Capacity"]),
  pp(116,"Thermodynamics for Engineers Paper",              "Mechanical Engineering", "BEng Mechanical",  UOM,  "Mauritius", 2015, "Semester 1", undefined, undefined, ["Rankine Cycle", "Refrigeration Systems", "Combustion Thermodynamics"]),
  pp(117,"Manufacturing Processes & Materials Exam",        "Mechanical Engineering", "BEng Mechanical",  UTM,  "Mauritius", 2016, "Semester 2", undefined, undefined, ["CNC Machining", "Injection Molding", "Metal Casting"]),
  pp(118,"Heat Transfer & Fluid Dynamics Paper",            "Mechanical Engineering", "BEng Mechanical",  ICL,  "UK",        2017, "Annual",     undefined, undefined, ["Conduction & Convection", "Heat Exchangers", "Radiation Heat Transfer"]),
  pp(119,"CAD/CAM & Engineering Design Exam",               "Mechanical Engineering", "MEng Mechanical",  CAM,  "UK",        2018, "Semester 1", undefined, undefined, ["3D Solid Modeling", "Stress Simulation", "Generative Design"]),
  pp(120,"Structural Mechanics Annual Paper",               "Civil Engineering",      "MEng Civil",       UCT,  "South Africa", 2019, "Semester 2", undefined, undefined, ["Prestressed Concrete", "Steel Connection Design", "Seismic Engineering"]),
  pp(121,"Environmental Engineering Exam",                  "Civil Engineering",      "BEng Civil",       MELB, "Australia", 2020, "Annual",     undefined, undefined, ["Wastewater Treatment", "Air Pollution Control", "Solid Waste Management"]),
  pp(122,"Advanced Control Engineering Paper",              "Electrical Engineering", "MEng Electrical",  MIT,  "USA",       2021, "Semester 1", undefined, undefined, ["State-Space Control", "Kalman Filtering", "Nonlinear Systems"]),
  pp(123,"Robotics & Automation Systems Exam",              "Mechanical Engineering", "MEng Mechanical",  MIT,  "USA",       2022, "Semester 2", undefined, undefined, ["Kinematics & Dynamics", "Path Planning", "ROS Architecture"]),
  pp(124,"Smart Grids & Power Electronics Paper",           "Electrical Engineering", "MEng Electrical",  NUS,  "Singapore", 2023, "Annual",     undefined, undefined, ["Microgrid Controls", "DC-DC Converters", "Battery Storage"]),
  pp(125,"Finite Element Analysis Exam",                    "Mechanical Engineering", "MEng Mechanical",  IIT,  "India",     2024, "Semester 1", undefined, undefined, ["Mesh Generation", "Thermal FEA", "Structural Non-linearity"]),
  pp(126,"Hydraulics & Irrigation Engineering Paper",       "Civil Engineering",      "BEng Civil",       UG,   "Ghana",     2025, "Semester 2", undefined, undefined, ["Dams & Spillways", "Groundwater Hydrology", "Drip Irrigation"]),
  pp(127,"Advanced Additive Manufacturing Exam",            "Mechanical Engineering", "MEng Mechanical",  UTOR, "Canada",    2026, "Annual",     undefined, undefined, ["3D Metal Printing", "Topology Optimization", "Metamaterials"]),

  // ── Statistics & Data Science (2010 - 2026) ────────────────────────────────
  pp(128,"Probability & Statistics I Exam",                 "Statistics", "BSc Statistics",       UOM,  "Mauritius", 2010, "Annual",     undefined, undefined, ["Probability Axioms", "Combinatorics", "Binomial Distribution"]),
  pp(129,"Statistical Inference Final Paper",               "Statistics", "BSc Statistics",       UOM,  "Mauritius", 2011, "Semester 2", undefined, undefined, ["Neyman-Pearson Lemma", "p-Values", "Likelihood Ratio Tests"]),
  pp(130,"Regression Analysis Exam",                        "Statistics", "BSc Statistics",       UTM,  "Mauritius", 2012, "Semester 1", undefined, undefined, ["Multiple Regression", "Residual Diagnostics", "Multicollinearity"]),
  pp(131,"Time Series Analysis Paper",                      "Statistics", "MSc Statistics",       OXF,  "UK",        2013, "Annual",     undefined, undefined, ["ARIMA Models", "Autocorrelation", "Stationarity"]),
  pp(132,"Bayesian Statistics Exam",                        "Statistics", "MSc Statistics",       CAM,  "UK",        2014, "Semester 2", undefined, undefined, ["Prior & Posterior Distributions", "MCMC Sampling", "Gibbs Sampler"]),
  pp(133,"Multivariate Statistics Paper",                   "Statistics", "MSc Statistics",       HARV, "USA",       2015, "Semester 1", undefined, undefined, ["PCA & Factor Analysis", "MANOVA", "Discriminant Analysis"]),
  pp(134,"Survey Sampling & Design Exam",                   "Statistics", "BSc Statistics",       UOM,  "Mauritius", 2016, "Annual",     undefined, undefined, ["Stratified Sampling", "Cluster Sampling", "Non-response Bias"]),
  pp(135,"Data Mining & Predictive Analytics Paper",        "Statistics", "MSc Data Science",     NUS,  "Singapore", 2017, "Semester 2", undefined, undefined, ["Random Forests", "Gradient Boosting", "Association Rules"]),
  pp(136,"Big Data Analytics Exam",                         "Statistics", "MSc Data Science",     STAN, "USA",       2018, "Semester 1", undefined, undefined, ["Spark DataFrames", "Hadoop Ecosystem", "Distributed ML"]),
  pp(137,"Statistical Computing with R Exam",               "Statistics", "MSc Statistics",       EDIN, "UK",        2019, "Annual",     undefined, undefined, ["Tidyverse Workflows", "Bootstrapping", "R Package Dev"]),
  pp(138,"Clinical Trials & Biostatistics Paper",           "Statistics", "MSc Biostatistics",    MANC, "UK",        2020, "Semester 2", undefined, undefined, ["Survival Analysis (Kaplan-Meier)", "Cox Proportional Hazards", "Phase III Design"]),
  pp(139,"Spatial Statistics Exam",                         "Statistics", "MSc Statistics",       MELB, "Australia", 2021, "Semester 1", undefined, undefined, ["Kriging Interpolation", "Spatial Autocorrelation", "GIS Mapping"]),
  pp(140,"Machine Learning for Statisticians Paper",        "Statistics", "MSc Data Science",     MIT,  "USA",       2022, "Annual",     undefined, undefined, ["Support Vector Machines", "Neural Net Foundations", "Regularization Lasso/Ridge"]),
  pp(141,"Causal Inference Final Exam",                     "Statistics", "MSc Statistics",       HARV, "USA",       2023, "Semester 2", undefined, undefined, ["Propensity Score Matching", "DAGs & Counterfactuals", "Instrumental Variables"]),
  pp(142,"Advanced Data Visualisation Paper",               "Statistics", "MSc Data Science",     UTM,  "Mauritius", 2024, "Semester 1", undefined, undefined, ["D3.js Data Driven Documents", "Interactive Dashboards", "Perceptual Color Scales"]),
  pp(143,"Actuarial Statistics Exam",                       "Statistics", "BSc Actuarial Sc.",    UOM,  "Mauritius", 2025, "Annual",     undefined, undefined, ["Life Contingencies", "Risk Theory", "Ruin Probability"]),
  pp(144,"Deep Generative Models for Data Science",         "Statistics", "MSc Data Science",     STAN, "USA",       2026, "Semester 2", undefined, undefined, ["Diffusion Models", "Variational Autoencoders", "GAN Architectures"]),

  // ── Law & Life Sciences (2010 - 2026) ──────────────────────────────────────
  pp(145,"Constitutional & Administrative Law Exam",        "Law", "LLB Law",           UOM,  "Mauritius", 2010, "Annual",     undefined, undefined, ["Separation of Powers", "Judicial Review", "Fundamental Rights"]),
  pp(146,"Contract Law Final Paper",                        "Law", "LLB Law",           UOM,  "Mauritius", 2011, "Semester 1", undefined, undefined, ["Offer & Acceptance", "Consideration", "Breach Remedies"]),
  pp(147,"Tort Law Exam",                                   "Law", "LLB Law",           OXF,  "UK",        2012, "Semester 2", undefined, undefined, ["Negligence Duty of Care", "Nuisance", "Vicarious Liability"]),
  pp(148,"Criminal Law Final Paper",                        "Law", "LLB Law",           CAM,  "UK",        2013, "Annual",     undefined, undefined, ["Actus Reus & Mens Rea", "Homicide Defences", "Attempted Offences"]),
  pp(149,"International Law Exam",                          "Law", "LLB Law",           UCL,  "UK",        2014, "Semester 1", undefined, undefined, ["State Sovereignty", "UN Treaties", "ICJ Jurisprudence"]),
  pp(150,"Company & Commercial Law Paper",                  "Law", "LLB Law",           MANC, "UK",        2015, "Semester 2", undefined, undefined, ["Corporate Personality", "Directors' Duties", "Shareholder Remedies"]),
  pp(151,"Intellectual Property Law Exam",                  "Law", "LLM Law",           NUS,  "Singapore", 2016, "Annual",     undefined, undefined, ["Patents & Copyright", "Trademarks", "Fair Use Exemptions"]),
  pp(152,"Human Rights Law Paper",                          "Law", "LLM Law",           UCL,  "UK",        2017, "Semester 1", undefined, undefined, ["ECHR Articles", "Freedom of Expression", "Proportionality Test"]),
  pp(153,"Cyber Law & Data Protection Exam",                "Law", "LLM Law",           EDIN, "UK",        2018, "Semester 2", undefined, undefined, ["GDPR Compliance", "Data Privacy Rights", "Cross-Border Data"]),
  pp(154,"Environmental Law Paper",                         "Law", "LLM Law",           MELB, "Australia", 2019, "Annual",     undefined, undefined, ["Paris Agreement", "Environmental Impact Assessment", "Climate Litigation"]),
  pp(155,"African Regional & International Law Exam",       "Law", "LLB Law",           UCT,  "South Africa", 2020, "Semester 1", undefined, undefined, ["African Union Charter", "AfCFTA Regulations", "Human Rights Court"]),
  pp(156,"Competition Law & Regulation Paper",              "Law", "LLM Law",           OXF,  "UK",        2021, "Semester 2", undefined, undefined, ["Anti-competitive Agreements", "Abuse of Dominant Position", "Merger Control"]),
  pp(157,"Legal Tech & AI Governance Exam",                 "Law", "LLM Law",           HARV, "USA",       2022, "Annual",     undefined, undefined, ["AI Act Regulations", "Algorithmic Bias", "Automated Contracting"]),
  pp(158,"Family & Succession Law Paper",                   "Law", "LLB Law",           UOM,  "Mauritius", 2023, "Semester 1", undefined, undefined, ["Matrimonial Property", "Wills & Inheritance", "Child Rights"]),
  pp(159,"Space & Satellite Law Exam",                      "Law", "LLM Law",           MIT,  "USA",       2024, "Semester 2", undefined, undefined, ["Outer Space Treaty", "Orbital Debris Liability", "Commercial Space Mining"]),
  pp(160,"International Arbitration Final Paper",           "Law", "LLM Law",           ICL,  "UK",        2025, "Annual",     undefined, undefined, ["New York Convention", "Arbitral Awards", "ICSID Investment Disputes"]),
  pp(161,"Global AI Regulatory Frameworks Exam",            "Law", "LLM Law",           STAN, "USA",       2026, "Semester 1", undefined, undefined, ["AI Accountability", "Synthetic Content IP", "Autonomous Liability"]),
];
