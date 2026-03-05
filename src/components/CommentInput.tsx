import { useState, type SubmitEventHandler } from 'react';

import { useCommentStore } from '../store';
import type { User } from '../types';

type Props = {
  parentId?: number;
  replyingTo?: string;
  onSuccess?: () => void;
  currentUser: User | null | undefined;
};

const CommentInput = ({ parentId, replyingTo, onSuccess, currentUser }: Props) => {
  const [text, setText] = useState('');
  const { addComment, addReply } = useCommentStore();

  const mode = parentId && replyingTo ? 'reply' : 'comment';

  const actions = {
    reply: () => addReply(parentId!, text.trim(), replyingTo!),
    comment: () => addComment(text.trim()),
  } as const;

  const labels = {
    reply: 'Reply',
    comment: 'Send',
  } as const;

  const handleSubmit: SubmitEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();

    const next = text.trim();

    if (!next) return;

    actions[mode]();

    setText('');
    onSuccess?.();
  };

  if (!currentUser) return null;

  return (
    <form onSubmit={handleSubmit} className="bg-white p-5 rounded-xl flex gap-4 shadow-xs items-start">
      <img src={currentUser.image.webp} alt="" className="w-10 h-10" />

      <textarea
        className="flex-1 border border-slate-200 rounded-xl p-3 h-24 focus:border-indigo-500 outline-none resize-none"
        placeholder="Add a comment..."
        value={text}
        onChange={(event) => setText(event.target.value)}
      />

      <button
        type="submit"
        className="bg-indigo-700 font-medium cursor-pointer text-white px-6 py-3 rounded-4xl hover:opacity-50 transition-opacity uppercase"
      >
        {labels[mode]}
      </button>
    </form>
  );
};

export default CommentInput;
