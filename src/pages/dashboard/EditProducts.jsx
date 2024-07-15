import { Breadcrumbs, Chip } from '@material-tailwind/react';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProductsTable from '../../components/ProductsTable';

export const EditProducts = () => {
  const [selectedCategory, setSelectedCategory] = useState("Books");
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`http://localhost:3000/products/${selectedCategory}/all`);
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, [selectedCategory]);

  return (
    <>
      <Breadcrumbs className="mb-4">
        <Link to="/dashboard/analytics" className="opacity-60">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
          </svg>
        </Link>
        <a className="opacity-60">
          <span>Branch</span>
        </a>
        <Link to="/dashboard/products/edit">Edit Products</Link>
      </Breadcrumbs>
      <ProductsTable/>
    </>
  );
};
