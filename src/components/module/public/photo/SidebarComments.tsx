'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { CornerDownRight, MessageSquare, Reply } from 'lucide-react';
import { cn } from '@/utils/cn';

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
      <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-4">
        Comments ({countAllComments(comments)})
      </h4>

      {/* Main Comment Box */}
      <form onSubmit={handleSubmitComment} className="mb-6">
        <div className="relative border border-zinc-200 bg-zinc-50 p-2 focus-within:border-zinc-300">
          <textarea
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Write a comment"
            className="min-h-[80px] w-full resize-none bg-transparent px-2 py-1 text-sm text-zinc-800 outline-hidden placeholder:text-zinc-400"
            disabled={isSubmitting}
          />
          <div className="mt-2 flex justify-end border-t border-zinc-100 pt-2">
            <Button
              type="submit"
              size="sm"
              className="bg-[#2995f3] hover:bg-[#1a85e2] text-white text-xs font-bold px-5 h-8 transition-colors duration-200"
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
          <p className="text-center text-xs font-medium text-zinc-400 py-4">
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
        <div className="grid size-9 shrink-0 place-items-center rounded-full bg-zinc-100 border border-zinc-200 text-xs font-black text-zinc-600 uppercase shadow-xs">
          {comment.author.substring(0, 2)}
        </div>

        {/* Comment Contents */}
        <div className="flex-1">
          <div className="bg-zinc-50/65 rounded-lg px-3 py-2 border border-zinc-100">
            <span className="font-bold text-zinc-800 mr-2">{comment.author}</span>
            <span className="text-zinc-600 leading-relaxed break-words">{comment.text}</span>
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
              className="inline-flex items-center gap-1 font-bold text-[#2995f3] hover:text-[#1a85e2] transition-colors duration-150"
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
                className="min-h-[60px] w-full resize-none bg-transparent px-2 py-1 text-sm text-zinc-800 outline-hidden placeholder:text-zinc-400"
                disabled={isSubmitting}
                autoFocus
              />
              <div className="mt-1 flex justify-end gap-2 border-t border-zinc-100 pt-2">
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={() => setReplyingToId(null)}
                  className="text-xs h-7 text-zinc-400 hover:text-zinc-600"
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  className="bg-[#2995f3] hover:bg-[#1a85e2] text-white text-xs font-bold px-3 h-7"
                  disabled={!replyText.trim() || isSubmitting}
                >
                  Reply
                </Button>
              </div>
            </form>
          )}

          {/* Nested Replies Rendering */}
          {comment.replies && comment.replies.length > 0 && (
            <div className="mt-3 pl-4 border-l-2 border-zinc-100 space-y-4">
              {comment.replies.map((reply) => (
                <div key={reply.id} className="flex gap-2 text-xs">
                  <CornerDownRight className="size-4 shrink-0 text-zinc-300 mt-1" />
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
