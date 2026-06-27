'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/utils/cn';
import { CornerDownRight, Reply, Trash2 } from 'lucide-react';
import { useState } from 'react';

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
  replies?: Comment[];
  commentReplies?: Comment[];
}

interface SidebarCommentsProps {
  photoId: string;
  comments: Comment[];
  onAddComment: (text: string, parentId?: string) => Promise<void>;
  onDeleteComment: (commentId: string) => Promise<void>;
  onEditComment?: (commentId: string, text: string) => Promise<void>;
  isLoading?: boolean;
}

// ── Helper: Format date/time properly ──────────────────────────────────────
function formatCommentTime(createdAtStr?: string, timeStr?: string): string {
  if (timeStr && !timeStr.includes('T') && !timeStr.includes('-')) {
    return timeStr;
  }
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

  if (diffSec < 60) {
    return 'just now';
  } else if (diffMin < 60) {
    return `${diffMin}m ago`;
  } else if (diffHr < 24) {
    return `${diffHr}h ago`;
  } else if (diffDays < 7) {
    return `${diffDays}d ago`;
  } else {
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  }
}

export function SidebarComments({
  photoId,
  comments,
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
    <section className="bg-zinc-950 p-6 text-zinc-100">
      <h4 className="mb-4 text-xs font-bold tracking-wider text-zinc-400 uppercase">
        Comments ({countAllComments(comments)})
      </h4>

      {/* Main Comment Box */}
      <form onSubmit={handleSubmitComment} className="mb-6">
        <div className="relative rounded-md border border-zinc-800 bg-zinc-900 p-2 focus-within:border-zinc-700">
          <textarea
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Write a comment"
            className="min-h-20 w-full resize-none bg-transparent px-2 py-1 text-sm text-zinc-100 outline-hidden placeholder:text-zinc-500"
            disabled={isSubmitting || isLoading}
          />
          <div className="mt-2 flex justify-end border-t border-zinc-800 pt-2">
            <Button
              type="submit"
              size="sm"
              className="bg-primary hover:bg-primary/90 h-8 rounded-sm px-5 text-xs font-medium text-white transition-colors duration-200"
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
                <div className="size-9 shrink-0 rounded-full bg-zinc-800" />
                <div className="flex-1 space-y-1.5">
                  <div className="h-3.5 w-24 rounded bg-zinc-800" />
                  <div className="h-5 w-full rounded bg-zinc-900" />
                </div>
              </div>
            ))}
          </div>
        ) : comments.length === 0 ? (
          <p className="py-4 text-center text-xs font-medium text-zinc-500">
            No comments yet. Be the first to comment!
          </p>
        ) : (
          comments.map((comment) => (
            <CommentNode
              key={comment.id}
              comment={comment}
              depth={0}
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

// Recursive Comment Node Component
function CommentNode({
  comment,
  depth,
  replyingToId,
  setReplyingToId,
  onAddComment,
  onDelete,
  onEdit,
}: {
  comment: Comment;
  depth: number;
  replyingToId: string | null;
  setReplyingToId: (id: string | null) => void;
  onAddComment: (text: string, parentId?: string) => Promise<void>;
  onDelete: (commentId: string) => Promise<void>;
  onEdit?: (commentId: string, text: string) => Promise<void>;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(comment.text);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [replyText, setReplyText] = useState('');
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);

  const isReplying = replyingToId === comment.id;

  const handleDelete = async () => {
    if (isDeleting) return;
    setIsDeleting(true);
    try {
      await onDelete(comment.id);
    } catch (err) {
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
    } catch (err) {
    } finally {
      setIsSubmittingReply(false);
    }
  };

  // Restrict avatar circle size depending on deep levels
  const avatarSize = depth > 0 ? 'size-7 text-[10px] shrink-0' : 'size-9 text-xs shrink-0';

  return (
    <div className="group/node text-sm">
      <div className="flex gap-3">
        {/* Author Avatar Initial Placeholder */}
        <div
          className={cn(
            'grid place-items-center rounded-full border border-zinc-700 bg-zinc-800 font-black text-zinc-300 uppercase shadow-xs',
            avatarSize,
          )}
        >
          {(comment.author || comment.provider?.name || 'User').substring(0, 2)}
        </div>

        {/* Comment Contents */}
        <div className="min-w-0 flex-1">
          <div className="rounded-lg border border-zinc-800/80 bg-zinc-900 px-3 py-2">
            {isEditing ? (
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  if (!editText.trim() || isSaving) return;
                  setIsSaving(true);
                  try {
                    if (onEdit) {
                      await onEdit(comment.id, editText.trim());
                    }
                    setIsEditing(false);
                  } catch (err) {
                  } finally {
                    setIsSaving(false);
                  }
                }}
                className="mt-1"
              >
                <textarea
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  className="w-full min-h-15 resize-none bg-zinc-950 border border-zinc-800 rounded px-2 py-1 text-sm text-zinc-100 outline-hidden focus:border-zinc-700"
                  disabled={isSaving}
                />
                <div className="flex justify-end gap-2 mt-2">
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      setIsEditing(false);
                      setEditText(comment.text);
                    }}
                    className="h-7 text-xs text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200"
                    disabled={isSaving}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    size="sm"
                    className="h-7 bg-[#2995f3] px-3 text-xs font-bold text-white hover:bg-[#1a85e2]"
                    disabled={!editText.trim() || isSaving}
                  >
                    {isSaving ? 'Saving...' : 'Save'}
                  </Button>
                </div>
              </form>
            ) : (
              <>
                <span className="mr-2 font-bold text-zinc-100">
                  {comment.author || comment.provider?.name || 'User'}
                </span>
                <span className="leading-relaxed wrap-break-word whitespace-pre-wrap text-zinc-300">
                  {comment.text}
                </span>
              </>
            )}
          </div>

          <div className="mt-1.5 flex items-center gap-3 px-1 text-xs">
            <span className="font-medium text-zinc-500">
              {formatCommentTime(comment.createdAt, comment.time)}
            </span>

            {!isEditing && (
              <button
                onClick={() => {
                  if (isReplying) {
                    setReplyingToId(null);
                  } else {
                    setReplyingToId(comment.id);
                    setReplyText('');
                  }
                }}
                className="inline-flex items-center gap-1 font-bold text-[#2995f3] transition-colors duration-150 hover:text-[#1a85e2]"
              >
                <Reply className="size-3" />
                reply
              </button>
            )}

            {!isEditing && (
              <button
                onClick={() => {
                  setIsEditing(true);
                  setEditText(comment.text);
                }}
                className="inline-flex items-center gap-1 font-bold text-zinc-500 transition-colors duration-150 hover:text-[#2995f3]"
              >
                edit
              </button>
            )}

            {!isEditing && (
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="inline-flex items-center gap-1 font-bold text-zinc-500 transition-colors duration-150 hover:text-red-400 disabled:opacity-50"
              >
                <Trash2 className="size-3" />
                {isDeleting ? 'deleting...' : 'delete'}
              </button>
            )}
          </div>

          {/* Reply Form */}
          {isReplying && (
            <form
              onSubmit={handleSubmitReply}
              className="mt-3 border border-zinc-800 bg-zinc-900 p-2 focus-within:border-zinc-700"
            >
              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder={`Reply to ${comment.author || comment.provider?.name || 'User'}...`}
                className="min-h-15 w-full resize-none bg-transparent px-2 py-1 text-sm text-zinc-100 outline-hidden placeholder:text-zinc-500"
                disabled={isSubmittingReply}
                autoFocus
              />
              <div className="mt-1 flex justify-end gap-2 border-t border-zinc-800 pt-2">
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={() => setReplyingToId(null)}
                  className="h-7 text-xs text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200"
                  disabled={isSubmittingReply}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  className="h-7 bg-[#2995f3] px-3 text-xs font-bold text-white hover:bg-[#1a85e2]"
                  disabled={!replyText.trim() || isSubmittingReply}
                >
                  {isSubmittingReply ? 'Replying...' : 'Reply'}
                </Button>
              </div>
            </form>
          )}

          {/* Nested Replies Rendering */}
          {(comment.replies || comment.commentReplies || []).length > 0 && (
            <div
              className={cn(
                'mt-3 space-y-4',
                // Max padding indent of 2 levels, after that keep it flat to avoid layout compression
                depth < 2 ? 'border-l border-zinc-800 pl-3 md:pl-4' : 'border-l-0 pl-1.5',
              )}
            >
              {(comment.replies || comment.commentReplies || []).map((reply) => (
                <div key={reply.id} className="flex gap-1.5 text-xs">
                  {depth < 2 && (
                    <CornerDownRight className="mt-1.5 size-3 shrink-0 text-zinc-700" />
                  )}
                  <div className="min-w-0 flex-1">
                    <CommentNode
                      comment={reply}
                      depth={depth + 1}
                      replyingToId={replyingToId}
                      setReplyingToId={setReplyingToId}
                      onAddComment={onAddComment}
                      onDelete={onDelete}
                      onEdit={onEdit}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
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
