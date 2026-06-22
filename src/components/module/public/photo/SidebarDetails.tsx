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
    <section className="border-b border-zinc-200 bg-white">
      {/* Collapsible Trigger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between px-6 py-4 hover:bg-zinc-50 transition-colors duration-150"
      >
        <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
          Details
        </span>
        {isOpen ? (
          <ChevronUp className="size-4 text-zinc-400" />
        ) : (
          <ChevronDown className="size-4 text-zinc-400" />
        )}
      </button>

      {/* Details list */}
      <div
        className={cn(
          'overflow-hidden transition-all duration-300 ease-in-out px-6',
          isOpen ? 'max-h-[300px] pb-6 opacity-100' : 'max-h-0 pb-0 opacity-0'
        )}
      >
        <div className="grid grid-cols-2 gap-3 mt-1">
          {/* Camera Info */}
          {camera && (
            <div className="col-span-2 flex items-center gap-3 bg-zinc-50 border border-zinc-100 rounded-md p-3">
              <Camera className="size-5 text-zinc-400 shrink-0" />
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wide">Camera</span>
                <span className="text-xs font-bold text-zinc-700 leading-tight">{camera}</span>
              </div>
            </div>
          )}

          {/* ISO Info */}
          {iso && (
            <div className="flex items-center gap-2.5 bg-zinc-50 border border-zinc-100 rounded-md p-3">
              <IsoIcon className="size-5 text-zinc-400 shrink-0" />
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wide">ISO</span>
                <span className="text-xs font-bold text-zinc-700 leading-tight">{iso}</span>
              </div>
            </div>
          )}

          {/* Shutter Info */}
          {shutter && (
            <div className="flex items-center gap-2.5 bg-zinc-50 border border-zinc-100 rounded-md p-3">
              <Timer className="size-5 text-zinc-400 shrink-0" />
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wide">Shutter</span>
                <span className="text-xs font-bold text-zinc-700 leading-tight">
                  {shutter.includes('/') ? shutter : `${shutter} sec`}
                </span>
              </div>
            </div>
          )}

          {/* Aperture Info */}
          {aperture && (
            <div className="flex items-center gap-2.5 bg-zinc-50 border border-zinc-100 rounded-md p-3">
              <Aperture className="size-5 text-zinc-400 shrink-0" />
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wide">Aperture</span>
                <span className="text-xs font-bold text-zinc-700 leading-tight">
                  {aperture.toLowerCase().startsWith('f/') ? aperture.toUpperCase() : `F${aperture}`}
                </span>
              </div>
            </div>
          )}

          {/* Focal Length Info */}
          {focalLength && (
            <div className="flex items-center gap-2.5 bg-zinc-50 border border-zinc-100 rounded-md p-3">
              <FocalLengthIcon className="size-5 text-zinc-400 shrink-0" />
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wide">Focal Length</span>
                <span className="text-xs font-bold text-zinc-700 leading-tight">{focalLength}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
