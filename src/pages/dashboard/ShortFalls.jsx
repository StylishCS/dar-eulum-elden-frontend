import React, { useEffect, useState } from "react";
import {
  Button,
  Input,
  List,
  ListItem,
  ListItemSuffix,
  Card,
  IconButton,
  Breadcrumbs,
  Chip,
  Spinner,
  Alert,
  Typography,
} from "@material-tailwind/react";
import { Link } from "react-router-dom";
import http from "../../http";
import { format } from "date-fns";

function TrashIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-5 w-5"
    >
      <path
        fillRule="evenodd"
        d="M16.5 4.478v.227a48.816 48.816 0 013.878.512.75.75 0 11-.256 1.478l-.209-.035-1.005 13.07a3 3 0 01-2.991 2.77H8.084a3 3 0 01-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 01-.256-1.478A48.567 48.567 0 017.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 013.369 0c1.603.051 2.815 1.387 2.815 2.951zm-6.136-1.452a51.196 51.196 0 013.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 00-6 0v-.113c0-.794.609-1.428 1.364-1.452zm-.355 5.945a.75.75 0 10-1.5.058l.347 9a.75.75 0 101.499-.058l-.346-9zm5.48.058a.75.75 0 10-1.498-.058l-.347 9a.75.75 0 001.5.058l.345-9z"
        clipRule="evenodd"
      />
    </svg>
  );
}
const TABLE_HEAD = ["Name", "Category", "Issued At", "Delete"];

