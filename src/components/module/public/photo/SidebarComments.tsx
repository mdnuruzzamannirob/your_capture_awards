'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/utils/cn';
import { CornerDownRight, Pencil, Reply, Trash2, X } from 'lucide-react';
import { useState } from 'react';

// ── Types ─────────────────────────────────────────────────────────────────────
export interface CommentProvider {
  id?: string;
  name?: string;
  avatar?: string;
}

export interface Comment {
  id: string;
  /** display name — may come from `provider.name` on real API responses */
  author?: string;
  text: string;
  time?: string;
  createdAt?: string;
  photoId?: string | null;
  parentId?: string | null;
  providerId?: string;
  provider?: CommentProvider;
  userId?: string;
  replies?: Comment[];
  commentReplies?: Comment[];
}

interface SidebarCommentsProps {
  photoId: string;
  comments: Comment[];
  currentUserId?: string;
  onAddComment: (text: string, parentId?: string) => Promise<void>;
  onDeleteComment: (commentId: string) => Promise<void>;
  onEditComment?: (commentId: string, text: string) => Promise<void>;
  isLoading?: boolean;
}

// ── Helper: Format date/time ───────────────────────────────────────────────
function formatCommentTime(createdAtStr?: string, timeStr?: string): string {
  if (timeStr && !timeStr.includes('T') && !timeStr.includes('-')) return timeStr;
  const dateStr = createdAtStr || timeStr;
  if (!dateStr) return '';

  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;

  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHr = Math.floor(diffMin / 60);
  const diffDays = Math.floor(diffHr / 24);

  if (diffSec < 60) return 'just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHr < 24) return `${diffHr}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

// Helper to count total comments recursively
function countAllComments(comments: Comment[]): number {
  let count = 0;
  for (const comment of comments) {
    count += 1;
    const replies = comment.commentReplies || comment.replies;
    if (replies && replies.length > 0) {
      count += countAllComments(replies);
    }
  }
  return count;
}

// ── Ownership check ────────────────────────────────────────────────────────────
// The server may put the author ID in `providerId` or `provider.id` or `userId`.
function isOwner(comment: Comment, currentUserId?: string): boolean {
  if (!currentUserId) return false;
  return (
    comment.userId === currentUserId ||
    comment.providerId === currentUserId ||
    comment.provider?.id === currentUserId
  );
}

// ── Main component ─────────────────────────────────────────────────────────────
export function SidebarComments({
  photoId,
  comments,
  currentUserId,
  onAddComment,
  onDeleteComment,
  onEditComment,
  isLoading = false,
}: SidebarCommentsProps) {
  const [commentText, setCommentText] = useState('');
  const [replyingToId, setReplyingToId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() || isSubmitting) return;
    setIsSubmitting(true);
    try {
      await onAddComment(commentText.trim());
      setCommentText('');
    } catch (err) {
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="bg-background p-6 text-foreground">
      <h4 className="mb-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">
        Comments ({countAllComments(comments)})
      </h4>

      {/* Main Comment Box */}
      <form onSubmit={handleSubmitComment} className="mb-6">
        <div className="relative rounded-md border border-border bg-surface p-2 focus-within:border-border">
          <textarea
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Write a comment"
            className="min-h-20 w-full resize-none bg-transparent px-2 py-1 text-sm text-foreground outline-hidden placeholder:text-caption-foreground"
            disabled={isSubmitting || isLoading}
          />
          <div className="mt-2 flex justify-end border-t border-border pt-2">
            <Button
              type="submit"
              size="sm"
              className="bg-primary hover:bg-primary/90 h-8 rounded-sm px-5 text-xs font-medium text-primary-foreground transition-colors duration-200"
              disabled={!commentText.trim() || isSubmitting || isLoading}
            >
              {isSubmitting ? 'SUBMITTING...' : 'SUBMIT'}
            </Button>
          </div>
        </div>
      </form>

      {/* Comments List */}
      <div className="space-y-5">
        {isLoading && comments.length === 0 ? (
          <div className="space-y-4 pt-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex animate-pulse gap-3">
                <div className="size-9 shrink-0 rounded-full bg-surface-secondary" />
                <div className="flex-1 space-y-1.5">
                  <div className="h-3.5 w-24 rounded bg-surface-secondary" />
                  <div className="h-5 w-full rounded bg-surface" />
                </div>
              </div>
            ))}
          </div>
        ) : comments.length === 0 ? (
          <p className="py-4 text-center text-xs font-medium text-caption-foreground">
            No comments yet. Be the first to comment!
          </p>
        ) : (
          comments.map((comment) => (
            <TopLevelComment
              key={comment.id}
              comment={comment}
              currentUserId={currentUserId}
              replyingToId={replyingToId}
              setReplyingToId={setReplyingToId}
              onAddComment={onAddComment}
              onDelete={onDeleteComment}
              onEdit={onEditComment}
            />
          ))
        )}
      </div>
    </section>
  );
}

