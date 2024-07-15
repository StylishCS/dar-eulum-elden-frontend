import React, { useState, useEffect } from 'react';
import {
  Card,
  CardBody,
  CardFooter,
  Typography,
  Button,
  Spinner,
  Chip,
  Input
} from "@material-tailwind/react";
import { CheckCircleIcon } from '@heroicons/react/24/solid'; // Add this import for the icon
import http from '../http';
import useScanDetection from 'use-scan-detection'

const Products = ({ category }) => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [allProducts, setAllProducts] = useState([]);
  const [cart, setCart] = useState(() => JSON.parse(localStorage.getItem('cart')) || []);
  const [clickedProductId, setClickedProductId] = useState(null);

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCart(storedCart);
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    fetchProducts();
  }, [currentPage, category]);

  const handleOnScan = async (code) => {
    const cat = code[0] == 'q' ? 'quran' : 'books'
    code = code.slice(1);
    const res = await http.GET(`/products/${cat}/${code}`)
    addToCart(res)
  }

  useScanDetection({
    onComplete: (code) => {
      handleOnScan(code);
    }
  })

  const addToCart = (product) => {
    const productIndex = cart.findIndex(item => item._id === product._id);
    if (productIndex !== -1) {
      const updatedCart = cart.map((item, index) =>
        index === productIndex ? { ...item, quantity: item.quantity >= item.stock ? item.stock : item.quantity + 1 } : item
      );
      setCart(updatedCart);
    } else {
      const updatedCart = [...cart, { ...product, quantity: 1 }];
      setCart(updatedCart);
    }
    setClickedProductId(product._id);
    setTimeout(() => setClickedProductId(null), 3000);
  };

  const fetchProducts = async () => {
    try {
      const response = await http.GET(`/products/${category}?page=${currentPage}&limit=12`);
      const allProds = await http.GET(`/products/${category}/all`);
      
      if (response.books && response.totalPages && allProds) {
        setProducts(response.books);
        setFilteredProducts(response.books);
        setTotalPages(response.totalPages);
        setLoading(false);
        setAllProducts(allProds);
      } else {
        console.error('Unexpected response structure:', response);
        setLoading(false);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      setLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    const searchQuery = e.target.value.toLowerCase();

    if (searchQuery === '') {
      setFilteredProducts(products);
    } else {
      setFilteredProducts(category === "quran" ? 
        allProducts.filter(product =>
          product.name.toLowerCase().includes(searchQuery) ||
          product.color.toLowerCase().includes(searchQuery) ||
          product.manufacture.toLowerCase().includes(searchQuery) ||
          product.size === searchQuery
        ) : allProducts.filter(product =>
          product.name.toLowerCase().includes(searchQuery) ||
          product.authors.some(author => author.toLowerCase().includes(searchQuery)) ||
          product.manufacture.toLowerCase().includes(searchQuery) ||
          product.category.toLowerCase().includes(searchQuery)
        )
      );
    }

    setSearchQuery(searchQuery);
  };

  const handlePreviousPage = () => {
    setCurrentPage(prevPage => prevPage - 1);
  };

  const handleNextPage = () => {
    setCurrentPage(prevPage => prevPage + 1);
  };

  if (loading) {
    return <Spinner color='green' className="h-12 w-12" />;
  }

  return (
    <>
      <div className="p-4">
        <div className="mb-4">
          <Input
            type="text"
            placeholder="Search products by name, author, category, or manufacturer ..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
        <div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-16 mt-2">
            {filteredProducts.map((product) => (
              <Card key={product._id} className="w-full">
                <CardBody>
                  <div className="mb-2 flex items-center justify-between">
                    <Typography color="blue-gray" className='text-xl font-semibold'>
                      {product.name}
                    </Typography>
                    <Typography color="blue-gray" className="font-medium">
                      ${product.sellPrice}
                    </Typography>
                  </div>
                  <div className="mb-2 flex items-center justify-between">
                    <Typography color="blue-gray" className="font-medium">
                      {product.manufacture}
                    </Typography>
                    <Typography color="blue-gray" className="font-medium">
                      {product.stock} left
                    </Typography>
                  </div>
                  <div className="mb-2 flex items-center justify-between">
                    <Chip className="font-medium" value={category === "quran" ? product.color : product.category} />
                    <Typography color="blue-gray" className="font-medium">
                      {category === "quran" ? product.size : product.authors?.join(', ')}
                    </Typography>
                  </div>
                </CardBody>
                <CardFooter className="pt-0">
                  <Button
                    ripple={false}
                    fullWidth={true}
                    className="bg-blue-gray-900/10 text-blue-gray-900 shadow-none hover:scale-105 hover:shadow-none focus:scale-105 focus:shadow-none active:scale-100"
                    onClick={() => {
                      if (product.stock > 0) addToCart(product);
                    }}
                    disabled={product.stock <= 0}
                  >
                    {clickedProductId === product._id ? (
                      <CheckCircleIcon className="h-5 w-5 text-green-500 mx-auto animate-pulse" />
                    ) : (
                      product.stock > 0 ? "Add to Cart" : "Out of stock"
                    )}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
        <div>
          <div className="hidden md:flex fixed bottom-0 left-0 right-0 justify-center p-4 shadow-md space-x-4">
            <Button
              disabled={currentPage === 1}
              onClick={handlePreviousPage}
              className="bg-blue-500 text-white shadow-none hover:bg-blue-600 focus:bg-blue-600 active:bg-blue-700 disabled:bg-gray-400"
            >
              Previous
            </Button>
            <Button
              disabled={currentPage === totalPages}
              onClick={handleNextPage}
              className="bg-blue-500 text-white shadow-none hover:bg-blue-600 focus:bg-blue-600 active:bg-blue-700 disabled:bg-gray-400"
            >
              Next
            </Button>
          </div>
          <div className="md:hidden flex justify-center mt-4 space-x-4">
            <Button
              disabled={currentPage === 1}
              onClick={handlePreviousPage}
              className="bg-blue-500 text-white shadow-none hover:bg-blue-600 focus:bg-blue-600 active:bg-blue-700 disabled:bg-gray-400"
            >
              Previous
            </Button>
            <Button
              disabled={currentPage === totalPages}
              onClick={handleNextPage}
              className="bg-blue-500 text-white shadow-none hover:bg-blue-600 focus:bg-blue-600 active:bg-blue-700 disabled:bg-gray-400"
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Products;
