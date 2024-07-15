import React, { useEffect, useState } from "react";
import {
  Card,
  Typography,
  CardHeader,
  CardBody,
  CardFooter,
  Input,
  Button,
  IconButton,
  Popover,
  PopoverHandler,
  PopoverContent,
} from "@material-tailwind/react";
import { format, isSameDay } from "date-fns";
import { DayPicker } from "react-day-picker";
import {
  ChevronRightIcon,
  ChevronLeftIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";

const TABLE_HEAD = ["Action Type", "Client Name", "Client ID", "Paid", "Due", "Date"];

export function DuesLogsTable({ duesLogs }) {
  const [selectedDate, setSelectedDate] = useState(null);
  const [tableRows, setTableRows] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [invoicesPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    setTableRows(duesLogs);
  }, [duesLogs]);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    setCurrentPage(1);
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setCurrentPage(1);
  };

  const filteredDuesLogs = tableRows.filter((log) => {
    const logDate = new Date(log.createdAt);
    const clientUID = log.clientUID; // Ensure this matches your data structure
    return (
      (log.actionType.toString().toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.clientName.toString().toLowerCase().includes(searchQuery.toLowerCase()) ||
        clientUID.toString().toLowerCase().includes(searchQuery.toLowerCase())) &&
      (!selectedDate || isSameDay(logDate, selectedDate))
    );
  });

  const indexOfLastLog = currentPage * invoicesPerPage;
  const indexOfFirstLog = indexOfLastLog - invoicesPerPage;
  const currentLogs = filteredDuesLogs.slice(indexOfFirstLog, indexOfLastLog);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <Card className="h-full w-full overflow-scroll">
      <CardHeader floated={false} shadow={false} className="rounded-none">
        <div className="mb-4 flex flex-col justify-between gap-8 md:flex-row md:items-center">
          <div>
            <Typography variant="h5" color="blue-gray">
              Dues Logs
            </Typography>
          </div>
          <div className="flex w-full shrink-0 gap-2 md:w-max">
            <div className="w-full md:w-72">
              <Input
                label="Search"
                icon={<MagnifyingGlassIcon className="h-5 w-5" />}
                value={searchQuery}
                onChange={handleSearchChange}
              />
            </div>
          </div>
        </div>
      </CardHeader>
      <CardBody className="p-0">
        <table className="w-full min-w-max table-auto text-left">
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
            {currentLogs.map((log, index) => (
              <tr key={log.id} className={`${index % 2 === 0 ? "bg-blue-gray-50/50" : ""} ${log.due == 0 ? "bg-green-100" : ""}`}>
                <td className="p-4">
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                  >
                    {log.actionType}
                  </Typography>
                </td>
                <td className="p-4">
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                  >
                    {log.clientName}
                  </Typography>
                </td>
                <td className="p-4">
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                  >
                    {log.clientUID}
                  </Typography>
                </td>
                <td className="p-4">
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                  >
                    {log.amount}$
                  </Typography>
                </td>
                <td className="p-4">
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                  >
                    {log.due}$
                  </Typography>
                </td>
                <td className="p-4">
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                  >
                    {format(new Date(log.createdAt), "PPP")}
                  </Typography>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardBody>
      <div className="px-24 py-8">
        <Popover placement="bottom">
          <PopoverHandler>
            <Input
              label="Select a Date"
              onChange={() => null}
              value={selectedDate ? format(selectedDate, "PPP") : ""}
            />
          </PopoverHandler>
          <PopoverContent>
            <DayPicker
              mode="single"
              selected={selectedDate}
              onSelect={handleDateSelect}
              showOutsideDays
              className="border-0"
              classNames={{
                caption:
                  "flex justify-center py-2 mb-4 relative items-center",
                caption_label: "text-sm font-medium text-gray-900",
                nav: "flex items-center",
                nav_button:
                  "h-6 w-6 bg-transparent hover:bg-blue-gray-50 p-1 rounded-md transition-colors duration-300",
                nav_button_previous: "absolute left-1.5",
                nav_button_next: "absolute right-1.5",
                table: "w-full border-collapse",
                head_row: "flex font-medium text-gray-900",
                head_cell: "m-0.5 w-9 font-normal text-sm",
                row: "flex w-full mt-2",
                cell:
                  "text-gray-600 rounded-md h-9 w-9 text-center text-sm p-0 m-0.5 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-gray-900/20 [&:has([aria-selected].day-outside)]:text-white [&:has([aria-selected])]:bg-gray-900/50 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                day: "h-9 w-9 p-0 font-normal",
                day_range_end: "day-range-end",
                day_selected:
                  "rounded-md bg-gray-900 text-white hover:bg-gray-900 hover:text-white focus:bg-gray-900 focus:text-white",
                day_today: "rounded-md bg-gray-200 text-gray-900",
                day_outside:
                  "day-outside text-gray-500 opacity-50 aria-selected:bg-gray-500 aria-selected:text-gray-900 aria-selected:bg-opacity-10",
                day_disabled: "text-gray-500 opacity-50",
                day_hidden: "invisible",
              }}
              components={{
                IconLeft: ({ ...props }) => (
                  <ChevronLeftIcon {...props} className="h-4 w-4 stroke-2" />
                ),
                IconRight: ({ ...props }) => (
                  <ChevronRightIcon {...props} className="h-4 w-4 stroke-2" />
                ),
              }}
            />
          </PopoverContent>
        </Popover>
      </div>
      <CardFooter className="flex items-center justify-between border-t border-blue-gray-50 p-4 mt-12 absolute bottom-0 w-full">
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
            { length: Math.ceil(filteredDuesLogs.length / invoicesPerPage) },
            (_, i) => {
              const pageNumber = i + 1;
              const totalPages = Math.ceil(filteredDuesLogs.length / invoicesPerPage);

              const showPage = (
                pageNumber === 1 ||
                pageNumber === totalPages ||
                Math.abs(pageNumber - currentPage) <= 2 ||
                totalPages <= 5 ||
                (pageNumber === 2 && currentPage <= 4) ||
                (pageNumber === totalPages - 1 && currentPage >= totalPages - 3)
              );

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
          disabled={currentLogs.length < invoicesPerPage}
        >
          Next
        </Button>
      </CardFooter>
    </Card>
  );
}
