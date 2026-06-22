import { NextRequest, NextResponse } from 'next/server';
import {
  getPhoto,
  getPhotosForContest,
  getPhotosForProfile,
  getProfile,
} from '@/lib/mock/public-gallery-data';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ photoId: string }> }
) {
  const { photoId } = await params;
  
  // Simulate network latency of 1 second (so skeleton is visible)
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Extract query parameters
  const searchParams = request.nextUrl.searchParams;
  const triggerError = searchParams.get('error') === 'true';
  const source = searchParams.get('source');
  const profile = searchParams.get('profile');
  const contest = searchParams.get('contest');

  if (triggerError) {
    return NextResponse.json(
      { message: 'Simulated API failure for error state testing.' },
      { status: 500 }
    );
  }

  try {
    const photo = getPhoto(photoId);
    
    if (!photo || photo.id !== photoId) {
      return NextResponse.json(
        { message: `Photo with ID "${photoId}" not found.` },
        { status: 404 }
      );
    }

    const owner = getProfile(photo.ownerUsername);

    // Fetch surrounding photos for slide cycle
    let slidePhotos = [];
    if (source === 'contest') {
      slidePhotos = getPhotosForContest(contest ?? photo.contestId);
    } else {
      slidePhotos = getPhotosForProfile(profile ?? photo.ownerUsername);
    }

    if (slidePhotos.length === 0) {
      slidePhotos = [photo];
    }

    return NextResponse.json({
      photo,
      owner,
      slidePhotos,
    });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || 'An error occurred while fetching photo data.' },
      { status: 500 }
    );
  }
}
