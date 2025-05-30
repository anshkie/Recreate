
---

# 🎬 Full-Stack Video Editor Web App

This is a complete Full-Stack Video Editing Web Application where creators can upload videos, apply edits, and get downloadable results. It includes user authentication, job history tracking, and video processing using FFmpeg.

---

## 🚀 How to Run the Project (Windows)

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/video-editor-app.git
cd video-editor-app

---

### 2. Install FFmpeg on Windows

1. Download the latest static build from:  
   👉 https://ffmpeg.org/download.html → Windows → Gyan.dev build

2. Extract the downloaded ZIP.

3. Copy the full path to the `bin` folder (e.g., `C:\ffmpeg\bin`).

4. Add it to your systems **Environment Variables**:
   - Search for "Environment Variables" in Windows.
   - Edit the **Path** variable under **System Variables**.
   - Click **New**, paste the path, and click OK.

5. Verify installation by opening a new terminal and running:

``bash
ffmpeg -version
```

---

### 3. Setup Frontend

**Path:** `./Video`  
**Tech Stack:** React 19, Tailwind CSS, ShadCN UI

#### Install Dependencies

```bash
cd Video
npm install
```

#### Install Tailwind CSS

```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

Update `tailwind.config.js`:

```js
content: [
  "./index.html",
  "./src/**/*.{js,ts,jsx,tsx}",
],
```

Update `src/index.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

#### Install ShadCN UI

```bash
npm install @shadcn/ui
```

#### Run Frontend

```bash
npm run dev
```

---

### 4. Setup Backend

**Path:** `./backend`  
**Tech Stack:** Node.js, Express, FFmpeg, Supabase

#### Install Dependencies

```bash
cd backend
npm install
```

#### Run Backend Server

```bash
nodemon server.js
```

Ensure the `uploads` folder exists:

```bash
mkdir uploads
```

---

## 🧩 Focus Area

**🧠 Chosen Focus:** Full-Stack  
This project includes both frontend and backend, handling everything from UI interaction to video processing and database integration.

---

## 🌟 Bonus / Stretch Features

- ✅ User Login via Supabase  
- ✅ Save job history in Supabase DB  
- ✅ Downloadable final videos  
- ✅ Shareable links   
- ✅ Responsive UI with Tailwind CSS + ShadCN

---

## 📁 Project Structure

```
RECREATE/
│
├── backend/                     # Node.js backend
│   ├── server.js                # Main Express server
│   ├── ffmpegUtils.js           # FFmpeg processing logic
│   ├── uploads/                # Stores input/output files
│   └── package.json 
│
├── Video/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   └── ui/
│   │   │       ├── EditControls.jsx
│   │   │       ├── Navbar.jsx
│   │   │       ├── ResultViewer.jsx
│   │   │       ├── UploadForm.jsx
│   │   │       └── VideoPlayer.jsx
│   │   ├── lib/
│   │   ├── pages/
│       │   ├── Dashboard.jsx
│       │   ├── Home.jsx
│       │   ├── JobHistory.jsx
│       │   ├── Login.jsx
│       │   ├── NoFound.jsx
│       │   └── SaveJob.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── utils/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.jsx
│   ├── index.html
│   ├── tailwind.config.js
│   ├── package.json
│   └── README.md
```

---
