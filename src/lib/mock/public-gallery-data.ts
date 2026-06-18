export type PublicPhoto = {
  id: string;
  title: string;
  src: string;
  alt: string;
  contestId: string;
  contestName: string;
  ownerUsername: string;
  votes: number;
  views: number;
  likes: number;
  achievements: number;
  camera: string;
  aperture: string;
  shutter: string;
  iso: string;
  labels: string[];
  comments: {
    id: string;
    author: string;
    text: string;
    time: string;
  }[];
};

export type PublicProfile = {
  username: string;
  name: string;
  country: string;
  avatar: string;
  cover: string;
  rank: string;
  level: number;
  points: number;
  achievements: number;
  followers: number;
  following: number;
  bio: string;
};

export const publicProfiles: PublicProfile[] = [
  {
    username: 'shane-stucky',
    name: 'Shane Stucky',
    country: 'United States',
    avatar:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=240&q=80',
    cover:
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1800&q=85',
    rank: 'Master',
    level: 8,
    points: 1123020,
    achievements: 1456,
    followers: 43,
    following: 4,
    bio: 'Landscape, pets, and quiet human moments captured with soft natural light.',
  },
  {
    username: 'sahinsiraj360',
    name: 'Sahin Siraj',
    country: 'Bangladesh',
    avatar:
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=240&q=80',
    cover:
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1800&q=85',
    rank: 'Elite',
    level: 6,
    points: 684220,
    achievements: 712,
    followers: 128,
    following: 37,
    bio: 'Travel stories, street colors, and competition-ready photo sets.',
  },
];

export const publicPhotos: PublicPhoto[] = [
  {
    id: 'sunflower-flight',
    title: 'Sunflower Flight',
    src: 'https://images.unsplash.com/photo-1470509037663-253afd7f0f51?auto=format&fit=crop&w=1600&q=90',
    alt: 'Butterfly on yellow sunflowers against blue sky',
    contestId: 'nature-week',
    contestName: 'Nature Week',
    ownerUsername: 'shane-stucky',
    votes: 72341,
    views: 28450,
    likes: 228,
    achievements: 7,
    camera: 'Canon EOS R6',
    aperture: 'f/4.0',
    shutter: '1/800',
    iso: 'ISO 200',
    labels: ['Nature', 'Flower', 'Sunflower', 'Butterfly', 'Summer', 'Macro'],
    comments: [],
  },
  {
    id: 'little-king',
    title: 'Little King',
    src: 'https://images.unsplash.com/photo-1517423440428-a5a00ad493e8?auto=format&fit=crop&w=1600&q=90',
    alt: 'Close portrait of a black and tan spaniel puppy',
    contestId: 'pet-portraits',
    contestName: 'Pet Portraits',
    ownerUsername: 'shane-stucky',
    votes: 90594,
    views: 38150,
    likes: 191,
    achievements: 8,
    camera: 'Sony A7 IV',
    aperture: 'f/2.2',
    shutter: '1/320',
    iso: 'ISO 640',
    labels: ['Mammal', 'Pet', 'Animal', 'Dog', 'Canine', 'Puppy', 'Spaniel'],
    comments: [],
  },
  {
    id: 'bright-smile',
    title: 'Bright Smile',
    src: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1600&q=90',
    alt: 'Black and white portrait of a smiling child',
    contestId: 'portrait-open',
    contestName: 'Portrait Open',
    ownerUsername: 'shane-stucky',
    votes: 85713,
    views: 41767,
    likes: 139,
    achievements: 9,
    camera: 'Nikon Z6 II',
    aperture: 'f/1.8',
    shutter: '1/500',
    iso: 'ISO 320',
    labels: ['Portrait', 'Person', 'Human', 'Smile', 'Monochrome', 'Child'],
    comments: [
      { id: 'c1', author: 'Rich Packer', text: 'Love that smile!', time: '6 years ago' },
      { id: 'c2', author: 'Shane Stucky', text: 'Thanks Rich!', time: '6 years ago' },
    ],
  },
  {
    id: 'soft-llama',
    title: 'Soft Llama',
    src: 'https://images.unsplash.com/photo-1511044568932-338cba0ad803?auto=format&fit=crop&w=1600&q=90',
    alt: 'Soft focused llama portrait',
    contestId: 'animal-world',
    contestName: 'Animal World',
    ownerUsername: 'shane-stucky',
    votes: 54872,
    views: 17302,
    likes: 96,
    achievements: 4,
    camera: 'Fujifilm X-T5',
    aperture: 'f/3.2',
    shutter: '1/640',
    iso: 'ISO 400',
    labels: ['Animal', 'Llama', 'Farm', 'Portrait', 'Brown'],
    comments: [],
  },
  {
    id: 'market-rain',
    title: 'Market Rain',
    src: 'https://images.unsplash.com/photo-1515890435782-59a5bb6ec191?auto=format&fit=crop&w=1600&q=90',
    alt: 'Street market under rain with colorful umbrellas',
    contestId: 'street-colors',
    contestName: 'Street Colors',
    ownerUsername: 'sahinsiraj360',
    votes: 68244,
    views: 20941,
    likes: 305,
    achievements: 6,
    camera: 'Leica Q3',
    aperture: 'f/5.6',
    shutter: '1/250',
    iso: 'ISO 800',
    labels: ['Street', 'Rain', 'Market', 'Color', 'Travel'],
    comments: [
      { id: 'c3', author: 'Nadia Rahman', text: 'Beautiful color timing.', time: '2 days ago' },
    ],
  },
  {
    id: 'coastal-glow',
    title: 'Coastal Glow',
    src: 'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1600&q=90',
    alt: 'Ocean waves at sunset',
    contestId: 'travel-light',
    contestName: 'Travel Light',
    ownerUsername: 'sahinsiraj360',
    votes: 73410,
    views: 31802,
    likes: 264,
    achievements: 5,
    camera: 'Canon EOS R5',
    aperture: 'f/8',
    shutter: '1/160',
    iso: 'ISO 100',
    labels: ['Ocean', 'Travel', 'Sunset', 'Wave', 'Landscape'],
    comments: [],
  },
];

export function getProfile(username: string) {
  return publicProfiles.find((profile) => profile.username === username) ?? publicProfiles[0];
}

export function getPhoto(photoId: string) {
  return publicPhotos.find((photo) => photo.id === photoId) ?? publicPhotos[0];
}

export function getPhotosForProfile(username: string) {
  return publicPhotos.filter((photo) => photo.ownerUsername === username);
}

export function getPhotosForContest(contestId: string) {
  return publicPhotos.filter((photo) => photo.contestId === contestId);
}
