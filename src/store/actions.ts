import type { Vote, CommentStore } from './types';
import {
  nowISO,
  normalizeComments,
  findComment,
  filterComments,
} from './utils';

type SetFn = Parameters<
  Parameters<typeof import('zustand/middleware/immer').immer>[0]
>[0];

export const createCommentActions = (set: SetFn) => ({
  syncData: (fetchedData: NonNullable<CommentStore['data']>) =>
    set((state: CommentStore) => {
      const { comments = [], ...rest } = fetchedData;

      const normalized = {
        ...rest,
        comments: normalizeComments(comments),
      };

      if (!state.data) {
        state.data = normalized;
        return;
      }

      state.data.currentUser = normalized.currentUser;
      state.data.comments = normalizeComments(state.data.comments ?? []);
    }),

  addComment: (content: string) =>
    set((state: CommentStore) => {
      if (!state.data) return;

      state.data.comments ??= [];
      state.data.comments.push({
        id: Date.now(),
        content,
        createdAt: nowISO(),
        score: 0,
        user: state.data.currentUser,
        replies: [],
      });
    }),

  addReply: (parentId: number, content: string, replyingTo: string) =>
    set((state: CommentStore) => {
      if (!state.data) return;

      const parent = findComment(parentId, state.data.comments ?? []);
      
      if (!parent) return;

      parent.replies ??= [];
      parent.replies.push({
        id: Date.now(),
        content,
        createdAt: nowISO(),
        score: 0,
        replyingTo,
        user: state.data.currentUser,
        replies: [],
      });
    }),

  toggleUpvote: (id: number) =>
    set((state: CommentStore) => {
      const comment = findComment(id, state.data?.comments ?? []);
      const current = state.votesById[id] || 0;

      if (!comment || current === 1) return;

      const next = (current + 1) as Vote;
      comment.score += next - current;
      state.votesById[id] = next;

      if (next === 0) delete state.votesById[id];
    }),

  toggleDownvote: (id: number) =>
    set((state: CommentStore) => {
      const comment = findComment(id, state.data?.comments ?? []);
      const current = state.votesById[id] || 0;

      if (!comment || current === -1) return;

      const next = (current - 1) as Vote;
      comment.score += next - current;
      state.votesById[id] = next;

      if (next === 0) delete state.votesById[id];
    }),

  editComment: (id: number, content: string) =>
    set((state: CommentStore) => {
      if (!state.data) return;

      const comment = findComment(id, state.data.comments ?? []);
      const isOwner =
        comment?.user.username === state.data.currentUser.username;

      if (!comment || !isOwner) return;

      comment.content = content;
      comment.createdAt = nowISO();
    }),

  deleteComment: (id: number) =>
    set((state: CommentStore) => {
      if (!state.data) return;

      state.data.comments = filterComments(
        id,
        state.data.comments ?? [],
        state.data.currentUser.username
      );

      delete state.votesById[id];
    }),
});
