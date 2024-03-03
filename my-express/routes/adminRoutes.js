const express = require('express');
const router = express.Router();
const { getCourses,
        getDashboardData,
        getResponseData,
        getSubmissionsCount } = require('../controllers/adminController');

router.get('/courses', getCourses);
router.post('/dashboard', getDashboardData);
router.post('/responsedata', getResponseData);
router.get('/:sub', getSubmissionsCount);

module.exports = router;
