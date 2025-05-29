import React from 'react';

const ResultViewer = ({ resultUrl, isThumbnail }) => {
  if (!resultUrl) return null;

  return (
    <div className="p-4">
      {isThumbnail ? (
        <img src={resultUrl} alt="Thumbnail" className="w-64 h-auto" />
      ) : (
        <video src={resultUrl} controls className="w-full" />
      )}
      <a href={resultUrl} download className="block mt-2 text-blue-600 underline">Download Result</a>
    </div>
  );
};

export default ResultViewer;