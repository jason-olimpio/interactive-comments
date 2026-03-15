import type { Comment } from './types';

export const nowISO = () => new Date().toISOString();

export const normalizeComments = (items: Comment[] = []): Comment[] =>
  items.map(item => ({
    ...item,
    replies: normalizeComments(item.replies ?? [])
  }));

export const findComment = (
  id: number,
  items: Comment[]
): Comment | undefined => {
  for (const item of items) {
    if (item.id === id) return item;

    const found = findComment(id, item.replies ?? []);

    if (found) return found;
  }

  return undefined;
};

export const filterComments = (
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
