import {
  Button,
  Input,
  Spinner,
  Dialog,
  DialogHeader,
  DialogFooter,
  DialogBody,
  Alert,
  Breadcrumbs
} from "@material-tailwind/react";
import React, { useState } from "react";
import { Link } from "react-router-dom";

export const NewClient = () => {
  const [newId, setNewId] = useState(null);
  const [newClient, setNewClient] = useState({})
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);

  const handleOpen = () => setOpen(!open);

  const handleSubmit = async () => {
    setLoading(true);

    if (name.trim() === "" || phone.trim() === "") {
      console.error("Please fill out all required fields");
      setLoading(false);
      return;
    }

    let data = {
      name,
      phone,
    };

    try {
      const response = await fetch(
        `http://localhost:3000/dashboard/clients`,
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
        console.log("Client added successfully:", result);
        setNewId(result.UID);
        setNewClient(result);
        setOpen(true); // Open the dialog
        setName(""); // Clear the name field
        setPhone(""); // Clear the phone field
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
      {showErrorAlert && (
        <Alert className="fixed top-4 right-4 z-20 w-72" color="red">
          Failed To Add Client
        </Alert>
      )}
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
        <Link to="/dashboard/clients/add">New Client</Link>
      </Breadcrumbs>
      <Dialog open={open} handler={handleOpen}>
        <DialogHeader>Client Profile Created Successfully</DialogHeader>
        <DialogBody>
          <h1>Client ID: {newClient.UID}</h1>
          <h1>Client Name: {newClient.name}</h1>
          <h1>Client Phone: {newClient.phone}</h1>
        </DialogBody>
        <DialogFooter>
          <Button variant="gradient" color="green" onClick={handleOpen}>
            <span>Confirm</span>
          </Button>
        </DialogFooter>
      </Dialog>
      <div className="flex items-center justify-center min-h-screen">
        <div
          className={`border p-8 rounded-lg shadow-lg w-full max-w-3xl mt-[-120px] border-blue-500`}
        >
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
              label="Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="text-white text-lg"
            />
            <Button
              color="blue"
              className={`col-span-1 md:col-span-2 w-3/4 mx-auto ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              onClick={handleSubmit}
              disabled={loading} // Disable the button while loading
            >
              {loading ? <Spinner /> : "Create Client"}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};
