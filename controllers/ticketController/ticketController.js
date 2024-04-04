const Ticket = require('../../models/ticket');
const Event = require('../../models/event');

module.exports = {

//   async createTicket(req, res) {
//     try {
//         const ticketData = req.body;
//         const newTicket = new Ticket(ticketData);
//         await newTicket.save();
//         res.status(201).json(newTicket);
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// },
async createTicket(req, res) {
    try {
        const ticketData = req.body;
        const newTicket = new Ticket(ticketData);
        await newTicket.save();
        const eventId = ticketData.event;
        await Event.findByIdAndUpdate(eventId, { $push: { tickets: newTicket._id } });
        res.status(201).json(newTicket);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
},

async listTickets(req, res) {
    try {
        const tickets = await Ticket.find();
        res.status(200).json(tickets);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
},

async getTicketById(req, res) {
    try {
        const ticket = await Ticket.findById(req.params.id);
        if (!ticket) {
            return res.status(404).json({ message: 'Ticket not found' });
        }
        res.status(200).json(ticket);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
},

async updateTicket(req, res) {
    try {
        const updatedTicket = await Ticket.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedTicket) {
            return res.status(404).json({ message: 'Ticket not found' });
        }
        res.status(200).json(updatedTicket);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
},

// async deleteTicket(req, res) {
//     try {
//         const deletedTicket = await Ticket.findByIdAndDelete(req.params.id);
//         if (!deletedTicket) {
//             return res.status(404).json({ message: 'Ticket not found' });
//         }
//         res.status(200).json({ message: 'Ticket deleted successfully' });
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// },
async deleteTicket(req, res) {
    try {
        const deletedTicket = await Ticket.findByIdAndDelete(req.params.id);
        if (!deletedTicket) {
            return res.status(404).json({ message: 'Ticket not found' });
        }
        
        const eventId = deletedTicket.event;
        await Event.findByIdAndUpdate(eventId, { $pull: { tickets: deletedTicket._id } });

        res.status(200).json({ message: 'Ticket deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
},
async listTicketsByEventId(req, res) {
    try {
      const eventId = req.params.eventId;
      const tickets = await Ticket.find({ event: eventId });
      res.status(200).json(tickets);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
          
  };
    