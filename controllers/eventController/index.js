const events = require('../../models/event');


module.exports = {
    async createEvent(req, res) {
        try {
          const eventData = req.body;
          const newEvent = new events(eventData);
          await newEvent.save();
          res.status(201).json(newEvent);
        } catch (error) {
          res.status(500).json({ message: error.message });
        }
      },

      async getAllEvents(req, res) {
        try {
            const event = await events.find();
            res.status(200).json(event);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    async getEventById(req, res) {
        try {
            const event = await events.findById(req.params.id);
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
            const updatedEvent = await events.findByIdAndUpdate(req.params.id, req.body, { new: true });
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
            const deletedEvent = await events.findByIdAndDelete(req.params.id);
            if (!deletedEvent) {
                return res.status(404).json({ message: 'Event not found' });
            }
            res.status(200).json({ message: 'Event deleted successfully' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
   
          
  };


