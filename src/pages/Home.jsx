import React, { Component, useEffect, useState } from 'react';
import { CategoryCard } from '../components/Category';
import useScanDetection from 'use-scan-detection';
import http from '../http';

export const Home = () => {
  const [cart, setCart] = useState(() => {
    return JSON.parse(localStorage.getItem("cart")) || [];
  })
  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCart(storedCart);
    console.log(cart)
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

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
  };
  const handleOnScan = async (code) => {
    const cat = code[0] == 'q' ? "quran" : "books";
    const barId = code.slice(1);
    try {
      const prod = await http.GET(`/products/${cat}/${barId}`)
      addToCart(prod)
    } catch (error) {
      console.log(error)
    }
  }
  useScanDetection({
    onComplete: (code) => {
      if(code[0] != 'q' && code[0] != 'b')return;
      handleOnScan(code);
    }
  })
  return (
    <div className="flex items-center justify-center h-screen">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <CategoryCard title={"Islamic Books"} description= {"Explore All Islamic Books"} category={"books"} />
          <CategoryCard title={"The Holy Quran"} description = {"Explore All Holy Quran Books"} category={"quran"}/>
        </div>
      </div>
  )
}

export default Home;
