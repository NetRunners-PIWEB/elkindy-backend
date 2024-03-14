const course = require('../../models/course');


module.exports = {
    async createCourse(req, res) {
        try {
          const courseData = req.body;
          const newCourse = new course(courseData);
          await newCourse.save();
          res.status(201).json(newCourse);
        } catch (error) {
          res.status(500).json({ message: error.message });
        }
      },

      async getAllCourses(req, res) {
        try {
            const courses = await course.find();
            res.status(200).json(courses);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    async getCourseById(req, res) {
        try {
            const courses = await course.findById(req.params.id);
            if (!courses) {
                return res.status(404).json({ message: 'Course not found' });
            }
            res.status(200).json(courses);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    async updateCourse(req, res) {
        try {
            const updatedCourse = await course.findByIdAndUpdate(req.params.id, req.body, { new: true });
            if (!updatedCourse) {
                return res.status(404).json({ message: 'Course not found' });
            }
            res.status(200).json(updatedCourse);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    async deleteCourse(req, res) {
        try {
            const deletedCourse = await course.findByIdAndDelete(req.params.id);
            if (!deletedCourse) {
                return res.status(404).json({ message: 'Course not found' });
            }
            res.status(200).json({ message: 'Course deleted successfully' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
   
          
  };


