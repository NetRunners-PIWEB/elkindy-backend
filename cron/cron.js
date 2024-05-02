const cron = require("cron");
const https = require("https");
const Instrument = require("../models/instrument");
const User = require("../models/user");
const { getRecipientSocketId, io } = require("../socket/socket");

const URL = "https://threads-clone-9if3.onrender.com";

const job = new cron.CronJob("*/14 * * * * *", async function () {
  try {
    const instruments = await Instrument.find({
      status: "exchange",
    }).populate({ path:"author", select: "username _id" });
    console.log("there are instruments ");
    console.log(instruments);

    instruments.forEach(async (instrument) => {
      const recipientSocketId = await getRecipientSocketId(
        instrument.author.valueOf()
      );
      if (recipientSocketId) {
        io.to(recipientSocketId).emit("maintenanceReminder", { instrument });
      }
    });
  } catch (error) {
    console.error("Error sending maintenance reminders:", error);
  }
});

module.exports = job;
