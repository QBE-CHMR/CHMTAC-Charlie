import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Container,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Grid,
  TextField
} from "@mui/material";
import axios from "axios";
import Header from '../components/Header.js';

export default function ReportManagementPage() {
  
  const [startIndex, setStartIndex] = useState(0);
  const [maxSize,   setMaxSize]   = useState(10);

  const [statusFilter, setStatusFilter] = useState("");

  const [sortField, setSortField] = useState("submittedAt");
  const [sortOrder, setSortOrder] = useState("asc");

  const [reports,     setReports]     = useState([]);
  const [totalCount,  setTotalCount]  = useState(0);

  const [error,       setError]       = useState("");
  const [info,        setInfo]        = useState("");

  const [selectedReport, setSelectedReport] = useState(null);   
  const [editReport,     setEditReport]     = useState(null);   
  const [editData,       setEditData]       = useState({});     


  const loadReports = async () => {
    setReports([]); setTotalCount(0); setSelectedReport(null); setEditReport(null);
    setError(""); setInfo("");

    try {
      let url = `http://localhost:5000/report/management?start=${startIndex}&max=${maxSize}`;
      if (statusFilter) url += `&status=${encodeURIComponent(statusFilter)}`;
      url += `&sortField=${encodeURIComponent(sortField)}&sortOrder=${encodeURIComponent(sortOrder)}`;

      const { data, status } = await axios.get(url);

      if (
        status === 404 ||
        (Array.isArray(data) && data.length === 0) ||
        (Array.isArray(data.reports) && data.reports.length === 0)
      ) {
        setInfo("No reports found for the selected status.");
        return;
      }

      if (Array.isArray(data.reports)) {
        setReports(data.reports);
        setTotalCount(data.totalCount ?? data.reports.length);
      } else if (Array.isArray(data)) {
        setReports(data);
        setTotalCount(data.length);
      } else {
        setInfo("No reports found for the selected status.");
      }
    } catch (err) {
      const code = err.response?.status;
      if (code === 400 || code === 404) {
        setInfo("No reports found for the selected status.");
      } else {
        setError("Failed to load reports: " + err.message);
      }
    }
  };

  useEffect(() => { loadReports(); },
            [startIndex, maxSize, statusFilter, sortField, sortOrder]);


  const nextPage = () => { if (startIndex + maxSize < totalCount) setStartIndex(startIndex + maxSize); };
  const prevPage = () => { if (startIndex > 0) setStartIndex(Math.max(startIndex - maxSize, 0)); };


  const selectReport = async (id, e) => {
    if (e) e.stopPropagation();
    setError(""); setInfo("");
    try {
      const res = await axios.get(`http://localhost:5000/report/management/${id}`);
      setSelectedReport(res.data);
      setEditReport(null);
    } catch (err) {
      setError("Failed to fetch report: " + err.message);
    }
  };

  const openEditForm = async (id, e) => {
    e.stopPropagation();
    setError(""); setInfo("");
    try {
      const res = await axios.get(`http://localhost:5000/report/management/${id}`);
      setEditReport(res.data);
      setEditData(res.data);     
      setSelectedReport(null);
    } catch (err) {
      setError("Failed to load report for editing: " + err.message);
    }
  };

  const saveEdit = async () => {
    if (!editReport) return;
    try {
      await axios.put(`http://localhost:5000/report/management/${editReport.id}`, editData);
      setReports(prev => prev.map(r => r.id === editReport.id ? editData : r));
      setEditReport(null);
      alert("Report updated successfully");
    } catch (err) {
      setError("Failed to update report: " + err.message);
    }
  };

  const deleteReport = async () => {
    if (!editReport) return;
    if (!window.confirm("Permanently delete this report?")) return;
    try {
      await axios.delete(`http://localhost:5000/report/management/${editReport.id}`);
      setReports(prev => prev.filter(r => r.id !== editReport.id));
      setEditReport(null);
      alert("Report deleted.");
    } catch (err) {
      setError("Failed to delete report: " + err.message);
    }
  };

  const discardReport = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm("Mark report as discarded?")) return;
    try {
      await axios.put(`http://localhost:5000/report/management/${id}`, { status: "discarded" });
      setReports(prev => prev.map(r => r.id === id ? { ...r, status: "discarded" } : r));
      if (selectedReport?.id === id) setSelectedReport({ ...selectedReport, status: "discarded" });
      alert("Report discarded.");
    } catch (err) {
      setError("Failed to discard report: " + err.message);
    }
  };


  return (
    <Box sx={{ backgroundColor: "#f5f5f5", minHeight: "100vh" }}>
      <Header headerText="Manage your submitted reports below:" />

      <Container maxWidth={false} sx={{ pt: 5 }}>
        {error && <Box sx={{ color: "red", mb: 2 }}><strong>Error:</strong> {error}</Box>}
        {info  && <Box sx={{ color: "gray", mb: 2 }}>{info}</Box>}

      
        <Grid container spacing={2} sx={{ mb: 3 }} alignItems="center">
          {/* status filter */}
          <Grid item xs={12} sm={4} md={3}>
            <FormControl fullWidth>
              <InputLabel id="filter-label">Report Status</InputLabel>
              <Select labelId="filter-label" label="Report Status"
                      value={statusFilter}
                      onChange={(e)=>{ setStatusFilter(e.target.value); setStartIndex(0); }}>
                <MenuItem value=""><em>All Statuses</em></MenuItem>
                <MenuItem value="initialized">Initialized</MenuItem>
                <MenuItem value="processing">Processing</MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
                <MenuItem value="discarded">Discarded</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4} md={3}>
            <FormControl fullWidth>
              <InputLabel id="sort-by-label">Sort by</InputLabel>
              <Select labelId="sort-by-label" label="Sort by"
                      value={sortField}
                      onChange={(e)=>{ setSortField(e.target.value); setStartIndex(0); }}>
                <MenuItem value="submittedAt">Date</MenuItem>
                <MenuItem value="status">Status</MenuItem>
                <MenuItem value="name">Name</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4} md={3}>
            <FormControl fullWidth>
              <InputLabel id="sort-order-label">Sort order</InputLabel>
              <Select labelId="sort-order-label" label="Sort order"
                      value={sortOrder}
                      onChange={(e)=>{ setSortOrder(e.target.value); setStartIndex(0); }}>
                <MenuItem value="asc">Ascending</MenuItem>
                <MenuItem value="desc">Descending</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4} md={3}>
            <Button variant="contained" fullWidth onClick={loadReports}>Apply Filter</Button>
          </Grid>
        </Grid>

        {/* table */}
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Table sx={{ width: "100%", backgroundColor: "#fff", mb: 3 }}>
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
                  <TableRow><TableCell colSpan={4} align="center">No reports to display</TableCell></TableRow>
                ) : (
                  reports.map(rpt => (
                    <TableRow key={rpt.id} hover sx={{ cursor:"pointer" }} onClick={()=>selectReport(rpt.id)}>
                      <TableCell>{rpt.id}</TableCell>
                      <TableCell>{rpt.status}</TableCell>
                      <TableCell>{rpt.submittedAt}</TableCell>
                      <TableCell>
                        <Button size="small" variant="outlined" sx={{ mr:1 }}
                                onClick={(e)=>selectReport(rpt.id, e)}>View</Button>
                        <Button size="small" variant="outlined" sx={{ mr:1 }}
                                onClick={(e)=>openEditForm(rpt.id, e)}>Edit Form</Button>
                        <Button size="small" variant="contained" color="warning"
                                onClick={(e)=>discardReport(rpt.id, e)}>Discard</Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </Grid>
        </Grid>

        {reports.length > 0 && (
          <Grid container spacing={2} sx={{ mb:3 }} alignItems="center">
            <Grid item><Button variant="outlined" onClick={prevPage} disabled={startIndex===0}>Previous</Button></Grid>
            <Grid item><Typography variant="body2">Showing {startIndex+1} to {Math.min(startIndex+maxSize,totalCount)} of {totalCount}</Typography></Grid>
            <Grid item><Button variant="outlined" onClick={nextPage} disabled={startIndex+maxSize>=totalCount}>Next</Button></Grid>
          </Grid>
        )}

        {selectedReport && (
          <Box sx={{ backgroundColor:"#fff", p:2, mt:2, boxShadow:1, borderRadius:1 }}>
            <Typography variant="h5" sx={{ mb:2 }}>Report Details</Typography>
            <Typography variant="body1"><strong>ID:</strong> {selectedReport.id}</Typography>
            <Typography variant="body1"><strong>Status:</strong> {selectedReport.status}</Typography>
            <Typography variant="body1"><strong>Submitted At:</strong> {selectedReport.submittedAt}</Typography>
          </Box>
        )}

 
        {editReport && (
          <Box sx={{ backgroundColor:"#fff", p:2, mt:2, boxShadow:1, borderRadius:1 }}>
            <Typography variant="h5" sx={{ mb:2 }}>Edit Report</Typography>

            <TextField
              label="Status"
              fullWidth
              sx={{ mb:2 }}
              value={editData.status || ""}
              onChange={(e)=>setEditData({...editData, status:e.target.value})}
            />


            <Box sx={{ display:"flex", justifyContent:"flex-end", gap:2 }}>
              <Button variant="contained" onClick={saveEdit}>Save Updates</Button>
              <Button variant="outlined" color="error" onClick={deleteReport}>Delete Report</Button>
              <Button variant="text" onClick={()=>setEditReport(null)}>Cancel</Button>
            </Box>
          </Box>
        )}
      </Container>
    </Box>
  );
}
