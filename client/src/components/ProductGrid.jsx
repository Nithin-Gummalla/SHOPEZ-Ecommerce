import React from 'react';
import ProductCard from './ProductCard';

const ProductGrid = ({ products }) => {
  if (!products || products.length === 0) {
    return (
      <div className="text-center py-5 my-4 bg-white rounded-3 border p-4">
        <h5 className="fw-bold text-dark">No products found</h5>
        <p className="text-muted small">Try adjusting your filters or search keywords.</p>
      </div>
    );
  }

  return (
    <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
      {products.map((product) => (
        <div className="col" key={product._id}>
          <ProductCard product={product} />
        </div>
      ))}
    </div>
  );
};

export default ProductGrid;
