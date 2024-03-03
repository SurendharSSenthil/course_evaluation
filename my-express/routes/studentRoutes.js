const express = require('express');
const router = express.Router();
const { submitForm,
        getStudentList,
        getStudentById,
        getStudentData,
        getCourseCount  } = require('../controllers/studentController');

        router.get('/admin/:std', getCourseCount);
        router.get('/studentList/:sem', getStudentList);
        router.get('/:id', getStudentById);
router.post('/studentID', getStudentData);
router.post('/submit-form', submitForm);

module.exports = router;
