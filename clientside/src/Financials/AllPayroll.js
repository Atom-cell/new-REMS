import React, { useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import { useNavigate } from "react-router-dom";
import "./allpayroll.css";
import axios from "axios";
const AllPayroll = ({ user }) => {
  const navigate = useNavigate();
  const [allPayrolls, setAllPayrolls] = useState();

  useEffect(() => {
    // get all payrolls
    axios
      .get("/myPayroll/getallpayrolls", {
        params: { employerId: user._id },
      })
      .then((rec) => {
        // console.log(rec.data);
        setAllPayrolls(rec.data);
      })
      .catch((err) => console.log(err + "line 19 in All Payroll"));
  }, []);
  return (
    <div className="projectContainer">
      <div className="project-header">
        {/* <div className="search-container">
          <Form.Control
            type="search"
            placeholder="Search Payroll"
            className="me-2 search-projects"
            aria-label="Search"
            // value={searchInput}
            // onChange={handleSearchChange}
            style={{ boxShadow: "#da0d50 !important" }}
          />
        </div> */}
        <div className="create-project">
          <Button
            style={{ backgroundColor: "#1890ff" }}
            onClick={() => navigate("/allpayroll/newpayroll")}
          >
            Create New Payroll
          </Button>
        </div>
      </div>
      <div className="table">
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Payroll #</th>
              {/* <th>Status</th> */}
              <th>Date Range</th>
              <th>Total Time</th>
              <th>Total Amount</th>
              <th># of People</th>
              <th>View</th>
              <th>Download</th>
              <th>Pay</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {allPayrolls?.map((p, i) => {
              return (
                <tr key={i}>
                  <td>{p._id}</td>
                  <td>{p.dateRange}</td>
                  <td>{p.totalTime}</td>
                  <td>{p.totalAmount}</td>
                  <td>{p.employees.length}</td>
                  {/* <td>{}</td>
                        <td>{}</td>
                        <td>{}</td>
                        <td>{}</td> */}
                  <td onClick={() => navigate("/allpayroll/payrolldetails")}>
                    View
                  </td>
                  <td>Download</td>
                  <td>Pay</td>
                  <td>Delete</td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </div>
    </div>
  );
};

export default AllPayroll;
