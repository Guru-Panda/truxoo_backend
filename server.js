const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();

app.use(cors());
app.use(express.json());

// Ensure uploads directory exists
if (!fs.existsSync('uploads')) fs.mkdirSync('uploads');

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, './uploads/'),
  filename: (req, file, cb) => {
    const uniqueName = `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

const upload = multer({ storage });

// Driver Registration Endpoint
app.post(
  '/api/driver/register',
  upload.fields([
    { name: 'truck_photo', maxCount: 1 },
    { name: 'pan_aadhar_photo', maxCount: 1 },
    { name: 'license_photo', maxCount: 1 },
    { name: 'driver_photo', maxCount: 1 }
  ]),
  (req, res) => {
    try {
      const formData = req.body;
      const files = {};
      for (const key in req.files) {
        files[key] = req.files[key][0].filename;
      }

      console.log('📥 New Driver Registered:');
      console.log('📝 Form Data:', formData);
      console.log('📂 Files:', files);

      // You can insert database save logic here if needed

      res.status(200).json({
        message: 'Driver registration successful ✅',
        receivedData: formData,
        uploadedFiles: files
      });
    } catch (error) {
      console.error('❌ Registration Error:', error);
      res.status(500).json({ message: 'Registration failed', error: error.message });
    }
  }
);

// Serve uploaded files for browser access
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.listen(3000, '0.0.0.0', () => {
  console.log('🚀 Server running on http://localhost:3000');
});
