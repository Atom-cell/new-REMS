import React from "react";
import { Table } from "react-bootstrap";

const InvoiceDetails = () => {
  return (
    <div>
      {/* <h1>Payroll Details</h1> */}
      <div className="payroll-details">
        <div className="payroll-detail">
          <h6>Payroll Id:</h6>
          <span>0000-0005</span>
        </div>
        <div className="payroll-detail">
          <h6>Created At:</h6>
          <span>0000-0005</span>
        </div>
        <div className="payroll-detail">
          <h6>Payroll Range:</h6>
          <span>0000-0005</span>
        </div>
        <div className="payroll-detail">
          <h6>Total Amount:</h6>
          <span>0000-0005</span>
        </div>
        <div className="payroll-detail">
          <h6>Total Time:</h6>
          <span>0000-0005</span>
        </div>
        <div className="payroll-detail">
          <h6>Total Projects:</h6>
          <span>0000-0005</span>
        </div>
        <div className="payroll-detail">
          <h6>Status:</h6>
          <span>Manually Created</span>
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
    </div>
  );
};

export default InvoiceDetails;
