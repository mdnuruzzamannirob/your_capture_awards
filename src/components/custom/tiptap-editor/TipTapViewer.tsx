import React from 'react';
import { proseBaseStyles } from './TipTapEditor';
import { cn } from '@/utils/cn';

interface TipTapViewerProps {
  content: string;
  className?: string;
}

const mojibakeReplacements: Array<[string, string]> = [
  ['\u00e2\u20ac\u0153', '\u201c'],
  ['\u00e2\u20ac\u009d', '\u201d'],
  ['\u00e2\u20ac\u02dc', '\u2018'],
  ['\u00e2\u20ac\u2122', '\u2019'],
  ['\u00e2\u20ac\u201c', '\u2013'],
  ['\u00e2\u20ac\u201d', '\u2014'],
  ['\u00e2\u20ac\u2018', '\u2011'],
  ['\u00e2\u20ac\u00a6', '\u2026'],
  ['\u00c2 ', ' '],
  ['\u00c2', ''],
];

function normalizeDisplayContent(content: string) {
  return mojibakeReplacements.reduce(
    (value, [broken, replacement]) => value.replaceAll(broken, replacement),
    content,
  );
}

function hasHtmlTag(content: string) {
  return /<\/?[a-z][\s\S]*>/i.test(content);
}

function PlainTextContent({ content }: { content: string }) {
  const blocks: React.ReactNode[] = [];
  let listItems: string[] = [];

  const flushList = () => {
    if (!listItems.length) return;

    blocks.push(
      <ul key={`list-${blocks.length}`}>
        {listItems.map((item, index) => (
          <li key={`${item}-${index}`}>{item}</li>
        ))}
      </ul>,
    );
    listItems = [];
  };

  content
    .replace(/\r\n?/g, '\n')
    .split('\n')
    .map((line) => line.trim())
    .forEach((line) => {
      if (!line) {
        flushList();
        return;
      }

      const bulletMatch = line.match(/^[-*]\s+(.+)$/);
      if (bulletMatch) {
        listItems.push(bulletMatch[1]);
        return;
      }

      flushList();

      if (/^\d+\.\s+\S/.test(line)) {
        blocks.push(<h2 key={`heading-${blocks.length}`}>{line}</h2>);
        return;
      }

      blocks.push(<p key={`paragraph-${blocks.length}`}>{line}</p>);
    });

  flushList();

  return <>{blocks}</>;
}

export const TipTapViewer: React.FC<TipTapViewerProps> = ({ content, className }) => {
  if (!content) return null;
  const normalizedContent = normalizeDisplayContent(content);

  return (
    <div className={cn(proseBaseStyles, className)}>
      {hasHtmlTag(normalizedContent) ? (
        <div dangerouslySetInnerHTML={{ __html: normalizedContent }} />
      ) : (
        <PlainTextContent content={normalizedContent} />
      )}
    </div>
  );
};

export default TipTapViewer;
