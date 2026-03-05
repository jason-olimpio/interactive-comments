type DeleteAlertProps = {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

const DeleteAlert = ({ open, onCancel, onConfirm }: DeleteAlertProps) => {
  if (!open) return null;

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center px-4'>
      <div
        className='absolute inset-0 bg-black/50'
        onClick={onCancel}
        aria-hidden='true'
      />

      <div
        role='dialog'
        aria-modal='true'
        aria-labelledby='delete-title'
        className='relative w-full max-w-sm rounded-4xl bg-white p-6 shadow-lg'
      >
        <h2 id='delete-title' className='text-lg font-bold text-slate-800'>
          Delete comment
        </h2>

        <p className='mt-3 text-slate-500'>
          Are you sure you want to delete this comment? This will remove the
          comment and can’t be undone.
        </p>

        <div className='mt-5 grid grid-cols-2 gap-3'>
          <button
            type='button'
            onClick={onCancel}
            className='rounded-4xl bg-slate-500 px-4 py-3 font-medium text-white uppercase hover:opacity-70'
          >
            No, cancel
          </button>

          <button
            type='button'
            onClick={onConfirm}
            className='rounded-4xl bg-red-400 px-4 py-3 font-medium text-white uppercase hover:opacity-70'
          >
            Yes, delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteAlert;
