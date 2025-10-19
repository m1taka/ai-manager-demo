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
      _id: `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      title,
      description,
      date: new Date(date).toISOString(),
      time,
      venue,
      capacity: parseInt(capacity) || 100,
      ticketPrice: parseFloat(ticketPrice) || 0,
      ticketsSold: 0,
      category: category || 'Other',
      status: 'upcoming',
      organizer: 'Event Manager',
      attendees: [],
      createdAt: new Date().toISOString()
    };

    // Add to demo data array
    demoData.events.push(newEvent);

    res.status(201).json({
      success: true,
      message: 'Event created successfully',
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
    const eventIndex = demoData.events.findIndex(evt => evt._id === req.params.id);
    if (eventIndex === -1) {
      return res.status(404).json({ 
        success: false, 
        error: 'Event not found' 
      });
    }

    // Update event data
    const updatedEvent = {
      ...demoData.events[eventIndex],
      ...req.body,
      capacity: req.body.capacity ? parseInt(req.body.capacity) : demoData.events[eventIndex].capacity,
      ticketPrice: req.body.ticketPrice ? parseFloat(req.body.ticketPrice) : demoData.events[eventIndex].ticketPrice,
      updatedAt: new Date().toISOString()
    };

    // Replace in array
    demoData.events[eventIndex] = updatedEvent;
    
    res.json({
      success: true,
      message: 'Event updated successfully',
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
    const eventIndex = demoData.events.findIndex(evt => evt._id === req.params.id);
    if (eventIndex === -1) {
      return res.status(404).json({ 
        success: false, 
        error: 'Event not found' 
      });
    }

    // Remove from array
    const deletedEvent = demoData.events.splice(eventIndex, 1)[0];

    res.json({
      success: true,
      message: 'Event deleted successfully',
      data: deletedEvent
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
    const eventIndex = demoData.events.findIndex(evt => evt._id === req.params.id);
    if (eventIndex === -1) {
      return res.status(404).json({ 
        success: false, 
        error: 'Event not found' 
      });
    }

    const { status } = req.body;
    
    // Update event status
    demoData.events[eventIndex].status = status;
    demoData.events[eventIndex].updatedAt = new Date().toISOString();
    
    res.json({
      success: true,
      message: 'Event status updated successfully',
      data: demoData.events[eventIndex]
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: 'Failed to update event status' 
    });
  }
});

module.exports = router;