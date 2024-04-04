const asyncHandler = require('../../middlewares/asyncHandler');
const User = require('../../models/user');
const bcrypt = require('bcrypt');

createUser= asyncHandler(async (req, res) => {
    const userData = req.body;
    const newUser = new User(userData);
    await newUser.save();
    res.status(201).json(newUser);
  }
);
getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find();
    res.status(200).json(users);
});

getUserById = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
});

const updateUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    let updatedUser;

    if (req.body.password) {
        // Hash the new password if it's provided
        const hashedPassword = await bcrypt.hash(req.body.password, 12);
        updatedUser = await User.findByIdAndUpdate(id, { ...req.body, password: hashedPassword }, { new: true, runValidators: true });
    } else {
        // Update the user without modifying the password
        updatedUser = await User.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    }

    if (!updatedUser) {
        return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(updatedUser);
});

deleteUser = asyncHandler(async (req, res) => {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
        return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ message: 'User deleted successfully' });
});
listTeachers = asyncHandler(async (req, res) => {
    const teachers = await User.find({ role: 'teacher', isDeleted: false }).select('-password');
    res.json(teachers); 
  
});



 getAllStudents = asyncHandler(async (req, res) => {
    const students = await User.find({ role: 'student', isDeleted: false }).select('-password');
    res.json(students);
  
});


 addAvailability = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { availability } = req.body;
  
    try {
      const user = await User.findById(id);
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Update user's availability
      user.availability = availability;
      await user.save();
  
      res.status(200).json({ message: 'Availability updated successfully', user });
    } catch (error) {
      console.error('Error adding availability:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
   getUserAvailability = asyncHandler(async (req, res) => {
    const userId = req.params.id;
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
  
    // Assuming availability is stored as a property in the user document
    const availability = user.availability;
    res.status(200).json({ availability });
  });

module.exports = {

    createUser,getAllUsers,getUserById,updateUser,deleteUser,listTeachers,getAllStudents,addAvailability,getUserAvailability

}


/*  
module.exports = {

    createUser,getAllUsers,getUserById,updateUser,deleteUser,listTeachers

//changed all the methodes to be used with asyncHandler for reusabiliity
 /*  async listTeachers (req, res) {
        try {
            const teachers = await User.find({ role: 'teacher', isDeleted: false }).select('-password');
            res.json(teachers);
        } catch (error) {
            console.error("Failed to fetch teachers:", error);
            res.status(500).json({ message: "Failed to fetch teachers" });
        }
    },

    async createUser(req, res) {
        try {
          const userData = req.body;
          const newUser = new User(userData);
          await newUser.save();
          res.status(201).json(newUser);
        } catch (error) {
          res.status(500).json({ message: error.message });
        }
      },

    /*  async getAllUsers(req, res) {
        try {
            const users = await User.find();
            res.status(200).json(users);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    async getUserById(req, res) {
        try {
            const user = await User.findById(req.params.id);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            res.status(200).json(user);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    async updateUser(req, res) {
        try {
            const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
            if (!updatedUser) {
                return res.status(404).json({ message: 'User not found' });
            }
            res.status(200).json(updatedUser);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    async deleteUser(req, res) {
        try {
            const deletedUser = await User.findByIdAndDelete(req.params.id);
            if (!deletedUser) {
                return res.status(404).json({ message: 'User not found' });
            }
            res.status(200).json({ message: 'User deleted successfully' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

          
  };   */
    
