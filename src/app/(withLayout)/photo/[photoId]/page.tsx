import { PublicPhotoPage } from '@/components/module/public/PublicPhotoPage';
import { getPhoto, getPhotosForContest, getPhotosForProfile, getProfile } from '@/lib/mock/public-gallery-data';

type PageProps = {
  params: Promise<{ photoId: string }>;
  searchParams: Promise<{ source?: string; profile?: string; contest?: string }>;
};

export default async function PhotoPage({ params, searchParams }: PageProps) {
  const { photoId } = await params;
  const query = await searchParams;
  const photo = getPhoto(photoId);
  const owner = getProfile(photo.ownerUsername);
  const slidePhotos =
    query.source === 'contest'
      ? getPhotosForContest(query.contest ?? photo.contestId)
      : getPhotosForProfile(query.profile ?? photo.ownerUsername);

  return <PublicPhotoPage activePhoto={photo} owner={owner} slidePhotos={slidePhotos.length ? slidePhotos : [photo]} />;
}
