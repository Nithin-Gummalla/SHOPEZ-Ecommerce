import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import API from '../services/api';
import ProductGrid from '../components/ProductGrid';
import Filters from '../components/Filters';
import Pagination from '../components/Pagination';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

const ProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [page, setPage] = useState(Number(searchParams.get('page')) || 1);
  const [pages, setPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);

  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'All');
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
  const [sortOption, setSortOption] = useState(searchParams.get('sort') || 'newest');
  const keyword = searchParams.get('keyword') || '';

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Sync state from URL query parameters
  useEffect(() => {
    const catFromUrl = searchParams.get('category');
    if (catFromUrl) setSelectedCategory(catFromUrl);
  }, [searchParams]);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      let queryParams = new URLSearchParams();
      if (keyword) queryParams.append('keyword', keyword);
      if (selectedCategory && selectedCategory !== 'All') queryParams.append('category', selectedCategory);
      if (minPrice) queryParams.append('minPrice', minPrice);
      if (maxPrice) queryParams.append('maxPrice', maxPrice);
      if (sortOption) queryParams.append('sort', sortOption);
      queryParams.append('page', page);
      queryParams.append('limit', 8);

      const response = await API.get(`/products?${queryParams.toString()}`);
      setProducts(response.data.products || []);
      setPage(response.data.page || 1);
      setPages(response.data.pages || 1);
      setTotalProducts(response.data.totalProducts || 0);
      setCategories(response.data.categories || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, minPrice, maxPrice, sortOption, keyword, page]);

  const handleResetFilters = () => {
    setSelectedCategory('All');
    setMinPrice('');
    setMaxPrice('');
    setSortOption('newest');
    setPage(1);
    setSearchParams({});
  };

  return (
    <div className="container py-4">
      {/* Title Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 pb-2 border-bottom">
        <div>
          <h2 className="fw-extrabold text-dark mb-1">
            {keyword ? `Search Results for "${keyword}"` : selectedCategory !== 'All' ? `${selectedCategory} Catalog` : 'All Products'}
          </h2>
          <p className="text-muted small mb-0">
            Showing {products.length} of {totalProducts} products
          </p>
        </div>
      </div>

      {/* Filter Controls Bar */}
      <Filters
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={(cat) => { setSelectedCategory(cat); setPage(1); }}
        minPrice={minPrice}
        maxPrice={maxPrice}
        onChangeMinPrice={(val) => { setMinPrice(val); setPage(1); }}
        onChangeMaxPrice={(val) => { setMaxPrice(val); setPage(1); }}
        sortOption={sortOption}
        onSelectSort={(sort) => { setSortOption(sort); setPage(1); }}
        onResetFilters={handleResetFilters}
      />

      {/* Product List or Loading/Error State */}
      {loading ? (
        <LoadingSpinner message="Loading products..." />
      ) : error ? (
        <ErrorMessage message={error} onRetry={fetchProducts} />
      ) : (
        <>
          <ProductGrid products={products} />
          <Pagination page={page} pages={pages} onPageChange={(p) => setPage(p)} />
        </>
      )}
    </div>
  );
};

export default ProductsPage;
