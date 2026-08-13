import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

const ErrorMessage = ({ message = 'Something went wrong', onRetry }) => {
  return (
    <div className="alert alert-danger rounded-3 p-4 shadow-sm border-0 d-flex align-items-center justify-content-between my-3">
      <div className="d-flex align-items-center gap-3">
        <AlertTriangle size={24} className="text-danger flex-shrink-0" />
        <div>
          <h6 className="fw-bold mb-1">Error Occurred</h6>
          <p className="mb-0 text-secondary small">{message}</p>
        </div>
      </div>
      {onRetry && (
        <button className="btn btn-outline-danger btn-sm d-flex align-items-center gap-1 rounded-2" onClick={onRetry}>
          <RefreshCw size={14} /> Retry
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;
