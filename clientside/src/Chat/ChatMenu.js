import React, { useEffect, useState } from "react";
import { Button, Form, OverlayTrigger, Tooltip } from "react-bootstrap";
import Modal from "react-bootstrap/Modal";
import AddIcon from "@mui/icons-material/Add";
import "./chatmenu.css";
import axios from "axios";
import EmployeesTable from "../Projects/EmployeesTable";
const ChatMenu = ({ newConversation, user, handleSearchChange }) => {
  const [show, setShow] = useState(false);
  const [employees, setEmployees] = useState();

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const renderTooltip = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      Add Chat
    </Tooltip>
  );
  //   Get All Employees
  const fetchData = async () => {
    // get the data from the api
    const res = await axios.get(
      "http://localhost:5000/emp/getcompanyemployees",
      { params: { _id: user._id } }
    );
    //   console.log(res.data);
    var withoutMe = res.data.filter((emp) => emp._id != user._id);
    setEmployees(withoutMe);
  };
  useEffect(() => {
    // call the function
    fetchData()
      // make sure to catch any error
      .catch(console.error);
  }, []);

  const handleSearchEmployees = (e) => {
    setTimeout(() => {
      const value = e.target.value;
      if (value == null || value == "" || value == undefined) {
        // console.log("hello");
        fetchData();
      } else {
        axios
          .get(`/emp/getallusersbyname/${value}`, {
            params: { _id: user._id },
          })
          .then((rec) => {
            // console.log(rec.data);
            var withoutMe = rec.data.filter((emp) => emp._id != user._id);
            setEmployees(withoutMe);
          })
          .catch((err) => console.log(err));
      }
    }, 1000);
  };
  return (
    <div>
      <div className="px-4 pt-4">
        <div className="d-flex align-items-start">
          <div className="flex-grow-1">
            <h4 className="mb-4">Chats</h4>
          </div>
          <div className="flex-shrink-0">
            <div id="add-contact">
              <OverlayTrigger
                // target="add-contact"
                placement="bottom"
                delay={{ show: 250, hide: 300 }}
                overlay={renderTooltip}
              >
                <div className="plus-button" onClick={handleShow}>
                  <AddIcon className="btn btn-soft-primary btn-sm" />
                </div>
                {/* <button
                  type="button"
                  onClick={handleShow}
                  className="btn btn-soft-primary btn-sm plus-button-check"
                >
                  <AddIcon />
                </button> */}
              </OverlayTrigger>
            </div>
          </div>
        </div>
        <Form>
          <div className="input-group mb-3 chat-menu-search-bar">
            <input
              type="text"
              //   className="form-control bg-light border-0 pe-0 chat-search"
              className="form-control bg-light border-0 pe-0"
              placeholder="Search Conversations.."
              aria-label="Example text with button addon"
              aria-describedby="searchbtn-addon"
              onChange={handleSearchChange}
            />
          </div>
        </Form>
      </div>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Chat</Modal.Title>
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
            newConversation={newConversation}
          />
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default ChatMenu;
