const Reservation = require("../../models/reservation");
const Event = require("../../models/event");
const Ticket = require("../../models/ticket");
const User = require("../../models/user");
const PDFDocument = require("pdfkit");
const nodemailer = require("nodemailer");
const QRCode = require("qrcode");
const fs = require("fs");
const path = require("path");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const generateQR = async (text) => {
  try {
    return await QRCode.toDataURL(text);
  } catch (err) {
    console.error("Error generating QR code", err);
    throw err;
  }
};

const createPDF = async (reservation, pdfPath) => {
  const event = await Event.findById(reservation.event);
  if (!event) {
    throw new Error("Event not found");
  }
  const blueColor = "#0C4B65";
  const regularFont = "Helvetica";
  const boldFont = "Helvetica-Bold";
  const doc = new PDFDocument();

  doc.lineWidth(2).rect(50, 50, 530, 200).stroke();

  // Add images
  doc.image(path.join(__dirname, "..", "..", "images", "Kindy.png"), 460, 60, {
    width: 100,
  });
  doc.image(path.join(__dirname, "..", "..", "images", "img1.jpg"), 50, 50, {
    width: 100,
    height: 200,
  });

  doc
    .fillColor(blueColor)
    .font(boldFont)
    .fontSize(22)
    .text(event.title, 150, 80, { align: "center" });

  doc.fillColor("black").font(regularFont).fontSize(12);

  const textStartPositionX = 160;

  doc.font(boldFont).text("Event Type: ", textStartPositionX, 120);
  doc.font(regularFont).text(event.eventType, textStartPositionX + 90, 120);

  doc.font(boldFont).text("Start Date: ", textStartPositionX, 140);
  doc
    .font(regularFont)
    .text(event.startDate.toLocaleDateString(), textStartPositionX + 80, 140);

  doc.font(boldFont).text("Start Time: ", textStartPositionX, 160);
  doc.font(regularFont).text(event.startTime, textStartPositionX + 80, 160);
  doc.font(boldFont).text("Your Name: ", textStartPositionX, 180);
  doc
    .font(regularFont)
    .text(
      `${reservation.externalUser.firstName} ${reservation.externalUser.lastName}`,
      textStartPositionX + 80,
      180
    );

  const textRightSideX = 390;

  doc.font(boldFont).text("Your Ticket Type: ", textRightSideX, 120);
  doc.font(regularFont).text(reservation.ticketType, textRightSideX + 120, 120);

  doc.font(boldFont).text("End Date: ", textRightSideX, 140);
  doc
    .font(regularFont)
    .text(event.endDate.toLocaleDateString(), textRightSideX + 80, 140);
  doc.font(boldFont).text("End Time: ", textRightSideX, 160);
  doc.font(regularFont).text(event.endTime, textRightSideX + 80, 160);

  doc
    .font(boldFont)
    .fontSize(15)
    .text(`Will be Held At: ${event.location}`, 150, 200, { align: "center" });

  const borderX = 70;
  const borderY = 50;
  const borderWidth = 500;
  const borderHeight = 200;

  const qrData =
    `Event: ${event.title}\n` +
    `Description: ${event.description}\n` +
    `You'll be participating in: ${event.eventType}\n` +
    `That Will Be Held On : ${event.startDate.toLocaleDateString()} at ${
      event.startTime
    }\n` +
    `Starting At: ${event.startTime}\n` +
    `Its Location is: ${event.location}\n` +
    `Attendee Name: ${reservation.externalUser.firstName} ${reservation.externalUser.lastName}\n` +
    `The Ticket Type you Got is: ${reservation.ticketType}\n` +
    `Maps: https://www.google.com/maps/place/Conservatoire+Elkindy/@36.8364135,10.1943598,15z/data=!4m6!3m5!1s0x12fd34ea97b45431:0x9fa628e4f017bd3f!8m2!3d36.8364135!4d10.1943598!16s%2Fg%2F113hv9ndm`;

  const qrCodeDataURL = await generateQR(qrData);

  const qrSize = 60;
  const qrMargin = 10;
  const qrPositionX = borderX + borderWidth - qrSize - qrMargin;
  const qrPositionY = borderY + borderHeight - qrSize - qrMargin;

  doc.image(qrCodeDataURL, qrPositionX, qrPositionY, { width: qrSize });

  doc.end();

  doc.pipe(fs.createWriteStream(pdfPath));
};

