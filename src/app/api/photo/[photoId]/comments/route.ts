import { NextRequest, NextResponse } from 'next/server';
import { getPhoto } from '@/lib/mock/public-gallery-data';

// Simple in-memory storage for comments since this is a mock API
interface Comment {
  id: string;
  author: string;
  text: string;
  time: string;
  parentId?: string; // Optional parent comment ID for replies
  replies?: Comment[];
}

const commentsCache: Record<string, Comment[]> = {};

// Helper to initialize cache for a photo
function getCommentsForPhoto(photoId: string): Comment[] {
  if (commentsCache[photoId]) {
    return commentsCache[photoId];
  }
  
  const photo = getPhoto(photoId);
  if (!photo) return [];

  // Convert simple mock comments to our schema with support for replies
  const defaultComments: Comment[] = (photo.comments || []).map((c) => ({
    id: c.id,
    author: c.author,
    text: c.text,
    time: c.time,
    replies: [],
  }));

  commentsCache[photoId] = defaultComments;
  return defaultComments;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ photoId: string }> }
) {
  const { photoId } = await params;
  const comments = getCommentsForPhoto(photoId);
  return NextResponse.json({ comments });
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ photoId: string }> }
) {
  const { photoId } = await params;
  
  try {
    const body = await request.json();
    const { author, text, parentId } = body;

    if (!author || !text) {
      return NextResponse.json(
        { message: 'Author and text are required fields.' },
        { status: 400 }
      );
    }

    const comments = getCommentsForPhoto(photoId);

    const newComment: Comment = {
      id: crypto.randomUUID(),
      author,
      text,
      time: 'just now',
      parentId,
      replies: [],
    };

    if (parentId) {
      // Find the parent comment and add the reply to its list
      const parentComment = findCommentById(comments, parentId);
      if (parentComment) {
        if (!parentComment.replies) {
          parentComment.replies = [];
        }
        parentComment.replies.push(newComment);
      } else {
        // Fallback: If parent comment not found, add it as a top-level comment
        comments.push(newComment);
      }
    } else {
      // Add as top-level comment
      comments.push(newComment);
    }

    commentsCache[photoId] = comments;
    return NextResponse.json({ success: true, comment: newComment, comments });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || 'Failed to submit comment.' },
      { status: 500 }
    );
  }
}

// Helper to recursively find a comment by ID
function findCommentById(comments: Comment[], id: string): Comment | null {
  for (const comment of comments) {
    if (comment.id === id) {
      return comment;
    }
    if (comment.replies && comment.replies.length > 0) {
      const found = findCommentById(comment.replies, id);
      if (found) return found;
    }
  }
  return null;
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ photoId: string }> }
) {
  const { photoId } = await params;
  const searchParams = request.nextUrl.searchParams;
  const commentId = searchParams.get('commentId');

  if (!commentId) {
    return NextResponse.json(
      { message: 'Comment ID is required.' },
      { status: 400 }
    );
  }

  try {
    let comments = getCommentsForPhoto(photoId);
    comments = deleteCommentById(comments, commentId);
    commentsCache[photoId] = comments;
    return NextResponse.json({ success: true, comments });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || 'Failed to delete comment.' },
      { status: 500 }
    );
  }
}

// Helper to recursively delete a comment by ID from comments array
function deleteCommentById(comments: Comment[], id: string): Comment[] {
  // Filter out the comment if it matches the ID
  const filtered = comments.filter((c) => c.id !== id);
  
  // For the remaining comments, recursively filter their replies
  return filtered.map((c) => {
    if (c.replies && c.replies.length > 0) {
      return {
        ...c,
        replies: deleteCommentById(c.replies, id),
      };
    }
    return c;
  });
}

