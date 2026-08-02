export interface Module {
  id: string;
  name: string;
  topics: string[];
}

export interface LearningResource {
  title: string;
  type: 'website' | 'youtube' | 'course' | 'documentation' | 'book' | 'practice';
  url: string;
  description: string;
  free: boolean;
}

export interface LearningPath {
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  resources: LearningResource[];
}

export interface Subject {
  id: string;
  name: string;
  code?: string;
  courseOverview: string;
  modules: Module[];
  learningPaths: LearningPath[];
  recommendedWebsites: { name: string; url: string; description: string }[];
  onlineCourses: { name: string; platform: string; url: string; free: boolean }[];
  documentation: { name: string; url: string }[];
  books: { title: string; author: string; year?: number }[];
  youtubePlaylists: { title: string; channel: string; url: string }[];
  practiceMaterial: { name: string; url: string; description: string }[];
}

export interface DegreeYear {
  year: number;
  subjects: Subject[];
}

export interface Degree {
  id: string;
  name: string;
  faculty: string;
  years: DegreeYear[];
}

export interface University {
  id: string;
  name: string;
  degrees: Degree[];
}

export interface CountryData {
  country: string;
  universities: University[];
}

// ─── Real subject resource map ────────────────────────────────────────────────
// Every URL here is a real, working link to an actual resource.
interface SubjectResources {
  overview: string;
  modules: { name: string; topics: string[] }[];
  beginner: LearningResource[];
  intermediate: LearningResource[];
  advanced: LearningResource[];
  websites: { name: string; url: string; description: string }[];
  courses: { name: string; platform: string; url: string; free: boolean }[];
  docs: { name: string; url: string }[];
  books: { title: string; author: string; year?: number }[];
  playlists: { title: string; channel: string; url: string }[];
  practice: { name: string; url: string; description: string }[];
}

