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
  addedBy: string;
  addedAt: string;
}

// ---------------------------------------------------------------------------
// Seed data — 210 past papers, 2010 – 2026
// ---------------------------------------------------------------------------

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
): PastPaper {
  // Auto-generate a Google search link so every paper has a working "Open" button.
  // Specific link overrides the auto-generated one when provided.
  const autoLink = `https://www.google.com/search?q=${encodeURIComponent(`"${title}" "${university}" ${year} past exam paper`)}`;
  return {
    id: `seed-${n}`,
    title,
    subject,
    degree,
    university,
    country,
    year,
    semester,
    link: link ?? autoLink,
    addedBy: SYS,
    addedAt: new Date(`${year}-06-01T00:00:00Z`).toISOString(),
  };
}

export const SEED_PAPERS: PastPaper[] = [
  // ── Computer Science ──────────────────────────────────────────────────────
  pp(1,  "Data Structures & Algorithms Final Exam",          "Computer Science", "BSc Computer Science", UOM,  "Mauritius", 2010, "Semester 1"),
  pp(2,  "Operating Systems Mid-Semester Exam",              "Computer Science", "BSc Computer Science", UOM,  "Mauritius", 2011, "Semester 2"),
  pp(3,  "Database Management Systems Annual Paper",         "Computer Science", "BSc Computer Science", UOM,  "Mauritius", 2012, "Annual"),
  pp(4,  "Computer Networks & Security Exam",                "Computer Science", "BSc Computer Science", UOM,  "Mauritius", 2013, "Semester 1"),
  pp(5,  "Software Engineering Principles Paper",            "Computer Science", "BSc Computer Science", UOM,  "Mauritius", 2014, "Semester 2"),
  pp(6,  "Artificial Intelligence Final Paper",              "Computer Science", "BSc Computer Science", UOM,  "Mauritius", 2015, "Annual"),
  pp(7,  "Machine Learning & Data Mining Exam",              "Computer Science", "MSc Data Science",     UOM,  "Mauritius", 2016, "Semester 1"),
  pp(8,  "Web Technologies & Cloud Computing Paper",         "Computer Science", "BSc Computer Science", UTM,  "Mauritius", 2017, "Semester 2"),
  pp(9,  "Compiler Design & Formal Languages Exam",          "Computer Science", "BSc Computer Science", UTM,  "Mauritius", 2018, "Annual"),
  pp(10, "Computer Vision & Pattern Recognition Paper",      "Computer Science", "MSc Computer Science", UTM,  "Mauritius", 2019, "Semester 1"),
  pp(11, "Cybersecurity & Digital Forensics Exam",           "Computer Science", "BSc IT Security",      UTM,  "Mauritius", 2020, "Semester 2"),
  pp(12, "Distributed Systems Final Exam",                   "Computer Science", "MSc Computer Science", MIT,  "USA",       2021, "Annual"),
  pp(13, "Advanced Algorithms & Complexity Exam",            "Computer Science", "MSc Computer Science", MIT,  "USA",       2022, "Semester 1"),
  pp(14, "Deep Learning Final Assessment",                   "Computer Science", "MSc AI",               STAN, "USA",       2023, "Semester 2"),
  pp(15, "Natural Language Processing Paper",                "Computer Science", "MSc AI",               STAN, "USA",       2024, "Annual"),
  pp(16, "Blockchain & Decentralised Systems Exam",          "Computer Science", "BSc Computer Science", ICL,  "UK",        2025, "Semester 1"),
  pp(17, "Cloud Architecture & DevOps Final Paper",          "Computer Science", "MSc Cloud Computing",  ICL,  "UK",        2026, "Semester 2"),

  // ── Mathematics ───────────────────────────────────────────────────────────
  pp(18, "Calculus & Real Analysis Final Exam",              "Mathematics", "BSc Mathematics",        UOM,  "Mauritius", 2010, "Annual"),
  pp(19, "Linear Algebra Mid-Term Exam",                     "Mathematics", "BSc Mathematics",        UOM,  "Mauritius", 2011, "Semester 1"),
  pp(20, "Discrete Mathematics Exam",                        "Mathematics", "BSc Mathematics",        UOM,  "Mauritius", 2012, "Semester 2"),
  pp(21, "Abstract Algebra Paper",                           "Mathematics", "BSc Mathematics",        CAM,  "UK",        2013, "Annual"),
  pp(22, "Numerical Methods & Analysis Exam",                "Mathematics", "BSc Mathematics",        CAM,  "UK",        2014, "Semester 1"),
  pp(23, "Topology & Metric Spaces Paper",                   "Mathematics", "MSc Mathematics",        OXF,  "UK",        2015, "Semester 2"),
  pp(24, "Probability Theory Final Exam",                    "Mathematics", "BSc Mathematics",        OXF,  "UK",        2016, "Annual"),
  pp(25, "Complex Analysis Exam",                            "Mathematics", "MSc Mathematics",        EDIN, "UK",        2017, "Semester 1"),
  pp(26, "Differential Equations Paper",                     "Mathematics", "BSc Mathematics",        UTM,  "Mauritius", 2018, "Semester 2"),
  pp(27, "Graph Theory & Combinatorics Exam",                "Mathematics", "BSc Mathematics",        UTM,  "Mauritius", 2019, "Annual"),
  pp(28, "Mathematical Statistics Final Paper",              "Mathematics", "BSc Mathematics",        HARV, "USA",       2020, "Semester 1"),
  pp(29, "Applied Mathematics — Partial Differential Eqs",  "Mathematics", "MSc Applied Math",       MIT,  "USA",       2021, "Semester 2"),
  pp(30, "Set Theory & Logic Annual Paper",                  "Mathematics", "BSc Mathematics",        UCL,  "UK",        2022, "Annual"),
  pp(31, "Fourier Analysis & Signal Processing Exam",        "Mathematics", "MSc Mathematics",        NUS,  "Singapore", 2023, "Semester 1"),
  pp(32, "Number Theory Final Exam",                         "Mathematics", "BSc Mathematics",        UTOR, "Canada",    2024, "Semester 2"),
  pp(33, "Stochastic Processes Exam",                        "Mathematics", "MSc Financial Math",     UTOR, "Canada",    2025, "Annual"),
  pp(34, "Advanced Calculus Annual Paper",                   "Mathematics", "BSc Mathematics",        MELB, "Australia", 2026, "Semester 1"),

  // ── Physics ───────────────────────────────────────────────────────────────
  pp(35, "Classical Mechanics Final Exam",                   "Physics", "BSc Physics",          UOM,  "Mauritius", 2010, "Semester 1"),
  pp(36, "Electromagnetism & Optics Paper",                  "Physics", "BSc Physics",          UOM,  "Mauritius", 2011, "Annual"),
  pp(37, "Quantum Mechanics Final Exam",                     "Physics", "BSc Physics",          CAM,  "UK",        2012, "Semester 2"),
  pp(38, "Thermodynamics & Statistical Physics Exam",        "Physics", "BSc Physics",          OXF,  "UK",        2013, "Semester 1"),
  pp(39, "Nuclear Physics Annual Paper",                     "Physics", "MSc Physics",          ICL,  "UK",        2014, "Annual"),
  pp(40, "Condensed Matter Physics Exam",                    "Physics", "MSc Physics",          ICL,  "UK",        2015, "Semester 2"),
  pp(41, "Astrophysics & Cosmology Final Paper",             "Physics", "MSc Astrophysics",     EDIN, "UK",        2016, "Semester 1"),
  pp(42, "Particle Physics Exam",                            "Physics", "MSc Physics",          CAM,  "UK",        2017, "Annual"),
  pp(43, "Fluid Mechanics Paper",                            "Physics", "BSc Physics",          UTM,  "Mauritius", 2018, "Semester 1"),
  pp(44, "Atomic & Molecular Physics Exam",                  "Physics", "BSc Physics",          IIT,  "India",     2019, "Semester 2"),
  pp(45, "Relativity & Gravitation Final Paper",             "Physics", "MSc Physics",          MIT,  "USA",       2020, "Annual"),
  pp(46, "Computational Physics Exam",                       "Physics", "BSc Physics",          NUS,  "Singapore", 2021, "Semester 1"),
  pp(47, "Solid State Physics Annual Paper",                 "Physics", "MSc Physics",          IIT,  "India",     2022, "Semester 2"),
  pp(48, "Photonics & Laser Physics Exam",                   "Physics", "MSc Physics",          STAN, "USA",       2023, "Annual"),
  pp(49, "Medical Physics Final Paper",                      "Physics", "MSc Medical Physics",  MANC, "UK",        2024, "Semester 1"),
  pp(50, "General Physics End-of-Year Exam",                 "Physics", "BSc Physics",          UCT,  "South Africa", 2025, "Semester 2"),
  pp(51, "Plasma Physics Annual Paper",                      "Physics", "MSc Physics",          UCL,  "UK",        2026, "Annual"),

  // ── Chemistry ─────────────────────────────────────────────────────────────
  pp(52, "Organic Chemistry Final Exam",                     "Chemistry", "BSc Chemistry",        UOM,  "Mauritius", 2010, "Annual"),
  pp(53, "Inorganic Chemistry Paper",                        "Chemistry", "BSc Chemistry",        UOM,  "Mauritius", 2011, "Semester 1"),
  pp(54, "Physical Chemistry Final Exam",                    "Chemistry", "BSc Chemistry",        CAM,  "UK",        2012, "Semester 2"),
  pp(55, "Analytical Chemistry Exam",                        "Chemistry", "BSc Chemistry",        OXF,  "UK",        2013, "Annual"),
  pp(56, "Biochemistry & Molecular Biology Paper",           "Chemistry", "BSc Biochemistry",     UCL,  "UK",        2014, "Semester 1"),
  pp(57, "Spectroscopy & Structure Determination Exam",      "Chemistry", "MSc Chemistry",        ICL,  "UK",        2015, "Semester 2"),
  pp(58, "Polymer Chemistry Annual Paper",                   "Chemistry", "MSc Chemistry",        MANC, "UK",        2016, "Annual"),
  pp(59, "Environmental Chemistry Exam",                     "Chemistry", "BSc Chemistry",        MELB, "Australia", 2017, "Semester 1"),
  pp(60, "Computational Chemistry Paper",                    "Chemistry", "MSc Chemistry",        MIT,  "USA",       2018, "Semester 2"),
  pp(61, "Green Chemistry & Sustainability Exam",            "Chemistry", "BSc Chemistry",        UTM,  "Mauritius", 2019, "Annual"),
  pp(62, "Medicinal Chemistry Final Paper",                  "Chemistry", "MSc Medicinal Chem",   EDIN, "UK",        2020, "Semester 1"),
  pp(63, "Materials Chemistry Exam",                         "Chemistry", "MSc Chemistry",        IIT,  "India",     2021, "Semester 2"),
  pp(64, "Thermochemistry & Kinetics Annual Paper",          "Chemistry", "BSc Chemistry",        NUS,  "Singapore", 2022, "Annual"),

  // ── Economics ─────────────────────────────────────────────────────────────
  pp(65, "Microeconomics Final Exam",                        "Economics", "BSc Economics",        UOM,  "Mauritius", 2010, "Semester 1"),
  pp(66, "Macroeconomics Annual Paper",                      "Economics", "BSc Economics",        UOM,  "Mauritius", 2011, "Annual"),
  pp(67, "Development Economics Exam",                       "Economics", "BSc Economics",        OPEN, "Mauritius", 2012, "Semester 2"),
  pp(68, "International Trade & Finance Paper",              "Economics", "BSc Economics",        UCL,  "UK",        2013, "Semester 1"),
  pp(69, "Econometrics Final Exam",                          "Economics", "MSc Economics",        OXF,  "UK",        2014, "Annual"),
  pp(70, "Game Theory Exam",                                 "Economics", "MSc Economics",        CAM,  "UK",        2015, "Semester 2"),
  pp(71, "Labour Economics & Policy Paper",                  "Economics", "BSc Economics",        MANC, "UK",        2016, "Semester 1"),
  pp(72, "Public Finance & Fiscal Policy Exam",              "Economics", "MSc Economics",        HARV, "USA",       2017, "Annual"),
  pp(73, "Behavioural Economics Final Paper",                "Economics", "MSc Economics",        STAN, "USA",       2018, "Semester 2"),
  pp(74, "Environmental & Resource Economics Exam",          "Economics", "BSc Economics",        MELB, "Australia", 2019, "Semester 1"),
  pp(75, "African Economic Development Paper",               "Economics", "BSc Economics",        UCT,  "South Africa", 2020, "Annual"),
  pp(76, "Political Economy Exam",                           "Economics", "MSc Economics",        EDIN, "UK",        2021, "Semester 2"),
  pp(77, "Digital Economy & Innovation Paper",               "Economics", "MSc Economics",        NUS,  "Singapore", 2022, "Semester 1"),
  pp(78, "Health Economics Final Exam",                      "Economics", "MSc Health Econ",      UOM,  "Mauritius", 2023, "Annual"),
  pp(79, "Financial Economics Exam",                         "Economics", "MSc Economics",        ICL,  "UK",        2024, "Semester 2"),
  pp(80, "Monetary Policy & Central Banking Paper",          "Economics", "MSc Economics",        MIT,  "USA",       2025, "Semester 1"),
  pp(81, "Welfare Economics Annual Paper",                   "Economics", "BSc Economics",        UTOR, "Canada",    2026, "Annual"),

  // ── Accounting & Finance ──────────────────────────────────────────────────
  pp(82, "Financial Accounting Final Exam",                  "Accounting", "BSc Accounting",        UOM,  "Mauritius", 2010, "Semester 2"),
  pp(83, "Management Accounting Paper",                      "Accounting", "BSc Accounting",        UOM,  "Mauritius", 2011, "Semester 1"),
  pp(84, "Corporate Finance Exam",                           "Accounting", "BSc Finance",           UTM,  "Mauritius", 2012, "Annual"),
  pp(85, "Auditing & Assurance Final Paper",                 "Accounting", "BSc Accounting",        OPEN, "Mauritius", 2013, "Semester 2"),
  pp(86, "Taxation Law & Practice Exam",                     "Accounting", "BSc Accounting",        MANC, "UK",        2014, "Semester 1"),
  pp(87, "Financial Reporting & IFRS Paper",                 "Accounting", "MSc Accounting",        UCL,  "UK",        2015, "Annual"),
  pp(88, "Investment Analysis Exam",                         "Accounting", "MSc Finance",           OXF,  "UK",        2016, "Semester 2"),
  pp(89, "Risk Management & Derivatives Paper",              "Accounting", "MSc Finance",           ICL,  "UK",        2017, "Semester 1"),
  pp(90, "Public Sector Accounting Exam",                    "Accounting", "BSc Accounting",        UCT,  "South Africa", 2018, "Annual"),
  pp(91, "Financial Modelling & Valuation Paper",            "Accounting", "MSc Finance",           HARV, "USA",       2019, "Semester 2"),
  pp(92, "Forensic Accounting Exam",                         "Accounting", "MSc Accounting",        EDIN, "UK",        2020, "Semester 1"),
  pp(93, "Sustainability & Integrated Reporting Paper",      "Accounting", "MSc Accounting",        MELB, "Australia", 2021, "Annual"),
  pp(94, "Banking & Financial Institutions Exam",            "Accounting", "BSc Finance",           UOM,  "Mauritius", 2022, "Semester 2"),
  pp(95, "Mergers, Acquisitions & Restructuring Paper",      "Accounting", "MSc Finance",           STAN, "USA",       2023, "Semester 1"),
  pp(96, "Fintech & Digital Payments Exam",                  "Accounting", "MSc Finance",           NUS,  "Singapore", 2024, "Annual"),
  pp(97, "Advanced Corporate Finance Final Paper",           "Accounting", "MSc Finance",           MIT,  "USA",       2025, "Semester 2"),

  // ── Engineering ───────────────────────────────────────────────────────────
  pp(98,  "Circuit Theory & Electronics Exam",               "Electrical Engineering", "BEng Electrical",  UOM,  "Mauritius", 2010, "Annual"),
  pp(99,  "Power Systems Engineering Paper",                 "Electrical Engineering", "BEng Electrical",  UOM,  "Mauritius", 2011, "Semester 1"),
  pp(100, "Digital Signal Processing Exam",                  "Electrical Engineering", "BEng Electrical",  UTM,  "Mauritius", 2012, "Semester 2"),
  pp(101, "Control Systems & Robotics Paper",                "Electrical Engineering", "MEng Electrical",  ICL,  "UK",        2013, "Annual"),
  pp(102, "Telecommunications Engineering Exam",             "Electrical Engineering", "BEng Electrical",  ICL,  "UK",        2014, "Semester 1"),
  pp(103, "Renewable Energy Systems Paper",                  "Electrical Engineering", "MEng Electrical",  EDIN, "UK",        2015, "Semester 2"),
  pp(104, "VLSI Design & Embedded Systems Exam",             "Electrical Engineering", "BEng Electrical",  IIT,  "India",     2016, "Annual"),
  pp(105, "Microprocessors & Computer Architecture Paper",   "Electrical Engineering", "BEng Electrical",  IIT,  "India",     2017, "Semester 1"),
  pp(106, "Structural Analysis Exam",                        "Civil Engineering",      "BEng Civil",       UOM,  "Mauritius", 2010, "Semester 2"),
  pp(107, "Fluid Mechanics for Engineers Paper",             "Civil Engineering",      "BEng Civil",       UOM,  "Mauritius", 2011, "Annual"),
  pp(108, "Geotechnical Engineering Exam",                   "Civil Engineering",      "BEng Civil",       UTM,  "Mauritius", 2012, "Semester 1"),
  pp(109, "Construction Management & Estimation Paper",      "Civil Engineering",      "BEng Civil",       MANC, "UK",        2013, "Semester 2"),
  pp(110, "Transportation Engineering Exam",                 "Civil Engineering",      "MEng Civil",       MELB, "Australia", 2014, "Annual"),
  pp(111, "Thermodynamics for Engineers Paper",              "Mechanical Engineering", "BEng Mechanical",  UOM,  "Mauritius", 2015, "Semester 1"),
  pp(112, "Manufacturing Processes & Materials Exam",        "Mechanical Engineering", "BEng Mechanical",  UTM,  "Mauritius", 2016, "Semester 2"),
  pp(113, "Heat Transfer & Fluid Dynamics Paper",            "Mechanical Engineering", "BEng Mechanical",  ICL,  "UK",        2017, "Annual"),
  pp(114, "CAD/CAM & Engineering Design Exam",               "Mechanical Engineering", "MEng Mechanical",  CAM,  "UK",        2018, "Semester 1"),
  pp(115, "Structural Mechanics Annual Paper",               "Civil Engineering",      "MEng Civil",       UCT,  "South Africa", 2019, "Semester 2"),
  pp(116, "Environmental Engineering Exam",                  "Civil Engineering",      "BEng Civil",       MELB, "Australia", 2020, "Annual"),
  pp(117, "Advanced Control Engineering Paper",              "Electrical Engineering", "MEng Electrical",  MIT,  "USA",       2021, "Semester 1"),
  pp(118, "Robotics & Automation Systems Exam",              "Mechanical Engineering", "MEng Mechanical",  MIT,  "USA",       2022, "Semester 2"),
  pp(119, "Smart Grids & Power Electronics Paper",           "Electrical Engineering", "MEng Electrical",  NUS,  "Singapore", 2023, "Annual"),
  pp(120, "Finite Element Analysis Exam",                    "Mechanical Engineering", "MEng Mechanical",  IIT,  "India",     2024, "Semester 1"),
  pp(121, "Hydraulics & Irrigation Engineering Paper",       "Civil Engineering",      "BEng Civil",       UG,   "Ghana",     2025, "Semester 2"),
  pp(122, "Advanced Manufacturing Exam",                     "Mechanical Engineering", "MEng Mechanical",  UTOR, "Canada",    2026, "Annual"),

  // ── Statistics & Data Science ─────────────────────────────────────────────
  pp(123, "Probability & Statistics I Exam",                 "Statistics", "BSc Statistics",       UOM,  "Mauritius", 2010, "Annual"),
  pp(124, "Statistical Inference Final Paper",               "Statistics", "BSc Statistics",       UOM,  "Mauritius", 2011, "Semester 2"),
  pp(125, "Regression Analysis Exam",                        "Statistics", "BSc Statistics",       UTM,  "Mauritius", 2012, "Semester 1"),
  pp(126, "Time Series Analysis Paper",                      "Statistics", "MSc Statistics",       OXF,  "UK",        2013, "Annual"),
  pp(127, "Bayesian Statistics Exam",                        "Statistics", "MSc Statistics",       CAM,  "UK",        2014, "Semester 2"),
  pp(128, "Multivariate Statistics Paper",                   "Statistics", "MSc Statistics",       HARV, "USA",       2015, "Semester 1"),
  pp(129, "Survey Sampling & Design Exam",                   "Statistics", "BSc Statistics",       UOM,  "Mauritius", 2016, "Annual"),
  pp(130, "Data Mining & Predictive Analytics Paper",        "Statistics", "MSc Data Science",     NUS,  "Singapore", 2017, "Semester 2"),
  pp(131, "Big Data Analytics Exam",                         "Statistics", "MSc Data Science",     STAN, "USA",       2018, "Semester 1"),
  pp(132, "Statistical Computing with R Exam",               "Statistics", "MSc Statistics",       EDIN, "UK",        2019, "Annual"),
  pp(133, "Clinical Trials & Biostatistics Paper",           "Statistics", "MSc Biostatistics",    MANC, "UK",        2020, "Semester 2"),
  pp(134, "Spatial Statistics Exam",                         "Statistics", "MSc Statistics",       MELB, "Australia", 2021, "Semester 1"),
  pp(135, "Machine Learning for Statisticians Paper",        "Statistics", "MSc Data Science",     MIT,  "USA",       2022, "Annual"),
  pp(136, "Causal Inference Final Exam",                     "Statistics", "MSc Statistics",       HARV, "USA",       2023, "Semester 2"),
  pp(137, "Advanced Data Visualisation Paper",               "Statistics", "MSc Data Science",     UTM,  "Mauritius", 2024, "Semester 1"),
  pp(138, "Actuarial Statistics Exam",                       "Statistics", "BSc Actuarial Sc.",    UOM,  "Mauritius", 2025, "Annual"),
  pp(139, "Deep Learning for Data Science Paper",            "Statistics", "MSc Data Science",     STAN, "USA",       2026, "Semester 2"),

  // ── Business & Management ─────────────────────────────────────────────────
  pp(140, "Principles of Management Final Exam",             "Business Studies", "BSc Business Admin",  UOM,  "Mauritius", 2010, "Semester 1"),
  pp(141, "Marketing Management Paper",                      "Business Studies", "BSc Business Admin",  UOM,  "Mauritius", 2011, "Annual"),
  pp(142, "Human Resource Management Exam",                  "Business Studies", "BSc Business Admin",  OPEN, "Mauritius", 2012, "Semester 2"),
  pp(143, "Operations Management Paper",                     "Business Studies", "MBA",                 MANC, "UK",        2013, "Semester 1"),
  pp(144, "Strategic Management Final Exam",                 "Business Studies", "MBA",                 OXF,  "UK",        2014, "Annual"),
  pp(145, "Entrepreneurship & Innovation Paper",             "Business Studies", "MBA",                 HARV, "USA",       2015, "Semester 2"),
  pp(146, "Supply Chain Management Exam",                    "Business Studies", "BSc Logistics",       NUS,  "Singapore", 2016, "Semester 1"),
  pp(147, "International Business & Globalisation Paper",    "Business Studies", "MBA",                 STAN, "USA",       2017, "Annual"),
  pp(148, "Business Ethics & Corporate Governance Exam",     "Business Studies", "MBA",                 UCL,  "UK",        2018, "Semester 2"),
  pp(149, "Digital Marketing & E-Commerce Paper",            "Business Studies", "BSc Business Admin",  UTM,  "Mauritius", 2019, "Semester 1"),
  pp(150, "Project Management Final Exam",                   "Business Studies", "BSc Business Admin",  UOM,  "Mauritius", 2020, "Annual"),
  pp(151, "Organisational Behaviour Paper",                  "Business Studies", "MBA",                 EDIN, "UK",        2021, "Semester 2"),
  pp(152, "Business Analytics Exam",                         "Business Studies", "MSc Business Anal.",  MELB, "Australia", 2022, "Semester 1"),
  pp(153, "Change Management & Leadership Paper",            "Business Studies", "MBA",                 UCT,  "South Africa", 2023, "Annual"),
  pp(154, "Sustainability & CSR Exam",                       "Business Studies", "MBA",                 UTOR, "Canada",    2024, "Semester 2"),
  pp(155, "Global Strategy & Competitive Advantage Paper",   "Business Studies", "MBA",                 HARV, "USA",       2025, "Semester 1"),
  pp(156, "AI & Digital Transformation Exam",                "Business Studies", "MBA",                 STAN, "USA",       2026, "Annual"),

  // ── Law ───────────────────────────────────────────────────────────────────
  pp(157, "Constitutional & Administrative Law Exam",        "Law", "LLB Law",           UOM,  "Mauritius", 2010, "Annual"),
  pp(158, "Contract Law Final Paper",                        "Law", "LLB Law",           UOM,  "Mauritius", 2011, "Semester 1"),
  pp(159, "Tort Law Exam",                                   "Law", "LLB Law",           OXF,  "UK",        2012, "Semester 2"),
  pp(160, "Criminal Law Final Paper",                        "Law", "LLB Law",           CAM,  "UK",        2013, "Annual"),
  pp(161, "International Law Exam",                          "Law", "LLB Law",           UCL,  "UK",        2014, "Semester 1"),
  pp(162, "Company & Commercial Law Paper",                  "Law", "LLB Law",           MANC, "UK",        2015, "Semester 2"),
  pp(163, "Intellectual Property Law Exam",                  "Law", "LLM Law",           NUS,  "Singapore", 2016, "Annual"),
  pp(164, "Human Rights Law Paper",                          "Law", "LLM Law",           UCL,  "UK",        2017, "Semester 1"),
  pp(165, "Cyber Law & Data Protection Exam",                "Law", "LLM Law",           EDIN, "UK",        2018, "Semester 2"),
  pp(166, "Environmental Law Paper",                         "Law", "LLM Law",           MELB, "Australia", 2019, "Annual"),
  pp(167, "African Regional & International Law Exam",       "Law", "LLB Law",           UCT,  "South Africa", 2020, "Semester 1"),
  pp(168, "Competition Law & Regulation Paper",              "Law", "LLM Law",           OXF,  "UK",        2021, "Semester 2"),
  pp(169, "Legal Research Methods Exam",                     "Law", "LLB Law",           OPEN, "Mauritius", 2022, "Annual"),
  pp(170, "Family & Succession Law Paper",                   "Law", "LLB Law",           UOM,  "Mauritius", 2023, "Semester 1"),

  // ── Biology & Life Sciences ───────────────────────────────────────────────
  pp(171, "Cell Biology & Genetics Exam",                    "Biology", "BSc Biology",           UOM,  "Mauritius", 2010, "Semester 2"),
  pp(172, "Ecology & Environmental Biology Paper",           "Biology", "BSc Biology",           UOM,  "Mauritius", 2011, "Annual"),
  pp(173, "Microbiology Final Exam",                         "Biology", "BSc Biomedical Sc.",    UTM,  "Mauritius", 2012, "Semester 1"),
  pp(174, "Molecular Biology & Biotechnology Paper",         "Biology", "BSc Biotechnology",     NUS,  "Singapore", 2013, "Semester 2"),
  pp(175, "Developmental Biology Exam",                      "Biology", "MSc Biology",           CAM,  "UK",        2014, "Annual"),
  pp(176, "Immunology & Infectious Disease Paper",           "Biology", "MSc Biomedical Sc.",    MANC, "UK",        2015, "Semester 1"),
  pp(177, "Marine Biology Exam",                             "Biology", "BSc Biology",           MELB, "Australia", 2016, "Semester 2"),
  pp(178, "Conservation Biology Annual Paper",               "Biology", "MSc Conservation",      UCT,  "South Africa", 2017, "Annual"),
  pp(179, "Genomics & Bioinformatics Exam",                  "Biology", "MSc Bioinformatics",    ICL,  "UK",        2018, "Semester 1"),
  pp(180, "Neuroscience Final Paper",                        "Biology", "MSc Neuroscience",      OXF,  "UK",        2019, "Semester 2"),
  pp(181, "Plant Biology & Agriculture Exam",                "Biology", "BSc Agriculture",       UG,   "Ghana",     2020, "Annual"),
  pp(182, "Tropical Diseases & Global Health Paper",         "Biology", "MSc Global Health",     UNN,  "Nigeria",   2021, "Semester 1"),

  // ── Information Technology ────────────────────────────────────────────────
  pp(183, "Systems Analysis & Design Exam",                  "Information Technology", "BSc IT",              UOM,  "Mauritius", 2010, "Semester 1"),
  pp(184, "Network Administration Paper",                    "Information Technology", "BSc IT",              UTM,  "Mauritius", 2011, "Semester 2"),
  pp(185, "Enterprise Resource Planning Exam",               "Information Technology", "BSc IT",              OPEN, "Mauritius", 2012, "Annual"),
  pp(186, "IT Project Management Paper",                     "Information Technology", "BSc IT",              UOM,  "Mauritius", 2013, "Semester 1"),
  pp(187, "Human-Computer Interaction Exam",                 "Information Technology", "MSc IT",              EDIN, "UK",        2014, "Semester 2"),
  pp(188, "Information Security Management Paper",           "Information Technology", "MSc Cybersecurity",   MANC, "UK",        2015, "Annual"),
  pp(189, "Mobile Application Development Exam",             "Information Technology", "BSc IT",              UTM,  "Mauritius", 2016, "Semester 1"),
  pp(190, "Business Intelligence & Analytics Paper",         "Information Technology", "MSc IT",              NUS,  "Singapore", 2017, "Semester 2"),
  pp(191, "IT Governance & Compliance Exam",                 "Information Technology", "MSc IT Management",   UCL,  "UK",        2018, "Annual"),
  pp(192, "Internet of Things & Smart Systems Paper",        "Information Technology", "MSc IT",              ICL,  "UK",        2019, "Semester 1"),
  pp(193, "DevOps & Continuous Integration Exam",            "Information Technology", "MSc IT",              STAN, "USA",       2020, "Semester 2"),
  pp(194, "Quantum Computing Fundamentals Paper",            "Information Technology", "MSc Computing",       MIT,  "USA",       2021, "Annual"),
  pp(195, "AR/VR & Immersive Technologies Exam",             "Information Technology", "MSc IT",              UTM,  "Mauritius", 2022, "Semester 1"),
  pp(196, "Ethical Hacking & Penetration Testing Paper",     "Information Technology", "MSc Cybersecurity",   EDIN, "UK",        2023, "Semester 2"),
  pp(197, "Digital Health & Telemedicine Systems Exam",      "Information Technology", "MSc IT",              MELB, "Australia", 2024, "Annual"),
  pp(198, "Edge Computing & 5G Networks Paper",              "Information Technology", "MSc IT",              NUS,  "Singapore", 2025, "Semester 1"),
  pp(199, "Generative AI Applications Exam",                 "Information Technology", "MSc AI & Computing",  UTM,  "Mauritius", 2026, "Semester 2"),

  // ── Psychology & Social Sciences ──────────────────────────────────────────
  pp(200, "Introduction to Psychology Exam",                 "Psychology", "BSc Psychology",      UOM,  "Mauritius", 2010, "Annual"),
  pp(201, "Cognitive Psychology Paper",                      "Psychology", "BSc Psychology",      EDIN, "UK",        2013, "Semester 1"),
  pp(202, "Developmental Psychology Exam",                   "Psychology", "BSc Psychology",      MANC, "UK",        2015, "Semester 2"),
  pp(203, "Social Psychology Final Paper",                   "Psychology", "BSc Psychology",      UCL,  "UK",        2017, "Annual"),
  pp(204, "Clinical & Abnormal Psychology Exam",             "Psychology", "MSc Psychology",      OXF,  "UK",        2019, "Semester 1"),
  pp(205, "Research Methods in Psychology Paper",            "Psychology", "BSc Psychology",      UTOR, "Canada",    2020, "Semester 2"),
  pp(206, "Neuropsychology Final Exam",                      "Psychology", "MSc Psychology",      STAN, "USA",       2022, "Annual"),
  pp(207, "Positive Psychology & Well-being Paper",          "Psychology", "MSc Psychology",      MELB, "Australia", 2024, "Semester 1"),
  pp(208, "Educational Psychology Exam",                     "Psychology", "MEd Educational",     UOM,  "Mauritius", 2025, "Semester 2"),

  // ── Medicine & Health ─────────────────────────────────────────────────────
  pp(209, "Anatomy & Physiology Final Exam",                 "Medicine", "MBBS Medicine",    UOM,  "Mauritius", 2012, "Annual"),
  pp(210, "Pharmacology Exam",                               "Medicine", "MBBS Medicine",    MANC, "UK",        2015, "Semester 1"),
  pp(211, "Pathology Final Paper",                           "Medicine", "MBBS Medicine",    ICL,  "UK",        2018, "Semester 2"),
  pp(212, "Clinical Medicine Case Studies Exam",             "Medicine", "MBBS Medicine",    WITS, "South Africa", 2020, "Annual"),
  pp(213, "Public Health & Epidemiology Paper",              "Medicine", "MPH Public Health", HARV, "USA",       2022, "Semester 1"),
  pp(214, "Surgery & Surgical Anatomy Exam",                 "Medicine", "MBBS Medicine",    CAM,  "UK",        2024, "Semester 2"),
  pp(215, "Global Health Policy Paper",                      "Medicine", "MPH Public Health", HARV, "USA",       2026, "Annual"),
];
