import axios from "axios";
import moment from "moment";
import React, { useState } from "react";
import { Button, Table } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import Adjustments from "./Adjustments";
const { v4: uuidV4 } = require("uuid");

const PayrollDetails = ({ user }) => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const [selectedPayroll, setSelectedPayroll] = useState(state);
  const [employee, setEmployee] = useState();

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  //   console.log(state);

  const updateAmount = (adjustment, comment) => {
    // console.log(adjustment);
    // console.log(comment);
    console.log(selectedPayroll?.employees);
    // create an array of objects and then create a field in employee and then push it there
    const myObj = {
      adjustment: adjustment,
      comment: comment,
    };
    selectedPayroll?.employees.forEach((element) => {
      if (element.employeeId === employee.employeeId) {
        element.adjustments.push(myObj);
      }
    });
    console.log(selectedPayroll);

    //payroll Id, employeeId, adjustments, comment

    axios
      .post("/myPayroll/addadjustment", selectedPayroll)
      .then((rec) => {
        console.log(rec.data);
      })
      .catch((err) => console.log(err + "Line 30 Payroll Details"));
  };

  const handleAdjustments = (arr) => {
    // console.log(arr);
    // [adjustment,comment]
    // find total adjustment i-e if add then add and if subtract then subtract
    let sum = 0;

    arr.forEach((element) => {
      if (element.adjustment.substring(0, 1) == "+") {
        sum = sum + Number(element.adjustment.substring(1));
      } else {
        sum = sum - Number(element.adjustment.substring(1));
      }
    });
    // console.log(sum);
    return sum;
  };
  const handleGenerateInvoice = () => {
    // console.log(moment().format("DD-MM-YYYY"));
    const myObj = {
      _id: uuidV4(),
      date: moment().format("DD-MM-YYYY"),
      dueDate: "",
    };
    axios
      .post("/myPayroll/generateinvoice", {
        _id: selectedPayroll._id,
        myObj: myObj,
      })
      .then((rec) => {
        // console.log(rec.data);
        // console.log(state);
        setSelectedPayroll(rec.data);
        navigate("/allpayroll/generateinvoice", { state: rec.data });
      })
      .catch((err) => console.log(err + "Line 69 in Payroll Details"));
  };
  return (
    <div>
      {/* <h1>Payroll Details</h1> */}
      <div className="payroll-details">
        <div className="payroll-detail">
          <h6>Payroll Id:</h6>
          <span>{selectedPayroll?._id}</span>
        </div>
        <div className="payroll-detail">
          <h6>Created At:</h6>
          <span>{moment(selectedPayroll?.createdAt).format("DD-MM-YYYY")}</span>
        </div>
        <div className="payroll-detail">
          <h6>Payroll Range:</h6>
          <span>{selectedPayroll?.dateRange}</span>
        </div>
        <div className="payroll-detail">
          <h6>Amount Before Adjustments:</h6>
          <span>{selectedPayroll?.totalAmount}</span>
        </div>
        <div className="payroll-detail">
          <h6>Total Time:</h6>
          <span>{selectedPayroll?.totalTime}</span>
        </div>
        {selectedPayroll.invoice ? (
          <>
            {user?.role !== "Employee" && (
              <div className="payroll-detail">
                <Button
                  style={{ backgroundColor: "#1890ff" }}
                  onClick={() =>
                    navigate("/allpayroll/generateinvoice", { state: state })
                  }
                >
                  View Invoice
                </Button>
              </div>
            )}
          </>
        ) : (
          <>
            {user?.role !== "Employee" && (
              <div className="payroll-detail">
                <Button
                  style={{ backgroundColor: "#1890ff" }}
                  onClick={handleGenerateInvoice}
                >
                  Generate Invoice
                </Button>
              </div>
            )}
          </>
        )}
        {/* <div className="payroll-detail">
          <h6>Total Projects:</h6>
          <span>{selectedPayroll?.projectId.length}</span>
        </div> */}
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
            {selectedPayroll?.employees.map((emp, index) => {
              return (
                <tr key={index}>
                  <td>{emp.employeeUsername}</td>
                  <td>{emp.totalTime}</td>
                  <td>{emp.baseAmount ? emp.baseAmount : "0"}</td>
                  <td
                    onClick={() => {
                      setEmployee(emp);
                      handleShow();
                    }}
                  >
                    {handleAdjustments(emp.adjustments)}
                  </td>
                  <td>
                    {Number(emp.baseAmount) +
                      handleAdjustments(emp.adjustments)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
        <Adjustments
          show={show}
          handleClose={handleClose}
          employee={employee}
          payroll={selectedPayroll}
          updateAmount={updateAmount}
        />
      </div>
    </div>
  );
};

export default PayrollDetails;
