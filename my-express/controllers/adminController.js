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

const getDashboardData = async(req,res) => {
    const reqData = req.body;

  try {
    let categoryScale;

    if (reqData.category === "Planning and organization") {
      categoryScale = 1;
    } else if (reqData.category === "Presentation and Communication") {
      categoryScale = 2;
    } else if (reqData.category === "Student participation") {
      categoryScale = 3;
    } else if (reqData.category === "Class Management") {
      categoryScale = 4;
    } else {
      return res.status(400).json({ error: 'Invalid category' });
    }

    const lowerBound = (categoryScale - 1) * 5 + 1;
    const upperBound = categoryScale * 5;

    const aggregationPipeline = [
      { $unwind: "$responses" },
      {
        $match: {
          "courseName": reqData.coursecode,
          "responses.qid": { $gte: lowerBound, $lte: upperBound }
        }
      },
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
          }
        }
      },
      {
        $project: {
          _id: 0,
          totalScore: 1
        }
      }
    ];

    const result = await responseModel.aggregate(aggregationPipeline);
    console.log(result);
    res.json(result);
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