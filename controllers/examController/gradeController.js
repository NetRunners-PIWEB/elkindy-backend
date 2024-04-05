const path = require('path');
const grade = require('../../models/grades');
const user = require('../../models/user'); 
const classes = require('../../models/class'); 
module.exports = { 


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


      async getExamsGrades(req, res) {
        try {
           const student = await user.findById(req.params.id);
            const grades = await grade.find({
                studentName: student.username ,
                type:'evaluation'
            });
            res.status(200).json(grades);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    


    async getExamGrades(req, res) {
        try {
           const student = await user.findById(req.params.id);
            const grades = await grade.find({
                studentName: student.username ,
                type:'exam'
            });
            res.status(200).json(grades);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    async getEvalGrades(req, res) {
        try {
         //  const student = await user.findById(req.params.id);
            const grades = await grade.find({
                studentName: req.params.id ,
                type:'evaluation'
            });
            res.status(200).json(grades);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    async updateEvalGrades(req, res) {
        try {
            
         //  const student = await user.findById(req.params.id);
            const grades = await grade.findById(req.body.id);
                 grades.grade = req.body.grade;
                 console.log(grades);
            const newgrade = await  grades.save();
            console.log(newgrade);
            res.status(200).json(newgrade);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }





}
