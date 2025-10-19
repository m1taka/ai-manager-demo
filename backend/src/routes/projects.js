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

// POST /api/projects - Add new project
router.post('/', (req, res) => {
  try {
    const { title, description, priority, budget, manager, plannedEndDate } = req.body;
    
    const newProject = {
      _id: `proj_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      title,
      description,
      status: 'planning',
      priority,
      budget: parseFloat(budget) || 0,
      spent: 0,
      startDate: new Date().toISOString(),
      plannedEndDate: new Date(plannedEndDate).toISOString(),
      endDate: null,
      manager,
      team: []
    };

    // Add to demo data array
    demoData.projects.push(newProject);

    res.status(201).json({
      success: true,
      message: 'Project created successfully',
      data: newProject
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: 'Failed to create project' 
    });
  }
});

// PUT /api/projects/:id - Update project
router.put('/:id', (req, res) => {
  try {
    const projectIndex = demoData.projects.findIndex(proj => proj._id === req.params.id);
    if (projectIndex === -1) {
      return res.status(404).json({ 
        success: false, 
        error: 'Project not found' 
      });
    }

    // Update project data
    const updatedProject = {
      ...demoData.projects[projectIndex],
      ...req.body,
      budget: req.body.budget ? parseFloat(req.body.budget) : demoData.projects[projectIndex].budget,
      spent: req.body.spent ? parseFloat(req.body.spent) : demoData.projects[projectIndex].spent
    };

    // Replace in array
    demoData.projects[projectIndex] = updatedProject;

    res.json({
      success: true,
      message: 'Project updated successfully',
      data: updatedProject
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: 'Failed to update project' 
    });
  }
});

// DELETE /api/projects/:id - Delete project
router.delete('/:id', (req, res) => {
  try {
    const projectIndex = demoData.projects.findIndex(proj => proj._id === req.params.id);
    if (projectIndex === -1) {
      return res.status(404).json({ 
        success: false, 
        error: 'Project not found' 
      });
    }

    // Remove from array
    const deletedProject = demoData.projects.splice(projectIndex, 1)[0];

    res.json({
      success: true,
      message: 'Project deleted successfully',
      data: deletedProject
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
    const projectIndex = demoData.projects.findIndex(proj => proj._id === req.params.id);
    if (projectIndex === -1) {
      return res.status(404).json({ 
        success: false, 
        error: 'Project not found' 
      });
    }

    const { status } = req.body;
    
    // Update project status
    demoData.projects[projectIndex].status = status;
    
    // If project is completed, set end date
    if (status === 'completed') {
      demoData.projects[projectIndex].endDate = new Date().toISOString();
    }
    
    res.json({
      success: true,
      message: 'Project status updated successfully',
      data: demoData.projects[projectIndex]
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: 'Failed to update project status' 
    });
  }
});

module.exports = router;