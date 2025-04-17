import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Container,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography
} from "@mui/material";

import api    from "../services/api.js";
import Header from "../components/Header.js";

const STATUS_MAP = {
  submitted:     "Submitted",
  promotable:    "Promotable",
  notPromotable: "NotPromotable",
  discard:       "Discard"
};
const STATUS_VALUES = Object.keys(STATUS_MAP);   

export default function ReportManagementPage() {
  const [startIndex,   setStartIndex]   = useState(0);
  const [maxSize]                        = useState(10);
  const [statusFilter, setStatusFilter] = useState("");
  const [sortField,    setSortField]    = useState("submittedAt");
  const [sortOrder,    setSortOrder]    = useState("asc");

  const [reports,    setReports]    = useState([]);
  const [totalCount, setTotalCount] = useState(0);

  const [error, setError] = useState("");
  const [info,  setInfo]  = useState("");

  const [selectedReport, setSelectedReport] = useState(null); 
  const [editReport,     setEditReport]     = useState(null); 
  const [newStatus,      setNewStatus]      = useState("");

  const loadReports = async () => {
    setError("");
    setInfo("");
    setSelectedReport(null);
    setEditReport(null);

    try {
      let url = `/report/management?start=${startIndex}&max=${maxSize}`;
      if (statusFilter) url += `&status=${encodeURIComponent(statusFilter)}`;
      url += `&sortField=${encodeURIComponent(sortField)}&sortOrder=${encodeURIComponent(sortOrder)}`;

      const { data } = await api.get(url);

      const list = Array.isArray(data.reports) ? data.reports
                 : Array.isArray(data)         ? data
                 : [];

      if (list.length === 0) {
        setInfo("No reports found for the selected status.");
        setReports([]);
        setTotalCount(0);
        return;
      }
      setReports(list);
      setTotalCount(data.totalCount ?? list.length);
    } catch (err) {
      setError("Failed to load reports: " + err.message);
    }
  };

  useEffect(() => { loadReports(); }, [startIndex, maxSize, statusFilter, sortField, sortOrder]);  

  const nextPage = () => {
    if (startIndex + maxSize < totalCount) setStartIndex(startIndex + maxSize);
  };
  const prevPage = () => {
    if (startIndex > 0) setStartIndex(Math.max(startIndex - maxSize, 0));
  };

  const viewReport = async (id) => {
    setError("");
    try {
      const { data } = await api.get(`/report/management/${encodeURIComponent(id)}`);
      setSelectedReport(data);
      setEditReport(null);
    } catch (err) {
      setError("Failed to fetch report: " + err.message);
    }
  };

  const openStatusDialog = (r) => {
    setEditReport(r);
    setNewStatus(r.status);
    setSelectedReport(null);
  };

  const saveStatus = async () => {
    if (!editReport) return;
    try {
      await api.put(
        `/report/management/${encodeURIComponent(editReport.id)}`,
        { status: newStatus }
      );
      setReports(prev =>
        prev.map(r => r.id === editReport.id ? { ...r, status: newStatus } : r)
      );
      setEditReport(null);
    } catch (err) {
      setError("Failed to update status: " + err.message);
    }
  };

  return (
    <Box sx={{ backgroundColor:"#f5f5f5", minHeight:"100vh" }}>
      <Header
        title="Civilian Harm Reporting"
        headerText="Manage your submitted reports below:"
      />

      <Container maxWidth={false} sx={{ pt:5 }}>
        {error && <Box sx={{ color:"red",  mb:2 }}>{error}</Box>}
        {info  && <Box sx={{ color:"gray", mb:2 }}>{info}</Box>}

        <Grid container spacing={2} sx={{ mb:3 }} alignItems="center">
          <Grid item xs={12} sm={4} md={3}>
            <FormControl fullWidth>
              <InputLabel id="filter-label">Report Status</InputLabel>
              <Select
                labelId="filter-label"
                label="Report Status"
                value={statusFilter}
                onChange={e => { setStatusFilter(e.target.value); setStartIndex(0); }}
              >
                <MenuItem value=""><em>All Statuses</em></MenuItem>
                {STATUS_VALUES.map(s => (
                  <MenuItem key={s} value={s}>{STATUS_MAP[s]}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={4} md={3}>
            <FormControl fullWidth>
              <InputLabel id="sort-by-label">Sort by</InputLabel>
              <Select
                labelId="sort-by-label"
                label="Sort by"
                value={sortField}
                onChange={e => { setSortField(e.target.value); setStartIndex(0); }}
              >
                <MenuItem value="submittedAt">Date</MenuItem>
                <MenuItem value="status">Status</MenuItem>
                <MenuItem value="name">Name</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={4} md={3}>
            <FormControl fullWidth>
              <InputLabel id="sort-order-label">Sort order</InputLabel>
              <Select
                labelId="sort-order-label"
                label="Sort order"
                value={sortOrder}
                onChange={e => { setSortOrder(e.target.value); setStartIndex(0); }}
              >
                <MenuItem value="asc">Ascending</MenuItem>
                <MenuItem value="desc">Descending</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={4} md={3}>
            <Button variant="contained" fullWidth onClick={loadReports}>
              Apply Filter
            </Button>
          </Grid>
        </Grid>

        <Table sx={{ backgroundColor:"#fff", mb:3 }}>
          <TableHead>
            <TableRow>
              <TableCell><strong>ID</strong></TableCell>
              <TableCell><strong>Status</strong></TableCell>
              <TableCell><strong>Submitted At</strong></TableCell>
              <TableCell><strong>Actions</strong></TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {reports.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} align="center">No reports to display</TableCell>
              </TableRow>
            ) : (
              reports.map(r => (
                <TableRow key={r.id} hover>
                  <TableCell>{r.id}</TableCell>
                  <TableCell>{STATUS_MAP[r.status] ?? r.status}</TableCell>
                  <TableCell>{r.submittedAt}</TableCell>
                  <TableCell>
                    <Button size="small" variant="outlined" sx={{ mr:1 }} onClick={() => viewReport(r.id)}>View</Button>
                    <Button size="small" variant="outlined" onClick={() => openStatusDialog(r)}>Update</Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {reports.length > 0 && (
          <Grid container spacing={2} sx={{ mb:3 }} alignItems="center">
            <Grid item>
              <Button variant="outlined" onClick={prevPage} disabled={startIndex===0}>Previous</Button>
            </Grid>
            <Grid item>
              <Typography variant="body2">
                Showing {startIndex + 1}‑{Math.min(startIndex + maxSize, totalCount)} of {totalCount}
              </Typography>
            </Grid>
            <Grid item>
              <Button variant="outlined" onClick={nextPage} disabled={startIndex + maxSize >= totalCount}>Next</Button>
            </Grid>
          </Grid>
        )}

        {selectedReport && (
          <Box sx={{ backgroundColor:"#fff", p:2, mt:2, boxShadow:1, borderRadius:1 }}>
            <Typography variant="h5" sx={{ mb:2 }}>Report Details</Typography>
            <Typography><strong>ID:</strong> {selectedReport.id}</Typography>
            <Typography><strong>Status:</strong> {STATUS_MAP[selectedReport.status] ?? selectedReport.status}</Typography>
            <Typography><strong>Submitted At:</strong> {selectedReport.submittedAt}</Typography>
          </Box>
        )}

        {editReport && (
          <Box sx={{ backgroundColor:"#fff", p:2, mt:2, boxShadow:1, borderRadius:1 }}>
            <Typography variant="h5" sx={{ mb:2 }}>Change Status – {editReport.id}</Typography>

            <FormControl fullWidth sx={{ mb:2 }}>
              <InputLabel id="new-status-label">New Status</InputLabel>
              <Select
                labelId="new-status-label"
                label="New Status"
                value={newStatus}
                onChange={e => setNewStatus(e.target.value)}
              >
                {STATUS_VALUES.map(s => (
                  <MenuItem key={s} value={s}>{STATUS_MAP[s]}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <Box sx={{ display:"flex", justifyContent:"flex-end", gap:2 }}>
              <Button variant="contained" onClick={saveStatus}>Save</Button>
              <Button variant="text" onClick={() => setEditReport(null)}>Cancel</Button>
            </Box>
          </Box>
        )}
      </Container>
    </Box>
  );
}
