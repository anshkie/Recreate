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
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

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

    setUploading(true);
    try {
      await onUpload(file);
      alert("Upload successful!");
    } catch (err) {
      console.error("Upload failed:", err);
      alert("Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white shadow rounded">
      <input
        type="file"
        accept="video/*"
        onChange={(e) => setFile(e.target.files[0])}
        className="mb-3"
      />

      <Button
        onClick={handleUpload}
        disabled={uploading}
        className="w-full"
      >
        {uploading ? (
          <div className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            Uploading...
          </div>
        ) : (
          'Upload'
        )}
      </Button>

      {videoUrl && (
        <div className="mt-4">
          <p className="font-medium">Uploaded Video:</p>
          <video controls src={videoUrl} className="mt-2 w-full" />
        </div>
      )}
    </div>
  );
};

export default UploadForm;