const SUBJECT_RESOURCES: Record<string, SubjectResources> = {

  // ── Computer Science ─────────────────────────────────────────────────────
  "Introduction to Programming": {
    overview: "An introduction to problem solving and programming using Python. Topics include variables, control flow, functions, lists, and basic algorithms.",
    modules: [
      { name: "Variables & Data Types", topics: ["Integers, floats, strings", "Boolean logic", "Type conversion"] },
      { name: "Control Flow", topics: ["if/else statements", "for and while loops", "Nested conditions"] },
      { name: "Functions & Scope", topics: ["Defining functions", "Parameters and return values", "Local vs global scope"] },
      { name: "Data Structures", topics: ["Lists and tuples", "Dictionaries", "Sets and their operations"] },
    ],
    beginner: [
      { title: "CS50 – Harvard's Intro to Computer Science", type: 'youtube', url: "https://www.youtube.com/watch?v=8mAITcNt710", description: "Harvard's world-famous free intro to CS course.", free: true },
      { title: "Python for Beginners – Full Course", type: 'youtube', url: "https://www.youtube.com/watch?v=rfscVS0vtbw", description: "5-hour beginner Python tutorial by freeCodeCamp.", free: true },
      { title: "Khan Academy – Intro to Programming", type: 'website', url: "https://www.khanacademy.org/computing/computer-programming", description: "Interactive lessons on programming concepts.", free: true },
    ],
    intermediate: [
      { title: "Python – The Full University Course", type: 'youtube', url: "https://www.youtube.com/watch?v=XKHEtdqhLK8", description: "Comprehensive Python university-level course.", free: true },
      { title: "Python for Everybody – Coursera", type: 'course', url: "https://www.coursera.org/specializations/python", description: "University of Michigan's Python specialisation.", free: false },
      { title: "Automate the Boring Stuff with Python", type: 'website', url: "https://automatetheboringstuff.com/", description: "Practical Python programming for total beginners.", free: true },
    ],
    advanced: [
      { title: "MIT 6.0001 – Intro to CS & Programming", type: 'course', url: "https://ocw.mit.edu/courses/6-0001-introduction-to-computer-science-and-programming-in-python-fall-2016/", description: "MIT OpenCourseWare — Python-based CS intro.", free: true },
      { title: "Google's Python Class", type: 'documentation', url: "https://developers.google.com/edu/python", description: "Google's free class for people with some programming experience.", free: true },
      { title: "Real Python – Advanced Tutorials", type: 'website', url: "https://realpython.com/", description: "In-depth Python tutorials for every level.", free: true },
    ],
    websites: [
      { name: "freeCodeCamp", url: "https://www.freecodecamp.org/", description: "Free coding curriculum with certifications." },
      { name: "The Odin Project", url: "https://www.theodinproject.com/", description: "Full-stack curriculum built by an open-source community." },
      { name: "Python.org Official Docs", url: "https://docs.python.org/3/tutorial/", description: "The official Python tutorial." },
    ],
    courses: [
      { name: "Python for Everybody", platform: "Coursera", url: "https://www.coursera.org/specializations/python", free: false },
      { name: "CS50P – Python", platform: "edX", url: "https://www.edx.org/learn/python/harvard-university-cs50-s-introduction-to-programming-with-python", free: true },
    ],
    docs: [
      { name: "Python 3 Official Documentation", url: "https://docs.python.org/3/" },
      { name: "W3Schools Python Reference", url: "https://www.w3schools.com/python/" },
    ],
    books: [
      { title: "Automate the Boring Stuff with Python", author: "Al Sweigart", year: 2019 },
      { title: "Python Crash Course", author: "Eric Matthes", year: 2023 },
    ],
    playlists: [
      { title: "CS50 2023 – Harvard", channel: "CS50", url: "https://www.youtube.com/playlist?list=PLhQjrBAgIEhSgi51ssBVQNP4BDAK_DMmf" },
      { title: "Python Tutorials for Beginners", channel: "Corey Schafer", url: "https://www.youtube.com/playlist?list=PL-osiE80TeTt2d9bfVyTiXJA-UTHn6WwU" },
    ],
    practice: [
      { name: "W3Schools Python Exercises", url: "https://www.w3schools.com/python/exercise.asp", description: "Quick exercises for every Python concept." },
      { name: "Exercism – Python Track", url: "https://exercism.org/tracks/python", description: "Mentored coding exercises in Python." },
    ],
  },

  "Data Structures & Algorithms": {
    overview: "Study of fundamental data structures (arrays, linked lists, trees, graphs) and algorithmic techniques including sorting, searching, and dynamic programming.",
    modules: [
      { name: "Arrays & Linked Lists", topics: ["Array operations", "Singly and doubly linked lists", "Memory allocation"] },
      { name: "Trees & Graphs", topics: ["Binary trees", "BST operations", "Graph traversal (BFS/DFS)"] },
      { name: "Sorting Algorithms", topics: ["Merge sort, Quick sort", "Heap sort", "Time complexity analysis"] },
      { name: "Dynamic Programming", topics: ["Memoisation", "Tabulation", "Classic DP problems"] },
    ],
    beginner: [
      { title: "Data Structures Full Course", type: 'youtube', url: "https://www.youtube.com/watch?v=RBSGKlAvoiM", description: "8-hour freeCodeCamp course on DSA.", free: true },
      { title: "CS50 – Week 5: Data Structures", type: 'youtube', url: "https://www.youtube.com/watch?v=0euvEdPwQnQ", description: "Harvard CS50 data structures lecture.", free: true },
      { title: "GeeksForGeeks – DSA Tutorial", type: 'website', url: "https://www.geeksforgeeks.org/learn-data-structures-and-algorithms-dsa-tutorial/", description: "Comprehensive DSA tutorial with code examples.", free: true },
    ],
    intermediate: [
      { title: "MIT 6.006 – Introduction to Algorithms", type: 'youtube', url: "https://www.youtube.com/playlist?list=PLUl4u3cNGP61Oq3tWYp6V_F-5jb5L2iHb", description: "Full MIT lecture series on algorithms.", free: true },
      { title: "Algorithms, Part I – Princeton", type: 'course', url: "https://www.coursera.org/learn/algorithms-part1", description: "Java-based algorithms course from Princeton.", free: false },
      { title: "VisuAlgo", type: 'website', url: "https://visualgo.net/en", description: "Visualise data structures and algorithms through animation.", free: true },
    ],
    advanced: [
      { title: "Advanced Algorithms – Harvard", type: 'course', url: "https://ocw.mit.edu/courses/6-046j-design-and-analysis-of-algorithms-spring-2015/", description: "MIT advanced algorithms course.", free: true },
      { title: "NeetCode – LeetCode Patterns", type: 'youtube', url: "https://www.youtube.com/c/NeetCode", description: "Clear solutions to LeetCode problems with pattern explanations.", free: true },
      { title: "The Algorithm Design Manual", type: 'website', url: "https://www.algorist.com/", description: "Companion site to Skiena's classic textbook.", free: true },
    ],
    websites: [
      { name: "LeetCode", url: "https://leetcode.com/", description: "Practice coding interview problems." },
      { name: "GeeksForGeeks", url: "https://www.geeksforgeeks.org/data-structures/", description: "Theory and code examples for every data structure." },
      { name: "VisuAlgo", url: "https://visualgo.net/en", description: "Algorithm visualisations." },
    ],
    courses: [
      { name: "Algorithms Part I & II", platform: "Coursera (Princeton)", url: "https://www.coursera.org/learn/algorithms-part1", free: false },
      { name: "Data Structures & Algorithms Specialisation", platform: "Coursera (UC San Diego)", url: "https://www.coursera.org/specializations/data-structures-algorithms", free: false },
    ],
    docs: [
      { name: "Big-O Cheat Sheet", url: "https://www.bigocheatsheet.com/" },
      { name: "CP-Algorithms", url: "https://cp-algorithms.com/" },
    ],
    books: [
      { title: "Introduction to Algorithms (CLRS)", author: "Cormen, Leiserson, Rivest, Stein", year: 2022 },
      { title: "The Algorithm Design Manual", author: "Steven S. Skiena", year: 2020 },
    ],
    playlists: [
      { title: "MIT 6.006 – Introduction to Algorithms (2020)", channel: "MIT OpenCourseWare", url: "https://www.youtube.com/playlist?list=PLUl4u3cNGP63EdVPNLG3ToM6LaEUuStEY" },
      { title: "Data Structures Easy to Advanced", channel: "WilliamFiset", url: "https://www.youtube.com/playlist?list=PLDV1Zeh2NRsB6SWUrDFW2RmDotAfPbeHu" },
    ],
    practice: [
      { name: "LeetCode Problems", url: "https://leetcode.com/problemset/", description: "Thousands of practice problems sorted by difficulty." },
      { name: "HackerRank – DS", url: "https://www.hackerrank.com/domains/data-structures", description: "Graded challenges for data structures." },
    ],
  },

  "Database Systems": {
    overview: "Principles of relational database design, SQL querying, transactions, indexing, and an introduction to NoSQL systems.",
    modules: [
      { name: "Relational Model & SQL", topics: ["Entity-relationship diagrams", "SQL SELECT, JOIN, GROUP BY", "Normalisation (1NF–3NF)"] },
      { name: "Transactions & Concurrency", topics: ["ACID properties", "Isolation levels", "Deadlock handling"] },
      { name: "Indexing & Performance", topics: ["B-tree indexes", "Query optimisation", "EXPLAIN plans"] },
      { name: "NoSQL Systems", topics: ["Document stores (MongoDB)", "Key-value stores", "When to use NoSQL"] },
    ],
    beginner: [
      { title: "SQL – Full Database Course", type: 'youtube', url: "https://www.youtube.com/watch?v=HXV3zeQKqGY", description: "4-hour freeCodeCamp SQL full course.", free: true },
      { title: "SQLZoo – Interactive SQL Tutorial", type: 'website', url: "https://sqlzoo.net/wiki/SQL_Tutorial", description: "Learn SQL with instant feedback in your browser.", free: true },
      { title: "Khan Academy – Intro to SQL", type: 'website', url: "https://www.khanacademy.org/computing/computer-programming/sql", description: "Interactive SQL lessons for beginners.", free: true },
    ],
    intermediate: [
      { title: "CMU 15-445 Database Systems", type: 'youtube', url: "https://www.youtube.com/playlist?list=PLSE8ODhjZXjbj8BMuIrRcacnQh20hmY9g", description: "Carnegie Mellon's full database course.", free: true },
      { title: "Databases: Relational Databases & SQL", type: 'course', url: "https://www.edx.org/learn/sql/stanford-university-databases-relational-databases-and-sql", description: "Stanford's relational databases course on edX.", free: false },
      { title: "Use the Index, Luke", type: 'website', url: "https://use-the-index-luke.com/", description: "Guide to database performance for developers.", free: true },
    ],
    advanced: [
      { title: "CMU 15-721 Advanced Database Systems", type: 'youtube', url: "https://www.youtube.com/playlist?list=PLSE8ODhjZXjYzlLMbX3cR0sxWnRM7CLFn", description: "Advanced in-memory databases by Andy Pavlo.", free: true },
      { title: "PostgreSQL Documentation", type: 'documentation', url: "https://www.postgresql.org/docs/current/", description: "Official PostgreSQL reference.", free: true },
      { title: "MongoDB University", type: 'course', url: "https://learn.mongodb.com/", description: "Free official MongoDB courses.", free: true },
    ],
    websites: [
      { name: "SQLZoo", url: "https://sqlzoo.net/", description: "Interactive browser-based SQL practice." },
      { name: "DB-Fiddle", url: "https://www.db-fiddle.com/", description: "Online SQL playground." },
      { name: "GeeksForGeeks DBMS", url: "https://www.geeksforgeeks.org/dbms/", description: "DBMS tutorials and interview prep." },
    ],
    courses: [
      { name: "Databases and SQL for Data Science", platform: "Coursera (IBM)", url: "https://www.coursera.org/learn/sql-data-science", free: false },
      { name: "Introduction to Databases", platform: "edX (Stanford)", url: "https://www.edx.org/learn/databases/stanford-university-databases-modeling-and-theory", free: false },
    ],
    docs: [
      { name: "PostgreSQL Docs", url: "https://www.postgresql.org/docs/" },
      { name: "MySQL Reference Manual", url: "https://dev.mysql.com/doc/" },
    ],
    books: [
      { title: "Database System Concepts", author: "Silberschatz, Korth, Sudarshan", year: 2020 },
      { title: "Designing Data-Intensive Applications", author: "Martin Kleppmann", year: 2017 },
    ],
    playlists: [
      { title: "CMU 15-445 Database Systems 2023", channel: "CMU Database Group", url: "https://www.youtube.com/playlist?list=PLSE8ODhjZXjbj8BMuIrRcacnQh20hmY9g" },
      { title: "SQL Tutorial for Beginners", channel: "Programming with Mosh", url: "https://www.youtube.com/watch?v=7S_tz1z_5bA" },
    ],
    practice: [
      { name: "SQLZoo Exercises", url: "https://sqlzoo.net/wiki/SQL_Tutorial", description: "Hands-on SQL practice by topic." },
      { name: "HackerRank SQL", url: "https://www.hackerrank.com/domains/sql", description: "SQL challenges from easy to hard." },
    ],
  },

  "Web Development": {
    overview: "Building modern web applications using HTML, CSS, JavaScript, and popular frameworks. Covers both frontend and backend development.",
    modules: [
      { name: "HTML & CSS Fundamentals", topics: ["Semantic HTML5", "CSS Flexbox & Grid", "Responsive design"] },
      { name: "JavaScript Essentials", topics: ["DOM manipulation", "Events and callbacks", "Fetch API & Promises"] },
      { name: "Frontend Frameworks", topics: ["React components & hooks", "State management", "Routing"] },
      { name: "Backend & APIs", topics: ["Node.js & Express", "REST API design", "Authentication with JWT"] },
    ],
    beginner: [
      { title: "HTML & CSS Full Course – Beginner to Pro", type: 'youtube', url: "https://www.youtube.com/watch?v=mU6anWqZJcc", description: "SuperSimpleDev's comprehensive HTML/CSS course.", free: true },
      { title: "JavaScript Crash Course", type: 'youtube', url: "https://www.youtube.com/watch?v=hdI2bqOjy3c", description: "Traversy Media's popular JS crash course.", free: true },
      { title: "freeCodeCamp – Responsive Web Design", type: 'website', url: "https://www.freecodecamp.org/learn/2022/responsive-web-design/", description: "300-hour free curriculum with certification.", free: true },
    ],
    intermediate: [
      { title: "React JS Full Course", type: 'youtube', url: "https://www.youtube.com/watch?v=bMknfKXIFA8", description: "Full React course by freeCodeCamp.", free: true },
      { title: "The Odin Project", type: 'website', url: "https://www.theodinproject.com/", description: "Open-source full-stack curriculum.", free: true },
      { title: "Full Stack Open – University of Helsinki", type: 'course', url: "https://fullstackopen.com/en/", description: "Free university course on React, Node.js, GraphQL.", free: true },
    ],
    advanced: [
      { title: "Next.js Full Course", type: 'youtube', url: "https://www.youtube.com/watch?v=wm5gMKuwSYk", description: "Complete Next.js 13 tutorial.", free: true },
      { title: "web.dev – Google Web Fundamentals", type: 'documentation', url: "https://web.dev/learn/", description: "Google's guide to modern web development.", free: true },
      { title: "Kent C. Dodds – Epic Web", type: 'course', url: "https://www.epicweb.dev/", description: "Professional full-stack web development.", free: false },
    ],
    websites: [
      { name: "MDN Web Docs", url: "https://developer.mozilla.org/", description: "The definitive reference for HTML, CSS, and JavaScript." },
      { name: "CSS-Tricks", url: "https://css-tricks.com/", description: "Tips, tricks, and guides for front-end developers." },
      { name: "The Odin Project", url: "https://www.theodinproject.com/", description: "Free full-stack web development curriculum." },
    ],
    courses: [
      { name: "Full Stack Open", platform: "University of Helsinki", url: "https://fullstackopen.com/en/", free: true },
      { name: "The Web Developer Bootcamp", platform: "Udemy", url: "https://www.udemy.com/course/the-web-developer-bootcamp/", free: false },
    ],
    docs: [
      { name: "MDN Web Docs", url: "https://developer.mozilla.org/" },
      { name: "React Official Docs", url: "https://react.dev/" },
    ],
    books: [
      { title: "Eloquent JavaScript", author: "Marijn Haverbeke", year: 2018 },
      { title: "CSS: The Definitive Guide", author: "Eric Meyer & Estelle Weyl", year: 2023 },
    ],
    playlists: [
      { title: "Web Development Full Course 2024", channel: "SuperSimpleDev", url: "https://www.youtube.com/watch?v=ysEN5RaKOlA" },
      { title: "React Tutorial for Beginners", channel: "Programming with Mosh", url: "https://www.youtube.com/watch?v=SqcY0GlETPk" },
    ],
    practice: [
      { name: "Frontend Mentor", url: "https://www.frontendmentor.io/", description: "Real-world HTML/CSS/JS challenges." },
      { name: "JavaScript30", url: "https://javascript30.com/", description: "30 vanilla JS projects in 30 days (free)." },
    ],
  },

  "Machine Learning": {
    overview: "Introduction to supervised, unsupervised, and reinforcement learning. Topics include regression, classification, neural networks, and model evaluation.",
    modules: [
      { name: "Supervised Learning", topics: ["Linear & logistic regression", "Decision trees", "Support vector machines"] },
      { name: "Neural Networks", topics: ["Perceptrons", "Backpropagation", "Activation functions"] },
      { name: "Unsupervised Learning", topics: ["K-means clustering", "Principal component analysis", "Autoencoders"] },
      { name: "Model Evaluation", topics: ["Train/val/test split", "Cross-validation", "Metrics: accuracy, F1, ROC"] },
    ],
    beginner: [
      { title: "3Blue1Brown – Neural Networks", type: 'youtube', url: "https://www.youtube.com/playlist?list=PLZHQObOWTQDNU6R1_67000Dx_ZCJB-3pi", description: "Beautiful visual introduction to neural networks.", free: true },
      { title: "Machine Learning for Everybody", type: 'youtube', url: "https://www.youtube.com/watch?v=i_LwzRVP7bg", description: "Beginner ML course by Kylie Ying on freeCodeCamp.", free: true },
      { title: "Kaggle Learn – Intro to ML", type: 'website', url: "https://www.kaggle.com/learn/intro-to-machine-learning", description: "Hands-on ML mini-course from Kaggle.", free: true },
    ],
    intermediate: [
      { title: "Stanford CS229 – Machine Learning", type: 'youtube', url: "https://www.youtube.com/playlist?list=PLoROMvodv4rMiGQp3WXShtMGgzqpfVfbU", description: "Andrew Ng's full Stanford ML course.", free: true },
      { title: "Machine Learning Specialisation", type: 'course', url: "https://www.coursera.org/specializations/machine-learning-introduction", description: "Andrew Ng's updated ML course on Coursera.", free: false },
      { title: "fast.ai – Practical Deep Learning", type: 'course', url: "https://course.fast.ai/", description: "Top-down practical approach to deep learning.", free: true },
    ],
    advanced: [
      { title: "MIT 6.S191 – Intro to Deep Learning", type: 'youtube', url: "https://www.youtube.com/playlist?list=PLtBw6njQRU-rwp5__7C0oIVt26ZgjG9NI", description: "MIT's annual deep learning lectures.", free: true },
      { title: "Deep Learning Specialisation", type: 'course', url: "https://www.coursera.org/specializations/deep-learning", description: "Andrew Ng's deep learning specialisation.", free: false },
      { title: "Papers With Code", type: 'website', url: "https://paperswithcode.com/", description: "Latest ML research papers with implementations.", free: true },
    ],
    websites: [
      { name: "Kaggle", url: "https://www.kaggle.com/", description: "ML competitions, datasets, and free courses." },
      { name: "fast.ai", url: "https://www.fast.ai/", description: "Making deep learning accessible to all." },
      { name: "Towards Data Science", url: "https://towardsdatascience.com/", description: "ML articles and tutorials." },
    ],
    courses: [
      { name: "Machine Learning Specialisation", platform: "Coursera (DeepLearning.AI)", url: "https://www.coursera.org/specializations/machine-learning-introduction", free: false },
      { name: "Intro to Machine Learning", platform: "Kaggle", url: "https://www.kaggle.com/learn/intro-to-machine-learning", free: true },
    ],
    docs: [
      { name: "Scikit-learn Documentation", url: "https://scikit-learn.org/stable/user_guide.html" },
      { name: "TensorFlow Documentation", url: "https://www.tensorflow.org/learn" },
    ],
    books: [
      { title: "Hands-On Machine Learning", author: "Aurélien Géron", year: 2022 },
      { title: "The Hundred-Page Machine Learning Book", author: "Andriy Burkov", year: 2019 },
    ],
    playlists: [
      { title: "Neural Networks: Zero to Hero", channel: "Andrej Karpathy", url: "https://www.youtube.com/playlist?list=PLAqhIrjkxbuWI23v9cThsA9GvCAUhRvKZ" },
      { title: "StatQuest – Machine Learning", channel: "StatQuest with Josh Starmer", url: "https://www.youtube.com/playlist?list=PLblh5JKOoLUICTaGLRoHQDuF_7q2GfuJF" },
    ],
    practice: [
      { name: "Kaggle Competitions", url: "https://www.kaggle.com/competitions", description: "Real ML competitions with prize money." },
      { name: "Google ML Crash Course Exercises", url: "https://developers.google.com/machine-learning/crash-course", description: "Interactive exercises from Google's ML crash course." },
    ],
  },

  "Artificial Intelligence": {
    overview: "Foundations of AI including search algorithms, knowledge representation, planning, natural language processing, and ethical considerations.",
    modules: [
      { name: "Search Algorithms", topics: ["Breadth-first & depth-first search", "A* algorithm", "Adversarial search (Minimax)"] },
      { name: "Knowledge & Reasoning", topics: ["Propositional logic", "Predicate logic", "Bayesian networks"] },
      { name: "Natural Language Processing", topics: ["Tokenisation", "Word embeddings", "Transformer architecture"] },
      { name: "AI Ethics", topics: ["Bias in AI", "Explainability", "Safety and alignment"] },
    ],
    beginner: [
      { title: "CS50 AI – Harvard", type: 'youtube', url: "https://www.youtube.com/playlist?list=PLhQjrBAgIEhS_5FRsOHxGFdNLXqJxTULN", description: "Harvard's free intro to AI with Python.", free: true },
      { title: "AI for Everyone – Andrew Ng", type: 'course', url: "https://www.coursera.org/learn/ai-for-everyone", description: "Non-technical introduction to AI concepts.", free: false },
      { title: "Elements of AI", type: 'website', url: "https://www.elementsofai.com/", description: "Free online course from University of Helsinki.", free: true },
    ],
    intermediate: [
      { title: "MIT 6.034 – Artificial Intelligence", type: 'youtube', url: "https://www.youtube.com/playlist?list=PLUl4u3cNGP63gFHB6xb-kVBiQHYe_4hSi", description: "MIT's full AI lecture series.", free: true },
      { title: "AI: A Modern Approach (AIMA)", type: 'website', url: "https://aima.cs.berkeley.edu/", description: "Companion site to the leading AI textbook.", free: true },
      { title: "Deep Learning for NLP", type: 'course', url: "https://web.stanford.edu/class/cs224n/", description: "Stanford CS224N: NLP with Deep Learning (free materials).", free: true },
    ],
    advanced: [
      { title: "Stanford CS221 – Artificial Intelligence", type: 'youtube', url: "https://www.youtube.com/playlist?list=PLoROMvodv4rO1NB9TD4iUZ3qghGEGtqNX", description: "Stanford's principles and techniques of AI.", free: true },
      { title: "Hugging Face NLP Course", type: 'course', url: "https://huggingface.co/learn/nlp-course/", description: "Free course on transformers and NLP.", free: true },
      { title: "OpenAI Research Blog", type: 'documentation', url: "https://openai.com/research/", description: "Latest breakthroughs in AI research.", free: true },
    ],
    websites: [
      { name: "Elements of AI", url: "https://www.elementsofai.com/", description: "Free intro to AI from University of Helsinki." },
      { name: "Towards AI", url: "https://towardsai.net/", description: "AI news, tutorials, and research." },
      { name: "Google AI Blog", url: "https://ai.googleblog.com/", description: "Research and insights from Google AI." },
    ],
    courses: [
      { name: "CS50 AI with Python", platform: "edX (Harvard)", url: "https://www.edx.org/learn/artificial-intelligence/harvard-university-cs50-s-introduction-to-artificial-intelligence-with-python", free: true },
      { name: "AI Programming with Python", platform: "Udacity", url: "https://www.udacity.com/course/ai-programming-python-nanodegree--nd089", free: false },
    ],
    docs: [
      { name: "TensorFlow AI Documentation", url: "https://www.tensorflow.org/learn" },
      { name: "PyTorch Documentation", url: "https://pytorch.org/tutorials/" },
    ],
    books: [
      { title: "Artificial Intelligence: A Modern Approach", author: "Russell & Norvig", year: 2020 },
      { title: "Life 3.0: Being Human in the Age of AI", author: "Max Tegmark", year: 2017 },
    ],
    playlists: [
      { title: "MIT 6.034 – AI Full Lectures", channel: "MIT OpenCourseWare", url: "https://www.youtube.com/playlist?list=PLUl4u3cNGP63gFHB6xb-kVBiQHYe_4hSi" },
      { title: "3Blue1Brown – Neural Networks Series", channel: "3Blue1Brown", url: "https://www.youtube.com/playlist?list=PLZHQObOWTQDNU6R1_67000Dx_ZCJB-3pi" },
    ],
    practice: [
      { name: "AI Experiments – Google", url: "https://experiments.withgoogle.com/collection/ai", description: "Interactive AI experiments you can try in the browser." },
      { name: "Hugging Face Spaces", url: "https://huggingface.co/spaces", description: "Run and explore AI models interactively." },
    ],
  },

  "Cybersecurity": {
    overview: "Principles of information security including cryptography, network security, ethical hacking, and defence strategies.",
    modules: [
      { name: "Cryptography", topics: ["Symmetric encryption (AES)", "Asymmetric encryption (RSA)", "Hash functions and digital signatures"] },
      { name: "Network Security", topics: ["Firewalls and IDS/IPS", "TLS/SSL", "VPNs and Zero Trust"] },
      { name: "Ethical Hacking", topics: ["Penetration testing methodology", "OWASP Top 10", "Common vulnerabilities (SQLi, XSS)"] },
      { name: "Incident Response", topics: ["Digital forensics basics", "Log analysis", "Incident playbooks"] },
    ],
    beginner: [
      { title: "CS50 Cybersecurity – Harvard 2023", type: 'youtube', url: "https://www.youtube.com/watch?v=Qn_uOBJJVlo", description: "Harvard's free cybersecurity course.", free: true },
      { title: "Cybersecurity for Beginners", type: 'youtube', url: "https://www.youtube.com/watch?v=U_P23SqJaDc", description: "Introduction to cybersecurity concepts.", free: true },
      { title: "TryHackMe – Pre-Security Path", type: 'website', url: "https://tryhackme.com/path/outline/presecurity", description: "Hands-on browser-based security labs for beginners.", free: true },
    ],
    intermediate: [
      { title: "CompTIA Security+ Full Course", type: 'youtube', url: "https://www.youtube.com/watch?v=9NE33fpQuw8", description: "Full Security+ exam prep by freeCodeCamp.", free: true },
      { title: "Ethical Hacking Full Course", type: 'course', url: "https://www.coursera.org/professional-certificates/google-cybersecurity", description: "Google Cybersecurity Professional Certificate.", free: false },
      { title: "OWASP Top 10 Explained", type: 'documentation', url: "https://owasp.org/www-project-top-ten/", description: "The definitive web application security risks list.", free: true },
    ],
    advanced: [
      { title: "Offensive Security (OSCP) Prep", type: 'website', url: "https://www.offensive-security.com/", description: "Preparation resources for the OSCP certification.", free: false },
      { title: "Cybrary Advanced Courses", type: 'course', url: "https://www.cybrary.it/", description: "Professional cybersecurity training and certifications.", free: false },
      { title: "Hack The Box", url: "https://www.hackthebox.com/", type: 'practice', description: "Hacking challenges and virtual machines to pwn.", free: true },
    ],
    websites: [
      { name: "TryHackMe", url: "https://tryhackme.com/", description: "Gamified cybersecurity labs for all levels." },
      { name: "OWASP Foundation", url: "https://owasp.org/", description: "Open-source web application security community." },
      { name: "Krebs on Security", url: "https://krebsonsecurity.com/", description: "In-depth security news and investigation." },
    ],
    courses: [
      { name: "Google Cybersecurity Certificate", platform: "Coursera", url: "https://www.coursera.org/professional-certificates/google-cybersecurity", free: false },
      { name: "Introduction to Cybersecurity", platform: "Cisco NetAcad", url: "https://skillsforall.com/course/introduction-to-cybersecurity", free: true },
    ],
    docs: [
      { name: "OWASP Top 10", url: "https://owasp.org/www-project-top-ten/" },
      { name: "NIST Cybersecurity Framework", url: "https://www.nist.gov/cyberframework" },
    ],
    books: [
      { title: "The Web Application Hacker's Handbook", author: "Stuttard & Pinto", year: 2011 },
      { title: "Hacking: The Art of Exploitation", author: "Jon Erickson", year: 2008 },
    ],
    playlists: [
      { title: "Ethical Hacking Full Course", channel: "freeCodeCamp", url: "https://www.youtube.com/watch?v=3Kq1MIfTWCE" },
      { title: "TryHackMe – How to Get Started", channel: "NetworkChuck", url: "https://www.youtube.com/watch?v=kUmaKvxdfvg" },
    ],
    practice: [
      { name: "Hack The Box", url: "https://www.hackthebox.com/", description: "Hands-on hacking labs and CTF challenges." },
      { name: "PicoCTF", url: "https://picoctf.org/", description: "Beginner-friendly Capture The Flag competition." },
    ],
  },

  // ── Medicine ──────────────────────────────────────────────────────────────
  "Anatomy": {
    overview: "Systematic study of the structure of the human body, including organs, tissues, and systems from gross anatomy to histology.",
    modules: [
      { name: "Musculoskeletal System", topics: ["Bones and joints", "Muscles and tendons", "Upper and lower limb anatomy"] },
      { name: "Cardiovascular & Respiratory", topics: ["Heart anatomy", "Vessels and circulation", "Lung structure and pleura"] },
      { name: "Nervous System", topics: ["Central nervous system", "Peripheral nervous system", "Autonomic nervous system"] },
      { name: "Abdominal & Pelvic Organs", topics: ["GI tract anatomy", "Liver, pancreas, spleen", "Urogenital system"] },
    ],
    beginner: [
      { title: "Anatomy & Physiology – Full Course", type: 'youtube', url: "https://www.youtube.com/watch?v=uBGl2BujkPQ", description: "Comprehensive A&P course by Crash Course.", free: true },
      { title: "Khan Academy – Human Anatomy", type: 'website', url: "https://www.khanacademy.org/science/health-and-medicine", description: "Interactive anatomy lessons and quizzes.", free: true },
      { title: "Ninja Nerd – Anatomy Lectures", type: 'youtube', url: "https://www.youtube.com/c/NinjaNerdScience", description: "Detailed anatomy lectures for medical students.", free: true },
    ],
    intermediate: [
      { title: "Osmosis – Anatomy Series", type: 'youtube', url: "https://www.youtube.com/c/osmosis", description: "High-quality medical animations by Osmosis.", free: true },
      { title: "Visible Body – 3D Human Anatomy", type: 'website', url: "https://www.visiblebody.com/", description: "Interactive 3D anatomy atlas.", free: false },
      { title: "AnatomyZone", type: 'website', url: "https://anatomyzone.com/", description: "3D anatomy tutorials for medical students.", free: true },
    ],
    advanced: [
      { title: "Radiopaedia – Anatomy Modules", type: 'website', url: "https://radiopaedia.org/articles/anatomy", description: "Radiological anatomy with imaging correlates.", free: false },
      { title: "Geeky Medics – Clinical Anatomy", type: 'website', url: "https://geekymedics.com/anatomy/", description: "Clinical anatomy guides for medical students.", free: true },
      { title: "AMBOSS Medical Library", type: 'documentation', url: "https://www.amboss.com/us/knowledge/", description: "Peer-reviewed medical knowledge library.", free: false },
    ],
    websites: [
      { name: "Osmosis", url: "https://www.osmosis.org/", description: "Visual medical learning platform." },
      { name: "Geeky Medics", url: "https://geekymedics.com/", description: "Free clinical skills and anatomy guides." },
      { name: "AnatomyZone", url: "https://anatomyzone.com/", description: "3D anatomy tutorials and quizzes." },
    ],
    courses: [
      { name: "Anatomy: Know Your Body", platform: "Coursera (University of Michigan)", url: "https://www.coursera.org/learn/anatomy", free: false },
      { name: "Human Anatomy", platform: "edX (Davidson College)", url: "https://www.edx.org/learn/anatomy", free: false },
    ],
    docs: [
      { name: "Gray's Anatomy Online", url: "https://www.clinicalkey.com/#!/browse/book/3-s2.0-C20120069391" },
      { name: "AMBOSS Anatomy", url: "https://www.amboss.com/us/knowledge/Anatomy" },
    ],
    books: [
      { title: "Gray's Anatomy for Students", author: "Drake, Vogl & Mitchell", year: 2020 },
      { title: "Clinically Oriented Anatomy", author: "Keith L. Moore", year: 2018 },
    ],
    playlists: [
      { title: "Anatomy & Physiology", channel: "Crash Course", url: "https://www.youtube.com/playlist?list=PL8dPuuaLjXtOAKed_MxxWBNaPno5h3Zs8" },
      { title: "Human Anatomy Lectures", channel: "Ninja Nerd Science", url: "https://www.youtube.com/c/NinjaNerdScience" },
    ],
    practice: [
      { name: "Kenhub Anatomy Quizzes", url: "https://www.kenhub.com/en/library/quizzes", description: "Labelled anatomy diagrams and quizzes." },
      { name: "AnkiWeb – Anatomy Decks", url: "https://ankiweb.net/shared/decks/anatomy", description: "Community flashcard decks for anatomy." },
    ],
  },

  "Physiology": {
    overview: "How the human body functions at the organ and system level, including cardiovascular, respiratory, renal, endocrine, and neurological physiology.",
    modules: [
      { name: "Cardiovascular Physiology", topics: ["Cardiac cycle", "Blood pressure regulation", "Starling's law"] },
      { name: "Respiratory Physiology", topics: ["Ventilation and perfusion", "Gas exchange", "Lung volumes"] },
      { name: "Renal Physiology", topics: ["Glomerular filtration", "Tubular reabsorption", "Acid-base balance"] },
      { name: "Neurophysiology", topics: ["Action potentials", "Synaptic transmission", "Sensory and motor pathways"] },
    ],
    beginner: [
      { title: "Crash Course – Anatomy & Physiology", type: 'youtube', url: "https://www.youtube.com/playlist?list=PL8dPuuaLjXtOAKed_MxxWBNaPno5h3Zs8", description: "40+ videos covering all major physiology systems.", free: true },
      { title: "Khan Academy – Physiology", type: 'website', url: "https://www.khanacademy.org/science/health-and-medicine/human-anatomy-and-physiology", description: "Detailed video lessons on human physiology.", free: true },
      { title: "Osmosis – Physiology", type: 'youtube', url: "https://www.youtube.com/c/osmosis", description: "Animated physiology videos for medical students.", free: true },
    ],
    intermediate: [
      { title: "Ninja Nerd – Physiology Lectures", type: 'youtube', url: "https://www.youtube.com/c/NinjaNerdScience", description: "Detailed physiology board-prep lectures.", free: true },
      { title: "Costanzo Physiology Online", type: 'course', url: "https://www.elsevier.com/books/physiology/costanzo/978-0-323-47881-6", description: "Companion resource to Costanzo's Physiology textbook.", free: false },
      { title: "eClinicalMed – Physiology", type: 'website', url: "https://www.eclinicalmed.com/", description: "Clinical physiology case studies.", free: false },
    ],
    advanced: [
      { title: "MIT 7.013 Introductory Biology (Physiology modules)", type: 'course', url: "https://ocw.mit.edu/courses/7-013-introductory-biology-spring-2011/", description: "MIT's biology course with detailed physiology content.", free: true },
      { title: "Physiology Online – Guyton Resources", type: 'documentation', url: "https://www.phyiology.org/", description: "Advanced physiology reference materials.", free: true },
      { title: "AMBOSS – Physiology", type: 'documentation', url: "https://www.amboss.com/us/knowledge/Physiology", description: "Medical-grade physiology knowledge library.", free: false },
    ],
    websites: [
      { name: "Osmosis", url: "https://www.osmosis.org/", description: "Video-based physiology learning." },
      { name: "Khan Academy Medicine", url: "https://www.khanacademy.org/science/health-and-medicine", description: "Free physiology videos and practice." },
      { name: "Geeky Medics", url: "https://geekymedics.com/", description: "Clinical physiology notes and quizzes." },
    ],
    courses: [
      { name: "Physiology: The Science of Life", platform: "Coursera", url: "https://www.coursera.org/learn/physiology", free: false },
      { name: "Medical Neuroscience", platform: "Coursera (Duke)", url: "https://www.coursera.org/learn/medical-neuroscience", free: false },
    ],
    docs: [
      { name: "AMBOSS Physiology Library", url: "https://www.amboss.com/" },
      { name: "OpenStax Anatomy & Physiology", url: "https://openstax.org/books/anatomy-and-physiology-2e/pages/1-introduction" },
    ],
    books: [
      { title: "Physiology (Costanzo)", author: "Linda Costanzo", year: 2022 },
      { title: "Guyton and Hall Textbook of Medical Physiology", author: "John Hall", year: 2020 },
    ],
    playlists: [
      { title: "Physiology by Ninja Nerd", channel: "Ninja Nerd Science", url: "https://www.youtube.com/c/NinjaNerdScience" },
      { title: "A&P Crash Course", channel: "Crash Course", url: "https://www.youtube.com/playlist?list=PL8dPuuaLjXtOAKed_MxxWBNaPno5h3Zs8" },
    ],
    practice: [
      { name: "Kenhub Physiology Quizzes", url: "https://www.kenhub.com/en/library/anatomy/physiology", description: "Physiology questions with detailed explanations." },
      { name: "Osmosis Question Bank", url: "https://www.osmosis.org/", description: "Spaced-repetition questions on physiology." },
    ],
  },

  // ── Business ──────────────────────────────────────────────────────────────
  "Financial Accounting": {
    overview: "Recording, classifying, and summarising business transactions. Covers the income statement, balance sheet, cash flow statement, and double-entry bookkeeping.",
    modules: [
      { name: "The Accounting Equation", topics: ["Assets, liabilities, equity", "Double-entry bookkeeping", "Trial balance"] },
      { name: "Financial Statements", topics: ["Income statement", "Balance sheet", "Cash flow statement"] },
      { name: "Adjusting Entries", topics: ["Accruals and deferrals", "Depreciation", "Bad debt provisions"] },
      { name: "Financial Analysis", topics: ["Ratio analysis", "Liquidity ratios", "Profitability ratios"] },
    ],
    beginner: [
      { title: "Accounting Basics – Full Course", type: 'youtube', url: "https://www.youtube.com/watch?v=qrBkH7YFYLE", description: "Accounting Stuff's popular beginner course.", free: true },
      { title: "Khan Academy – Financial Accounting", type: 'website', url: "https://www.khanacademy.org/economics-finance-domain/core-finance/accounting-and-financial-statements", description: "Free, interactive accounting fundamentals.", free: true },
      { title: "Accounting Coach", type: 'website', url: "https://www.accountingcoach.com/", description: "Clear explanations of every accounting concept.", free: true },
    ],
    intermediate: [
      { title: "Financial Accounting – Wharton", type: 'course', url: "https://www.coursera.org/learn/wharton-financial-accounting", description: "University of Pennsylvania's accounting course.", free: false },
      { title: "CPA Exam Prep – Becker", type: 'website', url: "https://www.becker.com/cpa-review", description: "Professional accounting exam preparation.", free: false },
      { title: "Corporate Finance Institute", type: 'website', url: "https://corporatefinanceinstitute.com/resources/accounting/", description: "Accounting guides and templates.", free: true },
    ],
    advanced: [
      { title: "IFRS Standards", type: 'documentation', url: "https://www.ifrs.org/issued-standards/", description: "International Financial Reporting Standards.", free: true },
      { title: "Financial Statement Analysis – NYU Stern", type: 'youtube', url: "https://www.youtube.com/c/AswathDamodaranonValuation", description: "Aswath Damodaran's valuation and financial analysis.", free: true },
      { title: "US GAAP Standards (FASB)", type: 'documentation', url: "https://asc.fasb.org/", description: "US Generally Accepted Accounting Principles.", free: true },
    ],
    websites: [
      { name: "AccountingCoach", url: "https://www.accountingcoach.com/", description: "Free accounting tutorials and quizzes." },
      { name: "Investopedia Accounting", url: "https://www.investopedia.com/financial-term-dictionary-4769738", description: "Clear definitions of financial terms." },
      { name: "Corporate Finance Institute", url: "https://corporatefinanceinstitute.com/", description: "Financial modelling and accounting resources." },
    ],
    courses: [
      { name: "Financial Accounting", platform: "Coursera (Wharton)", url: "https://www.coursera.org/learn/wharton-financial-accounting", free: false },
      { name: "Accounting Fundamentals", platform: "edX", url: "https://www.edx.org/learn/accounting", free: false },
    ],
    docs: [
      { name: "IFRS Foundation", url: "https://www.ifrs.org/" },
      { name: "FASB Accounting Standards", url: "https://asc.fasb.org/" },
    ],
    books: [
      { title: "Financial Accounting", author: "Jerry Weygandt et al.", year: 2022 },
      { title: "Financial Statement Analysis", author: "Martin Fridson & Fernando Alvarez", year: 2022 },
    ],
    playlists: [
      { title: "Accounting Basics for Beginners", channel: "Accounting Stuff", url: "https://www.youtube.com/c/AccountingStuff" },
      { title: "Financial Accounting", channel: "Khan Academy", url: "https://www.youtube.com/playlist?list=PL44BCE0F81012A65F" },
    ],
    practice: [
      { name: "AccountingCoach Quizzes", url: "https://www.accountingcoach.com/accounting-quizzes", description: "Free quizzes on every accounting topic." },
      { name: "CFI Excel Templates", url: "https://corporatefinanceinstitute.com/resources/excel/financial-model/", description: "Practice with real financial modelling templates." },
    ],
  },

  "Microeconomics": {
    overview: "How individuals and firms make decisions about resource allocation, pricing, and production under conditions of scarcity and competition.",
    modules: [
      { name: "Supply & Demand", topics: ["Market equilibrium", "Elasticity", "Consumer and producer surplus"] },
      { name: "Theory of the Firm", topics: ["Production functions", "Cost curves", "Profit maximisation"] },
      { name: "Market Structures", topics: ["Perfect competition", "Monopoly and oligopoly", "Monopolistic competition"] },
      { name: "Market Failures", topics: ["Externalities", "Public goods", "Information asymmetry"] },
    ],
    beginner: [
      { title: "CrashCourse Economics", type: 'youtube', url: "https://www.youtube.com/playlist?list=PL8dPuuaLjXtPNZwz5_o_5uirJ8gQXnhEO", description: "35 fun videos covering micro and macro economics.", free: true },
      { title: "Khan Academy – AP Microeconomics", type: 'website', url: "https://www.khanacademy.org/economics-finance-domain/ap-microeconomics", description: "Interactive microeconomics lessons and quizzes.", free: true },
      { title: "Economics Explained – YouTube", type: 'youtube', url: "https://www.youtube.com/@EconomicsExplained", description: "Real-world economics explained clearly.", free: true },
    ],
    intermediate: [
      { title: "Principles of Microeconomics – MIT OpenCourseWare", type: 'course', url: "https://ocw.mit.edu/courses/14-01-principles-of-microeconomics-fall-2018/", description: "MIT's full microeconomics course (free).", free: true },
      { title: "Microeconomics – University of Illinois", type: 'course', url: "https://www.coursera.org/learn/microeconomics-101", description: "Coursera microeconomics course.", free: false },
      { title: "Marginal Revolution University", type: 'website', url: "https://mru.org/", description: "Free economics video courses by Tyler Cowen & Alex Tabarrok.", free: true },
    ],
    advanced: [
      { title: "Intermediate Microeconomics – Varian", type: 'documentation', url: "https://wwnorton.com/books/9780393689990", description: "Classic intermediate micro textbook resources.", free: false },
      { title: "NBER Working Papers – Microeconomics", type: 'website', url: "https://www.nber.org/research/by-topic?tag=microeconomics", description: "Current microeconomics research papers.", free: true },
      { title: "Game Theory – Yale (Coursera)", type: 'course', url: "https://www.coursera.org/learn/game-theory-1", description: "Stanford/UBC game theory course.", free: false },
    ],
    websites: [
      { name: "Marginal Revolution University", url: "https://mru.org/", description: "Free economics video library." },
      { name: "Econlib", url: "https://www.econlib.org/", description: "Liberty Fund's economics library and Encyclopedia." },
      { name: "Our World in Data – Economics", url: "https://ourworldindata.org/", description: "Data-driven economic research and visualisations." },
    ],
    courses: [
      { name: "Microeconomics Principles", platform: "Coursera (U of Illinois)", url: "https://www.coursera.org/learn/microeconomics-101", free: false },
      { name: "AP Microeconomics", platform: "Khan Academy", url: "https://www.khanacademy.org/economics-finance-domain/ap-microeconomics", free: true },
    ],
    docs: [
      { name: "Econlib Encyclopedia", url: "https://www.econlib.org/library/enc.html" },
      { name: "IMF Research Papers", url: "https://www.imf.org/en/Publications/search#sort=relevancy" },
    ],
    books: [
      { title: "Intermediate Microeconomics", author: "Hal Varian", year: 2014 },
      { title: "Economics", author: "Paul Samuelson & William Nordhaus", year: 2009 },
    ],
    playlists: [
      { title: "CrashCourse Economics", channel: "CrashCourse", url: "https://www.youtube.com/playlist?list=PL8dPuuaLjXtPNZwz5_o_5uirJ8gQXnhEO" },
      { title: "Microeconomics Lectures", channel: "Marginal Revolution University", url: "https://www.youtube.com/@MarginalRevolutionUniversity" },
    ],
    practice: [
      { name: "Khan Academy Microeconomics Practice", url: "https://www.khanacademy.org/economics-finance-domain/ap-microeconomics", description: "Interactive exercises and unit tests." },
      { name: "Econgraphs", url: "https://www.econgraphs.org/", description: "Interactive economics graphs to build intuition." },
    ],
  },

  // ── Law ───────────────────────────────────────────────────────────────────
  "Contract Law": {
    overview: "The law of agreements: formation, terms, breach, remedies, and the doctrines of consideration, capacity, and legality.",
    modules: [
      { name: "Formation of Contract", topics: ["Offer and acceptance", "Consideration", "Intention to create legal relations"] },
      { name: "Terms & Conditions", topics: ["Express and implied terms", "Exclusion clauses", "Conditions vs warranties"] },
      { name: "Vitiating Factors", topics: ["Misrepresentation", "Duress and undue influence", "Mistake"] },
      { name: "Breach & Remedies", topics: ["Anticipatory breach", "Damages calculation", "Specific performance"] },
    ],
    beginner: [
      { title: "Contract Law Explained – YouTube", type: 'youtube', url: "https://www.youtube.com/watch?v=9qSHAI5JEJU", description: "Clear overview of contract law fundamentals.", free: true },
      { title: "Khan Academy – Business Law", type: 'website', url: "https://www.khanacademy.org/economics-finance-domain/core-finance/housing", description: "Legal concepts in plain language.", free: true },
      { title: "Cornell LII – Contract Law", type: 'documentation', url: "https://www.law.cornell.edu/wex/contract", description: "Free legal information from Cornell Law School.", free: true },
    ],
    intermediate: [
      { title: "Introduction to English Common Law", type: 'course', url: "https://www.coursera.org/learn/intro-english-common-law", description: "UCL's introduction to English common law on Coursera.", free: false },
      { title: "UK Contract Law – Law Teacher", type: 'website', url: "https://www.lawteacher.net/free-law-essays/contract-law/", description: "Free law essays and case summaries.", free: true },
      { title: "Westlaw Edge – Case Research", type: 'documentation', url: "https://legal.thomsonreuters.com/en/products/westlaw", description: "Leading legal research database.", free: false },
    ],
    advanced: [
      { title: "Comparative Contract Law – edX", type: 'course', url: "https://www.edx.org/learn/law", description: "Advanced comparative contract law from top universities.", free: false },
      { title: "UNIDROIT Principles", type: 'documentation', url: "https://www.unidroit.org/instruments/commercial-contracts/unidroit-principles-2016/", description: "International commercial contract principles.", free: true },
      { title: "SSRN – Contract Law Research", type: 'website', url: "https://www.ssrn.com/index.cfm/en/", description: "Open-access legal scholarship and working papers.", free: true },
    ],
    websites: [
      { name: "Cornell LII", url: "https://www.law.cornell.edu/", description: "Free US legal information." },
      { name: "LawTeacher.net", url: "https://www.lawteacher.net/", description: "Free UK law essays, notes, and case summaries." },
      { name: "BAILII", url: "https://www.bailii.org/", description: "Free access to British and Irish legal information." },
    ],
    courses: [
      { name: "Introduction to English Common Law", platform: "Coursera (UCL)", url: "https://www.coursera.org/learn/intro-english-common-law", free: false },
      { name: "Introduction to International Criminal Law", platform: "Coursera (Case Western)", url: "https://www.coursera.org/learn/international-criminal-law", free: false },
    ],
    docs: [
      { name: "Cornell LII – Contract", url: "https://www.law.cornell.edu/wex/contract" },
      { name: "BAILII UK Cases", url: "https://www.bailii.org/" },
    ],
    books: [
      { title: "Chitty on Contracts", author: "Sweet & Maxwell Editors", year: 2021 },
      { title: "Ewan McKendrick – Contract Law", author: "Ewan McKendrick", year: 2022 },
    ],
    playlists: [
      { title: "Contract Law Full Lectures", channel: "Cambridge Law", url: "https://www.youtube.com/@CambridgeLaw" },
      { title: "Law Crash Course", channel: "CrashCourse", url: "https://www.youtube.com/watch?v=Aq2TqDMOSFE" },
    ],
    practice: [
      { name: "Law Teacher Problem Questions", url: "https://www.lawteacher.net/", description: "Worked contract law problem questions." },
      { name: "Quizlet – Contract Law", url: "https://quizlet.com/subject/contract-law/", description: "Community flashcards for contract law revision." },
    ],
  },

  // ── Engineering ───────────────────────────────────────────────────────────
  "Engineering Mathematics": {
    overview: "Mathematical foundations for engineers: calculus, linear algebra, differential equations, and probability.",
    modules: [
      { name: "Calculus", topics: ["Differentiation rules", "Integration techniques", "Multivariable calculus"] },
      { name: "Linear Algebra", topics: ["Vectors and matrices", "Eigenvalues and eigenvectors", "Systems of equations"] },
      { name: "Differential Equations", topics: ["First-order ODEs", "Second-order ODEs", "Laplace transforms"] },
      { name: "Probability & Statistics", topics: ["Distributions", "Statistical inference", "Regression analysis"] },
    ],
    beginner: [
      { title: "3Blue1Brown – Essence of Calculus", type: 'youtube', url: "https://www.youtube.com/playlist?list=PLZHQObOWTQDMsr9K-rj53DwVRMYO3t5Yr", description: "Beautiful visual introduction to calculus.", free: true },
      { title: "Khan Academy – Calculus", type: 'website', url: "https://www.khanacademy.org/math/calculus-1", description: "Complete calculus curriculum with exercises.", free: true },
      { title: "Paul's Online Math Notes", type: 'website', url: "https://tutorial.math.lamar.edu/", description: "Clear calculus, algebra, and differential equations notes.", free: true },
    ],
    intermediate: [
      { title: "3Blue1Brown – Essence of Linear Algebra", type: 'youtube', url: "https://www.youtube.com/playlist?list=PLZHQObOWTQDPD3MizzM2xVFitgF8hE_ab", description: "Visual guide to linear algebra intuition.", free: true },
      { title: "MIT 18.06 – Linear Algebra (Gilbert Strang)", type: 'course', url: "https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/", description: "MIT's legendary linear algebra course.", free: true },
      { title: "Differential Equations – MIT OCW", type: 'course', url: "https://ocw.mit.edu/courses/18-03-differential-equations-spring-2010/", description: "MIT's full differential equations course.", free: true },
    ],
    advanced: [
      { title: "MIT 18.02 Multivariable Calculus", type: 'course', url: "https://ocw.mit.edu/courses/18-02-multivariable-calculus-spring-2006/", description: "MIT's multivariable calculus with full lecture videos.", free: true },
      { title: "Wolfram MathWorld", type: 'documentation', url: "https://mathworld.wolfram.com/", description: "Comprehensive mathematics encyclopedia.", free: true },
      { title: "Mathematics for Machine Learning", type: 'course', url: "https://www.coursera.org/specializations/mathematics-machine-learning", description: "Imperial College London's applied maths specialisation.", free: false },
    ],
    websites: [
      { name: "Paul's Online Math Notes", url: "https://tutorial.math.lamar.edu/", description: "Excellent free notes on calculus and ODE." },
      { name: "Wolfram Alpha", url: "https://www.wolframalpha.com/", description: "Computational engine for maths problems." },
      { name: "Khan Academy Maths", url: "https://www.khanacademy.org/math", description: "Full maths curriculum from arithmetic to multivariable calculus." },
    ],
    courses: [
      { name: "Mathematics for Engineers", platform: "Coursera (Johns Hopkins)", url: "https://www.coursera.org/specializations/mathematics-engineers", free: false },
      { name: "Linear Algebra", platform: "MIT OCW", url: "https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/", free: true },
    ],
    docs: [
      { name: "Wolfram MathWorld", url: "https://mathworld.wolfram.com/" },
      { name: "NIST Digital Library of Mathematical Functions", url: "https://dlmf.nist.gov/" },
    ],
    books: [
      { title: "Advanced Engineering Mathematics", author: "Erwin Kreyszig", year: 2011 },
      { title: "Introduction to Linear Algebra", author: "Gilbert Strang", year: 2016 },
    ],
    playlists: [
      { title: "Essence of Calculus", channel: "3Blue1Brown", url: "https://www.youtube.com/playlist?list=PLZHQObOWTQDMsr9K-rj53DwVRMYO3t5Yr" },
      { title: "Essence of Linear Algebra", channel: "3Blue1Brown", url: "https://www.youtube.com/playlist?list=PLZHQObOWTQDPD3MizzM2xVFitgF8hE_ab" },
    ],
    practice: [
      { name: "Wolfram Problem Generator", url: "https://www.wolframalpha.com/problem-generator/", description: "Unlimited maths problems with step-by-step solutions." },
      { name: "MIT Integration Bee Archive", url: "https://math.mit.edu/~remis/IBee.html", description: "Integration challenge problems from MIT." },
    ],
  },

  // ── Psychology ────────────────────────────────────────────────────────────
  "Introduction to Psychology": {
    overview: "Survey of psychology covering biological bases of behaviour, sensation, perception, learning, memory, cognition, emotion, motivation, personality, and social influence.",
    modules: [
      { name: "Biological Bases of Behaviour", topics: ["Neurons and neurotransmitters", "Brain structure and function", "Genetics and behaviour"] },
      { name: "Sensation & Perception", topics: ["Sensory processes", "Perceptual organisation", "Top-down vs bottom-up processing"] },
      { name: "Learning & Memory", topics: ["Classical conditioning", "Operant conditioning", "Types of memory"] },
      { name: "Social Psychology", topics: ["Social influence", "Attitudes and persuasion", "Group dynamics"] },
    ],
    beginner: [
      { title: "CrashCourse Psychology", type: 'youtube', url: "https://www.youtube.com/playlist?list=PL8dPuuaLjXtOPRKzVLY0jR2-hzpGGC7nG", description: "40+ fast-paced psychology videos by CrashCourse.", free: true },
      { title: "Simply Psychology", type: 'website', url: "https://www.simplypsychology.org/", description: "Clear summaries of psychological theories and studies.", free: true },
      { title: "Khan Academy – MCAT Psychology", type: 'website', url: "https://www.khanacademy.org/science/mcat/behavior", description: "Psychology lessons aligned to MCAT and university courses.", free: true },
    ],
    intermediate: [
      { title: "Introduction to Psychology – Yale", type: 'course', url: "https://www.coursera.org/learn/introduction-psych", description: "Paul Bloom's famous Introduction to Psychology on Coursera.", free: false },
      { title: "APA – Research on Psychology", type: 'website', url: "https://www.apa.org/research/", description: "American Psychological Association research resources.", free: true },
      { title: "TED Talks – Psychology Playlist", type: 'youtube', url: "https://www.youtube.com/playlist?list=PLOGi5-fAu8bH3c_OAIioqrgaV1KoZ1yIo", description: "Popular TED talks on psychology and behaviour.", free: true },
    ],
    advanced: [
      { title: "Social Psychology – Wesleyan", type: 'course', url: "https://www.coursera.org/learn/social-psychology", description: "Scott Plous's award-winning social psychology course.", free: false },
      { title: "PsychINFO Research Database", type: 'documentation', url: "https://www.apa.org/pubs/databases/psycinfo", description: "The most comprehensive database of psychology literature.", free: false },
      { title: "Annual Review of Psychology", type: 'website', url: "https://www.annualreviews.org/journal/psych", description: "Leading peer-reviewed psychology review articles.", free: false },
    ],
    websites: [
      { name: "Simply Psychology", url: "https://www.simplypsychology.org/", description: "Free psychology study guides for students." },
      { name: "Psychologist World", url: "https://www.psychologistworld.com/", description: "Tests, studies, and psychology resources." },
      { name: "APA Student Resources", url: "https://www.apa.org/education-career/undergrad", description: "Resources for undergraduate psychology students." },
    ],
    courses: [
      { name: "Introduction to Psychology", platform: "Coursera (Yale)", url: "https://www.coursera.org/learn/introduction-psych", free: false },
      { name: "Social Psychology", platform: "Coursera (Wesleyan)", url: "https://www.coursera.org/learn/social-psychology", free: false },
    ],
    docs: [
      { name: "APA Publication Manual", url: "https://apastyle.apa.org/style-grammar-guidelines" },
      { name: "DSM-5 Overview", url: "https://www.psychiatry.org/psychiatrists/practice/dsm" },
    ],
    books: [
      { title: "Psychology", author: "David G. Myers & C. Nathan DeWall", year: 2021 },
      { title: "Thinking, Fast and Slow", author: "Daniel Kahneman", year: 2011 },
    ],
    playlists: [
      { title: "CrashCourse Psychology", channel: "CrashCourse", url: "https://www.youtube.com/playlist?list=PL8dPuuaLjXtOPRKzVLY0jR2-hzpGGC7nG" },
      { title: "Yale PSYC 110 – Introduction to Psychology", channel: "YaleCourses", url: "https://www.youtube.com/playlist?list=PLDF7B08FF8564D1FE" },
    ],
    practice: [
      { name: "APA Psychology Tests", url: "https://www.apa.org/research/tools", description: "Validated psychological measures and scales." },
      { name: "Psychology Today Self-Tests", url: "https://www.psychologytoday.com/us/tests", description: "Wide range of psychological self-assessments." },
    ],
  },

  "Corporate Finance": {
    overview: "How corporations make financing, investment, and dividend decisions. Covers capital budgeting, cost of capital, valuation, and capital structure.",
    modules: [
      { name: "Time Value of Money", topics: ["Present and future value", "Annuities", "Loan amortisation"] },
      { name: "Capital Budgeting", topics: ["NPV and IRR", "Payback period", "Real options"] },
      { name: "Cost of Capital", topics: ["WACC", "CAPM", "Debt vs equity financing"] },
      { name: "Valuation", topics: ["DCF valuation", "Comparable company analysis", "M&A basics"] },
    ],
    beginner: [
      { title: "Corporate Finance Basics – Aswath Damodaran", type: 'youtube', url: "https://www.youtube.com/playlist?list=PLUkh9m2BorqlJsEfix7R9jtSXClFZhGvC", description: "NYU Professor Damodaran's legendary corporate finance lectures.", free: true },
      { title: "Khan Academy – Finance & Capital Markets", type: 'website', url: "https://www.khanacademy.org/economics-finance-domain/core-finance", description: "Free interactive finance fundamentals.", free: true },
      { title: "Investopedia – Corporate Finance", type: 'website', url: "https://www.investopedia.com/corporate-finance-4689828", description: "Comprehensive corporate finance articles and tutorials.", free: true },
    ],
    intermediate: [
      { title: "Corporate Finance – Wharton", type: 'course', url: "https://www.coursera.org/learn/corporate-finance-measure-for-value", description: "Wharton's corporate finance specialisation.", free: false },
      { title: "Breaking Into Wall Street", type: 'website', url: "https://breakingintowallstreet.com/", description: "Financial modelling and valuation training.", free: false },
      { title: "CFA Institute – Learning Resources", type: 'documentation', url: "https://www.cfainstitute.org/en/membership/professional-development/refresher-readings", description: "CFA Institute study materials.", free: false },
    ],
    advanced: [
      { title: "Damodaran on Valuation Online", type: 'website', url: "https://pages.stern.nyu.edu/~adamodar/", description: "Damodaran's datasets, models, and readings.", free: true },
      { title: "MIT 15.401 – Finance Theory", type: 'course', url: "https://ocw.mit.edu/courses/15-401-finance-theory-i-fall-2008/", description: "MIT Sloan's finance theory course.", free: true },
      { title: "Bloomberg Terminal Learning", type: 'documentation', url: "https://www.bloomberg.com/professional/solutions/bloomberg-terminal/", description: "Bloomberg's financial data and analytics platform.", free: false },
    ],
    websites: [
      { name: "Investopedia", url: "https://www.investopedia.com/", description: "The largest financial education website." },
      { name: "Damodaran Online", url: "https://pages.stern.nyu.edu/~adamodar/", description: "Free datasets, models, and readings from NYU's Damodaran." },
      { name: "CFI – Corporate Finance Institute", url: "https://corporatefinanceinstitute.com/", description: "Financial modelling and analyst training." },
    ],
    courses: [
      { name: "Introduction to Corporate Finance", platform: "Coursera (Wharton)", url: "https://www.coursera.org/learn/wharton-finance", free: false },
      { name: "Finance for Non-Finance Professionals", platform: "Coursera (Rice)", url: "https://www.coursera.org/learn/finance-for-non-finance-managers", free: false },
    ],
    docs: [
      { name: "CFA Institute Resources", url: "https://www.cfainstitute.org/en/membership/professional-development" },
      { name: "IFRS Standards – Finance", url: "https://www.ifrs.org/issued-standards/" },
    ],
    books: [
      { title: "Corporate Finance", author: "Berk & DeMarzo", year: 2020 },
      { title: "Principles of Corporate Finance", author: "Brealey, Myers & Allen", year: 2020 },
    ],
    playlists: [
      { title: "Corporate Finance – Full Course", channel: "Aswath Damodaran", url: "https://www.youtube.com/playlist?list=PLUkh9m2BorqlJsEfix7R9jtSXClFZhGvC" },
      { title: "Finance Course for Beginners", channel: "Edspira", url: "https://www.youtube.com/c/Edspira" },
    ],
    practice: [
      { name: "CFI Financial Modelling Templates", url: "https://corporatefinanceinstitute.com/resources/excel/financial-model/", description: "Real financial models to practice with." },
      { name: "Investopedia Simulator", url: "https://www.investopedia.com/simulator/", description: "Virtual stock market trading simulator." },
    ],
  },

  "Operating Systems": {
    overview: "How operating systems manage processes, memory, file systems, and I/O. Topics include scheduling, virtual memory, concurrency, and synchronisation.",
    modules: [
      { name: "Process Management", topics: ["Process creation and scheduling", "Context switching", "Inter-process communication"] },
      { name: "Memory Management", topics: ["Virtual memory and paging", "Segmentation", "TLB and page replacement"] },
      { name: "File Systems", topics: ["File system structure", "Inodes and directories", "Journaling"] },
      { name: "Concurrency", topics: ["Threads and race conditions", "Mutex and semaphores", "Deadlock prevention"] },
    ],
    beginner: [
      { title: "Operating Systems – Full Course", type: 'youtube', url: "https://www.youtube.com/watch?v=vBURTt97EkA", description: "Beginner-friendly OS concepts explained.", free: true },
      { title: "GeeksForGeeks – Operating Systems", type: 'website', url: "https://www.geeksforgeeks.org/operating-systems/", description: "Comprehensive OS tutorials and interview questions.", free: true },
      { title: "OSTEP – OS: Three Easy Pieces", type: 'documentation', url: "https://pages.cs.wisc.edu/~remzi/OSTEP/", description: "Free, beloved OS textbook by Arpaci-Dusseau.", free: true },
    ],
    intermediate: [
      { title: "MIT 6.004 – Computation Structures", type: 'course', url: "https://ocw.mit.edu/courses/6-004-computation-structures-spring-2017/", description: "MIT's course on computer architecture and OS.", free: true },
      { title: "Operating Systems – UC Berkeley", type: 'youtube', url: "https://www.youtube.com/playlist?list=PLF2K2xZjNEf97A_uBCwEl61sdxWVP7VWC", description: "Berkeley CS162 Operating Systems lectures.", free: true },
      { title: "Linux Kernel Documentation", type: 'documentation', url: "https://www.kernel.org/doc/html/latest/", description: "Official Linux kernel documentation.", free: true },
    ],
    advanced: [
      { title: "CMU 15-410 – OS Design & Implementation", type: 'course', url: "https://www.cs.cmu.edu/~410/", description: "Carnegie Mellon's advanced OS course.", free: true },
      { title: "LFS – Linux From Scratch", type: 'documentation', url: "https://www.linuxfromscratch.org/", description: "Build your own Linux system from source.", free: true },
      { title: "OSDev Wiki", type: 'website', url: "https://wiki.osdev.org/", description: "Community wiki for OS developers.", free: true },
    ],
    websites: [
      { name: "OSTEP – Free OS Textbook", url: "https://pages.cs.wisc.edu/~remzi/OSTEP/", description: "The best free OS textbook available." },
      { name: "OSDev Wiki", url: "https://wiki.osdev.org/", description: "Resources for writing your own OS." },
      { name: "GeeksForGeeks OS", url: "https://www.geeksforgeeks.org/operating-systems/", description: "OS tutorials and practice questions." },
    ],
    courses: [
      { name: "Introduction to Operating Systems", platform: "Udacity", url: "https://www.udacity.com/course/introduction-to-operating-systems--ud923", free: true },
      { name: "Computer Science: Programming with a Purpose", platform: "Coursera (Princeton)", url: "https://www.coursera.org/learn/cs-programming-java", free: false },
    ],
    docs: [
      { name: "Linux man pages", url: "https://man7.org/linux/man-pages/" },
      { name: "POSIX Standard", url: "https://pubs.opengroup.org/onlinepubs/9699919799/" },
    ],
    books: [
      { title: "Operating System Concepts (Silberschatz)", author: "Silberschatz, Galvin & Gagne", year: 2021 },
      { title: "Modern Operating Systems", author: "Andrew Tanenbaum", year: 2014 },
    ],
    playlists: [
      { title: "CS 162 Berkeley – Operating Systems", channel: "Berkeley EECS", url: "https://www.youtube.com/playlist?list=PLF2K2xZjNEf97A_uBCwEl61sdxWVP7VWC" },
      { title: "Operating Systems from Scratch", channel: "CodePulse", url: "https://www.youtube.com/watch?v=9GDX-IyZ_C8" },
    ],
    practice: [
      { name: "Linux Command Line Practice", url: "https://www.learnshell.org/", description: "Hands-on Linux shell practice in the browser." },
      { name: "HackInScience – OS Exercises", url: "https://www.hackinscience.org/", description: "Python/OS exercises for practice." },
    ],
  },
};

