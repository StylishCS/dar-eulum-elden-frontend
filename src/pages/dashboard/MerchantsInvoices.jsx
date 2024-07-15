import React, { useEffect, useState } from 'react'
import { MerchantsInvoicesTable } from '../../components/MerchantsInvoicesTable'
import http from '../../http'
import { Spinner } from '@material-tailwind/react'

export const MerchantsInvoices = () => {
  const [invoices, setInvoices] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchInvoices = async () => {
    try {
      const merchants = await http.GET("/dashboard/merchants/invoices")
      if (merchants) {
        setInvoices(merchants)
        setLoading(false);
      } else {
        console.error('Unexpected response structure:', response);
        setLoading(false);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchInvoices();
  }, [])

  if (loading) {
    return <Spinner color='green' className="h-12 w-12" />;
  }
  return (
    <>
      <MerchantsInvoicesTable invoices={invoices}/>
    </>
  )
}
