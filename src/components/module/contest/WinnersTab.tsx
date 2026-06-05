'use client';

import { TabsContent } from '@/components/ui/tabs';
import { Gift } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';
import { AiOutlineThunderbolt } from 'react-icons/ai';
import { IoKeyOutline } from 'react-icons/io5';
import { MdOutlineCameraswitch } from 'react-icons/md';

type ContestPrize = {
  category: string;
  boost: number;
  swap: number;
  key: number;
};

type WinnerPhoto = {
  photo: {
    id: string;
    url: string;
  };
};

type Winner = {
  id: string;
  category: string;
  photo: {
    photo: {
      id: string;
      url: string;
    } | null;
  };
  participant?: {
    user?: {
      fullName?: string;
      country?: string | null;
      avatar?: string | null;
    };
    photos?: WinnerPhoto[];
  };
};

const WinnersTab = ({ contest, value }: { contest: any; value: string }) => {
  const winners: Winner[] = contest?.winners?.data || [];
  const prizes: ContestPrize[] = contest?.prizes || [];

  const topPhotographerWinner = winners.find((winner) => winner.category === 'TOP_PHOTOGRAPHER');

  const topPhotoWinner = winners.find((winner) => winner.category === 'TOP_PHOTO');

  const topPhotographerPrize = prizes.find((prize) => prize.category === 'TOP_PHOTOGRAPHER');

  const topPhotoPrize = prizes.find((prize) => prize.category === 'TOP_PHOTO');

  const photographerPhotos = useMemo(() => {
    return (
      topPhotographerWinner?.participant?.photos?.map((item) => item?.photo)?.filter(Boolean) || []
    );
  }, [topPhotographerWinner]);

  const [selectedPhoto, setSelectedPhoto] = useState<any>(null);

  useEffect(() => {
    if (photographerPhotos.length) {
      setSelectedPhoto(photographerPhotos[0]);
    }
  }, [photographerPhotos]);

  const normalizeImageUrl = (url?: string | null) => {
    if (!url) return '/images/person.png';

    return url.replace(/\\/g, '/');
  };

  const renderReward = (prize?: ContestPrize) => {
    if (!prize) return null;

    return (
      <div className="text-primary bg-primary/10 flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm">
        <Gift className="size-4" />

        <p className="flex items-center gap-1">
          <MdOutlineCameraswitch className="rotate-90" />x{prize.swap}
        </p>

        <span>|</span>

        <p className="flex items-center gap-1">
          <AiOutlineThunderbolt />x{prize.boost}
        </p>

        <span>|</span>

        <p className="flex items-center gap-1">
          <IoKeyOutline />x{prize.key}
        </p>
      </div>
    );
  };

  const renderDynamicGallery = () => {
    if (!photographerPhotos.length) {
      return <div className="h-125 rounded-2xl bg-white/10" />;
    }

    if (photographerPhotos.length === 1) {
      return (
        <div className="relative h-125 overflow-hidden rounded-2xl">
          <Image
            src={normalizeImageUrl(photographerPhotos[0].url)}
            alt="Winner Photo"
            fill
            className="object-cover"
          />
        </div>
      );
    }

    return (
      <div className="grid h-125 grid-cols-12 gap-4">
        {/* BIG IMAGE */}

        <div
          className={`relative overflow-hidden rounded-2xl ${
            photographerPhotos.length === 2 ? 'col-span-8' : 'col-span-9'
          }`}
        >
          <Image
            src={normalizeImageUrl(selectedPhoto?.url)}
            alt="Selected Photo"
            fill
            className="object-cover"
          />
        </div>

        {/* SIDE IMAGES */}

        <div
          className={`scrollbar-none overflow-y-auto pr-1 ${
            photographerPhotos.length === 2 ? 'col-span-4' : 'col-span-3'
          }`}
        >
          <div
            className={`grid gap-4 ${
              photographerPhotos.length === 2
                ? 'grid-rows-1'
                : photographerPhotos.length === 3
                  ? 'grid-rows-2'
                  : 'auto-rows-[120px] grid-rows-none'
            }`}
          >
            {photographerPhotos.map((photo) => {
              const isActive = selectedPhoto?.id === photo.id;

              return (
                <button
                  key={photo.id}
                  type="button"
                  onClick={() => setSelectedPhoto(photo)}
                  className={`relative min-h-30 overflow-hidden rounded-2xl border-2 transition-all ${
                    isActive
                      ? 'border-primary scale-[0.98]'
                      : 'border-transparent hover:border-white/30'
                  }`}
                >
                  <Image
                    src={normalizeImageUrl(photo.url)}
                    alt="Winner Thumbnail"
                    fill
                    className="object-cover"
                  />
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  const renderWinnerInfo = (winner?: Winner, prize?: ContestPrize) => {
    return (
      <div className="flex items-center justify-between gap-5">
        {/* LEFT */}

        <div className="flex min-w-0 items-center gap-5">
          <div className="border-foreground size-28 shrink-0 overflow-hidden rounded-full border-4 bg-black">
            <Image
              alt="Profile"
              src={normalizeImageUrl(winner?.participant?.user?.avatar)}
              width={150}
              height={150}
              className="size-full object-cover"
            />
          </div>

          <div className="min-w-0 space-y-1">
            <h3 className="truncate text-3xl leading-none font-semibold">
              {winner?.participant?.user?.fullName || 'Unknown User'}
            </h3>

            <p className="text-muted-foreground leading-none">
              {winner?.participant?.user?.country || 'Unknown Country'}
            </p>
          </div>
        </div>

        {/* RIGHT */}

        {renderReward(prize)}
      </div>
    );
  };

  return (
    <TabsContent value={value} className="mx-auto w-full max-w-6xl space-y-10">
      {/* TOP PHOTOGRAPHER */}

      {topPhotographerWinner && (
        <div className="border-black-2-600 space-y-6 rounded-2xl border-2 p-5 md:p-8">
          {/* TITLE */}

          <div className="flex items-center justify-center">
            <h1 className="text-center text-3xl font-bold uppercase md:text-5xl">
              TOP PHOTOGRAPHER WINNER
            </h1>
          </div>

          {/* GALLERY */}

          {renderDynamicGallery()}

          {/* USER INFO */}

          {renderWinnerInfo(topPhotographerWinner, topPhotographerPrize)}
        </div>
      )}

      {/* TOP PHOTO */}

      {topPhotoWinner && (
        <div className="border-black-2-600 space-y-6 rounded-2xl border-2 p-5 md:p-8">
          {/* TITLE */}

          <div className="flex items-center justify-center">
            <h1 className="text-center text-3xl font-bold uppercase md:text-5xl">
              TOP PHOTO WINNER
            </h1>
          </div>

          {/* PHOTO */}

          <div className="relative h-125 overflow-hidden rounded-2xl bg-white/10">
            {topPhotoWinner?.photo?.photo?.url ? (
              <Image
                alt="Top Photo"
                src={normalizeImageUrl(topPhotoWinner.photo.photo.url)}
                fill
                className="object-cover"
              />
            ) : (
              <div className="size-full bg-white/10" />
            )}
          </div>

          {/* USER INFO */}

          {renderWinnerInfo(topPhotoWinner, topPhotoPrize)}
        </div>
      )}
    </TabsContent>
  );
};

export default WinnersTab;
