const express = require('express');
const router = express.Router();
const demoData = require('../config/demoData');

// GET /api/events - Get all events
router.get('/', (req, res) => {
  try {
    res.json({
      success: true,
      data: demoData.events,
      count: demoData.events.length
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch events' 
    });
  }
});

// GET /api/events/:id - Get single event
router.get('/:id', (req, res) => {
  try {
    const event = demoData.events.find(evt => evt._id === req.params.id);
    if (!event) {
      return res.status(404).json({ 
        success: false, 
        error: 'Event not found' 
      });
    }
    res.json({
      success: true,
      data: event
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch event' 
    });
  }
});

// POST /api/events - Add new event
router.post('/', (req, res) => {
  try {
    const { title, description, date, time, venue, capacity, ticketPrice, category } = req.body;
    
    const newEvent = {
      _id: `evt${Date.now()}`,
      title,
      description,
      date: new Date(date),
      time,
      venue,
      capacity: parseInt(capacity) || 100,
      ticketPrice: parseFloat(ticketPrice) || 0,
      ticketsSold: 0,
      category: category || 'Other',
      status: 'upcoming',
      organizer: 'Restaurant Manager',
      attendees: [],
      createdAt: new Date()
    };

    res.status(201).json({
      success: true,
      message: 'Event created successfully (demo mode)',
      data: newEvent
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: 'Failed to create event' 
    });
  }
});

// PUT /api/events/:id - Update event
router.put('/:id', (req, res) => {
  try {
    const event = demoData.events.find(evt => evt._id === req.params.id);
    if (!event) {
      return res.status(404).json({ 
        success: false, 
        error: 'Event not found' 
      });
    }

    const updatedEvent = { ...event, ...req.body, updatedAt: new Date() };
    
    res.json({
      success: true,
      message: 'Event updated successfully (demo mode)',
      data: updatedEvent
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: 'Failed to update event' 
    });
  }
});

// DELETE /api/events/:id - Delete event
router.delete('/:id', (req, res) => {
  try {
    const event = demoData.events.find(evt => evt._id === req.params.id);
    if (!event) {
      return res.status(404).json({ 
        success: false, 
        error: 'Event not found' 
      });
    }

    res.json({
      success: true,
      message: 'Event deleted successfully (demo mode)'
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: 'Failed to delete event' 
    });
  }
});

// GET /api/events/upcoming - Get upcoming events
router.get('/filter/upcoming', (req, res) => {
  try {
    const now = new Date();
    const upcomingEvents = demoData.events.filter(event => 
      new Date(event.date) > now
    );
    
    res.json({
      success: true,
      data: upcomingEvents,
      count: upcomingEvents.length
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch upcoming events' 
    });
  }
});

// GET /api/events/category/:category - Get events by category
router.get('/category/:category', (req, res) => {
  try {
    const events = demoData.events.filter(event => 
      event.category.toLowerCase() === req.params.category.toLowerCase()
    );
    
    res.json({
      success: true,
      data: events,
      count: events.length
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch events by category' 
    });
  }
});

// PUT /api/events/:id/status - Update event status
router.put('/:id/status', (req, res) => {
  try {
    const event = demoData.events.find(evt => evt._id === req.params.id);
    if (!event) {
      return res.status(404).json({ 
        success: false, 
        error: 'Event not found' 
      });
    }

    const { status } = req.body;
    
    res.json({
      success: true,
      message: 'Event status updated successfully (demo mode)',
      data: { ...event, status, updatedAt: new Date() }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: 'Failed to update event status' 
    });
  }
});

module.exports = router;