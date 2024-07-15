import React, { useState, useEffect } from "react";
import {
  Input,
  Button,
  Alert,
  Dialog,
  DialogHeader,
  DialogFooter,
  Spinner,
  Breadcrumbs,
  Typography,
} from "@material-tailwind/react";
import { Link, useLocation } from "react-router-dom";

const ViewProductQuran = () => {
  const location = useLocation();
  const { product } = location.state || {};
  const [name, setName] = useState(product.name || "");
  const [netPrice, setNetPrice] = useState(product.netPrice || "");
  const [sellPrice, setSellPrice] = useState(product.sellPrice || "");
  const [merchantsPrice, setMerchantsPrice] = useState(
    product.merchantsPrice || ""
  );
  const [manufacture, setManufacture] = useState(product.manufacture || "");
  const [stock, setStock] = useState(product.stock || "");
  const [color, setColor] = useState(product.color || "");
  const [size, setSize] = useState(product.size || "");
  const [damaged, setDamaged] = useState(product.damaged || "")

  const [loading, setLoading] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(!open);

  useEffect(() => {
    if (product) {
      setName(product.name);
      setNetPrice(product.netPrice);
      setSellPrice(product.sellPrice);
      setMerchantsPrice(product.merchantsPrice);
      setManufacture(product.manufacture);
      setStock(product.stock);
      setColor(product.color);
      setSize(product.size);
      setDamaged(product.damaged);
    }
  }, [product]);

  const handleSubmit = async () => {
    setLoading(true);

    if (
      name.trim() === "" ||
      netPrice === "" ||
      sellPrice === "" ||
      manufacture.trim() === "" ||
      stock === ""
    ) {
      console.error("Please fill out all required fields");
      setLoading(false);
      return;
    }

    const data = {
      name,
      netPrice,
      merchantsPrice,
      sellPrice,
      manufacture,
      stock,
      damaged
    };

    try {
      const response = await fetch(
        `http://localhost:3000/products/quran/${product._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      if (response.ok) {
        const result = await response.json();
        console.log("Product updated successfully:", result);
        handleOpen();
      } else {
        setShowErrorAlert(true);
        setTimeout(() => {
          setShowErrorAlert(false);
        }, 3000);
        console.error("Failed to update product");
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {showErrorAlert && (
        <Alert className="fixed top-4 right-4 z-20 w-72" color="red">
          Failed To Update Product
        </Alert>
      )}
      <Dialog open={open} handler={handleOpen}>
        <DialogHeader>Product Updated Successfully!</DialogHeader>
        <DialogFooter>
          <Button variant="gradient" color="green" onClick={handleOpen}>
            <span>Confirm</span>
          </Button>
        </DialogFooter>
      </Dialog>
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
        <a className="opacity-60">
          <Link to="/dashboard/products/edit">Edit Products</Link>
        </a>
        <Link to="/dashboard/products/edit">View Product</Link>
      </Breadcrumbs>
      <Typography variant="h1">Sold: {product.sold} item</Typography>
      <div className="flex items-center justify-center min-h-screen">
        <div className="border p-8 rounded-lg shadow-lg w-full max-w-3xl mt-[-120px] border-green-500">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              color="green"
              label="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="text-white text-lg"
            />
            <Input
              color="green"
              label="Net Price"
              value={netPrice}
              onChange={(e) => setNetPrice(e.target.value)}
              className="text-white text-lg"
            />
            <Input
              color="green"
              label="Sell Price"
              value={sellPrice}
              onChange={(e) => setSellPrice(e.target.value)}
              className="text-white text-lg"
            />
            <Input
              color="green"
              label="Merchants Price"
              value={merchantsPrice}
              onChange={(e) => setMerchantsPrice(e.target.value)}
              className="text-white text-lg"
            />
            <Input
              color="green"
              label="Manufacture"
              value={manufacture}
              onChange={(e) => setManufacture(e.target.value)}
              className="text-white text-lg"
            />
            <Input
              color="green"
              label="Stock"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              className="text-white text-lg"
            />
            <Input
              color="green"
              label="Damaged"
              value={damaged}
              onChange={(e) => setDamaged(e.target.value)}
              className="text-white text-lg"
            />
            <Input
              color="green"
              label="Color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="text-white text-lg"
            />
            <Input
              color="green"
              label="Size"
              value={size}
              onChange={(e) => setSize(e.target.value)}
              className="text-white text-lg"
            />
            <Button
              color="green"
              className={`col-span-1 md:col-span-2 w-3/4 mx-auto ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              onClick={handleSubmit}
            >
              {loading ? <Spinner /> : "Update Product"}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ViewProductQuran;
