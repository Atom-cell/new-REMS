import React from "react";
import { Button, Dropdown, Form, Table } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const NewInvoice = () => {
  const navigate = useNavigate();
  const handleFilterChange = () => {};
  return (
    <div className="projectContainer">
      <div className="project-header">
        <div className="select-option-new-payroll">
          <Dropdown>
            <Dropdown.Toggle
              style={{ backgroundColor: "#1890ff" }}
              id="dropdown-basic"
            >
              Time Range
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item href="#/action-1">This month</Dropdown.Item>
              <Dropdown.Item href="#/action-2">Last Month</Dropdown.Item>
              <Dropdown.Item href="#/action-3">Custom Range</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
        <div className="select-option-new-payroll">
          <Dropdown>
            <Dropdown.Toggle
              style={{ backgroundColor: "#1890ff" }}
              id="dropdown-basic"
            >
              Employees
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Form.Control
                type="search"
                placeholder="Search Employees"
                className="me-2 search-projects"
                aria-label="Search"
                // value={searchInput}
                // onChange={handleSearchChange}
                style={{ boxShadow: "#da0d50 !important" }}
              />
              <Dropdown.Item href="#/action-1">Naseer</Dropdown.Item>
              <Dropdown.Item href="#/action-2">Sani</Dropdown.Item>
              <Dropdown.Item href="#/action-3">Something else</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
        <div className="select-option-new-payroll">
          <Dropdown>
            <Dropdown.Toggle
              style={{ backgroundColor: "#1890ff" }}
              id="dropdown-basic"
            >
              Projects
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Form.Control
                type="search"
                placeholder="Search Projects"
                className="me-2 search-projects"
                aria-label="Search"
                // value={searchInput}
                // onChange={handleSearchChange}
                style={{ boxShadow: "#da0d50 !important" }}
              />
              <Dropdown.Item href="#/action-1">Project 1</Dropdown.Item>
              <Dropdown.Item href="#/action-2">Project 2</Dropdown.Item>
              <Dropdown.Item href="#/action-3">Something else</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </div>
      <div className="table">
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Name</th>
              <th>Total Time</th>
              <th>Total Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Mark</td>
              <td>Otto</td>
              <td>@mdo</td>
            </tr>
          </tbody>
        </Table>
      </div>
      <div className="create-project" style={{ marginTop: "20px" }}>
        <Button
          style={{ backgroundColor: "#1890ff" }}
          onClick={() => navigate("/allinvoice/invoicedetails")}
        >
          Create Invoice
        </Button>
        <Button
          variant="secondary mx-2"
          onClick={() => navigate("/allinvoice")}
        >
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default NewInvoice;
