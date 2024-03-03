// app.js (or index.js)

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const connectDB = require('./config/database');
const studentRoutes = require('./routes/studentRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();
const port = 3500;

// Connect to MongoDB
connectDB();

app.use(bodyParser.json());
app.use(cors());

// Routes
app.use('/api/student', studentRoutes);
app.use('/api/admin', adminRoutes);

app.listen(port, () => {
  console.log(`Express Listening on ${port}`);
});
