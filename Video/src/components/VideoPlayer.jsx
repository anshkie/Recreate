import React from 'react';

const VideoPlayer = ({ videoUrl }) => {
  if (!videoUrl) return null;

  return (
    <div className="my-4">
      <video width="100%" controls>
        <source src={videoUrl} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

export default VideoPlayer;
