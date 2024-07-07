import React, { useState } from "react";
import "./Main.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { url } from "./url";
import { Table, Spin, notification } from "antd";

const Admin2 = () => {
	const [std, setStd] = useState([]);
	const [loading, setLoading] = useState(false);

	const fetchData = async (e) => {
		setLoading(true);
		try {
			const stdListResponse = await fetch(
				`${url}/student/studentList/${e.target.value}`
			);
			const stdList = await stdListResponse.json();
			console.log(stdList);
			if (!(stdList.length > 0)) {
				setLoading(false);
				setStd([]);
				notification.info({
					message: "No response Found",
					description: `No students in sem ${e.target.value}`,
				});
			} else {
				const studentIds = stdList.map((student) => student.stdId);
				console.log(studentIds);
				const courseCountsResponse = await fetch(
					`${url}/student/admin/courseCounts`,
					{
						method: "POST",
						headers: {
							"Content-Type": "application/json",
						},
						body: JSON.stringify({ students: studentIds }),
					}
				);
				const courseCounts = await courseCountsResponse.json();
				console.log(courseCounts);
				const studentsWithCourses = stdList.map((student) => {
					const count = courseCounts.find(
						(count) => count.studentId === student.stdId
					).count;
					return {
						RegNo: student.stdId,
						Name: student.stdName,
						CoursesSubmitted: count,
					};
				});
				setStd(studentsWithCourses);
				setLoading(false);
			}
		} catch (error) {
			console.error("Error fetching data:", error);
		}
	};

	const columns = [
		{
			title: "Register No",
			dataIndex: "RegNo",
			key: "RegNo",
		},
		{
			title: "Student Name",
			dataIndex: "Name",
			key: "Name",
		},
		{
			title: "Number of Courses Submitted",
			dataIndex: "CoursesSubmitted",
			key: "CoursesSubmitted",
			render: (text, record) => <span style={{ color: "blue" }}>{text}</span>,
		},
	];

	return (
		<>
			<h3>Feedback submission</h3>
			<div className="selectDiv">
				<label className="divLabel">Select the Semester : </label>
				<select
					id="sem"
					className="form-control admin-page"
					onChange={fetchData}
				>
					<option value="I">I</option>
					<option value="II">II</option>
					<option value="III">III</option>
					<option value="IV">IV</option>
					<option value="V">V</option>
					<option value="VI">VI</option>
					<option value="VII">VII</option>
					<option value="VIII">VIII</option>
				</select>
			</div>
			{loading ? (
				<div id="spin">
					<Spin size="large"></Spin>
				</div>
			) : std.length > 0 ? (
				<Table dataSource={std} columns={columns} />
			) : (
				<></>
			)}
		</>
	);
};

export default Admin2;
