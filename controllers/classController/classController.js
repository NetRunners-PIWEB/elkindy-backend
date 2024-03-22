const Class = require('../../models/class');
const Course = require('../../models/course');
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

      async getAllClasses(req, res) {
        try {
            const classe = await classes.find();
            res.status(200).json(classe);
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

        const updatedClass = await Class.findByIdAndUpdate(classId, { $set: { teacher: teacherIds }}, { new: true }).populate('teacher');
        if (!updatedClass) {
            return res.status(404).json({ message: 'Class not found' });
        }

        res.json(updatedClass);
    } catch (error) {
        res.status(500).json({ message: "Failed to update class teachers", error: error.message });
    }
};

exports.generateClassesForCourse = async (req, res) => {
    try {
        const { courseId, maxStudentsPerClass } = req.body;
        const course = await Course.findById(courseId).populate('students');

        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        // Determine the number of classes needed, at least 1
        const numberOfClasses = Math.max(1, Math.ceil(course.students.length / maxStudentsPerClass));
        let classesCreated = [];

        for (let i = 0; i < numberOfClasses; i++) {
            // Slice the students array to get students for this class
            const studentsForClass = course.students.slice(i * maxStudentsPerClass, (i + 1) * maxStudentsPerClass);
            const newClass = new Class({
                name: `Class ${i + 1}`,
                courseId: course._id,
                students: studentsForClass.map(student => student._id),
            });
            const savedClass = await newClass.save();
            classesCreated.push(savedClass);
        }

        res.status(201).json(classesCreated);
    } catch (error) {
        res.status(500).json({ message: 'Failed to generate classes', error: error.message });
    }
};
