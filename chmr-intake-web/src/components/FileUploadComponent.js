import React, { useState } from "react";

const FileUploadComponent = ({ onFilesUploaded }) => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [error, setError] = useState(null);

  // Handle file selection
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const newFiles = [...selectedFiles];
    const errors = [];
    const MAX_FILE_SIZE = 5 * 1024 * 1024 * 1024; // 5GB in bytes
  
    for (const file of files) {
      // Check if the file name already exists
      if (newFiles.some((f) => f.name === file.name)) {
        errors.push(`A file with the name "${file.name}" has already been selected.`);
        continue; // Skip this file
      }

      // Check if the file size exceeds the limit
      if (file.size > MAX_FILE_SIZE) {
        errors.push(`The file "${file.name}" exceeds the 5GB size limit.`);
        continue; // Skip this file
      }
  
      // Check if the file limit is exceeded
      if (newFiles.length >= 5) {
        errors.push("You can only upload up to 5 files.");
        break; // Stop processing further files
      }
  
      newFiles.push(file);
    }
  
    setSelectedFiles(newFiles);
  
    // Display all errors (if any)
    if (errors.length > 0) {
      setError(errors.join(" "));
    } else {
      setError(null);
    }
  
    // Notify parent component of the selected files
    if (onFilesUploaded) {
      onFilesUploaded(newFiles);
    }
  };

  // Remove a file from the selected list
  const removeFile = (fileName) => {
    const updatedFiles = selectedFiles.filter((file) => file.name !== fileName);
    setSelectedFiles(updatedFiles);

    // Notify parent component of the updated file list
    if (onFilesUploaded) {
      onFilesUploaded(updatedFiles);
    }
  };

  return (
    <div>
      {/* File Input */}
      <input
        type="file"
        multiple
        onChange={handleFileChange}
        name="document_files" // Add a name attribute for the form
        style={{ marginBottom: "10px" }}
      />

      {/* Selected Files */}
      <ul>
        {selectedFiles.map((file) => (
          <li key={file.name}>
            {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
            <button
              type="button"
              onClick={() => removeFile(file.name)}
              style={{ marginLeft: "10px", color: "red" }}
            >
              Remove
            </button>
          </li>
        ))}
      </ul>

      {/* Error Message */}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default FileUploadComponent;