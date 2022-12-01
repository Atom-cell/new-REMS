import axios from "axios";
import moment from "moment";
import React, { useState } from "react";
import { Row, Col, Table } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import Editable from "../Boards/Editabled/Editable";
import GenericPdfDownloader from "./GenericPdfDownloader";
import { Button } from "react-bootstrap";
import "./invoice.css";
import { confirmAlert } from "react-confirm-alert";
import { toast } from "react-toastify";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
const DownloadInvoice = ({ user }) => {
  const { state } = useLocation();
  // console.log(state);
  const [selectedInvoice, setSelectedInvoice] = useState(state.selectedInvoice);
  const [projects, setProjects] = useState(state.projects);

  const handleSendEmail = () => {
    const input = document.getElementById("downloadinvoicepdf");
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      // console.log(imgData);
      var allSelectedEmployees = selectedInvoice?.employees.map(
        (emp, index) => {
          return emp.employeeUsername;
        }
      );
      // console.log(allSelectedEmployees);
      confirmAlert({
        title: "Confirmation",
        message: `Are you sure you want to send Invoice Pdf as email to selected employees? ${allSelectedEmployees.map(
          (emp, index) => {
            if (index === selectedInvoice?.employees.length - 1) return emp;
            return emp + ",";
          }
        )}`,
        buttons: [
          {
            label: "Send",
            onClick: () => {
              axios
                .post("/emp/emailinvoice", {
                  employerId: user._id,
                  emps: allSelectedEmployees,
                  file: imgData,
                })
                .then((rec) => {
                  // console.log(rec.data);
                  toast.success(`${rec.data}`);
                })
                .catch((err) => console.log(err));
            },
          },
          {
            label: "Cancel",
          },
        ],
      });
    });
  };

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
  return (
    <div style={{ display: "flex" }}>
      <div style={{ padding: 20, width: "800px" }} id="downloadinvoicepdf">
        <div
          className="invoice-heading"
          style={{ display: "flex", justifyContent: "space-between" }}
        >
          <h1>REMS</h1>
          <h6>Pakistan</h6>
        </div>
        <Row>
          <Col>
            <div
              style={{
                width: "100%",
                height: "20px",
                borderBottom: "1px solid black",
                textAlign: "center",
              }}
            >
              <span
                style={{
                  fontSize: "20px",
                  backgroundColor: "#F3F5F6",
                  padding: "0 10px",
                }}
              >
                Invoice
              </span>
            </div>
          </Col>
        </Row>

        <Row gutter={24} style={{ marginTop: 32 }}>
          <Col span={8}>
            <h3>{user?.username}</h3>
            <div>{user?.email}</div>
            {/* <div>Vijaya Bank Layout,</div>
            <div>Bannerghatta Road,</div>
            <div>Bangalore - 560076</div> */}
          </Col>
          <Col span={8} offset={8}>
            <table>
              <tr>
                <th>Invoice Id :</th>
                <td>{selectedInvoice?._id.substring(0, 18)}</td>
              </tr>
              <tr>
                <th>Invoice Date : </th>
                <td>
                  &nbsp;
                  {moment(selectedInvoice?.createdAt).format("DD:MM:YYYY")}
                </td>
              </tr>
            </table>
          </Col>
        </Row>

        <Row style={{ marginTop: "60px" }}>
          <div>
            Projects:{" "}
            <strong>
              {projects?.map((pro, index) => {
                if (index === projects?.length - 1)
                  return <span key={index}>{pro.projectName}</span>;

                return <span key={index}>{pro.projectName},</span>;
              })}
            </strong>
          </div>
        </Row>

        <Row style={{ marginTop: 48 }}>
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
                      $ &nbsp;
                      {calculateWage(emp.totalTime, emp.hourlyRate).toFixed(2)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </Row>

        <Row>
          <Col span={8} offset={16}>
            <table>
              <tr>
                <th>Gross Total :</th>
                <td>$ &nbsp;{handleTotalAmount(selectedInvoice?.employees)}</td>
              </tr>
              <tr>
                <th>Tax 0%:</th>
                <td>$ &nbsp;{handleTotalAmount(selectedInvoice?.employees)}</td>
              </tr>
              <tr>
                <th>Net Total :</th>
                <td>$ &nbsp;{handleTotalAmount(selectedInvoice?.employees)}</td>
              </tr>
            </table>
          </Col>
        </Row>

        {/* <Row style={{ marginTop: 48, textAlign: "center" }}>notes</Row> */}
      </div>
      {/* <Row style={{ marginTop: 48, textAlign: "center" }}> */}
      <div style={{ marginTop: "20px", marginLeft: "50px" }}>
        <GenericPdfDownloader
          downloadFileName="CustomPdf"
          rootElementId="downloadinvoicepdf"
        />
        <Button
          style={{ backgroundColor: "#1890ff", marginLeft: "10px" }}
          onClick={handleSendEmail}
        >
          Send Via Email
        </Button>
      </div>
      {/* </Row> */}
    </div>
  );
};

export default DownloadInvoice;
