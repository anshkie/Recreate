import React, { useState } from 'react';
import { API } from '../services/api';

const SaveJob = ({ userId, videoUrl }) => {
  const [editType, setEditType] = useState('');
  const [message, setMessage] = useState('');

  const saveJob = async () => {
    try {
      const res = await API.post('/save-job', {
        user_id: userId,
        video_url: videoUrl,
        edit_type: editType,
      });
      setMessage(res.data.message);
    } catch (err) {
      setMessage(err.response?.data?.error || 'Failed to save job');
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white shadow rounded mt-4">
      <input
        type="text"
        placeholder="Edit Type (e.g. Watermark)"
        value={editType}
        onChange={(e) => setEditType(e.target.value)}
        className="w-full border px-3 py-2 mb-4"
      />
      <button
        onClick={saveJob}
        className="bg-green-600 text-white px-4 py-2 rounded"
      >
        Save Job
      </button>
      {message && <p className="mt-4 text-green-600">{message}</p>}
    </div>
  );
};

export default SaveJob;