export const ShortFalls = () => {
  const [product, setProduct] = useState("");
  const [shortFalls, setShortFalls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState("all");
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [showErrorAlert2, setShowErrorAlert2] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [invoicesPerPage] = useState(9); // Number of shortfalls per page

  const onChange = ({ target }) => setProduct(target.value);

  async function handleAddShortfall() {
    if (selected === "all") {
      setShowErrorAlert(true);
      setTimeout(() => {
        setShowErrorAlert(false);
      }, 3000);
      return;
    }
    let data = {
      name: product,
    };
    try {
      const res = await http.POST(
        `/dashboard/shortfalls?category=${selected}`,
        data
      );
      setProduct("");
      fetchShortFalls();
    } catch (error) {
      setShowErrorAlert2(true);
      setTimeout(() => {
        setShowErrorAlert2(false);
      }, 3000);
      console.error(error);
      return;
    }
  }

  async function handleDeleteShortfall(_id) {
    try {
      const res = await http.DELETE(`/dashboard/shortfalls/${_id}`);
      fetchShortFalls();
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    fetchShortFalls();
  }, [selected]);

  async function fetchShortFalls() {
    try {
      const res = await http.GET(`/dashboard/shortfalls?category=${selected}`);
      setShortFalls(res);
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  }

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const indexOfLastInvoice = currentPage * invoicesPerPage;
  const indexOfFirstInvoice = indexOfLastInvoice - invoicesPerPage;
  const currentShortfalls = shortFalls.slice(
    indexOfFirstInvoice,
    indexOfLastInvoice
  );

  if (loading) {
    return <Spinner color="green" className="w-12 h-12" />;
  }

  return (
    <>
      {showErrorAlert && (
        <Alert className="fixed top-4 right-4 z-20 w-82" color="red">
          Choose a category before adding please
        </Alert>
      )}
      {showErrorAlert2 && (
        <Alert className="fixed top-4 right-4 z-20 w-82" color="red">
          Product Already Exist
        </Alert>
      )}
      <div className="flex justify-between">
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
          <Link to="/dashboard/shortfalls">Shortfalls</Link>
        </Breadcrumbs>
        <div className="flex gap-4">
          <Chip
            className="h-12 w-56 text-center text-lg"
            color={selected === "all" ? "cyan" : "blue-gray"}
            value="All"
            onTap={() => {
              setSelected("all");
              setCurrentPage(1);
            }}
          />
          <Chip
            className="h-12 w-56 text-center text-lg"
            color={selected === "books" ? "cyan" : "blue-gray"}
            value="Books"
            onTap={() => {
              setSelected("books");
              setCurrentPage(1);
            }}
          />
          <Chip
            className="h-12 w-56 text-center text-lg"
            color={selected === "quran" ? "cyan" : "blue-gray"}
            value="Quran"
            onTap={() => {
              setSelected("quran");
              setCurrentPage(1);
            }}
          />
        </div>
        <div className="relative flex w-full max-w-[24rem]">
          <Input
            type="product"
            label="Product Name"
            value={product}
            onChange={onChange}
            className="pr-20"
            color="white"
            containerProps={{
              className: "min-w-0",
            }}
          />
          <Button
            size="sm"
            color={product ? "cyan" : "gray"}
            disabled={!product}
            className="!absolute right-1 top-1 rounded"
            onClick={handleAddShortfall}
          >
            Add
          </Button>
        </div>
      </div>
      <Card className="w-full overflow-scroll mt-8">
        <table className="w-full h-full min-w-max table-auto text-left">
          <thead>
            <tr>
              {TABLE_HEAD.map((head) => (
                <th
                  key={head}
                  className="border-b border-blue-gray-100 bg-blue-gray-50 p-4"
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
            {currentShortfalls.map(({ _id, name, category, createdAt }, index) => {
              const isLast = index === shortFalls.length - 1;
              const classes = isLast
                ? "p-4"
                : "p-4 border-b border-blue-gray-50";

              return (
                <tr key={name} className="even:bg-blue-gray-50/50">
                  <td className={classes}>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal"
                    >
                      {name}
                    </Typography>
                  </td>
                  <td className={`${classes} `}>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal"
                    >
                      {category}
                    </Typography>
                  </td>
                  <td className={classes}>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal"
                    >
                      {format(new Date(createdAt), "PPP")}
                    </Typography>
                  </td>
                  <td className={`${classes}`}>
                    <IconButton
                      variant="text"
                      color="blue-gray"
                      onClick={() => {
                        handleDeleteShortfall(_id);
                      }}
                    >
                      <TrashIcon />
                    </IconButton>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card>
      <div className="flex justify-between mt-4 bg-white rounded-lg p-4">
        <Button
          variant="outlined"
          size="sm"
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </Button>
        <div className="flex items-center gap-2">
          {/* Display page numbers */}
          {Array.from(
            { length: Math.ceil(shortFalls.length / invoicesPerPage) },
            (_, i) => {
              // Determine whether to show this page number based on current page and total pages
              const pageNumber = i + 1;
              const totalPages = Math.ceil(shortFalls.length / invoicesPerPage);

              // Show only a subset of page numbers around the current page
              const showPage =
                pageNumber === 1 || // Always show the first page
                pageNumber === totalPages || // Always show the last page
                Math.abs(pageNumber - currentPage) <= 2 || // Show pages close to current page
                totalPages <= 5 || // Show all pages if there are fewer than 5 total
                (pageNumber === 2 && currentPage <= 4) || // Show page 2 early on
                (pageNumber === totalPages - 1 &&
                  currentPage >= totalPages - 3); // Show page n-1 late

              if (showPage) {
                return (
                  <IconButton
                    key={pageNumber}
                    variant={currentPage === pageNumber ? "outlined" : "text"}
                    size="sm"
                    onClick={() => paginate(pageNumber)}
                  >
                    {pageNumber}
                  </IconButton>
                );
              } else if (
                (pageNumber === 3 && currentPage > 4) ||
                (pageNumber === totalPages - 2 && currentPage < totalPages - 3)
              ) {
                return <span className="text-sm">...</span>;
              }
              return null;
            }
          )}
        </div>
        <Button
          variant="outlined"
          size="sm"
          onClick={() => paginate(currentPage + 1)}
          disabled={currentShortfalls.length < invoicesPerPage}
        >
          Next
        </Button>
      </div>
    </>
  );
};
