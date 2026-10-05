'use client';

import { Check, Pencil, Plus, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

import { cn } from '@/utils/cn';

// Keep in sync with the backend profile.validation limits.
const MAX_LABELS = 20;
const MAX_LABEL_LENGTH = 30;
const MAX_CATEGORIES = 20;
const MAX_CATEGORY_LENGTH = 100;

const termKey = (value: string) => value.trim().toLowerCase();

const uniqueTerms = (values: string[]) =>
  values.filter(
    (value, index, all) =>
      !!value.trim() && all.findIndex((other) => termKey(other) === termKey(value)) === index,
  );

interface SidebarLabelsProps {
  labels: string[];
  categories?: string[];
  // Owner-only callbacks. Each should throw when saving fails so the editor can
  // restore its previous list.
  onSave?: (labels: string[]) => Promise<void>;
  onSaveCategories?: (categories: string[]) => Promise<void>;
}

interface EditableTermListProps {
  title: string;
  singular: string;
  plural: string;
  values: string[];
  maxItems: number;
  maxLength: number;
  onSave?: (values: string[]) => Promise<void>;
  categoryStyle?: boolean;
}

function EditableTermList({
  title,
  singular,
  plural,
  values,
  maxItems,
  maxLength,
  onSave,
  categoryStyle = false,
}: EditableTermListProps) {
  const editable = !!onSave;
  const normalizedValues = uniqueTerms(values ?? []);
  const [items, setItems] = useState<string[]>(normalizedValues);
  const [isEditing, setIsEditing] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [draft, setDraft] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // The page swaps a seed gallery photo for full details under the same id, so
  // follow list changes by content rather than array identity.
  const valuesSignature = normalizedValues.join('\u0000');
  useEffect(() => {
    if (isSaving) return;
    setItems(valuesSignature ? valuesSignature.split('\u0000') : []);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [valuesSignature]);

  useEffect(() => {
    if (isAdding) inputRef.current?.focus();
  }, [isAdding]);

  if (!editable && items.length === 0) return null;

  const save = async (next: string[]) => {
    if (!onSave) return false;
    const previous = items;
    setItems(next);
    setIsSaving(true);
    try {
      await onSave(next);
      return true;
    } catch (err: any) {
      setItems(previous);
      toast.error(err?.data?.message || err?.message || `Could not update ${plural}.`);
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const addDraft = async (refocus = true) => {
    const value = draft.trim();
    if (!value) {
      setIsAdding(false);
      return true;
    }
    if (value.length > maxLength) {
      toast.error(`A ${singular} can be at most ${maxLength} characters.`);
      return false;
    }
    if (items.some((item) => termKey(item) === termKey(value))) {
      toast.error(`This photo already has that ${singular}.`);
      return false;
    }
    if (items.length >= maxItems) {
      toast.error(`A photo can have at most ${maxItems} ${plural}.`);
      return false;
    }

    setDraft('');
    const saved = await save([...items, value]);
    if (!saved) {
      setDraft(value);
    } else if (refocus) {
      inputRef.current?.focus();
    }
    return saved;
  };

  const removeItem = (value: string) => save(items.filter((item) => item !== value));

  const toggleEditing = async () => {
    if (isSaving) return;

    if (!isEditing) {
      setIsEditing(true);
      setIsAdding(false);
      setDraft('');
      return;
    }

    if (draft.trim() && !(await addDraft(false))) return;

    setIsEditing(false);
    setIsAdding(false);
    setDraft('');
  };

  return (
    <div>
      <div className="mb-4 flex items-center justify-between gap-3">
        <h4 className="text-muted-foreground text-xs font-bold tracking-wider uppercase">
          {title}
          {isEditing && (
            <span className="text-muted-foreground/70 ml-2 font-medium normal-case">
              {items.length}/{maxItems}
            </span>
          )}
        </h4>
        {editable && (
          <button
            type="button"
            disabled={isSaving}
            onClick={() => void toggleEditing()}
            className={cn(
              'flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold transition disabled:cursor-not-allowed disabled:opacity-50',
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
        {items.map((value) => (
          <span
            key={value}
            className={cn(
              'inline-flex items-center gap-1 border py-1.5 text-xs font-bold',
              categoryStyle
                ? 'border-primary/30 bg-primary/10 text-primary rounded-md'
                : 'border-border bg-surface text-muted-foreground rounded-full',
              isEditing ? 'pr-1.5 pl-3.5' : 'px-3.5',
            )}
          >
            {value}
            {isEditing && (
              <button
                type="button"
                aria-label={`Remove ${singular} ${value}`}
                disabled={isSaving}
                onClick={() => void removeItem(value)}
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
              maxLength={maxLength}
              disabled={isSaving}
              placeholder={`New ${singular}`}
              onChange={(event) => setDraft(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ',') {
                  event.preventDefault();
                  void addDraft();
                } else if (event.key === 'Escape') {
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
            items.length < maxItems && (
              <button
                type="button"
                onClick={() => setIsAdding(true)}
                className="border-border text-muted-foreground hover:border-primary hover:text-primary inline-flex items-center gap-1 rounded-full border border-dashed px-3 py-1.5 text-xs font-bold transition"
              >
                <Plus className="size-3.5" /> Add {singular}
              </button>
            )
          ))}

        {!isEditing && items.length === 0 && (
          <p className="text-muted-foreground/70 text-xs">
            {editable
              ? `No ${plural} yet. Add one to help organize this photo.`
              : `No ${plural} yet.`}
          </p>
        )}
      </div>
    </div>
  );
}

export function SidebarLabels({
  labels,
  categories = [],
  onSave,
  onSaveCategories,
}: SidebarLabelsProps) {
  const showLabels = !!onSave || uniqueTerms(labels).length > 0;
  const showCategories = !!onSaveCategories || uniqueTerms(categories).length > 0;

  if (!showLabels && !showCategories) return null;

  return (
    <section className="border-border bg-background text-foreground space-y-6 border-b p-6">
      {showLabels && (
        <EditableTermList
          title="Tags"
          singular="tag"
          plural="tags"
          values={labels}
          maxItems={MAX_LABELS}
          maxLength={MAX_LABEL_LENGTH}
          onSave={onSave}
        />
      )}
      {showCategories && (
        <EditableTermList
          title="Categories"
          singular="category"
          plural="categories"
          values={categories}
          maxItems={MAX_CATEGORIES}
          maxLength={MAX_CATEGORY_LENGTH}
          onSave={onSaveCategories}
          categoryStyle
        />
      )}
    </section>
  );
}
