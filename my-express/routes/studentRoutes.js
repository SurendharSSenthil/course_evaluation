const express = require('express');
const router = express.Router();
const { submitForm,
        getStudentList,
        getStudentById,
        getStudentData,
        getCourseCount  } = require('../controllers/studentController');

router.get('/studentList', getStudentList);
router.get('/admin/:std', getCourseCount);
router.get('/:id', getStudentById);
router.post('/studentID', getStudentData);
router.post('/submit-form', submitForm);

module.exports = router;
