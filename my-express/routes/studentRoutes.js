const express = require('express');
const router = express.Router();
const { submitForm,
        getStudentList,
        getCourseCounts,
        getStudentData,
        getStudentDataAtMain  } = require('../controllers/studentController');

router.post('/admin/courseCounts', getCourseCounts);
router.get('/studentList/:sem', getStudentList);
router.get('/:id', getStudentDataAtMain);
router.post('/studentID', getStudentData);
router.post('/submit-form', submitForm);

module.exports = router;
