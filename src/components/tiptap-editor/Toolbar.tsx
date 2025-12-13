'use client';

import React from 'react';
import { Bold, Italic, List, ListOrdered, Heading1, Heading2, Heading3 } from 'lucide-react';
import { Toggle } from '@/components/ui/toggle';
import type { Editor } from '@tiptap/react';
import AddImagePopover from './AddImagePopover';
import AddLinkPopover from './AddLinkPopover';
import AddUnderlineToggle from './AddUnderlineToggle';

interface Props {
  editor?: Editor | null;
  className?: string;
}

export const Toolbar: React.FC<Props> = ({ editor, className }) => {
  if (!editor) return null;

  return (
    <div
      className={`bg-input/30 flex h-11 flex-wrap items-center gap-1 border-b px-2 ${className ?? ''}`}
    >
      {/* Bold */}
      <Toggle
        size="sm"
        pressed={editor.isActive('bold')}
        onPressedChange={() => editor.chain().focus().toggleBold().run()}
        className="text-gray-300 hover:bg-gray-700 data-[state=on]:bg-gray-700"
        title="Bold"
      >
        <Bold className="size-4" />
      </Toggle>

      {/* Italic */}
      <Toggle
        size="sm"
        pressed={editor.isActive('italic')}
        onPressedChange={() => editor.chain().focus().toggleItalic().run()}
        className="text-gray-300 hover:bg-gray-700 data-[state=on]:bg-gray-700"
        title="Italic"
      >
        <Italic className="size-4" />
      </Toggle>

      {/* Underline Toggle */}
      <AddUnderlineToggle editor={editor} />

      <div className="mx-1 h-4 w-px self-center bg-gray-600" />

      {/* Headings */}
      <Toggle
        size="sm"
        pressed={editor.isActive('heading', { level: 1 })}
        onPressedChange={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className="font-bold text-gray-300 hover:bg-gray-700 data-[state=on]:bg-gray-700"
        title="H1"
      >
        <Heading1 className="size-4" />
      </Toggle>

      <Toggle
        size="sm"
        pressed={editor.isActive('heading', { level: 2 })}
        onPressedChange={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className="font-bold text-gray-300 hover:bg-gray-700 data-[state=on]:bg-gray-700"
        title="H2"
      >
        <Heading2 className="size-4" />
      </Toggle>

      <Toggle
        size="sm"
        pressed={editor.isActive('heading', { level: 3 })}
        onPressedChange={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className="font-bold text-gray-300 hover:bg-gray-700 data-[state=on]:bg-gray-700"
        title="H3"
      >
        <Heading3 className="size-4" />
      </Toggle>

      <div className="mx-1 h-4 w-px self-center bg-gray-600" />

      {/* Lists */}
      <Toggle
        size="sm"
        pressed={editor.isActive('bulletList')}
        onPressedChange={() => editor.chain().focus().toggleBulletList().run()}
        className="text-gray-300 hover:bg-gray-700 data-[state=on]:bg-gray-700"
        title="Bullet list"
      >
        <List className="size-4" />
      </Toggle>

      <Toggle
        size="sm"
        pressed={editor.isActive('orderedList')}
        onPressedChange={() => editor.chain().focus().toggleOrderedList().run()}
        className="text-gray-300 hover:bg-gray-700 data-[state=on]:bg-gray-700"
        title="Numbered list"
      >
        <ListOrdered className="size-4" />
      </Toggle>

      <div className="mx-1 h-4 w-px self-center bg-gray-600" />

      {/* Image & Link */}
      <AddImagePopover editor={editor} />
      <AddLinkPopover editor={editor} />
    </div>
  );
};

export default Toolbar;
