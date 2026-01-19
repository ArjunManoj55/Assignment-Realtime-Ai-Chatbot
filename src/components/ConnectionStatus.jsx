// src/components/ConnectionStatus.jsx
import React from 'react';

export default function ConnectionStatus({ connected }) {
  return (
    <div className="mb-2 text-sm">
      Status:{' '}
      <span className={connected ? 'text-green-500 font-semibold' : 'text-red-500 font-semibold'}>
        {connected ? 'Connected' : 'Disconnected'}
      </span>
    </div>
  );
}
