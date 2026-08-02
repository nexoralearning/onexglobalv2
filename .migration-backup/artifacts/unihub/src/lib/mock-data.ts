import { getStorage, setStorage } from './storage';

export interface Assignment {
  id: string;
  title: string;
  subject: string;
  university: string;
  dueDate: string;
  description: string;
  status: 'Pending' | 'Completed' | 'Overdue';
  priority: 'High' | 'Medium' | 'Low';
  createdAt: string;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  subject: string;
  university: string;
  category: 'Lecture' | 'Tutorial' | 'Personal' | 'Research';
  createdAt: string;
  updatedAt: string;
  images?: string[]; // base64 data URLs
}

export interface GroupMessage {
  sender: string;
  text: string;
  time: string;
  image?: string; // base64 data URL
  flagged?: boolean;
  flagReason?: string;
}

export interface Job {
  id: string;
  title: string;
  company: string;
  country: string;
  location: string;
  type: 'Remote' | 'On-site' | 'Hybrid';
  jobCategory?: 'Internship' | 'Graduate Job' | 'Full Time Job' | 'Remote Job' | 'Part-time Job' | 'Research Opportunity';
  pay: 'Paid' | 'Unpaid';
  field: string;
  experienceLevel: 'Entry' | 'Mid' | 'Senior';
  description: string;
  relevantDegrees?: string[];
  postedDate: string;
  saved?: boolean;
}

export interface MarketplaceItem {
  id: string;
  title: string;
  description: string;
  price: number;
  category: 'Programming' | 'Design' | 'Tutoring' | 'Writing' | 'Marketing' | 'Notes' | 'Books' | 'Electronics' | 'Study Equipment' | 'Other';
  listingType: 'Service' | 'Item';
  condition?: 'New' | 'Good' | 'Fair';
  sellerName: string;
  sellerUniversity: string;
  sellerBio?: string;
  rating?: number;
  reviewCount?: number;
  tags: string[];
  wishlisted?: boolean;
  createdAt: string;
}

export interface StudyGroup {
  id: string;
  name: string;
  subject: string;
  university: string;
  degree?: string;
  memberCount: number;
  activityStatus: 'Active' | 'Quiet' | 'Very Active';
  description: string;
  tags: string[];
  type: 'Subject' | 'University' | 'Degree';
  joined?: boolean;
  createdBy?: string;
  messages?: GroupMessage[];
}

