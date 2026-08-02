import { Job } from './auth';

export function fetchInternships(filters?: Record<string, string>): Job[] {
  // Mock data ready to be replaced by a real API call (e.g. LinkedIn, Indeed API)
  const sampleJobs: Job[] = [
    {
      id: 'j1',
      title: 'Software Engineering Intern',
      company: 'Google',
      country: 'UK',
      location: 'London',
      type: 'Hybrid',
      pay: 'Paid',
      field: 'Computer Science',
      experienceLevel: 'Entry',
      description: 'Join our Cloud team for a 12-week summer internship. You will work on distributed systems and impact millions of users.',
      postedDate: new Date(Date.now() - 86400000 * 2).toISOString()
    },
    {
      id: 'j2',
      title: 'Marketing & PR Assistant',
      company: 'L\'Oréal',
      country: 'France',
      location: 'Paris',
      type: 'On-site',
      pay: 'Paid',
      field: 'Business',
      experienceLevel: 'Entry',
      description: 'Assist in launching our new summer campaign. Work with influencers and PR agencies.',
      postedDate: new Date(Date.now() - 86400000 * 5).toISOString()
    },
    {
      id: 'j3',
      title: 'Data Science Intern',
      company: 'Spotify',
      country: 'USA',
      location: 'New York',
      type: 'Remote',
      pay: 'Paid',
      field: 'Computer Science',
      experienceLevel: 'Entry',
      description: 'Analyze user listening habits to improve our recommendation algorithms.',
      postedDate: new Date(Date.now() - 86400000 * 10).toISOString()
    },
    {
      id: 'j4',
      title: 'Legal Researcher',
      company: 'Clifford Chance',
      country: 'UK',
      location: 'London',
      type: 'Hybrid',
      pay: 'Paid',
      field: 'Law',
      experienceLevel: 'Entry',
      description: 'Support senior partners with corporate law case research.',
      postedDate: new Date(Date.now() - 86400000 * 1).toISOString()
    }
  ];

  if (filters) {
    return sampleJobs.filter(job => {
      let matches = true;
      if (filters.field && filters.field !== 'All') {
        matches = matches && job.field === filters.field;
      }
      if (filters.country && filters.country !== 'All') {
        matches = matches && job.country === filters.country;
      }
      return matches;
    });
  }

  return sampleJobs;
}
