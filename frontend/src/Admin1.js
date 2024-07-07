import React, { useState, useEffect } from "react";
import { url } from "./url";
import { Table, Input, Select, Button, notification } from "antd";
import "./Admin.css";

const { Option } = Select;

const Admin2 = () => {
	const [studentId, setStudentId] = useState("");
	const [courseCode, setCourseCode] = useState("");
	const [response, setResponse] = useState([]);
	const [courses, setCourses] = useState([]);
	const [stdName, setStdName] = useState("");
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		const fetchCourses = async () => {
			try {
				const res = await fetch(`${url}/admin/courses`);
				if (!res.ok) {
					throw new Error("Failed to fetch courses");
				}
				const data = await res.json();
				setCourses(data);
			} catch (error) {
				console.error("Error fetching courses:", error);
				notification.error({ message: "Error", description: error.message });
			}
		};
		fetchCourses();
	}, []);

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);

		try {
			const formData = { studentId, courseCode };
			const res = await fetch(`${url}/admin/responsedata`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(formData),
			});
			if (!res.ok) {
				throw new Error("Failed to fetch response data");
			}

			const data = await res.json();
			setStdName(data.stdName);
			setResponse(data.responses);
		} catch (error) {
			console.error("Error fetching response data:", error);
			notification.error({
				message: "Not Found",
				description: "Response not found",
			});
			setResponse([]);
		} finally {
			setLoading(false);
		}
	};

	const columns = [
		{
			title: "Question",
			dataIndex: "question",
			key: "question",
		},
		{
			title: "Response",
			dataIndex: "response",
			key: "response",
		},
	];

	return (
		<div className="root-div">
			<h3>Student Response</h3>
			<form onSubmit={handleSubmit} id="admin-form">
				<div>
					<label htmlFor="studentId">Student ID:</label>
					<Input
						id="studentId"
						value={studentId}
						onChange={(e) => setStudentId(e.target.value)}
						className="input"
					/>
				</div>
				<div>
					<label htmlFor="courseCode">Select Course:</label>
					<Select
						id="courseCode"
						value={courseCode}
						onChange={(value) => setCourseCode(value)}
						className="input"
					>
						<Option value="">Select Course</Option>
						{courses.map((course) => (
							<Option key={course.coursecode} value={course.coursecode}>
								{course.coursename}
							</Option>
						))}
					</Select>
				</div>
				<Button type="primary" htmlType="submit" loading={loading}>
					Submit
				</Button>
			</form>
			{response.length > 0 && (
				<div id="responses">
					<div id="stdData">
						<p>
							<span id="stdData__span">Student Name :</span>{" "}
							<span style={{ color: "rgb(93, 42, 165)" }}>{stdName}</span>
						</p>
						<p>
							<span id="stdData__span">Register Number :</span>{" "}
							<span style={{ color: "rgb(93, 42, 165)" }}>{studentId}</span>
						</p>
					</div>
					<Table dataSource={response} columns={columns} pagination={false} />
				</div>
			)}
		</div>
	);
};

export default Admin2;
