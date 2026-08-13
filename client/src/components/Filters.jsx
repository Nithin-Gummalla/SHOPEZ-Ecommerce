import React from 'react';
import { Filter, RotateCcw } from 'lucide-react';

const Filters = ({
  categories = [],
  selectedCategory,
  onSelectCategory,
  minPrice,
  maxPrice,
  onChangeMinPrice,
  onChangeMaxPrice,
  sortOption,
  onSelectSort,
  onResetFilters
}) => {
  return (
    <div className="bg-white p-3 p-md-4 rounded-3 border shadow-sm mb-4">
      <div className="d-flex align-items-center justify-content-between mb-3 pb-2 border-bottom">
        <h6 className="fw-bold m-0 d-flex align-items-center gap-2">
          <Filter size={18} className="text-primary" /> Filter & Sort Products
        </h6>
        <button
          className="btn btn-sm btn-link text-decoration-none text-muted p-0 d-flex align-items-center gap-1"
          onClick={onResetFilters}
        >
          <RotateCcw size={14} /> Reset All
        </button>
      </div>

      <div className="row g-3 align-items-end">
        {/* Category Selector */}
        <div className="col-12 col-md-4">
          <label className="form-label fw-semibold small text-secondary">Category</label>
          <select
            className="form-select form-select-sm rounded-2"
            value={selectedCategory || 'All'}
            onChange={(e) => onSelectCategory(e.target.value)}
          >
            <option value="All">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Price Filter */}
        <div className="col-12 col-md-4">
          <label className="form-label fw-semibold small text-secondary">Price Range ($)</label>
          <div className="d-flex align-items-center gap-2">
            <input
              type="number"
              className="form-control form-control-sm rounded-2"
              placeholder="Min"
              value={minPrice}
              onChange={(e) => onChangeMinPrice(e.target.value)}
              min="0"
            />
            <span className="text-muted">-</span>
            <input
              type="number"
              className="form-control form-control-sm rounded-2"
              placeholder="Max"
              value={maxPrice}
              onChange={(e) => onChangeMaxPrice(e.target.value)}
              min="0"
            />
          </div>
        </div>

        {/* Sort Option */}
        <div className="col-12 col-md-4">
          <label className="form-label fw-semibold small text-secondary">Sort By</label>
          <select
            className="form-select form-select-sm rounded-2"
            value={sortOption || 'newest'}
            onChange={(e) => onSelectSort(e.target.value)}
          >
            <option value="newest">Newest Arrivals</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
            <option value="discount">Biggest Discounts</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default Filters;
