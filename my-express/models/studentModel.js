const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  stdName: { type: String, required: true },
  stdId: { type: String, required: true },
  email: { type: String, required: true },
  phNo: { type: String, required: true },
  sem: { type: String, required: true },
  year: { type: String, required: true },
  courselist: { type: Object, required: true },
});

module.exports = mongoose.model('IIIyrstudent', studentSchema);