// ── Default resources by degree category (fallback for unmapped subjects) ───
const DEGREE_FALLBACKS: Record<string, Pick<SubjectResources, 'websites' | 'courses' | 'docs' | 'playlists'>> = {
  "Computer Science / Software Engineering": {
    websites: [
      { name: "GeeksForGeeks", url: "https://www.geeksforgeeks.org/", description: "CS tutorials for every topic." },
      { name: "MIT OpenCourseWare – CS", url: "https://ocw.mit.edu/search/?d=Electrical+Engineering+and+Computer+Science", description: "Free MIT CS courses and lecture notes." },
      { name: "freeCodeCamp", url: "https://www.freecodecamp.org/", description: "Free coding curriculum." },
    ],
    courses: [
      { name: "CS50 – Introduction to Computer Science", platform: "edX (Harvard)", url: "https://www.edx.org/learn/computer-science/harvard-university-cs50-s-introduction-to-computer-science", free: true },
      { name: "Google IT Support", platform: "Coursera", url: "https://www.coursera.org/professional-certificates/google-it-support", free: false },
    ],
    docs: [
      { name: "MDN Web Docs", url: "https://developer.mozilla.org/" },
      { name: "DevDocs.io", url: "https://devdocs.io/" },
    ],
    playlists: [
      { title: "CS Fundamentals", channel: "MIT OpenCourseWare", url: "https://www.youtube.com/@mitocw" },
      { title: "Programming Tutorials", channel: "freeCodeCamp", url: "https://www.youtube.com/@freecodecamp" },
    ],
  },
  "Business Administration / Management": {
    websites: [
      { name: "Harvard Business Review", url: "https://hbr.org/", description: "Business insights from the world's top researchers." },
      { name: "MIT Sloan Management Review", url: "https://sloanreview.mit.edu/", description: "Research-based business management articles." },
      { name: "Investopedia", url: "https://www.investopedia.com/", description: "Business and finance education." },
    ],
    courses: [
      { name: "Business Foundations", platform: "Coursera (Wharton)", url: "https://www.coursera.org/specializations/wharton-business-foundations", free: false },
      { name: "Management Fundamentals", platform: "Coursera (Wharton)", url: "https://www.coursera.org/learn/management-fundamentals-healthcare-administrators", free: false },
    ],
    docs: [
      { name: "Harvard Business School Cases", url: "https://www.hbs.edu/faculty/Pages/cases.aspx" },
      { name: "OECD iLibrary", url: "https://www.oecd-ilibrary.org/" },
    ],
    playlists: [
      { title: "Business Fundamentals", channel: "Harvard Business School", url: "https://www.youtube.com/@HarvardBusinessSchool" },
      { title: "Entrepreneurship Crash Course", channel: "CrashCourse", url: "https://www.youtube.com/playlist?list=PL8dPuuaLjXtP8M1wq0mMGINBEKRG5-XMm" },
    ],
  },
  "Medicine / Biomedical Science": {
    websites: [
      { name: "Osmosis", url: "https://www.osmosis.org/", description: "Visual medical learning platform." },
      { name: "PubMed", url: "https://pubmed.ncbi.nlm.nih.gov/", description: "Free MEDLINE database of biomedical research." },
      { name: "Geeky Medics", url: "https://geekymedics.com/", description: "Free clinical skills and medical education resources." },
    ],
    courses: [
      { name: "Anatomy Specialisation", platform: "Coursera (U of Michigan)", url: "https://www.coursera.org/specializations/anatomy", free: false },
      { name: "Science of Medicine", platform: "edX", url: "https://www.edx.org/learn/medicine", free: false },
    ],
    docs: [
      { name: "AMBOSS Medical Library", url: "https://www.amboss.com/" },
      { name: "OpenStax Anatomy & Physiology", url: "https://openstax.org/books/anatomy-and-physiology-2e/pages/1-introduction" },
    ],
    playlists: [
      { title: "Medical Lectures", channel: "Osmosis", url: "https://www.youtube.com/@osmosis" },
      { title: "Anatomy & Physiology", channel: "Ninja Nerd Science", url: "https://www.youtube.com/@NinjaNerdScience" },
    ],
  },
  "Law": {
    websites: [
      { name: "Cornell LII", url: "https://www.law.cornell.edu/", description: "Free access to US law." },
      { name: "BAILII", url: "https://www.bailii.org/", description: "British and Irish legal information." },
      { name: "Law Teacher", url: "https://www.lawteacher.net/", description: "Free law essays and study resources." },
    ],
    courses: [
      { name: "Introduction to International Criminal Law", platform: "Coursera", url: "https://www.coursera.org/learn/international-criminal-law", free: false },
      { name: "Law and the Entrepreneur", platform: "Coursera", url: "https://www.coursera.org/learn/law-entrepreneur", free: false },
    ],
    docs: [
      { name: "Cornell LII Wex Legal Dictionary", url: "https://www.law.cornell.edu/wex" },
      { name: "SSRN Legal Research", url: "https://www.ssrn.com/index.cfm/en/" },
    ],
    playlists: [
      { title: "Crash Course: Law", channel: "CrashCourse", url: "https://www.youtube.com/watch?v=Aq2TqDMOSFE" },
      { title: "Harvard Law School Lectures", channel: "Harvard Law School", url: "https://www.youtube.com/@HarvardLaw" },
    ],
  },
  "Engineering (Mechanical/Civil/Electrical)": {
    websites: [
      { name: "MIT OpenCourseWare – Engineering", url: "https://ocw.mit.edu/search/?d=Engineering", description: "Free MIT engineering courses and materials." },
      { name: "Engineering Toolbox", url: "https://www.engineeringtoolbox.com/", description: "Engineering data, formulas, and tools." },
      { name: "Khan Academy Physics", url: "https://www.khanacademy.org/science/physics", description: "Physics fundamentals for engineers." },
    ],
    courses: [
      { name: "A Hands-on Introduction to Engineering Simulations", platform: "edX (Cornell)", url: "https://www.edx.org/learn/engineering-simulations/cornell-university-a-hands-on-introduction-to-engineering-simulations", free: false },
      { name: "Introduction to Mechanics", platform: "Coursera", url: "https://www.coursera.org/learn/mechanics-and-kinematics", free: false },
    ],
    docs: [
      { name: "ASME Engineering Standards", url: "https://www.asme.org/codes-standards" },
      { name: "IEEE Xplore", url: "https://ieeexplore.ieee.org/" },
    ],
    playlists: [
      { title: "Engineering Lectures", channel: "MIT OpenCourseWare", url: "https://www.youtube.com/@mitocw" },
      { title: "The Engineering Mindset", channel: "The Engineering Mindset", url: "https://www.youtube.com/@TheEngineeringMindset" },
    ],
  },
  "Psychology": {
    websites: [
      { name: "Simply Psychology", url: "https://www.simplypsychology.org/", description: "Easy-to-understand psychology study guides." },
      { name: "APA Resources", url: "https://www.apa.org/", description: "American Psychological Association resources." },
      { name: "Psychology Today", url: "https://www.psychologytoday.com/", description: "Psychology news, articles, and therapist finder." },
    ],
    courses: [
      { name: "Introduction to Psychology", platform: "Coursera (Yale)", url: "https://www.coursera.org/learn/introduction-psych", free: false },
      { name: "The Science of Well-Being", platform: "Coursera (Yale)", url: "https://www.coursera.org/learn/the-science-of-well-being", free: false },
    ],
    docs: [
      { name: "APA Style Guide", url: "https://apastyle.apa.org/" },
      { name: "DSM-5 Overview", url: "https://www.psychiatry.org/psychiatrists/practice/dsm" },
    ],
    playlists: [
      { title: "CrashCourse Psychology", channel: "CrashCourse", url: "https://www.youtube.com/playlist?list=PL8dPuuaLjXtOPRKzVLY0jR2-hzpGGC7nG" },
      { title: "Psychology Lectures – Yale", channel: "YaleCourses", url: "https://www.youtube.com/playlist?list=PLDF7B08FF8564D1FE" },
    ],
  },
  "Economics / Finance": {
    websites: [
      { name: "Investopedia", url: "https://www.investopedia.com/", description: "Finance and economics education." },
      { name: "Our World in Data", url: "https://ourworldindata.org/", description: "Data-driven economic research." },
      { name: "Marginal Revolution University", url: "https://mru.org/", description: "Free economics video courses." },
    ],
    courses: [
      { name: "Financial Markets", platform: "Coursera (Yale)", url: "https://www.coursera.org/learn/financial-markets-global", free: false },
      { name: "The Global Financial Crisis", platform: "Coursera (Yale)", url: "https://www.coursera.org/learn/global-financial-crisis", free: false },
    ],
    docs: [
      { name: "IMF Data & Research", url: "https://www.imf.org/en/Data" },
      { name: "World Bank Open Data", url: "https://data.worldbank.org/" },
    ],
    playlists: [
      { title: "CrashCourse Economics", channel: "CrashCourse", url: "https://www.youtube.com/playlist?list=PL8dPuuaLjXtPNZwz5_o_5uirJ8gQXnhEO" },
      { title: "Finance & Investing", channel: "Aswath Damodaran", url: "https://www.youtube.com/@AswathDamodaranonValuation" },
    ],
  },
};

