import React, { useState } from "react";
import {
  Input,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Button,
  Chip,
  Alert,
  Dialog,
  DialogHeader,
  DialogFooter,
  Spinner,
  Breadcrumbs
} from "@material-tailwind/react";
import { Link } from "react-router-dom";


const AddProduct = () => {
  const [category, setCategory] = useState("books");
  const [name, setName] = useState("");
  const [netPrice, setNetPrice] = useState("");
  const [sellPrice, setSellPrice] = useState("");
  const [merchantsPrice, setMerchantsPrice] = useState("");
  const [manufacture, setManufacture] = useState("");
  const [stock, setStock] = useState("");
  const [color, setColor] = useState("");
  const [size, setSize] = useState("");
  const [authors, setAuthors] = useState([]);
  const [authorInput, setAuthorInput] = useState("");
  const [categoryInput, setCategoryInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(!open);
  
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

  const clearForm = () => {
    setName("");
    setNetPrice("");
    setSellPrice("");
    setMerchantsPrice("");
    setManufacture("");
    setStock("");
    setColor("");
    setSize("");
    setAuthors([]);
    setAuthorInput("");
    setCategoryInput("");
  };

  const handleSubmit = async () => {
    setLoading(true);

    if (
      name.trim() === "" ||
      netPrice.trim() === "" ||
      sellPrice.trim() === "" ||
      merchantsPrice.trim() === "" ||
      manufacture.trim() === "" ||
      stock.trim() === ""
    ) {
      console.error("Please fill out all required fields");
      setLoading(false);
      return;
    }

    let data = {
      category,
      name,
      netPrice,
      sellPrice,
      merchantsPrice,
      manufacture,
      stock,
    };

    if (category === "books") {
      data = {
        ...data,
        authors,
        category: categoryInput,
      };
    } else {
      data = {
        ...data,
        color,
        size,
      };
    }

    try {
      const response = await fetch(
        `http://localhost:3000/products/${category}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      if (response.ok) {
        const result = await response.json();
        console.log("Product added successfully:", result);
        handleOpen();
        clearForm();
      } else {
        setShowErrorAlert(true);
        setTimeout(() => {
          setShowErrorAlert(false);
        }, 3000);
        console.error("Failed to add product");
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

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
        <Link to="/dashboard/products/add">New Product</Link>
      </Breadcrumbs>
      {showErrorAlert && (
        <Alert className="fixed top-4 right-4 z-20 w-72" color="red">
          Failed To Add Product
        </Alert>
      )}
      <Dialog open={open} handler={handleOpen}>
        <DialogHeader>Product Added Successfully!</DialogHeader>
        <DialogFooter>
          <Button variant="gradient" color="green" onClick={handleOpen}>
            <span>Confirm</span>
          </Button>
        </DialogFooter>
      </Dialog>
      <div className="flex items-center justify-center min-h-screen">
        <div
          className={`border p-8 rounded-lg shadow-lg w-full max-w-3xl mt-[-120px] ${
            category === "books" ? "border-blue-500" : "border-green-500"
          }`}
        >
          <Menu>
            <MenuHandler>
              <Button
                color={category === "books" ? "blue" : "green"}
                className="mx-auto block mb-4"
              >
                {category}
              </Button>
            </MenuHandler>
            <MenuList>
              <MenuItem onClick={() => setCategory("books")}>Book</MenuItem>
              <MenuItem onClick={() => setCategory("quran")}>Quran</MenuItem>
            </MenuList>
          </Menu>

          {category === "books" ? (
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
                label="Merchants Price"
                value={merchantsPrice}
                onChange={(e) => setMerchantsPrice(e.target.value)}
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
                {loading ? <Spinner/> : "Add Product"}
              </Button>
            </div>
          ) : (
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
                color="blue"
                label="Merchants Price"
                value={merchantsPrice}
                onChange={(e) => setMerchantsPrice(e.target.value)}
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
                {loading ? "Adding..." : "Add Product"}
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default AddProduct;
