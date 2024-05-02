const Instrument = require("../../models/instrument.js");
const UserSearch = require("../../models/userSearch.js");
const User = require("../../models/user.js");
const Session = require("../../models/session.js");
const { notifyUsers } = require("../../socket/socket.js");
const {
  allInstrumentsPipeline,
  instrumentPipeline,
} = require("../../utils/pipelines.js");
const { formatSort } = require("../../utils/formatQueries.js");
const mongoose = require("mongoose");
const cloudinary = require("cloudinary").v2;
const axios = require("axios");

class InstrumentController {
  static async getAllInstruments(req, res, next) {
    const sortBy = formatSort(req.query.sort);
    const status = req.query.status;
    const age = req.query.age;
    const pageIndex = req.query.pageNumber;
    const size = req.query.pageSize || 10;
    try {
      let allInstruments = await Instrument.aggregate(
        allInstrumentsPipeline(req.user?.id, status, age, sortBy, null)
      ).exec();

      const instruments = allInstruments.filter(
        (instrument) =>
          instrument.author[0]._id.toString() !== req.user._id.toString()
      );
      res.status(200).json({
        success: true,
        instruments,
        total_results: instruments.length,
      });
    } catch (err) {
      next(err);
      res.status(500).json({
        success: false,
      });
    }
  }
  static async addInstrument(req, res, next) {
    try {
      const { title, type, brand, details, condition, price, status, age } =
        req.body;
      let { img } = req.body;
      const author = req.user?.id;
      if (img) {
        const uploadedResponse = await cloudinary.uploader.upload(img);
        img = uploadedResponse.secure_url;
      }
      console.log(req.body);
      const instrument = new Instrument({
        author,
        title,
        type,
        brand,
        details,
        price,
        condition,
        status,
        img,
        itemStatus: "active",
        age,
      });
      await instrument.save();
      await notifyUsers(instrument);
      res.status(201).json({
        success: true,
      });
    } catch (err) {
      res.status(500).json({
        success: false,
      });
      next(err);
    }
  }
  static async addUserLike(req, res, next) {
    try {
      const id = req.params.id;
      const instrument = await Instrument.findById(id);
      if (instrument) {
        let liked = false;
        const userIndex = instrument.likes.indexOf(req.user.id);
        if (userIndex !== -1) {
          instrument.likes.splice(userIndex, 1);
          instrument.likeScore -= 1;
        } else {
          instrument.likes.push(req.user.id);
          liked = true;
          instrument.likeScore += 1;
        }
        await instrument.save();
        res.status(200).json({
          success: true,
          likeScore: instrument.likeScore,
          liked,
        });
      } else {
        return next(new ErrorResponse("Instrument not found", 404));
      }
    } catch (err) {
      next(err);
    }
  }
  static async getInstrument(req, res, next) {
    try {
      const instrumentId = req.params.id
        ? new mongoose.Types.ObjectId(req.params.id)
        : "";
      const userId = new mongoose.Types.ObjectId(req.user._id);

      const aggregate = await Instrument.aggregate(
        instrumentPipeline(instrumentId, userId)
      );
      const [instrument] = await Instrument.populate(aggregate, {
        path: "",
      });
      if (!instrument) {
        return res
          .status(404)
          .json({ success: false, message: "Instrument not found" });
      }
      res.status(200).json({
        success: true,
        instrument: instrument,
      });
    } catch (err) {
      res.status(500).json({
        success: false,
      });
      next(err);
    }
  }

