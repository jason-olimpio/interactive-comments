import { createJSONStorage } from 'zustand/middleware';

import type { Vote, CommentStore } from './types';
import { normalizeComments } from './utils';

export const commentPersistOptions = {
  name: 'comment-storage',
  version: 1,
  storage: createJSONStorage(() => localStorage),

  partialize: (state: CommentStore) => ({
    data: state.data,
    votesById: state.votesById,
  }),

  migrate: (persistedState: unknown) => {
    if (!persistedState) {
      return { data: null, votesById: {} };
    }

    const state = persistedState as {
      data: CommentStore['data'];
      votesById: Record<number, Vote>;
    };

    return {
      ...state,
      data: state.data
        ? {
            ...state.data,
            comments: normalizeComments(state.data.comments ?? []),
          }
        : null,
      votesById: state.votesById ?? {},
    };
  },
};
