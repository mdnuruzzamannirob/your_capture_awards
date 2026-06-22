'use client';

import { useState } from 'react';
import { Camera, Timer, Aperture, ChevronUp, ChevronDown } from 'lucide-react';
import { cn } from '@/utils/cn';

interface SidebarDetailsProps {
  camera: string;
  aperture: string;
  shutter: string;
  iso: string;
  focalLength?: string; // e.g. "4.3 mm" or derived
}

// Custom ISO Icon
function IsoIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <text
        x="50%"
        y="62%"
        dominantBaseline="middle"
        textAnchor="middle"
        fontSize="7"
        fontWeight="900"
        fill="currentColor"
        stroke="none"
      >
        ISO
      </text>
    </svg>
  );
}

// Custom Focal Length Triangle Ruler Icon
function FocalLengthIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M22 22H2V2l20 20Z" />
      <path d="M6 22v-2" />
      <path d="M10 22v-3" />
      <path d="M14 22v-2" />
      <path d="M18 22v-3" />
    </svg>
  );
}

export function SidebarDetails({
  camera,
  aperture,
  shutter,
  iso,
  focalLength = '4.3 mm',
}: SidebarDetailsProps) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <section className="border-b border-zinc-800 bg-zinc-950">
      {/* Collapsible Trigger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between px-6 py-4 transition-colors duration-150 hover:bg-zinc-900"
      >
        <span className="text-xs font-bold tracking-wider text-zinc-400 uppercase">Details</span>
        {isOpen ? (
          <ChevronUp className="size-4 text-zinc-500" />
        ) : (
          <ChevronDown className="size-4 text-zinc-500" />
        )}
      </button>

      {/* Details list */}
      <div
        className={cn(
          'overflow-hidden px-6 transition-all duration-300 ease-in-out',
          isOpen ? 'max-h-75 pb-6 opacity-100' : 'max-h-0 pb-0 opacity-0'
        )}
      >
        <div className="mt-1 grid grid-cols-2 gap-3">
          {/* Camera Info */}
          {camera && (
            <div className="col-span-2 flex items-center gap-3 rounded-md border border-zinc-800 bg-zinc-900 p-3">
              <Camera className="size-5 shrink-0 text-zinc-400" />
              <div className="flex flex-col">
                <span className="text-[10px] font-bold tracking-wide text-zinc-500 uppercase">
                  Camera
                </span>
                <span className="text-xs leading-tight font-bold text-zinc-200">{camera}</span>
              </div>
            </div>
          )}

          {/* ISO Info */}
          {iso && (
            <div className="flex items-center gap-2.5 rounded-md border border-zinc-800 bg-zinc-900 p-3">
              <IsoIcon className="size-5 shrink-0 text-zinc-400" />
              <div className="flex flex-col">
                <span className="text-[10px] font-bold tracking-wide text-zinc-500 uppercase">
                  ISO
                </span>
                <span className="text-xs leading-tight font-bold text-zinc-200">{iso}</span>
              </div>
            </div>
          )}

          {/* Shutter Info */}
          {shutter && (
            <div className="flex items-center gap-2.5 rounded-md border border-zinc-800 bg-zinc-900 p-3">
              <Timer className="size-5 shrink-0 text-zinc-400" />
              <div className="flex flex-col">
                <span className="text-[10px] font-bold tracking-wide text-zinc-500 uppercase">
                  Shutter
                </span>
                <span className="text-xs leading-tight font-bold text-zinc-200">
                  {shutter.includes('/') ? shutter : `${shutter} sec`}
                </span>
              </div>
            </div>
          )}

          {/* Aperture Info */}
          {aperture && (
            <div className="flex items-center gap-2.5 rounded-md border border-zinc-800 bg-zinc-900 p-3">
              <Aperture className="size-5 shrink-0 text-zinc-400" />
              <div className="flex flex-col">
                <span className="text-[10px] font-bold tracking-wide text-zinc-500 uppercase">
                  Aperture
                </span>
                <span className="text-xs leading-tight font-bold text-zinc-200">
                  {aperture.toLowerCase().startsWith('f/')
                    ? aperture.toUpperCase()
                    : `F${aperture}`}
                </span>
              </div>
            </div>
          )}

          {/* Focal Length Info */}
          {focalLength && (
            <div className="flex items-center gap-2.5 rounded-md border border-zinc-800 bg-zinc-900 p-3">
              <FocalLengthIcon className="size-5 shrink-0 text-zinc-400" />
              <div className="flex flex-col">
                <span className="text-[10px] font-bold tracking-wide text-zinc-500 uppercase">
                  Focal Length
                </span>
                <span className="text-xs leading-tight font-bold text-zinc-200">{focalLength}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
