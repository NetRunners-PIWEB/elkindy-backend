const asyncHandler = require('../../middlewares/asyncHandler');
const User = require('../../models/user');
const bcrypt = require('bcrypt');
const axios = require ('axios');
const Course = require('../../models/course');
const cloudinary = require('../../cloudinaryConfig'); // Ensure this is correctly set up for Cloudinary integration
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

  uploadUserProfilePicture = asyncHandler(async (req, res) => {
    const { userId } = req.params;

    if (!req.file) {
        return res.status(400).json({ message: 'No image file uploaded.' });
    }

    let imgURL;
    try {
        // Assuming the file is sent with the request under the field name 'image'
        const uploadedResponse = await cloudinary.uploader.upload(req.file.path);
        imgURL = uploadedResponse.secure_url;
    } catch (error) {
        console.error('Cloudinary Upload Error:', error);
        return res.status(500).json({ message: 'Failed to upload image to Cloudinary', error: error.message });
    }

    try {
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { image: imgURL },
            { new: true, runValidators: true } // Return the updated document and run model validators
        );

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        } else {
            res.json({ success: true, updatedUser });
        }
    } catch (error) {
        console.error('Database Update Error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});
const generatePayment = async (req, res) => {
    const requestBody = {
        app_token: "6d7dbb63-ae33-41c7-ab65-85be4e3e64c5",
        app_secret: "67fc1290-3392-400a-853a-a06f9df9c3a9",
        amount: 30500,
        accept_card: true,
        session_timeout_secs: 1200,
        success_link: "https://example.website.com/success",
        fail_link: "https://example.website.com/fail",
        developer_tracking_id: "<your_internal_tracking_id>"
    };

    try {
        const response = await axios.post('https://developers.flouci.com/api/generate_payment', requestBody);
        res.json(response.data);
    } catch (error) {
        console.error('Error generating payment page:', error.response.data);
        res.status(500).json({ error: 'Failed to generate payment page' });
    }
};
const fetchAllCourses = async (userId, status = null) => {
    try {
        const user = await User.findById(userId).populate('courses.courseId');
        if (!user) {
            return { error: 'User not found' };
        }

        if (user.role === 'student') {
            if (user.courses.length === 0) {
                // Fetch all courses if the user is a student and not enrolled in any course
                if (status) {
                    const courses = await Course.find({ status });
                    return courses;
                } else {
                    const courses = await Course.find();
                    return courses;
                }
            } else {
                // Fetch only enrolled courses if the user is a student and already enrolled in some courses
                const enrolledCourses = await Course.find({ 
                    _id: { $in: user.courses.map(course => course.courseId) },
                    status: status ? status : { $exists: true } // Filter by status if provided, otherwise fetch all courses with any status
                });
                return enrolledCourses;
            }
        }
    } catch (error) {
        console.error('Error fetching courses:', error);
        return { error: 'Internal server error' };
    }
};
const updateCourseStatus = asyncHandler(async (req, res) => {
    const { userId, courseId, newCourseStatus, newPaymentStatus } = req.body;

    try {
        // Ensure the user exists
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Ensure the user has courses and courseId is valid
        if (!user.courses || !Array.isArray(user.courses)) {
            return res.status(400).json({ message: 'No courses found for this user' });
        }

        // Find the course using a safe check for ObjectId validity
        const courseIndex = user.courses.findIndex(course =>
         course._id.toString() === courseId
        );

        if (courseIndex === -1) {
            return res.status(404).json({ message: 'Course not found' });
        }

        // Update the status and payment status if provided
        if (newCourseStatus) user.courses[courseIndex].status = newCourseStatus;
        if (newPaymentStatus) user.courses[courseIndex].paymentStatus = newPaymentStatus;
        
        await user.save();
        res.status(200).json({
            message: 'Course status updated successfully',
            course: user.courses[courseIndex]
        });
    } catch (error) {
        console.error('Error updating course status:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});




module.exports = {

    updateCourseStatus, fetchAllCourses, generatePayment, createUser,getAllUsers,getUserById,updateUser,deleteUser,listTeachers,getAllStudents,addAvailability,getUserAvailability,uploadUserProfilePicture

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
    
