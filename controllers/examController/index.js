const exam = require('../../models/exam');
const grade = require('../../models/grades');

module.exports = {

    async getEvaluationByStudent(req, res) {
        try {
            const userName = req.params.userName;
            const exams = await exam.find({ students: userName });
            if (!exams || exams.length === 0) {
                return res.status(404).json({ message: 'Aucun examen trouvé pour cet utilisateur' });
            }
            res.status(200).json(exams);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },    
  
    async getTypeEvaluations(req, res) {
        try {
            const exams = await exam.find({
                type:"evaluation"
            });
            res.status(200).json(exams);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
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



      async deleteGrade(req, res) {
        try {
            const deletedGrade = await grade.findByIdAndDelete(req.params.id);
            if (!deletedGrade) {
                return res.status(404).json({ message: 'Exam not found' });
            }
            res.status(200).json({ message: 'Exam deleted successfully' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },


     

      async getGrades(req, res) {
        try {
            const grades = await grade.find();
            res.status(200).json(grades);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },


      async createGrade(req, res) {
        try {
          const gradeData = req.body;
          console.log(req.body);
          const newGrade = new grade(gradeData);
          await newGrade.save();
          res.status(201).json(newGrade);
        } catch (error) {
          res.status(500).json({ message: error.message });
        }

      },

      async getTypeExams(req, res) {
        try {
            const exams = await exam.find({
                type:"exam"
            });
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



