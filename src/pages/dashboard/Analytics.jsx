import React, { useState, useEffect } from "react";
import BarChart from "../../components/BarChart";
import LineChart from "../../components/LineChart";
import PieChart from "../../components/PieChart";
import { StatisticsCard } from "../../components/StatisticsCard";
import { Breadcrumbs, Typography, Spinner } from "@material-tailwind/react";
import { Link } from "react-router-dom";
import { TransactionsTable } from "../../components/TransactionsTable";
import { InvoicesTable } from "../../components/InvoicesTable";
import http from "../../http";

export default function Analytics() {
  const [analytics, setAnalytics] = useState({})
  const [invoices, setInvoices] = useState({})
  const [merchantsTransactions, setMerchantsTransactions] = useState({})
  const [loading, setLoading] = useState(true)
  const fetchAnalytics = async () => {
    try {
      const response = await http.GET(`/dashboard/analytics`);
      const invoices = await http.GET("/dashboard/invoices")
      const merchants = await http.GET("/dashboard/merchants")
      
      if (response && invoices && merchants) {
        setAnalytics(response)
        setInvoices(invoices)
        setMerchantsTransactions(merchants)
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
    fetchAnalytics();
  }, [])
  
  if (loading) {
    return <Spinner color='green' className="h-12 w-12" />;
  }
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
        <Link to="/dashboard/analytics">Analytics</Link>
      </Breadcrumbs>

      <div className="flex flex-wrap gap-4 mb-8">
        <div className="flex-1 min-w-[300px]">
          <StatisticsCard
            title="Today's Money"
            value={analytics.todayTotalAmount}
            footer={
              <Typography className="font-normal text-blue-gray-600">
                {
                  analytics.amountPercentageDifference >= 0 ? <strong className={"text-green-500"}>{analytics.amountPercentageDifference}%</strong> : <strong className={"text-red-500"}>{analytics.amountPercentageDifference}%</strong>
                }
                &nbsp;{"than yesterday"}
              </Typography>
            }
          />
        </div>
        <div className="flex-1 min-w-[300px]">
          <StatisticsCard title="Today's Profit" value={analytics.todayTotalProfit} footer={
              <Typography className="font-normal text-blue-gray-600">
                {
                  analytics.amountPercentageDifference >= 0 ? <strong className={"text-green-500"}>{analytics.amountPercentageDifference}%</strong> : <strong className={"text-red-500"}>{analytics.amountPercentageDifference}%</strong>
                }
                &nbsp;{"than yesterday"}
              </Typography>
            } />
        </div>
        <div className="flex-1 min-w-[300px]">
          <StatisticsCard title="Books Stock" value={analytics.bookStock[0].totalStock} footer={
            <Typography className="font-normal text-blue-gray-600">
                {
                  analytics.bookStock[0].totalStock < 1000 ? <strong className={"text-red-500"}>Restock As Soon As Possible</strong> : <strong className={"text-green-500"}>All Good!</strong>
                }
              </Typography>
          } />
        </div>
        <div className="flex-1 min-w-[300px]">
          <StatisticsCard title="Quran Stock" value={analytics.quranStock[0].totalStock} footer={
            <Typography className="font-normal text-blue-gray-600">
                {
                  analytics.quranStock[0].totalStock < 100 ? <strong className={"text-red-500"}>Restock As Soon As Possible</strong> : <strong className={"text-green-500"}>All Good!</strong>
                }
              </Typography>
          } />
        </div>
      </div>

      <div className="flex flex-wrap gap-4 mb-8">
        <div className="flex-1 min-w-[300px]">
          <LineChart values = {analytics.monthlyProfits} />
        </div>
        <div className="flex-1 min-w-[300px]">
          <BarChart values = {analytics.weeklyProfits} />
        </div>
        <div className="flex-1 min-w-[300px]">
          <PieChart values = {[analytics.bookSellings[0].totalSellings, analytics.quranSellings[0].totalSellings]}/>
        </div>
      </div>

      <div className="flex gap-4">
        <div className="flex-2/3 w-2/3">
          <TransactionsTable merchants={merchantsTransactions}/>
        </div>
        <div className="flex-1/3 w-1/3">
          <InvoicesTable invoices = {invoices.reverse()} />
        </div>
      </div>
    </>
  );
}
