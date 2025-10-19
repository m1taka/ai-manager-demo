const express = require('express');
const router = express.Router();
const demoData = require('../config/demoData');

// GET /api/projects - Get all projects
router.get('/', (req, res) => {
  try {
    res.json({
      success: true,
      data: demoData.projects,
      count: demoData.projects.length
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch projects' 
    });
  }
});

// GET /api/projects/:id - Get single project
router.get('/:id', (req, res) => {
  try {
    const project = demoData.projects.find(proj => proj._id === req.params.id);
    if (!project) {
      return res.status(404).json({ 
        success: false, 
        error: 'Project not found' 
      });
    }
    res.json({
      success: true,
      data: project
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch project' 
    });
  }
});

// POST /api/projects - Add new project (demo)
router.post('/', (req, res) => {
  try {
    const { title, description, priority, budget, manager, plannedEndDate } = req.body;
    
    const newProject = {
      _id: `proj${Date.now()}`,
      title,
      description,
      status: 'planning',
      priority,
      budget: parseFloat(budget),
      spent: 0,
      startDate: new Date(),
      plannedEndDate: new Date(plannedEndDate),
      endDate: null,
      manager,
      team: []
    };

    res.status(201).json({
      success: true,
      message: 'Project created successfully (demo mode)',
      data: newProject
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: 'Failed to create project' 
    });
  }
});

// PUT /api/projects/:id - Update project (demo)
router.put('/:id', (req, res) => {
  try {
    const project = demoData.projects.find(proj => proj._id === req.params.id);
    if (!project) {
      return res.status(404).json({ 
        success: false, 
        error: 'Project not found' 
      });
    }

    res.json({
      success: true,
      message: 'Project updated successfully (demo mode)',
      data: { ...project, ...req.body }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: 'Failed to update project' 
    });
  }
});

// DELETE /api/projects/:id - Delete project (demo)
router.delete('/:id', (req, res) => {
  try {
    const project = demoData.projects.find(proj => proj._id === req.params.id);
    if (!project) {
      return res.status(404).json({ 
        success: false, 
        error: 'Project not found' 
      });
    }

    res.json({
      success: true,
      message: 'Project deleted successfully (demo mode)'
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: 'Failed to delete project' 
    });
  }
});

// GET /api/projects/stats - Get project statistics
router.get('/stats/overview', (req, res) => {
  try {
    res.json({
      success: true,
      data: demoData.projectStats.overview
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch project stats' 
    });
  }
});

// PUT /api/projects/:id/status - Update project status
router.put('/:id/status', (req, res) => {
  try {
    const project = demoData.projects.find(proj => proj._id === req.params.id);
    if (!project) {
      return res.status(404).json({ 
        success: false, 
        error: 'Project not found' 
      });
    }

    const { status } = req.body;
    
    res.json({
      success: true,
      message: 'Project status updated successfully (demo mode)',
      data: { ...project, status }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: 'Failed to update project status' 
    });
  }
});

module.exports = router;