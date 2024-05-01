const Feedback = require('../../models/feedback');
const Event = require('../../models/event');

module.exports = {
    
  async createFeedback(req, res) {
    try {
        const feedbackData = req.body;
        const newFeedback = new Feedback(feedbackData );
        await newFeedback.save();
        res.status(201).json(newFeedback);
        //res.status(201).json({ message: "Feedback created successfully", feedback });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
},

async getFeedbacks(req, res) {
    try {
        const { eventId } = req.params;
        const feedbacks = await Feedback.find({ event: eventId }).populate('user', 'name');
        res.status(200).json(feedbacks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
},


async getFeedbackById(req, res) {
    try {
        const { feedbackId } = req.params;
        const feedback = await Feedback.findById(feedbackId).populate('event', 'title');
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
        const feedback = await Feedback.findByIdAndUpdate(feedbackId, req.body, { new: true });
        if (!feedback) {
            return res.status(404).json({ message: "Feedback not found" });
        }
        res.status(200).json({ message: "Feedback updated successfully", feedback });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
},
          
  };
    