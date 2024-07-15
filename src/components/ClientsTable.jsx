import React, { useEffect, useState } from "react";
import { PencilIcon } from "@heroicons/react/24/solid";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import {
  Card,
  CardHeader,
  Typography,
  Button,
  CardBody,
  Chip,
  CardFooter,
  Avatar,
  IconButton,
  Tooltip,
  Input,
  Dialog,
  Alert,
} from "@material-tailwind/react";
import http from "../http";
import { format } from "date-fns";

const TABLE_HEAD = [
  "Transaction",
  "Account",
  "Phone Number",
  "Due",
  "Date",
  "Status",
  "",
];

export function ClientsTable() {
  const [clients, setClients] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [clientsPerPage] = useState(7);
  const [searchTerm, setSearchTerm] = useState("");
  const [open, setOpen] = useState(false);
  const [currentClient, setCurrentClient] = useState(null);
  const [paidAmount, setPaidAmount] = useState("");
  const [showErrorAlert, setShowErrorAlert] = useState(false);

  useEffect(() => {
    async function fetchClients() {
      try {
        const res = await http.GET("http://localhost:3000/dashboard/clients");
        setClients(res);
      } catch (error) {
        console.error("Error fetching client data:", error);
      }
    }

    fetchClients();
  }, []);

  const indexOfLastClient = currentPage * clientsPerPage;
  const indexOfFirstClient = indexOfLastClient - clientsPerPage;

  const filteredClients = clients.filter(
    (client) =>
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.UID.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const currentClients = filteredClients.slice(
    indexOfFirstClient,
    indexOfLastClient
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const totalPages = Math.ceil(filteredClients.length / clientsPerPage);

  const renderPageNumbers = () => {
    const pageNumbers = [];
    const maxPageNumbersToShow = 5;
    const halfPageNumbersToShow = Math.floor(maxPageNumbersToShow / 2);

    if (totalPages <= maxPageNumbersToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else if (currentPage <= halfPageNumbersToShow) {
      for (let i = 1; i <= maxPageNumbersToShow; i++) {
        pageNumbers.push(i);
      }
      pageNumbers.push("...");
      pageNumbers.push(totalPages);
    } else if (currentPage > totalPages - halfPageNumbersToShow) {
      pageNumbers.push(1);
      pageNumbers.push("...");
      for (
        let i = totalPages - maxPageNumbersToShow + 1;
        i <= totalPages;
        i++
      ) {
        pageNumbers.push(i);
      }
    } else {
      pageNumbers.push(1);
      pageNumbers.push("...");
      for (
        let i = currentPage - halfPageNumbersToShow;
        i <= currentPage + halfPageNumbersToShow;
        i++
      ) {
        pageNumbers.push(i);
      }
      pageNumbers.push("...");
      pageNumbers.push(totalPages);
    }

    return pageNumbers.map((number, index) =>
      number === "..." ? (
        <span key={index} className="mx-2">
          ...
        </span>
      ) : (
        <IconButton
          key={index}
          variant={currentPage === number ? "outlined" : "text"}
          size="sm"
          onClick={() => paginate(number)}
        >
          {number}
        </IconButton>
      )
    );
  };

  const handleOpen = (client) => {
    setCurrentClient(client);
    setPaidAmount("");
    setOpen(true);
  };

  const handleUpdateDue = async () => {
    if (currentClient) {
      try {
        if (paidAmount > currentClient.due) {
          setShowErrorAlert(true);
          setTimeout(() => {
            setShowErrorAlert(false);
          }, 3000);
          return;
        }
        const newDueAmount = Math.max(
          currentClient.due - parseFloat(paidAmount),
          0
        );
        const res = await http.PATCH(
          `http://localhost:3000/dashboard/clients/${currentClient._id}`,
          { amount: paidAmount }
        );
        setClients((prevClients) =>
          prevClients.map((client) =>
            client._id === currentClient._id
              ? { ...client, due: newDueAmount }
              : client
          )
        );
        setOpen(false);
      } catch (error) {
        console.error("Error updating client due amount:", error);
      }
    }
  };

  return (
    <>
      <Dialog
        size="xs"
        open={open}
        handler={() => setOpen(false)}
        className="bg-transparent shadow-none"
      >
        {showErrorAlert && (
        <Alert className="fixed top-4 right-4 z-20 w-72" color="red">
          Paid Amount Larger Than Due Amount
        </Alert>
      )}
        <Card className="mx-auto w-full max-w-[24rem]">
          <CardBody className="flex flex-col gap-4">
            <Typography variant="h4" color="blue-gray">
              {currentClient?.name}
            </Typography>
            <Typography
              className="mb-3 font-normal"
              variant="paragraph"
              color="gray"
            >
              {currentClient?.UID}
            </Typography>
            <Typography className="-mb-2" variant="h6">
              Due Amount
            </Typography>
            <Input
              disabled
              label="Due"
              size="lg"
              value={currentClient?.due || ""}
            />
            <Typography className="-mb-2" variant="h6">
              Paid Amount
            </Typography>
            <Input
              label="Paid"
              size="lg"
              value={paidAmount}
              onChange={(e) => setPaidAmount(e.target.value)}
            />
          </CardBody>
          <CardFooter className="pt-0">
            <Button variant="gradient" onClick={handleUpdateDue} fullWidth>
              Update
            </Button>
          </CardFooter>
        </Card>
      </Dialog>
      <Card className="w-full">
        <CardHeader floated={false} shadow={false} className="rounded-none">
          <div className="mb-4 flex flex-col justify-between gap-8 md:flex-row md:items-center">
            <div>
              <Typography variant="h5" color="blue-gray">
                Clients Transactions
              </Typography>
              <Typography color="gray" className="mt-1 font-normal">
                These are details about the last transactions
              </Typography>
            </div>
            <div className="flex w-full shrink-0 gap-2 md:w-max">
              <div className="w-full md:w-72">
                <Input
                  label="Search"
                  icon={<MagnifyingGlassIcon className="h-5 w-5" />}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardBody className="overflow-scroll px-0">
          <table className="w-full h min-w-max table-auto text-left">
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
              {currentClients.map(
                ({ _id, name, phone, UID, due, updatedAt }, index) => {
                  const isLast = index === currentClients.length - 1;
                  const classes = isLast
                    ? "p-4"
                    : "p-4 border-b border-blue-gray-50";

                  return (
                    <tr key={_id}>
                      <td className={classes}>
                        <div className="flex items-center gap-3">
                          <Avatar
                            src="https://t3.ftcdn.net/jpg/01/65/63/94/360_F_165639425_kRh61s497pV7IOPAjwjme1btB8ICkV0L.jpg"
                            alt={name}
                            size="md"
                            className="border border-blue-gray-50 bg-blue-gray-50/50 object-contain p-1"
                          />
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-bold"
                          >
                            {name}
                          </Typography>
                        </div>
                      </td>
                      <td className={classes}>
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-bold"
                        >
                          {UID}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-bold"
                        >
                          {phone}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          {due}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          {format(Date(updatedAt), "PPP")}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <div className="w-max">
                          <Chip
                            size="sm"
                            variant="ghost"
                            value={due === 0 ? "paid" : "pending"}
                            color={due === 0 ? "green" : "amber"}
                          />
                        </div>
                      </td>
                      <td className={classes}>
                        <Tooltip content="Edit User">
                          <IconButton
                            onClick={() =>
                              handleOpen({
                                _id,
                                name,
                                phone,
                                UID,
                                due,
                                updatedAt,
                              })
                            }
                            variant="text"
                          >
                            <PencilIcon className="h-4 w-4" />
                          </IconButton>
                        </Tooltip>
                      </td>
                    </tr>
                  );
                }
              )}
            </tbody>
          </table>
        </CardBody>
        <CardFooter className="flex items-center justify-between border-t border-blue-gray-50 p-4">
          <Button
            variant="outlined"
            size="sm"
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <div className="flex items-center gap-2">{renderPageNumbers()}</div>
          <Button
            variant="outlined"
            size="sm"
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </CardFooter>
      </Card>
    </>
  );
}
