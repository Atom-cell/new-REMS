import React from "react";
import { Table, Spinner } from "react-bootstrap";
import axios from "axios";
import moment from "moment";
import Chip from "@mui/material/Chip";
import { useNavigate } from "react-router-dom";

const Transactions = () => {
  const navigate = useNavigate();
  const [allPayrolls, setAllPayrolls] = React.useState();
  const [loading, setLoading] = React.useState(true);
  const [user, setUser] = React.useState(
    JSON.parse(localStorage.getItem("user"))
  );

  React.useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    if (user?.role === "Employee") {
      // get all payrolls where employees field has the curent logged in id
      const rec = await axios.get("/myPayroll/getemployeepayrolls", {
        params: { employeeUsername: user.username },
      });
      setAllPayrolls(rec.data);
    } else {
      const rec = await axios.get("/myPayroll/getallpayrolls", {
        params: { employerId: user._id },
      });
      filterData(rec.data);
    }
  };

  const filterData = (arr) => {
    const month = new Date().getMonth() + 1;
    let a = [];
    arr.forEach((t) => {
      if (new Date(t.createdAt).getMonth() + 1 === month) a.push(t);
    });

    console.log("arrrr: ", a);
    setAllPayrolls([...a]);
    setLoading(false);
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
    return sum.toFixed(2);
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
  return (
    <div>
      <h4 style={{ marginTop: "1em" }}>This Months Transactions</h4>
      {loading ? (
        <Spinner aimation="grow" />
      ) : (
        <div className="table all-meetings-table-container">
          {loading ? (
            <Spinner animation="grow" />
          ) : (
            <Table bordered>
              <thead>
                <tr>
                  <th>Payroll Title</th>
                  <th>Date Range</th>
                  <th>Total Amount</th>
                  {user?.role !== "Employee" && <th># of People</th>}
                  <th>Created At</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {allPayrolls?.map((p, i) => {
                  return (
                    <tr
                      key={i}
                      onClick={() => navigate("/allpayroll")}
                      style={{ cursor: "pointer" }}
                    >
                      <td>{p?.payrollTitle}</td>
                      <td>{`${p?.dateRange.substring(
                        0,
                        10
                      )}---${p?.dateRange.substring(20, 30)}`}</td>
                      {user?.role !== "Employee" ? (
                        <td>
                          $ &nbsp;
                          {handleTotalAmount(p?.employees)}
                        </td>
                      ) : (
                        <td>
                          $ &nbsp;
                          {p?.employees.map((emp) => {
                            // console.log(emp);
                            const { baseAmount } = emp;
                            var sum = 0;
                            if (emp?.employeeUsername === user?.username) {
                              if (emp?.adjustments.length > 0) {
                                sum = handleAdjustments(emp.adjustments);
                              }
                              // console.log(sum + Number(baseAmount));
                              return Number(baseAmount) + sum;
                            }
                          })}
                        </td>
                      )}
                      {user?.role !== "Employee" && (
                        <td>{p?.employees.length}</td>
                      )}
                      <td>
                        {moment(p?.createdAt).format("DD-MM-YYYY hh:mm a")}
                      </td>

                      <td>
                        {p?.paid ? (
                          <Chip
                            label="Paid"
                            sx={{
                              backgroundColor: "#e5faf2",
                              color: "#3bb077",
                            }}
                          />
                        ) : (
                          <Chip
                            label="Pending"
                            sx={{
                              backgroundColor: "#fff0f1",
                              color: "#d95087",
                            }}
                          />
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          )}
        </div>
      )}
    </div>
  );
};

export default Transactions;
