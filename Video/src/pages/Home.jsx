import React, { useState, useEffect } from 'react';
import UploadForm from '../components/UploadForm';
import VideoPlayer from '../components/VideoPlayer';
import EditControls from '../components/EditControls';
import ResultViewer from '../components/ResultViewer';
import SaveJob from './SaveJob';
import JobHistory from './JobHistory';

import { supabase } from './supabaseClient';
import { uploadVideo, processEdits } from '../services/api';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const Home = () => {
  const [videoUrl, setVideoUrl] = useState(null);
  const [videoId, setVideoId] = useState(null);
  const [resultUrl, setResultUrl] = useState(null);
  const [isThumbnail, setIsThumbnail] = useState(false);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUserId = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
      }
      setLoading(false);
    };
    getUserId();
  }, []);

  const handleUpload = async (file) => {
    try {
      const { id } = await uploadVideo(file);
      const objectUrl = URL.createObjectURL(file);
      setVideoUrl(objectUrl);
      setVideoId(id);
      console.log("Video uploaded, preview URL:", objectUrl);
    } catch (error) {
      console.error("Upload failed:", error);
    }
  };

  const handleEdit = async (options) => {
    try {
      const response = await processEdits(videoId, options);
      console.log("Edit response:", response);
      setResultUrl(response.resultUrl);
      setIsThumbnail(response.isThumbnail);
    } catch (error) {
      console.error("Edit processing failed:", error);
    }
  };

  if (loading) {
    return <p className="text-center mt-10 text-gray-500">Loading...</p>;
  }

  if (!userId) {
    return (
      <div className="p-6 max-w-xl mx-auto text-center">
        <Card>
          <CardHeader>
            <CardTitle className="text-red-500">Access Denied</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700">You must be logged in to use the video editor.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-center">🎬 Basic Video Editor</h1>

      <Card>
        <CardHeader>
          <CardTitle>Upload a Video</CardTitle>
        </CardHeader>
        <CardContent>
          <UploadForm onUpload={handleUpload} />
        </CardContent>
      </Card>

      {videoUrl && (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Video Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <VideoPlayer videoUrl={videoUrl} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Edit Controls</CardTitle>
            </CardHeader>
            <CardContent>
              <EditControls onEdit={handleEdit} />
            </CardContent>
          </Card>

          {/* === NEW FEATURES === */}
         
          <Card>
            <CardHeader>
              <CardTitle>Save Job</CardTitle>
            </CardHeader>
            <CardContent>
              <SaveJob userId={userId} videoUrl={videoUrl} />
            </CardContent>
          </Card>
        </>
      )}

      <Separator className="my-6" />

      <Card>
        <CardHeader>
          <CardTitle>Job History</CardTitle>
        </CardHeader>
        <CardContent>
          <JobHistory userId={userId} />
        </CardContent>
      </Card>

      {resultUrl && (
        <Card>
          <CardHeader>
            <CardTitle>Edited Result</CardTitle>
          </CardHeader>
          <CardContent>
            <ResultViewer resultUrl={resultUrl} isThumbnail={isThumbnail} />
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Home;
