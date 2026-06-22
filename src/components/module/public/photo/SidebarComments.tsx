'use client';

import { Button } from '@/components/ui/button';
import { CornerDownRight, Reply } from 'lucide-react';
import { useState } from 'react';

export interface Comment {
  id: string;
  author: string;
  text: string;
  time: string;
  parentId?: string;
  replies?: Comment[];
}

interface SidebarCommentsProps {
  photoId: string;
  comments: Comment[];
  onAddComment: (text: string, parentId?: string) => Promise<void>;
}

export function SidebarComments({ photoId, comments, onAddComment }: SidebarCommentsProps) {
  const [commentText, setCommentText] = useState('');
  const [replyingToId, setReplyingToId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await onAddComment(commentText.trim());
      setCommentText('');
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitReply = async (e: React.FormEvent, parentId: string) => {
    e.preventDefault();
    if (!replyText.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await onAddComment(replyText.trim(), parentId);
      setReplyText('');
      setReplyingToId(null);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="border-b border-zinc-200 bg-white p-6">
      <h4 className="mb-4 text-xs font-bold tracking-wider text-zinc-400 uppercase">
        Comments ({countAllComments(comments)})
      </h4>

      {/* Main Comment Box */}
      <form onSubmit={handleSubmitComment} className="mb-6">
        <div className="relative border border-zinc-200 bg-zinc-50 p-2 focus-within:border-zinc-300">
          <textarea
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Write a comment"
            className="min-h-20 w-full resize-none bg-transparent px-2 py-1 text-sm text-zinc-800 outline-hidden placeholder:text-zinc-400"
            disabled={isSubmitting}
          />
          <div className="mt-2 flex justify-end border-t border-zinc-100 pt-2">
            <Button
              type="submit"
              size="sm"
              className="h-8 bg-[#2995f3] px-5 text-xs font-bold text-white transition-colors duration-200 hover:bg-[#1a85e2]"
              disabled={!commentText.trim() || isSubmitting}
            >
              {isSubmitting ? 'SUBMITTING...' : 'SUBMIT'}
            </Button>
          </div>
        </div>
      </form>

      {/* Comments List */}
      <div className="space-y-5">
        {comments.length === 0 ? (
          <p className="py-4 text-center text-xs font-medium text-zinc-400">
            No comments yet. Be the first to comment!
          </p>
        ) : (
          comments.map((comment) => (
            <CommentNode
              key={comment.id}
              comment={comment}
              replyingToId={replyingToId}
              setReplyingToId={setReplyingToId}
              replyText={replyText}
              setReplyText={setReplyText}
              onSubmitReply={handleSubmitReply}
              isSubmitting={isSubmitting}
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
  replyingToId,
  setReplyingToId,
  replyText,
  setReplyText,
  onSubmitReply,
  isSubmitting,
}: {
  comment: Comment;
  replyingToId: string | null;
  setReplyingToId: (id: string | null) => void;
  replyText: string;
  setReplyText: (text: string) => void;
  onSubmitReply: (e: React.FormEvent, parentId: string) => void;
  isSubmitting: boolean;
}) {
  const isReplying = replyingToId === comment.id;

  return (
    <div className="group/node text-sm">
      <div className="flex gap-3">
        {/* Author Avatar Initial Placeholder */}
        <div className="grid size-9 shrink-0 place-items-center rounded-full border border-zinc-200 bg-zinc-100 text-xs font-black text-zinc-600 uppercase shadow-xs">
          {comment.author.substring(0, 2)}
        </div>

        {/* Comment Contents */}
        <div className="flex-1">
          <div className="rounded-lg border border-zinc-100 bg-zinc-50/65 px-3 py-2">
            <span className="mr-2 font-bold text-zinc-800">{comment.author}</span>
            <span className="leading-relaxed wrap-break-word text-zinc-600">{comment.text}</span>
          </div>

          <div className="mt-1.5 flex items-center gap-3 px-1 text-xs">
            <span className="font-medium text-zinc-400">{comment.time}</span>

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
          </div>

          {/* Reply Form */}
          {isReplying && (
            <form
              onSubmit={(e) => onSubmitReply(e, comment.id)}
              className="mt-3 border border-zinc-200 bg-zinc-50 p-2 focus-within:border-zinc-300"
            >
              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder={`Reply to ${comment.author}...`}
                className="min-h-15 w-full resize-none bg-transparent px-2 py-1 text-sm text-zinc-800 outline-hidden placeholder:text-zinc-400"
                disabled={isSubmitting}
                autoFocus
              />
              <div className="mt-1 flex justify-end gap-2 border-t border-zinc-100 pt-2">
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={() => setReplyingToId(null)}
                  className="h-7 text-xs text-zinc-400 hover:text-zinc-600"
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  className="h-7 bg-[#2995f3] px-3 text-xs font-bold text-white hover:bg-[#1a85e2]"
                  disabled={!replyText.trim() || isSubmitting}
                >
                  Reply
                </Button>
              </div>
            </form>
          )}

          {/* Nested Replies Rendering */}
          {comment.replies && comment.replies.length > 0 && (
            <div className="mt-3 space-y-4 border-l-2 border-zinc-100 pl-4">
              {comment.replies.map((reply) => (
                <div key={reply.id} className="flex gap-2 text-xs">
                  <CornerDownRight className="mt-1 size-4 shrink-0 text-zinc-300" />
                  <div className="flex-1">
                    <CommentNode
                      comment={reply}
                      replyingToId={replyingToId}
                      setReplyingToId={setReplyingToId}
                      replyText={replyText}
                      setReplyText={setReplyText}
                      onSubmitReply={onSubmitReply}
                      isSubmitting={isSubmitting}
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
    if (comment.replies && comment.replies.length > 0) {
      count += countAllComments(comment.replies);
    }
  }
  return count;
}