module.exports = {
  async createReservation(req, res) {
    try {
      // Get reservation details from the request body
      const {
        firstName,
        lastName,
        email,
        phoneNumber,
        ticketType,
        ticketCount,
        event,
        isGuest,
        username,
      } = req.body;

      // Find the event for which the reservation is being made
      const foundEvent = await Event.findById(event);
      if (!foundEvent) {
        return res.status(404).json({ message: "Event not found" });
      }

      // Find the ticket type for the reservation
      const ticket = await Ticket.findOne({
        event: foundEvent._id,
        ticketType,
      });
      if (!ticket) {
        return res
          .status(404)
          .json({ message: "Ticket type not found for this event" });
      }

      // Check if the requested number of tickets is available
      if (ticket.quantity < ticketCount) {
        return res
          .status(400)
          .json({ message: "Not enough tickets available" });
      }

      // Decrement the event's capacity
      foundEvent.capacity -= ticketCount;
      await foundEvent.save();

      let user;

      if (!isGuest && email) {
        user = await User.findOne({ email });
        if (!user) {
          // Create a new user document
          user = new User({ firstName, lastName, email, phoneNumber });
          await user.save();
        }
      }

      // Create a new reservation document
      const newReservation = new Reservation({
        event: foundEvent._id,
        user: !isGuest ? (user ? user._id : null) : null,
        externalUser: isGuest
          ? { firstName, lastName, email, phoneNumber }
          : null,
        status: "confirmed",
        ticketType,
        ticketCount,
        isGuest,
      });

      await newReservation.save();

      // Generate and send the ticket
      const pdfPath = path.join(
        __dirname,
        "tickets",
        `ticket-${newReservation._id}.pdf`
      );
      await createPDF(newReservation, pdfPath);

      const dir = path.dirname(pdfPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      const doc = new PDFDocument();
      doc.pipe(fs.createWriteStream(pdfPath));
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

      let greeting;
      if (!isGuest) {
        // For internal users,
        greeting = `Dear ${username},`;
      } else {
        // For external users,
        greeting = `Dear ${firstName} ${lastName},`;
      }
      //    <p>Dear ${firstName} ${lastName},</p>
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Your Event Ticket",
        html: `
            ${greeting}
               <p>Your reservation for <strong>"${
                 foundEvent.title
               }"</strong> is done successfully.</p>
               <p>The event will be held on <strong>${foundEvent.startDate.toLocaleDateString()}</strong> at <strong>${
          foundEvent.location
        }</strong>, starting at <strong>${foundEvent.startTime}</strong>.</p>
               <p>You can find your ticket below.</p>
               <p>Best Regards,</p>
               <p><strong>El Kindy Conservatory</strong></p>
           `,
        attachments: [
          {
            filename: "ticket.pdf",
            path: pdfPath,
          },
        ],
      };

      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
          res.status(500).json({ message: "Error sending ticket." });
        } else {
          console.log("Email sent: " + info.response);
          res.status(201).json(newReservation);
        }
      });
    } catch (error) {
      console.error("Error creating reservation:", error);
      res.status(500).json({ message: error.message });
    }
  },

  async listReservations(req, res) {
    try {
      const reservations = await Reservation.find();
      res.status(200).json(reservations);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  async getReservationById(req, res) {
    try {
      const reservation = await Reservation.findById(req.params.id);
      if (!reservation) {
        return res.status(404).json({ message: "Reservation not found" });
      }
      res.status(200).json(reservation);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  async updateReservation(req, res) {
    try {
      const updatedReservation = await Reservation.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );
      if (!updatedReservation) {
        return res.status(404).json({ message: "Reservation not found" });
      }
      res.status(200).json(updatedReservation);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  async createPaymentIntent(req, res) {
    try {
      const { amount, email } = req.body;

      const paymentIntent = await stripe.paymentIntents.create({
        amount,
        currency: "usd",
        receipt_email: email,
        metadata: { email },
      });

      res.send({
        clientSecret: paymentIntent.client_secret,
      });
    } catch (error) {
      console.error("Error creating payment intent:", error);
      res.status(500).send(error.message);
    }
  },

  async deleteReservation(req, res) {
    try {
      const deletedReservation = await Reservation.findByIdAndDelete(
        req.params.id
      );
      if (!deletedReservation) {
        return res.status(404).json({ message: "Reservation not found" });
      }
      res.status(200).json({ message: "Reservation deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  async getReservationsCountByEvent(req, res) {
    try {
      const eventId = req.params.eventId;
      const reservationsCount = await Reservation.countDocuments({
        event: eventId,
      });
      res.status(200).json({ reservationsCount });
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  },

  async getReservationsByEventId(req, res) {
    try {
      const eventId = req.params.eventId;
      const reservations = await Reservation.find({ event: eventId }).select(
        "externalUser status ticketType _id"
      );

      const reservationDetails = reservations.map((res) => {
        const name = res.externalUser
          ? `${res.externalUser.firstName} ${res.externalUser.lastName}`
          : "Unavailable";
        return {
          id: res._id,
          name: name,
          email: res.externalUser?.email ?? "Unavailable",
          phoneNumber: res.externalUser?.phoneNumber ?? "Unavailable",
          status: res.status,
          ticketType: res.ticketType,
        };
      });

      res.json(reservationDetails);
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  },

  async participateInEvent(req, res) {
    try {
      const { username, email, eventId } = req.body;

      // Find the event for participation
      const event = await Event.findById(eventId);
      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }

      // Check event capacity
      if (event.capacity <= 0) {
        return res.status(400).json({ message: "Event is fully booked" });
      }

      // Check if the user exists in the database
      let user = await User.findOne({ email });
      if (!user) {
        return res
          .status(400)
          .json({ message: "User not registered. Please register first." });
      }
      // Update event's participants list
      if (!event.participants.includes(user._id)) {
        event.participants.push(user._id);
      } else {
        return res
          .status(400)
          .json({ message: "User already participating in this event" });
      }

      // Create a reservation
      const newReservation = new Reservation({
        user: user._id,
        event: event._id,
        status: "confirmed",
        isGuest: false,
      });
      await newReservation.save();

      // Decrease the event's capacity
      event.capacity -= 1;
      await event.save();

      // Sending confirmation email
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

      let mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Participation Confirmation",
        text: `Hello ${username},\n\nYou have successfully registered to participate in "${
          event.title
        }".\n\nEvent Details:\nDate: ${event.startDate.toLocaleDateString()}\nTime: ${
          event.startTime
        }\nLocation: ${event.location}\n\nBest Regards,\nEl Kindy Conservatory`,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log(error);
          return res.status(500).json({ message: "Error in sending email." });
        }
        console.log("Email sent: " + info.response);
        res
          .status(201)
          .json({ message: "Participation confirmed and email sent." });
      });
    } catch (error) {
      console.error("Error in participateInEvent:", error);
      res.status(500).json({ message: error.message });
    }
  },
};
