import CommentItem from './CommentItem';

import type { Comment } from '../../types';

type CommentRepliesProps = {
  replies?: Comment[];
};

const CommentReplies = ({ replies }: CommentRepliesProps) => {
  if (!replies?.length) return null;

  return (
    <div className='pl-4 md:pl-10 border-l-2 border-slate-200 ml-4 md:ml-10 space-y-4'>
      {replies.map(reply => (
        <CommentItem key={reply.id} comment={reply} />
      ))}
    </div>
  );
};

export default CommentReplies;
