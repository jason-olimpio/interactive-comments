import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import type { CommentStore, Comment, Vote } from './types';

const nowISO = () => new Date().toISOString();

const normalizeComments = (items: Comment[] = []): Comment[] =>
  items.map(item => ({
    ...item,
    replies: normalizeComments(item.replies ?? [])
  }));

const findComment = (id: number, items: Comment[]): Comment | undefined => {
  for (const item of items) {
    if (item.id === id) return item;

    const found = findComment(id, item.replies ?? []);
    
    if (found) return found;
  }

  return undefined;
};

const filterComments = (
  id: number,
  items: Comment[],
  username: string
): Comment[] =>
  items
    .filter(comment => comment.id !== id || comment.user.username !== username)
    .map(comment => ({
      ...comment,
      replies: filterComments(id, comment.replies ?? [], username)
    }));

export const useCommentStore = create<CommentStore>()(
  persist(
    immer(set => ({
      data: null,
      votesById: {},

      syncData: fetchedData =>
        set(state => {
          const normalized = {
            ...fetchedData,
            comments: normalizeComments(fetchedData.comments ?? [])
          };

          if (!state.data) {
            state.data = normalized;
            return;
          }

          state.data.currentUser = normalized.currentUser;
          state.data.comments = normalizeComments(state.data.comments ?? []);
        }),

      addComment: content =>
        set(state => {
          if (!state.data) return;

          state.data.comments ??= [];
          state.data.comments.push({
            id: Date.now(),
            content,
            createdAt: nowISO(),
            score: 0,
            user: state.data.currentUser,
            replies: []
          });
        }),

      addReply: (parentId, content, replyingTo) =>
        set(state => {
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
            replies: []
          });
        }),

      toggleUpvote: id =>
        set(state => {
          const comment = findComment(id, state.data?.comments ?? []);
          const current = state.votesById[id] || 0;

          if (!comment || current === 1) return;

          const next = (current + 1) as Vote;
          comment.score += next - current;
          state.votesById[id] = next;

          if (next === 0) delete state.votesById[id];
        }),

      toggleDownvote: id =>
        set(state => {
          const comment = findComment(id, state.data?.comments ?? []);
          const current = state.votesById[id] || 0;

          if (!comment || current === -1) return;

          const next = (current - 1) as Vote;
          comment.score += next - current;
          state.votesById[id] = next;

          if (next === 0) delete state.votesById[id];
        }),

      editComment: (id, content) =>
        set(state => {
          if (!state.data) return;

          const comment = findComment(id, state.data.comments ?? []);
          const isOwner =
            comment?.user.username === state.data.currentUser.username;

          if (!comment || !isOwner) return;

          comment.content = content;
          comment.createdAt = nowISO();
        }),

      deleteComment: id =>
        set(state => {
          if (!state.data) return;

          state.data.comments = filterComments(
            id,
            state.data.comments ?? [],
            state.data.currentUser.username
          );

          delete state.votesById[id];
        })
    })),
    {
      name: 'comment-storage',
      version: 1,
      storage: createJSONStorage(() => localStorage),

      partialize: state => ({
        data: state.data,
        votesById: state.votesById
      }),

      migrate: (persistedState, version) => {
        if (!persistedState) {
          return { data: null, votesById: {} };
        }

        const state = persistedState as {
          data: CommentStore['data'];
          votesById: Record<number, Vote>;
        };

        if (version === 0 || version === undefined) {
          return {
            ...state,
            data: state.data
              ? {
                  ...state.data,
                  comments: normalizeComments(state.data.comments ?? [])
                }
              : null,
            votesById: state.votesById ?? {}
          };
        }

        return {
          ...state,
          data: state.data
            ? {
                ...state.data,
                comments: normalizeComments(state.data.comments ?? [])
              }
            : null,
          votesById: state.votesById ?? {}
        };
      }
    }
  )
);
