
const express = require('express');
const router = express.Router();
const courseController = require('../../controllers/courseController/courseController');
const multer = require('multer');
const {app} = require("../../socket/socket");
const upload = multer({ dest: 'uploads/' });

const Airtable = require('airtable');
Airtable.configure({
    endpointUrl: 'https://api.airtable.com',
    apiKey: process.env.ArBaseKey
});

const base = Airtable.base(process.env.Base);


router.get('/notes', async (req, res) => {
    try {
        const records = await base('Notes').select({
            // Optionally filter or sort the results:
            maxRecords: 10,
            view: "Grid view"
        }).firstPage();

        const notes = records.map(record => ({
            id: record.id,
            title: record.get('Title'),
            content: record.get('Content'),
            date: record.get('Date'),
            // Handle linked records and other specifics as needed
        }));
        res.json(notes);
    } catch (error) {
        console.error('Error retrieving notes from Airtable:', error);
        res.status(500).send('Failed to retrieve notes');
    }
});

router.post('/notes', async (req, res) => {
    const { title, content, studentName } = req.body;

    try {
        const record = await base('Notes').create({
            "Title": title,
            "Content": content,
            "Student": studentName,
            "Date": new Date().toISOString().split('T')[0]
        });

        res.status(201).json(record);
    } catch (error) {
        console.error('Failed to create note in Airtable:', error);
        res.status(500).json({ message: 'Failed to create note' });
    }
});

router.get('/instruments', courseController.scrapeData);
router.get('/instruments/popularity', courseController.fetchAndCountWords);


router.get('/popular', courseController.getTopThreeCourses);
router.get('/students-stats', courseController.getStudentStats);
router.get('/teachers-stats',courseController.getTeacherStats );

router.get('/category/:category', courseController.listCoursesByCategory);

//Archive endpoint
router.get('/arch/archived', courseController.listArchivedCourses);
router.patch('/archive/:id', courseController.archiveCourse);



router.get('/:id', courseController.getCourse);
router.put('/:id', courseController.updateCourse);
router.delete('/:id', courseController.deleteCourse);
router.patch('/:courseId/add-students', courseController.addStudentsToCourse);

router.patch('/:courseId/upload-image', upload.single('image'), courseController.uploadImageToCourse);

router.put('/details/:courseId/teachers', courseController.updateCourseTeachers);
router.get('/details/:courseId/teachers', courseController.getAssignedTeachers);

router.get('/', courseController.listCourses);
router.post('/', courseController.createCourse);

module.exports = router;