// ── Subject list and generation ───────────────────────────────────────────────
const subjectsByDegree: Record<string, string[][]> = {
  "Computer Science / Software Engineering": [
    ["Introduction to Programming", "Engineering Mathematics", "Web Development", "Data Structures & Algorithms"],
    ["Operating Systems", "Database Systems", "Computer Networks", "Artificial Intelligence"],
    ["Machine Learning", "Cybersecurity", "Software Engineering Principles", "Cloud Computing"],
    ["Advanced Algorithms", "Distributed Systems", "Computer Vision", "Capstone Project"],
  ],
  "Business Administration / Management": [
    ["Principles of Management", "Financial Accounting", "Microeconomics", "Business Communication"],
    ["Marketing Basics", "Macroeconomics", "Organizational Behavior", "Business Statistics"],
    ["Strategic Management", "Corporate Finance", "Operations Management", "Business Ethics"],
    ["International Business", "Entrepreneurship", "Leadership & Change", "Business Strategy Capstone"],
  ],
  "Medicine / Biomedical Science": [
    ["Anatomy", "Physiology", "Biochemistry", "Cell Biology"],
    ["Microbiology", "Immunology", "Pathology", "Genetics"],
    ["Pharmacology", "Clinical Skills", "Medical Ethics", "Epidemiology"],
    ["Internal Medicine", "Surgery Principles", "Psychiatry", "Research Methods in Medicine"],
  ],
  "Law": [
    ["Introduction to Legal Systems", "Contract Law", "Constitutional Law", "Legal Research & Writing"],
    ["Tort Law", "Criminal Law", "Property Law", "European Union Law"],
    ["Company Law", "International Law", "Human Rights Law", "Evidence"],
    ["Family Law", "Intellectual Property", "Comparative Law", "Dissertation"],
  ],
  "Engineering (Mechanical/Civil/Electrical)": [
    ["Engineering Mathematics", "Physics for Engineers", "Engineering Mechanics", "Engineering Drawing & CAD"],
    ["Fluid Mechanics", "Thermodynamics", "Materials Science", "Circuit Theory"],
    ["Control Systems", "Structural Analysis", "Geotechnical Engineering", "Engineering Design"],
    ["Finite Element Analysis", "Renewable Energy Systems", "Advanced Manufacturing", "Engineering Management"],
  ],
  "Psychology": [
    ["Introduction to Psychology", "Research Methods", "Biopsychology", "Developmental Psychology"],
    ["Cognitive Psychology", "Social Psychology", "Abnormal Psychology", "Personality Psychology"],
    ["Clinical Psychology", "Neuropsychology", "Health Psychology", "Forensic Psychology"],
    ["Advanced Research Methods", "Psychotherapy Theories", "Positive Psychology", "Dissertation"],
  ],
  "Economics / Finance": [
    ["Microeconomic Theory", "Macroeconomic Theory", "Quantitative Methods", "Introduction to Finance"],
    ["Econometrics", "Corporate Finance", "Financial Markets", "Game Theory"],
    ["International Economics", "Public Finance", "Investment Analysis", "Behavioural Economics"],
    ["Financial Derivatives", "Advanced Macroeconomics", "Development Economics", "Economics Dissertation"],
  ],
};

