const coursesModel = require('../models/coursesModel');
const responseModel = require('../models/responseModel');

const getCourses = async(req,res) => {
    try{
        const data = await coursesModel.find({},{coursename:1,coursecode:1});
        console.log(data);
        res.send(data);
    }catch(err){
    console.log(err);
  }
}

const getDashboardData = async (req, res) => {
  const courseList = req.body.courseList;
  const categories = { 1: "Planning and organization", 2: "Presentation and Communication", 3: "Student participation", 4: "Class Management" };

  try {
    let results = [];

    for (const course of courseList) {
      const courseData = {
        courseCode: course.coursecode,
        courseName: course.coursename,
        categories: []
      };

      for (const [categoryScale, categoryName] of Object.entries(categories)) {
        let categoryFlag = Number(categoryScale); // Convert to number
        const lowerBound = (categoryFlag - 1) * 5 + 1;
        const upperBound = categoryFlag * 5;

        const aggregationPipeline = [
          { $match: { "courseName": course.coursecode, "responses.qid": { $gte: lowerBound, $lte: upperBound } } },
          { $unwind: "$responses" },
          { $match: { "responses.qid": { $gte: lowerBound, $lte: upperBound } } },
          {
            $group: {
              _id: null,
              totalScore: {
                $sum: {
                  $switch: {
                    branches: [
                      { case: { $eq: ["$responses.response", "Excellent"] }, then: 5 },
                      { case: { $eq: ["$responses.response", "Very Good"] }, then: 4 },
                      { case: { $eq: ["$responses.response", "Good"] }, then: 3 },
                      { case: { $eq: ["$responses.response", "Fair"] }, then: 2 },
                      { case: { $eq: ["$responses.response", "Satisfactory"] }, then: 1 },
                    ],
                    default: 0
                  }
                }
              },
              totalStudents: { $sum: 1 }
            }
          }
        ];

        const result = await responseModel.aggregate(aggregationPipeline);
        courseData.categories.push({
          category: categoryName,
          totalScore: result.length > 0 ? result[0].totalScore : 0,
          totalStudents: result.length > 0 ? result[0].totalStudents : 0
        });
      }

      results.push(courseData);
    }

    const totalStudentsPerCourse = await Promise.all(courseList.map(async course => {
      const totalStudentsQuery = await responseModel.countDocuments({ "courseName": course.coursecode });
      return { courseCode: course.coursecode, totalStudents: totalStudentsQuery };
    }));

    results = results.map(courseData => {
      const totalStudentsForCourse = totalStudentsPerCourse.find(item => item.courseCode === courseData.courseCode);
      courseData.totalStudents = totalStudentsForCourse ? totalStudentsForCourse.totalStudents : 0;
      return courseData;
    });

    console.log("Final result ", results);
    res.json(results);
  } catch (err) {
    console.error('Error in aggregation:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}


const getResponseData = async(req,res) => {
    const { studentId, courseCode } = req.body;
  console.log(studentId, courseCode);
    try{
      const data = await responseModel.findOne({stdId: studentId, courseName: courseCode});
      console.log(data);
      res.send(data);
    }catch(err){
        console.log(err);
    }
}

const getSubmissionsCount = async(req,res) => {
    const subject = req.params.sub;
    console.log(subject);
    try {
        const stdCount = await responseModel.countDocuments({ courseName: subject });
        console.log(stdCount);
        res.json(stdCount);
    } catch (err) {
        console.log(err);
    }
}

module.exports = {
    getCourses,
    getDashboardData,
    getResponseData,
    getSubmissionsCount
}