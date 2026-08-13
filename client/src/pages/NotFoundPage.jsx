import React from 'react';
import { Link } from 'react-router-dom';
import { Home, SearchX } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <div className="container py-5 text-center my-5">
      <div className="bg-light text-primary rounded-circle d-inline-flex p-4 mb-3 shadow-sm">
        <SearchX size={64} />
      </div>
      <h1 className="display-4 fw-extrabold text-dark">404 - Page Not Found</h1>
      <p className="lead text-muted mb-4 max-w-md mx-auto">
        The page or product link you requested could not be found or has been moved.
      </p>
      <Link to="/" className="btn btn-primary-custom btn-lg rounded-pill px-4 shadow d-inline-flex align-items-center gap-2">
        <Home size={20} /> Return to Homepage
      </Link>
    </div>
  );
};

export default NotFoundPage;
