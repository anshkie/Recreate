import axios from 'axios';
export const uploadVideo = async (file) => {
  const formData = new FormData();
  formData.append("video", file); // Make sure this key matches what your Flask backend expects

  const response = await fetch("http://localhost:5000/api/upload", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    console.error("Upload error:", error);
    throw new Error(`Upload failed: ${response.status} - ${JSON.stringify(error)}`);
  }

  return await response.json();
};

export const processEdits = async (videoId, options) => {
  const response = await fetch(`http://localhost:5000/api/edit/${videoId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(options),
  });
  return response.json();
};

export const API = axios.create({
  baseURL: 'http://localhost:5000',
});