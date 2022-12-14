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
import { ArrowDown, ArrowUp } from "react-feather";
const AllInvoice = ({ user, currency }) => {
  const publishableKey =
    "pk_test_51Izy3ZSCK5aoLzPXKSUJYks26dOaC522apZtLjmsLaHccU4kSw8Ez6RA0Bi6O0Ylbm3zIrir8ITdjhGnsHnDBMcZ00erYP3yzo";
  const navigate = useNavigate();
  const [allInvoices, setAllInvoices] = useState();
  const [searchInput, setSearchInput] = useState();
  const [ascending, setAscending] = useState(true);

  const handleTokenPay = async (token, id, amount) => {
    amount = parseInt(amount);
    console.log(typeof amount);
    console.log(amount);
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
      console.log(emp.totalTime);
      sum = sum + calculateWage(emp.totalTime, emp.hourlyRate);
    });
    return sum.toFixed(2);
  };

  const handleSearchChange = (e) => {
    e.preventDefault();
    setSearchInput(e.target.value);

    setTimeout(() => {
      const value = e.target.value;
      if (value === null || value === "" || value === undefined) {
        fetchData();
      } else {
        axios
          .get(`/myInvoice/searchinvoice/${e.target.value}`, {
            params: { empId: user._id },
          })
          .then((rec) => {
            console.log(rec.data);
            setAllInvoices(rec.data);
          })
          .catch((err) => console.log(err));
      }
    }, 1000);
  };

  const handleAscending = () => {
    // oldest ones comes first
    console.log("Ascending");
    setAscending(!ascending);
    var newArray = allInvoices.sort(function compare(a, b) {
      var dateA = new Date(a.createdAt);
      var dateB = new Date(b.createdAt);
      return dateA - dateB;
    });
    setAllInvoices(newArray);
  };
  const handleDescending = () => {
    // new ones comes first
    console.log("Descending");
    setAscending(!ascending);
    var newArray = allInvoices.sort(function compare(a, b) {
      var dateA = new Date(a.createdAt);
      var dateB = new Date(b.createdAt);
      return dateB - dateA;
    });
    setAllInvoices(newArray);
  };

  const fetchData = async () => {
    if (user?.role !== "Employee") {
      const rec = await axios.get("/myInvoice/getallinvoices", {
        params: { employerId: user._id },
      });
      console.log(rec.data);
      setAllInvoices(rec.data);
    }
  };

  useEffect(() => {
    fetchData().catch(console.error + "line 66 in All Payroll");
  }, []);
  return (
    <div className="projectContainer">
      <div className="project-header">
        <div className="search-container">
          <Form.Control
            type="search"
            placeholder="Search Invoice"
            className="me-2 search-projects"
            aria-label="Search"
            value={searchInput}
            onChange={handleSearchChange}
            style={{ boxShadow: "#da0d50 !important" }}
          />
        </div>
        {user?.role !== "Employee" && (
          <div
            className="create-project"
            style={{ display: "flex", marginLeft: "auto" }}
          >
            <div style={{ marginLeft: "10px" }}>
              <Button
                style={{ backgroundColor: "#1890ff" }}
                onClick={() => navigate("/allinvoice/newinvoice")}
              >
                Create New Invoice
              </Button>
            </div>
          </div>
        )}
      </div>
      <div className="table all-meetings-table-container">
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Invoice Title</th>
              <th>Date Range</th>
              <th>Total Amount</th>
              <th>View</th>
              {user?.role !== "Employee" && <th>Download</th>}
              <th>
                Created At
                <span>
                  {" "}
                  {ascending ? (
                    <ArrowUp onClick={handleAscending} />
                  ) : (
                    <ArrowDown onClick={handleDescending} />
                  )}{" "}
                </span>
              </th>
            </tr>
          </thead>
          <tbody>
            {allInvoices?.map((p, i) => {
              return (
                <tr key={i}>
                  <td>{p.invoiceTitle}</td>
                  <td>{p.dateRange}</td>
                  <td>
                    {currency?.symbol} &nbsp;
                    {handleTotalAmount(p.employees)}
                  </td>
                  <td
                    onClick={() =>
                      navigate("/allInvoice/invoicedetails", {
                        state: p,
                      })
                    }
                  >
                    View
                  </td>
                  {user?.role !== "Employee" && (
                    <td onClick={() => exportFile(p)}>Download</td>
                  )}
                  <td>{moment(p.createdAt).format("DD-MM-YYYY hh:mm a")}</td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </div>
    </div>
  );
};

export default AllInvoice;