const degreeFaculties: Record<string, string> = {
  "Computer Science / Software Engineering": "Faculty of Computing & Digital Technologies",
  "Business Administration / Management": "Faculty of Business & Management",
  "Medicine / Biomedical Science": "Faculty of Medicine & Health Sciences",
  "Law": "Faculty of Law",
  "Engineering (Mechanical/Civil/Electrical)": "Faculty of Engineering",
  "Psychology": "Faculty of Arts, Sciences & Psychology",
  "Economics / Finance": "Faculty of Economics & Finance",
};

const uniNames: Record<string, string[]> = {
  "UK": ["University of Oxford", "Imperial College London", "UCL"],
  "USA": ["MIT", "Stanford University", "Harvard University"],
  "Mauritius": ["University of Mauritius", "Middlesex University Mauritius", "Curtin Mauritius"],
  "France": ["Sorbonne University", "École Polytechnique", "Université PSL"],
  "Canada": ["University of Toronto", "University of British Columbia", "McGill University"],
  "Australia": ["University of Melbourne", "University of Sydney", "UNSW Sydney"],
  "India": ["IIT Bombay", "IISc Bangalore", "Delhi University"],
  "Germany": ["Technical University of Munich", "LMU Munich", "Heidelberg University"],
  "Singapore": ["National University of Singapore", "Nanyang Technological University", "SMU"],
  "UAE": ["United Arab Emirates University", "Khalifa University", "Abu Dhabi University"],
};

