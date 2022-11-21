import axios from "axios";
import React, { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import EmployeesTable from "../../Projects/EmployeesTable";
import { useParams } from "react-router-dom";
import { Form } from "react-bootstrap";
const AssignTaskModal = ({
  show,
  handleClose,
  setShowModal,
  card,
  boardId,
  updateCard,
}) => {
  const [employees, setEmployees] = useState();
  const [values, setValues] = useState({
    ...card,
  });
  const { bid } = useParams();

  const assignTask = (emp) => {
    setValues({
      ...values,
      assignedTo: emp._id,
    });
    updateCard(boardId, values._id, {
      ...values,
      assignedTo: emp._id,
    });
  };

  const handleSearchEmployees = (e) => {
    setTimeout(() => {
      const value = e.target.value;
      if (value === null || value === "" || value === undefined) {
        // console.log("hello");
        fetchData();
      } else {
        const user = JSON.parse(localStorage.getItem("user"));
        if (localStorage.getItem("role") === "Employee") {
          axios
            .get(`/emp/getallusersbyname/${value}`, {
              params: { _id: user._id },
            })
            .then((rec) => {
              // console.log(rec.data);
              var withoutMe = rec.data.filter((emp) => emp._id !== user._id);
              setEmployees(withoutMe);
            })
            .catch((err) => console.log(err));
        } else {
          axios
            .get(`/emp/getallmyusersbyname/${value}`, {
              params: { _id: user._id },
            })
            .then((rec) => {
              // console.log(rec.data);
              var withoutMe = rec.data.filter((emp) => emp._id !== user._id);
              setEmployees(withoutMe);
            })
            .catch((err) => console.log(err));
        }
      }
    }, 1000);
  };

  const fetchData = async () => {
    // get the data from the api
    const user = JSON.parse(localStorage.getItem("user"));
    if (localStorage.getItem("role") === "Employee") {
      const res = await axios.get(
        "http://localhost:5000/emp/getcompanyemployees",
        { params: { _id: user._id } }
      );
      //   console.log(res.data);
      const response = await axios.get("http://localhost:5000/emp/getmyadmin", {
        params: { _id: JSON.parse(localStorage.getItem("user"))._id },
      });
      var withoutMe = res.data.filter((emp) => emp._id !== user._id);
      setEmployees([...withoutMe, response.data[0]]);
    } else {
      const res = await axios.get("http://localhost:5000/emp/getmyemployees", {
        params: { _id: JSON.parse(localStorage.getItem("user"))._id },
      });
      var withoutMe = res.data.filter((emp) => emp._id !== user._id);
      setEmployees(withoutMe);
    }
  };
  useEffect(() => {
    // call the function
    fetchData()
      // make sure to catch any error
      .catch(console.error);
  }, []);

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Add Assignee</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <div className="input-group mb-3 chat-menu-search-bar">
            <input
              type="text"
              //   className="form-control bg-light border-0 pe-0 chat-search"
              className="form-control bg-light border-0 pe-0"
              placeholder="Search Employee.."
              aria-label="Example text with button addon"
              aria-describedby="searchbtn-addon"
              onChange={handleSearchEmployees}
            />
          </div>
        </Form>
        <EmployeesTable
          employees={employees}
          fetchData={fetchData}
          handleClosee={handleClose}
          assignTask={assignTask}
        />
      </Modal.Body>
    </Modal>
  );
};

export default AssignTaskModal;
