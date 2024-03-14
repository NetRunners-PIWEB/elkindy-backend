const Course = require('../../models/course');

exports.createCourse = async (req, res) => {
    try {
        const newCourse = new Course(req.body);
        const savedCourse = await newCourse.save();
        res.status(201).json(savedCourse);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.getCourse = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);
        if (!course) return res.status(404).json({ message: 'Course not found' });
        res.json(course);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateCourse = async (req, res) => {
    try {
        const course = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!course) return res.status(404).json({ message: 'Course not found' });
        res.json(course);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.deleteCourse = async (req, res) => {
    try {
        const course = await Course.findByIdAndDelete(req.params.id);
        if (!course) return res.status(404).json({ message: 'Course not found' });
        res.json({ message: 'Course deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.listCourses = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize,7) || 7;
    try {
        const total = await Course.countDocuments({ isArchived: true });
        const courses = await Course.find({ isArchived: false })
            .skip(((page - 1) * pageSize))
            .limit(pageSize);

        res.json({
            data:courses,
            total,
            page,
            pageSize,
            totalPages: Math.ceil(total / pageSize),
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }

};

exports.listCoursesByCategory = async (req, res) => {
    try {
        const category = req.params.category;
        const courses = await Course.find({ category: category });
        res.json(courses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.archiveCourse = async (req, res) => {
    try {
        const course = await Course.findByIdAndUpdate(req.params.id, { isArchived: true }, { new: true });
        if (!course) return res.status(404).json({ message: 'Course not found' });
        res.json(course);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.listArchivedCourses = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize,5) || 5;
    try {
        const total = await Course.countDocuments({ isArchived: true });

        const archivedCourses = await Course.find({ isArchived: true })
            .skip(((page - 1) * pageSize))
            .limit(pageSize);

        res.json({
            data:archivedCourses,
            total,
            page,
            pageSize,
            totalPages: Math.ceil(total / pageSize),
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateCourseTeachers = async (req, res) => {
    const { courseId } = req.params;
    const { teacherIds } = req.body;
    console.log('Request Params:', req.params);
    console.log('Request Body:', req.body);

    try {
        const course = await Course.findById(courseId);

        if (!course) {
            return res.status(404).send({ message: 'Course not found' });
        }

        course.teacher = teacherIds;
        await course.save();
        res.status(200).send({ message: 'Course updated successfully', course });
    } catch (error) {
        res.status(500).send({ message: 'Error updating course', error });
    }
};


exports.getAssignedTeachers = async (req, res) => {
    try {
        const { courseId } = req.params;
        const course = await Course.findById(courseId).populate('teacher');

        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        const assignedTeachers = course.teacher;

        res.json({ assignedTeachers });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching assigned teachers', error });
    }
};

