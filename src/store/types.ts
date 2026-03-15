export type Comment = {
  id: number;
  content: string;
  createdAt: string;
  score: number;
  user: User;
  replies: Comment[];
  replyingTo?: string;
}

export type User = {
  image: {
    png: string;
    webp: string;
  };
  username: string;
}

export type CommentStore = CommentState & CommentActions;

export type CommentState = {
  data: CommentData | null;
  votesById: Record<number, Vote>;
}

export type CommentActions = {
  syncData: (fetchedData: CommentData) => void;
  addComment: (content: string) => void;
  addReply: (parentId: number, content: string, replyingTo: string) => void;
  toggleUpvote: (id: number) => void;
  toggleDownvote: (id: number) => void;
  editComment: (id: number, content: string) => void;
  deleteComment: (id: number) => void;
}

export type CommentData = {
  currentUser: User;
  comments: Comment[];
}

export type Vote = -1 | 0 | 1;
