'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useEditor, EditorContent, type Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Heading from '@tiptap/extension-heading';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import Underline from '@tiptap/extension-underline';
import { Spinner } from '@/components/ui/spinner';
import Toolbar from './Toolbar';
import { cn } from '@/utils/cn';

export const proseBaseStyles = cn(
  // General Typography
  'prose dark:prose-invert max-w-none',

  // spacing
  'whitespace-pre-wrap',

  // Headings
  '[&_h1]:text-3xl [&_h1]:font-bold',
  '[&_h2]:text-2xl [&_h2]:font-semibold',
  '[&_h3]:text-xl [&_h3]:font-medium',

  // Paragraph min hight
  '[&_p]:min-h-[1.5rem]',

  // Lists
  '[&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-1',
  '[&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:space-y-1',

  // Links: color + underline
  '[&_a]:text-blue-400 [&_a]:underline hover:[&_a]:text-blue-500',

  // Images
  '[&_img]:max-w-full [&_img]:h-auto [&_img]:rounded-md',
);

export interface TipTapEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: string;
  maxHeight?: string;
  className?: string;
}

export const TipTapEditor: React.FC<TipTapEditorProps> = ({
  value,
  onChange,
  placeholder = 'Start typing...',
  minHeight = 'min-h-[120px]',
  maxHeight = 'max-h-[600px]',
  className,
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const extensions = useMemo(
    () => [
      StarterKit.configure({
        heading: false,
      }),

      Heading.configure({
        levels: [1, 2, 3],
      }),

      Image.configure({
        inline: true,
        allowBase64: true,
      }),

      Link.configure({
        openOnClick: false,
        autolink: true,
        defaultProtocol: 'https',
      }),

      Underline,

      Placeholder.configure({
        placeholder,
        emptyEditorClass:
          'before:content-[attr(data-placeholder)] before:text-gray-500 before:pointer-events-none before:float-left before:h-0',
      }),
    ],
    [placeholder],
  );

  const editor = useEditor({
    extensions,
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: cn('p-3 focus:outline-none overflow-y-auto', proseBaseStyles, minHeight, maxHeight),
      },
    },
  }) as Editor | null;

  if (!mounted || !editor) {
    return (
      <div
        className={cn(
          'flex w-full items-center justify-center rounded-md border bg-gray-900 p-3',
          minHeight,
          maxHeight,
        )}
      >
        <p className="text-muted-foreground flex items-center gap-2">
          <Spinner />
          Loading text editor...
        </p>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'overflow-hidden rounded-md border transition-all focus-within:ring-2 focus-within:ring-white/20',
        className,
      )}
    >
      <Toolbar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
};

export default TipTapEditor;
