import { PublicPhoto, PublicProfileMini, publicPhotos } from './public-gallery-data';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

type TabRecord<T> = {
  data: T;
  delayMs: number;
  fail?: boolean;
};

const publicProfileTabData: Record<
  string,
  {
    photos: TabRecord<PublicPhoto[]>;
    liked: TabRecord<PublicPhoto[]>;
    followers: TabRecord<PublicProfileMini[]>;
    following: TabRecord<PublicProfileMini[]>;
    achievements: TabRecord<{ count: number; items: string[] }>;
  }
> = {
  'shane-stucky': {
    photos: { data: publicPhotos.filter((photo) => photo.ownerUsername === 'shane-stucky'), delayMs: 900 },
    liked: { data: publicPhotos.filter((photo) => ['coastal-glow', 'bright-smile'].includes(photo.id)), delayMs: 1200 },
    followers: {
      data: [
        {
          username: 'sahinsiraj360',
          name: 'Sahin Siraj',
          country: 'Bangladesh',
          avatar:
            'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=240&q=80',
          isFollowing: false,
        },
      ],
      delayMs: 1000,
    },
    following: {
      data: [
        {
          username: 'wildframe',
          name: 'Wild Frame',
          country: 'Norway',
          avatar:
            'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=240&q=80',
          isFollowing: true,
        },
      ],
      delayMs: 1100,
    },
    achievements: {
      data: { count: 1456, items: ['Gold cup', 'Top 1%'] },
      delayMs: 1300,
    },
  },
  'sahinsiraj360': {
    photos: { data: publicPhotos.filter((photo) => photo.ownerUsername === 'sahinsiraj360'), delayMs: 900 },
    liked: { data: publicPhotos.filter((photo) => ['sunflower-flight', 'coastal-glow', 'little-king'].includes(photo.id)), delayMs: 1200 },
    followers: {
      data: [
        {
          username: 'shane-stucky',
          name: 'Shane Stucky',
          country: 'United States',
          avatar:
            'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=240&q=80',
          isFollowing: true,
        },
      ],
      delayMs: 1000,
    },
    following: {
      data: [
        {
          username: 'urban-frame',
          name: 'Urban Frame',
          country: 'France',
          avatar:
            'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=240&q=80',
          isFollowing: true,
        },
      ],
      delayMs: 1100,
    },
    achievements: {
      data: { count: 712, items: ['Silver cup', 'Editor pick'] },
      delayMs: 1300,
    },
  },
};

async function fetchTabData<T>(record: TabRecord<T>, signal?: AbortSignal) {
  await delay(record.delayMs);
  if (signal?.aborted) throw new DOMException('Aborted', 'AbortError');
  if (record.fail) throw new Error('Failed to load tab data.');
  return record.data;
}

function getTabRecord(username: string) {
  return publicProfileTabData[username] ?? publicProfileTabData['shane-stucky'];
}

export async function fetchPublicPhotos(username: string, signal?: AbortSignal) {
  return fetchTabData(getTabRecord(username).photos, signal);
}

export async function fetchLikedPhotos(username: string, signal?: AbortSignal) {
  return fetchTabData(getTabRecord(username).liked, signal);
}

export async function fetchFollowers(username: string, signal?: AbortSignal) {
  return fetchTabData(getTabRecord(username).followers, signal);
}

export async function fetchFollowing(username: string, signal?: AbortSignal) {
  return fetchTabData(getTabRecord(username).following, signal);
}

export async function fetchAchievements(username: string, signal?: AbortSignal) {
  return fetchTabData(getTabRecord(username).achievements, signal);
}
