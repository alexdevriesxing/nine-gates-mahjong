import React from 'react';

export default function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4" aria-label="Loading...">
      <div className="tile-spinner" />
      <div className="text-gold font-display tracking-widest uppercase text-sm animate-pulse">Loading</div>
    </div>
  );
}
