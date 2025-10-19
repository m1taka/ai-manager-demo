const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' })); // Increased limit for AI requests

// Import routes
const employeeRoutes = require('./routes/employees');
const inventoryRoutes = require('./routes/inventory');
const projectRoutes = require('./routes/projects');
const financeRoutes = require('./routes/finance');
const dashboardRoutes = require('./routes/dashboard');
const eventRoutes = require('./routes/events');
const aiRoutes = require('./routes/ai');

// Use routes
app.use('/api/employees', employeeRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/finance', financeRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/ai', aiRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK',
    message: 'AI Manager Backend',
    timestamp: new Date().toISOString()
  });
});

// Default route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to AI Manager Backend API',
    endpoints: [
      '/api/employees',
      '/api/inventory',
      '/api/projects',
      '/api/finance',
      '/api/dashboard',
      '/api/events',
      '/api/health'
    ]
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal Server Error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`🚀 AI Manager Backend running on port ${PORT}`);
  console.log(`📊 Demo Mode - Using demo data`);
  console.log(`🌐 Access API at: http://localhost:${PORT}`);
});

module.exports = app;