// ── Top-level comment (depth 0) ───────────────────────────────────────────────
// Renders the comment body + inline reply form + all replies rendered at a
// SINGLE nested level (Facebook style: no matter how deep the reply chain is,
// everything is shown as depth-1 visually).
function TopLevelComment({
  comment,
  currentUserId,
  replyingToId,
  setReplyingToId,
  onAddComment,
  onDelete,
  onEdit,
}: {
  comment: Comment;
  currentUserId?: string;
  replyingToId: string | null;
  setReplyingToId: (id: string | null) => void;
  onAddComment: (text: string, parentId?: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onEdit?: (id: string, text: string) => Promise<void>;
}) {
  // Flatten all replies into a single list (keeps Facebook "thread" look)
  const flatReplies = flattenReplies(comment.replies || comment.commentReplies || []);

  return (
    <div className="group/top text-sm">
      <CommentBubble
        comment={comment}
        depth={0}
        currentUserId={currentUserId}
        replyingToId={replyingToId}
        setReplyingToId={setReplyingToId}
        onAddComment={onAddComment}
        onDelete={onDelete}
        onEdit={onEdit}
      />

      {/* Nested replies — all shown at exactly ONE indent level */}
      {flatReplies.length > 0 && (
        <div className="ml-4 mt-3 space-y-3 border-l border-border pl-3 md:ml-6 md:pl-4">
          {flatReplies.map((reply) => (
            <div key={reply.id} className="flex gap-1.5 text-xs">
              <CornerDownRight className="mt-1.5 size-3 shrink-0 text-zinc-700" />
              <div className="min-w-0 flex-1">
                <CommentBubble
                  comment={reply}
                  depth={1}
                  currentUserId={currentUserId}
                  replyingToId={replyingToId}
                  setReplyingToId={setReplyingToId}
                  // Replies always reply to the top-level comment id so the
                  // thread stays flat (like Facebook).
                  onAddComment={(text) => onAddComment(text, comment.id)}
                  onDelete={onDelete}
                  onEdit={onEdit}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Flatten helpers ────────────────────────────────────────────────────────────
function flattenReplies(replies: Comment[]): Comment[] {
  const result: Comment[] = [];
  const visit = (list: Comment[]) => {
    for (const r of list) {
      result.push(r);
      const children = r.replies || r.commentReplies || [];
      if (children.length) visit(children);
    }
  };
  visit(replies);
  return result;
}

// ── Comment Bubble ─────────────────────────────────────────────────────────────
function CommentBubble({
  comment,
  depth,
  currentUserId,
  replyingToId,
  setReplyingToId,
  onAddComment,
  onDelete,
  onEdit,
}: {
  comment: Comment;
  depth: number;
  currentUserId?: string;
  replyingToId: string | null;
  setReplyingToId: (id: string | null) => void;
  onAddComment: (text: string, parentId?: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onEdit?: (id: string, text: string) => Promise<void>;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(comment.text);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [replyText, setReplyText] = useState('');
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);

  const isReplying = replyingToId === comment.id;
  const canManage = isOwner(comment, currentUserId);

  const avatarSize = depth > 0 ? 'size-7 text-[10px] shrink-0' : 'size-9 text-xs shrink-0';
  const displayName = comment.author || comment.provider?.name || 'User';

  const handleDelete = async () => {
    if (isDeleting) return;
    setIsDeleting(true);
    try {
      await onDelete(comment.id);
    } catch {
      setIsDeleting(false);
    }
  };

  const handleSubmitReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || isSubmittingReply) return;
    setIsSubmittingReply(true);
    try {
      await onAddComment(replyText.trim(), comment.id);
      setReplyText('');
      setReplyingToId(null);
    } catch {
    } finally {
      setIsSubmittingReply(false);
    }
  };

  return (
    <div className="group/node text-sm">
      <div className="flex gap-3">
        {/* Avatar */}
        <div
          className={cn(
            'grid place-items-center rounded-full border border-border bg-surface-secondary font-black text-muted-foreground uppercase shadow-xs',
            avatarSize,
          )}
        >
          {displayName.substring(0, 2)}
        </div>

        {/* Content */}
        <div className="min-w-0 flex-1">
          <div className="rounded-lg border border-border/80 bg-surface px-3 py-2">
            {isEditing ? (
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  if (!editText.trim() || isSaving) return;
                  setIsSaving(true);
                  try {
                    if (onEdit) await onEdit(comment.id, editText.trim());
                    setIsEditing(false);
                  } catch {
                  } finally {
                    setIsSaving(false);
                  }
                }}
                className="mt-1"
              >
                <textarea
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  className="w-full min-h-15 resize-none bg-background border border-border rounded px-2 py-1 text-sm text-foreground outline-hidden focus:border-border"
                  disabled={isSaving}
                  autoFocus
                />
                <div className="flex justify-end gap-2 mt-2">
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={() => { setIsEditing(false); setEditText(comment.text); }}
                    className="h-7 text-xs text-muted-foreground hover:bg-surface-secondary/50 hover:text-foreground"
                    disabled={isSaving}
                  >
                    <X className="size-3 mr-1" /> Cancel
                  </Button>
                  <Button
                    type="submit"
                    size="sm"
                    className="h-7 bg-[#2995f3] px-3 text-xs font-bold text-primary-foreground hover:bg-[#1a85e2]"
                    disabled={!editText.trim() || isSaving}
                  >
                    {isSaving ? 'Saving…' : 'Save'}
                  </Button>
                </div>
              </form>
            ) : (
              <>
                <span className="mr-2 font-bold text-foreground">{displayName}</span>
                <span className="leading-relaxed wrap-break-word whitespace-pre-wrap text-muted-foreground">
                  {comment.text}
                </span>
              </>
            )}
          </div>

          {/* Action row */}
          {!isEditing && (
            <div className="mt-1.5 flex flex-wrap items-center gap-3 px-1 text-xs">
              <span className="font-medium text-caption-foreground">
                {formatCommentTime(comment.createdAt, comment.time)}
              </span>

              {/* Reply — visible to everyone */}
              <button
                onClick={() => {
                  setReplyingToId(isReplying ? null : comment.id);
                  setReplyText('');
                }}
                className="inline-flex items-center gap-1 font-bold text-[#2995f3] transition-colors duration-150 hover:text-[#1a85e2]"
              >
                <Reply className="size-3" />
                reply
              </button>

              {/* ── Owner-only: Edit & Delete ── */}
              {canManage && (
                <>
                  <button
                    onClick={() => { setIsEditing(true); setEditText(comment.text); }}
                    className="inline-flex items-center gap-1 font-bold text-caption-foreground transition-colors duration-150 hover:text-[#2995f3]"
                  >
                    <Pencil className="size-3" />
                    edit
                  </button>

                  <button
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="inline-flex items-center gap-1 font-bold text-caption-foreground transition-colors duration-150 hover:text-red-400 disabled:opacity-50"
                  >
                    <Trash2 className="size-3" />
                    {isDeleting ? 'deleting…' : 'delete'}
                  </button>
                </>
              )}
            </div>
          )}

          {/* Reply form */}
          {isReplying && (
            <form
              onSubmit={handleSubmitReply}
              className="mt-3 border border-border bg-surface p-2 focus-within:border-border rounded-md"
            >
              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder={`Reply to ${displayName}…`}
                className="min-h-15 w-full resize-none bg-transparent px-2 py-1 text-sm text-foreground outline-hidden placeholder:text-caption-foreground"
                disabled={isSubmittingReply}
                autoFocus
              />
              <div className="mt-1 flex justify-end gap-2 border-t border-border pt-2">
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={() => setReplyingToId(null)}
                  className="h-7 text-xs text-muted-foreground hover:bg-surface-secondary/50 hover:text-foreground"
                  disabled={isSubmittingReply}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  className="h-7 bg-[#2995f3] px-3 text-xs font-bold text-primary-foreground hover:bg-[#1a85e2]"
                  disabled={!replyText.trim() || isSubmittingReply}
                >
                  {isSubmittingReply ? 'Replying…' : 'Reply'}
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
