import React, { useEffect, useState } from "react";
import { Button, Table } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import moment from "moment";
import axios from "axios";
const InvoiceDetails = ({ user, currency }) => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [selectedInvoice, setSelectedInvoice] = useState(state);
  const [projects, setProjects] = useState();

  const calculateWage = (time, hourlyRate) => {
    // console.log(time);
    const [hours, minutes, seconds] = time.split(":");
    var totalSeconds =
      Number(hours) * 60 * 60 + Number(minutes) * 60 + Number(seconds);
    // console.log(totalSeconds);
    // now convert totalseconds to hours
    var totalHours = totalSeconds / 3600;
    // console.log(totalHours);
    //now calculate total wage
    return totalHours * hourlyRate;
  };

  const handleTotalAmount = (employees) => {
    var sum = 0;
    employees.forEach((emp) => {
      sum = sum + calculateWage(emp.totalTime, emp.hourlyRate);
    });
    return sum.toFixed(2);
  };

  const handleTotalTime = (employees) => {
    var totalTime;
    employees.forEach((emp) => {
      totalTime = moment
        .duration(totalTime)
        .add(moment.duration(emp.totalTime));
      totalTime = moment.utc(totalTime.as("milliseconds")).format("HH:mm:ss");
    });
    return totalTime;
  };

  useEffect(() => {
    // get all projects that are in selected Invoice
    console.log(selectedInvoice.projectId);
    axios
      .get("/myInvoice/getProjects", {
        params: { projectIds: selectedInvoice.projectId },
      })
      .then((rec) => {
        console.log(rec.data);
        setProjects(rec.data);
      })
      .catch((err) => console.log(err + "At 55 in Invoice Details"));
  }, []);

  return (
    <div>
      <div className="table-and-details-container">
        <div className="payroll-details-container">
          <div className="payroll-details">
            <div className="payroll-detail">
              <h5>Invoice Title:</h5>
              <span>{selectedInvoice?.invoiceTitle}</span>
            </div>
            <div className="payroll-detail">
              <h5>Created At:</h5>
              <span>
                {moment(selectedInvoice?.createdAt).format("DD-MM-YYYY")}
              </span>
            </div>
            <div className="payroll-detail">
              <h5>Invoice Range:</h5>
              <span>{`${selectedInvoice?.dateRange.substring(
                0,
                10
              )}---${selectedInvoice?.dateRange.substring(20, 30)}`}</span>
            </div>
            <div className="payroll-detail">
              <h5>Total Amount:</h5>
              <span>
                {currency?.symbol} &nbsp;
                {handleTotalAmount(selectedInvoice?.employees)}
              </span>
            </div>
            <div className="payroll-detail">
              <h5>Total Time:</h5>
              <span>{handleTotalTime(selectedInvoice?.employees)}</span>
            </div>
          </div>
          {user?.role !== "Employee" && (
            <div className="payroll-detail">
              <div>
                <Button
                  onClick={() =>
                    navigate("/allinvoice/downloadinvoice", {
                      state: {
                        projects: projects,
                        selectedInvoice: selectedInvoice,
                      },
                    })
                  }
                >
                  Download Invoice
                </Button>
              </div>
            </div>
          )}
        </div>
        <div className="table">
          <div style={{ margin: "30px 0 30px 0" }}>
            <h6 style={{ display: "inline-block" }}>Projects:</h6>
            {projects?.map((pro, index) => {
              if (index === projects?.length - 1)
                return <span key={index}>{pro.projectName}</span>;

              return <span key={index}>{pro.projectName},</span>;
            })}
          </div>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Name</th>
                <th>Total Time</th>
                <th>Total Amount</th>
              </tr>
            </thead>
            <tbody>
              {selectedInvoice?.employees.map((emp, index) => {
                return (
                  <tr key={index}>
                    <td>{emp.employeeUsername}</td>
                    <td>{emp.totalTime}</td>
                    <td>
                      {currency?.symbol} &nbsp;
                      {calculateWage(emp.totalTime, emp.hourlyRate).toFixed(2)}
                    </td>
                    {/* <td
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
                  </td> */}
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default InvoiceDetails;
