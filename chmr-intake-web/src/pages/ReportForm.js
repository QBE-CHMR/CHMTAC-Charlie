import React from "react";
import { AppBar, Grid2, Toolbar, Typography, Box, Container } from "@mui/material";
import IntakeFormComponent from "../components/IntakeFormComponent.js";
import { submitReport } from "../services/api.js";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from 'uuid';

const ReportForm = () => {
  const navigate = useNavigate();

  const handleFormSubmit = async (formData) => {
    try {
      // Generate a UUID and merge it with the form data
      formData.append("publicUUID", uuidv4());
      console.log("Submitting multipart data:", [...formData.keys()]);
      // Submit the data to the backend
      await submitReport(formData);

      const plain = {};
      for (const [key, value] of formData.entries()) {
        if (key !== "files") {
          plain[key] = value;
        }
      }

      const fileNames = formData.getAll("files").map((f) => f.name);
      if (fileNames.length) plain.files = fileNames;
      // Navigate to the submission page with the submitted data
      navigate("/SubmissionPage", { state: { plain } });
    } catch (error) {
      console.error("Error submitting the report:", error);
      alert("Error submitting the report. Please try again.");
    }
  };



  return (
    <Box sx={{ backgroundColor: "#f5f5f5", minHeight: "100vh" }}>

      {/* Big Header */}
      <AppBar position="static" sx={{ background: "linear-gradient(45deg, #3f51b5, #1d2d50)", py: 1.5 }}>
        <Toolbar sx={{ flexDirection: "column", textAlign: "center" }}>
          <Typography 
            variant="h4" 
            sx={{
              fontWeight: "bold",
              letterSpacing: 1,
              textTransform: "uppercase",
              color: "#fff",
              textShadow: "3px 3px 6px rgba(0, 0, 0, 0.3)"
            }}
          >
            Civilian Harm Mitigation
          </Typography>
          <Typography 
            variant="h6" 
            sx={{ 
              color: "#e0e0e0", 
              mt: 0.5, 
              fontWeight: "bold",
              fontSize: "1.1rem"
            }}
          >
            Report Suspected Civilian Harm Below:
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Form Container */}
      <Container sx={{ pt: 5 }}>
        <Grid2 container justifyContent="center">
          <Grid2 item xs={12} sm={10} md={8} lg={6}>
            <IntakeFormComponent onSubmit={handleFormSubmit} />
          </Grid2>
        </Grid2>
      </Container>
    </Box>
  );
};

export default ReportForm;
