const Feedback = require("../../models/feedback");
const Event = require("../../models/event");
const axios = require("axios");

//merging flask with node.js
const analyzeFeedback = async (feedbackData) => {
  try {
    const response = await axios.post(
      "http://127.0.0.1:8000/analyze",
      feedbackData
    );
    return response.data;
  } catch (error) {
    console.error("Error calling Flask sentiment analysis service:", error);
    throw error;
  }
};

module.exports = {
  //   async createFeedback(req, res) {
  //     try {
  //         const feedbackData = req.body;
  //         const newFeedback = new Feedback(feedbackData );
  //         await newFeedback.save();
  //         res.status(201).json(newFeedback);
  //         //res.status(201).json({ message: "Feedback created successfully", feedback });
  //     } catch (error) {
  //         res.status(500).json({ message: error.message });
  //     }
  // },

  async createFeedback(req, res) {
    try {
      const feedbackData = req.body;
      // Call analyzeFeedback to get sentiment analysis results
      const sentimentResults = await analyzeFeedback(feedbackData);
      // Extract numerical sentiment values from the results
      const detailedSentiments = {
        bestPart:
          sentimentResults.adminStatistics.detailed_sentiments.bestPart
            .sentiment,
        improvements:
          sentimentResults.adminStatistics.detailed_sentiments.improvements
            .sentiment,
        finalComments:
          sentimentResults.adminStatistics.detailed_sentiments.finalComments
            .sentiment,
      };
      // Include sentiment analysis results in the new feedback document
      const newFeedback = new Feedback({
        ...feedbackData,
        sentiment: sentimentResults.adminStatistics.overall_sentiment,
        detailedSentiments: detailedSentiments, // use the extracted numbers
      });
      await newFeedback.save();

      res.status(201).json({
        message: "Feedback created successfully",
        feedback: newFeedback,
        sentiment: sentimentResults,
      });
    } catch (error) {
      console.error("Failed to create feedback:", error);
      res.status(500).json({ message: error.message });
    }
  },

  async getFeedbacks(req, res) {
    try {
      const { eventId } = req.params;
      const feedbacks = await Feedback.find({ event: eventId }).populate(
        "user",
        "name"
      );
      res.status(200).json(feedbacks);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  async getFeedbackById(req, res) {
    try {
      const { feedbackId } = req.params;
      const feedback = await Feedback.findById(feedbackId).populate(
        "event",
        "title"
      );
      if (!feedback) {
        return res.status(404).json({ message: "Feedback not found" });
      }
      res.status(200).json(feedback);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  async deleteFeedback(req, res) {
    try {
      const { feedbackId } = req.params;
      const feedback = await Feedback.findByIdAndDelete(feedbackId);
      if (!feedback) {
        return res.status(404).json({ message: "Feedback not found" });
      }
      res.status(200).json({ message: "Feedback deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  async updateFeedback(req, res) {
    try {
      const { feedbackId } = req.params;
      const feedback = await Feedback.findByIdAndUpdate(feedbackId, req.body, {
        new: true,
      });
      if (!feedback) {
        return res.status(404).json({ message: "Feedback not found" });
      }
      res
        .status(200)
        .json({ message: "Feedback updated successfully", feedback });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  async getAllFeedbacks(req, res) {
    try {
      const feedbacks = await Feedback.find();
      res.status(200).json(feedbacks);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};
