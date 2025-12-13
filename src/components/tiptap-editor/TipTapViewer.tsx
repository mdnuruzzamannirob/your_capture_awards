import React from 'react';
import { proseBaseStyles } from './TipTapEditor';
import { cn } from '@/utils/cn';

interface TipTapViewerProps {
  content: string;
  className?: string;
}

export const TipTapViewer: React.FC<TipTapViewerProps> = ({ content, className }) => {
  if (!content) return null;

  return (
    <div className={cn(proseBaseStyles, className)}>
      <div dangerouslySetInnerHTML={{ __html: content }} />
    </div>
  );
};

export default TipTapViewer;
