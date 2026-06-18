import { PublicProfilePage } from '@/components/module/public/PublicProfilePage';
import { getPhotosForProfile, getProfile } from '@/lib/mock/public-gallery-data';

type PageProps = {
  params: Promise<{ username: string }>;
};

export default async function ProfilePage({ params }: PageProps) {
  const { username } = await params;
  const profile = getProfile(username);
  const photos = getPhotosForProfile(profile.username);

  return <PublicProfilePage profile={profile} photos={photos} />;
}
