const Course = require('../../models/course');
const User = require('../../models/user');
const cloudinary = require('../../cloudinaryConfig');


exports.createCourse = async (req, res) => {
    console.log(req.body);
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
    const searchQuery = req.query.searchQuery || '';


    try {

        const query = {
            isArchived: false,
            ...(searchQuery && { title: { $regex: searchQuery, $options: 'i' } }),
        };

        const total = await Course.countDocuments(query);
        const courses = await Course.find(query)
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

exports.getTopThreeCourses = async (req, res) => {
    try {
        const courses = await Course.find()
            .sort({ 'students': -1 })
            .limit(3);
        res.status(200).json(courses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


exports.addStudentsToCourse = async (req, res) => {
    const { courseId } = req.params;
    const { studentIds } = req.body;

    try {
        const course = await Course.findById(courseId);

        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }

        const validStudentIds = studentIds.filter(studentId =>
            !course.students.includes(studentId)
        );

        course.students.push(...validStudentIds);
        await course.save();

        res.status(200).json({ message: "Students added successfully", course });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};
exports.getTeacherStats = async (req, res) => {
    try {
        const genderCount = await User.aggregate([
            { $match: { role: 'teacher'} },
            { $group: { _id: '$gender', count: { $sum: 1 } } } // Group by gender and count
        ]);

        let maleCount = 0;
        let femaleCount = 0;

        genderCount.forEach(gender => {
            if (gender._id === 'male') maleCount = gender.count;
            if (gender._id === 'female') femaleCount = gender.count;
        });

        const totalCount = maleCount + femaleCount;
        const malePercentage = totalCount ? ((maleCount / totalCount) * 100).toFixed(2) : 0;
        const femalePercentage = totalCount ? ((femaleCount / totalCount) * 100).toFixed(2) : 0;

        res.status(200).json({
            totalCount,
            malePercentage,
            femalePercentage,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to get teacher stats', error: error.message });
    }
};

exports.getStudentStats = async (req, res) => {
    try {
        const genderCount = await User.aggregate([
            { $match: { role: 'student', isDeleted: false } },
            { $group: { _id: '$gender', count: { $sum: 1 } } }
        ]);

        let maleCount = 0;
        let femaleCount = 0;
        genderCount.forEach(gender => {
            if (gender._id === 'male') maleCount = gender.count;
            if (gender._id === 'female') femaleCount = gender.count;
        });

        const totalCount = maleCount + femaleCount;
        const malePercentage = totalCount ? ((maleCount / totalCount) * 100).toFixed(2) : 0;
        const femalePercentage = totalCount ? ((femaleCount / totalCount) * 100).toFixed(2) : 0;

        res.status(200).json({
            totalCount,
            malePercentage,
            femalePercentage,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to get student stats', error: error.message });
    }
};

exports.uploadImageToCourse = async (req, res) => {
    try {
        const { courseId } = req.params;

        const result = await cloudinary.uploader.upload(req.file.path);

        const updatedCourse = await Course.findByIdAndUpdate(
            courseId,
            { image: result.secure_url }
        );

        if (!updatedCourse) {
            return res.status(404).json({ message: 'Course not found' });
        }

        res.json(updatedCourse);
    } catch (error) {
        console.error('Error uploading image:', error);
        res.status(500).json({ message: 'Failed to upload image', error: error.message });
    }
};

const fetch = require('node-fetch');

exports.fetchInstrumentData = async (req, res) => {
    const apiKey = process.env.SCRAPINGBEE_API_KEY;
    const targetUrl = 'https://www.musiciansfriend.com/';

    try {
        const response = await fetch(`https://app.scrapingbee.com/api/v1/?api_key=${apiKey}&url=${encodeURIComponent(targetUrl)}`, {
            method: 'GET'
        });
        if (!response.ok) throw new Error('Failed to fetch data from ScrapingBee');

        const html = await response.text();
        const data = parseInstrumentData(html);
        res.json(data);
    } catch (error) {
        console.error('Error fetching instrument data:', error);
        res.status(500).json({ message: error.message });
    }
};

function parseInstrumentData(html) {
    // Example parsing logic (you'll need to adjust this based on the actual HTML structure)
    const cheerio = require('cheerio');
    const $ = cheerio.load(html);
    const instruments = [];

    $('.instrument').each(function() {
        const name = $(this).find('.name').text().trim();
        const popularity = parseInt($(this).find('.popularity').text(), 10);
        instruments.push({ name, popularity });
    });
    console.log(html);
    return instruments;
}
const cheerio = require('cheerio');


exports.scrapeData = async (req, res) => {
    const apiKey = process.env.SCRAPINGBEE_API_KEY;
    const url = 'https://www.musiciansfriend.com/hot-and-trending#N=3020615&pageName=collection-page&Nao=0&recsPerPage=90&Ns=bS';
    const searchTerm = req.query.searchTerm || "guitar";

    try {
        const response = await fetch(`https://app.scrapingbee.com/api/v1/?api_key=${apiKey}&url=${encodeURIComponent(url)}&render_js=true`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const body = await response.text();
        const $ = cheerio.load(body);
        let products = [];
        $('.product-card').each((index, element) => {
            const name = $(element).find('.product-card-title a').text().trim();
            const price = $(element).find('.product-card-price .sale-price').first().text().trim().replace('$', '');

            if (name.toLowerCase().includes(searchTerm.toLowerCase())) {
                const numericPrice = parseFloat(price.replace(/[,]/g, ''));  // Convert price to float, handling commas
                if (!isNaN(numericPrice)) {  // Ensure number
                    products.push({ name, price: numericPrice });
                }
            }
        });

        if (products.length === 0) {
            return res.status(404).json({ message: "No products found for the given search term." });
        }

        // Calculate average price of filtered products
        const total = products.reduce((acc, product) => acc + product.price, 0);
        const averagePrice = total / products.length;

        res.json({ products, averagePrice });
    } catch (error) {
        console.error('Error scraping data:', error);
        res.status(500).json({ message: 'Failed to scrape data', error: error.toString() });
    }
};


exports.getInstrumentPopularity = async (req, res) => {
    const apiKey = process.env.SCRAPINGBEE_API_KEY;
    const url = 'https://www.musiciansfriend.com/hot-and-trending';
    const instruments = req.body.instruments || [];

    try {
        const response = await fetch(`https://app.scrapingbee.com/api/v1/?api_key=${apiKey}&url=${encodeURIComponent(url)}&render_js=true`);
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

        const body = await response.text();
        const $ = cheerio.load(body);
        let popularityData = instruments.reduce((acc, instrument) => ({ ...acc, [instrument]: 0 }), {});

        $('.product-card').each((_, element) => {
            const title = $(element).find('.product-card-title a').text().toLowerCase();
            instruments.forEach(instrument => {
                if (title.includes(instrument.toLowerCase())) {
                    popularityData[instrument]++;
                }
            });
        });

        res.json(popularityData);
    } catch (error) {
        console.error('Error scraping data:', error);
        res.status(500).json({ message: 'Failed to scrape data', error: error.toString() });
    }
};




