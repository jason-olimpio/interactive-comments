type CommentBodyProps = {
  isEditing: boolean;
  draft: string;
  content: string;
  replyingTo?: string;
  onChangeDraft: (value: string) => void;
  onCancel: () => void;
  onSave: () => void;
};

const CommentBody = ({
  isEditing,
  draft,
  content,
  replyingTo,
  onChangeDraft,
  onCancel,
  onSave
}: CommentBodyProps) => {
  if (isEditing)
    return (
      <div className='space-y-3'>
        <textarea
          value={draft}
          onChange={event => onChangeDraft(event.target.value)}
          className='w-full border border-slate-200 outline-none focus:border-indigo-500 rounded-lg py-3 px-5 mt-2'
          rows={4}
        />

        <div className='flex justify-end gap-3'>
          <button
            type='button'
            onClick={onCancel}
            className='border border-indigo-700 text-indigo-700 font-medium cursor-pointer px-6 py-3 rounded-4xl hover:opacity-50 transition-opacity uppercase'
          >
            Cancel
          </button>

          <button
            type='button'
            onClick={onSave}
            className='bg-indigo-700 font-medium cursor-pointer text-white px-6 py-3 rounded-4xl hover:opacity-50 transition-opacity uppercase'
          >
            Update
          </button>
        </div>
      </div>
    );

  return (
    <p className='text-slate-500 leading-relaxed mt-4'>
      {replyingTo && (
        <span className='text-indigo-700 font-bold mr-2'>@{replyingTo}</span>
      )}

      {content}
    </p>
  );
};

export default CommentBody;
