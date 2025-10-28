// frontend/src/pages/test.tsx
import React from 'react';

const TestPage: React.FC = () => {
  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold text-blue-600 mb-4">Test Page</h1>
      <p className="mb-4">If Tailwind is working, the box below should be red.</p>
      <div className="bg-red-500 h-20 w-20 rounded-md shadow-lg"></div>
    </div>
  );
};

export default TestPage;