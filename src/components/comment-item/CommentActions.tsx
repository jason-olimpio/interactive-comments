type CommentActionsProps = {
  canModify: boolean;
  isReplying: boolean;
  onToggleReply: () => void;
  onEdit: () => void;
  onDelete: () => void;
};

const CommentActions = ({
  canModify,
  isReplying,
  onToggleReply,
  onEdit,
  onDelete
}: CommentActionsProps) => {
  if (canModify)
    return (
      <div className='flex items-center gap-4'>
        <button
          onClick={onDelete}
          className='text-red-400 font-medium hover:opacity-50 flex gap-2 cursor-pointer'
        >
          <img className="object-contain" src="images/icon-delete.svg" alt="Delete"/>
          Delete
        </button>

        <button
          onClick={onEdit}
          className='text-indigo-700 font-medium hover:opacity-50 flex gap-2 cursor-pointer'
        >
          <img className="object-contain" src="images/icon-edit.svg" alt="Edit"/>
          Edit
        </button>
      </div>
    );

  return (
    <button
      onClick={onToggleReply}
      className='text-indigo-700 font-medium hover:opacity-50 flex gap-2 cursor-pointer'
    >
      <img className="object-contain" src="images/icon-reply.svg" alt="Reply"/>
      {isReplying ? 'Close' : 'Reply'}
    </button>
  );
};

export default CommentActions;