// Data generator helpers
const generateJobs = (): Job[] => [
  // ── UK ─────────────────────────────────────────────────────────────────────
  { id: 'j1', title: 'Software Engineering Internship', company: 'DeepMind', country: 'UK', location: 'London', type: 'Hybrid', jobCategory: 'Internship', pay: 'Paid', field: 'Technology', experienceLevel: 'Entry', description: 'Work on cutting-edge AI research projects alongside world-class researchers. You\'ll contribute to real systems and publish findings.', relevantDegrees: ['Computer Science', 'Mathematics', 'Engineering'], postedDate: new Date(Date.now() - 86400000 * 2).toISOString() },
  { id: 'j2', title: 'Graduate Analyst – Investment Banking', company: 'Barclays', country: 'UK', location: 'London', type: 'On-site', jobCategory: 'Graduate Job', pay: 'Paid', field: 'Finance', experienceLevel: 'Entry', description: 'Join our two-year graduate programme rotating across Equity Research, M&A, and Capital Markets. Full CFA sponsorship available.', relevantDegrees: ['Economics', 'Finance', 'Mathematics'], postedDate: new Date(Date.now() - 86400000 * 5).toISOString() },
  { id: 'j3', title: 'Part-time Marketing Assistant', company: 'Innocent Drinks', country: 'UK', location: 'London', type: 'Hybrid', jobCategory: 'Part-time Job', pay: 'Paid', field: 'Marketing', experienceLevel: 'Entry', description: 'Support the social media and campaign team. Flexible hours around your studies — 15 hrs/week. Creative flair welcome.', relevantDegrees: ['Marketing', 'Business', 'Media Studies'], postedDate: new Date(Date.now() - 86400000 * 3).toISOString() },
  { id: 'j4', title: 'Full-Stack Developer', company: 'Revolut', country: 'UK', location: 'London', type: 'Hybrid', jobCategory: 'Full Time Job', pay: 'Paid', field: 'Technology', experienceLevel: 'Entry', description: 'Build financial products used by 40 million customers globally. React, Node.js, and Kotlin stack. Excellent salary and equity.', relevantDegrees: ['Computer Science', 'Software Engineering'], postedDate: new Date(Date.now() - 86400000 * 1).toISOString() },
  { id: 'j5', title: 'Clinical Research Assistant', company: 'NHS England', country: 'UK', location: 'Manchester', type: 'On-site', jobCategory: 'Research Opportunity', pay: 'Paid', field: 'Healthcare', experienceLevel: 'Entry', description: 'Support ongoing clinical trials across three hospital trusts. Gain hands-on research experience with direct patient data.', relevantDegrees: ['Medicine', 'Biology', 'Nursing', 'Pharmacy'], postedDate: new Date(Date.now() - 86400000 * 7).toISOString() },

  // ── USA ────────────────────────────────────────────────────────────────────
  { id: 'j6', title: 'Product Management Intern', company: 'Google', country: 'USA', location: 'Mountain View, CA', type: 'Hybrid', jobCategory: 'Internship', pay: 'Paid', field: 'Technology', experienceLevel: 'Entry', description: 'Drive product strategy for a Google product with millions of users. Work with engineering, design, and data science teams.', relevantDegrees: ['Computer Science', 'Business', 'Engineering'], postedDate: new Date(Date.now() - 86400000 * 4).toISOString() },
  { id: 'j7', title: 'Data Science Graduate Program', company: 'Meta', country: 'USA', location: 'New York, NY', type: 'Hybrid', jobCategory: 'Graduate Job', pay: 'Paid', field: 'Technology', experienceLevel: 'Entry', description: 'Join Meta\'s structured two-year data science program. Rotation across integrity, ads, and growth teams.', relevantDegrees: ['Statistics', 'Computer Science', 'Mathematics'], postedDate: new Date(Date.now() - 86400000 * 6).toISOString() },
  { id: 'j8', title: 'Remote UX Research Contractor', company: 'Figma', country: 'USA', location: 'Remote (US timezone)', type: 'Remote', jobCategory: 'Remote Job', pay: 'Paid', field: 'Design', experienceLevel: 'Entry', description: 'Conduct user interviews, run usability studies, and present insights to the design team. Fully remote, flexible schedule.', relevantDegrees: ['Psychology', 'Design', 'Human-Computer Interaction'], postedDate: new Date(Date.now() - 86400000 * 2).toISOString() },
  { id: 'j9', title: 'Software Engineer – Full Time', company: 'Amazon', country: 'USA', location: 'Seattle, WA', type: 'On-site', jobCategory: 'Full Time Job', pay: 'Paid', field: 'Technology', experienceLevel: 'Entry', description: 'Join AWS as a full-time SDE. Work on distributed systems powering millions of cloud customers. Relocation assistance provided.', relevantDegrees: ['Computer Science', 'Software Engineering', 'Mathematics'], postedDate: new Date(Date.now() - 86400000 * 3).toISOString() },
  { id: 'j10', title: 'Finance Research Internship', company: 'Goldman Sachs', country: 'USA', location: 'New York, NY', type: 'On-site', jobCategory: 'Internship', pay: 'Paid', field: 'Finance', experienceLevel: 'Entry', description: '10-week summer internship in the Global Investment Research division. Potential for full-time return offer.', relevantDegrees: ['Finance', 'Economics', 'Mathematics'], postedDate: new Date(Date.now() - 86400000 * 8).toISOString() },

  // ── Mauritius ──────────────────────────────────────────────────────────────
  { id: 'j11', title: 'Junior Software Developer', company: 'Ceridian Mauritius', country: 'Mauritius', location: 'Ebène Cybercity', type: 'Hybrid', jobCategory: 'Full Time Job', pay: 'Paid', field: 'Technology', experienceLevel: 'Entry', description: 'Develop and maintain HCM software features used by global clients. Great starting role in Mauritius\'s tech hub.', relevantDegrees: ['Computer Science', 'Software Engineering', 'IT'], postedDate: new Date(Date.now() - 86400000 * 2).toISOString() },
  { id: 'j12', title: 'Banking Graduate Trainee', company: 'MCB Group', country: 'Mauritius', location: 'Port Louis', type: 'On-site', jobCategory: 'Graduate Job', pay: 'Paid', field: 'Finance', experienceLevel: 'Entry', description: 'MCB\'s graduate programme gives you structured rotations across retail, corporate, and digital banking over 18 months.', relevantDegrees: ['Finance', 'Economics', 'Business Administration'], postedDate: new Date(Date.now() - 86400000 * 4).toISOString() },
  { id: 'j13', title: 'Digital Marketing Intern', company: 'Mauritius Telecom', country: 'Mauritius', location: 'Port Louis', type: 'On-site', jobCategory: 'Internship', pay: 'Paid', field: 'Marketing', experienceLevel: 'Entry', description: 'Support the brand and digital team on social campaigns, content creation, and web analytics. 6-month paid internship.', relevantDegrees: ['Marketing', 'Business', 'Communications'], postedDate: new Date(Date.now() - 86400000 * 6).toISOString() },
  { id: 'j14', title: 'Remote Customer Success Associate', company: 'Leal', country: 'Mauritius', location: 'Remote', type: 'Remote', jobCategory: 'Remote Job', pay: 'Paid', field: 'Technology', experienceLevel: 'Entry', description: 'Join a fast-growing Mauritian tech startup helping local businesses with loyalty platforms. Fully remote, English & French.', relevantDegrees: ['Business', 'IT', 'Communications'], postedDate: new Date(Date.now() - 86400000 * 1).toISOString() },
  { id: 'j15', title: 'Marine Biology Research Assistant', company: 'University of Mauritius', country: 'Mauritius', location: 'Réduit', type: 'On-site', jobCategory: 'Research Opportunity', pay: 'Unpaid', field: 'Science', experienceLevel: 'Entry', description: 'Assist with coral reef conservation research around the Mauritian coast. Academic credit available for eligible students.', relevantDegrees: ['Biology', 'Marine Science', 'Environmental Science'], postedDate: new Date(Date.now() - 86400000 * 9).toISOString() },

  // ── India ──────────────────────────────────────────────────────────────────
  { id: 'j16', title: 'Software Development Engineer Intern', company: 'Infosys', country: 'India', location: 'Bangalore', type: 'On-site', jobCategory: 'Internship', pay: 'Paid', field: 'Technology', experienceLevel: 'Entry', description: '6-month internship in the digital transformation practice. Work on enterprise projects for Fortune 500 clients.', relevantDegrees: ['Computer Science', 'Information Technology', 'Engineering'], postedDate: new Date(Date.now() - 86400000 * 3).toISOString() },
  { id: 'j17', title: 'Business Analyst – Full Time', company: 'Tata Consultancy Services', country: 'India', location: 'Mumbai', type: 'Hybrid', jobCategory: 'Full Time Job', pay: 'Paid', field: 'Technology', experienceLevel: 'Entry', description: 'Bridge the gap between business needs and technology solutions for global clients. TCS initial learning programme included.', relevantDegrees: ['Business', 'Computer Science', 'Engineering'], postedDate: new Date(Date.now() - 86400000 * 5).toISOString() },
  { id: 'j18', title: 'Finance Graduate Trainee', company: 'HDFC Bank', country: 'India', location: 'Delhi', type: 'On-site', jobCategory: 'Graduate Job', pay: 'Paid', field: 'Finance', experienceLevel: 'Entry', description: 'Structured graduate programme across retail banking, wealth management, and credit analysis. Top performers fast-tracked to manager.', relevantDegrees: ['Finance', 'Economics', 'Business Administration', 'MBA'], postedDate: new Date(Date.now() - 86400000 * 7).toISOString() },

  // ── UAE ────────────────────────────────────────────────────────────────────
  { id: 'j19', title: 'Financial Analyst – Graduate', company: 'Abu Dhabi Investment Authority', country: 'UAE', location: 'Abu Dhabi', type: 'On-site', jobCategory: 'Graduate Job', pay: 'Paid', field: 'Finance', experienceLevel: 'Entry', description: 'Analyse global equity and alternative asset classes for one of the world\'s largest sovereign wealth funds. Tax-free salary.', relevantDegrees: ['Finance', 'Economics', 'Mathematics', 'Business'], postedDate: new Date(Date.now() - 86400000 * 4).toISOString() },
  { id: 'j20', title: 'Software Engineer – Full Time', company: 'Careem', country: 'UAE', location: 'Dubai', type: 'Hybrid', jobCategory: 'Full Time Job', pay: 'Paid', field: 'Technology', experienceLevel: 'Entry', description: 'Build features for the leading super-app in MENA. Modern tech stack, multicultural team, relocation package available.', relevantDegrees: ['Computer Science', 'Software Engineering'], postedDate: new Date(Date.now() - 86400000 * 2).toISOString() },
  { id: 'j21', title: 'Marketing Intern', company: 'Emirates Group', country: 'UAE', location: 'Dubai', type: 'On-site', jobCategory: 'Internship', pay: 'Paid', field: 'Marketing', experienceLevel: 'Entry', description: 'Support global brand campaigns and in-flight product marketing. Accommodation allowance provided for international interns.', relevantDegrees: ['Marketing', 'Business', 'Communications'], postedDate: new Date(Date.now() - 86400000 * 6).toISOString() },

  // ── Canada ─────────────────────────────────────────────────────────────────
  { id: 'j22', title: 'Machine Learning Intern', company: 'Shopify', country: 'Canada', location: 'Ottawa, ON', type: 'Remote', jobCategory: 'Internship', pay: 'Paid', field: 'Technology', experienceLevel: 'Entry', description: 'Apply ML to e-commerce personalisation and fraud detection. Fully remote with a world-class engineering team.', relevantDegrees: ['Computer Science', 'Mathematics', 'Statistics'], postedDate: new Date(Date.now() - 86400000 * 3).toISOString() },
  { id: 'j23', title: 'Junior Accountant – Full Time', company: 'Deloitte Canada', country: 'Canada', location: 'Toronto, ON', type: 'Hybrid', jobCategory: 'Full Time Job', pay: 'Paid', field: 'Finance', experienceLevel: 'Entry', description: 'Join the audit and assurance practice. CPA Canada registration support and mentorship from senior partners.', relevantDegrees: ['Accounting', 'Finance', 'Business'], postedDate: new Date(Date.now() - 86400000 * 5).toISOString() },
  { id: 'j24', title: 'Healthcare Policy Research Assistant', company: 'University of Toronto', country: 'Canada', location: 'Toronto, ON', type: 'Hybrid', jobCategory: 'Research Opportunity', pay: 'Paid', field: 'Healthcare', experienceLevel: 'Entry', description: 'Assist professors researching universal pharmacare policy. Co-authorship opportunity on published papers.', relevantDegrees: ['Public Health', 'Medicine', 'Economics', 'Political Science'], postedDate: new Date(Date.now() - 86400000 * 10).toISOString() },

  // ── Australia ──────────────────────────────────────────────────────────────
  { id: 'j25', title: 'Graduate Engineer', company: 'BHP', country: 'Australia', location: 'Perth, WA', type: 'On-site', jobCategory: 'Graduate Job', pay: 'Paid', field: 'Engineering', experienceLevel: 'Entry', description: 'Rotate across mining operations and projects in WA. Structured two-year graduate programme with mentorship and relocation support.', relevantDegrees: ['Engineering', 'Geology', 'Environmental Science'], postedDate: new Date(Date.now() - 86400000 * 4).toISOString() },
  { id: 'j26', title: 'Part-time Data Entry & Analysis', company: 'Canva', country: 'Australia', location: 'Sydney, NSW', type: 'Hybrid', jobCategory: 'Part-time Job', pay: 'Paid', field: 'Technology', experienceLevel: 'Entry', description: 'Flexible part-time role supporting the growth analytics team. Great for students interested in data and product.', relevantDegrees: ['Statistics', 'Business', 'Computer Science'], postedDate: new Date(Date.now() - 86400000 * 2).toISOString() },

  // ── Singapore ──────────────────────────────────────────────────────────────
  { id: 'j27', title: 'Quantitative Research Intern', company: 'DBS Bank', country: 'Singapore', location: 'Marina Bay', type: 'On-site', jobCategory: 'Internship', pay: 'Paid', field: 'Finance', experienceLevel: 'Entry', description: 'Work in the quant team building models for FX and rates trading. Strong maths background essential.', relevantDegrees: ['Mathematics', 'Statistics', 'Physics', 'Computer Science'], postedDate: new Date(Date.now() - 86400000 * 5).toISOString() },
  { id: 'j28', title: 'Full Time Operations Analyst', company: 'Grab', country: 'Singapore', location: 'Singapore City', type: 'Hybrid', jobCategory: 'Full Time Job', pay: 'Paid', field: 'Technology', experienceLevel: 'Entry', description: 'Drive operational excellence across Grab\'s ride-hailing and delivery platforms in Southeast Asia.', relevantDegrees: ['Business', 'Engineering', 'Computer Science'], postedDate: new Date(Date.now() - 86400000 * 3).toISOString() },

  // ── South Africa ───────────────────────────────────────────────────────────
  { id: 'j29', title: 'Junior Software Developer', company: 'Discovery Health', country: 'South Africa', location: 'Johannesburg', type: 'Hybrid', jobCategory: 'Full Time Job', pay: 'Paid', field: 'Technology', experienceLevel: 'Entry', description: 'Build health-tech solutions powering South Africa\'s largest medical scheme. Agile team, modern stack.', relevantDegrees: ['Computer Science', 'Information Systems', 'Software Engineering'], postedDate: new Date(Date.now() - 86400000 * 4).toISOString() },
  { id: 'j30', title: 'Finance Internship', company: 'Standard Bank', country: 'South Africa', location: 'Cape Town', type: 'On-site', jobCategory: 'Internship', pay: 'Paid', field: 'Finance', experienceLevel: 'Entry', description: '10-week structured internship across corporate and investment banking. Pan-African exposure with one of Africa\'s biggest banks.', relevantDegrees: ['Finance', 'Economics', 'Accounting'], postedDate: new Date(Date.now() - 86400000 * 6).toISOString() },

  // ── France ─────────────────────────────────────────────────────────────────
  { id: 'j31', title: 'UX/UI Design Intern', company: 'BlaBlaCar', country: 'France', location: 'Paris', type: 'Hybrid', jobCategory: 'Internship', pay: 'Paid', field: 'Design', experienceLevel: 'Entry', description: 'Shape the experience of 100M+ users on Europe\'s largest carpooling platform. Figma skills required, French a plus.', relevantDegrees: ['Design', 'Human-Computer Interaction', 'Computer Science'], postedDate: new Date(Date.now() - 86400000 * 3).toISOString() },
  { id: 'j32', title: 'Data Analyst – Full Time', company: 'L\'Oréal', country: 'France', location: 'Paris', type: 'Hybrid', jobCategory: 'Full Time Job', pay: 'Paid', field: 'Marketing', experienceLevel: 'Entry', description: 'Turn consumer data into actionable insights for global beauty brands. SQL and Python required. English-speaking team.', relevantDegrees: ['Statistics', 'Business', 'Computer Science', 'Marketing'], postedDate: new Date(Date.now() - 86400000 * 5).toISOString() },

  // ── Germany ────────────────────────────────────────────────────────────────
  { id: 'j33', title: 'Mechanical Engineering Graduate', company: 'Siemens', country: 'Germany', location: 'Munich', type: 'On-site', jobCategory: 'Graduate Job', pay: 'Paid', field: 'Engineering', experienceLevel: 'Entry', description: 'Join Siemens\'s international graduate programme in industrial automation. Relocation support and German language classes provided.', relevantDegrees: ['Mechanical Engineering', 'Electrical Engineering', 'Physics'], postedDate: new Date(Date.now() - 86400000 * 7).toISOString() },
  { id: 'j34', title: 'Remote Backend Developer', company: 'Personio', country: 'Germany', location: 'Remote (EU timezone)', type: 'Remote', jobCategory: 'Remote Job', pay: 'Paid', field: 'Technology', experienceLevel: 'Entry', description: 'Work on a fast-growing HR platform from anywhere in Europe. Go or Java backend, strong testing culture.', relevantDegrees: ['Computer Science', 'Software Engineering'], postedDate: new Date(Date.now() - 86400000 * 2).toISOString() },

  // ── Japan ──────────────────────────────────────────────────────────────────
  { id: 'j35', title: 'English Teaching Assistant (Part-time)', company: 'AEON Corp', country: 'Japan', location: 'Tokyo', type: 'On-site', jobCategory: 'Part-time Job', pay: 'Paid', field: 'Education', experienceLevel: 'Entry', description: 'Teach conversational English at a leading language school. Visa sponsorship available, no Japanese required.', relevantDegrees: ['Education', 'English Literature', 'Linguistics', 'Any Degree'], postedDate: new Date(Date.now() - 86400000 * 5).toISOString() },
  { id: 'j36', title: 'Software Engineer – Full Time', company: 'Sony Interactive Entertainment', country: 'Japan', location: 'Tokyo', type: 'On-site', jobCategory: 'Full Time Job', pay: 'Paid', field: 'Technology', experienceLevel: 'Entry', description: 'Build PlayStation platform features and developer tools. English-friendly team; relocation and visa handled.', relevantDegrees: ['Computer Science', 'Software Engineering', 'Mathematics'], postedDate: new Date(Date.now() - 86400000 * 4).toISOString() },

  // ── Kenya ──────────────────────────────────────────────────────────────────
  { id: 'j37', title: 'FinTech Product Intern', company: 'M-PESA (Safaricom)', country: 'Kenya', location: 'Nairobi', type: 'On-site', jobCategory: 'Internship', pay: 'Paid', field: 'Finance', experienceLevel: 'Entry', description: 'Work on mobile money product features used by 30M+ Kenyans. Gain experience in one of Africa\'s most innovative companies.', relevantDegrees: ['Computer Science', 'Finance', 'Business', 'Engineering'], postedDate: new Date(Date.now() - 86400000 * 3).toISOString() },
  { id: 'j38', title: 'Public Health Research Officer', company: 'African Population & Health Research Center', country: 'Kenya', location: 'Nairobi', type: 'Hybrid', jobCategory: 'Research Opportunity', pay: 'Paid', field: 'Healthcare', experienceLevel: 'Entry', description: 'Support data collection and analysis for maternal health studies across East Africa. Stipend and accommodation provided.', relevantDegrees: ['Public Health', 'Medicine', 'Biology', 'Statistics'], postedDate: new Date(Date.now() - 86400000 * 8).toISOString() },

  // ── New Zealand ────────────────────────────────────────────────────────────
  { id: 'j39', title: 'Environmental Science Graduate', company: 'NIWA', country: 'New Zealand', location: 'Wellington', type: 'On-site', jobCategory: 'Graduate Job', pay: 'Paid', field: 'Science', experienceLevel: 'Entry', description: 'Join NZ\'s national water and atmosphere research institute. Work on climate modelling and coastal hazard research.', relevantDegrees: ['Environmental Science', 'Marine Science', 'Physics', 'Geography'], postedDate: new Date(Date.now() - 86400000 * 6).toISOString() },
  { id: 'j40', title: 'IT Support Part-time', company: 'University of Auckland', country: 'New Zealand', location: 'Auckland', type: 'On-site', jobCategory: 'Part-time Job', pay: 'Paid', field: 'Technology', experienceLevel: 'Entry', description: 'Provide tech support to students and staff on campus. Ideal for an IT student. Flexible hours around lectures.', relevantDegrees: ['Information Technology', 'Computer Science'], postedDate: new Date(Date.now() - 86400000 * 2).toISOString() },

  // ── Ireland ────────────────────────────────────────────────────────────────
  { id: 'j41', title: 'Tax Graduate – Big 4', company: 'PwC Ireland', country: 'Ireland', location: 'Dublin', type: 'Hybrid', jobCategory: 'Graduate Job', pay: 'Paid', field: 'Finance', experienceLevel: 'Entry', description: 'Join PwC\'s Graduate Tax Practice. Study support for AITI qualification. Gain experience with multinationals based in Ireland.', relevantDegrees: ['Accounting', 'Finance', 'Business', 'Law'], postedDate: new Date(Date.now() - 86400000 * 4).toISOString() },
  { id: 'j42', title: 'Cloud Engineering Intern', company: 'Microsoft Ireland', country: 'Ireland', location: 'Dublin', type: 'Hybrid', jobCategory: 'Internship', pay: 'Paid', field: 'Technology', experienceLevel: 'Entry', description: '12-week internship in Azure engineering at Microsoft\'s EMEA headquarters. Mentorship and possible return offer.', relevantDegrees: ['Computer Science', 'Software Engineering', 'Networking'], postedDate: new Date(Date.now() - 86400000 * 5).toISOString() },

  // ── Netherlands ────────────────────────────────────────────────────────────
  { id: 'j43', title: 'Growth Marketing – Full Time', company: 'Booking.com', country: 'Netherlands', location: 'Amsterdam', type: 'Hybrid', jobCategory: 'Full Time Job', pay: 'Paid', field: 'Marketing', experienceLevel: 'Entry', description: 'Run A/B experiments impacting millions of travellers. Data-driven team, international culture, relocation support.', relevantDegrees: ['Marketing', 'Business', 'Statistics', 'Economics'], postedDate: new Date(Date.now() - 86400000 * 3).toISOString() },
  { id: 'j44', title: 'Remote Content Writer', company: 'Miro', country: 'Netherlands', location: 'Remote (EU)', type: 'Remote', jobCategory: 'Remote Job', pay: 'Paid', field: 'Marketing', experienceLevel: 'Entry', description: 'Create technical and marketing content for a top-rated online collaboration tool. Fully async, global team.', relevantDegrees: ['English', 'Journalism', 'Marketing', 'Communications'], postedDate: new Date(Date.now() - 86400000 * 1).toISOString() },

  // ── Brazil ─────────────────────────────────────────────────────────────────
  { id: 'j45', title: 'FinTech Internship', company: 'Nubank', country: 'Brazil', location: 'São Paulo', type: 'Hybrid', jobCategory: 'Internship', pay: 'Paid', field: 'Finance', experienceLevel: 'Entry', description: 'Join the world\'s largest digital bank as an intern. Work on product, data, or engineering squads. English-language teams available.', relevantDegrees: ['Computer Science', 'Finance', 'Engineering', 'Business'], postedDate: new Date(Date.now() - 86400000 * 4).toISOString() },
  { id: 'j46', title: 'Software Engineer – Full Time', company: 'iFood', country: 'Brazil', location: 'São Paulo', type: 'Remote', jobCategory: 'Full Time Job', pay: 'Paid', field: 'Technology', experienceLevel: 'Entry', description: 'Build logistics and marketplace features for Latin America\'s #1 food delivery platform. Remote-first culture.', relevantDegrees: ['Computer Science', 'Software Engineering'], postedDate: new Date(Date.now() - 86400000 * 2).toISOString() },
];

