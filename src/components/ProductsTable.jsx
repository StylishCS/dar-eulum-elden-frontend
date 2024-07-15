import React, { useState, useEffect } from "react";
import {
  MagnifyingGlassIcon,
  UserPlusIcon,
  EyeIcon,
  PrinterIcon
} from "@heroicons/react/24/solid";
import {
  Card,
  CardHeader,
  Input,
  Typography,
  Button,
  CardBody,
  CardFooter,
  Tabs,
  TabsHeader,
  Tab,
  IconButton,
  Tooltip,
} from "@material-tailwind/react";
import { Link } from "react-router-dom";
import JsBarcode from "jsbarcode";

const TABS = [
  { label: "Books", value: "books" },
  { label: "Quran", value: "quran" },
];

const TABLE_HEAD = ["Name", "Manufacture","Net Price","Merchants Price", "Sell Price", "Stock","Damaged", "View", "Barcode"];
const ITEMS_PER_PAGE = 7;

const ProductsTable = () => {
  const [category, setCategory] = useState("books");
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchProducts();
  }, [category]);

  const fetchProducts = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/products/${category}/all`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }
      const data = await response.json();
      setProducts(data); // Assuming data is an array of products
      setCurrentPage(1); // Reset to first page whenever category changes
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) =>
      Math.min(prevPage + 1, Math.ceil(filteredProducts.length / ITEMS_PER_PAGE))
    );
  };

  const getCurrentPageProducts = () => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handlePrintBarcode = (product) => {
  const { _id } = product;
  const barcodeId = product.color ? `q${_id}` : `b${_id}`;
  // Generate the barcode
  const canvas = document.createElement("canvas");
  JsBarcode(canvas, barcodeId, { format: "CODE128" });

  // Convert canvas to data URL
  const barcodeImage = canvas.toDataURL("image/png");

  // Open the image in a new window
  const newWindow = window.open();
  newWindow.document.write('<img src="' + barcodeImage + '" style="width:100%; height:100%;" />');
  newWindow.onload = function() {
    // Invoke print dialog
    newWindow.print();
  };
  newWindow.document.close();
};


  return (
    <Card className="w-full">
      <CardHeader floated={false} shadow={false} className="rounded-none">
        <div className="mb-8 flex items-center justify-between gap-8">
          <div>
            <Typography variant="h5" color="blue-gray">
              Products List
            </Typography>
            <Typography color="gray" className="mt-1 font-normal">
              See information about all products
            </Typography>
          </div>
          <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
            <Link to="/dashboard/products/add">
              <Button className="flex items-center gap-3" size="sm">
                <UserPlusIcon strokeWidth={2} className="h-4 w-4" /> Add Product
              </Button>
            </Link>
          </div>
        </div>
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <Tabs value={category} className="w-full md:w-max">
            <TabsHeader>
              {TABS.map(({ label, value }) => (
                <Tab key={value} value={value} onClick={() => setCategory(value)}>
                  &nbsp;&nbsp;{label}&nbsp;&nbsp;
                </Tab>
              ))}
            </TabsHeader>
          </Tabs>
          <div className="w-full md:w-72">
            <Input
              label="Search"
              icon={<MagnifyingGlassIcon className="h-5 w-5" />}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </CardHeader>
      <CardBody className="overflow-scroll px-0">
        <table className="mt-4 w-full min-w-max table-auto text-left">
          <thead>
            <tr>
              {TABLE_HEAD.map((head) => (
                <th
                  key={head}
                  className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4"
                >
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal leading-none opacity-70"
                  >
                    {head}
                  </Typography>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {getCurrentPageProducts().map((product, index) => (
              <tr key={product._id} className={`${index % 2 === 0 ? "bg-blue-gray-50/50" : ""}`}>
                <td className="p-4">
                  <Typography variant="small" color="blue-gray" className="font-normal">
                    {product.name}
                  </Typography>
                </td>
                <td className="p-4">
                  <Typography variant="small" color="blue-gray" className="font-normal">
                    {product.manufacture}
                  </Typography>
                </td>
                <td className="p-4">
                  <Typography variant="small" color="blue-gray" className="font-normal">
                    ${product.netPrice}
                  </Typography>
                </td>
                <td className="p-4">
                  <Typography variant="small" color="blue-gray" className="font-normal">
                    ${product.merchantsPrice}
                  </Typography>
                </td>
                <td className="p-4">
                  <Typography variant="small" color="blue-gray" className="font-normal">
                    ${product.sellPrice}
                  </Typography>
                </td>
                <td className="p-4">
                  <Typography variant="small" color="blue-gray" className="font-normal">
                    {product.stock}
                  </Typography>
                </td>
                <td className="p-4">
                  <Typography variant="small" color="blue-gray" className="font-normal">
                    {product.damaged}
                  </Typography>
                </td>
                <td className="p-4">
                  <Tooltip content="View Product">
                    <Link to={`/dashboard/products/view/${product.color ? "quran":"book"}/${product._id}`} state={{ product }}>
                      <IconButton variant="text">
                        <EyeIcon className="h-4 w-4" />
                      </IconButton>
                    </Link>
                  </Tooltip>
                </td>
                <td className="p-4">
                  <Tooltip content="Print Barcode">
                    <IconButton variant="text" onClick={() => handlePrintBarcode(product)}>
                      <PrinterIcon className="h-4 w-4" />
                    </IconButton>
                  </Tooltip>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardBody>
      <CardFooter className="flex items-center justify-between border-t border-blue-gray-50 p-4">
        <Typography variant="small" color="blue-gray" className="font-normal">
          Page {currentPage} of {Math.ceil(filteredProducts.length / ITEMS_PER_PAGE)}
        </Typography>
        <div className="flex gap-2">
          <Button
            variant="outlined"
            size="sm"
            onClick={handlePrevPage}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <Button
            variant="outlined"
            size="sm"
            onClick={handleNextPage}
            disabled={currentPage === Math.ceil(filteredProducts.length / ITEMS_PER_PAGE)}
          >
            Next
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ProductsTable;
