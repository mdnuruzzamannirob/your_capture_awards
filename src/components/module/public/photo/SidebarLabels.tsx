'use client';

import { Check, Pencil, Plus, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

import { cn } from '@/utils/cn';

// Keep in sync with the backend profile.validation limits
const MAX_LABELS = 20;
const MAX_LABEL_LENGTH = 30;

const labelKey = (label: string) => label.trim().toLowerCase();

interface SidebarLabelsProps {
  labels: string[];
  // Photo owner only: when given, the tags can be edited and each change is
  // saved through it. It should throw when the save fails.
  onSave?: (labels: string[]) => Promise<void>;
}

export function SidebarLabels({ labels, onSave }: SidebarLabelsProps) {
  const editable = !!onSave;
  const [items, setItems] = useState<string[]>(labels ?? []);
  const [isEditing, setIsEditing] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [draft, setDraft] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // The page first shows a seed photo from the gallery list (often without
  // labels) and swaps in the full details later under the same photo id, so
  // follow the labels whenever their content changes. Compared by content
  // because the parent passes a fresh array on every render.
  const labelsSignature = (labels ?? []).join('\u0000');
  useEffect(() => {
    if (isSaving) return;
    setItems(labelsSignature ? labelsSignature.split('\u0000') : []);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [labelsSignature]);

  useEffect(() => {
    if (isAdding) inputRef.current?.focus();
  }, [isAdding]);

  if (!editable && items.length === 0) return null;

  const save = async (next: string[]) => {
    if (!onSave) return;
    const previous = items;
    setItems(next);
    setIsSaving(true);
    try {
      await onSave(next);
    } catch (err: any) {
      setItems(previous);
      toast.error(err?.data?.message || err?.message || 'Could not update tags.');
    } finally {
      setIsSaving(false);
    }
  };

  const addDraft = async () => {
    const value = draft.trim();
    if (!value) {
      setIsAdding(false);
      return;
    }
    if (value.length > MAX_LABEL_LENGTH) {
      toast.error(`A tag can be at most ${MAX_LABEL_LENGTH} characters.`);
      return;
    }
    if (items.some((item) => labelKey(item) === labelKey(value))) {
      toast.error('This photo already has that tag.');
      return;
    }
    if (items.length >= MAX_LABELS) {
      toast.error(`A photo can have at most ${MAX_LABELS} tags.`);
      return;
    }
    setDraft('');
    await save([...items, value]);
    inputRef.current?.focus();
  };

  const removeItem = (label: string) => save(items.filter((item) => item !== label));

  const toggleEditing = () => {
    setIsEditing((prev) => !prev);
    setIsAdding(false);
    setDraft('');
  };

  return (
    <section className="border-border bg-background text-foreground border-b p-6">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h4 className="text-muted-foreground text-xs font-bold tracking-wider uppercase">
          Tags
          {isEditing && (
            <span className="text-muted-foreground/70 ml-2 font-medium normal-case">
              {items.length}/{MAX_LABELS}
            </span>
          )}
        </h4>
        {editable && (
          <button
            type="button"
            onClick={toggleEditing}
            className={cn(
              'flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold transition',
              isEditing
                ? 'bg-primary text-primary-foreground hover:opacity-90'
                : 'text-muted-foreground hover:text-foreground hover:bg-surface',
            )}
          >
            {isEditing ? <Check className="size-3.5" /> : <Pencil className="size-3.5" />}
            {isEditing ? 'Done' : 'Edit'}
          </button>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {items.map((label) => (
          <span
            key={label}
            className={cn(
              'border-border bg-surface text-muted-foreground inline-flex items-center gap-1 rounded-full border py-1.5 text-xs font-bold',
              isEditing ? 'pr-1.5 pl-3.5' : 'px-3.5',
            )}
          >
            {label}
            {isEditing && (
              <button
                type="button"
                aria-label={`Remove tag ${label}`}
                disabled={isSaving}
                onClick={() => removeItem(label)}
                className="hover:bg-primary hover:text-primary-foreground flex size-4 items-center justify-center rounded-full transition disabled:opacity-50"
              >
                <X className="size-3" />
              </button>
            )}
          </span>
        ))}

        {isEditing &&
          (isAdding ? (
            <input
              ref={inputRef}
              value={draft}
              maxLength={MAX_LABEL_LENGTH}
              disabled={isSaving}
              placeholder="New tag"
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ',') {
                  e.preventDefault();
                  void addDraft();
                } else if (e.key === 'Escape') {
                  setDraft('');
                  setIsAdding(false);
                }
              }}
              onBlur={() => {
                if (!draft.trim()) setIsAdding(false);
              }}
              className="border-primary bg-background text-foreground placeholder:text-muted-foreground/60 w-32 rounded-full border px-3.5 py-1.5 text-xs font-bold outline-none"
            />
          ) : (
            items.length < MAX_LABELS && (
              <button
                type="button"
                onClick={() => setIsAdding(true)}
                className="border-border text-muted-foreground hover:border-primary hover:text-primary inline-flex items-center gap-1 rounded-full border border-dashed px-3 py-1.5 text-xs font-bold transition"
              >
                <Plus className="size-3.5" /> Add tag
              </button>
            )
          ))}

        {!isEditing && items.length === 0 && (
          <p className="text-muted-foreground/70 text-xs">
            No tags yet. Add some to find this photo faster when entering contests.
          </p>
        )}
      </div>
    </section>
  );
}