// Marketplace starts empty — all listings are created by real users via the UI.
const generateMarketplaceItems = (_university: string): MarketplaceItem[] => [];

const generateStudyGroups = (university: string): StudyGroup[] => [
  // ── Subject groups ──────────────────────────────────────────────────────────
  {
    id: 'g1', type: 'Subject', subject: 'Mathematics', university,
    name: 'Calculus Study Circle',
    description: 'Work through problem sets together, share solved examples, and support each other before Calculus exams.',
    tags: ['Calculus', 'Maths'], memberCount: 0, activityStatus: 'Active', joined: false, createdBy: 'Nexora', messages: []
  },
  {
    id: 'g2', type: 'Subject', subject: 'Computer Science', university,
    name: 'Python & Algorithms',
    description: 'Practice coding challenges, review data structures, and tackle algorithm problems as a team.',
    tags: ['Python', 'Algorithms'], memberCount: 0, activityStatus: 'Active', joined: false, createdBy: 'Nexora', messages: []
  },
  {
    id: 'g3', type: 'Subject', subject: 'Law', university,
    name: 'Contract Law Revision',
    description: 'Discussion group for contract law concepts, case summaries, and essay technique for exams.',
    tags: ['Law', 'Contract'], memberCount: 0, activityStatus: 'Quiet', joined: false, createdBy: 'Nexora', messages: []
  },
  {
    id: 'g4', type: 'Subject', subject: 'Chemistry', university,
    name: 'Organic Chemistry Lab Prep',
    description: 'Share lab notes, walk through reaction mechanisms, and review past papers before practicals.',
    tags: ['Chemistry', 'Lab'], memberCount: 0, activityStatus: 'Active', joined: false, createdBy: 'Nexora', messages: []
  },
  {
    id: 'g5', type: 'Subject', subject: 'Business', university,
    name: 'Marketing Strategy Group',
    description: 'Case study discussions, group marketing plan reviews, and brand analysis for Business modules.',
    tags: ['Marketing', 'Business'], memberCount: 0, activityStatus: 'Active', joined: false, createdBy: 'Nexora', messages: []
  },
  {
    id: 'g6', type: 'Subject', subject: 'Medicine', university,
    name: 'Anatomy & Physiology',
    description: 'Weekly flashcard sessions and diagram reviews for anatomy and physiology modules.',
    tags: ['Medicine', 'Anatomy'], memberCount: 0, activityStatus: 'Active', joined: false, createdBy: 'Nexora', messages: []
  },
  {
    id: 'g7', type: 'Subject', subject: 'Economics', university,
    name: 'Macroeconomics Discussion',
    description: 'Discuss fiscal and monetary policy, Keynesian models, and how to structure exam essays.',
    tags: ['Economics', 'Macro'], memberCount: 0, activityStatus: 'Quiet', joined: false, createdBy: 'Nexora', messages: []
  },
  {
    id: 'g8', type: 'Subject', subject: 'Physics', university,
    name: 'Quantum Physics Peer Group',
    description: 'Work through problem sheets together and clarify difficult quantum mechanics concepts.',
    tags: ['Physics', 'Quantum'], memberCount: 0, activityStatus: 'Active', joined: false, createdBy: 'Nexora', messages: []
  },
  {
    id: 'g9', type: 'Subject', subject: 'Psychology', university,
    name: 'Cognitive Psychology Notes',
    description: 'Share lecture notes, discuss memory and perception studies, and quiz each other before tests.',
    tags: ['Psychology', 'Cognitive'], memberCount: 0, activityStatus: 'Active', joined: false, createdBy: 'Nexora', messages: []
  },
  // ── Degree groups ───────────────────────────────────────────────────────────
  {
    id: 'g10', type: 'Degree', subject: 'Computer Science', degree: 'Computer Science', university,
    name: 'Computer Science Majors',
    description: 'All CS students welcome — share internship tips, module advice, and career resources.',
    tags: ['CS', 'Degree'], memberCount: 0, activityStatus: 'Active', joined: false, createdBy: 'Nexora', messages: []
  },
  {
    id: 'g11', type: 'Degree', subject: 'Business', degree: 'Business Administration', university,
    name: 'Business & Management Cohort',
    description: 'Connect with fellow Business students for course advice, placement tips, and group projects.',
    tags: ['Business', 'Degree'], memberCount: 0, activityStatus: 'Active', joined: false, createdBy: 'Nexora', messages: []
  },
  {
    id: 'g12', type: 'Degree', subject: 'Law', degree: 'Law', university,
    name: 'Law Society Study Hub',
    description: 'LLB and LLM students sharing mooting tips, case notes, and revision strategies.',
    tags: ['Law', 'Degree'], memberCount: 0, activityStatus: 'Active', joined: false, createdBy: 'Nexora', messages: []
  },
  // ── University-wide groups ──────────────────────────────────────────────────
  {
    id: 'g13', type: 'University', subject: 'General', university,
    name: 'International Students Connect',
    description: 'A welcoming space for international students to share advice on visas, accommodation, and campus life.',
    tags: ['International', 'Community'], memberCount: 0, activityStatus: 'Active', joined: false, createdBy: 'Nexora', messages: []
  },
  {
    id: 'g14', type: 'University', subject: 'General', university,
    name: 'Exam Season Support',
    description: 'Motivation, study tips, accountability partners, and wellbeing resources for exam period.',
    tags: ['Exams', 'Wellbeing'], memberCount: 0, activityStatus: 'Active', joined: false, createdBy: 'Nexora', messages: []
  },
  {
    id: 'g15', type: 'University', subject: 'Career', university,
    name: 'Graduate Job Hunters',
    description: 'Share job leads, review each other\'s CVs, and prep for graduate scheme interviews together.',
    tags: ['Jobs', 'Career'], memberCount: 0, activityStatus: 'Active', joined: false, createdBy: 'Nexora', messages: []
  },
];

export function initializeMockData(university: string) {
  // v7: all fake seed data removed — users populate everything themselves.
  if (!getStorage('unihub_mock_initialized_v7', false)) {
    setStorage('unihub_conversations', []);
  }

  const isInitialized = getStorage('unihub_mock_initialized_v7', false);
  if (isInitialized) return;

  // Everything starts empty — let real users fill it in.
  setStorage('unihub_assignments', []);
  setStorage('unihub_notes', []);
  setStorage('unihub_marketplace', generateMarketplaceItems(university));
  setStorage('unihub_study_groups', generateStudyGroups(university));

  setStorage('unihub_mock_initialized_v7', true);
}
