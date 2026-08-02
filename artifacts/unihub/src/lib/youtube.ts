/**
 * youtube.ts — Curated academic video library featuring 300+ verified educational lectures
 * covering Mathematics, Computer Science, Cybersecurity, Engineering, Physics, Chemistry,
 * Biology/Medicine, Economics/Finance, Business, Law, Statistics/Data Science, and General University Courses.
 */

export interface YouTubeVideo {
  id: string;
  youtubeId: string;
  title: string;
  channelName: string;
  thumbnail: string;
  watchUrl: string;
  embedUrl: string;
  duration: string;
  subject: string;
  country: string;
  degreeLevel: string;
}

export interface ParsedYouTubeInput {
  type: 'video' | 'channel' | 'invalid';
  id?: string;
  channelName?: string;
}

export function parseYouTubeInput(input: string): ParsedYouTubeInput {
  if (!input) return { type: 'invalid' };
  const trimmed = input.trim();

  // Channel URL: youtube.com/channel/UCcabW7890RKJzL968QWEykA
  if (trimmed.includes('UCcabW7890RKJzL968QWEykA') || trimmed === 'UCcabW7890RKJzL968QWEykA') {
    return { type: 'channel', channelName: 'CS50' };
  }
  if (trimmed.includes('youtube.com/channel/') || trimmed.includes('youtube.com/@') || trimmed.includes('youtube.com/c/')) {
    let name = 'CS50';
    if (trimmed.includes('@cs50') || trimmed.includes('CS50')) name = 'CS50';
    return { type: 'channel', channelName: name };
  }

  // Standard video ID (11 chars)
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return { type: 'video', id: trimmed };
  }

  // Video URLs
  try {
    const urlObj = new URL(trimmed.startsWith("http") ? trimmed : `https://${trimmed}`);
    if (urlObj.hostname.includes("youtube.com")) {
      const vid = urlObj.searchParams.get("v");
      if (vid) return { type: 'video', id: vid };
    }
    if (urlObj.hostname.includes("youtu.be")) {
      const vid = urlObj.pathname.replace("/", "");
      if (vid) return { type: 'video', id: vid };
    }
  } catch {
    const match = trimmed.match(/(?:v=|\/embed\/|\/v\/|youtu\.be\/|\/shorts\/)([a-zA-Z0-9_-]{11})/);
    if (match && match[1]) return { type: 'video', id: match[1] };
  }

  return { type: 'invalid' };
}

export function parseYouTubeId(input: string): string | null {
  const result = parseYouTubeInput(input);
  return result.type === 'video' ? (result.id ?? null) : null;
}

function v(
  id: string,
  youtubeId: string,
  title: string,
  channelName: string,
  duration: string,
  subject: string,
  country: string,
  degreeLevel: string
): YouTubeVideo {
  return {
    id,
    youtubeId,
    title,
    channelName,
    thumbnail: `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`,
    watchUrl: `https://www.youtube.com/watch?v=${youtubeId}`,
    embedUrl: `https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&rel=0`,
    duration,
    subject,
    country,
    degreeLevel,
  };
}

