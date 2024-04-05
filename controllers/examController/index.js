const exam = require('../../models/exam');
const classes = require('../../models/class');
const grade = require('../../models/grades');
const user = require('../../models/user');
let ejs = require("ejs") ;
let pdf = require("html-pdf") ;
const nodemailer = require( "nodemailer");
const path = require('path');

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
    },




  
       
        async sendEmail(req, res) {
            const ejsFilePath = path.resolve(__dirname, 'emploitemplate.ejs');
            console.log(ejsFilePath);
            
            // Assuming you're sending the email address in the request body
            const exams = await exam.find({
              type: "exam"
            });

           
          const classInfo = await classes.findOne({ name: req.params.name }).populate('students');
           
        
            // Récupérez la liste des étudiants de la classe
            const students = classInfo.students;
          
            // Créez un tableau pour stocker les adresses email des étudiants
            const studentEmails = [];
          
            // Itérez sur la liste des étudiants pour récupérer leurs adresses email
            students.forEach((student) => {
              studentEmails.push(student.email);// Supposons que l'adresse email de l'étudiant soit stockée dans le champ 'email'
            });
            // Group exams by date and class
            const groupedExams = {};
            exams.sort((a, b) => {
                return new Date(a.startDate) - new Date(b.startDate);
            });
            exams.forEach((exam) => {
                const day = exam.startDate.getDate();
                const month = exam.startDate.getMonth() + 1; // Ajouter 1 car les mois sont indexés à partir de 0
                const year = exam.startDate.getFullYear();
            
                // Formatter la date dans le format souhaité (jour/mois/année)
                const formattedDate = `${day}/${month}/${year}`;
            
                // Créer la date et l'heure combinées
                const examDateTime = `${formattedDate} , ${exam.startHour}`;

              
              if (!groupedExams[examDateTime]) {
                groupedExams[examDateTime] = {};
              }
              if (!groupedExams[examDateTime][exam.classe]) {
                groupedExams[examDateTime][exam.classe] = [];
              }
              groupedExams[examDateTime][exam.classe].push(exam.name);
              console.log(exam.startDate.getFullYear());
            });
          
            try {
              ejs.renderFile(ejsFilePath, { exams: exams, groupedExams: groupedExams }, (err, data) => {
                if (err) {
                  console.log(err);
                  return res.status(500).send(err);
                } else {
                  let options = {
                    height: "11.25in",
                    width: "8.5in",
                    header: { height: "20mm" },
                    footer: { height: "20mm" },
                  };
                  pdf.create(data, options).toFile("test.pdf", function (err, data) {
                    if (err) {
                      res.send(err);
                    } else {
                      const transporter = nodemailer.createTransport({
                        service: 'Gmail',
                        auth: {
                          user: 'farah.metoui@esprit.tn', // Your Gmail email address
                          pass: '201JFT2629' ,// Your Gmail password
                          // secure: true,
                          //  type: "OAuth2",
                          
                        }
                      });
          
                      // Email message options
                      const mailOptions = {
                        from: 'farah.metoui@esprit.tn',
                        to: studentEmails.join(','),
                        subject: 'TimeTable Exams',
                        text: 'Your can check here your TimeTable',
                        attachments: [
                          {
                            path: data.filename,
                          }
                        ]
                      };
          
                      // Send the email
                      transporter.sendMail(mailOptions, (error, info) => {
                        if (error) {
                          console.log('Error sending email:', error);
                          return res.status(500).json({ message: 'Failed to send email' });
                        } else {
                          console.log('Email sent:', info.response);
                          return res.status(200).json({ message: 'Email sent successfully' });
                        }
                      });
                    }
                  });
                }
              });
            } catch (error) {
              console.log('Error:', error);
              return res.status(500).json({ message: 'Internal server error' });
            }
          },


          async getExamsTeacher(req, res) {
            try {

              const Teacher = await user.findById(req.params.id)
                const exams = await exam.find({
                    type:"exam",
                    teacher : Teacher.username
                });
                res.status(200).json(exams);
            } catch (error) {
                res.status(500).json({ message: error.message });
            }
        },
          
        


          
  };



