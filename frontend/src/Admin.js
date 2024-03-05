import React, { useEffect, useState } from "react";
import { Table, Spin } from 'antd';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Admin.css';
import { url } from './url';

const Admin = () => {
    const categories = ["Planning and organization", "Presentation and Communication", "Student participation", "Class Management"];

    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const courseListResponse = await fetch(`${url}/admin/courses`);
                if (!courseListResponse.ok) {
                    throw new Error('Failed to fetch course list');
                }
                const courseList = await courseListResponse.json();

                const dashboardDataResponse = await fetch(`${url}/admin/dashboard`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ courseList: courseList })
                });
                if (!dashboardDataResponse.ok) {
                    throw new Error('Failed to fetch dashboard data');
                }
                const dashboardData = await dashboardDataResponse.json();
                console.log(dashboardData);
                const modifiedData = dashboardData.map(course => {
                    const totalScore = categories.reduce((acc, category) => acc + course.categories.find(cat => cat.category === category).totalScore, 0);
                    const avg = course.totalStudents !== 0 ? Math.round(totalScore / course.totalStudents) : 0;

                    return { ...course, totalScore, avg };
                });

                setData(modifiedData);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const columns = [
        {
            title: 'Course Code',
            dataIndex: 'courseCode',
            key: 'courseCode',
        },
        {
            title: 'Course Name',
            dataIndex: 'courseName',
            key: 'courseName',
        },
        ...categories.map(category => ({
            title: category,
            dataIndex: category.toLowerCase().replace(/\s+/g, '_'), // Convert spaces to underscores and make lowercase
            key: category.toLowerCase().replace(/\s+/g, '_'), // Convert spaces to underscores and make lowercase
            render: (text, record) => record.categories.find(cat => cat.category === category).totalScore // Render the totalScore for each category
        })),
        {
            title: 'Total Students',
            dataIndex: 'totalStudents',
            key: 'totalStudents',
        },
        {
            title: 'Total',
            dataIndex: 'totalScore',
            key: 'totalScore',
        },
        {
            title: 'Average',
            dataIndex: 'avg',
            key: 'avg',
        }
    ];

    return (
        <>
            <h3>Course Feedback Summary</h3>
            { loading ? (<div id="spin"><Spin size="large" /></div>) :
            (<div>
                <Table dataSource={data} columns={columns} pagination={false}/>
                <div id="footer">
                    <div id="designation">Faculty Advisor</div>
                    <div id="designation">Course Coordinator</div>
                    <div id="designation">Head Of the Department</div>
                </div>
            </div>)}
        </>
    );
};

export default Admin;
