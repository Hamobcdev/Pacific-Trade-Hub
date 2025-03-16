const express = require('express');
const router = express.Router();
const axios = require('axios');

// This would be your User model when you set up a database
// const User = require('../models/User');

// Route to handle Google OAuth token verification
router.post('/auth/google', async (req, res) => {
  const { token } = req.body;
  
  try {
    // Get user info from Google using the access token
    const response = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    const userData = response.data;
    const { sub: googleId, email, name, picture } = userData;
    
    // Here you would normally check if the user exists in your database
    // and create them if they don't
    
    // For now, we'll just return the Google user data
    // In a real implementation, you would:
    // 1. Check if user exists in database
    // 2. Create user if they don't exist
    // 3. Generate a JWT or session for authentication
    
    res.status(200).json({ 
      success: true, 
      user: { 
        googleId,
        name, 
        email,
        profilePicture: picture
      } 
    });
  } catch (error) {
    console.error('Error verifying Google token:', error);
    res.status(401).json({ success: false, message: 'Invalid token' });
  }
});

module.exports = router;