const Event = require("../../models/event");
const User = require("../../models/user");
const nodemailer = require("nodemailer");
const axios = require("axios");
const cloudinary = require("../../cloudinaryConfig");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

module.exports = {
  async createEvent(req, res) {
    try {
      console.log("Received file:", req.file);
      const eventData = req.body;
    // Assuming participant IDs are passed as an array of strings in the request body
      const participantIds = req.body.participants || [];

     
    const newEvent = new Event({
      ...eventData,
      participants: participantIds, // Add participant IDs directly to the new event
    });

      if (req.file) {
        const result = await cloudinary.uploader.upload(req.file.path);
        newEvent.image = result.secure_url;
      }
      
 // Optionally, validate participant IDs against the database
 const validParticipants = await User.find({
  '_id': { $in: participantIds },
  'status': 'active' // Ensuring only active users are added
});

if (validParticipants.length !== participantIds.length) {
  return res.status(400).json({ message: "Some participants are invalid or inactive." });
}
      await newEvent.save();
      // Retrieve only active users
      const activeUsers = await User.find({ status: "active" });
      // const users = await User.find({});
      //const emailList = users.map((user) => user.email);
      const emailList = activeUsers.map((user) => user.email);

      //Configure the mail options
      let mailOptions = {
        from: process.env.EMAIL_USER,
        to: emailList,
        subject: `New Event: ${newEvent.title}`,
        html: `
            <div style="font-family: Arial, sans-serif; color: #333; padding: 20px; text-align: center;">
                <h2 style="color: #0056b3;">New Event Announcement</h2>
                <p>A new event titled <strong style="color: #4CAF50;">${
                  newEvent.title
                }</strong> will be held at <strong>${
          newEvent.location
        }</strong>.</p>
                <p><strong>Date:</strong> From <span style="color: #FF5722;">${newEvent.startDate.toDateString()}</span> to <span style="color: #FF5722;">${newEvent.endDate.toDateString()}</span></p>
                <p><strong>Time:</strong> Starting at <span style="color: #FF5722;">${
                  newEvent.startTime
                }</span></p>
                <p><strong>Event Details:</strong> ${newEvent.description}</p>
                <p>We look forward to seeing you there!</p>
                <p>Elkindy Conservatory Team</p>
            </div>
        `,
      };

      let transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
        tls: {
          rejectUnauthorized: false,
        },
      });

      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log("Error sending email: ", error);
        } else {
          console.log("Email sent: " + info.response);
        }
      });

      res.status(201).json(newEvent);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // async createEvent(req, res) {
  //     try {
  //         const eventData = req.body;
  //         if(req.file) {
  //             eventData.image = req.file.path;
  //         }
  //         const newEvent = new Event(eventData);
  //         await newEvent.save();
  //         res.status(201).json(newEvent);
  //     } catch (error) {
  //         res.status(500).json({ message: error.message });
  //     }
  // },

  // async createEvent(req, res) {
  //     try {
  //         const { eventData, ticketsData } = req.body;

  //         const newEvent = new Event(eventData);

  //         const createdTickets = [];

  //         for (const ticketData of ticketsData) {
  //             const newTicket = new Ticket(ticketData);
  //             newTicket.event = newEvent._id;
  //             // Save the ticket document
  //             await newTicket.save();
  //             createdTickets.push(newTicket);
  //         }
  //         // Associate the event with the created tickets
  //         newEvent.tickets = createdTickets.map(ticket => ticket._id);

  //         await newEvent.save();

  //         res.status(201).json({ event: newEvent, tickets: createdTickets });
  //     } catch (error) {
  //         res.status(500).json({ message: error.message });
  //     }
  // },

  async listEvents(req, res) {
    try {
      const events = await Event.find({ isArchived: false });
      res.status(200).json(events);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  async getEventById(req, res) {
    try {
      const event = await Event.findById(req.params.id);
      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }
      res.status(200).json(event);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  async updateEvent(req, res) {
    try {
      const updatedEvent = await Event.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );
      if (!updatedEvent) {
        return res.status(404).json({ message: "Event not found" });
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
        return res.status(404).json({ message: "Event not found" });
      }
      res.status(200).json({ message: "Event deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  async archiveEvent(req, res) {
    try {
      const { id } = req.params;
      const updatedEvent = await Event.findByIdAndUpdate(
        id,
        { $set: { isArchived: true, status: "Archived" } },
        { new: true }
      );
      if (!updatedEvent) {
        return res.status(404).json({ message: "Event not found" });
      }
      res.status(200).json(updatedEvent);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  async listArchivedEvents(req, res) {
    try {
      const archivedEvents = await Event.find({ isArchived: true });
      res.status(200).json(archivedEvents);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  async restoreEvent(req, res) {
    try {
      const { id } = req.params;
      const updatedEvent = await Event.findByIdAndUpdate(
        id,
        { $set: { isArchived: false, status: "Active" } },
        { new: true }
      );
      if (!updatedEvent) {
        return res.status(404).json({ message: "Event not found" });
      }
      res.status(200).json(updatedEvent);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  async getMonthlyEventCount(req, res) {
    try {
      const monthlyEventCount = await Event.aggregate([
        {
          $match: {
            isArchived: false, // Only consider active events
          },
        },
        {
          $group: {
            _id: {
              month: { $month: "$startDate" }, // Extract month from startDate
              year: { $year: "$startDate" }, // Extract year from startDate
            },
            count: { $sum: 1 }, // Count events in each group
          },
        },
        {
          $project: {
            _id: 0,
            month: "$_id.month", // Rename _id.month to month
            year: "$_id.year", // Include year
            count: 1,
          },
        },
      ]);

      // Map month numbers to month names
      const monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];

      // Map month numbers to month names and include year
      const monthlyEventCountWithNames = monthlyEventCount.map((item) => ({
        month: monthNames[item.month - 1],
        year: item.year,
        count: item.count,
      }));

      res.status(200).json(monthlyEventCountWithNames);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  async searchLocation(req, res) {
    const { address } = req.query;
    if (!address) {
      return res.status(400).json({ message: "No address provided" });
    }

    try {
      const response = await axios.get(
        `https://us1.locationiq.com/v1/search.php?key=${
          process.env.LOCATIONIQ_TOKEN
        }&q=${encodeURIComponent(address)}&format=json`
      );
      const locationData = response.data;
      res.status(200).json(locationData);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};
