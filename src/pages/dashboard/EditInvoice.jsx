import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import http from '../../http';
import { EditInvoiceTable } from '../../components/EditInvoiceTable';
import { Typography,Breadcrumbs } from '@material-tailwind/react';

export const EditInvoice = () => {
  const location = useLocation();
  const _id = location.state || "";
  const [invoice, setInvoice] = useState({ products: [] });

  useEffect(() => {
    if (_id) {
      fetchInvoice();
    }
  }, [_id]);

  const fetchInvoice = async () => {
    try {
      const res = await http.GET(`/dashboard/invoices/${_id}`);
      setInvoice(res);
    } catch (error) {
      console.error("Failed to fetch invoice:", error);
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
        
        <Link>Edit Invoice</Link>
      </Breadcrumbs>
      <Typography variant='h1'>Invoice ID: {invoice.UID}</Typography>
      {invoice.products.length > 0 ? (
        <EditInvoiceTable invoice={invoice} />
      ) : (
        <div>Loading...</div>
      )}
    </>
  );
};
