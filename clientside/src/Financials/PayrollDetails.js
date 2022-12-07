import axios from "axios";
import moment from "moment";
import React, { useState } from "react";
import { Button, Table } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import Adjustments from "./Adjustments";
const { v4: uuidV4 } = require("uuid");

const PayrollDetails = ({ user, currency }) => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const [selectedPayroll, setSelectedPayroll] = useState(state);
  const [employee, setEmployee] = useState();

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  //   console.log(state);

  const updateAmount = (adjustment, comment, employee) => {
    // console.log(employee);
    // console.log(adjustment);
    // console.log(comment);
    // console.log(selectedPayroll?.employees);
    // create an array of objects and then create a field in employee and then push it there
    const myObj = {
      adjustment: adjustment,
      comment: comment,
    };
    selectedPayroll?.employees.forEach((element) => {
      if (element._id === employee._id) {
        console.log(element);
        element.adjustments.push(myObj);
      }
    });
    // console.log(selectedPayroll);

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

  const ultimateTotalAmount = (baseAmount, adjustments) => {
    var adjustment = handleAdjustments(adjustments);
    var num1 = Number(baseAmount);
    var num2 = Number(adjustment);
    var result = num1 + num2;
    return result.toFixed(2);
  };
  return (
    <div>
      <div className="table-and-details-container">
        <div className="payroll-details-container">
          <div className="payroll-detail">
            <h5>Payroll Title:</h5>
            <span>{selectedPayroll?.payrollTitle}</span>
          </div>
          <div className="payroll-detail">
            <h5>Created At:</h5>
            <span>
              {moment(selectedPayroll?.createdAt).format("DD-MM-YYYY")}
            </span>
          </div>
          <div className="payroll-detail">
            <h5>Payroll Range:</h5>
            <span>{`${selectedPayroll?.dateRange.substring(
              0,
              10
            )}---${selectedPayroll?.dateRange.substring(20, 30)}`}</span>
          </div>
          <div className="payroll-detail">
            <h5>Amount Before Adjustments:</h5>
            <span>
              {currency?.symbol} {""}
              {selectedPayroll?.totalAmount}
            </span>
          </div>
          <div className="payroll-detail">
            <h5>Total Time:</h5>
            <span>{selectedPayroll?.totalTime}</span>
          </div>
          <div className="payroll-detail">
            {selectedPayroll.invoice ? (
              <>
                {user?.role !== "Employee" && (
                  <div>
                    <Button
                      style={{ backgroundColor: "#1890ff" }}
                      onClick={() =>
                        navigate("/allpayroll/generateinvoice", {
                          state: state,
                        })
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
                  <div>
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
          </div>
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
                    <td>
                      {currency?.symbol} {""}{" "}
                      {emp.baseAmount ? Number(emp.baseAmount).toFixed(2) : "0"}
                    </td>
                    <td
                      onClick={() => {
                        setEmployee(emp);
                        handleShow();
                      }}
                    >
                      {currency?.symbol} {""}{" "}
                      {handleAdjustments(emp.adjustments)}
                    </td>
                    <td>
                      {currency?.symbol}{" "}
                      {ultimateTotalAmount(emp.baseAmount, emp.adjustments)}
                      {/* {Number(emp.baseAmount).toFixed(2) +
                      handleAdjustments(emp.adjustments)} */}
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
            currency={currency}
          />
        </div>
      </div>
    </div>
  );
};

export default PayrollDetails;
