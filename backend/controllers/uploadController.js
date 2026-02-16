const path = require('path');
const fs = require('fs');

// Upload image
exports.uploadImage = (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded. Ensure the request is multipart/form-data and the field name is "image".' });
    }

    // File check
    const filePath = req.file.path;
    if (!fs.existsSync(filePath)) {
      return res.status(500).json({ success: false, message: 'File upload failed - file not saved to disk' });
    }

    const url = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    
    res.status(201).json({ success: true, url });
  } catch (error) {
    next(error);
  }
};
