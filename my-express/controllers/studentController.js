const StudentIDModel = require('../models/nameListModel');
const responseModel = require('../models/responseModel');
const studentModel = require('../models/studentModel');
const StudentModel = require('../models/studentModel');

const getStudentData = async(req,res) => {
    const studentAuth = req.body;
    console.log(studentAuth);
    const studentID = studentAuth.regNo;
    const studentDOB = studentAuth.dob;
    try {
        const isFound = await StudentIDModel.find({ RegNo: studentID, DOB: studentDOB });
        console.log(isFound);
        if (isFound.length>0) {
        res.json(isFound);
        } else {
        res.json("Wrong password");
        }
    } catch (err) {
        console.error('Error retrieving student data:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

const submitForm = async(req,res) => {
    const formData = req.body;
    console.log(formData);

    try {
        console.log(formData.courseId);
        const newStudent = new responseModel({
        stdName: formData.stdName,
        stdId: formData.regNo,
        email: formData.email,
        phNo: formData.phNo,
        courseName: formData.courseName,
        courseId: formData.courseId,
        sem: formData.sem,
        year: formData.year,
        responses: formData.responses,
        });
        const duplicateEntry = await responseModel.countDocuments({ stdId: formData.regNo, courseName: formData.courseName });
        if (duplicateEntry !== 0) {
        res.json("Duplicate Entry");
        console.log(duplicateEntry);
        }
        else {
        console.log(duplicateEntry);
        await newStudent.save();

        console.log('Document successfully inserted');
        res.json({ message: 'Form Successfully Submitted!' });
        }
    } catch (e) {
        console.log('Error Occurred:', e.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

const getStudentList = async(req,res) => {
    console.log(req.params.sem);
    const stdList = await StudentModel.find({sem:req.params.sem})
    console.log(stdList);
    res.json(stdList);
}

const getCourseCounts = async (req, res) => {
  const students = req.body.students;
  console.log(req.body.students);
  try {
      const counts = await Promise.all(
          students.map(async (student) => {
              const count = await responseModel.countDocuments({ stdId: student });
              return { studentId: student, count };
          })
      );
      res.json(counts);
  } catch (err) {
      console.log(err);
      res.status(500).json({ error: 'Internal server error' });
  }
};


const getStudentDataAtMain = async(req,res) => {
    const student = req.params.id;
    try{
      const resCount = await studentModel.find({stdId: student});
      console.log(resCount[0]);
      res.json(resCount[0]);
    }catch(err){
      console.log(err);
    }
}

module.exports = {
    submitForm,
    getStudentList,
    getCourseCounts,
    getStudentData,
    getStudentDataAtMain
}