import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

import type { CommentStore } from './types';
import { createCommentActions } from './actions';
import { commentPersistOptions } from './persist';

export const useCommentStore = create<CommentStore>()(
  persist(
    immer((set) => ({
      data: null,
      votesById: {},
      ...createCommentActions(set),
    })),
    commentPersistOptions
  )
);
