import type { CommentData } from './store/types';

const fetchData = async (): Promise<CommentData> => {
  const response = await fetch('./data.json');

  if (!response.ok) {
    throw new Error('Failed to fetch data');
  }

  return await response.json();
};

export const dataPromise = fetchData();
