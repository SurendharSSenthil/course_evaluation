import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

function Student({ stdName, setStdName, regNo, setRegNo, ret, setRet }) {
	const handleNameChange = (e) => {
		setStdName(e.target.value);
	};

	return (
		<div className="container">
			<div className="row">
				<div className="col-md-6">
					<div className="form-group">
						<label htmlFor="stdName">Student Name:</label>
						<input
							type="text"
							className="form-control"
							id="stdName"
							name="stdName"
							value={stdName}
							onChange={(e) => handleNameChange(e)}
							disabled={ret}
						/>
					</div>
				</div>
				<div className="col-md-6">
					<div className="form-group">
						<label htmlFor="regNo">Register Number:</label>
						<input
							type="text"
							className="form-control disInput"
							id="regNo"
							name="regNo"
							value={regNo}
							disabled
						/>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Student;
