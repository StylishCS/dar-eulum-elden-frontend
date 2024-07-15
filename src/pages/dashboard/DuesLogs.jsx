import {
  Button,
  Input,
  Spinner,
  Dialog,
  DialogHeader,
  DialogFooter,
  DialogBody,
  Alert,
  Breadcrumbs,
} from "@material-tailwind/react";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import http from "../../http";
import { DuesLogsTable } from "../../components/DuesLogsTable";

export const DuesLogs = () => {
    const [duesLogs, setDuesLogs] = useState([])
    const [loading, setLoading] = useState(true)
    useEffect(() => {
      fetchDuesLogs();
    }, [])
    async function fetchDuesLogs(){
        setLoading(true)
        try {
            const res = await http.GET("/dashboard/dues");
            setDuesLogs(res.reverse());
            setLoading(false)
        } catch (error) {
            console.error(error)
        }
    }
    if(loading){
        return (<Spinner color="green" className="h-12 w-12"/>)
    }
  return (
    <>
      <DuesLogsTable duesLogs={duesLogs}/>
    </>
  );
};
