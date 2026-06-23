import { PublicProfilePage } from '@/components/module/public/PublicProfilePage';

type PageProps = {
  params: Promise<{ username: string }>;
};

export default async function ProfilePage({ params }: PageProps) {
  const { username } = await params;

  return <PublicProfilePage isOwn={false} userId={username} />;
}
