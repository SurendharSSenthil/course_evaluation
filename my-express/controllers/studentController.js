const StudentIDModel = require('../models/nameListModel');
const responseModel = require('../models/responseModel');
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
    const stdList = await StudentIDModel.find();
    console.log(stdList);
    res.json(stdList);
}

const getStudentById = async(req,res) => {
    const studentId = req.params.id;
    console.log(studentId);
    try {
      const studentData = await StudentModel.findOne({ stdId: studentId });
      console.log(studentData);
      if (studentData) {
        res.json(studentData);
      }
      else {
        res.json("Student Not Found");
      }
    } catch (error) {
      console.error('Error retrieving student data:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
}

const getCourseCount = async(req,res) => {
    const student = req.params.std;
    console.log(student);
    try{
      const resCount = await responseModel.countDocuments({stdId: student});
      console.log(resCount);
      res.json(resCount);
    }catch(err){
      console.log(err);
    }
}

module.exports = {
    submitForm,
    getStudentList,
    getStudentById,
    getStudentData,
    getCourseCount
}