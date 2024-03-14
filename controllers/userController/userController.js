const User = require('../../models/user');

exports.listTeachers = async (req, res) => {
    try {
        const teachers = await User.find({ role: 'teacher', isDeleted: false }).select('-password');
        res.json(teachers);
    } catch (error) {
        console.error("Failed to fetch teachers:", error);
        res.status(500).json({ message: "Failed to fetch teachers" });
    }
};
