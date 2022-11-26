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
const Invoice = ({ user }) => {
  const { state } = useLocation();
  // console.log(state);
  const [selectedPayroll, setSelectedPayroll] = useState(state);
  var totalAmount = 0;

  const handleAdjustments = (arr, baseAmount) => {
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
    // console.log(sum + Number(baseAmount));
    totalAmount = totalAmount + sum + Number(baseAmount);
    return sum + Number(baseAmount);
  };
  const updateInvoiceDueDate = (value) => {
    console.log(moment(value).format("DD-MM-YYYY"));
    axios
      .post("/myPayroll/updateinvoiceduedate", {
        _id: selectedPayroll?._id,
        dueDate: moment(value).format("DD-MM-YYYY"),
      })
      .then((res) => {
        // console.log(res.data);
        setSelectedPayroll(res.data);
      })
      .catch((err) => console.log(err + "Specific Project 35"));
  };

  const handleSendEmail = () => {
    const input = document.getElementById("downloadinvoicepdf");
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      // console.log(imgData);
      var allSelectedEmployees = selectedPayroll?.employees.map(
        (emp, index) => {
          return emp.employeeUsername;
        }
      );
      // console.log(allSelectedEmployees);
      confirmAlert({
        title: "Confirmation",
        message: `Are you sure you want to send Invoice Pdf as email to selected employees? ${allSelectedEmployees.map(
          (emp, index) => {
            if (index === selectedPayroll?.employees.length - 1) return emp;
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
                <td>{selectedPayroll?.invoice._id.substring(0, 30)}</td>
              </tr>
              <tr>
                <th>Invoice Date : </th>
                <td>{selectedPayroll?.invoice.date}</td>
              </tr>
              <tr>
                <th>Due Date :</th>
                {/* <td>{selectedPayroll?.invoice.dueDate}</td> */}
                <td>
                  <Editable
                    displayClass="invoice-due-date"
                    editClass="invoice-due-date-edit"
                    defaultValue={selectedPayroll?.invoice.dueDate}
                    text={selectedPayroll?.invoice.dueDate}
                    type={"date"}
                    placeholder="Due Date"
                    onSubmit={updateInvoiceDueDate}
                    emp={user?.role == "Employee" ? true : undefined}
                  />
                </td>
              </tr>
            </table>
          </Col>
        </Row>

        <Row style={{ marginTop: 48 }}>
          <div>
            Employees:{" "}
            <strong>
              {selectedPayroll?.employees.map((emp, index) => {
                if (index === selectedPayroll?.employees.length - 1)
                  return <span key={index}>{emp.employeeUsername}</span>;

                return <span key={index}>{emp.employeeUsername},</span>;
              })}
            </strong>
          </div>
          {/* <div>Bannerghatt Road,</div>
          <div>Bangalore - 560076</div> */}
        </Row>

        <Row style={{ marginTop: 48 }}>
          <Table striped bordered hover>
            <div className="watermark">
              {selectedPayroll?.paid ? "Paid" : "Not Paid"}
            </div>
            <thead>
              <tr>
                <th>Name</th>
                <th>Total Time</th>
                <th>Base Amount</th>
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
                    <td>
                      {handleAdjustments(emp.adjustments, emp.baseAmount)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
          {/* <Table
            dataSource={[
              {
                id: 1,
                name: "Accommodation (Single Occupancy)",
                description: "Accommodation",
                price: 1599,
                quantity: 1,
              },
            ]}
            pagination={false}
          >
            <Table.Column title="Items" dataIndex="name" />
            <Table.Column title="Description" dataIndex="description" />
            <Table.Column title="Quantity" dataIndex="quantity" />
            <Table.Column title="Price" dataIndex="price" />
            <Table.Column title="Line Total" />
          </Table> */}
        </Row>

        <Row style={{ marginTop: 48 }}>
          <Col span={8} offset={16}>
            <table>
              <tr>
                <th>Gross Total :</th>
                <td>$ {totalAmount}</td>
              </tr>
              <tr>
                <th>Tax 0%:</th>
                <td>$ {totalAmount}</td>
              </tr>
              {/* <tr>
                <th>CGST @6% :</th>
                <td>Rs. 95.94</td>
              </tr> */}
              <tr>
                <th>Net Total :</th>
                <td>$ {totalAmount}</td>
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

export default Invoice;