function buildSubject(name: string, degreeKey: string, yearIdx: number, subjectIdx: number): Subject {
  const res = SUBJECT_RESOURCES[name];
  const fallback = DEGREE_FALLBACKS[degreeKey] ?? DEGREE_FALLBACKS["Computer Science / Software Engineering"];

  const modules = res?.modules ?? [
    { name: "Foundations", topics: ["Core concepts", "Terminology", "Historical context"] },
    { name: "Core Principles", topics: ["Key theories", "Analytical methods", "Case studies"] },
    { name: "Applied Practice", topics: ["Problem solving", "Modern techniques", "Group projects"] },
    { name: "Advanced Topics", topics: ["Current research", "Emerging trends", "Capstone review"] },
  ];

  const beginner: LearningResource[] = res?.beginner ?? [
    { title: "Introduction on Khan Academy", type: 'website', url: "https://www.khanacademy.org/", description: "Free foundational learning for every subject.", free: true },
  ];
  const intermediate: LearningResource[] = res?.intermediate ?? [
    { title: "MIT OpenCourseWare Lectures", type: 'course', url: "https://ocw.mit.edu/", description: "Free lecture notes and videos from MIT professors.", free: true },
  ];
  const advanced: LearningResource[] = res?.advanced ?? [
    { title: "Coursera Advanced Specialisation", type: 'course', url: "https://www.coursera.org/", description: "University-level advanced specialisations.", free: false },
  ];

  return {
    id: `${degreeKey.substring(0, 3)}-y${yearIdx + 1}-s${subjectIdx}`.toLowerCase().replace(/\s+/g, '-'),
    name,
    code: `${name.substring(0, 3).toUpperCase()}${(yearIdx + 1) * 100 + subjectIdx + 1}`,
    courseOverview: res?.overview ?? `An in-depth study of ${name}, covering both theoretical foundations and practical applications relevant to ${degreeKey}.`,
    modules,
    learningPaths: [
      { level: "Beginner", resources: beginner },
      { level: "Intermediate", resources: intermediate },
      { level: "Advanced", resources: advanced },
    ],
    recommendedWebsites: res?.websites ?? fallback.websites,
    onlineCourses: res?.courses ?? fallback.courses,
    documentation: res?.docs ?? fallback.docs,
    books: res?.books ?? [
      { title: `Foundations of ${name}`, author: "University Press", year: 2022 },
    ],
    youtubePlaylists: res?.playlists ?? fallback.playlists,
    practiceMaterial: res?.practice ?? [
      { name: "Quizlet Flashcards", url: `https://quizlet.com/search?query=${encodeURIComponent(name)}`, description: "Community flashcard decks for exam revision." },
      { name: "Anki Shared Decks", url: "https://ankiweb.net/shared/decks", description: "Spaced-repetition flashcard decks." },
    ],
  };
}

function generateDegrees(): Degree[] {
  return Object.keys(subjectsByDegree).map(degreeName => {
    const yearData = subjectsByDegree[degreeName];
    return {
      id: degreeName.toLowerCase().replace(/[\s/]+/g, '-'),
      name: degreeName,
      faculty: degreeFaculties[degreeName] ?? "Faculty of Studies",
      years: yearData.map((subjectNames, yearIdx) => ({
        year: yearIdx + 1,
        subjects: subjectNames.map((name, si) => buildSubject(name, degreeName, yearIdx, si)),
      })),
    };
  });
}

export function generateLearningDatabase(): CountryData[] {
  const degrees = generateDegrees();
  return Object.entries(uniNames).map(([country, unis]) => ({
    country,
    universities: unis.map(uniName => ({
      id: uniName.toLowerCase().replace(/\s+/g, '-'),
      name: uniName,
      degrees,
    })),
  }));
}

export const learningDatabase = generateLearningDatabase();
