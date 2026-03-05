import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import type { CommentStore, Comment, Vote } from './types';

const findComment = (id: number, items: Comment[]): Comment | undefined => {
  for (const item of items) {
    if (item.id === id) return item;

    const found = findComment(id, item.replies || []);

    if (found) return found;
  }
};

const filterComments = (
  id: number,
  items: Comment[],
  username: string
): Comment[] =>
  items
    .filter(
      comment => comment.id !== id || comment.user.username !== username
    )
    .map(comment => ({
      ...comment,
      replies: filterComments(id, comment.replies || [], username)
    }));

const nowISO = () => new Date().toISOString();

export const useCommentStore = create<CommentStore>()(
  persist(
    immer(set => ({
      data: null,
      votesById: {},

      syncData: fetchedData =>
        set(state => {
          state.data = state.data ?? fetchedData;
        }),

      addComment: content =>
        set(({ data }) => {
          data?.comments.push({
            id: Date.now(),
            content,
            createdAt: nowISO(),
            score: 0,
            user: data.currentUser,
            replies: []
          });
        }),

      addReply: (parentId, content, replyingTo) =>
        set(({ data }) => {
          const parent = findComment(parentId, data?.comments || []);
          parent?.replies.push({
            id: Date.now(),
            content,
            createdAt: nowISO(),
            score: 0,
            replyingTo,
            user: data!.currentUser,
            replies: []
          });
        }),

      toggleUpvote: id =>
        set(state => {
          const comment = findComment(id, state.data?.comments || []);
          const current = state.votesById[id] || 0;
          if (!comment || current === 1) return;

          const next = (current + 1) as Vote;

          comment.score += next - current;

          state.votesById[id] = next;

          if (next === 0) delete state.votesById[id];
        }),

      toggleDownvote: id =>
        set(state => {
          const comment = findComment(id, state.data?.comments || []);
          const current = state.votesById[id] || 0;

          if (!comment || current === -1) return;

          const next = (current - 1) as Vote;
          comment.score += next - current;

          state.votesById[id] = next;

          if (next === 0) delete state.votesById[id];
        }),

      editComment: (id, content) =>
        set(({ data }) => {
          const comment = findComment(id, data?.comments || []);
          const isOwner = comment?.user.username === data?.currentUser.username;

          if (!comment || !isOwner) return;

          comment.content = content;
          comment.createdAt = nowISO();
        }),

      deleteComment: id =>
        set(state => {
          if (!state.data) return;

          state.data.comments = filterComments(
            id,
            state.data.comments,
            state.data.currentUser.username
          );

          delete state.votesById[id];
        })
    })),
    { name: 'comment-storage' }
  )
);
