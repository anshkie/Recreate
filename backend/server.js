const express = require('express');
const multer = require('multer');
// const supabase = require('./supabaseClient');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const { exec } = require('child_process');
const axios = require('axios');
const ffmpeg = require('fluent-ffmpeg');
const tmp = require('tmp');
const app = express();
const os = require('os');
app.use(cors());
app.use(express.json());

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://vkprcaeidcenvkcmsxzt.supabase.co'; // replace with your URL
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZrcHJjYWVpZGNlbnZrY21zeHp0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODM3Mzg2MywiZXhwIjoyMDYzOTQ5ODYzfQ.KU6ccg8av6uXEZNeMNuy7Qny_o3W93xpM45KLFZA780'; // use service role key for server-side
const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;
const {buildFFmpegCommand} = require('./ffmpegUtils'); // Assuming you have a separate module for FFmpeg commands

const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

// Setup multer storage
const storage = multer.memoryStorage();
const upload = multer({ storage });
// 🔐 1. Login user with OTP magic link

app.post( '/login', async (req, res) => {
  const { email } = req.body;

  const { error } = await supabase.auth.signInWithOtp({ email });
  if (error) return res.status(400).json({ error: error.message });

  res.json({ message: 'Magic link sent to email!'});
});

// 🔄 2. Save edit job (watermark, thumbnail, etc.)
app.post('/save-job', async (req, res) => {
  const { user_id, video_url, edit_type } = req.body;

  const { error } = await supabase.from('jobs').insert([
    {
      user_id,
      video_url,
      edit_type,
    },
  ]);

  if (error) return res.status(500).json({ error: error.message });
  res.json({ message: 'Job saved successfully!' });
});

