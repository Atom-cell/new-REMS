import axios from "axios";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { Button, Dropdown, Form, Table } from "react-bootstrap";
import DatePicker from "react-datepicker";
import { Check } from "react-feather";
import { useNavigate } from "react-router-dom";
import SearchBar from "../Componentss/SearchBar";

const NewPayroll = ({ user }) => {
  const navigate = useNavigate();
  const [dateRange, setDateRange] = useState();
  const [employees, setEmployees] = useState();
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [selectedEmployeesProject, setSelectedEmployeesProject] = useState([]);
  const [selectedProjects, setSelectedProjects] = useState([]);
  const [projects, setProjects] = useState();
  const [customDateRange, setCustomDateRange] = useState([null, null]);
  const [startDate, endDate] = customDateRange;
  const handleDateRange = (value) => {
    setSelectedEmployees([]);
    if (value === "thismonth") {
      ///THH:mm:ss
      const startOfMonth = moment()
        .startOf("month")
        .format("DD/MM/YYYY hh:mm A");
      const endOfMonth = moment().endOf("month").format("DD/MM/YYYY hh:mm a");
      //   console.log(startOfMonth);
      //   console.log(endOfMonth);
      setDateRange(`${startOfMonth}-${endOfMonth}`);
    } else if (value === "lastmonth") {
      const lastmonthfirstdate = moment()
        .subtract(1, "months")
        .startOf("month")
        .format("DD/MM/YYYY hh:mm a");

      const lastmonthlastdate = moment()
        .subtract(1, "months")
        .endOf("month")
        .format("DD/MM/YYYY hh:mm A");

      setDateRange(`${lastmonthfirstdate}-${lastmonthlastdate}`);
    }
  };
  const handleApply = (date) => {
    var start = moment(date[0]).format("DD/MM/YYYY hh:mm A");
    console.log(start);
    var end = moment(date[1]).format("DD/MM/YYYY hh:mm a");
    setDateRange(`${start}-${end}`);
  };

  const handleCreatePayroll = () => {
    // console.log(selectedEmployees);
    // id, user, totalTime for every employee
    var totalTime;
    var totalAmountWhole = 0;
    var newSelectedEmployees = selectedEmployees.map((emp) => {
      totalTime = moment
        .duration(totalTime)
        .add(moment.duration(emp.totalTime));
      console.log(typeof emp.totalAmount);
      totalAmountWhole = totalAmountWhole + emp.totalAmount;
      return {
        employeeUsername: emp.username,
        totalTime: emp.totalTime,
        baseAmount: emp.totalAmount,
      };
    });
    totalTime = moment.utc(totalTime.as("milliseconds")).format("HH:mm:ss");
    // console.log(totalTime);
    // console.log(selectedProjects);
    var newSelectedProjects = selectedProjects?.map((pro) => pro._id);
    // console.log(newSelectedProjects);

    const myObj = {
      employerId: user._id,
      dateRange: dateRange,
      totalAmount: totalAmountWhole.toFixed(3),
      totalTime: totalTime,
      paid: false,
      employees: newSelectedEmployees,
      //   employees: [
      //     {
      //       employeeId: "",
      //       totalTime: "",
      //       baseAmount: "",
      //       adjustments: "",
      //       commment: "",
      //     },
      //   ],
      projectId: newSelectedProjects,
    };
    // console.log(myObj);
    // With create payroll we have to also handle that for the date range marked is true for all selected Employees
    axios
      .post("/myPayroll/newpayroll", myObj)
      .then((rec) => {
        // console.log(rec.data);
        // handle for all employees the date range mark it true
        // console.log(selectedProjects);
        var firstDate = dateRange.substring(0, 10);
        var secondDate = dateRange.substring(20, 30);
        // console.log(selectedProjects);

        selectedProjects.forEach((element) => {
          // console.log(element.hoursWorked);
          // if hoursWorked[0].user==selectedEmployees.username and date is in range then mark that true
          element.hoursWorked.map((obj) => {
            // selectedEmployees.includes(item)
            selectedEmployees.map((obj2) => {
              if (
                obj.user === obj2.username &&
                moment(obj.date, "DD-MM-YYYY") >=
                  moment(firstDate, "DD-MM-YYYY") &&
                moment(obj.date, "DD-MM-YYYY") <=
                  moment(secondDate, "DD-MM-YYYY")
              ) {
                obj.marked = true;
              }
            });
          });
        });
        console.log(selectedProjects);

        axios
          .post("/myProjects/markhoursworkedtrue", {
            projects: selectedProjects,
          })
          .then((records) => {
            navigate("/allpayroll/payrolldetails", {
              state: rec.data,
            });
          })
          .catch((err) => console.log(err + "Line 132 in New Payroll"));
      })
      .catch((err) => {
        console.log(err + "line 61 New Payroll");
      });
  };

  const getAllProjects = (data) => {
    // check if projects has already any data project
    // if it has already that project then no need to add
    // otherwise setProjects
    data.forEach((element) => {
      const found = selectedProjects.find((obj) => obj._id === element._id);
      if (!found) {
        setSelectedProjects([...selectedProjects, element]);
      }
    });
    // setProjects(rec.data);
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

  const getInfo = (emp) => {
    // get info
    // you have selected Employees
    // get how many hours they have worked so far
    // in my projects hours worked
    // console.log(emps);
    var totalTime;
    axios
      .get("/myProjects/hoursworked", {
        params: {
          _id: JSON.parse(localStorage.getItem("user"))._id,
          emps: emp.username,
        },
      })
      .then((rec) => {
        // console.log(rec.data);
        getAllProjects(rec.data);
        var newArray = [];

        // filter hours worked
        // if date range ke darmiyaan ho and marked false ho then ok otherwise nikaal do
        rec.data.forEach((element) => {
          // console.log(element.hoursWorked);
          // console.log(dateRange.substring(3, 5));
          // get month
          var getMonth = dateRange.substring(3, 5);
          var dummyArray = element.hoursWorked.filter((el) => {
            const { date, marked } = el;
            // var check = el.date.toString().susbtring(3, 5);
            return date.substring(3, 5) === getMonth && marked === false;
          });
          Array.prototype.push.apply(newArray, dummyArray);
        });
        // console.log(newArray);
        // iterate above array
        // find emps.username
        // store and add that time infront of username
        if (rec.data.length > 0 && newArray.length > 0) {
          // rec.data.forEach((element) => {
          newArray.forEach((o) => {
            const totalAmount = calculateWage(o.time, emp.hourlyRate);
            if (o.user === emp.username) {
              totalTime = moment
                .duration(totalTime)
                .add(moment.duration(o.time));
              totalTime = moment
                .utc(totalTime.as("milliseconds"))
                .format("HH:mm:ss");
              setSelectedEmployees([
                ...selectedEmployees,
                {
                  _id: emp._id,
                  username: emp.username,
                  totalTime: totalTime,
                  totalAmount: totalAmount,
                },
              ]);
            }
          });
          // });
        } else {
          setSelectedEmployees([
            ...selectedEmployees,
            {
              _id: emp._id,
              username: emp.username,
              totalTime: "00:00:00",
              totalAmount: 0,
            },
          ]);
        }
      })
      .catch((err) => console.log(err));
  };

  const getDifference = (array1, array2) => {
    return array1.filter((object1) => {
      return !array2.some((object2) => {
        return object1.user === object2.username;
      });
    });
  };

  const getSelectedProjectInfo = (pro) => {
    axios
      .get("/myProjects/getmyproject", {
        params: {
          projectId: pro._id,
        },
      })
      .then((rec) => {
        console.log(rec.data[0].hoursWorked);
        console.log(selectedEmployeesProject);
        setSelectedProjects([...selectedProjects, rec.data[0]]);

        //a

        // if there are selected employees then only get those user and their total time

        // if there are no selected employees show all i-e else part and Add the duplicate entries time
        // const uniqueList = [];
        // rec.data[0].hoursWorked.map((obj, index) => {
        //   // console.log(obj);
        //   var data = uniqueList.find((ele) => {
        //     return ele.username === obj.user;
        //   });
        //   if (data) {
        //     //   console.log(data);
        //     // find in uniqe list and add time to that user
        //     var finding = uniqueList.map((ele) => {
        //       if (ele.username === obj.user) {
        //         ele.totalTime = moment
        //           .duration(ele.totalTime)
        //           .add(moment.duration(obj.time));
        //         ele.totalTime = moment
        //           .utc(ele.totalTime.as("milliseconds"))
        //           .format("HH:mm:ss");
        //       }
        //     });
        //   } else {
        //     uniqueList.push({
        //       _id: index,
        //       username: obj.user,
        //       totalTime: obj.time,
        //     });
        //   }
        // });
        // // console.log([...selectedEmployeesProject, ...uniqueList]);
        // setSelectedEmployeesProject([
        //   ...selectedEmployeesProject,
        //   ...uniqueList,
        // ]);
      })
      .catch((err) => console.log(err));
  };

  const handleEmployeeClick = (includes, emp) => {
    var emps = [];
    if (includes) {
      getInfo({
        _id: emp._id,
        username: emp.username,
        hourlyRate: emp.hourlyRate,
      });
    } else {
      emps = selectedEmployees.filter((em) => em._id !== emp._id);
    }
    setSelectedEmployees(emps);
  };

  const handleProjectClick = (includes, pro) => {
    var pros = [];
    if (includes) {
      getSelectedProjectInfo({ _id: pro._id, projectName: pro.projectName });
    } else {
      pros = selectedProjects.filter((em) => em._id !== pro._id);
      setSelectedProjects(pros);
    }
  };

  const handleSearchEmployees = (e) => {
    setTimeout(() => {
      const value = e.target.value;
      if (value == null || value == "" || value == undefined) {
        // console.log("hello");
        fetchEmployees();
      } else {
        const user = JSON.parse(localStorage.getItem("user"));
        if (localStorage.getItem("role") !== "Employee") {
          axios
            .get(`/emp/getallmyusersbyname/${value}`, {
              params: { _id: user._id },
            })
            .then((rec) => {
              // console.log(rec.data);
              var withoutMe = rec.data.filter((emp) => emp._id != user._id);
              setEmployees(withoutMe);
            })
            .catch((err) => console.log(err));
        }
      }
    }, 500);
  };

  const handleSearchProjects = (e) => {
    e.preventDefault();

    if (e.target.value) {
      if (localStorage.getItem("role") !== "Employee") {
        axios
          .get(`/myprojects/searchproject/${e.target.value}`, {
            params: { _id: JSON.parse(localStorage.getItem("user"))._id },
          })
          .then((records) => {
            // console.log(records.data);
            setProjects(records.data);
          })
          .catch((err) => console.log(err));
      }
    } else {
      fetchProjects().catch(console.error);
    }
  };

  const fetchProjects = async () => {
    if (localStorage.getItem("role") !== "Employee") {
      const res = await axios.get("/myProjects/organizationprojects", {
        params: { _id: JSON.parse(localStorage.getItem("user"))._id },
      });
      // console.log(res.data);
      setProjects(res.data);
    }
  };

  const fetchEmployees = async () => {
    // get the data from the api
    if (localStorage.getItem("role") !== "Employee") {
      const res = await axios.get("http://localhost:5000/emp/getmyemployees", {
        params: { _id: JSON.parse(localStorage.getItem("user"))._id },
      });
      setEmployees(res.data);
    }
  };

  useEffect(() => {
    fetchProjects().catch(console.error);
  }, []);

  // Get All My Employees
  useEffect(() => {
    // call the function
    fetchEmployees()
      // make sure to catch any error
      .catch(console.error);
  }, []);

  useEffect(() => {
    const startOfMonth = moment().startOf("month").format("DD/MM/YYYY hh:mm A");
    const endOfMonth = moment().endOf("month").format("DD/MM/YYYY hh:mm a");
    //   console.log(startOfMonth);
    //   console.log(endOfMonth);
    setDateRange(`${startOfMonth}-${endOfMonth}`);
  }, []);

  return (
    <div className="projectContainer">
      <div className="project-header">
        <div className="select-option-new-payroll">
          <Dropdown autoClose={"outside"}>
            <Dropdown.Toggle
              style={{ backgroundColor: "#1890ff" }}
              id="dropdown-basic"
            >
              {dateRange ? dateRange : "Time Range"}
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item onClick={() => handleDateRange("thismonth")}>
                This month
              </Dropdown.Item>
              <Dropdown.Item onClick={() => handleDateRange("lastmonth")}>
                Last Month
              </Dropdown.Item>
              <Dropdown.Item>
                <DatePicker
                  selectsRange={true}
                  startDate={startDate}
                  endDate={endDate}
                  placeholderText="Custom Range"
                  onChange={(update) => {
                    setCustomDateRange(update);
                  }}
                  isClearable={true}
                />
                <Button
                  style={{
                    backgroundColor: "#1890ff",
                    display: "block",
                    marginTop: "10px",
                  }}
                  onClick={() => handleApply(customDateRange)}
                >
                  Apply
                </Button>
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
        <div className="select-option-new-payroll">
          <Dropdown>
            <Dropdown.Toggle
              style={{ backgroundColor: "#1890ff" }}
              id="dropdown-basic"
            >
              Employees
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Form.Control
                type="search"
                placeholder="Search Employees"
                className="search-projects"
                aria-label="Search"
                onChange={handleSearchEmployees}
                style={{ boxShadow: "#da0d50 !important", fontSize: "14px" }}
              />
              {employees?.map((emp) => {
                return (
                  <>
                    {selectedEmployees?.find((se) => se._id === emp._id) ? (
                      <>
                        <Dropdown.Item
                          onClick={(e) => handleEmployeeClick(false, emp)}
                        >
                          {emp.username}
                          <Check />
                        </Dropdown.Item>
                      </>
                    ) : (
                      <Dropdown.Item
                        onClick={(e) => handleEmployeeClick(true, emp)}
                      >
                        {emp.username}
                      </Dropdown.Item>
                    )}
                  </>
                );
              })}
            </Dropdown.Menu>
          </Dropdown>
        </div>

        {/* <div className="select-option-new-payroll">
          <Dropdown>
            <Dropdown.Toggle
              style={{ backgroundColor: "#1890ff" }}
              id="dropdown-basic"
            >
              Projects
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Form.Control
                type="search"
                placeholder="Search Projects"
                className="search-projects"
                aria-label="Search"
                onChange={handleSearchProjects}
                style={{ boxShadow: "#da0d50 !important", fontSize: "14px" }}
              />
              {projects?.map((project) => {
                return (
                  <>
                    {selectedProjects?.find((se) => se._id === project._id) ? (
                      <>
                        <Dropdown.Item
                          onClick={() => handleProjectClick(false, project)}
                        >
                          {project.projectName}
                          <Check />
                        </Dropdown.Item>
                      </>
                    ) : (
                      <Dropdown.Item
                        onClick={() => handleProjectClick(true, project)}
                      >
                        {project.projectName}
                      </Dropdown.Item>
                    )}
                  </>
                );
              })}
            </Dropdown.Menu>
          </Dropdown>
        </div> */}
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
            {selectedEmployeesProject.length > 0 ? (
              <>
                {selectedEmployeesProject?.map((emp) => {
                  return (
                    <tr key={emp._id}>
                      <td>{emp.username}</td>
                      <td>{emp.totalTime}</td>
                      {/* <td> $ {emp.totalAmount}</td> */}
                    </tr>
                  );
                })}
              </>
            ) : (
              <>
                {selectedEmployees?.map((emp) => {
                  return (
                    <tr key={emp._id}>
                      <td>{emp.username}</td>
                      <td>{emp.totalTime}</td>
                      <td>$ {emp.totalAmount}</td>
                    </tr>
                  );
                })}
              </>
            )}
            {/* <tr>
              <td>Mark</td>
              <td>Otto</td>
              <td>@mdo</td>
            </tr> */}
          </tbody>
        </Table>
      </div>
      <div className="create-project" style={{ marginTop: "20px" }}>
        <Button
          style={{ backgroundColor: "#1890ff" }}
          onClick={handleCreatePayroll}
        >
          Create Payroll
        </Button>
        <Button
          variant="secondary mx-2"
          onClick={() => navigate("/allpayroll")}
        >
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default NewPayroll;
