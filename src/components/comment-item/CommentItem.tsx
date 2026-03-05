import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { useCommentStore } from '../../store';

import type { Comment } from '../../types';

import CommentInput from '../CommentInput';
import DeleteAlert from '../DeleteAlert';
import CommentActions from './CommentActions';
import CommentBody from './CommentBody';
import CommentReplies from './CommentReplies';
import ScoreBox from './ScoreBox';

type CommentItemProps = {
  comment: Comment;
};

const timeAgo = (value: string) => {
  const date = new Date(value);
  
  if (Number.isNaN(date.getTime())) return value;

  const diffInSeconds = Math.floor(
    (new Date().getTime() - date.getTime()) / 1000
  );

  if (diffInSeconds < 30) return 'just now';

  return formatDistanceToNow(date, { addSuffix: true });
};

const CommentItem = ({ comment }: CommentItemProps) => {
  const { id, content, createdAt, score, user, replies, replyingTo } = comment;
  const { toggleUpvote, toggleDownvote, data, editComment, deleteComment } =
    useCommentStore();

  const [isReplying, setIsReplying] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(content);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const isOwner = data?.currentUser?.username === user.username;

  const handleEdit = {
    start: () => {
      setDraft(content);
      setIsEditing(true);
    },
    cancel: () => {
      setDraft(content);
      setIsEditing(false);
    },
    save: () => {
      const next = draft.trim();

      if (!next) return;

      editComment(id, next);
      setIsEditing(false);
    }
  };

  const scoreControl = (
    <ScoreBox
      score={score}
      disabled={isOwner}
      onUpvote={() => toggleUpvote(id)}
      onDownvote={() => toggleDownvote(id)}
    />
  );

  const actionButtons = (
    <CommentActions
      canModify={isOwner}
      isReplying={isReplying}
      onToggleReply={() => setIsReplying(!isReplying)}
      onEdit={handleEdit.start}
      onDelete={() => setIsDeleteOpen(true)}
    />
  );

  return (
    <div className='space-y-4'>
      <section className='bg-white p-5 rounded-xl flex flex-col md:flex-row gap-5 shadow-xs'>
        <div className='hidden md:block'>{scoreControl}</div>

        <div className='flex-1 min-w-0'>
          <div className='flex items-center justify-between mb-2'>
            <div className='flex items-center gap-3 min-w-0'>
              <img src={user.image.webp} alt='' className='w-8 h-8' />
              <span className='font-bold text-slate-800 truncate'>
                {user.username}
              </span>

              {isOwner && (
                <span className='bg-indigo-700 text-white text-[11px] font-bold px-2 py-1 rounded'>
                  you
                </span>
              )}

              <span className='text-slate-500 whitespace-nowrap'>
                {timeAgo(createdAt)}
              </span>
            </div>

            <div className='hidden md:block'>{actionButtons}</div>
          </div>

          <CommentBody
            isEditing={isEditing}
            draft={draft}
            content={content}
            replyingTo={replyingTo}
            onChangeDraft={setDraft}
            onCancel={handleEdit.cancel}
            onSave={handleEdit.save}
          />

          <div className='mt-4 flex items-center justify-between md:hidden'>
            {scoreControl}
            {actionButtons}
          </div>
        </div>
      </section>

      {isReplying && (
        <CommentInput
          parentId={id}
          replyingTo={user.username}
          onSuccess={() => setIsReplying(false)}
          currentUser={data?.currentUser}
        />
      )}

      <CommentReplies replies={replies} />

      <DeleteAlert
        open={isDeleteOpen}
        onCancel={() => setIsDeleteOpen(false)}
        onConfirm={() => {
          deleteComment(id);
          setIsDeleteOpen(false);
        }}
      />
    </div>
  );
};

export default CommentItem;
