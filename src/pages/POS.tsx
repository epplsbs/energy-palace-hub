
import { useEffect } from 'react';

const POS = () => {
  useEffect(() => {
    // Redirect to the HTML POS system
    window.location.href = '/pos.html';
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading POS System...</p>
      </div>
    </div>
  );
};

export default POS;
