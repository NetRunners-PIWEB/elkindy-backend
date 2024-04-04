const Class = require('../../models/class');
const User = require('../../models/user');
/*

module.exports = {
    async createClass(req, res) {
        try {
          const classData = req.body;
          const newClass = new classes(classData);
          await newClass.save();
          res.status(201).json(newClass);
        } catch (error) {
          res.status(500).json({ message: error.message });
        }
      },

     

    async getClassById(req, res) {
        try {
            const classe = await classes.findById(req.params.id);
            if (!classe) {
                return res.status(404).json({ message: 'Class not found' });
            }
            res.status(200).json(classe);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    async updateClass(req, res) {
        try {
            const updatedClass = await classes.findByIdAndUpdate(req.params.id, req.body, { new: true });
            if (!updatedClass) {
                return res.status(404).json({ message: 'Class not found' });
            }
            res.status(200).json(updatedClass);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    async deleteClass(req, res) {
        try {
            const deletedClass = await classes.findByIdAndDelete(req.params.id);
            if (!deletedClass) {
                return res.status(404).json({ message: 'Class not found' });
            }
            res.status(200).json({ message: 'Class deleted successfully' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
   
          
  };
*/
exports.createClass = async (req, res) => {
    try {
        const newClass = new Class(req.body);
        const savedClass = await newClass.save();
        res.status(201).json(savedClass);
    } catch (error) {
        res.status(400).json({ message: "Failed to create class", error: error.message });
    }
};

exports.getClass = async (req, res) => {
    try {
        const classData = await Class.findById(req.params.id).populate('teacher').populate('students');
        if (!classData) {
            return res.status(404).json({ message: 'Class not found' });
        }
        res.json(classData);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateClass = async (req, res) => {
    try {
        const updatedClass = await Class.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedClass);
    } catch (error) {
        res.status(400).json({ message: "Failed to update class", error: error.message });
    }
};

exports.deleteClass = async (req, res) => {
    try {
        await Class.findByIdAndDelete(req.params.id);
        res.json({ message: 'Class successfully deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.listClasses = async (req, res) => {
    try {
        const classes = await Class.find().populate('teacher').populate('students');
        res.json(classes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getClassesByCourseId = async (req, res) => {
    try {
        const { courseId } = req.query;
        const classes = await Class.find({ courseId }).populate('teacher');
        res.json(classes);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch classes by course ID", error: error.message });
    }
};


exports.updateClassTeachers = async (req, res) => {
    try {
        const { classId } = req.params;
        const { teacherIds } = req.body;

        const updatedClass = await Class.findByIdAndUpdate(classId, { $set: { teacher: teacherIds } }, { new: true }).populate('teacher');
        if (!updatedClass) {
            return res.status(404).json({ message: 'Class not found' });
        }

        res.json(updatedClass);
    } catch (error) {
        res.status(500).json({ message: "Failed to update class teachers", error: error.message });
    }
};

exports.getClasses = async (req, res) => {
    try {
        const classe = await Class.find();
        res.status(200).json(classe);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getStudentsAndClass = async (req, res) => {
    try {
        // Rechercher les classes où l'enseignant est référencé
        const classrooms = await Class.find({ teacher: req.params.teacherId }).populate('students');

        if (!classrooms || classrooms.length === 0) {
            return res.status(404).json({ message: "Aucune classe trouvée pour cet enseignant." });
        }

        const studentsWithClasses = {};

        // Parcourir chaque classe
        for (const classroom of classrooms) {
            const className = classroom.name;
            // Parcourir chaque étudiant de la classe
            for (const student of classroom.students) {
                const { username } = student;
                // Vérifier si l'étudiant existe déjà dans studentsWithClasses
                if (!studentsWithClasses[username]) {
                    // S'il n'existe pas, initialiser un tableau vide pour stocker les classes
                    studentsWithClasses[username] = [className];
                } else {
                    // S'il existe, ajouter la classe à son tableau de classes
                    studentsWithClasses[username].push(className);
                }
            }
        }

        // Convertir l'objet studentsWithClasses en tableau d'objets
        const studentsWithClassesArray = Object.entries(studentsWithClasses).map(([username, classes]) => ({
            username,
            classes: classes.join(', ')
        }));

        return res.status(200).json({ studentsWithClasses: studentsWithClassesArray });
    } catch (error) {
        console.error("Error retrieving students and class name by teacher ID:", error);
        return res.status(500).json({ message: "Erreur lors de la récupération des étudiants et du nom de la classe par l'ID de l'enseignant." });
    }
};

exports.getStudentsByClass = async (req, res) => {
    try {
        
        const classe = await Class.findOne({ name: req.params.name }).populate('students');
         if (!classe) {
            return res.status(404).json({ message: "Classe non trouvée" });
        }

        const students = classe.students.map(student => student.username);

        res.status(200).json({ students });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
