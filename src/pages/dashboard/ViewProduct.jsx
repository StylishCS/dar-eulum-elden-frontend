import React, { useState, useEffect } from "react";
import {
  Input,
  Button,
  Chip,
  Alert,
  Dialog,
  DialogHeader,
  DialogFooter,
  Spinner,
  Breadcrumbs,
  Typography,
} from "@material-tailwind/react";
import { Link, useLocation } from "react-router-dom";

const ViewProduct = () => {
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
  const [authors, setAuthors] = useState(product.authors || []);
  const [authorInput, setAuthorInput] = useState("");
  const [categoryInput, setCategoryInput] = useState(
    product.category || "book"
  );
  const [damaged, setDamaged] = useState(product.damaged || 0)
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
      setAuthors(product.authors);
      setDamaged(product.damaged);
      setCategoryInput("book");
    }
  }, [product]);

  const handleAuthorChange = (e) => {
    setAuthorInput(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && authorInput.trim() !== "") {
      setAuthors([...authors, authorInput.trim()]);
      setAuthorInput("");
      e.preventDefault();
    }
  };

  const removeAuthorTag = (index) => {
    setAuthors(authors.filter((_, i) => i !== index));
  };

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
      authors,
      damaged
    };

    try {
      const response = await fetch(
        `http://localhost:3000/products/books/${product._id}`,
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
        <div className="border p-8 rounded-lg shadow-lg w-full max-w-3xl mt-[-120px] border-blue-500">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              color="blue"
              label="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="text-white text-lg"
            />
            <Input
              color="blue"
              label="Net Price"
              value={netPrice}
              onChange={(e) => setNetPrice(e.target.value)}
              className="text-white text-lg"
            />
            <Input
              color="blue"
              label="Sell Price"
              value={sellPrice}
              onChange={(e) => setSellPrice(e.target.value)}
              className="text-white text-lg"
            />
            <Input
              color="blue"
              label="Merchants Price"
              value={merchantsPrice}
              onChange={(e) => setMerchantsPrice(e.target.value)}
              className="text-white text-lg"
            />
            <Input
              color="blue"
              label="Manufacture"
              value={manufacture}
              onChange={(e) => setManufacture(e.target.value)}
              className="text-white text-lg"
            />
            <Input
              color="blue"
              label="Stock"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              className="text-white text-lg"
            />
            <Input
              color="blue"
              label="Category"
              value={categoryInput}
              onChange={(e) => setCategoryInput(e.target.value)}
              className="text-white text-lg"
            />
            <Input
              color="blue"
              label="Damaged"
              value={damaged}
              onChange={(e) => setDamaged(e.target.value)}
              className="text-white text-lg"
            />
            <div className="md:col-span-2">
              <label className="text-gray-700">Authors</label>
              <div className="flex items-center gap-2 flex-wrap mb-2">
                {authors.map((author, index) => (
                  <Chip
                    key={index}
                    value={author}
                    className="m-1"
                    onClose={() => removeAuthorTag(index)}
                  />
                ))}
              </div>
              <Input
                color="blue"
                value={authorInput}
                onChange={handleAuthorChange}
                onKeyDown={handleKeyDown}
                label="Add Author and press Enter"
                className="text-white text-lg"
              />
            </div>
            <Button
              color="blue"
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

export default ViewProduct;
