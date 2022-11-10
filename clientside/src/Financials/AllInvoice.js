import React from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import { useNavigate } from "react-router-dom";
import "./allpayroll.css";
const AllInvoice = ({ user }) => {
  const navigate = useNavigate();
  return (
    <div className="projectContainer">
      <div className="project-header">
        <div className="search-container">
          <Form.Control
            type="search"
            placeholder="Search Payroll"
            className="me-2 search-projects"
            aria-label="Search"
            // value={searchInput}
            // onChange={handleSearchChange}
            style={{ boxShadow: "#da0d50 !important" }}
          />
        </div>
        <div className="create-project">
          <Button
            style={{ backgroundColor: "#1890ff" }}
            onClick={() => navigate("/allinvoice/newinvoice")}
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
              <th>Status</th>
              <th>Date Range</th>
              <th>Total Time</th>
              <th>Total Amount</th>
              <th># of People</th>
              <th>View</th>
              <th>Download</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1</td>
              <td>Mark</td>
              <td>Otto</td>
              <td>@mdo</td>
              <td>$15</td>
              <td>5</td>
              <td onClick={() => navigate("/allinvoice/invoicedetails")}>
                View
              </td>
              <td>Download</td>
              <td>Delete</td>
            </tr>
          </tbody>
        </Table>
      </div>
    </div>
  );
};

export default AllInvoice;
