const classes = require('../../models/class');


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


