import { Job, MarketplaceItem, StudyGroup } from './mock-data';
import { LearningResource } from './learning-data';

export interface YouTubeVideo {
  id: string;
  title: string;
  thumbnail: string;
  channelName: string;
  duration: string;
  subject: string;
  country: string;
}

export interface JobFilters {
  field?: string;
  country?: string;
  type?: string;
}

export async function fetchLiveJobs(filters?: JobFilters): Promise<Job[]> {
  return [];
}

export async function fetchLiveInternships(filters?: JobFilters): Promise<Job[]> {
  return [];
}

export async function fetchLearningResources(subject: string, level?: string): Promise<LearningResource[]> {
  return [];
}

export async function refreshMarketplace(): Promise<MarketplaceItem[]> {
  return [];
}

export async function fetchYouTubeVideos(query: string, subject?: string): Promise<YouTubeVideo[]> {
  return [];
}

export const API_CONFIG = {
  youtubeApiKey: import.meta.env.VITE_YOUTUBE_API_KEY || null,
  jobsApiUrl: import.meta.env.VITE_JOBS_API_URL || null,
  refreshInterval: 1000 * 60 * 30, // 30 minutes
};
