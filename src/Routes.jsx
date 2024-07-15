import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./Layout";

import Products from "./pages/Products";
import AddProduct from "./pages/Add";
import Cart from "./pages/Cart";
import { Dashboard } from "./pages/dashboard/Dashboard";
import DashboardLayout from "./DashboardLayout";
import Analytics from "./pages/dashboard/Analytics";
import { EditProducts } from "./pages/dashboard/EditProducts";
import { Clients } from "./pages/dashboard/Clients";
import { NewClient } from "./pages/dashboard/NewClient";
import ViewProduct from "./pages/dashboard/ViewProduct";
import ViewProductQuran from "./pages/dashboard/ViewProductQuran";
import { MerchantsInvoices } from "./pages/dashboard/MerchantsInvoices";
import { AddMerchant } from "./pages/dashboard/AddMerchant";
import { DuesLogs } from "./pages/dashboard/DuesLogs";
import { ShortFalls } from "./pages/dashboard/ShortFalls";
import Home from "./pages/Home";
import { EditInvoice } from "./pages/dashboard/EditInvoice";

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="/quran" element={<Products category={"quran"} />} />
          <Route path="/books" element={<Products category={"books"} />} />
          <Route path="/cart" element={<Cart />} />
        </Route>
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/analytics" element={<Analytics />} />
          <Route path="/dashboard/clients" element={<Clients />} />
          <Route path="/dashboard/clients/add" element={<NewClient />} />
          <Route path="/dashboard/products/add" element={<AddProduct />} />
          <Route path="/dashboard/products/edit" element={<EditProducts />} />
          <Route path="/dashboard/products/view/book/:product" element={<ViewProduct />} />
          <Route path="/dashboard/products/view/quran/:product" element={<ViewProductQuran />} />
          <Route path="/dashboard/merchants/invoices" element={<MerchantsInvoices />} />
          <Route path="/dashboard/merchants/add" element={<AddMerchant />} />
          <Route path="/dashboard/dues" element={<DuesLogs />} />
          <Route path="/dashboard/shortfalls" element={<ShortFalls />} />
          <Route path="/dashboard/invoices/edit/:id" element={<EditInvoice />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default AppRoutes;
