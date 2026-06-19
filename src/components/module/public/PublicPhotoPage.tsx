'use client';

import { Button } from '@/components/ui/button';
import { PublicPhoto, PublicProfile } from '@/lib/mock/public-gallery-data';
import { Camera, ChevronLeft, ChevronRight, Eye, Heart, Trophy, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useMemo, useState } from 'react';

type Props = {
  activePhoto: PublicPhoto;
  owner: PublicProfile;
  slidePhotos: PublicPhoto[];
};

export function PublicPhotoPage({ activePhoto, owner, slidePhotos }: Props) {
  const startIndex = Math.max(
    0,
    slidePhotos.findIndex((photo) => photo.id === activePhoto.id),
  );
  const [index, setIndex] = useState(startIndex);
  const [liked, setLiked] = useState(false);
  const [comment, setComment] = useState('');
  const [localComments, setLocalComments] = useState(activePhoto.comments);
  const photo = slidePhotos[index] ?? activePhoto;

  const next = () => setIndex((current) => (current + 1) % slidePhotos.length);
  const prev = () => setIndex((current) => (current - 1 + slidePhotos.length) % slidePhotos.length);

  const comments = useMemo(
    () => (photo.id === activePhoto.id ? localComments : photo.comments),
    [activePhoto.id, localComments, photo],
  );

  return (
    <main className="min-h-screen bg-black text-white lg:h-screen lg:overflow-hidden">
      <div className="grid min-h-screen lg:grid-cols-[1fr_435px]">
        <section className="relative flex min-h-[62vh] items-center justify-center bg-black lg:min-h-screen">
          <Link
            href={`/profile/${owner.username}`}
            className="absolute top-4 left-4 z-20 grid size-11 place-items-center bg-white/10 text-white backdrop-blur"
          >
            <X className="size-6" />
          </Link>

          <button
            onClick={prev}
            aria-label="Previous photo"
            className="absolute left-3 z-20 grid size-14 place-items-center text-white md:left-7"
          >
            <ChevronLeft className="size-12 stroke-[1.6]" />
          </button>
          <Image
            src={photo.src}
            alt={photo.alt}
            className="max-h-screen w-full object-contain"
            width={800}
            height={600}
          />
          <button
            onClick={next}
            aria-label="Next photo"
            className="absolute right-3 z-20 grid size-14 place-items-center text-white md:right-7"
          >
            <ChevronRight className="size-12 stroke-[1.6]" />
          </button>

          <button
            onClick={() => setLiked((value) => !value)}
            aria-label="Like photo"
            className="absolute top-6 right-7 z-20 grid size-14 place-items-center text-white"
          >
            <Heart className={liked ? 'size-12 fill-red-500 text-red-500' : 'size-12'} />
          </button>

          <div className="absolute bottom-5 left-1/2 z-20 flex -translate-x-1/2 gap-2">
            {slidePhotos.map((item, itemIndex) => (
              <button
                key={item.id}
                onClick={() => setIndex(itemIndex)}
                aria-label={`Show ${item.title}`}
                className={itemIndex === index ? 'h-2 w-8 bg-white' : 'size-2 bg-white/45'}
              />
            ))}
          </div>
        </section>

        <aside className="overflow-y-auto bg-[#f0f1f2] text-slate-900 lg:h-screen">
          <section className="flex items-center justify-between border-b border-slate-300 p-7">
            <Link href={`/profile/${owner.username}`} className="flex items-center gap-4">
              <Image
                src={owner.avatar}
                alt={owner.name}
                width={80}
                height={80}
                className="size-20 rounded-full border-4 border-[#d7764f] object-cover"
              />
              <div>
                <h1 className="text-xl font-black">{owner.name}</h1>
                <p className="text-sm text-slate-500">{owner.country}</p>
                <Button size="sm" className="mt-2 h-7 bg-sky-600 text-xs hover:bg-sky-700">
                  Follow
                </Button>
              </div>
            </Link>
            <div className="grid size-20 place-items-center rounded-full border-2 border-slate-700 bg-white text-center text-sm font-black uppercase">
              {owner.rank}
            </div>
          </section>

          <section className="grid grid-cols-4 border-b border-slate-300 p-6 text-center">
            <Metric icon={<Camera />} value={photo.votes} label="Votes" />
            <Metric icon={<Eye />} value={photo.views} label="Views" />
            <Metric icon={<Heart />} value={photo.likes + (liked ? 1 : 0)} label="Likes" />
            <Metric icon={<Trophy />} value={photo.achievements} label="Awards" />
          </section>

          <section className="border-b border-slate-300 p-7">
            <p className="text-xs font-bold text-sky-600 uppercase">{photo.contestName}</p>
            <h2 className="mt-1 text-2xl font-black">{photo.title}</h2>
            <p className="mt-2 text-sm text-slate-500">{photo.alt}</p>
          </section>

          <section className="border-b border-slate-300 p-7">
            <h3 className="text-lg font-black uppercase">Comments ({comments.length})</h3>
            <div className="mt-5 space-y-4">
              {comments.map((item) => (
                <div key={item.id} className="flex gap-3 text-sm">
                  <div className="grid size-9 shrink-0 place-items-center rounded-full bg-sky-100 font-black text-sky-700">
                    {item.author.charAt(0)}
                  </div>
                  <div>
                    <p>
                      <span className="font-bold">{item.author}</span> {item.text}
                    </p>
                    <p className="mt-1 text-xs text-slate-400">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
            <form
              className="mt-5"
              onSubmit={(event) => {
                event.preventDefault();
                if (!comment.trim()) return;
                setLocalComments((items) => [
                  ...items,
                  {
                    id: crypto.randomUUID(),
                    author: 'Public Visitor',
                    text: comment.trim(),
                    time: 'just now',
                  },
                ]);
                setComment('');
              }}
            >
              <textarea
                value={comment}
                onChange={(event) => setComment(event.target.value)}
                placeholder="Write a comment"
                className="h-24 w-full resize-none border border-slate-300 bg-white p-3 text-sm outline-none focus:border-sky-500"
              />
              <div className="mt-2 flex justify-end">
                <Button size="sm" className="h-8 bg-sky-600 text-xs uppercase hover:bg-sky-700">
                  Submit
                </Button>
              </div>
            </form>
          </section>

          <section className="border-b border-slate-300 p-7">
            <h3 className="text-lg font-black uppercase">Details</h3>
            <div className="mt-4 grid grid-cols-2 gap-3 text-sm text-slate-600">
              {[photo.camera, photo.aperture, photo.shutter, photo.iso].map((item) => (
                <div key={item} className="border border-slate-200 bg-white px-3 py-2">
                  {item}
                </div>
              ))}
            </div>
          </section>

          <section className="p-7">
            <h3 className="text-lg font-black uppercase">Labels</h3>
            <div className="mt-4 flex flex-wrap gap-2">
              {photo.labels.map((label) => (
                <span
                  key={label}
                  className="rounded-full bg-white px-4 py-2 text-sm text-slate-700"
                >
                  {label}
                </span>
              ))}
            </div>
          </section>
        </aside>
      </div>
    </main>
  );
}

function Metric({ icon, value, label }: { icon: React.ReactNode; value: number; label: string }) {
  return (
    <div>
      <div className="mx-auto mb-1 grid size-7 place-items-center text-slate-700 [&_svg]:size-6">
        {icon}
      </div>
      <p className="text-lg font-black">{value.toLocaleString()}</p>
      <p className="text-xs text-slate-500 uppercase">{label}</p>
    </div>
  );
}
