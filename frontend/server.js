const express = require('express');
const cors = require('cors');
const multer = require('multer');
const ffmpeg = require('fluent-ffmpeg'); // Përdorim këtë bibliotekë për FFmpeg
const path = require('path'); // Shtoni këtë për të punuar me rrugët

const app = express();
const port = 8001; // Përdorim portin 8001 ose cilindo tjetër

// Konfiguroni CORS
app.use(cors());

// Konfiguroni multer për ngarkimin e skedarëve
const upload = multer({ 
  dest: 'uploads/', // Skedarët e ngarkuar do të ruhen këtu
  limits: { fileSize: 100 * 1024 * 1024 }, // Kufizoni madhësinë e skedarit në 100MB
});

// Rruga për ngarkimin e skedarëve
app.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  // Shkruani logjikën për të trajtuar skedarin e ngarkuar
  const tempPath = req.file.path;
  const outputPath = path.join(__dirname, 'output.wav'); // Rruga për skedarin e daljes

  // Përdorni ffmpeg për të konvertuar skedarin
  ffmpeg(tempPath)
    .toFormat('wav')
    .on('end', () => {
      res.send('File uploaded and converted successfully!');
    })
    .on('error', (err) => {
      console.error('Error:', err);
      res.status(500).send('Error processing file.');
    })
    .save(outputPath);
});

// Nisni serverin
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