  static async searchInstrument(req, res, next) {
    try {
      const searchQuery = req.query.query;
      const sortBy = formatSort(req.query.sort);
      const status = req.query.status;
      const age = req.query.age;

      let instruments = await Instrument.aggregate(
        allInstrumentsPipeline(
          req.user?.id || null,
          status,
          age,
          sortBy,
          searchQuery
        )
      ).exec();
      res.status(200).json({
        success: true,
        instruments,
        total_results: instruments.length,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
      });
      next(error);
    }
  }
  static async getUserInstruments(req, res, next) {
    try {
      const userId = req.user.id;
      const instruments = await Instrument.find({ author: userId });
      res.status(200).json({
        success: true,
        instruments,
        total_results: instruments.length,
      });
    } catch (err) {
      next(err);
      res.status(500).json({
        success: false,
      });
    }
  }
  static async deleteInstrument(req, res, next) {
    try {
      const instrumentId = req.params.id;
      let instrument = await Instrument.findById(instrumentId);

      if (!instrument) {
        return next(new ErrorResponse("Instrument not found", 404));
      }
      instrument.itemStatus = "deleted";
      await instrument.save();

      res.status(200).json({
        success: true,
      });
    } catch (err) {
      next(err);
    }
  }

  static async addUserSearch(req, res, next) {
    try {
      const { searchQuery, status, age } = req.body;
      const userId = req.user?.id;
      const search = new UserSearch({ userId, searchQuery, status, age });
      await search.save();
      res.status(201).json({
        success: true,
        userSearch: search,
      });
    } catch (err) {
      next(err);
    }
  }
  static async getUserSearches(req, res, next) {
    try {
      const userId = req.user._id;
      const searches = await UserSearch.find({ userId: userId });
      res.status(200).json({
        success: true,
        data: searches,
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
  static async deleteUserSearch(req, res, next) {
    try {
      const searchId = req.params.id;
      const search = await UserSearch.findById(searchId);
      if (!search) {
        return res
          .status(404)
          .json({ success: false, message: "Search not found" });
      }
      await UserSearch.findByIdAndDelete(searchId);
      res.status(200).json({ success: true });
    } catch (err) {
      next(err);
    }
  }
  static async callFlaskAPI(req, res) {
    try {
      const inputData = req.body;
      const studentId = req.params.id;
      const student = await User.findById(studentId, {
        _id: 0,
        Mjob: 1,
        Fjob: 1,
        famsize: 1,
        Pstatus: 1,
        Medu: 1,
        Fedu: 1,
        activities: 1,
      });
      if (!student) {
        return res.status(404).json({ error: "Student not found" });
      }
      const sessions = await Session.find({ "attendance.student": studentId });
      let absenceCount = 0;
      sessions.forEach((session) => {
        session.attendance.forEach((record) => {
          if (
            record.student.toString() === studentId &&
            record.status === "Absent"
          ) {
            absenceCount++;
          }
        });
      });
      const originalData = {
        school: "GP",
        sex: "F",
        age: 15,
        address: "U",
        famsize: student.famsize,
        Pstatus: student.Pstatus,
        Medu: student.Medu,
        Fedu: student.Fedu,
        Mjob: student.Mjob,
        Fjob: student.Fjob,
        reason: "course",
        guardian: "mother",
        traveltime: 1,
        studytime: 3,
        failures: 3,
        schoolsup: "no",
        famsup: "yes",
        paid: "no",
        activities: student.activities.toLowerCase(),
        nursery: "yes",
        higher: "yes",
        internet: "no",
        romantic: "yes",
        famrel: 5,
        freetime: 3,
        goout: 3,
        Dalc: 5,
        Walc: 5,
        health: 1,
        absences: absenceCount,
      };
      const flaskResponse = await axios.post(
        "https://predictionlr.onrender.com/predict",
        originalData
      );
      res.status(200).json(flaskResponse.data);
    } catch (error) {
      console.error("Error calling Flask API:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  static async AddStudentDetails(req, res) {
    const { id } = req.params;
    console.log(id);
    const { Mjob, Fjob, activities, famsize, Pstatus, Medu, Fedu } = req.body;

    try {
      const updatedStudent = await User.findByIdAndUpdate(
        id,
        {
          Mjob,
          Fjob,
          activities,
          famsize,
          Pstatus,
          Medu,
          Fedu,
        },
        { new: true }
      );

      if (!updatedStudent) {
        return res.status(404).json({ error: "Student not found" });
      }

      return res.status(200).json(updatedStudent);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
}

module.exports = InstrumentController;
