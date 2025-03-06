// server.js
const express = require('express');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', userRoutes);

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
