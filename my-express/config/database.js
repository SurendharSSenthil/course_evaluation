const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
	try {
		await mongoose.connect(process.env.MONGODB_CONNECTION_STRING, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			dbName: "StudentDB",
		});
		console.log(`MongoDB Connected ${process.env.MONGODB_CONNECTION_STRING}`);
	} catch (error) {
		console.error("MongoDB Connection Failed:", error);
		process.exit(1);
	}
};

module.exports = connectDB;
