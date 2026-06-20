import { PublicProfilePage } from '@/components/module/public/PublicProfilePage';
import { getProfile } from '@/lib/mock/public-gallery-data';

type PageProps = {
  params: Promise<{ username: string }>;
};

export default async function ProfilePage({ params }: PageProps) {
  const { username } = await params;
  const profile = getProfile(username);

  return <PublicProfilePage profile={profile} />;
}
