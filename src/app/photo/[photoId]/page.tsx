import { PublicPhotoPage } from '@/components/module/public/PublicPhotoPage';
import type { Metadata } from 'next';

type PageProps = {
  params: Promise<{ photoId: string }>;
  searchParams: Promise<{ source?: string; profile?: string; contest?: string; ownerId?: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { photoId } = await params;
  return {
    title: `Photo | Your Capture Awards`,
    description: `View photo details on Your Capture Awards`,
  };
}

export default async function PhotoPage({ params }: PageProps) {
  const { photoId } = await params;

  return <PublicPhotoPage photoId={photoId} />;
}
