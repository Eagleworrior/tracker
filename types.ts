
export interface NewsSource {
  title: string;
  uri: string;
}

export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  detailedContent: string;
  timestamp: string;
  sources: NewsSource[];
  sentiment: 'positive' | 'negative' | 'neutral' | 'breaking';
  category: string;
  platform: string;
  mediaUrl?: string;
  mediaType?: 'image' | 'video' | 'none';
  accountHandle?: string;
  avatarUrl?: string;
}

export interface PersonDossier {
  fullName: string;
  occupation: string;
  currentResidence: string;
  familyLinks: string[];
  publicIdentifiers: string[];
  recentActivity: string;
  digitalFootprintScore: number;
  location?: {
    lat: number;
    lng: number;
    address: string;
  };
  image?: string;
}

export interface GeneratedAsset {
  id: string;
  type: 'image' | 'video';
  url: string;
  prompt: string;
  timestamp: string;
}

export type ViewMode = 'news' | 'intel' | 'reels' | 'creative';
