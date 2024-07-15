import React from "react";
import {
  Card,
  Typography,
  List,
  ListItem,
  ListItemPrefix,
  ListItemSuffix,
  Chip,
  Accordion,
  AccordionHeader,
  AccordionBody,
} from "@material-tailwind/react";
import {
  PresentationChartBarIcon,
  ShoppingBagIcon,
  UserCircleIcon,
  Cog6ToothIcon,
  InboxIcon,
  PowerIcon,
  BriefcaseIcon,
  DocumentArrowDownIcon,
  BanknotesIcon
} from "@heroicons/react/24/solid";
import { ChevronRightIcon, ChevronDownIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";

export function DashboardSidebar() {
  const [open, setOpen] = React.useState(0);
  const [openMerchants, setOpenMerchants] = React.useState(0);

  const handleOpen = (value) => {
    setOpen(open === value ? 0 : value);
  };

  const handleOpenMerchants = (value) => {
    setOpenMerchants(openMerchants === value ? 0 : value);
  };

  return (
    <Card className="h-[calc(100vh-2rem)] w-full max-w-[20rem] p-4 shadow-xl shadow-blue-gray-900/5">
      <div className="mb-2 p-4">
        <Typography variant="h5" color="blue-gray">
          Dashboard
        </Typography>
      </div>
      <List>
        <Link to="/dashboard/analytics">
          <ListItem>
            <ListItemPrefix>
              <PresentationChartBarIcon className="h-5 w-5" />
            </ListItemPrefix>
            Analytics
          </ListItem>
        </Link>
        <Accordion
          open={open === 2}
          icon={
            <ChevronDownIcon
              strokeWidth={2.5}
              className={`mx-auto h-4 w-4 transition-transform ${
                open === 2 ? "rotate-180" : ""
              }`}
            />
          }
        >
          <ListItem className="p-0" selected={open === 2}>
            <AccordionHeader
              onClick={() => handleOpen(2)}
              className="border-b-0 p-3"
            >
              <ListItemPrefix>
                <ShoppingBagIcon className="h-5 w-5" />
              </ListItemPrefix>
              <Typography color="blue-gray" className="mr-auto font-normal">
                Branch
              </Typography>
            </AccordionHeader>
          </ListItem>
          <AccordionBody className="py-1">
            <List className="p-0">
              <Link to="/dashboard/clients">
                <ListItem>
                  <ListItemPrefix>
                    <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
                  </ListItemPrefix>
                  Clients
                </ListItem>
              </Link>
              <Link to="/dashboard/clients/add">
                <ListItem>
                  <ListItemPrefix>
                    <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
                  </ListItemPrefix>
                  New Client
                </ListItem>
              </Link>
              <Link to="/dashboard/products/edit">
                <ListItem>
                  <ListItemPrefix>
                    <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
                  </ListItemPrefix>
                  Products
                </ListItem>
              </Link>
              <Link to="/dashboard/products/add">
                <ListItem>
                  <ListItemPrefix>
                    <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
                  </ListItemPrefix>
                  New Product
                </ListItem>
              </Link>
            </List>
          </AccordionBody>
        </Accordion>
        <Accordion
          open={openMerchants === 2}
          icon={
            <ChevronDownIcon
              strokeWidth={2.5}
              className={`mx-auto h-4 w-4 transition-transform ${
                openMerchants === 2 ? "rotate-180" : ""
              }`}
            />
          }
        >
          <ListItem className="p-0" selected={openMerchants === 2}>
            <AccordionHeader
              onClick={() => handleOpenMerchants(2)}
              className="border-b-0 p-3"
            >
              <ListItemPrefix>
                <BriefcaseIcon className="h-5 w-5" />
              </ListItemPrefix>
              <Typography color="blue-gray" className="mr-auto font-normal">
                Merchants
              </Typography>
            </AccordionHeader>
          </ListItem>
          <AccordionBody className="py-1">
            <List className="p-0">
              <Link to="/dashboard/merchants/invoices">
                <ListItem>
                  <ListItemPrefix>
                    <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
                  </ListItemPrefix>
                  Transactions
                </ListItem>
              </Link>
              <Link to="/dashboard/merchants/add">
                <ListItem>
                  <ListItemPrefix>
                    <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
                  </ListItemPrefix>
                  New Merchant
                </ListItem>
              </Link>
            </List>
          </AccordionBody>
        </Accordion>
        <Link to="/dashboard/shortfalls">
          <ListItem>
            <ListItemPrefix>
              <DocumentArrowDownIcon className="h-5 w-5" />
            </ListItemPrefix>
            Shortfalls
          </ListItem>
        </Link>
        <Link to="/dashboard/dues">
          <ListItem>
            <ListItemPrefix>
              <BanknotesIcon className="h-5 w-5" />
            </ListItemPrefix>
            Dues Paid
          </ListItem>
        </Link>
        <Link to="/">
          <ListItem>
            <ListItemPrefix>
              <PowerIcon className="h-5 w-5" />
            </ListItemPrefix>
            Quit
          </ListItem>
        </Link>
      </List>
    </Card>
  );
}
