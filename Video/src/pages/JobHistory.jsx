import React, { useState } from 'react';
import { API } from '../services/api';

const JobHistory = ({ userId }) => {
  const [jobs, setJobs] = useState([]);

  const fetchJobs = async () => {
    try {
      const res = await API.get(`/jobs/${userId}`);
      setJobs(res.data);
    } catch (err) {
      alert('Error fetching jobs');
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white shadow rounded mt-6">
      <button
        onClick={fetchJobs}
        className="bg-gray-800 text-white px-4 py-2 rounded mb-4"
      >
        Load My Jobs
      </button>
      {jobs.map((job, index) => (
        <div key={index} className="mb-4 border p-2 rounded">
          <p><strong>Edit Type:</strong> {job.edit_type}</p>
          <p><strong>Video:</strong> <a href={job.video_url} className="text-blue-600" target="_blank" rel="noreferrer">Link</a></p>
          <p><strong>Time:</strong> {new Date(job.created_at).toLocaleString()}</p>
        </div>
      ))}
    </div>
  );
};

export default JobHistory;