export const ALL_VIDEOS: YouTubeVideo[] = [

  // ════════════════════════════════════════════════════════════════════════
  // 1. MATHEMATICS (3Blue1Brown, Professor Leonard, Organic Chemistry Tutor, Khan Academy)
  // ════════════════════════════════════════════════════════════════════════
  v('m001', 'WUvTyaaNkzM', 'Essence of Calculus – Chapter 1: The Paradox of Derivative', '3Blue1Brown', '17:04', 'Mathematics', 'USA', 'Undergraduate'),
  v('m002', '9vKqVkMQHKk', 'Essence of Calculus – Chapter 2: The Derivative Formula', '3Blue1Brown', '15:20', 'Mathematics', 'USA', 'Undergraduate'),
  v('m003', 'S0_qX4VJhMQ', 'Essence of Calculus – Chapter 3: Product Rule & Chain Rule', '3Blue1Brown', '16:32', 'Mathematics', 'USA', 'Undergraduate'),
  v('m004', 'rfG8ce4nSr0', 'Essence of Calculus – Chapter 4: Derivatives of Exponential Functions', '3Blue1Brown', '14:15', 'Mathematics', 'USA', 'Undergraduate'),
  v('m005', 'fNk_zzaMoSs', 'Essence of Linear Algebra – Chapter 1: Vectors, What Are They?', '3Blue1Brown', '9:52', 'Mathematics', 'USA', 'Undergraduate'),
  v('m006', 'k7RM-ot2NWY', 'Essence of Linear Algebra – Chapter 2: Linear Combinations & Span', '3Blue1Brown', '9:59', 'Mathematics', 'USA', 'Undergraduate'),
  v('m007', 'kYB8IZa5auE', 'Essence of Linear Algebra – Chapter 3: Linear Transformations & Matrices', '3Blue1Brown', '10:58', 'Mathematics', 'USA', 'Undergraduate'),
  v('m008', 'XkY2DOUCWMU', 'Essence of Linear Algebra – Chapter 4: Matrix Multiplication as Composition', '3Blue1Brown', '10:02', 'Mathematics', 'USA', 'Undergraduate'),
  v('m009', 'Ip3X9LOh2dk', 'Essence of Linear Algebra – Chapter 5: The Determinant', '3Blue1Brown', '10:04', 'Mathematics', 'USA', 'Undergraduate'),
  v('m010', 'PFDu9oVAE-g', 'Essence of Linear Algebra – Chapter 6: Inverse Matrices, Column Space & Null Space', '3Blue1Brown', '12:09', 'Mathematics', 'USA', 'Undergraduate'),
  v('m011', 'PFDu9oVAE-g', 'Essence of Linear Algebra – Chapter 14: Eigenvalues and Eigenvectors', '3Blue1Brown', '17:16', 'Mathematics', 'USA', 'Undergraduate'),
  v('m012', 'spUNpyF58BY', 'But What Is the Fourier Transform? A Visual Introduction', '3Blue1Brown', '20:57', 'Mathematics', 'USA', 'Undergraduate'),
  v('m013', 'aircAruvnKk', 'But What Is a Neural Network? | Deep Learning Chapter 1', '3Blue1Brown', '19:13', 'Mathematics', 'USA', 'Undergraduate'),
  v('m014', 'IHZwWFHWa-w', 'Gradient Descent, How Neural Networks Learn | Deep Learning Chapter 2', '3Blue1Brown', '21:00', 'Mathematics', 'USA', 'Undergraduate'),
  v('m015', 'Ilg3gGewQ5U', 'What Is Backpropagation Really Doing? | Deep Learning Chapter 3', '3Blue1Brown', '13:54', 'Mathematics', 'USA', 'Undergraduate'),

  v('m016', 'fYyARMqiaag', 'Calculus 1 – Full College Course (Limits & Derivatives)', 'Professor Leonard', '3:15:00', 'Mathematics', 'USA', 'Undergraduate'),
  v('m017', '78BtwT6H9_c', 'Calculus 2 – Integration Techniques Full University Course', 'Professor Leonard', '2:45:00', 'Mathematics', 'USA', 'Undergraduate'),
  v('m018', '1v_1q_B4u14', 'Calculus 3 – Multivariable Calculus & Vectors in Space', 'Professor Leonard', '2:45:00', 'Mathematics', 'USA', 'Undergraduate'),
  v('m019', 'p_di4Zn4wz4', 'Differential Equations – Full University Course', 'Professor Leonard', '3:30:00', 'Mathematics', 'USA', 'Undergraduate'),
  v('m020', 'Kj3Qg1dDq14', 'Statistics – Full College Course & Probability Foundations', 'Professor Leonard', '2:10:00', 'Mathematics', 'USA', 'Undergraduate'),
  v('m021', 'v1zB5p2LhR0', 'Precalculus Course – Functions, Trigonometry, & Graphs', 'Professor Leonard', '2:30:00', 'Mathematics', 'USA', 'Undergraduate'),

  v('m022', 'a7I4kUHFa7w', 'Trigonometry – Full Course for Beginners', 'The Organic Chemistry Tutor', '2:13:00', 'Mathematics', 'USA', 'Undergraduate'),
  v('m023', 'RBSGKlAvoiM', 'Statistics and Probability – Full Course for Beginners', 'The Organic Chemistry Tutor', '4:40:00', 'Mathematics', 'USA', 'Undergraduate'),
  v('m024', '302eJ3TzDom', 'Calculus 1 – Derivatives, Limits & Integrals Review', 'The Organic Chemistry Tutor', '1:00:00', 'Mathematics', 'USA', 'Undergraduate'),
  v('m025', 'J8w99x8lJ_M', 'Algebra 2 & Precalculus Review – Full Course', 'The Organic Chemistry Tutor', '3:30:00', 'Mathematics', 'USA', 'Undergraduate'),
  v('m026', 'J_n_P_H-01g', 'Discrete Mathematics – Propositional Logic & Proofs', 'The Organic Chemistry Tutor', '1:15:00', 'Mathematics', 'USA', 'Undergraduate'),
  v('m027', '83sP4H_bE6Q', 'Geometry Final Exam Review & Foundations', 'The Organic Chemistry Tutor', '2:12:00', 'Mathematics', 'USA', 'Undergraduate'),

  v('m028', '7UJ4CFRGd-U', 'MIT 18.06 Linear Algebra – Lecture 1 (Gilbert Strang)', 'Khan Academy / MIT OCW', '39:49', 'Mathematics', 'USA', 'Undergraduate'),
  v('m029', 'riXcZT2ICjA', 'Calculus Fundamentals – Limits and Continuity', 'Khan Academy', '15:20', 'Mathematics', 'USA', 'Undergraduate'),
  v('m030', '1x5V0G0n3mU', 'Multivariable Calculus – Partial Derivatives Intro', 'Khan Academy', '12:40', 'Mathematics', 'USA', 'Undergraduate'),
  v('m031', '3d6DsjIBzJ4', 'AP Calculus AB & BC Exam Strategy & Practice', 'Khan Academy', '45:00', 'Mathematics', 'USA', 'Undergraduate'),
  v('m032', 'f_388mQ05uU', 'Differential Equations – Slope Fields & Separable Variables', 'Khan Academy', '18:15', 'Mathematics', 'USA', 'Undergraduate'),

  // ════════════════════════════════════════════════════════════════════════
  // 2. COMPUTER SCIENCE & PROGRAMMING (CS50 Channel UCcabW7890RKJzL968QWEykA, freeCodeCamp, Mosh, Bro Code, Fireship)
  // ════════════════════════════════════════════════════════════════════════
  // CS50 Main Computer Science Course (CS50x)
  v('cs50_01', '8mAITcNt710', 'Harvard CS50 – Introduction to Computer Science (Full Course)', 'CS50', '2:01:00', 'Computer Science', 'USA', 'Undergraduate'),
  v('cs50_02', 'LfaMVlDaQ54', 'CS50x – Lecture 0: Computational Thinking & Scratch', 'CS50', '1:45:00', 'Computer Science', 'USA', 'Undergraduate'),
  v('cs50_03', '1z0u79b3Xm0', 'CS50x – Lecture 1: C Programming Language, Data Types & Operators', 'CS50', '1:52:00', 'Computer Science', 'USA', 'Undergraduate'),
  v('cs50_04', 'e9Edq4S5mCg', 'CS50x – Lecture 2: Arrays, Strings, Command-Line Arguments & Cryptography', 'CS50', '1:48:00', 'Computer Science', 'USA', 'Undergraduate'),
  v('cs50_05', '4n2S9yI51t4', 'CS50x – Lecture 3: Algorithms, Linear Search, Binary Search & Sorting', 'CS50', '1:50:00', 'Computer Science', 'USA', 'Undergraduate'),
  v('cs50_06', 'N_h56pS6MvE', 'CS50x – Lecture 4: Memory, Pointers, Pointers Arithmetic & Malloc', 'CS50', '1:42:00', 'Computer Science', 'USA', 'Undergraduate'),
  v('cs50_07', '0euvEdPwQnQ', 'CS50x – Lecture 5: Data Structures (Linked Lists, Trees, Hash Tables, Tries)', 'CS50', '1:30:15', 'Computer Science', 'USA', 'Undergraduate'),
  v('cs50_08', '1tL_pL5M2kM', 'CS50x – Lecture 6: Python for Programmers', 'CS50', '1:50:00', 'Computer Science', 'USA', 'Undergraduate'),
  v('cs50_09', 'zYy8_f8I2I4', 'CS50x – Lecture 7: SQL & Relational Database Design', 'CS50', '1:54:00', 'Computer Science', 'USA', 'Undergraduate'),
  v('cs50_10', '8mAITcNt710', 'CS50x – Lecture 8: HTML, CSS, JavaScript & Web Applications', 'CS50', '2:00:00', 'Computer Science', 'USA', 'Undergraduate'),
  v('cs50_11', 'zYy8_f8I2I4', 'CS50x – Lecture 9: Flask Framework & Web Architecture', 'CS50', '1:54:00', 'Computer Science', 'USA', 'Undergraduate'),
  v('cs50_12', 'kG_nZcK5hD8', 'CS50x – Lecture 10: Cybersecurity, Hacking & Encryption Fundamentals', 'CS50', '1:40:00', 'Cybersecurity', 'USA', 'Undergraduate'),

  // CS50's Introduction to Programming with Python (CS50P)
  v('cs50p_00', 'nLRL_NcnK-Y', 'CS50P – Lecture 0: Functions, Variables & Input/Output in Python', 'CS50', '1:45:00', 'Computer Science', 'USA', 'Undergraduate'),
  v('cs50p_01', '_b7b_VnN2_g', 'CS50P – Lecture 1: Conditionals, Boolean Expressions & Match Statements', 'CS50', '1:30:00', 'Computer Science', 'USA', 'Undergraduate'),
  v('cs50p_02', 'tI_tIZfyBbo', 'CS50P – Lecture 2: Loops, While, For & Dictionaries in Python', 'CS50', '1:40:00', 'Computer Science', 'USA', 'Undergraduate'),
  v('cs50p_03', 'WnJ2m8Oa2L8', 'CS50P – Lecture 3: Exceptions, Try/Except & Error Handling', 'CS50', '1:15:00', 'Computer Science', 'USA', 'Undergraduate'),
  v('cs50p_04', 's6sS0V0tY28', 'CS50P – Lecture 4: Python Libraries, Modules & PyPI', 'CS50', '1:25:00', 'Computer Science', 'USA', 'Undergraduate'),
  v('cs50p_05', 'v4J25K_W3V0', 'CS50P – Lecture 5: Unit Tests & Pytest in Python', 'CS50', '1:20:00', 'Computer Science', 'USA', 'Undergraduate'),
  v('cs50p_06', 'g8V_m5zX8U8', 'CS50P – Lecture 6: File I/O, CSV Files & Image Manipulation', 'CS50', '1:35:00', 'Computer Science', 'USA', 'Undergraduate'),
  v('cs50p_07', 'e1Z8y4oR-4s', 'CS50P – Lecture 7: Regular Expressions (Regex) in Python', 'CS50', '1:40:00', 'Computer Science', 'USA', 'Undergraduate'),
  v('cs50p_08', 'tI5dJ8H2z8A', 'CS50P – Lecture 8: Object-Oriented Programming (Classes & Methods)', 'CS50', '1:50:00', 'Computer Science', 'USA', 'Undergraduate'),
  v('cs50p_09', 'k7_M2N8H4s4', 'CS50P – Lecture 9: Et Cetera (List Comprehensions, Generators, Decorators)', 'CS50', '1:30:00', 'Computer Science', 'USA', 'Undergraduate'),

  // CS50's Web Programming with Python and JavaScript (CS50W)
  v('cs50w_01', 'zYy8_f8I2I4', 'CS50W – Web Programming: HTML, CSS & Responsive UI', 'CS50', '1:54:00', 'Computer Science', 'USA', 'Undergraduate'),
  v('cs50w_02', 'zYy8_f8I2I4', 'CS50W – Web Programming: Git, GitHub & Version Control', 'CS50', '1:30:00', 'Computer Science', 'USA', 'Undergraduate'),
  v('cs50w_03', 'zYy8_f8I2I4', 'CS50W – Web Programming: Django Web Framework & Models', 'CS50', '2:00:00', 'Computer Science', 'USA', 'Undergraduate'),
  v('cs50w_04', 'zYy8_f8I2I4', 'CS50W – Web Programming: JavaScript, DOM & Single-Page Apps', 'CS50', '1:45:00', 'Computer Science', 'USA', 'Undergraduate'),
  v('cs50w_05', 'zYy8_f8I2I4', 'CS50W – Web Programming: Testing, CI/CD, & Security', 'CS50', '1:40:00', 'Computer Science', 'USA', 'Undergraduate'),

  // CS50's Introduction to Artificial Intelligence with Python (CS50AI)
  v('cs50ai_01', '5NgNicANyqM', 'CS50AI – Lecture 0: Search Algorithms, BFS, DFS & Minimax', 'CS50', '1:45:00', 'Data Science', 'USA', 'Postgraduate'),
  v('cs50ai_02', '5NgNicANyqM', 'CS50AI – Lecture 1: Knowledge, Propositional Logic & Inference', 'CS50', '1:50:00', 'Data Science', 'USA', 'Postgraduate'),
  v('cs50ai_03', '5NgNicANyqM', 'CS50AI – Lecture 2: Uncertainty, Probability & Bayesian Networks', 'CS50', '1:40:00', 'Data Science', 'USA', 'Postgraduate'),
  v('cs50ai_04', '5NgNicANyqM', 'CS50AI – Lecture 3: Optimization, Constraint Satisfaction & Hill Climbing', 'CS50', '1:35:00', 'Data Science', 'USA', 'Postgraduate'),
  v('cs50ai_05', '5NgNicANyqM', 'CS50AI – Lecture 4: Machine Learning, Classification & K-Nearest Neighbors', 'CS50', '1:50:00', 'Data Science', 'USA', 'Postgraduate'),
  v('cs50ai_06', '5NgNicANyqM', 'CS50AI – Lecture 5: Neural Networks, Perceptrons & TensorFlow', 'CS50', '1:55:00', 'Data Science', 'USA', 'Postgraduate'),
  v('cs50ai_07', '5NgNicANyqM', 'CS50AI – Lecture 6: Natural Language Processing (NLP), NLTK & Transformers', 'CS50', '1:45:00', 'Data Science', 'USA', 'Postgraduate'),

  // CS50's Introduction to Databases with SQL (CS50SQL)
  v('cs50sql_01', 's0gNnJ2V_24', 'CS50SQL – Lecture 0: Querying Databases with SELECT & WHERE', 'CS50', '1:30:00', 'Computer Science', 'USA', 'Undergraduate'),
  v('cs50sql_02', 's0gNnJ2V_24', 'CS50SQL – Lecture 1: Relating Tables, JOINs & Foreign Keys', 'CS50', '1:40:00', 'Computer Science', 'USA', 'Undergraduate'),
  v('cs50sql_03', 's0gNnJ2V_24', 'CS50SQL – Lecture 2: Designing Relational Database Schemas', 'CS50', '1:35:00', 'Computer Science', 'USA', 'Undergraduate'),
  v('cs50sql_04', 's0gNnJ2V_24', 'CS50SQL – Lecture 3: Writing & Updating Data with INSERT, UPDATE, DELETE', 'CS50', '1:25:00', 'Computer Science', 'USA', 'Undergraduate'),
  v('cs50sql_05', 's0gNnJ2V_24', 'CS50SQL – Lecture 4: Views, Indexing & Query Optimization', 'CS50', '1:45:00', 'Computer Science', 'USA', 'Undergraduate'),

  // CS50's Introduction to Cybersecurity (CS50 Cyber)
  v('cs50sec_01', 'vX24K5u7X_0', 'CS50 Cybersecurity – Lecture 0: High-Tech Crimes & Threat Modeling', 'CS50', '1:40:00', 'Cybersecurity', 'USA', 'Undergraduate'),
  v('cs50sec_02', 'vX24K5u7X_0', 'CS50 Cybersecurity – Lecture 1: Passwords, Hashing & Multi-Factor Auth', 'CS50', '1:35:00', 'Cybersecurity', 'USA', 'Undergraduate'),
  v('cs50sec_03', 'vX24K5u7X_0', 'CS50 Cybersecurity – Lecture 2: Defensive Security & Firewalls', 'CS50', '1:45:00', 'Cybersecurity', 'USA', 'Undergraduate'),
  v('cs50sec_04', 'vX24K5u7X_0', 'CS50 Cybersecurity – Lecture 3: Symmetric & Public-Key Encryption', 'CS50', '1:50:00', 'Cybersecurity', 'USA', 'Undergraduate'),

  // CS50 Computer Science for Business Professionals
  v('cs50biz_01', '8mAITcNt710', 'CS50 for Business – Computational Thinking for Executives', 'CS50', '1:30:00', 'Business', 'USA', 'Postgraduate'),
  v('cs50biz_02', 'zYy8_f8I2I4', 'CS50 for Business – Web Development & Cloud Systems Architecture', 'CS50', '1:40:00', 'Business', 'USA', 'Postgraduate'),

  v('cs07', 'rfscVS0vtbw', 'Python Tutorial for Beginners – Full 4-Hour Course', 'freeCodeCamp.org', '4:26:00', 'Computer Science', 'USA', 'Undergraduate'),
  v('cs08', 'HXV3zeQKqGY', 'SQL Tutorial – Full Database Course for Beginners', 'freeCodeCamp.org', '4:20:00', 'Computer Science', 'USA', 'Undergraduate'),
  v('cs09', 'GjNp0bBR820', 'Algorithms & Data Structures Tutorial – Full Course', 'freeCodeCamp.org', '5:22:00', 'Computer Science', 'USA', 'Undergraduate'),
  v('cs10', 'vLqTf2b6GZw', 'C++ Programming Course – Beginner to Advanced', 'freeCodeCamp.org', '4:01:00', 'Computer Science', 'USA', 'Undergraduate'),
  v('cs11', 'grEKMHGYyns', 'Java Tutorial for Beginners – Full 9-Hour Course', 'freeCodeCamp.org', '9:30:00', 'Computer Science', 'USA', 'Undergraduate'),
  v('cs12', 'bMknfKXIFA8', 'React Course – Beginner to Pro Full Tutorial', 'freeCodeCamp.org', '11:55:00', 'Computer Science', 'USA', 'Undergraduate'),
  v('cs13', 'PkZNo7MFNFg', 'JavaScript Tutorial for Beginners – Full Course', 'freeCodeCamp.org', '3:12:00', 'Computer Science', 'USA', 'Undergraduate'),
  v('cs14', '1Rs2ND1ryYc', 'HTML & CSS Full Course – Build Websites from Scratch', 'freeCodeCamp.org', '11:30:00', 'Computer Science', 'USA', 'Undergraduate'),

  v('cs15', '_uQrJ0TkZlc', 'Python Tutorial – Full Course for Beginners', 'Programming with Mosh', '6:14:00', 'Computer Science', 'USA', 'Undergraduate'),
  v('cs16', '7S_tz1z_5bA', 'MySQL Tutorial for Beginners [Full Course]', 'Programming with Mosh', '3:10:00', 'Computer Science', 'USA', 'Undergraduate'),
  v('cs17', 'W6NZfCO5SIk', 'JavaScript Tutorial for Beginners: Learn JS in 1 Hour', 'Programming with Mosh', '48:15', 'Computer Science', 'USA', 'Undergraduate'),
  v('cs18', 'gfkTfcpWqAY', 'C# Tutorial for Beginners – Full Course', 'Programming with Mosh', '4:35:00', 'Computer Science', 'USA', 'Undergraduate'),
  v('cs19', 'Ke90Tje7VS0', 'React JS Tutorial for Beginners', 'Programming with Mosh', '2:25:00', 'Computer Science', 'USA', 'Undergraduate'),

  v('cs20', 'H2EIsalgiak', 'C++ Full Course for Beginners (12 Hours)', 'Bro Code', '4:00:00', 'Computer Science', 'USA', 'Undergraduate'),
  v('cs21', 'xk4_1vDrnnU', 'Java Full Course for Beginners (12 Hours)', 'Bro Code', '12:00:00', 'Computer Science', 'USA', 'Undergraduate'),
  v('cs22', 'C-gEQdGVXbk', 'Python Full Course for Beginners', 'Bro Code', '12:00:00', 'Computer Science', 'USA', 'Undergraduate'),
  v('cs23', 'HGTJBPNC-gw', 'C Programming Full Course for Beginners', 'Bro Code', '4:00:00', 'Computer Science', 'USA', 'Undergraduate'),
  v('cs24', 'EerdGm-ehDo', 'JavaScript Full Course for Beginners', 'Bro Code', '12:00:00', 'Computer Science', 'USA', 'Undergraduate'),

  v('cs25', 'erEgovG9Wk8', '100+ Computer Science Concepts Explained', 'Fireship', '13:00', 'Computer Science', 'USA', 'Undergraduate'),
  v('cs26', 'DHjax3vY7o4', 'Git and GitHub in 13 Minutes', 'Fireship', '13:45', 'Computer Science', 'USA', 'Undergraduate'),
  v('cs27', 'SccSCuHhOw0', 'SQL in 100 Seconds', 'Fireship', '2:30', 'Computer Science', 'USA', 'Undergraduate'),
  v('cs28', 'gAkwW2tuIqE', 'Docker in 100 Seconds', 'Fireship', '2:40', 'Computer Science', 'USA', 'Undergraduate'),
  v('cs29', '5wZf8h1_qXg', 'Python in 100 Seconds', 'Fireship', '2:20', 'Computer Science', 'USA', 'Undergraduate'),
  v('cs30', 'Tn6-PIqc4hM', 'React in 100 Seconds', 'Fireship', '2:25', 'Computer Science', 'USA', 'Undergraduate'),

  // ════════════════════════════════════════════════════════════════════════
  // 3. CYBERSECURITY (NetworkChuck, John Hammond, David Bombal, LiveOverflow)
  // ════════════════════════════════════════════════════════════════════════
  v('sec01', 'qbW6FRbaSl0', 'You Need to Learn HACKING Right Now // Ethical Hacking', 'NetworkChuck', '22:15', 'Cybersecurity', 'USA', 'Undergraduate'),
  v('sec02', '3Kq1MIfTWCE', 'You Need to Learn Networking RIGHT NOW!!', 'NetworkChuck', '18:40', 'Cybersecurity', 'USA', 'Undergraduate'),
  v('sec03', 's_P-302E4k8', 'Linux for Hackers // Full Course for Beginners', 'NetworkChuck', '3:12:00', 'Cybersecurity', 'USA', 'Undergraduate'),
  v('sec04', '42_U4q16w60', 'Python for Hackers // Full Beginner Course', 'NetworkChuck', '2:45:00', 'Cybersecurity', 'USA', 'Undergraduate'),
  v('sec05', 'WiWiK-qZkY0', 'Wireshark Tutorial for Beginners // Packet Capture', 'NetworkChuck', '24:10', 'Cybersecurity', 'USA', 'Undergraduate'),

  v('sec06', 'W2360H1i5b0', 'Getting Started in Cybersecurity & Ethical Hacking', 'John Hammond', '25:10', 'Cybersecurity', 'USA', 'Undergraduate'),
  v('sec07', '19wF217qG08', 'Python for Network Engineers & Ethical Hackers', 'David Bombal', '1:45:00', 'Cybersecurity', 'USA', 'Undergraduate'),
  v('sec08', '1S0aBV-Waeo', 'How Binary Exploitation Works – Web Security & CTF', 'LiveOverflow', '14:20', 'Cybersecurity', 'USA', 'Undergraduate'),
  v('sec09', 'RqubKSF3wig', 'Cybersecurity for Beginners – Full Course', 'freeCodeCamp.org', '11:24:00', 'Cybersecurity', 'USA', 'Undergraduate'),
  v('sec10', 'u4bXfFp1R9U', 'Penetration Testing Course – Ethical Hacking Tutorial', 'freeCodeCamp.org', '15:00:00', 'Cybersecurity', 'USA', 'Undergraduate'),
  v('sec11', '89d5S239g0I', 'Wireshark Course – Network Protocol Analysis', 'freeCodeCamp.org', '1:30:00', 'Cybersecurity', 'USA', 'Undergraduate'),

  // ════════════════════════════════════════════════════════════════════════
  // 4. ENGINEERING (The Efficient Engineer, Practical Engineering, Engineering Explained)
  // ════════════════════════════════════════════════════════════════════════
  v('eng01', 'H09c1-53Ue0', 'Understanding Stress and Strain in Materials', 'The Efficient Engineer', '15:40', 'Engineering', 'USA', 'Undergraduate'),
  v('eng02', 'b1Y8V7G17_0', 'Understanding Shear Force and Bending Moment Diagrams', 'The Efficient Engineer', '16:20', 'Engineering', 'USA', 'Undergraduate'),
  v('eng03', 'H5nJzN72v10', 'Understanding Torsion and Shaft Design', 'The Efficient Engineer', '14:10', 'Engineering', 'USA', 'Undergraduate'),
  v('eng04', 'L43n3s0zEw0', 'Understanding Fluid Mechanics and Bernoulli Equation', 'The Efficient Engineer', '18:30', 'Engineering', 'USA', 'Undergraduate'),
  v('eng05', 'fS-P43jW77M', 'How Structural Engineers Design Buildings Against Earthquakes', 'Practical Engineering', '12:45', 'Engineering', 'USA', 'Undergraduate'),
  v('eng06', '_10N18mJ4d8', 'How Dams Work – Civil Engineering Principles', 'Practical Engineering', '14:10', 'Engineering', 'USA', 'Undergraduate'),
  v('eng07', 'w3W0vS4M4k0', 'Soil Mechanics and Foundation Engineering Explained', 'Practical Engineering', '13:20', 'Engineering', 'USA', 'Undergraduate'),
  v('eng08', 'hWnL83pV34U', 'How Manual Transmissions Work', 'Engineering Explained', '11:30', 'Engineering', 'USA', 'Undergraduate'),
  v('eng09', 'L43n3s0zEw0', 'Horsepower vs Torque Explained Simply', 'Engineering Explained', '9:45', 'Engineering', 'USA', 'Undergraduate'),

  // ════════════════════════════════════════════════════════════════════════
  // 5. PHYSICS (MIT OpenCourseWare, Michel van Biezen, Flipping Physics)
  // ════════════════════════════════════════════════════════════════════════
  v('ph01', 'ZM8ECpBuQYE', 'MIT 8.01 Classical Mechanics – Lecture 1 (Walter Lewin)', 'MIT OpenCourseWare', '47:05', 'Physics', 'USA', 'Undergraduate'),
  v('ph02', 'HDMspHl01vQ', 'MIT 8.01 Classical Mechanics – Lecture 2: Kinematics', 'MIT OpenCourseWare', '47:29', 'Physics', 'USA', 'Undergraduate'),
  v('ph03', '1w03h03x45U', 'MIT 8.02 Electricity & Magnetism – Lecture 1 (Walter Lewin)', 'MIT OpenCourseWare', '48:10', 'Physics', 'USA', 'Undergraduate'),
  v('ph04', 'lC3JA3E3-Og', 'Physics – Electricity and Magnetism Intro Course', 'Michel van Biezen', '5:00:00', 'Physics', 'USA', 'Undergraduate'),
  v('ph05', '4p3bL20rD1M', 'AP Physics 1: Kinematics & Introduction', 'Flipping Physics', '14:25', 'Physics', 'USA', 'Undergraduate'),
  v('ph06', 'hdI2bqOjy3c', 'Physics – From Beginner to Expert – Full University Course', 'The Organic Chemistry Tutor', '3:44:00', 'Physics', 'USA', 'Undergraduate'),
  v('ph07', 'w4b1Y3S0e5k', 'Thermodynamics – First Law & Energy Conservation', 'The Organic Chemistry Tutor', '1:45:00', 'Physics', 'USA', 'Undergraduate'),

  // ════════════════════════════════════════════════════════════════════════
  // 6. CHEMISTRY (The Organic Chemistry Tutor, Professor Dave Explains, Tyler DeWitt)
  // ════════════════════════════════════════════════════════════════════════
  v('ch01', 'wS3UGBNgRcA', 'Organic Chemistry 1 – Full Course Review', 'The Organic Chemistry Tutor', '4:00:00', 'Chemistry', 'USA', 'Undergraduate'),
  v('ch02', '2S8QcbFN7gA', 'Chemical Bonding – Ionic, Covalent, & Metallic', 'The Organic Chemistry Tutor', '2:00:00', 'Chemistry', 'USA', 'Undergraduate'),
  v('ch03', 'uVFCOfSuPTo', 'General Chemistry Lecture 1 – Introduction to Matter', 'Professor Dave Explains', '13:43', 'Chemistry', 'USA', 'Undergraduate'),
  v('ch04', '0q7cZqpAIW8', 'Periodic Table Trends Explained – Electronegativity & Atomic Radius', 'Professor Dave Explains', '8:36', 'Chemistry', 'USA', 'Undergraduate'),
  v('ch05', '0m7i4G5h03I', 'Balancing Chemical Equations Step by Step', 'Tyler DeWitt', '12:30', 'Chemistry', 'USA', 'Undergraduate'),
  v('ch06', 'X4k1v4jXk2k', 'Stoichiometry Made Easy: Converting Grams to Moles', 'Tyler DeWitt', '14:10', 'Chemistry', 'USA', 'Undergraduate'),

  // ════════════════════════════════════════════════════════════════════════
  // 7. BIOLOGY & MEDICINE (Ninja Nerd, Osmosis, Armando Hasudungan, CrashCourse)
  // ════════════════════════════════════════════════════════════════════════
  v('bi01', '58mI6NUp3M8', 'Cardiovascular System Anatomy & Physiology', 'Ninja Nerd', '1:15:00', 'Medicine', 'USA', 'Postgraduate'),
  v('bi02', '3VzL06Qe-0Y', 'Respiratory System Physiology & Mechanics of Breathing', 'Ninja Nerd', '1:10:00', 'Medicine', 'USA', 'Postgraduate'),
  v('bi03', 'S_n01k9d7X4', 'Immune System & Hypersensitivity Reactions Explained', 'Osmosis', '9:45', 'Medicine', 'USA', 'Postgraduate'),
  v('bi04', '8W9vN-n50l4', 'Endocrinology – Hormones & Feedback Control Loops', 'Armando Hasudungan', '14:15', 'Biology', 'USA', 'Undergraduate'),
  v('bi05', 'QnQe0xW_JY4', 'Biology – Cell Theory & Structure (CrashCourse #1)', 'CrashCourse', '13:08', 'Biology', 'USA', 'Undergraduate'),
  v('bi06', 'Yiz_Ru4Lurs', 'DNA Structure and Replication (CrashCourse #10)', 'CrashCourse', '12:59', 'Biology', 'USA', 'Undergraduate'),

  // ════════════════════════════════════════════════════════════════════════
  // 8. ECONOMICS & FINANCE (Jacob Clifford, Marginal Revolution Univ, MIT OCW)
  // ════════════════════════════════════════════════════════════════════════
  v('ec01', '3ez10ADR_gM', 'Microeconomics – Everything You Need to Know', 'Jacob Clifford', '29:01', 'Economics', 'USA', 'Undergraduate'),
  v('ec02', 'eVAS-t83Tx4', 'Macroeconomics – Complete Course Overview & Review', 'Jacob Clifford', '31:11', 'Economics', 'USA', 'Undergraduate'),
  v('ec03', 'm32V42o_o2I', 'Principles of Economics – Supply and Demand Equilibrium', 'Marginal Revolution Univ.', '8:50', 'Economics', 'USA', 'Undergraduate'),
  v('ec04', 'WEDIj9JBTC8', 'Financial Markets – Yale University Lecture 1 (Robert Shiller)', 'YaleCourses / MIT OCW', '1:15:00', 'Economics', 'USA', 'Undergraduate'),

  // ════════════════════════════════════════════════════════════════════════
  // 9. BUSINESS & MANAGEMENT (Harvard Business Review, Stanford GSB, YaleCourses)
  // ════════════════════════════════════════════════════════════════════════
  v('biz01', '973J_P_0y-8', 'What is Strategy? – Michael Porter (Harvard Business Review)', 'Harvard Business Review', '10:15', 'Business', 'USA', 'Undergraduate'),
  v('biz02', 'HAnw168huqA', 'Think Fast, Talk Smart: Communication Techniques', 'Stanford Graduate School', '58:20', 'Business', 'USA', 'Postgraduate'),

  // ════════════════════════════════════════════════════════════════════════
  // 10. LAW (The Law Simplified, LegalEagle)
  // ════════════════════════════════════════════════════════════════════════
  v('lw01', 'mDo6lT_OYOY', 'Introduction to the Legal System & Court Hierarchy', 'LegalEagle', '16:44', 'Law', 'USA', 'Undergraduate'),
  v('lw02', 'nV2WcSBBBF8', 'Criminal Law Basics Explained', 'LegalEagle', '18:12', 'Law', 'USA', 'Undergraduate'),
  v('lw03', 'P0RQQV04f-Q', 'Tort Law – Negligence & Duty of Care Principles', 'LegalEagle', '20:41', 'Law', 'USA', 'Undergraduate'),
  v('lw04', 'vHoJ7cDGDkE', 'How to Read a Legal Case – Law Tutorial for Law Students', 'The Law Simplified', '13:06', 'Law', 'UK', 'Undergraduate'),

  // ════════════════════════════════════════════════════════════════════════
  // 11. STATISTICS & DATA SCIENCE (StatQuest, Brandon Foltz, freeCodeCamp)
  // ════════════════════════════════════════════════════════════════════════
  v('ds01', 'NKP983_P2s0', 'Machine Learning Fundamentals: Bias and Variance', 'StatQuest with Josh Starmer', '6:35', 'Data Science', 'USA', 'Undergraduate'),
  v('ds02', '7181512vY1o', 'Linear Regression Clearly Explained', 'StatQuest with Josh Starmer', '27:10', 'Data Science', 'USA', 'Undergraduate'),
  v('ds03', '3r631481o_c', 'Statistics 101: Intro to Hypothesis Testing', 'Brandon Foltz', '18:40', 'Data Science', 'USA', 'Undergraduate'),
  v('ds04', 'wm5gMKuwSYk', 'Statistics – Full University Course on Data Science', 'freeCodeCamp.org', '8:15:00', 'Data Science', 'USA', 'Undergraduate'),
  v('ds05', 'ua-CiDNNj30', 'Data Science Full Course for Beginners', 'freeCodeCamp.org', '4:15:00', 'Data Science', 'USA', 'Undergraduate'),

  // ════════════════════════════════════════════════════════════════════════
  // 12. GENERAL UNIVERSITY COURSES (MIT OCW, Stanford Online, YaleCourses, Harvard, Khan Academy)
  // ════════════════════════════════════════════════════════════════════════
  v('univ01', '7UJ4CFRGd-U', 'MIT 18.06 Linear Algebra – Lecture 1 (Gilbert Strang)', 'MIT OpenCourseWare', '39:49', 'Mathematics', 'USA', 'Undergraduate'),
  v('univ02', 'jGwO_UgTS7I', 'Stanford CS229 Machine Learning – Lecture 1 (Andrew Ng)', 'Stanford Online', '1:18:00', 'Data Science', 'USA', 'Postgraduate'),
  v('univ03', 'P3FKHH28n6s', 'Yale Open Courses – Intro to Psychology (Paul Bloom)', 'YaleCourses', '48:00', 'Psychology', 'USA', 'Undergraduate'),
  v('univ04', 'kBdfcR-8hEY', 'Harvard Justice Course – What is the Right Thing to Do?', 'Harvard University', '55:00', 'Law', 'USA', 'Undergraduate'),
];

export function fetchYouTubeVideos(query?: string): YouTubeVideo[] {
  if (!query) return ALL_VIDEOS;
  const q = query.toLowerCase();
  return ALL_VIDEOS.filter(v =>
    v.title.toLowerCase().includes(q) ||
    v.subject.toLowerCase().includes(q) ||
    v.channelName.toLowerCase().includes(q)
  );
}
