'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useLayoutEffect, useState } from 'react';
import { toast } from 'sonner';

import { PhotoError } from './photo/PhotoError';
import { PhotoSkeleton } from './photo/PhotoSkeleton';
import { PhotoViewer } from './photo/PhotoViewer';
import { Comment, SidebarComments } from './photo/SidebarComments';
import { SidebarHeader } from './photo/SidebarHeader';
import { SidebarMetrics } from './photo/SidebarMetrics';

import { cn } from '@/utils/cn';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { clearSwiperPhotos } from '@/store/slices/profileSlice';
import { useLazyGetMyPhotoDetailsQuery, useLazyGetPublicPhotoDetailsQuery } from '@/store/apis/profileApi';
import { useAuth } from '@/hooks/useAuth';

interface Props {
  photoId: string;
}

export function PublicPhotoPage({ photoId: initialPhotoId }: Props) {
  const searchParams = useSearchParams();
  const source = searchParams.get('source') || '';
  const profileParam = searchParams.get('profile') || ''; // username or userId passed from profile page
  const ownerIdParam = searchParams.get('ownerId') || ''; // userId of the photo owner
  const contestParam = searchParams.get('contest') || '';

  const dispatch = useAppDispatch();
  const { user: currentUser } = useAuth();

  // Swiper photos from Redux (set by PortfolioCard / PhotoCard on click for slide navigation)
  const swiperPhotos = useAppSelector((state) => state.profile.swiperPhotos);

  // App state
  const [currentPhotoId, setCurrentPhotoId] = useState(initialPhotoId);
  const [photo, setPhoto] = useState<any>(null);
  const [profileOwner, setProfileOwner] = useState<any>(null);
  const [slides, setSlides] = useState<any[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [liked, setLiked] = useState(false);
  const [ownerIsFollowed, setOwnerIsFollowed] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [transitionReady, setTransitionReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Determine if viewing own photo (by ownerId param or by photo.userId after load)
  const isOwnPhoto =
    !!currentUser?.id &&
    (ownerIdParam === currentUser.id || photo?.userId === currentUser.id);

  // Active index in slides
  const activeIndex = Math.max(0, slides.findIndex((p) => p.id === currentPhotoId));

  // Back URL derivation
  const backUrl = (() => {
    if (source === 'contest' && (contestParam || photo?.contestId)) {
      return `/contest/${contestParam || photo.contestId}`;
    }
    if (source === 'profile' && (profileParam || ownerIdParam)) {
      // if isOwn, back to own profile page
      if (isOwnPhoto) return '/profile';
      return `/profile/${profileParam || ownerIdParam}`;
    }
    return profileParam ? `/profile/${profileParam}` : '/';
  })();

  // RTK Lazy queries
  const [fetchMyPhotoDetails, { isLoading: isLoadingOwn }] = useLazyGetMyPhotoDetailsQuery();
  const [fetchPublicPhotoDetails, { isLoading: isLoadingPublic }] = useLazyGetPublicPhotoDetailsQuery();
  const isLoading = isLoadingOwn || isLoadingPublic;

  // Load photo data — chooses own vs public API based on ownership
  const loadPhotoData = async (photoId: string) => {
    setError(null);

    // Determine ownership from URL param (available immediately before photo loads)
    const viewingOwn = !!currentUser?.id && ownerIdParam === currentUser.id;

    try {
      if (viewingOwn) {
        // Own photo: GET /profiles/photos/:photoId
        const result = await fetchMyPhotoDetails(photoId).unwrap();
        const { photo: photoData, comments: photoComments } = result.data;
        setPhoto(photoData);
        // For own photos the owner is embedded in photo.user
        setProfileOwner(photoData.user ?? null);
        setLiked(photoData.isLiked ?? false);
        // Own photo — no follow button needed
        setOwnerIsFollowed(false);
        if (photoComments) setComments(photoComments);
      } else {
        // Public photo: GET /profiles/users/:ownerId/photos/:photoId
        const ownerId = ownerIdParam || photo?.userId || '';
        if (!ownerId) {
          setError('Could not determine photo owner. Please navigate back and try again.');
          return;
        }
        const result = await fetchPublicPhotoDetails({ id: ownerId, photoId }).unwrap();
        const { photo: photoData, photoOwner, comments: photoComments } = result.data;
        setPhoto(photoData);
        setProfileOwner(photoOwner ?? null);
        setLiked(photoData.isLiked ?? false);
        setOwnerIsFollowed(photoOwner?.isFollowed ?? false);
        if (photoComments) setComments(photoComments);
      }
    } catch (err: any) {
      const msg = err?.data?.message || err?.message || 'Failed to load photo.';
      setError(msg);
    }
  };

  // On mount: initialise slides from Redux swiper state
  useEffect(() => {
    if (swiperPhotos.length > 0) {
      setSlides(swiperPhotos);
      const seed = swiperPhotos.find((p) => p.id === initialPhotoId) || swiperPhotos[0];
      if (seed) setPhoto((prev: any) => prev ?? seed);
    }
  }, []); // run only on mount

  // Fetch full details when photo ID changes
  useEffect(() => {
    loadPhotoData(currentPhotoId);
  }, [currentPhotoId]);

  // SSR-safe: close sidebar on mobile
  useLayoutEffect(() => {
    if (window.innerWidth < 1024) setIsSidebarOpen(false);
  }, []);

  // Enable CSS transitions after first paint
  useEffect(() => {
    const frame = requestAnimationFrame(() => setTransitionReady(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  // Update address bar during slide navigation
  const updateAddressBar = (photoId: string) => {
    const newPath = `/photo/${photoId}${window.location.search}`;
    window.history.replaceState(null, '', newPath);
  };

  const handleNext = () => {
    if (slides.length <= 1) return;
    const next = slides[(activeIndex + 1) % slides.length];
    if (next) { setCurrentPhotoId(next.id); updateAddressBar(next.id); }
  };

  const handlePrev = () => {
    if (slides.length <= 1) return;
    const prev = slides[(activeIndex - 1 + slides.length) % slides.length];
    if (prev) { setCurrentPhotoId(prev.id); updateAddressBar(prev.id); }
  };

  const handleIndexChange = (index: number) => {
    const selected = slides[index];
    if (selected) { setCurrentPhotoId(selected.id); updateAddressBar(selected.id); }
  };

  const handleToggleLike = () => {
    setLiked((prev) => {
      const next = !prev;
      toast[next ? 'success' : 'info'](next ? 'Added to favorites!' : 'Removed from favorites.');
      return next;
    });
  };

  const handleToggleFollow = () => {
    setOwnerIsFollowed((prev) => {
      const next = !prev;
      const name = profileOwner?.fullName || profileOwner?.username || 'this user';
      toast[next ? 'success' : 'info'](next ? `Following ${name}` : `Unfollowed ${name}`);
      return next;
    });
  };

  const handleAddComment = async (text: string, parentId?: string) => {
    try {
      const res = await fetch(`/api/photo/${currentPhotoId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ author: 'Visitor', text, parentId }),
      });
      if (!res.ok) throw new Error('Failed to post comment.');
      const data = await res.json();
      setComments(data.comments);
      toast.success(parentId ? 'Reply submitted!' : 'Comment added!');
    } catch {
      toast.error('Could not submit comment. Please try again.');
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      const res = await fetch(`/api/photo/${currentPhotoId}/comments?commentId=${commentId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete comment.');
      const data = await res.json();
      setComments(data.comments);
      toast.success('Comment deleted.');
    } catch {
      toast.error('Could not delete comment. Please try again.');
    }
  };

  if (isLoading && !photo) return <PhotoSkeleton isSidebarOpen={isSidebarOpen} />;
  if (error) return <PhotoError message={error} onRetry={() => loadPhotoData(currentPhotoId)} backUrl={backUrl} />;
  if (!photo) return <PhotoSkeleton isSidebarOpen={isSidebarOpen} />;

  return (
    <main className="min-h-screen overflow-hidden bg-zinc-950 text-white">
      <div className="flex h-screen flex-col lg:flex-row">
        {/* Left: Photo Viewer */}
        <section className="relative flex h-full w-full min-w-0 flex-1 items-center justify-center overflow-hidden bg-black">
          <PhotoViewer
            photo={photo}
            slidePhotos={slides}
            index={activeIndex}
            onPrev={handlePrev}
            onNext={handleNext}
            onIndexChange={handleIndexChange}
            isLiked={liked}
            onToggleLike={handleToggleLike}
            backUrl={backUrl}
            isSidebarOpen={isSidebarOpen}
            onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
            isOwnPhoto={isOwnPhoto}
          />
        </section>

        {/* Right: Detail Sidebar */}
        <aside
          className={cn(
            'flex flex-col border-zinc-800 bg-zinc-950 text-zinc-100',
            transitionReady && 'transition-all duration-300 ease-in-out',
            'lg:static lg:z-auto lg:h-full lg:shrink-0 lg:border-l',
            isSidebarOpen ? 'lg:w-108.75' : 'lg:w-0 lg:overflow-hidden lg:border-l-0',
            'fixed inset-y-0 right-0 z-50 w-full h-full lg:static lg:inset-auto lg:z-auto',
            isSidebarOpen
              ? 'translate-x-0 opacity-100'
              : 'translate-x-full opacity-0 pointer-events-none lg:translate-x-0 lg:opacity-100 lg:pointer-events-auto',
          )}
        >
          <SidebarHeader
            owner={profileOwner}
            isSidebarOpen={isSidebarOpen}
            onToggleSidebar={() => setIsSidebarOpen(false)}
            isOwnPhoto={isOwnPhoto}
            isFollowed={ownerIsFollowed}
            onToggleFollow={handleToggleFollow}
            isLoading={isLoading && !profileOwner}
          />

          <div className="min-h-0 flex-1 scrollbar-thin overflow-y-auto bg-zinc-950">
            <SidebarMetrics
              votes={photo.totalVotes ?? photo.votes ?? 0}
              views={photo.views ?? 0}
              likes={(photo.likes ?? 0) + (liked ? 1 : 0)}
              achievements={photo.contestUpload?.length ?? photo.achievememnts?.length ?? 0}
            />
            <SidebarComments
              photoId={currentPhotoId}
              comments={comments}
              onAddComment={handleAddComment}
              onDeleteComment={handleDeleteComment}
              isLoading={isLoading}
            />
          </div>
        </aside>
      </div>
    </main>
  );
}
