const exam = require('../../models/exam');


module.exports = {
    async createExam(req, res) {
        try {
          const examData = req.body;
          const newExam = new exam(examData);
          await newExam.save();
          res.status(201).json(newExam);
        } catch (error) {
          res.status(500).json({ message: error.message });
        }
      },

      async getAllExams(req, res) {
        try {
            const exams = await exam.find();
            res.status(200).json(exams);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    async getExamById(req, res) {
        try {
            const exams = await exam.findById(req.params.id);
            if (!exams) {
                return res.status(404).json({ message: 'Exam not found' });
            }
            res.status(200).json(exams);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    async updateExam(req, res) {
        try {
            const updatedExam = await exam.findByIdAndUpdate(req.params.id, req.body, { new: true });
            if (!updatedExam) {
                return res.status(404).json({ message: 'Exam not found' });
            }
            res.status(200).json(updatedExam);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    async deleteExam(req, res) {
        try {
            const deletedExam = await exam.findByIdAndDelete(req.params.id);
            if (!deletedExam) {
                return res.status(404).json({ message: 'Exam not found' });
            }
            res.status(200).json({ message: 'Exam deleted successfully' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
   
          
  };


