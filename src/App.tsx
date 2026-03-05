import { Suspense } from "react";

import CommentsList from "./components/CommentsList";

const App = () => {
  return (
    <main className='min-h-screen bg-slate-100 py-10'>
      <Suspense fallback={<p className='text-center'>Loading...</p>}>
        <CommentsList />
      </Suspense>
    </main>
  );
}

export default App;
