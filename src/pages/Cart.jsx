import React, { useEffect, useState } from "react";
import { Button, Typography, Dialog, DialogBody, DialogHeader, DialogFooter, Alert, Spinner, Input, Chip } from "@material-tailwind/react";
import { FaBookQuran, FaBook } from "react-icons/fa6";
import http from "../http";
import useScanDetection from 'use-scan-detection'

const Cart = () => {
  const [client, setClient] = useState(null)
  const [paid, setPaid] = useState(0)
  const [clientId, setClientId] = useState(null)
  const [selected, setSelected] = useState("Client")
  const [discount, setDiscount] = useState(0)
  const getClient = async (e) => {
    const id = e.target.value.toUpperCase();
    setClientId(id);
    const res = await http.GET(`http://localhost:3000/dashboard/${selected == "Client" ? "clients" : "merchants"}/${id}`)
    setClient(res);
  }
  const [cart, setCart] = useState(() => {
    return JSON.parse(localStorage.getItem("cart")) || [];
  });
  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(storedCart);
  }, []);
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);
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
  const removeFromCart = (productId) => {
    const updatedCart = cart.filter((item) => item._id !== productId);
    setCart(updatedCart);
  };
  const updateQuantity = (productId, newQuantity) => {
    const updatedCart = cart.map((item) =>
      item._id === productId ? { ...item, quantity: newQuantity } : item
    );
    setCart(updatedCart);
  };
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false)
  const handleOpen = () => setOpen(!open);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const checkoutCart = async () => {
    setLoading(true);
    const checkCart = {
        cart: cart,
        totalAmount: totalPrice(),
        totalNetPrice: totalNetPrice(),
        discount: discount ?? 0,
        client: client ? client._id : null,
        clientUID: client ? client.UID : null,
        paid: client ? paid : totalPrice() - discount,
        due: client ? totalPrice() - discount - paid : 0,
    }
    try {
      const response = await fetch(
        `http://localhost:3000/cart/checkout`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(checkCart),
        }
      );

      if (response.ok) {
        const result = await response.json();
        window.open(result.pdfPath, '_blank');
        localStorage.clear();
        setCart([]);
        setClient(null);
        setClientId(null)
        setPaid(0);
        handleOpen();
      } else {
        setShowErrorAlert(true);
        setTimeout(() => {
          setShowErrorAlert(false);
        }, 3000);
        console.error("Failed to add product");
      }
    } catch (error) {
      console.error("Error:", error);
    }
    setLoading(false);
  }
  const totalPrice = () => {
    const total = cart.reduce((acc, prod) => {
        return acc + (selected == "Client" ? (prod.sellPrice * prod.quantity): (prod.merchantsPrice * prod.quantity));
    }, 0);
    return total;
    };
    const totalNetPrice = () => {
    const total = cart.reduce((acc, prod) => {
        return acc + (prod.netPrice * prod.quantity);
    }, 0);
    return total;
    };
  return (
    <>
    {showErrorAlert && (
        <Alert className="fixed top-4 right-4 z-20 w-72" color="red">
          Failed To Checkout
        </Alert>
      )}
      <Dialog open={open} handler={handleOpen}>
        <DialogHeader>Invoice Created Successfully.</DialogHeader>
        <DialogFooter>
          <Button variant="gradient" color="green" onClick={handleOpen}>
            <span>Confirm</span>
          </Button>
        </DialogFooter>
      </Dialog>
    <section className="py-8 antialiased md:py-16">
      <div className="mx-auto max-w-screen-2xl px-4 2xl:px-0">
        <div className="mt-6 sm:mt-8 md:gap-6 lg:flex lg:items-start xl:gap-8">
          <div className="mx-auto w-full flex-none lg:max-w-2xl xl:max-w-4xl">
            <div className="space-y-6">
              {cart.map((prod) => {
                return (
                  <>
                    <div key={prod._id} className="rounded-lg border p-4 shadow-sm border-gray-700 bg-gray-800 md:p-6">
                      <div className="space-y-4 md:flex md:items-center md:justify-between md:gap-6 md:space-y-0">
                        {prod.color ? <FaBookQuran color="grey" className="text-8xl"/> : <FaBook color="grey" className="text-8xl"/>}
                        <label htmlFor="counter-input" className="sr-only">
                          Choose quantity:
                        </label>
                        <div className="flex items-center justify-between md:order-3 md:justify-end">
                          <div className="flex items-center">
                            <button
                              type="button"
                              id="decrement-button"
                              onClick={() => {
                                updateQuantity(prod._id, prod.quantity-1 < 1 ? 1 : prod.quantity-1)
                              }}
                              className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md border  focus:outline-none focus:ring-2 border-gray-600 bg-gray-700 hover:bg-gray-600 focus:ring-gray-700"
                            >
                              <svg
                                className="h-2.5 w-2.5 text-white"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 18 2"
                              >
                                <path
                                  stroke="currentColor"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M1 1h16"
                                />
                              </svg>
                            </button>
                            <input
                              type="text"
                              id="counter-input"
                              value={prod.quantity}
                              onChange={(e) => {
                                const newQuantity = parseInt(e.target.value, 10);
                                if (!isNaN(newQuantity) && newQuantity > 0 && newQuantity <= prod.stock) {
                                  updateQuantity(prod._id, newQuantity);
                                }
                              }}
                              className="w-10 shrink-0 border-0 bg-transparent text-center text-sm font-medium focus:outline-none focus:ring-0 text-white"
                            />
                            <button
                              type="button"
                              id="increment-button"
                              onClick={() => {
                                updateQuantity(prod._id, prod.quantity+1 > prod.stock ? prod.quantity : prod.quantity + 1)
                              }}
                              className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md border focus:outline-none focus:ring-2 border-gray-600 bg-gray-700 hover:bg-gray-600 focus:ring-gray-700"
                            >
                              <svg
                                className="h-2.5 w-2.5 text-white"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 18 18"
                              >
                                <path
                                  stroke="currentColor"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M9 1v16M1 9h16"
                                />
                              </svg>
                            </button>
                          </div>
                          <div className="text-end md:order-4 md:w-32">
                            <p className="text-base font-bold text-white">
                              ${selected == "Client" ? (prod.sellPrice * prod.quantity): (prod.merchantsPrice * prod.quantity)}
                            </p>
                          </div>
                        </div>

                        <div className="w-full min-w-0 flex-1 space-y-4 md:order-2 md:max-w-md">
                          <Typography className="text-xl font-bold text-white">
                            {prod.name}
                          </Typography>
                          <Typography className="text-base font-medium text-white">
                            Manufacture: {prod.manufacture}
                          </Typography>
                          {prod.authors && (
                            <Typography className="text-base font-medium  text-white">
                              Authors: {prod.authors.join(", ")}
                            </Typography>
                          )}
                          {prod.color && (
                            <Typography className="text-base font-medium text-white">
                              Color: {prod.color}
                            </Typography>
                          )}
                          {prod.category && (
                            <Typography className="text-base font-medium text-white">
                              Category: {prod.category}
                            </Typography>
                          )}
                          {prod.size && (
                            <Typography className="text-base font-medium text-white">
                              Size: {prod.size}
                            </Typography>
                          )}

                          <div className="flex items-center gap-4">
                            <button
                              type="button"
                              className="inline-flex items-center text-sm font-medium text-red-600 hover:underline dark:text-red-500"
                              onClick={() => {
                                removeFromCart(prod._id);
                              }}
                            >
                              <svg
                                className="me-1.5 h-5 w-5"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                fill="none"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  stroke="currentColor"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M6 18 17.94 6M18 18 6.06 6"
                                />
                              </svg>
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                );
              })}
            </div>
          </div>
          <div className="mx-auto mt-6 max-w-4xl flex-1 space-y-6 lg:mt-0 lg:w-full">
          <div className="flex gap-4 justify-center">
            <Chip className="w-24 h-10 text-center" value="Client" color={selected == "Client" ? "blue":"black"} onTap={() => {
              setClient(null)
              setSelected("Client")
              setClientId("")
            }}/>
            <Chip className="w-24 h-10 text-center" value="Merchant" color={selected == "Merchant" ? "blue":"black"} onTap={() => {
              setClient(null)
              setSelected("Merchant")
              setClientId("")
            }}/>
          </div>
            <div className="space-y-4 rounded-lg border p-4 shadow-sm border-gray-700 bg-gray-800 sm:p-6">
              <p className="text-xl font-semibold text-white">{selected == "Client" ? "Client Information":"Merchant Information"}</p>

              <div className="space-y-4">
                <div className="space-y-2">
                  <dl className="flex items-center justify-between gap-4">
                    <dt className="text-base font-normal text-gray-400">
                      {selected == "Client" ? "Client ID":"Merchant ID"}
                    </dt>
                    <dd className="text-base font-medium text-white">
                      <Input
                        color="white"
                        label="ID"
                        value={clientId}
                        className="text-black text-lg"
                        onChange={getClient}
                      />
                    </dd>
                  </dl>

                  <dl className="flex items-center justify-between gap-4">
                    <dt className="text-base font-normal text-gray-400">
                      {selected == "Client" ? "Client Name":"Merchant Name"}
                    </dt>
                    <dd className="text-base font-medium">
                      <Input
                        color="blue"
                        label="Name"
                        disabled
                        value={client ? client.name : ""}
                        className="text-black text-lg"
                      />
                    </dd>
                  </dl>

                  <dl className="flex items-center justify-between gap-4">
                    <dt className="text-base font-normal text-gray-400">
                      Paid
                    </dt>
                    <dd className="text-base font-medium">
                      <Input
                        color="white"
                        label="Paid"
                        value={paid}
                        onChange={(e) => {
                          setPaid(e.target.value)
                        }}
                        className="text-black text-lg"
                      />
                    </dd>
                  </dl>
                </div>

                <dl className="flex items-center justify-between gap-4 border-t border-gray-200 pt-2 dark:border-gray-700">
                  <dt className="text-base font-bold text-white">Due</dt>
                  <dd className="text-base font-bold text-white">${totalPrice() - paid}</dd>
                </dl>
              </div>
            </div>
            <div className="space-y-4 rounded-lg border p-4 shadow-sm border-gray-700 bg-gray-800 sm:p-6">
              <p className="text-xl font-semibold text-white">Order summary</p>

              <div className="space-y-4">
                <div className="space-y-2">
                  <dl className="flex items-center justify-between gap-4">
                    <dt className="text-base font-normal text-gray-400">
                      Original price
                    </dt>
                    <dd className="text-base font-medium text-white">
                      ${totalNetPrice()}
                    </dd>
                  </dl>

                  <dl className="flex items-center justify-between gap-4">
                    <dt className="text-base font-normal text-gray-400">
                      Discount
                    </dt>
                    <dd className="text-base font-medium text-green-600">
                      <Input color="white"
                        label="Discount"
                        value={discount}
                        onChange={(e) => {
                          setDiscount(e.target.value)
                        }}
                        className="text-black text-lg"/>
                    </dd>
                  </dl>

                  <dl className="flex items-center justify-between gap-4">
                    <dt className="text-base font-normal text-gray-400">
                      Profit
                    </dt>
                    <dd className="text-base font-medium text-green-600">
                      +${totalPrice() - totalNetPrice() - discount}
                    </dd>
                  </dl>

                </div>

                <dl className="flex items-center justify-between gap-4 border-t border-gray-200 pt-2 dark:border-gray-700">
                  <dt className="text-base font-bold text-white">Total</dt>
                  <dd className="text-base font-bold text-white">${totalPrice() - discount}</dd>
                </dl>
              </div>
              <Button onClick={checkoutCart} disabled={loading} className="flex w-full items-center justify-center rounded-lg px-5 py-2.5 text-sm font-medium text-white focus:outline-none focus:ring-4 bg-blue-500 hover:bg-blue-600 focus:bg-blue-600">
                {loading ? <Spinner/>:"Proceed to Checkout" }
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
    </>
  );
};

export default Cart;
