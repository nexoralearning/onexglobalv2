/**
 * youtube.ts — curated real YouTube educational videos.
 * Thumbnails: https://img.youtube.com/vi/{id}/hqdefault.jpg
 * Watch URL:  https://www.youtube.com/watch?v={id}
 */

export interface YouTubeVideo {
  id: string;
  youtubeId: string;
  title: string;
  channelName: string;
  thumbnail: string;
  watchUrl: string;
  duration: string;
  subject: string;
  country: string;
  degreeLevel: string;
}

function video(
  id: string,
  youtubeId: string,
  title: string,
  channelName: string,
  duration: string,
  subject: string,
  country: string,
  degreeLevel: string,
): YouTubeVideo {
  return {
    id,
    youtubeId,
    title,
    channelName,
    thumbnail: `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`,
    watchUrl: `https://www.youtube.com/watch?v=${youtubeId}`,
    duration,
    subject,
    country,
    degreeLevel,
  };
}

const ALL_VIDEOS: YouTubeVideo[] = [
  // ── Computer Science ─────────────────────────────────────────────────────────
  video('v1',  '8mAITcNt710', 'Harvard CS50 – Introduction to Computer Science (2023)', 'CS50',                  '2:01:00', 'Computer Science', 'USA', 'Undergraduate'),
  video('v2',  '0euvEdPwQnQ', 'CS50 – Week 5: Data Structures',                          'CS50',                  '1:30:15', 'Computer Science', 'USA', 'Undergraduate'),
  video('v3',  'rfscVS0vtbw', 'Python Tutorial for Beginners – Full Course',             'Corey Schafer',         '4:26:51', 'Computer Science', 'USA', 'Undergraduate'),
  video('v4',  'XKHEtdqhLK8', 'JavaScript Full Course for Beginners',                    'Traversy Media',        '3:30:00', 'Computer Science', 'USA', 'Undergraduate'),
  video('v5',  'HXV3zeQKqGY', 'SQL Tutorial – Full Database Course for Beginners',       'freeCodeCamp',          '4:20:00', 'Computer Science', 'USA', 'Undergraduate'),
  video('v6',  '7S_tz1z_5bA', 'MySQL Tutorial for Beginners [Full Course]',              'Programming with Mosh', '3:10:00', 'Computer Science', 'USA', 'Undergraduate'),
  video('v7',  'NqqdVN2tyvQ', 'React JS Full Course for Beginners',                      'Dave Gray',             '8:00:00', 'Computer Science', 'USA', 'Undergraduate'),
  video('v8',  'bMknfKXIFA8', 'Machine Learning with Python – Full Course',              'freeCodeCamp',          '6:15:00', 'Computer Science', 'USA', 'Undergraduate'),
  video('v9',  'SqcY0GlETPk', 'Linux Command Line – Full Course',                        'freeCodeCamp',          '5:06:00', 'Computer Science', 'USA', 'Undergraduate'),
  video('v10', '8JJ101D3knE', 'Git and GitHub for Beginners – Crash Course',             'freeCodeCamp',          '1:08:00', 'Computer Science', 'USA', 'Undergraduate'),

  // ── Mathematics ──────────────────────────────────────────────────────────────
  video('v11', 'WUvTyaaNkzM', 'Essence of Calculus – Chapter 1',                         '3Blue1Brown',           '17:04',   'Mathematics', 'USA', 'Undergraduate'),
  video('v12', 'fNk_zzaMoSs', 'Essence of Linear Algebra – Chapter 1',                   '3Blue1Brown',           '9:52',    'Mathematics', 'USA', 'Undergraduate'),
  video('v13', 'spUNpyF58BY', 'But what is the Fourier Transform? A visual intro.',      '3Blue1Brown',           '20:57',   'Mathematics', 'USA', 'Undergraduate'),
  video('v14', 'Ilg3gGewQ5U', 'Backpropagation Calculus | Deep Learning Ch. 4',          '3Blue1Brown',           '10:17',   'Mathematics', 'USA', 'Postgraduate'),
  video('v15', 'aircAruvnKk', 'But what is a neural network? | Deep Learning Ch. 1',     '3Blue1Brown',           '19:13',   'Mathematics', 'USA', 'Undergraduate'),
  video('v16', 'wm5gMKuwSYk', 'Statistics – A Full University Course on Data Science',   'freeCodeCamp',          '8:15:00', 'Mathematics', 'USA', 'Undergraduate'),
  video('v17', 'RBSGKlAvoiM', 'Statistics and Probability – Full Course',                'The Organic Chemistry Tutor', '4:40:00', 'Mathematics', 'USA', 'Undergraduate'),

  // ── Physics ───────────────────────────────────────────────────────────────────
  video('v18', 'ZM8ECpBuQYE', 'MIT 8.01 Classical Mechanics – Lecture 1 (Walter Lewin)', 'MIT OpenCourseWare',    '47:05',   'Physics', 'USA', 'Undergraduate'),
  video('v19', 'hdI2bqOjy3c', 'Physics – From Beginner to Expert',                       'The Organic Chemistry Tutor', '3:44:00', 'Physics', 'USA', 'Undergraduate'),

  // ── Chemistry ─────────────────────────────────────────────────────────────────
  video('v20', 'wS3UGBNgRcA', 'Organic Chemistry – Full Course',                         'The Organic Chemistry Tutor', '4:00:00', 'Chemistry', 'USA', 'Undergraduate'),
  video('v21', 'uVFCOfSuPTo', 'General Chemistry – Introduction',                        'Professor Dave Explains', '13:43', 'Chemistry', 'USA', 'Undergraduate'),

  // ── Biology ───────────────────────────────────────────────────────────────────
  video('v22', 'QnQe0xW_JY4', 'Biology – Cell Theory & Cell Structure',                  'CrashCourse',           '13:08',   'Biology', 'USA', 'Undergraduate'),
  video('v23', 'sTAJEak8lIE', 'Human Anatomy & Physiology – Full Course',                'Nucleus Medical Media', '1:12:00', 'Biology', 'USA', 'Undergraduate'),

  // ── Economics & Business ──────────────────────────────────────────────────────
  video('v24', '3ez10ADR_gM', 'Microeconomics – Everything You Need to Know',             'Jacob Clifford',        '29:01',   'Economics', 'USA', 'Undergraduate'),
  video('v25', 'eVAS-t83Tx4', 'Macroeconomics – Complete Course',                         'Jacob Clifford',        '31:11',   'Economics', 'USA', 'Undergraduate'),
  video('v26', 'EJHPltmAULA', 'Personal Finance & Investing – Full Course',               'freeCodeCamp',          '2:06:00', 'Business',  'USA', 'Undergraduate'),
  video('v27', 'vO09q2V8TGQ', 'Introduction to Financial Accounting',                    'Accounting Stuff',      '45:00',   'Business',  'UK',  'Undergraduate'),

  // ── Law ───────────────────────────────────────────────────────────────────────
  video('v28', 'kCCmuftyj8A', 'Introduction to Law – Key Legal Concepts Explained',      'CrashCourse',           '12:00',   'Law', 'USA', 'Undergraduate'),
  video('v29', '2Co6pNvd9mc', 'Contract Law – Fundamentals for Students',                'CrashCourse',           '14:00',   'Law', 'USA', 'Undergraduate'),

  // ── Psychology ────────────────────────────────────────────────────────────────
  video('v30', 'vo4pMVb0R6M', 'Introduction to Psychology – CrashCourse #1',             'CrashCourse',           '10:01',   'Psychology', 'USA', 'Undergraduate'),
  video('v31', 'v4geyWgKyyY', 'Research Methods in Psychology – Full Lecture',           'CrashCourse',           '11:00',   'Psychology', 'USA', 'Undergraduate'),

  // ── Engineering ──────────────────────────────────────────────────────────────
  video('v32', 'O3EyzlZxx3g', 'Thermodynamics – Full Course',                             'The Organic Chemistry Tutor', '3:25:00', 'Engineering', 'USA', 'Undergraduate'),
  video('v33', 'uXr4lXYjXuU', 'Circuit Analysis – DC Circuits Full Lecture Series',      'The Organic Chemistry Tutor', '2:45:00', 'Engineering', 'USA', 'Undergraduate'),

  // ── History ───────────────────────────────────────────────────────────────────
  video('v34', 'Yocja_N5s1I', 'World History – #1: The Agricultural Revolution',         'CrashCourse',           '11:10',   'History', 'USA', 'Undergraduate'),
  video('v35', 'gxqPbGqYACw', 'The History of Ancient Rome – Full Documentary',          'History Documentary',   '1:20:00', 'History', 'USA', 'Undergraduate'),
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

export { ALL_VIDEOS };
