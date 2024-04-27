const Class = require('../../models/class');

const Course = require('../../models/course');
const Session = require('../../models/session');
const User = require('../../models/user')
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


exports.generateClassesForCourse = async (req, res) => {
    try {
        const { courseId, maxStudentsPerClass } = req.body;
        const course = await Course.findById(courseId).populate('students');

        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        const existingClasses = await Class.find({ courseId: courseId });
        if (existingClasses.length > 0) {
            return res.status(200).json(existingClasses);
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


//updatedClass = await Class.findByIdAndUpdate(classId, { $set: { teacher: teacherIds } }, { new: true }).populate('teacher');

exports.updateClassSchedule = async (req, res) => {
    const { classId, start, end, teacherId } = req.body;
    try {
        const updatedClass = await Class.findByIdAndUpdate(
            classId,
            {
                start: new Date(start),
                end: new Date(end),
                teacher: teacherId
            },
            { new: true }
        );

        if (!updatedClass) {
            return res.status(404).json({ message: 'Class not found' });
        }
        res.status(200).json(updatedClass);
    } catch (error) {
        res.status(500).json({ message: 'Failed to update class schedule', error: error.message });
    }
};
exports.assignTeachersToClass = async (req, res) => {
    const { classId } = req.params;
    const { teacherIds } = req.body;

    try {
        const classToUpdate = await Class.findById(classId);

        if (!classToUpdate) {
            return res.status(404).json({ message: 'Class not found' });
        }

        classToUpdate.teacher = teacherIds;

        await classToUpdate.save();

        res.status(200).json({ message: 'Teachers assigned successfully', class: classToUpdate });
    } catch (error) {
        res.status(500).json({ message: 'Failed to assign teachers', error });
    }
};

exports.getTeachersByClassId = async (req, res) => {
    try {
        const { classId } = req.params;
        const course = await Class.findById(classId).populate('teacher');
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }
        res.json(course.teacher);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching teachers', error });
    }
};
exports.createSessionForClass = async (req, res) => {
    try {
        const { classId } = req.params;
        const { teacherId, date, startTime, endTime } = req.body;

        const foundClass = await Class.findById(classId);
        if (!foundClass) {
            return res.status(404).json({ message: "Class not found" });
        }

        const newSession = new Session({
            date,
            startTime: new Date(date + 'T' + startTime),
            endTime: new Date(date + 'T' + endTime),
            teacher: teacherId
        });

        const savedSession = await newSession.save();

        foundClass.sessions.push(savedSession._id);
        await foundClass.save();

        res.status(201).json({ message: "Session created and added to the class successfully", session: savedSession });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to create session', error: error.message });
    }
};


exports.getUpcomingSessionsForTeacher = async (req, res) => {
    try {
        const { teacherId } = req.params;
        const currentDate = new Date();

        const nextSession = await Session.findOne({
            teacher: teacherId,
            startTime: { $gte: currentDate }
        }).populate('classId').sort('startTime');

        if (nextSession) {
            res.status(200).json(nextSession);
        } else {
            res.status(404).json({ message: "No upcoming sessions found for this teacher" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to retrieve the next session', error: error.message });
    }
};

exports.markAttendance = async (req, res) => {
    try {
        const { sessionId, studentId, status } = req.body;

        const session = await Session.findById(sessionId);
        if (!session) {
            return res.status(404).json({ message: "Session not found" });
        }

        const attendanceIndex = session.attendance.findIndex(att => att.student.toString() === studentId);
        if (attendanceIndex > -1) {
            session.attendance[attendanceIndex].status = status;
        } else {
            session.attendance.push({ student: studentId, status: status });
        }

        await session.save();
        res.status(200).json({ message: "Attendance marked successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to mark attendance', error: error.message });
    }
};

exports.addStudentsToClass = async (req, res) => {
    const { classId } = req.params;
    const { studentIds } = req.body;

    try {
        const classToUpdate = await Class.findById(classId);
        if (!classToUpdate) {
            return res.status(404).json({ message: "Class not found" });
        }

        // Merge the existing student IDs with the new ones
        // Make sure there are no duplicate entries
        const updatedStudentIds = [...new Set([...classToUpdate.students.map(id => id.toString()), ...studentIds])];

        classToUpdate.students = updatedStudentIds;
        await classToUpdate.save();

        res.status(200).json({ message: "Students added successfully", class: classToUpdate });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to add students to class', error: error.message });
    }
};

exports.getSessionsByClassId = async (req, res) => {
    try {
        const { classId } = req.params;
        const sessions = await Session.find({ classId }).populate('teacher');
        res.json(sessions);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch sessions for the class', error: error.message });
    }
};

exports.getStudentsByClassId = async (req, res) => {
    try {
        const { classId } = req.params;
        const classInfo = await Class.findById(classId).populate('students');
        res.json(classInfo.students);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch students for the class', error: error.message });
    }
};

exports.manageAttendanceForSession = async (req, res) => {
    try {
        const { sessionId } = req.params;
        const { attendance } = req.body;

        if (!attendance || !Array.isArray(attendance)) {
            return res.status(400).json({ message: 'Invalid attendance data' });
        }

        const session = await Session.findById(sessionId);
        if (!session) {
            return res.status(404).json({ message: 'Session not found' });
        }

        attendance.forEach(att => {
            if (!att.student || !att.status) {
                throw new Error('Attendance record is missing student or status');
            }
            const attendanceIndex = session.attendance.findIndex(a => a.student.equals(att.student));
            if (attendanceIndex > -1) {
                session.attendance[attendanceIndex].status = att.status;
            } else {
                session.attendance.push({ student: att.student, status: att.status });
            }
        });

        await session.save();
        res.status(200).json({ message: 'Attendance updated successfully', session });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to manage attendance for the session', error: error.message });
    }
};

exports.getClassesForTeacher = async (req, res) => {
    try {
        const { teacherId } = req.params;
        const classes = await Class.find({ teacher: teacherId }).populate('courseId', 'title');

        if (!classes) {
            return res.status(404).json({ message: "No classes found for this teacher." });
        }

        res.json(classes);
    } catch (error) {
        console.error('Failed to fetch classes for the teacher:', error);
        res.status(500).json({ message: 'Failed to fetch classes for the teacher', error: error.message });
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

exports.getClassStats = async (req, res) => {
    try {
        const classId = req.params.classId;
        const classInfo = await Class.findById(classId).populate('students');

        if (!classInfo) {
            return res.status(404).json({ message: "Class not found" });
        }

        const studentIds = classInfo.students.map(student => student._id);

        const genderCount = await User.aggregate([
            { $match: { _id: { $in: studentIds } } },
            { $group: { _id: '$gender', count: { $sum: 1 } } }
        ]);

        let maleCount = 0;
        let femaleCount = 0;
        genderCount.forEach(gender => {
            if (gender._id === 'male') maleCount = gender.count;
            if (gender._id === 'female') femaleCount = gender.count;
        });

        const totalCount = maleCount + femaleCount;
        const malePercentage = (maleCount / totalCount * 100).toFixed(2);
        const femalePercentage = (femaleCount / totalCount * 100).toFixed(2);

        res.status(200).json({
            totalCount,
            malePercentage,
            femalePercentage,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to get class stats', error: error.message });
    }
};

exports.getSessionByTeacherId = async (req, res) => {
    try {
        const { teacherId } = req.params;
        const sessions = await Session.find({ teacher: teacherId })
            .exec();

        res.json(sessions);
    } catch (error) {
        console.error(`Failed to fetch sessions for teacher ID ${teacherId}:`, error);
        res.status(500).json({ message: 'Failed to fetch sessions for the teacher.', error: error.message });
    }
};

exports.createRepeatingSession = async (req, res) => {
    const { classId, room, teacher, startDate, startTime, endTime, repeatCount } = req.body;

    try {
        const classData = await Class.findById(classId);
        if (!classData) {
            return res.status(404).json({ message: "Class not found" });
        }

        const sessionsToCreate = [];
        let sessionDate = new Date(startDate);

        for (let i = 0; i < repeatCount; i++) {
            sessionsToCreate.push({
                classId,
                room,
                teacher,
                date: new Date(sessionDate),
                startTime: combineDateAndTime(sessionDate, startTime),
                endTime: combineDateAndTime(sessionDate, endTime),
            });

            sessionDate.setDate(sessionDate.getDate() + 7);
        }

        const createdSessions = await Session.insertMany(sessionsToCreate);

        res.status(201).json({ message: "Sessions created successfully", sessions: createdSessions });
    } catch (error) {
        res.status(500).json({ message: "Failed to create sessions", error: error.message });
    }
};

function combineDateAndTime(date, time) {
    const [hours, minutes] = time.split(':').map(Number);
    const newDate = new Date(date);
    newDate.setHours(hours, minutes, 0, 0);
    return newDate;
}


exports.getStudentAttendance = async (req, res) => {
    const { studentId } = req.params;

    try {
        const sessions = await Session.find({
            'attendance.student': studentId
        }).populate({
            path: 'classId',
            populate: {
                path: 'courseId',
                model: 'Course'
            }
        }).populate('attendance.student', 'username')

        const attendanceRecords = sessions.map(session => {
            const attendance = session.attendance.find(att => att.student._id.toString() === studentId);
            return {
                date: session.date,
                startTime: session.startTime,
                endTime: session.endTime,
                class: session.classId.name,
                course: session.classId.courseId.title,
                status: attendance ? attendance.status : '-',
            };
        });

        res.json({ studentId, attendanceRecords });
    } catch (error) {
        console.error('Error fetching attendance data:', error);
        res.status(500).json({ message: 'Failed to fetch attendance data', error: error.message });
    }
};