// 📜 3. Get user job history
app.get('/jobs/:userId', async (req, res) => {
  const { userId } = req.params;

  const { data, error } = await supabase
    .from('jobs')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// ✅ This must match exactly what frontend sends:
app.post('/api/upload', upload.single('video'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

  const ext = path.extname(req.file.originalname);
  const fileName = `${uuidv4()}${ext}`;

  const { data, error } = await supabase.storage
    .from('videos') // your bucket name
    .upload(fileName, req.file.buffer, {
      contentType: req.file.mimetype,
      upsert: true,
    });

  if (error) {
    console.error('Upload error:', error);
    return res.status(500).json({ error: 'Upload to Supabase failed' });
  }

  const { data: publicUrl } = supabase
    .storage
    .from('videos')
    .getPublicUrl(fileName);

  res.json({ id: fileName, url: publicUrl.publicUrl });
});


// Serve static files
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// const buildFFmpegCommand = (inputPath, outputPath) => {
//   return `ffmpeg -i "${inputPath}" -c:v libx264 -preset fast -crf 22 -c:a aac "${outputPath}"`;
// };
// app.post('/api/edit/:videoId', async (req, res) => {
//   const { videoId } = req.params;
//   const { startTime, endTime, mute, overlayText, generateThumbnail } = req.body;
//   const inputPath = `uploads/${videoId}.mp4`;
//   const outputPath = `uploads/${videoId}_edited.mp4`;
//   const thumbnailPath = `uploads/${videoId}_thumb.jpg`;

//   const ffmpegCmd = buildFFmpegCommand({
//     input: inputPath,
//     output: outputPath,
//     startTime,
//     endTime,
//     mute,
//     overlayText,
//   });

//   try {
//     await execPromise(ffmpegCmd);
//     if (generateThumbnail) {
//       const thumbCmd = `ffmpeg -i ${outputPath} -ss 00:00:01.000 -vframes 1 ${thumbnailPath}`;
//       await execPromise(thumbCmd);
//       return res.json({ resultUrl: `http://localhost:5000/${thumbnailPath}`, isThumbnail: true });
//     }
//     res.json({ resultUrl: `http://localhost:5000/${outputPath}`, isThumbnail: false });
//   } catch (err) {
//     console.error('Error processing video:', err);
//     res.status(500).json({ error: 'Video processing failed' });
//   }
// });

// function execPromise(cmd) {
//   return new Promise((resolve, reject) => {
//     exec(cmd, (err, stdout, stderr) => {
//       if (err) return reject(err);
//       resolve({ stdout, stderr });
//     });
//   });
// }



function execPromise(cmd) {
  return new Promise((resolve, reject) => {
    exec(cmd, (err, stdout, stderr) => {
      if (err) return reject(err);
      resolve({ stdout, stderr });
    });
  });
}
const addWatermark = (inputPath, outputPath, watermarkPath) => {
  return new Promise((resolve, reject) => {
    ffmpeg(inputPath)
      .input(watermarkPath)
      .complexFilter(['overlay=10:10'])
      .output(outputPath)
      .on('end', () => resolve('Watermark added'))
      .on('error', (err) => reject(err))
      .run();
  });
};
app.post('/api/edit/:videoId', async (req, res) => {
  const { videoId } = req.params;
  const { startTime, endTime, mute, overlayText, generateThumbnail } = req.body;

  // Ensure videoId is clean
  const cleanVideoId = videoId.replace(/\.mp4$/, '');

  const { data: publicUrlData, error: publicUrlError } = supabase
    .storage
    .from('videos')
    .getPublicUrl(`${cleanVideoId}.mp4`);

  if (publicUrlError || !publicUrlData?.publicUrl) {
    return res.status(400).json({ error: 'Invalid Supabase video URL' });
  }

  const inputTemp = tmp.tmpNameSync({ postfix: '.mp4' });
  const outputTemp = tmp.tmpNameSync({ postfix: '_edited.mp4' });
  const thumbTemp = tmp.tmpNameSync({ postfix: '_thumb.jpg' });

  try {
    const videoData = await axios.get(publicUrlData.publicUrl, { responseType: 'arraybuffer' });
    fs.writeFileSync(inputTemp, videoData.data);

    // Build and execute FFmpeg command
    const ffmpegCmd = buildFFmpegCommand({
      input: inputTemp,
      output: outputTemp,
      startTime,
      endTime,
      mute,
      overlayText,
    });

    await execPromise(ffmpegCmd);

    // Thumbnail generation
    if (generateThumbnail) {
      const thumbCmd = `ffmpeg -i "${outputTemp}" -ss 00:00:01.000 -vframes 1 "${thumbTemp}"`;
      await execPromise(thumbCmd);

      const thumbBuffer = fs.readFileSync(thumbTemp);

      await supabase.storage.from('videos').upload(`${cleanVideoId}_thumb.jpg`, thumbBuffer, {
        contentType: 'image/jpeg',
        upsert: true,
      });

      const { data: thumbPublic } = supabase.storage
        .from('videos')
        .getPublicUrl(`${cleanVideoId}_thumb.jpg`);

      return res.json({ resultUrl: thumbPublic.publicUrl, isThumbnail: true });
    }

    // Upload edited video
    const editedBuffer = fs.readFileSync(outputTemp);
    await supabase.storage.from('videos').upload(`${cleanVideoId}_edited.mp4`, editedBuffer, {
      contentType: 'video/mp4',
      upsert: true,
    });

    const { data: editedPublic } = supabase.storage
      .from('videos')
      .getPublicUrl(`${cleanVideoId}_edited.mp4`);

    res.json({ resultUrl: editedPublic.publicUrl, isThumbnail: false });

  } catch (err) {
    console.error('Error processing video:', err);
    res.status(500).json({ error: 'Video processing failed' });
  } finally {
    // Optionally clean up temporary files
    try { fs.unlinkSync(inputTemp); } catch (_) {}
    try { fs.unlinkSync(outputTemp); } catch (_) {}
    try { fs.unlinkSync(thumbTemp); } catch (_) {}
  }
});


const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
