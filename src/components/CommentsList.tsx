import { use, useEffect } from 'react';

import { useCommentStore } from '../store';
import { dataPromise } from '../api';

import CommentItem from './comment-item/CommentItem';
import CommentInput from './CommentInput';

const CommentsList = () => {
  const initialData = use(dataPromise);
  const { data, syncData } = useCommentStore();

  useEffect(() => syncData(initialData), [initialData, syncData]);

  if (!data) return null;

  const { comments, currentUser } = data;

  return (
    <div className='max-w-3xl mx-auto p-4 space-y-4'>
      {comments.map(comment => (
        <CommentItem key={comment.id} comment={comment} />
      ))}

      <CommentInput currentUser={currentUser} />
    </div>
  );
};

export default CommentsList;
