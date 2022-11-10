import React from "react";
import { Table } from "react-bootstrap";
import { useLocation } from "react-router-dom";

const PayrollDetails = () => {
  const { state } = useLocation();
  //   console.log(state);
  return (
    <div>
      {/* <h1>Payroll Details</h1> */}
      <div className="payroll-details">
        <div className="payroll-detail">
          <h6>Payroll Id:</h6>
          <span>{state?._id}</span>
        </div>
        <div className="payroll-detail">
          <h6>Created At:</h6>
          <span>{state?.createdAt}</span>
        </div>
        <div className="payroll-detail">
          <h6>Payroll Range:</h6>
          <span>{state?.dateRange}</span>
        </div>
        <div className="payroll-detail">
          <h6>Total Amount:</h6>
          <span>{state?.totalAmount}</span>
        </div>
        <div className="payroll-detail">
          <h6>Total Time:</h6>
          <span>{state?.totalTime}</span>
        </div>
        <div className="payroll-detail">
          <h6>Total Projects:</h6>
          <span>{state?.projectId.length}</span>
        </div>
        {/* <div className="payroll-detail">
          <h6>Status:</h6>
          <span>Manually Created</span>
        </div> */}
      </div>
      <div className="table">
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Name</th>
              <th>Total Time</th>
              <th>Base Amount</th>
              <th>Adjustments</th>
              <th>Total Amount</th>
            </tr>
          </thead>
          <tbody>
            {state?.employees.map((emp, index) => {
              return (
                <tr key={index}>
                  <td>{emp._id}</td>
                  <td>{emp.totalTime}</td>
                  <td>{emp.baseAmount ? emp.baseAmount : "0"}</td>
                  <td>{emp.adjustments ? emp.adjustments : "0"}</td>
                  <td>{emp.totalAmount ? emp.totalAmount : "0"}</td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </div>
    </div>
  );
};

export default PayrollDetails;
