const mongoose = require('mongoose');

const courseListSchema = new mongoose.Schema({
  coursecode: String,
  coursename: String,
  questions: [{ qid: Number, question: String }]
});

module.exports = mongoose.model('IIIyrcourselist', courseListSchema);
