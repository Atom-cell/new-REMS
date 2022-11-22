import React, { useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import { useNavigate } from "react-router-dom";
import StripeCheckout from "react-stripe-checkout";
import "./allpayroll.css";
import axios from "axios";
import { toast } from "react-toastify";
import moment from "moment";
import * as XLSX from "xlsx";
const AllPayroll = ({ user }) => {
  const publishableKey =
    "pk_test_51Izy3ZSCK5aoLzPXKSUJYks26dOaC522apZtLjmsLaHccU4kSw8Ez6RA0Bi6O0Ylbm3zIrir8ITdjhGnsHnDBMcZ00erYP3yzo";
  const navigate = useNavigate();
  const [allPayrolls, setAllPayrolls] = useState();

  const handleTokenPay = async (token, id, amount) => {
    // amount = parseInt(amount);
    // console.log(typeof amount);
    // console.log(amount);
    //name, address, postcode, city, India
    // token.card.name = "asdf";
    // token.card.address_line1 = "asd";
    // token.card.address_zip = "45400";
    // token.card.address_city = "Bara kau";
    // token.card.address_country = "Pakistan";
    // token.card.address_state = "Federal Capial &AJK";
    // console.log(token);
    await axios
      .post("/myPayroll/payment", {
        token: token,
        amount: amount,
        payrollId: id,
      })
      .then((rec) => {
        // console.log(rec.data);
        if (rec.data.status === "success") {
          toast.success("Payroll Paid");
          fetchData();
        }
      })
      .catch((err) => console.log(err));
  };

  const exportFile = (file) => {
    console.log(file.employees);
    /* convert state to workbook */
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(file.employees);
    XLSX.utils.book_append_sheet(wb, ws, "SheetJS");
    /* generate XLSX file and send to client */
    XLSX.writeFile(wb, "sheetjs.xlsx");
  };

  // function exportToExcel(tableSelect, filename = "") {
  //   alert("hl");
  //   var downloadurl;
  //   var dataFileType = "application/vnd.ms-excel";
  //   // var tableHTMLData = tableSelect.outerHTML.replace(/ /g, "%20");

  //   // Specify file name
  //   filename = filename ? filename + ".xls" : "export_excel_data.xls";

  //   // Create download link element
  //   downloadurl = document.createElement("a");

  //   document.body.appendChild(downloadurl);

  //   if (navigator.msSaveOrOpenBlob) {
  //     var blob = new Blob(["\ufeff", tableSelect], {
  //       type: dataFileType,
  //     });
  //     navigator.msSaveOrOpenBlob(blob, filename);
  //   } else {
  //     // Create a link to the file
  //     downloadurl.href = "data:" + dataFileType + ", " + tableSelect;

  //     // Setting the file name
  //     downloadurl.download = filename;

  //     //triggering the function
  //     downloadurl.click();
  //   }
  // }

  const handleAdjustments = (arr) => {
    console.log(arr);
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

  const handleTotalAmount = (employees) => {
    var sum = 0;
    employees.map((emp) => {
      // console.log(emp);
      const { baseAmount } = emp;
      if (emp.adjustments.length > 0) {
        sum = sum + handleAdjustments(emp.adjustments);
      }
      sum = Number(baseAmount) + sum;
      // console.log(sum + Number(baseAmount));
    });
    return sum;
  };

  const fetchData = async () => {
    if (user?.role === "Employee") {
      // get all payrolls where employees field has the curent logged in id
      const rec = await axios.get("/myPayroll/getemployeepayrolls", {
        params: { employeeUsername: user.username },
      });
      console.log(rec.data);
      setAllPayrolls(rec.data);
    } else {
      const rec = await axios.get("/myPayroll/getallpayrolls", {
        params: { employerId: user._id },
      });
      console.log(rec.data);
      setAllPayrolls(rec.data);
    }
  };

  useEffect(() => {
    fetchData().catch(console.error + "line 66 in All Payroll");
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
        {user?.role !== "Employee" && (
          <div className="create-project">
            <Button
              style={{ backgroundColor: "#1890ff" }}
              onClick={() => navigate("/allpayroll/newpayroll")}
            >
              Create New Payroll
            </Button>
          </div>
        )}
      </div>
      <div className="table">
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Payroll Id</th>
              {/* <th>Status</th> */}
              <th>Date Range</th>
              <th>Total Time</th>
              <th>Total Amount</th>
              {user?.role !== "Employee" && <th># of People</th>}
              <th>View</th>
              <th>Created At</th>
              {user?.role !== "Employee" && <th>Download</th>}
              <th>Pay</th>
              {/* <th>Delete</th> */}
            </tr>
          </thead>
          <tbody>
            {allPayrolls?.map((p, i) => {
              return (
                <tr key={i}>
                  <td>{p._id}</td>
                  <td>{p.dateRange}</td>
                  <td>{p.totalTime}</td>
                  {user?.role !== "Employee" ? (
                    <td>
                      $ &nbsp;
                      {handleTotalAmount(p.employees)}
                    </td>
                  ) : (
                    <td>
                      $ &nbsp;
                      {p.employees.map((emp) => {
                        // console.log(emp);
                        const { baseAmount } = emp;
                        var sum = 0;
                        if (emp.employeeUsername === user?.username) {
                          if (emp.adjustments.length > 0) {
                            sum = handleAdjustments(emp.adjustments);
                          }
                          // console.log(sum + Number(baseAmount));
                          return Number(baseAmount) + sum;
                        }
                      })}
                    </td>
                  )}
                  {user?.role !== "Employee" && <td>{p.employees.length}</td>}
                  {/* <td>{}</td>
                        <td>{}</td>
                        <td>{}</td>
                        <td>{}</td> */}

                  <td
                    onClick={() =>
                      navigate("/allpayroll/payrolldetails", {
                        state: p,
                      })
                    }
                  >
                    View
                  </td>
                  <td>{moment(p.createdAt).format("DD-MM-YYYY hh:mm a")}</td>
                  {user?.role !== "Employee" && (
                    <td onClick={() => exportFile(p)}>Download</td>
                  )}
                  {/* <td onClick={() => exportToExcel(p)}>Download</td> */}
                  {/* <td>Pay</td> */}
                  <td>
                    {p.paid ? (
                      "Paid"
                    ) : (
                      <>
                        {user?.role !== "Employee" ? (
                          <StripeCheckout
                            stripeKey={publishableKey}
                            label="Pay"
                            name="Pay With Credit Card"
                            // billingAddress
                            // shippingAddress
                            amount={p.totalAmount}
                            description={`Total Amount to be paid is: ${p.totalAmount}`}
                            token={(token) =>
                              handleTokenPay(token, p._id, p.totalAmount)
                            }
                          />
                        ) : (
                          "Not Paid"
                        )}
                      </>
                    )}
                  </td>
                  {/* <td>Delete</td> */}
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
