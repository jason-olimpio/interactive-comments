type ScoreBoxProps = {
  score: number;
  disabled: boolean;
  onUpvote: () => void;
  onDownvote: () => void;
};

const ScoreBox = ({ score, disabled, onUpvote, onDownvote }: ScoreBoxProps) => (
  <div className='flex flex-row justify-end md:flex-col items-center bg-slate-100 p-3.5 rounded-xl h-fit w-fit gap-4'>
    <button onClick={onUpvote} className='cursor-pointer' disabled={disabled}>
      <img className='object-contain' src='images/icon-plus.svg' alt='Plus' />
    </button>

    <span className='text-indigo-700 font-bold'>{score}</span>

    <button onClick={onDownvote} className='cursor-pointer' disabled={disabled}>
      <img className='object-contain' src='images/icon-minus.svg' alt='Minus' />
    </button>
  </div>
);

export default ScoreBox;
