// import { useState } from "react";

// const UploadForm = ({ onUpload }) => {
//   const [file, setFile] = useState(null);

//   const handleChange = (e) => {
//     setFile(e.target.files[0]);
//   };

//   const handleUpload = async (e) => {
//     e.preventDefault();
//     if (!file) {
//       alert("Please select a file first!");
//       return;
//     }

//     // ✅ Use the prop passed from Home.jsx
//     try {
//       await onUpload(file);
//       alert("Upload successful!");
//     } catch (err) {
//       console.error("Upload failed:", err);
//     }
//   };

//   return (
//     <form onSubmit={handleUpload}>
//       <input type="file" accept="video/*" onChange={handleChange} />
//       <button type="submit">Upload</button>
//     </form>
//   );
// };

// export default UploadForm;
import React, { useState } from 'react';
import axios from 'axios';

const UploadForm = ({ onUpload }) => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [videoUrl, setVideoUrl] = useState('');
const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      alert("Please select a file first!");
      return;
    }

    // ✅ Use the prop passed from Home.jsx
    try {
      await onUpload(file);
      alert("Upload successful!");
    } catch (err) {
      console.error("Upload failed:", err);
    }
  };


  return (
    <div className="p-6 max-w-md mx-auto bg-white shadow rounded">
      <input type="file" accept="video/*" onChange={(e) => setFile(e.target.files[0])} />
      <button
        className="bg-blue-600 text-white mt-2 px-4 py-2 rounded"
        onClick={handleUpload}
        disabled={uploading}
      >
        {uploading ? 'Uploading...' : 'Upload'}
      </button>

      {videoUrl && (
        <div className="mt-4">
          <p>Uploaded Video:</p>
          <video controls src={videoUrl} className="mt-2 w-full" />
        </div>
      )}
    </div>
  );
};

export default UploadForm;
