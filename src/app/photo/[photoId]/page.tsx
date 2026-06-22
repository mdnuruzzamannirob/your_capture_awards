import { PublicPhotoPage } from '@/components/module/public/PublicPhotoPage';
import {
  getPhoto,
  getPhotosForContest,
  getPhotosForProfile,
  getProfile,
} from '@/lib/mock/public-gallery-data';
import type { Metadata } from 'next';

type PageProps = {
  params: Promise<{ photoId: string }>;
  searchParams: Promise<{ source?: string; profile?: string; contest?: string }>;
};

// Generate dynamic SEO Metadata for the photo page
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { photoId } = await params;
  const photo = getPhoto(photoId);
  return {
    title: photo ? `${photo.title} | Your Capture Awards` : 'Photo Details',
    description: photo ? photo.alt || `Photo captured by ${photo.ownerUsername}` : 'Photo Details Page',
  };
}

export default async function PhotoPage({ params, searchParams }: PageProps) {
  const { photoId } = await params;
  const query = await searchParams;
  const photo = getPhoto(photoId);
  const owner = getProfile(photo.ownerUsername);
  const slidePhotos =
    query.source === 'contest'
      ? getPhotosForContest(query.contest ?? photo.contestId)
      : getPhotosForProfile(query.profile ?? photo.ownerUsername);

  return (
    <PublicPhotoPage
      activePhoto={photo}
      owner={owner}
      slidePhotos={slidePhotos.length ? slidePhotos : [photo]}
    />
  );
}
