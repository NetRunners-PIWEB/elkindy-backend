const Event = require('../../models/event');

module.exports = {

    async createEvent(req, res) {
        try {
            const eventData = req.body;
            const newEvent = new Event(eventData);
            await newEvent.save();
            res.status(201).json(newEvent);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    async listEvents(req, res) {
        try {
            const events = await Event.find();
            res.status(200).json(events);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    async getEventById(req, res) {
        try {
            const event = await Event.findById(req.params.id);
            if (!event) {
                return res.status(404).json({ message: 'Event not found' });
            }
            res.status(200).json(event);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    async updateEvent(req, res) {
        try {
            const updatedEvent = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
            if (!updatedEvent) {
                return res.status(404).json({ message: 'Event not found' });
            }
            res.status(200).json(updatedEvent);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    async deleteEvent(req, res) {
        try {
            const deletedEvent = await Event.findByIdAndDelete(req.params.id);
            if (!deletedEvent) {
                return res.status(404).json({ message: 'Event not found' });
            }
            res.status(200).json({ message: 'Event deleted successfully' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
          
  };
    
